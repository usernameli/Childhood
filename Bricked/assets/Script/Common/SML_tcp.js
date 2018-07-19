var ignoreProtocols = [
    {cmd : 'led', action : null},
    {cmd : 'room_online_info', action : null},
    {cmd : 'game_clientId', action : null},
    {cmd : 'game_pricelist', action : null},
    {cmd : 'game_config', action : null},
    {cmd : 'heart_beat', action : null},
    {cmd : 'module_tip', action : null},
    {cmd : 'game_vipclientId', action : null},
    {cmd : 'game_pricelist', action : null},
    {cmd : 'dizhu', action : 'room_online_users'},
    // {cmd : 'm_des', action : null},
    // {cmd : 'hall_info', action : null},
    // {cmd : 'hall_share3', action : null},
    // {cmd : 'user_info', action : null},
    // {cmd : 'game_data', action : null},
]

var isSendIgnored = function(_json) {
    var ignore = false;
    ignoreProtocols.forEach(function(row) {
        if (_json.cmd == row.cmd && (!row.action || row.action == _json.params.action)) {
            ignore = true;
        }
    })

    return ignore;
}

var isReceiveIgnored = function(_json) {
    var ignore = false;
    ignoreProtocols.forEach(function(row) {
        if (_json.cmd == row.cmd && (!row.action || row.action == _json.result.action)) {
            ignore = true;
        }
    })

    return ignore;
}

if (CC_WECHATGAME) {
    SML.TCP = {
        ws : null,
        opened : false,
        isConnecting : false,
        hasOpened: false,
        errCount: 0,        // 心跳计数
        MaxErrCount: 5,     // 最大心跳失败次数，失败之后中断心跳抛出去处理
        beatHandleId : null,

        tcpErrCount: 0,     // tcp首次成功之前，失败次数计数
        /**
         * 初始化websocket
         */
        connect: function(url){
            if (this.opened) {
                // SML.Output.warn('TCP webSocket.hasOpened...:' + url);
                return;
            }
            if (this.isConnecting) {
                // SML.Output.warn('TCP webSocket.isConnecting...:' + url);
                return;
            }
            SML.Output.info('TCP webSocket connect...:' + url);
            var self = this;

            //TCP连接开始打点
            SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeTCP_Start);
            wx.connectSocket({
                url: url,
                success: function(params) {
                    self.isConnecting = true;
                    SML.Output.info('wx.connectSocket.success...:' + JSON.stringify(params));
                },
                fail: function(params) {
                    SML.Output.err('wx.connectSocket.fail:' + self.hasOpened + '|' + JSON.stringify(params));
                    self.isConnecting = false;
                },
                complete: function(params) {

                }
            });
            this.startTimerForHeartBeat();

            wx.onSocketOpen(function(res) {
                SML.Output.info('tcp opened');
                //TCP连接成功打点
                SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeTCP_Success);
                self.opened = true;
                self.isConnecting = false;
                self.hasOpened = true;
                SML.Notify.trigger(SML.Event.MSG_TCP_OPEN);
            });

            wx.onSocketError(function(res) {
                if (!self.hasOpened) {
                    self.tcpErrCount++;
                    if (self.tcpErrCount % 3 == 1) { // 大概每6秒上传一次
                        var msg = SML.Output.getLogForServer();
                        SML.BiLog.uploadLogTimely('【loginErr.wsErr】' + msg);  // 上传错误日志
                    }
                }
                //TCP连接失败打点
                SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeTCP_Failed);
                self.opened = false;
                self.isConnecting = false;
                SML.Notify.trigger(SML.Event.MSG_TCP_ERROR);
            });

            wx.onSocketMessage(function(res) {
                // 处理长连接的消息
                // cc.log('TCP receive MSG:' + JSON.stringify(res));
                var content = self._decodeMessage(res.data);

                if (content == null || content == '0000') {
                    // SML.Output.log('get heart beat!');
                    SML.Notify.trigger(SML.Event.MSG_SERVER_MESSAGE, {});
                    return;
                }
                var strJson = content.substr(0, content.length - 0);
                if (strJson != null && strJson.length > 0) {
                    var _json = JSON.parse(strJson);

                    if (!isReceiveIgnored(_json)) {
                        var strLog = unescape(content.replace(/\\u/gi,'%u'));
                        SML.Output.info("[receive msg]: " + strLog);
                    } else {
                        // var strLog = unescape(content.replace(/\\u/gi,'%u'));
                        // SML.Output.log("[receive msg]: " + strLog);
                    }

                    _json.result = _json.result || {};
                    // SML.Output.info("[receive msg]: cmd = " + _json.cmd + ' action = ' + (_json.result.action || ''));
                    SML.Notify.trigger(SML.Event.MSG_SERVER_MESSAGE, _json);
                }
            });

            wx.onSocketClose(function(res) {
                SML.Output.warn('TCP webSocket close...');
                self.opened = false;
                self.isConnecting = false;
                SML.Notify.trigger(SML.Event.MSG_TCP_CLOSE);
            });
        },

        /**
         * 后台关闭TCP
         */
        pause: function() {
            SML.Output.warn('TCP pause');
            if (this.opened) {
                this.forcedInterrupt();
                this.stopTimerForHeartBeat();
            }
        },

        /**
         * 前台重新连接TCP
         */
        resume: function() {
            SML.Output.warn('TCP resume');
            this.forcedInterrupt();
            if (SML.GameData.wsUrl && SML.GameData.wsUrl != '') {
                this.connect(SML.GameData.wsUrl);
            } else {
                SML.SDK.login();
            }
        },

        /**
         * 强制中断
         */
        forcedInterrupt:function () {
            this.opened = false;
            this.isConnecting = false;
            try {
                wx.closeSocket({
                    'code': 1000,
                    'reason': '关闭上一个不用Task',
                    'success': function(){
                        SML.Output.log('wx.closeSocket.success');
                    },
                    'fail': function(res){
                        SML.Output.log('wx.closeSocket.fail:' + JSON.stringify(res));
                    }
                });
            } catch (e) {
                SML.Output.warn('forcedInterrupt.err');
            }
        },

        /**
         * 发送数据
         * @param {json} jsonData
         */
        send: function (jsonData) {
            var self = this;
            if (!self.opened) {return;}
            var msg = JSON.stringify(jsonData);
            wx.sendSocketMessage({
                data:msg,
                success: function(params){
                    if (!isSendIgnored(jsonData)) {
                        SML.Output.info('[send msg success]:', msg);
                    } else {
                        // SML.Output.log('[send msg success]:', msg);
                    }
                },

                fail: function(params) {
                    if (!isSendIgnored(jsonData)) {
                        SML.Output.warn('[send msg fail]:', msg, JSON.stringify(params));
                    } else {
                        // SML.Output.log('[send msg fail]:', msg, JSON.stringify(params));
                    }
                    SML.Notify.trigger(SML.Event.MSG_TCP_SEND_ERROR);
                },
                complete: function(params) {
                }
            });
        },

        // 定时发送心跳
        startTimerForHeartBeat () {
            if (this.beatHandleId != null) {
                clearInterval(this.beatHandleId);
                this.beatHandleId = null;
            }
            this.beatHandleId = setInterval(function(){
                this.updateHeartBeat();
            }.bind(this), 2 * 1000);
        },
        // 取消定时发送心跳
        stopTimerForHeartBeat () {
            if (this.beatHandleId != null) {
                clearInterval(this.beatHandleId);
                this.beatHandleId = null;
            }
        },

        updateHeartBeat: function () {
            // SML.Output.log('updateHeartBeat:', this.opened);
            if (!this.opened) {
                this.errCount++;
                if (this.errCount > this.MaxErrCount) {
                    this.forcedInterrupt();
                    this.stopTimerForHeartBeat();
                    SML.Notify.trigger(SML.Event.MSG_TCP_ERROR_COUNT_MAX);
                } else {
                    this.connect(SML.GameData.wsUrl);
                }
                if (!this.hasOpened) {
                    SML.Output.err('websocketErr.updateHeartBeat');
                }
                return;
            }
            this.errCount = 0;
            var cmd = {
                'cmd': 'heart_beat',
                'params': {
                    'deviceId': SML.GameData.deviceId,
                    'userId': SML.UserInfo.userId,
                    'gameId': SML.GameData.appId,
                    'clientId': SML.GameData.clientId
                }
            };
            this.send(cmd);
        },

        _decodeMessage: function(data) {
            if (typeof ArrayBuffer != 'undefined' && data instanceof ArrayBuffer) {
                var databytes = new Uint8Array(data);
                var content = ''
                for (var i = 0, len = databytes.length; i < len; i++) {
                    var tmpc = String.fromCharCode(databytes[i]);
                    content += tmpc;
                }
                return content
            }
            var data = SML.Utils.base64decodeRaw(data);
            var mask = data.slice(0, 4);
            data = data.slice(4);
            for (var i = 0, len = data.length; i < len; i++) {
                var charcode = data[i];
                charcode ^= mask[i % 4];
                data[i] = charcode;
            }
            var result = SML.Utils.utf8Decode(data);
            return result;
        },
    };
} else {
    SML.TCP = {
        ws : null,
        opened : false,
        beatHandleId : null,
        /**
         * 初始化websocket
         */
        connect: function (wsUrl) {
            SML.Output.log('tcp connect:', wsUrl);
            let self = this;

            if (this.opened) return;

            let ws = new WebSocket(wsUrl);
            ws.onopen = function (event) {
                SML.Output.info('tcp opened2');
                self.opened = true;
                //定时发送心跳
                if (self.beatHandleId != null) {
                    clearInterval(self.beatHandleId);
                }
                self.beatHandleId = setInterval(function(){
                    self.updateHeartBeat();
                }, 2 * 1000);
                SML.Notify.trigger(SML.Event.MSG_TCP_OPEN);
            }
            ws.onmessage = function (event) {
                // 处理长连接的消息
                if (!event.data) return;
                var content = self._decodeMessage(event.data);

                if (content == null || content == '0000') {
                    // SML.Output.log('get heart beat!');
                    SML.Notify.trigger(SML.Event.MSG_SERVER_MESSAGE, {});
                    return;
                }
                var strJson = content.substr(0, content.length - 0);
                if (strJson != null && strJson.length > 0) {
                    var _json = JSON.parse(strJson);
                    if (!isReceiveIgnored(_json)) {
                        var strLog = unescape(content.replace(/\\u/gi,'%u'));
                        SML.Output.info("[receive msg]: " + strLog);
                    } else {
                        // var strLog = unescape(content.replace(/\\u/gi,'%u'));
                        // SML.Output.log("[receive msg]: " + strLog);
                    }
                    SML.Notify.trigger(SML.Event.MSG_SERVER_MESSAGE, _json);
                }
            }
            ws.onerror = function (event) {
                SML.Output.warn("ws error:" + JSON.stringify(event));
                self.opened = false;
                SML.Notify.trigger(SML.Event.MSG_TCP_ERROR);
            }
            ws.onclose = function (event) {
                SML.Output.warn("ws closed:" + JSON.stringify(event));
                self.opened = false;

                SML.Notify.trigger(SML.Event.MSG_TCP_CLOSE);
            }

            self.ws = ws;
        },

        /**
         * 后台关闭TCP
         */
        pause: function() {
            SML.Output.warn('TCP pause');
            //定时发送心跳取消
            if (this.beatHandleId != null) {
                clearInterval(this.beatHandleId);
                this.beatHandleId = null;
            }
            if (this.opened) {
                this.ws.close();
                this.opened = false;
            }
        },

        /**
         * 前台重新连接TCP
         */
        resume: function() {
            SML.Output.warn('TCP resume');
            if (SML.GameData.wsUrl && SML.GameData.wsUrl != '' && !this.opened) {
                this.connect(SML.GameData.wsUrl);
                var self = this;
                this.beatHandleId = setInterval(function(){
                    self.updateHeartBeat();
                }, 2 * 1000);
            }
        },

        /**
         * 发送数据
         * @param {json} jsonData
         */
        send: function (jsonData) {
            if (!this.opened) return;
            var msg = JSON.stringify(jsonData);

            if (!isSendIgnored(jsonData)) {
                SML.Output.info("[send msg]: " + msg);
            }

            this.ws.send(msg);
        },

        updateHeartBeat: function () {
            // SML.Output.log('updateHeartBeat:', this.opened);
            if (!this.opened) {
                delete this.ws;
                this.connect(SML.GameData.wsUrl);
                return;
            }
            var cmd = {
                'cmd': 'heart_beat',
                'params': {
                    'deviceId': SML.GameData.deviceId,
                    'userId': SML.UserInfo.userId,
                    'gameId': SML.GameData.appId,
                    'clientId': SML.GameData.clientId
                }
            };
            this.send(cmd);
        },

        _decodeMessage: function(data) {
            if (typeof ArrayBuffer != 'undefined' && data instanceof ArrayBuffer) {
                var databytes = new Uint8Array(data);
                var content = ''
                for (var i = 0, len = databytes.length; i < len; i++) {
                    var tmpc = String.fromCharCode(databytes[i]);
                    content += tmpc;
                }
                return content
            }
            var data = SML.Utils.base64decodeRaw(data);
            var mask = data.slice(0, 4);
            data = data.slice(4);
            for (var i = 0, len = data.length; i < len; i++) {
                var charcode = data[i];
                charcode ^= mask[i % 4];
                data[i] = charcode;
            }
            var result = SML.Utils.utf8Decode(data);
            return result;
        },
    };
}
