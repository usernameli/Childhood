var engine = require("MatchvsEngine");
var response = require("MatchvsResponse");
var GLB = require("Glb");
var mvs = require("Matchvs");
var msg = require("MatvhvsMessage");
cc.Class({
    extends:cc.Component,
    properties:{
        topNode:{
            default:null,
            type:cc.Node
        },
        invateBtn:{
            default:null,
            type:cc.Node
        },
        otherNode:{
            default:null,
            type:cc.Node
        },
        selfNode:{
            default:null,
            type:cc.Node
        },
        matchBtn:{
            default:null,
            type:cc.Node
        },
        vsNode:{
            default:null,
            type:cc.Node
        },
        randomMatchAnimNode:{
            default:null,
            type:cc.Node
        },
        randomMatchTip:{
            default:null,
            type:cc.Node
        },
        selfHeadIcon:{
            default:null,
            type:cc.Node
        },
        selfUserName:{
            default:null,
            type:cc.Label
        },
        selfDiamondNum:{
            default:null,
            type:cc.Label
        },
        otherInfoNode:{
            default:null,
            type:cc.Node
        },
        otherHeadIcon:{
            default:null,
            type:cc.Node
        },
        otherUserName:{
            default:null,
            type:cc.Label
        },
        otherDiamondNum:{
            default:null,
            type:cc.Label
        },
        sumDiamondNode:{
            default:null,
            type:cc.Node,
        },
        sumDiamondSum:{
            default:null,
            type:cc.Label
        },
        _gameStart:false,
    },
    onLoad()
    {
        this._gameStart = true;
        cc.wwx.Util.adaptIpad();
        cc.wwx.Util.adaptIphoneX(this.topNode);
        var self = this;
        this.initEvent(self);
        cc.wwx.Loader.loadImg(GLB.avatar, this.selfHeadIcon);
        this.selfUserName.string = GLB.name;
        this.selfDiamondNum.string = cc.wwx.UserInfo.bagData.diamondCount;
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_PK_QUEUE_LEAVE,this.levelRoomCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_PK_QUEUE_RANDOM_MATCH,this.randomMatchRoomCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE_INFO,this._tableInfoCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);
        cc.wwx.Timer.setTimer(this,this.showBtnCallBack,0.5,0,0);
    },
    onDestroy()
    {
        cc.wwx.AudioManager.stopMusic();
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_PK_QUEUE_LEAVE,this.levelRoomCallBack,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_PK_QUEUE_RANDOM_MATCH,this.randomMatchRoomCallBack,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_TABLE_INFO,this._tableInfoCallBack,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);
        cc.wwx.Timer.cancelTimer(this,this.showBtnCallBack);

    },
    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    initEvent:function (self) {
        response.prototype.init(self);
        this.node.on(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
        this.node.on(msg.MATCHVS_JOIN_ROOM_RSP,this.onEvent,this);
        this.node.on(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.onEvent,this);
        this.node.on(msg.MATCHVS_LEAVE_ROOM,this.onEvent,this);
        this.node.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY,this.onEvent,this);
        this.node.on(msg.MATCHVS_JOIN_OPEN_NOTIFY,this.onEvent,this);
        this.node.on(msg.MATCHVS_JOIN_OPEN_RSP,this.onEvent,this);
        this.node.on(msg.MATCHVS_JOIN_OVER_RSP,this.onEvent,this);
        this.node.on(msg.MATCHVS_JOIN_OVER_NOTIFY,this.onEvent,this);
        this.node.on(msg.MATCHVS_NETWORK_STATE_NOTIFY,this.onEvent,this);
        this.node.on(msg.MATCHVS_KICK_PLAYER, this.onEvent, this)
        this.node.on(msg.MATCHVS_KICK_PLAYER_NOTIFY, this.onEvent, this)
    },
    /**
     * 事件接收方法
     * @param event
     */
    onEvent:function (event) {
        var eventData = event.detail;
        if (eventData == undefined) {
            eventData = event;
        }
        // var checkBox = this.joinopen.getComponent(cc.Toggle);
        cc.wwx.OutPut.log("GameMatchVSReady onEvent: ",event.type);
        cc.wwx.OutPut.log("GameMatchVSReady eventData: ",JSON.stringify(eventData));
        switch (event.type) {

            case msg.MATCHVS_JOIN_ROOM_RSP:
                if(eventData.userInfoList.length === 0)
                {
                    this.invateBtn.active = false;
                    this.matchBtn.active = false;
                    this.vsNode.active = true;
                    this.randomMatchAnimNode.active = true;
                    this.randomMatchTip.active = true;
                    cc.wwx.AudioManager.playRandomMatch();
                }
                this.joinRoom(eventData.userInfoList);

                break;
            case msg.MATCHVS_JOIN_ROOM_NOTIFY:
                this.userList.push(eventData.roomUserInfo)
                this.initUserView(this.userList);
                break;
            case msg.MATCHVS_LEAVE_ROOM:
                // cc.director.loadScene('Lobby');
                cc.wwx.SceneManager.switchScene("GameMatchVSRoom");
                break;
            case msg.MATCHVS_LEAVE_ROOM_NOTIFY:
                this.removeView(eventData.leaveRoomInfo);
                break;
            case msg.MATCHVS_JOIN_OVER_NOTIFY:
                // checkBox.isChecked = false;
                console.log("关闭");
                break;
            case msg.MATCHVS_JOIN_OVER_RSP:
                // checkBox.isChecked = false;
                console.log("关闭");
                break;
            case msg.MATCHVS_JOIN_OPEN_RSP:
                // checkBox.isChecked = true;
                console.log("打开");
                break;
            case msg.MATCHVS_JOIN_OPEN_NOTIFY:
                // checkBox.isChecked = true;
                console.log("打开");
                break;
            case msg.MATCHVS_ERROE_MSG:
                GLB.roomID = "";
                if (eventData.errorCode === 400) {
                    cc.wwx.SceneManager.switchScene("GameMatchVSRoom");

                }
                break;
            case msg.MATCHVS_KICK_PLAYER:
                this.removeView(eventData.kickPlayerRsp);
                break;
            case msg.MATCHVS_KICK_PLAYER_NOTIFY:
                this.removeView(eventData.kickPlayerNotify);
                break;
            case msg.MATCHVS_NETWORK_STATE_NOTIFY:
                if (eventData.netNotify.state === 1) {
                    engine.prototype.kickPlayer(eventData.netNotify.userID,"你断线了，被提出房间")
                }
                break;
        }

    },
    /**
     * 进入房间业务逻辑
     * @param userInfoList
     */
    joinRoom: function (userInfoList) {
        // this.labelRoomID.string = userInfoList.roomID;
        GLB.roomID = userInfoList.roomID;
        // this.playerNameOne.string = GLB.name;
        this.userList = userInfoList;
        // this.initUserView(this.userList);
        if (this.userList.length == GLB.MAX_PLAYER_COUNT-1) {
            engine.prototype.joinOver();
            // this.startGame();
        }
    },
    showBtnCallBack()
    {
        this.invateBtn.runAction(cc.fadeIn(0.5));
        this.matchBtn.runAction(cc.fadeIn(0.5));


    },
    _tableCallCallBack(params)
    {
        if(params["action"] === "game_start")
        {
            cc.wwx.VS.FirstHand = params["firsHand"];
            cc.wwx.VS.FirstBlock = params["firstBlock"];
            cc.wwx.VS.NewBlocks = params["firstBlock"];
            cc.wwx.VS.RoundUserID = cc.wwx.VS.FirstHand;
            this._gameStart = true;


        }
    },
    _tableInfoCallBack()
    {
        let userInfo = cc.wwx.VS.TableInfo["result"]["userInfo"];
        let foundNode = false;
        if(userInfo.length === 2)
        {
            for(let i = 0; i < userInfo.length;i++)
            {
                if(userInfo[i]["userId"] !== cc.wwx.UserInfo.userId)
                {
                    this.otherInfoNode.active = true;
                    this.randomMatchAnimNode.active = false;
                    this.randomMatchTip.active = false;
                    this.vsNode.active = false;
                    this.sumDiamondNode.active = true;
                    this.otherUserName.string = userInfo[i]["userName"];
                    this.otherDiamondNum.string = userInfo[i]["diamondNum"];
                    cc.wwx.Loader.loadImg(userInfo[i]["purl"], this.otherHeadIcon);
                    cc.wwx.AudioManager.playMatchFoundSound();
                    foundNode = true;
                    break;
                }
            }
        }

        if(foundNode)
        {
            cc.wwx.Util.getDiamondAnim(this.selfNode,cc.v2(0,0),cc.v2(0,250));
            cc.wwx.Util.getDiamondAnim(this.selfNode,cc.v2(0,500),cc.v2(0,250));
            let consumeCount = cc.wwx.VS.getRoomConsumeItemCount(cc.wwx.VS.RoomID);
            this.sumDiamondSum.string = (consumeCount * 2).toString();
            this.otherDiamondNum.string = parseInt(this.otherDiamondNum.string) - consumeCount;
            this.selfDiamondNum.string = parseInt(this.selfDiamondNum.string) - consumeCount;
            let self = this;
            setTimeout(function () {

                if(self._gameStart)
                {
                    cc.wwx.SceneManager.switchScene("GameVSScene");
                }
            },3000);
        }

    },
    randomMatchRoomCallBack(arugment)
    {
        if(arugment["success"] === 1)
        {
            this.invateBtn.active = false;
            this.matchBtn.active = false;
            this.vsNode.active = true;
            this.randomMatchAnimNode.active = true;
            this.randomMatchTip.active = true;
            cc.wwx.AudioManager.playRandomMatch();
        }
    },
    levelRoomCallBack(arugment)
    {
        cc.wwx.OutPut.log("levelRoomCallBack: ",JSON.stringify(arugment));

        if(arugment["success"] === 1)
        {

            cc.wwx.SceneManager.switchScene("GameVSRoom");
        }
    },
    goBackHallCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        GLB.roomID = "";
        cc.wwx.OutPut.log("goBackHallCallBack: ");

        engine.prototype.leaveRoom();
        // cc.wwx.TCPMSG.levelPkQueueRoom(cc.wwx.VS.RoomID);
        //

    },
    invateFriendCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.TCPMSG.inviteFriendPkQueueRoom(cc.wwx.VS.RoomID);

    },
    randomMatchingCallBack()
    {
        // cc.wwx.AudioManager.playAudioButton();

        GLB.matchType = GLB.RANDOM_MATCH; // 修改匹配方式为随机匹配
        GLB.syncFrame = false;
        engine.prototype.joinRandomRoom(GLB.MAX_PLAYER_COUNT, "随机匹配");

        // cc.wwx.TCPMSG.randomMatchPkQueueRoom(cc.wwx.VS.RoomID);


    }
});