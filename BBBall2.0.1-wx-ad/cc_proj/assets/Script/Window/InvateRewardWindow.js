var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        shareQunBtn:{
            default:null,
            type:cc.Node
        },
        invateTipLabel:{
            default:null,
            type:cc.Label
        }
    },
    onLoad()
    {
        this._isAction = false;

        this._super();
        this.shareQunBtn.removeAllChildren();
        let dayShareGroupRewardCount = cc.wwx.UserInfo.gdata["dayShareGroupRewardLeftCount"];
        if(dayShareGroupRewardCount > 0)
        {
            cc.wwx.Util.addRedPoint(this.shareQunBtn,dayShareGroupRewardCount,cc.v2(100,45));

        }

        let haveNum = 3 - dayShareGroupRewardCount;
        this.invateTipLabel.string = "每天获取免费领取宝石("  + haveNum.toString() +  "/3)";


        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_USER_INFO, this.gameUserInfo, this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);



    },
    gameUserInfo()
    {
        this.shareQunBtn.removeAllChildren();
        let dayShareGroupRewardCount = cc.wwx.UserInfo.gdata["dayShareGroupRewardLeftCount"];
        if(dayShareGroupRewardCount > 0)
        {
            cc.wwx.Util.addRedPoint(this.shareQunBtn,dayShareGroupRewardCount,cc.v2(100,45));

        }

        let haveNum = 3 - dayShareGroupRewardCount;
        // this.invateTipLabel.string = "每天分享不同的群("  + haveNum.toString() +  "/3)，奖励       20宝石"
        this.invateTipLabel.string = "每天获取免费领取宝石("  + haveNum.toString() +  "/3)";

    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_USER_INFO, this.gameUserInfo, this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);

    },
    closeWindowCallBack()
    {
        this.closeWindow();

    },
    wxShareSuccess(argument)
    {
        cc.wwx.OutPut.log("InvateRewardWindow wxShareSuccess",JSON.stringify(argument));
        if(!argument["isShareGroupId"] && argument["burialId"] === cc.wwx.BurialShareType.DailyInviteGroup)
        {
            cc.wwx.TCPMSG.getShareReward("group");

        }
    },
    invateGroupCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        // cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroup);
        // return;

        let dayShareGroupRewardCount = cc.wwx.UserInfo.gdata["dayShareLeftCount"];
        if(CC_WECHATGAME && dayShareGroupRewardCount === 0 && cc.wwx.VideoAD.getShowVideoAdIsLoaded())
        {
            cc.wwx.VideoAD.showVideoAd(function (end) {

                if(end)
                {
                    cc.wwx.TCPMSG.getShareReward("group");

                }
            },function () {

                cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroup);

            })
        }
        else
        {
            cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroup);

        }

    },
    invateFriendCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteFriend);


    }
});