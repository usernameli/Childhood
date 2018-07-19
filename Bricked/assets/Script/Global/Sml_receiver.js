

SML.Receiver = {
    _map: {},          // 保存注册的协议回调
    _dizhuMap: {},     // cmd:dizhu协议根据action注册回调
    tmpMsgs:[],        // 保存最后协议数据
    tmpMaxCount: 100,  // 保存最后50条数据条数
    notNeedCmds: ['led', 'game_config', 'room_online_info', 'module_tip', 'game_vipclientId',
                  'game_clientId', 'game_pricelist'], // 过滤掉不处理的协议cmd
    init: function() {
        //================================================
        /**
         * tcp消息，不要再注册。
         */
        SML.Notify.listen(SML.Event.MSG_TCP_OPEN, this._onMsgTcpOpen, this);
        SML.Notify.listen(SML.Event.MSG_TCP_ERROR, this._onMsgTCPErr, this);
        SML.Notify.listen(SML.Event.MSG_TCP_CLOSE, this._onMsgTCPErr, this);
        SML.Notify.listen(SML.Event.MSG_TCP_SEND_ERROR, this._onMsgTCPErr, this);
        SML.Notify.listen(SML.Event.MSG_TCP_ERROR_COUNT_MAX, this._onMsgTCPErrCountMax, this);
        SML.Notify.listen(SML.Event.MSG_SERVER_MESSAGE, this._onMsgServerMessage, this);

        // sdk登录出错
        SML.Notify.listen(SML.Event.MSG_WINDOWS_COMMON_TIP_LOGINERR, this._onMsgLoginErr, this);
        SML.Notify.listen(SML.Event.MSG_GOTO_STORE, this._onMsgGotoStore, this); // 购买金币

        /**
         * 服务器消息解析，并转发。解析服务器消息，在此注册：
         */
        this.register(SML.Event.CMD_USER_INFO, this._onMsgUserInfo);
        this.register(SML.Event.CMD_UPDATE_NOTIFY, this._onMsgUpdateNotify);
        this.register(SML.Event.CMD_GAME_DATA, this._onMsgGameData);
        this.register(SML.Event.CMD_HALL_INFO, this._onMsgHallInfo);
        this.register(SML.Event.CMD_DIZHU, this._onMsgDizhu);
        this.register(SML.Event.CMD_GAME, this._onMsgGame);
        this.register(SML.Event.CMD_MESSAGE, this._onMessage);
        this.register(SML.Event.CMD_TODO_TASKS, this._onMsgTodoTasks);
        this.register(SML.Event.CMD_QUICK_START, this._onMsgQuickStart);
        this.register(SML.Event.CMD_QUICK_START_RES, this._onMsgQuickStartRes);
        this.register(SML.Event.CMD_HALL_SHARE2, this._onMsgHallShare2);
        this.register(SML.Event.CMD_MATCH_RANK, this._onMatchRank);
        this.register(SML.Event.CMD_MATCH_UPDATE, this._onMatchUpdate);
        this.register(SML.Event.CMD_MATCH_DESCRIPRTION, this._onMsgDetail);
        this.register(SML.Event.CMD_ROOM_LEAVE, this._onLeaveRoom);
        this.register(SML.Event.CMD_HALL_SHARE3, this._onMsgShare3);
        this.register(SML.Event.CMD_INVITE_INFO, this._onInviteInfo);
        this.register(SML.Event.CMD_HALL, this._onMsgHall);
        this.register(SML.Event.CMD_BAG, this._onMsgBag);
        this.register(SML.Event.CMD_TABLE_CHAT, this._onTableChat);
        this.register(SML.Event.CMD_PAYMENT_LIST, this._onPayment);
        this.register(SML.Event.CMD_PAYMENT_EXCHANGE, this._onPaymentExchange);
        this.register(SML.Event.CMD_PRODUCT_DELIVERY, this._onPaymentNotify);
        this.register(SML.Event.CMD_LED, this._onMsgLed);

        this.registerDizhu(SML.Event.ACTION_LOGIN, this._onDizhuLogin);
        this.registerDizhu(SML.Event.ACTION_FT_GET_CONF, this._onDizhuFTGetConf);
        this.registerDizhu(SML.Event.ACTION_FT_CREATE, this._onDizhuFTCreate);
        this.registerDizhu(SML.Event.ACTION_FT_ENTER_TABLE, this._onDizhuFTEnterTable);
        this.registerDizhu(SML.Event.ACTION_GET_MATCH_RULES, this._onDizhuGetMatchRules);
        this.registerDizhu(SML.Event.ACTION_MATCH_TITLE_INFO, this._onDizhuMatchTitleInfo);
        this.registerDizhu(SML.Event.ACTION_MATCH_TITLE_RULE, this._onDizhuMatchTitleRule);
        this.registerDizhu(SML.Event.ACTION_MATCH_TITLE_RANK_LIST, this._onDizhuMatchTitleRankList);
        this.registerDizhu(SML.Event.ACTION_WX_SHARE, this._onDizhuWXShare);
        this.registerDizhu(SML.Event.ACTION_TREASURE_SHOP_LIST, this._onDizhuTreasureShopList);
        this.registerDizhu(SML.Event.ACTION_DAILY_INVITE_INFO, this._onDizhuDailyInviteInfo);
        this.registerDizhu(SML.Event.ACTION_DAILY_INVITE_REWARD, this._onDizhuInviteReward);
        this.registerDizhu(SML.Event.ACTION_DAILY_INVITE_BIND_USER, this._onDizhuInviteBindUser);
        this.registerDizhu(SML.Event.ACTION_AD_INFO, this._onDizhuADInfo);
        this.registerDizhu(SML.Event.ACTION_WATCH_AD, this._onDizhuWatchAD);
        this.registerDizhu(SML.Event.ACTION_USER_SHARE_BEHAVIOR_INFO, this._onDizhuUserShareBehaviorInfo);
        this.registerDizhu(SML.Event.ACTION_USER_SHARE_BEHAVIOR_DEAL, this._onDizhuUserShareBehaviorDeal);
    },

    // 注册cmd回调
    register: function(eventName, func) {
        this._map[eventName] = func;
    },

    // 注册cmd:dizhu的action回调
    registerDizhu: function(dizhuAction, func) {
        this._dizhuMap[dizhuAction] = func;
    },

    _onMsgTcpOpen () {
        SML.BiLog.record_game_progress('TCPOpened');
        SML.GameProgress.tcpOpened();
        SML.MSG.bindUser();
    },

    _onMsgServerMessage (params) {
        params = params || {};
        var cmd = params.cmd;
        if (cmd) {
            SML.ConnectManager.hideWifiView();
            // 过滤掉不要的协议
            if (this.notNeedCmds.contains(cmd)) {
                return;
            }

            /**
             * 协议数据优先处理
             */
            var func = this._map[cmd];
            if (typeof func == 'function') {
                func.call(this, params);
            }

            // 过滤牌桌协议
            if (!SML.TableMsgManager.filterMsg(params)) {
                SML.Notify.trigger(cmd, params);
            }

            // 缓存最后100条协议
            this.tmpMsgs.push(params);
            if (this.tmpMsgs.length > this.tmpMaxCount) {
                this.tmpMsgs.shift();
            }
        }
    },


    /**
     * loc在此获得，登录断线重连从此进入牌桌
     */
    _onMsgUserInfo (params) {
        // SML.Output.log(JSON.stringify(params));
        var result = params.result;
        SML.UserInfo.parse(result);

        if (result.gameId == SML.GameData.appId) {
            if (SML.HallInfo.noInit) {
                SML.BiLog.record_game_progress('BindUser');
                SML.GameProgress.bindUser();
                SML.MSG.loginDizhu();
            } else {
                this.finishLogin();
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
                SML.MSG.getUserInfo();
            } else if (changes[i] == "item") {
                SML.MSG.getBagInfo();
            }
        }
    },

    /**
     * 绑定插件
     * @param params
     * @private
     */
    _onMsgGameData (params) {
        // SML.Output.log(JSON.stringify(params));
        var result = params['result'];
        if (result.gameId == SML.GameData.gameId) {
            // SML.BiLog.record_game_progress('BindGame');
            // SML.MSG.getHallInfo();
            //
            // // 开始请求游戏数据
            // SML.LoginDataManager.init();
            // SML.LoginDataManager.getGameData();
        }
    },

    /**
     * hall_info
     */
    _onMsgHallInfo (params) {
        // SML.BiLog.record_game_progress('HallInfoData');
        var result = params['result'];
        SML.HallInfo.parse(result);
        SML.Switch.parseHallInfo(result['switchConf']);
        SML.MatchModel.parseHallInfo();
        SML.EnvelopeInfo.parseTableInfo();
        SML.Model.MatchTitle.parseHallInfo();
        SML.Messages.parseHallInfo(result);
    },

    /**
     *
     * @private
     */
    _onMsgHall:function(params) {
        var result = params['result'];
        var action = result['action'];
        if (action == SML.Event.ACTION_COUPON_DETAILS) {
            SML.Messages.parseCouponDetails(result);
        }
    },

    /**
     * 消息
     * @param params
     * @private
     */
    _onMessage:function(params) {
        var result = params['result'];
        var action = result['action'];
        if (action == SML.Event.ACTION_LIST) {
            SML.Messages.parseMessageList(result);
        } else if (action == SML.Event.ACTION_GLOBAL_UPDATE) {
            SML.Messages.parseMessageGlobal(result);
        }
    },

    /**
     * todo tasks
     * @private
     */
    _onMsgTodoTasks:function(params) {
        var result = params['result'];
        var tasks = result['tasks'];
        SML.TodoTaskManager.pushTasks(tasks);
    },

    _onMsgGame:function(params) {
        var result = params['result'];
        var action = result['action'];
        if (action == SML.Event.ACTION_DDZ_MSG_ALERT) {
            SML.WindowsManager.showWindows(SML.Event.MSG_WINDOWS_COMMON_TIP_ALERT, result);
        }
    },

    _onMsgHallShare2:function(params) {
        var result = params['result'];
        var action = result['action'];
        if (action == 'get_reward') {
            var rewards = result['rewards'];
            if (rewards.length > 0) {
                var msg = '恭喜获得分享奖励：\n\n';
                for (var i = 0; i < rewards.length; i++) {
                    var fuhaoStr = (i == rewards.length - 1 ? '。' : '，');
                    if (rewards[i]['itemId'] == "user:coupon") {
                        msg = msg + (rewards[i]['count']/100).toFixed(2) + '元红包' + fuhaoStr;
                    } else {
                        msg = msg + rewards[i]['count'] + rewards[i]['name'] + fuhaoStr;
                    }
                }
                SML.WindowsManager.showWindows(SML.Event.MSG_WINDOWS_COMMON_TIP, msg);
            }
        }
    },

    _onMsgShare3:function(params){
        // SML.BiLog.record_game_progress('Share3Data');
        SML.Share.parse(params);
    },

    // 在领钻石面板有监听
    _onInviteInfo(){

    },

    _onMsgQuickStart(params) {
        var result = params['result'];
        SML.TableModel.qsInfo.cleanup();
        SML.TableModel.qsInfo.parse(result);
    },

    /**
     * errcode=1, message='亲~系统即将维护升级哦'
     * errcode=2, message='亲~您的钻石不足，赶紧充值吧'
     * errcode=3, message='亲~您的金币不足无法进入此房间，赶紧充值吧！'   LessMinQuickStartCoin
     * errcode=4, message='亲~您的金币不足无法进入此房间，赶紧充值吧！'   LessMinKickOutCoin
     * errcode=5, message='亲~您太富有了，该去更高级的房间战斗啦！'
     * errcode=6, message='亲~该房间本时段未开放哦~'
     * errcode=7, message='亲~您的条件不足进入该房间哦~'
     * errcode=8, message='亲~您的金币不足无法进入此房间，赶紧充值吧！'   LessMinCoin
     * @param params
     * @private
     */
    _onMsgQuickStartRes(params) {
        let result = params['result'];
        let errcode = result['resCode'];
        let errMsg = result['resMsg'];
        let errParams = result['params'];
        let dealErrParams = function(params) {
            params = params || {};
            if (params.burialId && params.reward && params.reward.length > 0 && params.reward[0].count > 0) {
                SML.WindowsManager.showWindowsOnce(SML.Event.MSG_WINDOWS_MATCH_CASH_JIUJI, {
                    kickOutBurialId: params.burialId,
                    shareRewardChip: params.reward[0].count
                });
            } else if (params.todoTask) {
                if (cc.sys.os === cc.sys.OS_IOS) {
                    if (SML.Switch.iosRecharge && SML.Switch.showRecharge) {
                        SML.WeChat.openCustomerServiceConversation({'sessionFrom':'vouch'});
                    } else {
                        SML.WindowsManager.showWindowsOnce(SML.Event.MSG_WINDOWS_MAIN_PAYMENT_EXCHANGE);
                    }
                } else {
                    SML.TodoTaskManager.pushTask(params.todoTask);
                }
            } else {
                SML.WindowsManager.showWindowsOnce(SML.Event.MSG_WINDOWS_MAIN_PAYMENT_EXCHANGE);
            }
        }
        if (errcode == 2) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                if (SML.Switch.iosRecharge && SML.Switch.showRecharge){
                    SML.WeChat.openCustomerServiceConversation({'sessionFrom':'vouch'});
                } else {
                    SML.WindowsManager.showWindowsOnce(SML.Event.MSG_WINDOWS_DIAMOND_AWARD);
                }
            } else {
                SML.WindowsManager.showWindowsOnce(SML.Event.MSG_WINDOWS_MAIN_PAYMENT_PURCHASE);
            }
        } else if (errcode == 3 || errcode == 4 || errcode == 8) {
            dealErrParams(errParams);
        } else {
            SML.TipManager.showMsg(errMsg, 2);
        }
    },

    _onMatchRank(params) {
        var result = params['result'];
        var roomId = result.roomId;
        var mixId = result.mixId;
        var matchData= SML.MatchModel.getMatchData(roomId, mixId);
        if (matchData) {
            matchData.matchDes.parseMatchRank(result);
        }
    },

    //报名后，持续获取有多少人报名了
    _onMatchUpdate: function(params) {
        var result = params['result'];
        var roomId = result.roomId;
        var mixId = result.mixId;
        var matchData= SML.MatchModel.getMatchData(roomId, mixId);
        if (matchData) {
            matchData.matchDes.parseMatchBasicInfoByUpdate(result);
        }
    },

    _onMsgDetail (params) {
        // SML.Output.log('比赛详情消息数据： ' + JSON.stringify(params));
        //保存数据
        var result = params['result'];
        result.info = result.info || {};
        var roomId = result.info.roomId;
        var mixId = result.info.mixId;
        var matchData= SML.MatchModel.getMatchData(roomId, mixId);
        if (matchData) {
            matchData.matchDes.parse(result);
        }
    },

    _onLeaveRoom(params) {
        var result = params['result'];
        if (result['reason'] == -1) {

        }
    },

    _onMsgLoginErr(msg) {
        let isTest = (msg == '{"errMsg":"request:fail url not in domain list"}');
        if (CC_WECHATGAME && !isTest) {
            wx.showModal({
                title: '登陆失败',
                content: '请确认网络连接正常，点击确定重试。',
                showCancel: false,
                success: function (res) {
                    SML.SDK.login();
                }
            });
        } else {
            SML.WindowsManager.showWindowsOnce(SML.Event.MSG_WINDOWS_COMMON_TIP_LOGINERR, msg);
        }

    },

    _onMsgGotoStore () {
        if (SML.Switch.chipRoom) {
            SML.WindowsManager.showWindowsOnce(SML.Event.MSG_WINDOWS_MAIN_PAYMENT_EXCHANGE);
        } else {
            SML.TipManager.showMsg('该功能将与金币桌一同解锁');
        }
    },

    _onMsgTCPErr() {
        SML.ConnectManager.showWifiView();
    },

    _onMsgTCPErrCountMax() {
        SML.Output.err('TCPErrCountMax');
        SML.SDK.login();
        SML.ConnectManager.hideWifiView();
        SML.TipManager.showMsg('网络中断，正在尝试重新登录！', 5);
    },

    _onMsgBag(params) {
        var result = params['result'];
        SML.UserInfo.parseBag(result);
    },

    // send——cmd:table action:chat,receive——cmd:table_chat action:''
    _onTableChat(params){
    },

    _onMsgLed (poarams) {
        var result = params['result'];
        SML.LedInfo.parse(result);
    },

    _onPayment (params) {
        var result = params['result'];
        var action = result['action'];

        if (action == SML.Event.ACTION_PAYMENT_LIST_UPDATE) {
            SML.Model.Payment.parseInfo(result);
        }
    },

    _onPaymentExchange () {
        var result = params['result'];
        var action = result['action'];

        if (action == SML.Event.ACTION_PAYMENT_EXCHANGE_BUY) {
            SML.Model.Payment.parseExchange(result);
        }
    },

    _onPaymentNotify (params) {
        var result = params['result'];

        if (result.info.indexOf('成功') >= 0) {
            if (result.prodName.indexOf('钻石') >= 0) {
                SML.TipManager.showMsg(`购买成功!`);
            } else {
                SML.TipManager.showMsg(`兑换成功!`);
            }
        }
    },

    /**
     * dizhu
     */
    _onMsgDizhu:function(params) {
        // SML.Output.log('dizhu:' + JSON.stringify(params));
        var result = params['result'];
        var action = result['action'];

        /**
         * 协议数据优先处理
         */
        var func = this._dizhuMap[action];
        if (typeof func == 'function') {
            func.call(this, result);
        }
    },

    // 登陆成功之后的处理
    finishLogin () {

        if (this.loginSuccess) { // 重连
            SML.Notify.trigger(SML.Event.MSG_RECONNECT);
        } else { // 登录
            this.loginSuccess = true;
            SML.Notify.trigger(SML.Event.MSG_LOGIN_SUCCESS);
            SML.BiLog.record_game_progress('GameLoginSuccess');
            SML.GameProgress.gameLoginSuccess();
        }

        // 获取默认分享数据
        var defaultShare = SML.Share.getBurialByType(SML.BurialShareType.Default);
        if (!defaultShare || !defaultShare.completed()) {
            SML.MSG.getShare3BurialInfo(SML.BurialShareType.Default);
        }

        // 获取背包
        SML.MSG.getBagInfo();

        // 分享发奖
        SML.Share.getShareRewards();

        if (SML.UserInfo.query){
            // 给邀请我的人发奖
            if(SML.UserInfo.query.inviteCode) {
                SML.MSG.bindInviteCode(SML.UserInfo.query.inviteCode);
                if (SML.UserInfo.query.pointId) {
                    SML.MSG.notifyDailyInviteUser(SML.UserInfo.query.inviteCode, SML.UserInfo.query.pointId);
                }
                SML.UserInfo.query.inviteCode = null;
            }
        }

        if (!SML.Model.MatchTitle.mHasRule) {
            SML.MSG.fetchMatchTitleRule();
        }

        // // 获取比赛描述
        // for (var i = 0; i < SML.HallInfo.matchRoomInfos.length; i++) {
        //     var roomId = SML.HallInfo.matchRoomInfos[i].roomId;
        //     var mixId = SML.HallInfo.matchRoomInfos[i].mixId;
        //     SML.MSG.getMatchDescreption(roomId, mixId);
        // }
    },

    /********************************************************
     * 下面为cmd:dizhu的各action对应的回调
     */
    _onDizhuLogin(result){
        SML.Output.log('_onDizhuLogin:' + JSON.stringify(result));
        if (result['ok']) {
            SML.GameProgress.dizhuLogin();
            let hallInfo = result['hall_info'] || {};
            SML.HallInfo.parse(hallInfo);
            SML.Switch.parseHallInfo(hallInfo['switchConf']);
            SML.MatchModel.parseHallInfo();
            SML.EnvelopeInfo.parseTableInfo();
            SML.Model.MatchTitle.parseHallInfo();
            SML.Messages.parseHallInfo(hallInfo);
            SML.Model.MatchTitle.parseInfo(result);
            SML.UserBehaviorInfo.parseInfo(result);

            // ip限制ios充值开关
            if(result['showRecharge']){
                SML.Switch.showRecharge = result['showRecharge'];
            }

            this.finishLogin();
        } else {
            SML.WindowsManager.showWindowsOnce(SML.Event.MSG_WINDOWS_COMMON_TIP_LOGINERR, result['errMsg'] || '登陆失败，请重试！');
            SML.Output.err('dizhu login err:'+JSON.stringify(result));
        }
    },
    _onDizhuFTGetConf(result){
        SML.FTConfig.parse(result);
    },
    _onDizhuFTCreate(result){

    },
    _onDizhuFTEnterTable(result){

    },
    _onDizhuGetMatchRules(result){
        SML.MatchModel.tmpMatchData.matchRule.parseMatchRule(result);
    },
    _onDizhuMatchTitleInfo(result){
        // SML.BiLog.record_game_progress('SegmentData');
        SML.Model.MatchTitle.parseInfo(result);
    },
    _onDizhuMatchTitleRule(result){
        SML.Model.MatchTitle.parseRule(result);
    },
    _onDizhuMatchTitleRankList(result){
        SML.Model.MatchTitle.parseRank(result);
    },
    _onDizhuWXShare(result){
        SML.WindowsManager.showWindowsOnce(SML.Event.MSG_WINDOWS_COMMON_TIP_SHARE, result);
    },
    _onDizhuTreasureShopList(result){
        SML.Model.Treasure.parseShopList(result);
    },
    _onDizhuDailyInviteInfo(result){
        SML.Model.Invite.parseInfo(result);
    },
    _onDizhuInviteReward(result){
        SML.Model.Invite.parseReward(result);
    },
    _onDizhuInviteBindUser(result){
        if (result.code == 0) {
            var todotask = {action : 'pop_info_wnd', params:{ des : result.errmsg}};
            SML.TodoTaskManager.pushTask(todotask);
        }
    },
    _onDizhuADInfo(result){
        SML.AdInfo.parse(result);
    },
    _onDizhuWatchAD(result){
        SML.AdInfo.parseReward(result);
    },
    _onDizhuUserShareBehaviorInfo(result){
        SML.UserBehaviorInfo.parseInfo(result);
    },
    _onDizhuUserShareBehaviorDeal(result){
        SML.UserBehaviorInfo.parseDeal(result);
        // 获取视频奖励
        var dealResult = result['dealResult'] || {};
        var rewards = dealResult['rewards'] || [];
        if (rewards.length > 0) {
            var msg = '恭喜获得看视频奖励：\n\n';
            for (var i = 0; i < rewards.length; i++) {
                var fuhaoStr = (i == rewards.length - 1 ? '' : '  ');
                if (rewards[i]['itemId'] == "user:coupon") {
                    msg = msg + (rewards[i]['count']/100).toFixed(2) + '元红包' + fuhaoStr;
                } else {
                    msg = msg + rewards[i]['count'] + rewards[i]['name'] + fuhaoStr;
                }
            }
            SML.WindowsManager.showWindows(SML.Event.MSG_WINDOWS_COMMON_TIP, msg);
        }
    },
}