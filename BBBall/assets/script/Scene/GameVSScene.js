cc.Class({
    extends:cc.Component,
    properties:{
        roomName:{
            default:null,
            type:cc.Sprite
        },
        adNode:{
            default:null,
            type:cc.Node,
        },
        mySelfOperationAnimteNode:{
            default:null,
            type:cc.Node
        },
        opponentOperationAnimteNode:{
            default:null,
            type:cc.Node
        },
        mySelfProgressBar:{
            default:null,
            type:cc.ProgressBar
        },
        opponentProgressBar:{
            default:null,
            type:cc.ProgressBar
        },
        opponentNickName:{
            default:null,
            type:cc.Label
        },
        opponentSegment:{
            default:null,
            type:cc.Label
        },
        opponentHeadIcon:{
            default:null,
            type:cc.Node
        },
        mySelfNickName:{
            default:null,
            type:cc.Label
        },
        mySelfSegment:{
            default:null,
            type:cc.Label
        },
        mySelfHeadIcon:{
            default:null,
            type:cc.Node
        },
        tableTypeList:{
            default:[],
            type:cc.SpriteFrame
        },
        tablePlayMode:{
            default:null,
            type:cc.Sprite
        }

    },
    onLoad()
    {
        cc.wwx.Util.adaptIpad();

        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        // physicsManager.debugDrawFlags =
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        let userInfo = cc.wwx.VS.TableInfo["result"]["userInfo"];

        for(let i = 0; i < userInfo.length;i++)
        {
            if(userInfo[i]["userId"] === cc.wwx.UserInfo.userId)
            {
                this.mySelfNickName.string = userInfo[i]["userName"];
                this.mySelfSegment.string = userInfo[i]["pkTotalStar"];

                cc.wwx.Loader.loadImg(userInfo[i]["purl"], this.mySelfHeadIcon);

            }
            else
            {
                this.opponentNickName.string = userInfo[i]["userName"];
                this.opponentSegment.string = userInfo[i]["pkTotalStar"];
                cc.wwx.Loader.loadImg(userInfo[i]["purl"], this.opponentHeadIcon);

            }
        }

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE,this._tableCallBack,this);

    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_TABLE,this._tableCallBack,this);

    },
    _tableCallBack(params)
    {
        if(params["action"] === "leave")
        {


        }
        else if(params["action"] === "gameOver")
        {
            let winLoseInfo = params["winLoseInfo"];

            if(cc.wwx.UserInfo.userId === params["winUserId"])
            {
                let pkTotalStar = winLoseInfo[params["winUserId"].toString()]["pkTotalStar"];
                cc.wwx.PopWindowManager.popWindow("prefab/GameVSResultWindow","GameVSResultWindow",{starNum:pkTotalStar,updownF:true});
            }
            else if(cc.wwx.UserInfo.userId === params["loseUserId"])
            {
                let pkTotalStar = winLoseInfo[params["loseUserId"].toString()]["pkTotalStar"];
                cc.wwx.PopWindowManager.popWindow("prefab/GameVSResultWindow","GameVSResultWindow",{starNum:pkTotalStar,updownF:false});

            }

        }
    },
    goBackCallBack()
    {
        // cc.wwx.TCPMSG.levelPkQueueRoom(cc.wwx.VS.RoomID);
        cc.wwx.TCPMSG.shutGameOver(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID);

        // cc.wwx.TCPMSG.gameLevelTable(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID);
    },

});