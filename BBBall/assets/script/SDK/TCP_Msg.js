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
        //消耗道具
        consumeItem:function(itemID,num)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_USER,
                'params' : {
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'count':num,
                    'action':'consume_item',
                    'itemId':itemID
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
        enterPkQueneRoom(roomID)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_ROOM,
                'params': {
                    'action': cc.wwx.EventType.CMD_PK_QUEUE_ENTER,
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'roomId':roomID,

                }
            };
            this._sendCmd(params);
        },
        randomMatchPkQueueRoom(roomID)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_ROOM,
                'params': {
                    'action': cc.wwx.EventType.CMD_PK_QUEUE_RANDOM_MATCH,
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'roomId':roomID,

                }
            };
            this._sendCmd(params);
        },
        inviteFriendPkQueueRoom(roomID)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_ROOM,
                'params': {
                    'action': cc.wwx.EventType.CMD_PK_QUEUE_INVITE,
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'roomId':roomID,

                }
            };
            this._sendCmd(params);
        },
        _updateCoordinate(roomID,tableID,startPosition,endPosition)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_TABLE_CALL,
                'params': {
                    'action': cc.wwx.EventType.CMD_PK_UPDATE_COORDINATE,
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'roomId':roomID,
                    'seatId':cc.wwx.UserInfo.seatId,
                    'tableId':tableID,
                    'startPos':startPosition,
                    'endPos':endPosition,

                }
            };
            this._sendCmd(params);
        },
        gameLevelTable(roomID,tableID)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_TABLE,
                'params': {
                    'action': cc.wwx.EventType.CMD_TABLE_LEAVE,
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'roomId':roomID,
                    'seatId':cc.wwx.UserInfo.seatId,
                    'tableId':tableID,

                }
            };
            this._sendCmd(params);
        },
        levelPkQueueRoom(roomID)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_ROOM,
                'params': {
                    'action': cc.wwx.EventType.CMD_PK_QUEUE_LEAVE,
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'roomId':roomID,

                }
            };
            this._sendCmd(params);
        },
        getPkQueueRoom()
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'action': cc.wwx.EventType.CMD_PK_QUEUE_ROOM,
                    'gameId': cc.wwx.SystemInfo.gameId,

                }
            };
            this._sendCmd(params);
        },
        //获取提审配置
        getClientConf:function()
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'action': 'client_conf'
                }
            };
            this._sendCmd(params);

        },
        //获取关卡礼包
        getLevelGiftConf:function()
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'action': 'get_level_gift_conf'
                }
            };
            this._sendCmd(params);
        },
        getShareReward(shareRewardType)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'shareRewardType':shareRewardType,
                    'action': cc.wwx.EventType.ACTION_SHARE_REWARD
                }
            };
            this._sendCmd(params);
        },
        openGiftBox:function(level)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'level' : level,
                    'action': 'open_gift'
                }
            };
            this._sendCmd(params);
        },
        /*
          * 获取邀请配置
         */
        getInvite: function(gameId) {
            var params = {
                'cmd': cc.wwx.EventType.CMD_USER ,
                'params': {
                    'gameId': gameId || cc.wwx.SystemInfo.gameId,
                    'action': cc.wwx.EventType.ACTION_GET_INVITE_CONF
                }
            };
            this._sendCmd(params);
        },

        /*
            * 获取邀请配置
        */
        getRank: function(gameId) {
            var params = {
                'cmd': cc.wwx.EventType.CMD_CUSTOM_RANK ,
                'params': {
                    'action': cc.wwx.EventType.ACTION_QUERY,
                    'rankKey':'normal_101',
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
        /**
         * 插件绑定
         */
        bindGame: function(gameId) {
            var params = {
                'cmd': cc.wwx.EventType.CMD_BIND_GAME,
                'params': {
                    'gameId': gameId || cc.wwx.SystemInfo.gameId,
                    'authorCode': cc.wwx.UserInfo.authorCode
                }
            };
            this._sendCmd(params);
        },
        /*
         * 签到
         */
        daily_checkin:function(gameId)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'gameId': gameId || cc.wwx.SystemInfo.gameId,
                    'action': cc.wwx.EventType.CMD_DAILY_CHECKIN,
                }
            };
            this._sendCmd(params);
        },
        /**
         *  获取签到数据
         */

        getDaily_checkin_status(gameId)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'gameId': gameId || cc.wwx.SystemInfo.gameId,
                    'action': cc.wwx.EventType.CMD_DAILY_CHECKIN_STATUS,
                    'authorCode': cc.wwx.UserInfo.authorCode
                }
            };
            this._sendCmd(params);
        },
        /*
         * 开启宝箱
         */
        openGameBox(playMode,level)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'action': cc.wwx.EventType.ACTION_OPEN_BOX,
                    'playMode': playMode,
                    'level':level
                }
            };
            this._sendCmd(params);
        },
        /**
         * 游戏结束更新分数
         *
         */
        updateUpLoadGameScore:function(gameId,playMode,score,curLevel,levelState,curLevelStar)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'gameId': gameId,
                    'action': cc.wwx.EventType.GAME_RESULT_UPLOAD_SCORE,
                    'authorCode': cc.wwx.UserInfo.authorCode,
                    'playMode': playMode,
                    'score': score,
                    'curLevel': curLevel || 0,
                    'levelState': levelState || 0,
                    'curLevelStar': curLevelStar || 0,

                }
            };
            this._sendCmd(params);
        },


        /*
         * 获取分享埋点信息
         */
        getShare3Burials: function() {
            var params = {
                'cmd': cc.wwx.EventType.CMD_HALL_SHARE3,
                'params': {
                    'action': cc.wwx.EventType.ACTION_GET_BURIALS,
                    'gameId': cc.wwx.SystemInfo.gameId,
                }
            };

            this._sendCmd(params);
        },

        /*
        * 领取新分享奖励
        */
        getShare3Reward: function(pointId,whereToShare) {
            if (!pointId || typeof pointId != 'number') {
                cc.wwx.OutPut.err('getShare3Reward err: pointId=' + pointId + ' whereToShare=' + whereToShare);
                return;
            }
            var params = {
                'cmd': cc.wwx.EventType.CMD_HALL_SHARE3,
                'params': {
                    'action': cc.wwx.EventType.ACTION_GET_SHARE_REWARD,
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'pointId': pointId,
                    "whereToShare":whereToShare,
                }
            };

            this._sendCmd(params);
        },
        getReward:function(index)
        {
            var params = {
                "cmd": cc.wwx.EventType.CMD_GAME,
                "params": {
                    "action":  cc.wwx.EventType.ACTION_GET_REWARD,
                    "rewardType": "invite_friend",
                    'gameId':  cc.wwx.SystemInfo.gameId,
                    'rewardIndex':index
                }
            };

            this._sendCmd(params);
        },
        bindInviteCode:function(inviteCode)
        {
            var userId = parseInt(inviteCode);
            if (!userId || isNaN(userId)) {
                return;
            }
            var params = {
                "cmd": cc.wwx.EventType.CMD_GAME,
                "params": {
                    "action":  cc.wwx.EventType.ACTION_BIND_INVITE_INFO,
                    'gameId':  cc.wwx.SystemInfo.gameId,
                    "sharerId": userId,
                }
            };

            this._sendCmd(params);
        },
        /*
         * 获取埋点详细信息
        */
        getShare3BurialInfo: function(burialId) {
            var params = {
                'cmd': cc.wwx.EventType.CMD_GAME,
                'params': {
                    'action': cc.wwx.EventType.ACTION_GET_BURIAL_SHARE,
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'shareType': burialId,
                    'urlParams': {
                        'userName' : cc.wwx.UserInfo.userName
                    }
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
        useItemBall(itemId)
        {
            var params = {
                'cmd': cc.wwx.EventType.CMD_USER,
                'params': {
                    'gameId': cc.wwx.SystemInfo.gameId,
                    'action' : cc.wwx.EventType.ACTION_USE_BALL_ITEM,
                    'itemId' : parseInt(itemId),
                }
            };

            this._sendCmd(params);
        }

    }
})