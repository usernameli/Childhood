cc.Class({
    extends:cc.Component,
    statics:{
        _map: {},          // 保存注册的协议回调
        _dizhuMap: {},     // cmd:dizhu协议根据action注册回调
        tmpMsgs:[],        // 保存最后协议数据
        tmpMaxCount: 100,  // 保存最后50条数据条数
        notNeedCmds: ['led', 'game_config', 'room_online_info', 'module_tip', 'game_vipclientId',
            'game_clientId', 'game_pricelist'], // 过滤掉不处理的协议cmd
        init()
        {
            /**
             * tcp消息，不要再注册。
             */
            cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TCP_OPEN, this._onMsgTcpOpen, this);
            cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TCP_ERROR, this._onMsgTCPErr, this);
            cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TCP_CLOSE, this._onMsgTCPErr, this);
            cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TCP_SEND_ERROR, this._onMsgTCPErr, this);
            cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TCP_ERROR_COUNT_MAX, this._onMsgTCPErrCountMax, this);
            cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_SERVER_MESSAGE, this._onMsgServerMessage, this);
            this.register(cc.wwx.EventType.CMD_USER_INFO, this._onMsgUserInfo);
            this.register(cc.wwx.EventType.CMD_UPDATE_NOTIFY, this._onMsgUpdateNotify);
            this.register(cc.wwx.EventType.CMD_PAYMENT_LIST, this._onPayment);
            this.register(cc.wwx.EventType.CMD_PAYMENT_EXCHANGE, this._onPaymentExchange);
            this.register(cc.wwx.EventType.CMD_PRODUCT_DELIVERY, this._onPaymentNotify);

        },
        _onPayment (params) {
            var result = params['result'];
            var action = result['action'];

            if (action == cc.wwx.EventType.ACTION_PAYMENT_LIST_UPDATE) {
                cc.wwx.PayModel.parseInfo(result);
            }
        },

        _onPaymentExchange (params) {
            var result = params['result'];
            var action = result['action'];

            if (action == ty.Event.ACTION_PAYMENT_EXCHANGE_BUY) {
                cc.wwx.PayModel.parseExchange(result);
            }
        },

        _onPaymentNotify (params) {
            var result = params['result'];

            if (result.info.indexOf('成功') >= 0) {
                if (result.prodName.indexOf('钻石') >= 0) {
                    cc.wwx.TipManager.showMsg(`购买成功!`);
                } else {
                    cc.wwx.TipManager.showMsg(`兑换成功!`);
                }
            }
        },
        /**
         * 通知更新数据：用户信息
         * @private
         */
        _onMsgUpdateNotify(params) {
            var result = params.result;
            var changes = result['changes'] || [];
            for (var i = 0; i < changes.length; i++) {
                if (changes[i] == "udata") {
                    cc.wwx.TCPMSG.getUserInfo();
                } else if (changes[i] == "item") {
                    cc.wwx.TCPMSG.getBagInfo();
                }
            }
        },
        _onMsgUserInfo(params)
        {
            var result = params.result;
            cc.wwx.UserInfo.parse(result);
            cc.wwx.TipManager.showMsg("获取用户信息成功");

            if (parseInt(result.gameId) === cc.wwx.SystemInfo.appId) {
                this.finishLogin();
            }

        },
        finishLogin()
        {
            if (this.loginSuccess) { // 重连
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_RECONNECT);
            } else { // 登录
                this.loginSuccess = true;

            }


            // 获取背包
            cc.wwx.TCPMSG.getBagInfo();
            cc.wwx.TCPMSG.fetchPaymentList();

            // 分享发奖
            // ddz.Share.getShareRewards();
        },
        // 注册cmd回调
        register: function(eventName, func) {
            this._map[eventName] = func;
        },
        _onMsgTCPErrCountMax() {
            // Output.err('TCPErrCountMax');
            // SDK.login();
            // ddz.ConnectManager.hideWifiView();
            cc.wwx.PopWindowManager.showWifiView();

            // ddz.TipManager.showMsg('网络中断，正在尝试重新登录！', 5);
        },
        _onMsgTCPErr() {
            // cc.wwx.PopWindowManager.showWifiView();
            cc.wwx.PopWindowManager.showWifiView();

        },
        _onMsgServerMessage(params)
        {
            params = params || {};
            var cmd = params.cmd;

            if (cmd) {
                // ddz.ConnectManager.hideWifiView();
                // 过滤掉不要的协议
                if (this.notNeedCmds.contains(cmd)) {
                    return;
                }
                cc.wwx.OutPut.info("[_onMsgServerMessage msg]: " + JSON.stringify(params));

                /**
                 * 协议数据优先处理
                 */
                var func = this._map[cmd];
                if (typeof func == 'function') {
                    func.call(this, params);
                }

                // 过滤牌桌协议
                // if (!ddz.TableMsgManager.filterMsg(params)) {
                // }

                // 缓存最后100条协议
                this.tmpMsgs.push(params);
                if (this.tmpMsgs.length > this.tmpMaxCount) {
                    this.tmpMsgs.shift();
                }
            }
        },

        _onMsgTcpOpen () {
            // cc.wwx.BiLog.record_game_progress('TCPOpened');
            cc.wwx.TCPMSG.bindUser();
        },

    }
});