SML.MSG = {
    _sendCmd: function(jsonData) {
        jsonData.params = jsonData.params || {};
        jsonData.params.userId = jsonData.params.userId || SML.UserInfo.userId;
        jsonData.params.gameId = jsonData.params.gameId || SML.GameData.appId;
        jsonData.params.version = jsonData.params.version || SML.GameData.version;
        jsonData.params.clientId = SML.GameData.clientId;
        SML.TCP.send(jsonData);
    },

    /**
     * 获取UserInfo，大厅获取9999的UserInfo，单版获取6的
     * 大厅也有获取6的user_info的时候，地主的新手奖励是在地主服的bind_game时发放的
     */
    getUserInfo: function() {
        var params = {
            'cmd': SML.Event.CMD_USER_INFO,
            'params' : {
                'gameId': SML.GameData.gameId
            }
        };
        this._sendCmd(params);
    },

    /**
     * 用户绑定
     */
    bindUser: function() {
        var params = {
            'cmd': SML.Event.CMD_BIND_USER,
            'params': {
                'authorCode': SML.UserInfo.authorCode
            }
        };
        this._sendCmd(params);
    },

    /**
     * 插件绑定
     */
    bindGame: function(gameId) {
        var params = {
            'cmd': SML.Event.CMD_BIND_GAME,
            'params': {
                'gameId': gameId || SML.GameData.gameId,
                'authorCode': SML.UserInfo.authorCode
            }
        };
        this._sendCmd(params);
    },

    /**
     * 地主游戏服登陆
     */
    loginDizhu: function() {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                "action": SML.Event.ACTION_LOGIN,
                'gameId': SML.GameData.gameId,
                'authorCode': SML.UserInfo.authorCode
            }
        };
        this._sendCmd(params);
    },

    /**
     * hall_info
     */
    getHallInfo: function() {
        var params = {
            'cmd': SML.Event.CMD_HALL_INFO,
            'params': {
                'gameId': SML.GameData.gameId
            }
        };

        this._sendCmd(params);
    },

    // 天梯排位赛 - 个人数据
    fetchMatchTitleInfo : function() {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                "action": SML.Event.ACTION_MATCH_TITLE_INFO,
            }
        };

        this._sendCmd(params);
    },

    // 天梯排位赛 - 全服排名
    fetchMatchTitleRank : function(start, stop, prev) {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                "action": SML.Event.ACTION_MATCH_TITLE_RANK_LIST,
                'start' : start,
                'stop'  : stop,
                'preIssue'  : prev? 1 : 0,
            }
        };

        this._sendCmd(params);
    },

    // 天梯排位赛 - 规则
    fetchMatchTitleRule : function() {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                "action": SML.Event.ACTION_MATCH_TITLE_RULE,
            }
        };

        this._sendCmd(params);
    },

    fetchOnlineUsers : function() {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                "action": SML.Event.ACTION_ROOM_ONLINE_USERS,
            }
        };

        this._sendCmd(params);
    },

    // 夺宝 - 商品列表
    fetchTreasureList : function() {
        // var params = {
        //     'cmd': SML.Event.CMD_DIZHU,
        //     'params': {
        //         'gameId': SML.GameData.gameId,
        //         "action": SML.Event.ACTION_TREASURE_SHOP_LIST,
        //     }
        // };

        // this._sendCmd(params);
        setTimeout(function() {
            SML.Notify.trigger(SML.Event.MSG_SERVER_MESSAGE, {
                "cmd": "dizhu",
                "result": {
                    "action": "treasure_shop_list",
                    'productList' : [
                        {
                            'productId' : 1, //
                            'cornerTag' : 0, // 0: 没有; 1: 定时; 2: 秒杀
                            'publishTimestamp' : SML.GlobalScheduler.mTimetamp + 5 * 60,
                            'shopName'  : '一元话费',
                            'shopUrl'   : 'https://ddzqn.nalrer.cn/SML/other/treasure_shop_1.png',
                            'diamondCost'   : 20,
                            'issueCur'      : 2,
                            'issueTotal'    : 100,
                            'grabType'      : 1, // 1: 定时; 2: 人满
                            'grabCountCur'  : 99,
                            'grabCountLimit': 100,
                            'myCodes'       : ['12345678911', '12345678912', '12345678913'],
                            'weight'        : 10,
                            'lastWinner'    : {
                                'avatar' : 'http://SML.dl.sml.com/cdn37/hall/avatar/New_avatar_170802.png',
                                'name' : '孔夫子',
                            },
                        },
                    ]
                }
            });
        }, 0);
    },

    fetchPaymentList : function() {
        var params = {
            'cmd': SML.Event.CMD_PAYMENT_LIST,
            'params': {
                "action": SML.Event.ACTION_PAYMENT_LIST_UPDATE,
            }
        };

        this._sendCmd(params);
    },

    exchange : function(prodId) {
        var params = {
            'cmd': SML.Event.CMD_PAYMENT_EXCHANGE,
            'params': {
                'action' : SML.Event.ACTION_PAYMENT_EXCHANGE_BUY,
                'prodId' : prodId,
            }
        };

        this._sendCmd(params);
    },

    fetchDailyInviteInfo : function() {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                'action' : SML.Event.ACTION_DAILY_INVITE_INFO,
            }
        };

        this._sendCmd(params);
    },

    notifyDailyInviteUser : function(code, pointId) {
        var userId = parseInt(code);
        if (!userId || isNaN(userId)) {
            return;
        }

        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                'inviteUserId' : userId,
                'pointId'   : pointId,
                'action' : SML.Event.ACTION_DAILY_INVITE_BIND_USER,
            }
        };

        this._sendCmd(params);
    },

    getDailyInviteReward : function() {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                'action' : SML.Event.ACTION_DAILY_INVITE_REWARD,
            }
        };

        this._sendCmd(params);
    },

    // 任务 - 获取当前任务
    fetchCurrentTask : function() {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                "action": SML.Event.ACTION_TASK_CURRENT_TASK,
            }
        };

        this._sendCmd(params);
    },

    // 任务 - 获取当前任务奖励
    getTaskReward : function(taskID, double) {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                "action": SML.Event.ACTION_TASK_GET_REWARD,
                'taskId': taskID,
                'rewardMulti': double? 1 : 0,
            }
        };

        this._sendCmd(params);
    },

    /**
     * 创建好友房间
     * ft_create
     */
    getFriendInfo: function(nRound,double,playMode,goodCard) {
        var conf = {
            "nRound": nRound,
            "double": double,
            "playMode": playMode,
            "goodCard": goodCard
        };

        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                "action": SML.Event.ACTION_FT_CREATE,
                "conf" : conf
            }
        };
        SML.Output.log('to getFriendInfo!!! ' + JSON.stringify(conf));
        this._sendCmd(params);
    },

    /**
     * 获取好友房间配置
     * ft_get_conf
     */
    getFriendConf: function() {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'gameId': SML.GameData.gameId,
                "action": SML.Event.ACTION_FT_GET_CONF,
            }
        };
        this._sendCmd(params);
    },

    // 请求进入好友桌
    enterFTTable:function(ftId) {
        var params = {
            "cmd":SML.Event.CMD_DIZHU,
            "params":{
                "gameId": SML.GameData.gameId,
                "action": SML.Event.ACTION_FT_ENTER_TABLE,
                "inviteId": ftId,
                "ftId": ftId
            }
        };
        this._sendCmd(params);
    },

    // 解散牌桌请求
    reqDisband:function (roomId, tableId, seatId) {
        var params = {
            "cmd":SML.Event.CMD_TABLE_CALL,
            "params":{
                "action": SML.Event.ACTION_FT_REQ_DISBAND,
                "gameId": SML.GameData.gameId,
                "seatId": seatId,
                "roomId": roomId,
                "tableId": tableId
            }
        };
        this._sendCmd(params);
	},

    // 确认解散牌桌请求
    ansDisband:function (roomId, tableId, seatId, answer) {
        var params = {
            "cmd":SML.Event.CMD_TABLE_CALL,
            "params":{
                "action": SML.Event.ACTION_FT_REQ_DISBAND_ANSWER,
                "gameId": SML.GameData.gameId,
                "seatId": seatId,
                "roomId": roomId,
                "tableId": tableId,
                "answer": answer
            }
        };
        this._sendCmd(params);
	},

	// 继续玩
	continueFT:function (roomId, tableId, seatId) {
        if (!roomId) {
            SML.Output.err(`continueFT : roomId=${roomId} tableId=${tableId} seatId=${seatId}`);
            return;
        }
        var params = {
            "cmd":SML.Event.CMD_TABLE_CALL,
            "params":{
                "action": SML.Event.ACTION_FT_CONTINUE,
                "gameId": SML.GameData.gameId,
                "seatId": seatId,
                "roomId": roomId,
                "tableId": tableId
            }
        };
        this._sendCmd(params);
	},

    // 获取好友排行
    getFriendList:function () {
        var params = {
            "cmd":SML.Event.CMD_DIZHU,
            "params":{
                "gameId":SML.GameData.gameId,
                "action":SML.Event.ACTION_FRIEND_RANK_LIST,
            }
        };
        this._sendCmd(params);
    },

    // 比赛场比赛规则
    getMatchRules:function (roomId, mixId) {
        if (!roomId) {
            SML.Output.err(`getMatchRules : roomId=${roomId} mixId=${mixId}`);
            return;
        }
        var params = {
            "cmd":SML.Event.CMD_DIZHU,
            "params":{
                "gameId":SML.GameData.gameId,
                "action":SML.Event.ACTION_GET_MATCH_RULES,
                "roomId":roomId,
                "mixId": mixId
            }
        };
        this._sendCmd(params);
    },

    // 获取比赛的描述信息，包括排名，奖励，房间号。等等
    getMatchDescreption: function(roomId, mixId) {
        if (!roomId) {
            SML.Output.err(`getMatchDescreption : roomId=${roomId} mixId=${mixId}`);
            return;
        }
        var params = {
            'cmd': SML.Event.CMD_MATCH_DESCRIPRTION,
            'params': {
                'gameId': SML.GameData.gameId,
                'roomId': roomId
            }
        };
        if (typeof(mixId) != 'undefined' && mixId != null) {
            params['params']['signinParams'] = {"mixId":mixId};
        }
        this._sendCmd(params);
    },

    /**
     * 获取比赛更新
     */
    getMatchUpdate: function (roomId, mixId) {
        if (!roomId) {
            SML.Output.err(`getMatchUpdate : roomId=${roomId} mixId=${mixId}`);
            return;
        }
        var params = {
            'cmd': SML.Event.CMD_MATCH_UPDATE,
            'params': {
                'gameId': SML.GameData.gameId,
                'roomId': roomId
            }
        };
        if (typeof(mixId) != 'undefined' && mixId != null) {
            params['params']['signinParams'] = {"mixId":mixId};
        }
        this._sendCmd(params);
    },

    /**
     * 进入房间请求
     */
    getQuickStart: function (roomId, mixId, innerTable) {
        if (!roomId) {
            SML.Output.err(`getQuickStart : roomId=${roomId} mixId=${mixId}`);
            return;
        }
        var params = {
            'cmd': SML.Event.CMD_QUICK_START,
            'params': {
                'gameId': SML.GameData.gameId
            }
        };
        if (typeof(roomId) != 'undefined' && roomId != null) {
            params['params']['roomId'] = roomId;
        }
        if (typeof(mixId) != 'undefined' && mixId != null) {
            params['params']['mixId'] = mixId;
        }
        if (typeof(innerTable) != 'undefined' && innerTable != null) {
            params['params']['innerTable'] = innerTable;
        }
        this._sendCmd(params);
    },

    /**
     * 进入房间请求
     */
    getQuickStartByLoc: function (roomId, tableId, mixId) {
        if (!roomId) {
            return;
        }
        var params = {
            'cmd': SML.Event.CMD_QUICK_START,
            'params': {
                'gameId': SML.GameData.gameId,
                'roomId': roomId,
                'tableId': tableId
            }
        };
        if (typeof(mixId) != 'undefined' && mixId != null) {
            params['params']['mixId'] = mixId;
        }
        this._sendCmd(params);
    },

    getReady: function (roomId, tableId, seatId) {
        var params = {
            'cmd': SML.Event.CMD_TABLE_CALL,
            'params': {
                'action': SML.Event.ACTION_READY,
                'gameId': SML.GameData.gameId,
                'roomId' : roomId,
                'tableId': tableId,
                'seatId' : seatId
            }
        };
        this._sendCmd(params);
    },

    getRoomLeave: function (roomId) {
        var params = {
            'cmd': SML.Event.CMD_ROOM_LEAVE,
            'params': {
                'gameId': SML.GameData.gameId,
                'roomId': roomId
            }
        };
        this._sendCmd(params);
    },

    /**
     * 报名
     */
    getMatchSignIn: function(roomId, mixId) {
        var params = {
            'cmd': SML.Event.CMD_MATCH_SIGNIN,
            'params': {
                'gameId': SML.GameData.gameId,
                'roomId': roomId,
                'feeIndex': 0
            }
        };
        if (typeof(mixId) != 'undefined' && mixId != null) {
            params['params']['signinParams'] = {"mixId":mixId};
        }
        this._sendCmd(params);
    },

    // 进入比赛报名页即发
    getMatchEnter: function(roomId) {
        if (!roomId) {
            SML.Output.err('getMatchEnter err:roomId=' + roomId);
            return;
        }
        var params = {
            'cmd': SML.Event.CMD_MATCH_ENTER,
            'params': {
                'gameId': SML.GameData.gameId,
                'roomId': roomId
            }
        };
        this._sendCmd(params);
    },

    // 进入比赛报名页即发
    getMatchLeave: function(roomId) {
        if (!roomId) {
            SML.Output.err('getMatchLeave err:roomId=' + roomId);
            return;
        }
        var params = {
            'cmd': SML.Event.CMD_MATCH_LEAVE,
            'params': {
                'gameId': SML.GameData.gameId,
                'roomId': roomId
            }
        };
        this._sendCmd(params);
    },

    //中途退出比赛页面调用
    getMatchGiveUp: function(roomId) {
        var params = {
            'cmd': SML.Event.CMD_ROOM,
            'params': {
                'action': SML.Event.ACTION_GIVEUP,
                'gameId': SML.GameData.gameId,
                'roomId': roomId
            }
        };
        this._sendCmd(params);
    },

    // 进入比赛报名页即发
    getMatchSignout: function(roomId) {
        var params = {
            'cmd': SML.Event.CMD_MATCH_SIGNOUT,
            'params': {
                'gameId': SML.GameData.gameId,
                'roomId': roomId
            }
        };
        this._sendCmd(params);
    },

    //获取你是否在这个房间报名，改变按钮的状态
    getMatchSigns: function() {
        var params = {
            'cmd': SML.Event.CMD_MATCH_SIGNS,
            'params': {
                'gameId': SML.GameData.gameId
            }
        };
        this._sendCmd(params);
    },

    getTableCallCall: function (userId, seatId, roomId, tableId, call) {
        var params = {
            'cmd': SML.Event.CMD_TABLE_CALL,
            'params': {
                "action":SML.Event.ACTION_CALL,
                'gameId': SML.GameData.gameId,
                'roomId': roomId,
                'tableId': tableId,
                'userId': userId,
                'seatId': seatId,
                'call': call
            }
        };
        this._sendCmd(params);
    },

    getTableCallRB: function (userId, seatId, roomId, tableId, robot) {
        var params = {
            'cmd': SML.Event.CMD_TABLE_CALL,
            'params': {
                "action":SML.Event.ACTION_ROBOT,
                'gameId': SML.GameData.gameId,
                'roomId': roomId,
                'tableId': tableId,
                'userId': userId,
                'seatId': seatId,
                'robot': robot
            }
        };
        this._sendCmd(params);
    },

    getTableCallCard: function (userId, seatId, roomId, tableId, cards, ccrc) {
        var params = {
            'cmd': SML.Event.CMD_TABLE_CALL,
            'params': {
                "action":SML.Event.ACTION_CARD,
                'gameId': SML.GameData.gameId,
                'roomId': roomId,
                'tableId': tableId,
                'userId': userId,
                'seatId': seatId,
                'cards': cards,
                'ccrc': ccrc    // tableState.ccrc,
            }
        };
        this._sendCmd(params);
    },

    getTableCallHuanpai: function (userId, seatId, roomId, tableId, cardNums) {
        var params = {
            'cmd': SML.Event.CMD_TABLE_CALL,
            'params': {
                "action":SML.Event.ACTION_HUANPAI,
                'gameId': SML.GameData.gameId,
                'roomId': roomId,
                'tableId': tableId,
                'userId': userId,
                'seatId': seatId,
                'cards': cardNums
            }
        };
        this._sendCmd(params);
    },

    /**
     * 表情
     * @param userId
     * @param seatId
     * @param roomId
     * @param tableId
     * @param smilies  bomb | brick | diamond | egg | flower
     * @param toSeatId
     */
    getTableCallSmilies (userId, seatId, roomId, tableId, smilies, toSeatId) {
        let params = {
            'cmd': SML.Event.CMD_TABLE_CALL,
            'params': {
                "action":SML.Event.ACTION_SMILIES,
                'gameId': SML.GameData.gameId,
                'roomId': roomId,
                'tableId': tableId,
                'userId': userId,
                'seatId': seatId,
                'smilies': smilies,
                'toseat': toSeatId,
                'number': 1
            }
        };
        this._sendCmd(params);
    },

    /**
     * 发送聊天信息
     */
    sendTableChat(roomId, tableId, seatId, msg, isFace, voiceIndex) {
        // if (isFace) {
        //     //兼容老版本
        //     msg = "expression" + msg + ".png";
        //     hall.LOGD(this._TAG, "chat msg is = " + msg);
        // }

        let params = {
            'cmd' : SML.Event.CMD_TABLE,
            'params' : {
                'action' : SML.Event.ACTION_CHAT,
                'gameId' : SML.GameData.gameId,
                'roomId' : roomId,
                'tableId' : tableId,
                'seatId' : seatId,
                'msg': msg,
                'isFace' : isFace,
                'voiceIdx' : voiceIndex
            }
        };

        this._sendCmd(params);
    },


    getCash:function(value) {
        var params = {
            'cmd': SML.Event.CMD_CASH,
            'params': {
                "action":SML.Event.ACTION_GET_CASH,
                'gameId': SML.GameData.gameId,
                'wxappId': SML.GameData.wxAppId,
                'value': value
            }
        };
        this._sendCmd(params);
    },

    /*
     typeid
     2 - 系统消息
     1 - 游戏消息
    */
    getUserRewardInfo: function() {
        var params = {
            'cmd': SML.Event.CMD_MESSAGE,
            'params' : {
                'action': SML.Event.ACTION_LIST,
                'gameId': SML.GameData.gameId,
                'typeid':1,
            }
        };
        this._sendCmd(params);
    },
    getPersonalMsg: function() {
        var params = {
            'cmd': SML.Event.CMD_MESSAGE,
            'params': {
                'action': SML.Event.ACTION_PRIVATE_UPDATE,
                'gameId': SML.GameData.gameId,
                'pagenum': 0
            }
        };
        this._sendCmd(params);
    },
    getGlobalMsg: function() {
        var params = {
            'cmd': SML.Event.CMD_MESSAGE,
            'params': {
                'action': SML.Event.ACTION_GLOBAL_UPDATE,
                'gameId': SML.GameData.gameId,
                'pagenum': 0

            }
        };
        this._sendCmd(params);
    },

    /*
     * 领取分享奖励
     */
    getShareReward: function(pointId) {
        if (!pointId || typeof pointId != 'number') {
            return;
        }
        var params = {
            'cmd': SML.Event.CMD_HALL_SHARE2,
            'params': {
                'action': SML.Event.ACTION_GET_REWARD,
                'gameId': SML.GameData.gameId,
                'pointId' : pointId
            }
        };

        this._sendCmd(params);
    },

    /*
     * 获取分享埋点信息
     */
    getShare3Burials: function() {
        var params = {
            'cmd': SML.Event.CMD_HALL_SHARE3,
            'params': {
                'action': SML.Event.ACTION_GET_BURIALS,
                'gameId': SML.GameData.gameId,
            }
        };

        this._sendCmd(params);
    },

     /*
     * 领取新分享奖励
     */
    getShare3Reward: function(pointId,whereToShare) {
        if (!pointId || typeof pointId != 'number') {
            SML.Output.err('getShare3Reward err: pointId=' + pointId + ' whereToShare=' + whereToShare);
            return;
        }
        var params = {
            'cmd': SML.Event.CMD_HALL_SHARE3,
            'params': {
                'action': SML.Event.ACTION_GET_SHARE_REWARD,
                'gameId': SML.GameData.gameId,
                'pointId': pointId,
                "whereToShare":whereToShare,
            }
        };

        this._sendCmd(params);
    },

    /*
     * 获取埋点详细信息
     */
    getShare3BurialInfo: function(burialId) {
        var params = {
            'cmd': SML.Event.CMD_HALL_SHARE3,
            'params': {
                'action': SML.Event.ACTION_GET_BURIAL_SHARE,
                'gameId': SML.GameData.gameId,
                'burialId': burialId,
                'urlParams': {
                    'userName' : SML.UserInfo.userName
                }
            }
        };

        this._sendCmd(params);
    },

    /**
     * 绑定邀请人, inviteCode邀请我的人userId
     */
    bindInviteCode:function (inviteCode) {
        var userId = parseInt(inviteCode);
        if (!userId || isNaN(userId)) {
            return;
        }
        var params = {
            "cmd": SML.Event.CMD_GAME,
            "params": {
                "action": SML.Event.ACTION_BIND_INVITE_CODE,
                'gameId': SML.GameData.gameId,
                "inviteCode": userId,
            }
        };

        this._sendCmd(params);
    },

    /**
     * 查询邀请奖励
     */
    queryInviteInfo:function () {
        var params = {
            "cmd": SML.Event.CMD_GAME,
            "params": {
                "action": SML.Event.ACTION_QUERY_INVITE_CODE,
                'gameId': SML.GameData.gameId
            }
        };
        this._sendCmd(params);
    },

    /**
     * 领取推荐奖励 inviteeId：被我邀请的人userId
     */
    getInviteReward:function (inviteeId) {
        if(!inviteeId){
            return;
        }
        var params = {
            "cmd": SML.Event.CMD_GAME,
            "params": {
                "action": SML.Event.ACTION_GET_INVITE_REWARD,
                'gameId': SML.GameData.gameId,
                "inviteeId": inviteeId,
            }
        };

        this._sendCmd(params);
    },

    /**
     * 获取红包券列表
     */
    getCouponDetails:function() {
        var params = {
            "cmd": SML.Event.CMD_HALL,
            "params": {
                "action": SML.Event.ACTION_COUPON_DETAILS,
                'gameId': SML.GameData.gameId
            }
        };

        this._sendCmd(params);
    },

    //获取背包信息
    getBagInfo: function() {
        var params = {
            'cmd': SML.Event.CMD_BAG,
            'params': {
                'action': 'update'
            }
        };
        this._sendCmd(params);
    },

    /**
     * 恢复段位
     */
    recoverMatchTitle: function () {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params': {
                'action': SML.Event.ACTION_SEGMENT_RECOVER,
                'gameId': SML.GameData.gameId
            }
        };
        this._sendCmd(params);
    },


    // tbox 领取宝箱任务
    getTboxReward:function () {
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params':{
                'gameId': SML.GameData.gameId,
                'action': SML.Event.ACTION_TBBOX_GET_REWARD
            }
        };
        this._sendCmd(params);
    },

    /**
     * 获取视频广告信息
     */
    getVideoAdInfo(){
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params':{
                'gameId': SML.GameData.gameId,
                'action': SML.Event.ACTION_AD_INFO
            }
        };
        this._sendCmd(params);
    },

    /**
     * 看完视频广告信息
     */
    watchVideoAd(adUnitId){
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params':{
                'gameId': SML.GameData.gameId,
                'action': SML.Event.ACTION_WATCH_AD,
                'adId': adUnitId
            }
        };
        this._sendCmd(params);
    },

    /**
     * 请求用户分享行为信息（用于替换为视频广告）
     */
    getUserShareBehaviorInfo(){
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params':{
                'gameId': SML.GameData.gameId,
                'action': SML.Event.ACTION_USER_SHARE_BEHAVIOR_INFO
            }
        };
        this._sendCmd(params);
    },

    /**
     * 用户分享干预处理，通过埋点干预
     */
    dealBurialBehavior(burialId){
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params':{
                'gameId': SML.GameData.gameId,
                'action': SML.Event.ACTION_USER_SHARE_BEHAVIOR_DEAL,
                'burialId': burialId
            }
        };
        this._sendCmd(params);
    },

    /**
     * 获取提现最小限额
     */
    getWithdrawMin(){
        var params = {
            'cmd': SML.Event.CMD_DIZHU,
            'params':{
                'gameId': SML.GameData.gameId,
                'action': SML.Event.ACTION_COUPON_WITHDRAW
            }
        };
        this._sendCmd(params);
    },

    /**
     * 新版快开
     */
    quickStartGame(playMode, roomId, mixId, innerTable){
        var params = {
            'cmd': SML.Event.CMD_GAME,
            'params': {
                'action': SML.Event.CMD_QUICK_START,
                'gameId': SML.GameData.gameId,
                'segment': SML.Model.MatchTitle.mSegment,
            }
        }

        if (typeof(playMode) != 'undefined' && playMode != null) {
            params['params']['playMode'] = playMode;
        }

        if (typeof(roomId) != 'undefined' && roomId != null) {
            params['params']['roomId'] = roomId;
        }

        if (typeof(mixId) != 'undefined' && mixId != null) {
            params['params']['mixId'] = mixId;
        }

        if (typeof(innerTable) != 'undefined' && innerTable != null) {
            params['params']['innerTable'] = innerTable;
        }

        this._sendCmd(params);

    }

};