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
        gameReStart:{
            default:null,
            type:cc.Node
        },
        otherTip:{
            default:null,
            type:cc.Label
        },
        _gameStart:false,
        _clickGoBack:false,
    },
    onLoad()
    {
        this._gameStart = true;
        this._clickGoBack = false;
        cc.wwx.Util.adaptIpad();
        cc.wwx.Util.adaptIphoneX(this.topNode);
        cc.wwx.Loader.loadImg(cc.wwx.UserInfo.userPic, this.selfHeadIcon);
        this.selfUserName.string = cc.wwx.UserInfo.userName;
        this.selfDiamondNum.string = cc.wwx.UserInfo.bagData.diamondCount;
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_PK_QUEUE_LEAVE,this.levelRoomCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_PK_QUEUE_RANDOM_MATCH,this.randomMatchRoomCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE_INFO,this._tableInfoCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);


        cc.wwx.OutPut.log("cc.wwx.VS.GameOver: ",cc.wwx.VS.GameOver);
        cc.wwx.OutPut.log("cc.wwx.VS.JoinFriendRoom: ",cc.wwx.VS.JoinFriendRoom);
        if(cc.wwx.VS.GameOver)
        {
            this.invateBtn.active = false;
            this.matchBtn.active = false;
            this._tableInfoCallBack();
            this.gameReStart.active = true;
            cc.wwx.VS.GameOver = false;
        }
        else if(cc.wwx.VS.JoinFriendRoom)
        {
            this._tableInfoCallBack();
            cc.wwx.VS.JoinFriendRoom = false;
            this.invateBtn.active = false;
            this.matchBtn.active = false;
        }
        else
        {
            cc.wwx.Timer.setTimer(this,this.showBtnCallBack,0.5,0,0);
        }


    },
    onDestroy()
    {
        cc.wwx.AudioManager.stopMusic();
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_PK_QUEUE_LEAVE,this.levelRoomCallBack,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_PK_QUEUE_RANDOM_MATCH,this.randomMatchRoomCallBack,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_TABLE_INFO,this._tableInfoCallBack,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);
        cc.wwx.Timer.cancelTimer(this,this.showBtnCallBack);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);

    },
    wxShareSuccess(argument)
    {
        cc.wwx.OutPut.log("InvateRewardWindow wxShareSuccess",JSON.stringify(argument));
        if(argument["burialId"] === cc.wwx.BurialShareType.DailyInviteRoomJoin)
        {

            this.invateBtn.active = false;
            this.matchBtn.active = false;
            this.vsNode.active = true;
            this.randomMatchTip.active = true;

            let randomMatchLabel = this.randomMatchTip.getComponent(cc.Label);
            randomMatchLabel.string = "等待好友的加入......"
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
            cc.wwx.VS.GameOver = false;

            cc.wwx.SceneManager.switchScene("GameVSScene");


        }
        else if(params["action"] === "leave")
        {
            if(params["leaveUserId"] === cc.wwx.UserInfo.userId)
            {

                if(this._clickGoBack)
                {
                    this._clickGoBack = false;
                    cc.wwx.SceneManager.switchScene("GameVSRoom");
                    return;
                }
                this.gameReStart.active = false;
                this.invateBtn.active = true;
                this.matchBtn.active = true ;
                this.vsNode.active = false;
                this.otherInfoNode.active = false;
                this.sumDiamondNode.active = false;
                cc.wwx.Timer.setTimer(this,this.showBtnCallBack,0.5,0,0);
            }
            else
            {
                //别人离桌

            }
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
                    this.invateBtn.active = false;
                    this.matchBtn.active = false;
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
            let consumeCount = cc.wwx.VS.getRoomConsumeItemCount(cc.wwx.VS.RoomID);
            this.sumDiamondSum.string = (consumeCount * 2).toString();
            this.otherDiamondNum.string = parseInt(this.otherDiamondNum.string) - consumeCount;
            this.selfDiamondNum.string = parseInt(this.selfDiamondNum.string) - consumeCount;

            if(cc.wwx.VS.GameOver)
            {
                let self = this;
                this.scheduleOnce(function(){
                    if(cc.wwx.VS.GameResultWin)
                    {
                        cc.wwx.Util.getDiamondAnim(self.selfNode,cc.v2(0,250),cc.v2(0,0));

                    }
                    else
                    {
                        cc.wwx.Util.getDiamondAnim(self.selfNode,cc.v2(0,250),cc.v2(0,500));

                    }

                },1);


            }
            else
            {
                cc.wwx.Util.getDiamondAnim(this.selfNode,cc.v2(0,0),cc.v2(0,250));
                cc.wwx.Util.getDiamondAnim(this.selfNode,cc.v2(0,500),cc.v2(0,250));
            }
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
            let randomMatchLabel = this.randomMatchTip.getComponent(cc.Label);
            randomMatchLabel.string = "正在搜索对手......";
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
        if(this.gameReStart.active)
        {
            this._clickGoBack = true;
            cc.wwx.TCPMSG.gameLevelTable(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID);

        }
        else
        {
            cc.wwx.TCPMSG.levelPkQueueRoom(cc.wwx.VS.RoomID);

        }
        //

    },
    invateFriendCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.TCPMSG.inviteFriendPkQueueRoom(cc.wwx.VS.RoomID);

    },
    randomMatchingCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();

        cc.wwx.TCPMSG.randomMatchPkQueueRoom(cc.wwx.VS.RoomID);


    },
    gameContinueCallBack()
    {
        cc.wwx.VS.GameOver = false;
        cc.wwx.TCPMSG.gamePlayerReady(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID);

    },
    gameNoContinueCallBack()
    {

        cc.wwx.TCPMSG.gameLevelTable(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID);
    //


    }
});