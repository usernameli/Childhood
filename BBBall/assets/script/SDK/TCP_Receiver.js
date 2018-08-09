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
            this.register(cc.wwx.EventType.CMD_BAG, this._onMsgBag);
            this.register(cc.wwx.EventType.CMD_GAME_DATA, this._onMsgGameData);
            this.register(cc.wwx.EventType.MSG_DAILY_CHECKIN_STATUS, this._onMsgDailyCheckinStatus);
            this.register(cc.wwx.EventType.MSG_BALL_DAILY_CHECKIN, this._onMsgBallDailyCheckin);
            this.register(cc.wwx.EventType.CMD_TODO_TASKS, this._todoTask);

        },
        _todoTask(params)
        {
            //{"cmd":"todo_tasks","result":{"gameId":101,"userId":60008,"tasks":[{"action":"get_reward","params":{"reward":[{"item":"1012","count":1}]}}]}}
            let tasks = params['result']['tasks'];
            for(let taskIndex = 0; taskIndex < tasks.length;taskIndex++)
            {
                if(tasks[taskIndex]['action'] === 'get_reward')
                {
                    cc.wwx.PopWindowManager.popWindow("prefab/CongratulationsWindow","CongratulationsWindow",tasks[taskIndex]['params']);

                }
            }


        },
        _onMsgBallDailyCheckin(params)
        {
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN,params);

        },
        //签到数据返回
        _onMsgDailyCheckinStatus(params)
        {
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN_STATUS,params);
        },
        _onMsgBag(params)
        {
            var result = params['result'];
            cc.wwx.UserInfo.parseBag(result);
        },
        _onPayment (params) {
            var result = params['result'];
            var action = result['action'];

            if (action == cc.wwx.EventType.ACTION_PAYMENT_LIST_UPDATE) {
                cc.wwx.PayModel.parseInfo(result);
            }
        },
        /**
         * 绑定插件
         * @param {"cmd":"game_data","result":{"gameId":101,"userId":60008,"gdata":{"levelLv":1,"levelScore":"[0]","levelStar":"[0]","levelTotalStar":0,"classicScore":0,"classicCup":0,"100ballScore":0,"chip":0,"headUrl":""}}}
         * @private
         */
        _onMsgGameData (params) {
            // ty.Output.log(JSON.stringify(params));
            var result = params['result'];
            if (result.gameId === cc.wwx.SystemInfo.gameId) {
                cc.wwx.UserInfo.gdata = result["gdata"];

                cc.wwx.SceneManager.switchScene("GameHall");

            }
        },

        _onPaymentExchange (params) {
            var result = params['result'];
            var action = result['action'];

            if (action == cc.wwx.EventType.ACTION_PAYMENT_EXCHANGE_BUY) {
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
                if (changes[i] === "udata" || changes[i] === "gdata") {
                    cc.wwx.TCPMSG.getUserInfo();
                } else if (changes[i] === "item") {
                    cc.wwx.TCPMSG.getBagInfo();
                }
            }
        },
        _onMsgUserInfo(params)
        {
            var result = params.result;
            cc.wwx.UserInfo.parseUdata(result);

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
            cc.wwx.Share.getShareRewards();

            //绑定游戏
            cc.wwx.TCPMSG.bindGame(cc.wwx.SystemInfo.gameId);
        },
        // 注册cmd回调
        register: function(eventName, func) {
            this._map[eventName] = func;
        },
        _onMsgTCPErrCountMax() {
            // Output.err('TCPErrCountMax');
            // SDK.login();
            cc.wwx.PopWindowManager.showWifiView("connecting_wifi");

        },
        _onMsgTCPErr() {
            // cc.wwx.PopWindowManager.showWifiView();
            cc.wwx.PopWindowManager.showWifiView("connecting_wifi");
            // cc.wwx.TipManager.showMsg('网络中断，正在尝试重新登录！', 5);


        },
        _onMsgServerMessage(params)
        {
            params = params || {};
            var cmd = params.cmd;

            if (cmd) {
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
                // if (!wwx.TableMsgManager.filterMsg(params)) {
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