cc.Class({
    extends:cc.Component,
    properties:{
        topNode:{
            default:null,
            type:cc.Node
        },
        diamondsNum:{
            default:null,
            type:cc.Label
        },
        roomNeedDiamondsNum:{
            default:[],
            type:cc.Label
        }
    },
    onLoad()
    {
        cc.wwx.Util.adaptIpad();
        cc.wwx.Util.adaptIphoneX(this.topNode);
        this.diamondsNum.string = cc.wwx.UserInfo.bagData.diamondCount;
        for(let i = 0; i < 4;i++)
        {
            this.roomNeedDiamondsNum[i].string = cc.wwx.VS.RoomList[i]["consumeItemCount"];
        }
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_PK_QUEUE_ENTER,this.pkQueueEnter,this);
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_PK_QUEUE_ENTER,this.pkQueueEnter,this);

    },
    pkQueueEnter()
    {
        cc.wwx.SceneManager.switchScene("GameVSReady");
    },
    goBackHallCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.SceneManager.switchScene("GameHall");

    },
    plusDiamondCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.TipManager.showMsg("邀请好友或分享可以获得更多宝石")

    },
    roomClickCallBack(event, customEventData)
    {

        cc.wwx.OutPut.log("roomClickCallBack customEventData: ",customEventData);
        cc.wwx.AudioManager.playAudioButton();
        // pk_queue_enter
        cc.wwx.TCPMSG.enterPkQueneRoom(cc.wwx.VS.RoomList[customEventData - 1]["roomId"]);

        // cc.wwx.SceneManager.switchScene("GameVSReady");
    },
})