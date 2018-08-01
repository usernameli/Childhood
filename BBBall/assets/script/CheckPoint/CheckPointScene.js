cc.Class({
    extends:cc.Component,
    properties:{

        _tag:"CheckPointScene",
    },
    onLoad()
    {
        if(!cc.wwx)
        {
            initMgr();
        }

    },
    clickGoHome()
    {
        cc.director.loadScene("GameHall");

    },
})