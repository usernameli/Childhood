var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        giveUp:{
            default:null,
            type:cc.Node
        }
    },
    onLoad()
    {
        this._super();
        if(this._params["level"])
        {
            this.giveUp.active = false;
        }
        else
        {
            this.giveUp.active = true;

        }
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);

    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);

    },
    getBaoRewardCallBack()
    {
        if(this._params["level"])
        {
            cc.wwx.TCPMSG.openGiftBox(cc.wwx.UserInfo.checkPointID);
            this.closeWindow();

        }
        else
        {
            if(CC_WECHATGAME && cc.wwx.VideoAD.getShowVideoAdIsLoaded())
            {
                let that = this;
                cc.wwx.VideoAD.showVideoAd(function (end) {

                    if(end)
                    {
                        cc.wwx.TCPMSG.openGameBox(cc.wwx.UserInfo.playMode,-1);
                        that.closeWindow();


                    }
                },function () {

                    cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupBox);

                })
            }
            else
            {
                cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupBox);

            }

        }


    },
    wxShareSuccess(argument)
    {
        cc.wwx.OutPut.log("GameBoxWindow wxShareSuccess",JSON.stringify(argument));
        if(!argument["isShareGroupId"] && argument["burialId"] === cc.wwx.BurialShareType.DailyInviteGroupBox)
        {
            if(cc.wwx.UserInfo.playMode === "level")
            {
                cc.wwx.TCPMSG.openGameBox(cc.wwx.UserInfo.playMode,cc.wwx.UserInfo.checkPointID);

            }
            else
            {
                cc.wwx.TCPMSG.openGameBox(cc.wwx.UserInfo.playMode,-1);

            }
            this.closeWindow();


        }
    },
    giveUpCallBack()
    {
        this.closeWindow();
    },
});