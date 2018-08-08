cc.Class({
    extends:cc.Component,
    properties:{
        sumStarNum:{
            default:null,
            type:cc.Label
        },

        _tag:"CheckPointScene",
    },
    onLoad()
    {
        if(!cc.wwx)
        {
            initMgr();
        }
        this.sumStarNum.string = cc.wwx.UserInfo.gdata["levelTotalStar"];
    },
    clickGoHome()
    {
        cc.director.loadScene("GameHall");

    },
})