/**
 * 获取登录数据
 * @type {{}}
 */
SML.LoginDataManager = {
    loginSuccess:false,
    loginTime:0,                                             // 记录登录/重连成功的时间戳（s）
    _loginProtocols: [{cmd : 'idle', action : null}],        // 必须数据
    _loginProtocols2: [],                                    // 非必须
    _handle: null,
    init () {
        // 登录必须获取的数据
        if (this.checkLoginTime()) {
            this._loginProtocols = [
                {cmd : SML.Event.CMD_DIZHU, action : SML.Event.ACTION_MATCH_TITLE_INFO, request: function(){SML.MSG.fetchMatchTitleInfo();}},
                {cmd : SML.Event.CMD_HALL_SHARE3, action : SML.Event.ACTION_GET_BURIAL_SHARE, request: function(){SML.MSG.getShare3BurialInfo(SML.BurialShareType.Default);}},
                {cmd : SML.Event.CMD_PAYMENT_LIST, action : SML.Event.ACTION_PAYMENT_LIST_UPDATE, request: function(){SML.MSG.fetchPaymentList();}},
            ];
            this._loginProtocols2 = [
                {cmd : SML.Event.CMD_DIZHU, action : SML.Event.ACTION_FT_GET_CONF, request: function(){SML.MSG.getFriendConf();}},
                {cmd : SML.Event.CMD_DIZHU, action : SML.Event.ACTION_MATCH_TITLE_RULE, request: function(){SML.MSG.fetchMatchTitleRule();}},
                {cmd : SML.Event.CMD_BAG, action : null, request: function(){SML.MSG.getBagInfo();}},
                {cmd : SML.Event.CMD_DIZHU, action : SML.Event.ACTION_USER_SHARE_BEHAVIOR_INFO, request: function(){SML.MSG.getUserShareBehaviorInfo();}}
            ];
            if (this._handle) clearTimeout(this._handle); // 取消等待的超时
            // 5秒还没有获取到数据，重新登录
            this._handle = setTimeout(function(){
                delete this._handle;
                var msg = '';
                for (var i = 0; i < this._loginProtocols.length; i++) {
                    var p = this._loginProtocols[i];
                    msg += `[${p.cmd}#${p.action}]`;
                }
                SML.Output.err('SML.LoginDataManager', msg);
                SML.Notify.trigger(SML.Event.MSG_WINDOWS_COMMON_TIP_LOGINERR, '请检查网络状况后重试。');
            }.bind(this), 5000);
        } else {
            this._loginProtocols = [
            ];
            this._loginProtocols2 = [
                {cmd : SML.Event.CMD_BAG, action : null, request: function(){SML.MSG.getBagInfo();}} // 玩家购买之后必须刷新
            ];
        }
    },

    /**
     * 释放注册的协议
     * @param cmd
     * @param params
     */
    releaseLoginBlock : function(cmd, params) {
        var action = params.result && params.result.action;

        for (var i = 0; i < this._loginProtocols.length; i++) {
            var row = this._loginProtocols[i];
            if (row.cmd == cmd && (!row.action || row.action == action)) {
                this._loginProtocols.splice(i, 1);
                break;
            }
        }

        if (this._loginProtocols.length == 0) {
            this.finishLogin();
            this.loginTime = Math.floor((new Date()).valueOf()/1000);
        }
    },

    finishLogin : function () {
        if (this._handle) clearTimeout(this._handle); // 取消等待的超时
        delete this._handle;
        if (this.loginSuccess) { // 重连
            SML.Notify.trigger(SML.Event.MSG_RECONNECT);
        } else { // 登录
            this.loginSuccess = true;
            SML.Notify.trigger(SML.Event.MSG_LOGIN_SUCCESS);
            SML.BiLog.record_game_progress('GameLoginSuccess');
        }

        this._loginProtocols = [
            {cmd : 'idle', action : null}
        ];
    },

    /**
     * 获取游戏数据
     */
    getGameData () {
        var protocols = this._loginProtocols.concat(this._loginProtocols2);
        for (var i = 0; i < protocols.length; i++) {
            var protocol = protocols[i];
            if (protocol && protocol.request) {
                protocol.request();
            }
        }
    },

    checkLoginTime () {
        var nowTime = Math.floor((new Date()).valueOf()/1000);
        if (nowTime - this.loginTime > 60 * 5) { // 5分钟过期
            return true;
        }
        return false;
    }
};