/**
 * 微信小程序下TCP长连接使用websocket实现
 */
if(CC_WECHATGAME)
{
    cc.Class({
        extends: cc.Component,
        statics:
            {
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
                        // cc.wwx.OutPut.warn('TCP webSocket.hasOpened...:' + url);
                        return;
                    }
                    if (this.isConnecting) {
                        // cc.wwx.OutPut.warn('TCP webSocket.isConnecting...:' + url);
                        return;
                    }
                    cc.wwx.OutPut.info('TCP webSocket connect...:' + url);
                    var self = this;

                    //TCP连接开始打点
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeTCP_Start);
                    wx.connectSocket({
                        url: url,
                        success: function(params) {
                            self.isConnecting = true;
                            cc.wwx.OutPut.info('wx.connectSocket.success...:' + JSON.stringify(params));
                        },
                        fail: function(params) {
                            cc.wwx.OutPut.err('wx.connectSocket.fail:' + self.hasOpened + '|' + JSON.stringify(params));
                            self.isConnecting = false;
                        },
                        complete: function(params) {

                        }
                    });
                    this.startTimerForHeartBeat();

                    wx.onSocketOpen(function(res) {
                        cc.wwx.OutPut.info('tcp opened');
                        //TCP连接成功打点
                        cc.wwx.BiLog.clickStat(cc.wwx.EventType.clickStatEventTypeTCP_Success);
                        self.opened = true;
                        self.isConnecting = false;
                        self.hasOpened = true;
                        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_TCP_OPEN);
                    });

                    wx.onSocketError(function(res) {
                        if (!self.hasOpened) {
                            self.tcpErrCount++;
                            if (self.tcpErrCount % 3 == 1) { // 大概每6秒上传一次
                                // var msg = cc.wwx.OutPut.getLogForServer();
                                cc.wwx.BiLog.uploadLogTimely('【loginErr.wsErr】' + {});  // 上传错误日志
                            }
                        }
                        //TCP连接失败打点
                        cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeTCP_Failed);
                        self.opened = false;
                        self.isConnecting = false;
                        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_TCP_ERROR);
                    });

                    wx.onSocketMessage(function(res) {
                        // 处理长连接的消息
                        // cc.log('TCP receive MSG:' + JSON.stringify(res));
                        var content = self._decodeMessage(res.data);

                        if (content == null || content == '0000') {
                            // cc.wwx.OutPut.log('get heart beat!');
                            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_SERVER_MESSAGE, {});
                            return;
                        }
                        var strJson = content.substr(0, content.length - 0);
                        if (strJson != null && strJson.length > 0) {
                            var _json = JSON.parse(strJson);

                            if (!isReceiveIgnored(_json)) {
                                var strLog = unescape(content.replace(/\\u/gi,'%u'));
                                cc.wwx.OutPut.info("[receive msg]: " + strLog);
                            } else {
                                // var strLog = unescape(content.replace(/\\u/gi,'%u'));
                                // cc.wwx.OutPut.log("[receive msg]: " + strLog);
                            }

                            _json.result = _json.result || {};
                            // cc.wwx.OutPut.info("[receive msg]: cmd = " + _json.cmd + ' action = ' + (_json.result.action || ''));
                            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_SERVER_MESSAGE, _json);
                        }
                    });

                    wx.onSocketClose(function(res) {
                        cc.wwx.OutPut.warn('TCP webSocket close...');
                        self.opened = false;
                        self.isConnecting = false;
                        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_TCP_CLOSE);
                    });
                },

                /**
                 * 后台关闭TCP
                 */
                pause: function() {
                    cc.wwx.OutPut.warn('TCP pause');
                    if (this.opened) {
                        this.forcedInterrupt();
                        this.stopTimerForHeartBeat();
                    }
                },

                /**
                 * 前台重新连接TCP
                 */
                resume: function() {
                    cc.wwx.OutPut.warn('TCP resume');
                    this.forcedInterrupt();
                    if (cc.wwx.SystemInfo.webSocketUrl && cc.wwx.SystemInfo.webSocketUrl != '') {
                        this.connect(cc.wwx.SystemInfo.webSocketUrl);
                    } else {
                        cc.wwx.SDK.login();
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
                                cc.wwx.OutPut.log('wx.closeSocket.success');
                            },
                            'fail': function(res){
                                cc.wwx.OutPut.log('wx.closeSocket.fail:' + JSON.stringify(res));
                            }
                        });
                    } catch (e) {
                        cc.wwx.OutPut.warn('forcedInterrupt.err');
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
                                cc.wwx.OutPut.info('[send msg success]:', msg);
                            } else {
                                // cc.wwx.OutPut.log('[send msg success]:', msg);
                            }
                        },

                        fail: function(params) {
                            if (!isSendIgnored(jsonData)) {
                                cc.wwx.OutPut.warn('[send msg fail]:', msg, JSON.stringify(params));
                            } else {
                                // cc.wwx.OutPut.log('[send msg fail]:', msg, JSON.stringify(params));
                            }
                            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_TCP_SEND_ERROR);
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
                    // cc.wwx.OutPut.log('updateHeartBeat:', this.opened);
                    if (!this.opened) {
                        this.errCount++;
                        if (this.errCount > this.MaxErrCount) {
                            this.forcedInterrupt();
                            this.stopTimerForHeartBeat();
                            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_TCP_ERROR_COUNT_MAX);
                        } else {
                            this.connect(cc.wwx.SystemInfo.webSocketUrl);
                        }
                        if (!this.hasOpened) {
                            cc.wwx.OutPut.err('websocketErr.updateHeartBeat');
                        }
                        return;
                    }
                    this.errCount = 0;
                    var cmd = {
                        'cmd': 'heart_beat',
                        'params': {
                            'deviceId': cc.wwx.SystemInfo.deviceId,
                            'userId': cc.wwx.UserInfo.userId,
                            'gameId': cc.wwx.UserInfo.appId,
                            'clientId': cc.wwx.UserInfo.clientId
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
                    var data = cc.wwx.EncodeDecode.base64decode(data);
                    var mask = data.slice(0, 4);
                    data = data.slice(4);
                    for (var i = 0, len = data.length; i < len; i++) {
                        var charcode = data[i];
                        charcode ^= mask[i % 4];
                        data[i] = charcode;
                    }
                    var result = cc.wwx.EncodeDecode.utf8Decode(data);
                    return result;
                },
            }

    });

}
else
{
    cc.Class({
        extends:cc.Component,
        statics:{
            ws : null,
            opened : false,
            beatHandleId : null,
            /**
             * 初始化websocket
             */
            connect: function (wsUrl) {
                cc.wwx.OutPut.log('tcp connect:', wsUrl);
                let self = this;

                if (this.opened) return;

                let ws = new WebSocket(wsUrl);
                ws.onopen = function (event) {
                    cc.wwx.OutPut.info('tcp opened2');
                    self.opened = true;
                    //定时发送心跳
                    if (self.beatHandleId != null) {
                        clearInterval(self.beatHandleId);
                    }
                    self.beatHandleId = setInterval(function(){
                        self.updateHeartBeat();
                    }, 2 * 1000);
                    cc.wwx.NotificationCenter.trigger(cc.wwx.clickStatEventType.MSG_TCP_OPEN);
                }
                ws.onmessage = function (event) {
                    // 处理长连接的消息
                    if (!event.data) return;
                    var content = self._decodeMessage(event.data);

                    if (content == null || content == '0000') {
                        // cc.wwx.OutPut.log('get heart beat!');
                        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_SERVER_MESSAGE, {});
                        return;
                    }
                    var strJson = content.substr(0, content.length - 0);
                    if (strJson != null && strJson.length > 0) {
                        var _json = JSON.parse(strJson);
                        if (!isReceiveIgnored(_json)) {
                            var strLog = unescape(content.replace(/\\u/gi,'%u'));
                            cc.wwx.OutPut.info("[receive msg]: " + strLog);
                        } else {
                            // var strLog = unescape(content.replace(/\\u/gi,'%u'));
                            // cc.wwx.OutPut.log("[receive msg]: " + strLog);
                        }
                        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_SERVER_MESSAGE, _json);
                    }
                }
                ws.onerror = function (event) {
                    cc.wwx.OutPut.warn("ws error:" + JSON.stringify(event));
                    self.opened = false;
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_TCP_ERROR);
                }
                ws.onclose = function (event) {
                    cc.wwx.OutPut.warn("ws closed:" + JSON.stringify(event));
                    self.opened = false;

                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_TCP_CLOSE);
                }

                self.ws = ws;
            },

            /**
             * 后台关闭TCP
             */
            pause: function() {
                cc.wwx.OutPut.warn('TCP pause');
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
                cc.wwx.OutPut.warn('TCP resume');
                if (cc.wwx.SystemInfo.webSocketUrl && cc.wwx.SystemInfo.webSocketUrl != '' && !this.opened) {
                    this.connect(cc.wwx.SystemInfo.webSocketUrl);
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
                if (!this.opened)
                    return;
                var msg = JSON.stringify(jsonData);

                if (!isSendIgnored(jsonData)) {
                    cc.wwx.OutPut.info("[send msg]: " + msg);
                }

                this.ws.send(msg);
            },

            updateHeartBeat: function () {
                // cc.wwx.OutPut.log('updateHeartBeat:', this.opened);
                if (!this.opened) {
                    delete this.ws;
                    this.connect(cc.wwx.SystemInfo.webSocketUrl);
                    return;
                }
                var cmd = {
                    'cmd': 'heart_beat',
                    'params': {
                        'deviceId': cc.wwx.UserInfo.deviceId,
                        'userId': cc.wwx.UserInfo.userId,
                        'gameId': cc.wwx.UserInfo.appId,
                        'clientId': cc.wwx.UserInfo.clientId
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
                var data = cc.wwx.EncodeDecode.base64Decode(data);
                var mask = data.slice(0, 4);
                data = data.slice(4);
                for (var i = 0, len = data.length; i < len; i++) {
                    var charcode = data[i];
                    charcode ^= mask[i % 4];
                    data[i] = charcode;
                }
                var result = cc.wwx.EncodeDecode.utf8Decode(data);
                return result;
            },

        }
    })
}

