cc.Class({
    extends:cc.Component,
    statics:{
        _sendCmd: function(jsonData) {
            jsonData.params = jsonData.params || {};
            jsonData.params.userId = jsonData.params.userId || cc.wwx.UserInfo.userId;
            jsonData.params.gameId = jsonData.params.gameId || cc.wwx.SystemInfo.appId;
            jsonData.params.version = jsonData.params.version || cc.wwx.SystemInfo.version;
            jsonData.params.clientId = cc.wwx.SystemInfo.clientId;
            cc.wwx.TCPClient.send(jsonData);
        },
        /**
         * 获取UserInfo，大厅获取9999的UserInfo，单版获取6的
         * 大厅也有获取6的user_info的时候，地主的新手奖励是在地主服的bind_game时发放的
         */
        getUserInfo: function() {
            var params = {
                'cmd': cc.wwx.EventType.CMD_USER_INFO,
                'params' : {
                    'gameId': cc.wwx.SystemInfo.gameId
                }
            };
            this._sendCmd(params);
        },
        //获取背包信息
        getBagInfo: function() {
            var params = {
                'cmd': cc.wwx.EventType.CMD_BAG,
                'params': {
                    'action': 'update'
                }
            };
            this._sendCmd(params);
        },
        /**
         * 用户绑定
         */
        bindUser: function() {
            var params = {
                'cmd': cc.wwx.EventType.CMD_BIND_USER,
                'params': {
                    'authorCode': cc.wwx.UserInfo.authorCode
                }
            };
            this._sendCmd(params);
        },
        fetchPaymentList : function() {
            var params = {
                'cmd': cc.wwx.EventType.CMD_PAYMENT_LIST,
                'params': {
                    "action": cc.wwx.EventType.ACTION_PAYMENT_LIST_UPDATE,
                }
            };

            this._sendCmd(params);
        },

        exchange : function(prodId) {
            var params = {
                'cmd': cc.wwx.EventType.CMD_PAYMENT_EXCHANGE,
                'params': {
                    'action' : cc.wwx.EventType.ACTION_PAYMENT_EXCHANGE_BUY,
                    'prodId' : prodId,
                }
            };

            this._sendCmd(params);
        },
    }
})