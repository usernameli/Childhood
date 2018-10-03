var baseWindow = require("baseWindow");
cc.Class({
    extends:baseWindow,
    properties:{

    },
    onLoad()
    {
        this._super();
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);


    },
    wxShareSuccess(argument)
    {
        cc.wwx.OutPut.log("ResultFirstWindow wxShareSuccess",JSON.stringify(argument));
        if( !argument["isShareGroupId"] && argument["burialId"] === cc.wwx.BurialShareType.DailyInviteGroupAlive)
        {
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_THIRD_LINE_OF_EXPLOSIONS);
            this.closeWindow();

        }
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);

    },
    shareGroupCallBack()
    {
        cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupAlive);

    }
});