cc.Class({
    extends: cc.Component,
    ctor (){
        // 模拟进度条进度
        var progressPoint1 = 30 + Math.random() * 10;
        var progressPoint2 = 52 + Math.random() * 10;
        this.progressPoints = [0, progressPoint1, progressPoint2, 80, 84, 86, 90, 92, 94, 96, 98, 99];
        this.curProgress = 0;
    },

    properties: {
        GlobalNode : cc.Node,
        TestButton : cc.Node,
        labelProgress: cc.Label,
        layerLoading: cc.Node
    },

    // use this for initialization
    onLoad () {
        SML.BiLog.record_game_progress('SceneLoginLoaded');

        if (!CC_WECHATGAME) {
            // 初始化游戏全局数据
            SML.init();
        }
        // 初始化游戏全局数据
        SML.init();

        // cc.game.addPersistRootNode(this.GlobalNode);
        // SML.audioManager = SML.audioManager || this.GlobalNode.getChildByName('AudioManager').getComponent('audio_manager');
    },

    start () {
        SML.Notify.listen(SML.Event.MSG_RECONNECT, this._onMsgLoginSuccess, this);
        SML.Notify.listen(SML.Event.MSG_LOGIN_SUCCESS, this._onMsgLoginSuccess, this);
        SML.Notify.listen(SML.Event.CMD_DIZHU, this._onMsgDizhu, this);
        SML.Notify.listen(SML.Event.CMD_QUICK_START, this._onMsgQuickStart, this);
        SML.Notify.listen(SML.Event.CMD_MATCH_SIGNS, this._onMsgMatchSigns, this);
        SML.Notify.listen(SML.Event.MSG_CONNECTED_SDK, this._onMsgConnectedSDK, this);

        SML.Notify.listen(SML.Event.MSG_SDK_WX_CHECK_SESSION, this._onWxMsgLogin, this);
        SML.Notify.listen(SML.Event.MSG_TCP_OPEN, this._onMsgProgress, this);
        SML.Notify.listen(SML.Event.CMD_USER_INFO, this._onMsgProgress, this);
        SML.Notify.listen(SML.Event.CMD_GAME_DATA, this._onMsgProgress, this);
        SML.Notify.listen(SML.Event.CMD_HALL_INFO, this._onMsgProgress, this);

        // 预加载
        SML.TipManager.proload();
        SML.LoadingManager.preload();
        SML.ConnectManager.preload();
        // SML.WidgetManager.preload();

        // 顺序加载
        SML.Core.Scene.preLoad('hall', function(){
            // 1
            // this.toNextProgress();
        }.bind(this));

        SML.Core.Scene.preLoad('table', function() {
            // 2
            // this.toNextProgress();
        }.bind(this));

        SML.SDK.login();

        SML.GameProgress.startLogin();

        SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeProgress, ['0s']);

        // 三秒还在上传bi
        this.scheduleOnce(function(){
            var params = ['3s'].concat(SML.GameProgress.progeressData());
            SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeProgress, params);
        }, 3);


        // 定时上传bi
        this.scheduleOnce(function(){
            var params = ['5s'].concat(SML.GameProgress.progeressData());
            SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeProgress, params);
        }, 5);

        // 定时上传bi
        this.scheduleOnce(function(){
            var params = ['8s'].concat(SML.GameProgress.progeressData());
            SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeProgress, params);
        }, 8);


        // 定时上传bi
        this.scheduleOnce(function(){
            var params = ['12s'].concat(SML.GameProgress.progeressData());
            SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeProgress, params);

            var msg = SML.Output.getLogForServer();
            SML.BiLog.uploadLogTimely('【loginErr.timeout】' + msg);  // 上传错误日志
        }, 12);
    },

    // called every frame
    update (dt) {
        this.refreshProgress();
    },

    onDestroy() {
        SML.Notify.ignoreScope(this);
    },

    // 下一个进度点
    nextPoint () {
        var point = 101;
        for (var i = 0; i < this.progressPoints.length; i++) {
            if (this.curProgress < this.progressPoints[i]) {
                point = this.progressPoints[i];
                return point;
            }
        }
        return point;
    },

    // 更新进度
    refreshProgress () {
        var point = this.nextPoint() - 1;
        this.curProgress = this.curProgress + Math.random() * 0.8;
        this.curProgress = Math.min(point, this.curProgress);
        this.labelProgress.string = '正在加载：' + Math.floor(this.curProgress) + '%';
    },

    // 设置进度以进入下一个进度点
    setProgress (progress) {
        // SML.Output.log(this.name, 'login setProgress:' + progress);
        this.curProgress = Math.max(progress, this.curProgress);
        this.curProgress = Math.min(100, this.curProgress);
    },

    // 进入下一个进度点
    toNextProgress () {
        this.setProgress(this.nextPoint());
    },

    // 进入最后一步
    toFinal () {
        this.setProgress(100);
    },

    _onMsgConnectedSDK () {

    },

    /**
     * 开始登陆WX / 或者重新登陆
     * @private
     */
    _onWxMsgLogin () {
        this.curProgress = 0;
        this.setProgress(this.progressPoints[1]);
    },

    _onMsgProgress () {
        this.toNextProgress();
    },

    /**
     * 登陆成功的回调
     */
    _onMsgLoginSuccess() {
        SML.Output.info('login _onMsgLoginSuccess:' + SML.UserInfo.loc);

        // 3
        this.toNextProgress();

        var inTable = SML.UserInfo.checkLoc();
        var queryInfo = SML.UserInfo.checkQuery();
        if (inTable) {
            // 牌桌位置确定后，清除loc,
            SML.UserInfo.loc = '';
            // 在牌桌上, 直接进入
            SML.Output.log('断线重连');
            SML.MSG.getQuickStart(inTable);
        } else if (queryInfo && queryInfo.Ty == 'friend') {
            SML.MSG.enterFTTable(queryInfo.ftId);
            SML.UserInfo.query = {};
        } else {
            SML.Output.log('登陆成功');
            // 4
            this.toFinal();
            SML.Core.Scene.load('hall');
        }
    },

    _onMsgDizhu(params) {
        var result = params.result;
        // SML.Output.log('_onMsgDizhu: ' + JSON.stringify(result));
        SML.Output.log('_onMsgDizhu: ' + JSON.stringify(result));
        if(result && result.action == SML.Event.ACTION_FT_ENTER_TABLE){
            if (result.code) {  // 失败
                SML.TipManager.showMsg(result.info || '房间已经不存在！');
                this.scheduleOnce(function(){
                    SML.Output.warn('_onMsgDizhu.setTimeout');
                    SML.Core.Scene.load('hall');
                }, 2)
            }
        }
    },

    /**
     * quick_start
     */
    _onMsgQuickStart (params) {
        if (SML.TableModel.qsInfo.isValid()) {
            // 4 + 6
            this.toFinal();
            SML.Core.Scene.load('table');
        } else if (SML.GlobalFuncs.isMyRoom(SML.TableModel.qsInfo.roomId)) {
            // 4
            this.toNextProgress();
            SML.MSG.getMatchSigns();
        } else {
            // 4
            this.toFinal();
            SML.Core.Scene.load('hall');
        }
    },

    /**
     * 报名
     */
    _onMsgMatchSigns (params) {
        SML.Output.log('m_signs:' + JSON.stringify(params));
        var result = params["result"];
        var signs = result["signs"];
        var isAll = result['isAll'];
        if (!isAll) return ;
        var roomId = SML.GlobalFuncs.toBigRoomId(SML.TableModel.qsInfo.roomId);
        var mixId = SML.TableModel.qsInfo.mixId;
        var queryInfo = SML.UserInfo.checkQuery();
        if (signs[roomId]) {
            if (queryInfo && queryInfo.Ty == 'friend') {
                // 取消报名的比赛
                SML.MSG.getMatchLeave(roomId);
                SML.MSG.getMatchSignout(roomId);
                SML.Core.Scene.popAllWindows();
                SML.Core.Scene.popAllViews();

                // 进入好友桌
                SML.MSG.enterFTTable(queryInfo.ftId);
                SML.UserInfo.query = {};
                // 5
                this.toNextProgress();
            } else {
                // 5
                this.toFinal();
                SML.Core.Scene.load('hall', function(){
                    SML.WindowsManager.showViewOnce(SML.Event.MSG_WINDOWS_MATCH_WAITING, {matchBefore:1, 'roomId':roomId, 'mixId':mixId});
                });
            }
        } else {
            if (queryInfo && queryInfo.Ty == 'friend') {
                SML.queryInfo = queryInfo;
            }
            SML.Core.Scene.popAllWindows();
            SML.Core.Scene.popAllViews();
            // 5
            this.toFinal();
            SML.Core.Scene.load('table', function(){
                SML.WindowsManager.showViewOnce(SML.Event.MSG_WINDOWS_MATCH_WAITING, {matchBefore:0, 'roomId':roomId, 'mixId':mixId});
            });
        }

    }
});