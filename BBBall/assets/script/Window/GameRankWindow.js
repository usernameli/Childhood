var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        _tag:"GameRankWindow"
    },
    onLoad()
    {
        this._isAction = false;
        this._super();

        cc.wwx.OutPut.log(this._tag,"mFriendRankList: ",JSON.stringify(cc.wwx.UserInfo.mFriendRankList))
    },
    closeWindowCallBack()
    {
        this.closeWindow();
    },
    groupRankShareCallBack()
    {
        cc.wwx.Share.runShare(cc.wwx.BurialShareType.FetchGroupID);
    }
});