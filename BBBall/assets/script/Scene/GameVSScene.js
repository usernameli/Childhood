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
        mySelfTipNode:{
            default:null,
            type:cc.Node
        },
        opponentTipNode:{
            default:null,
            type:cc.Node
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
        centerGameNode:{
            default:null,
            type:cc.Node
        }

    },
    onLoad()
    {
        cc.wwx.Util.adaptIpad();
        let userInfo = cc.wwx.VS.TableInfo["result"]["userInfo"];

        for(let i = 0; i < userInfo.length;i++)
        {
            if(userInfo[i]["userId"] === cc.wwx.UserInfo.userId)
            {
                this.mySelfNickName.string = userInfo[i]["userName"];
                this.mySelfSegment.string = userInfo[i]["segmentStar"];

                cc.wwx.Loader.loadImg(userInfo[i]["purl"], this.mySelfHeadIcon);

            }
            else
            {
                this.opponentNickName.string = userInfo[i]["userName"];
                this.opponentSegment.string = userInfo[i]["segmentStar"];
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
    },
    goBackCallBack()
    {
        cc.wwx.TCPMSG.gameLevelTable(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID);
    },

});