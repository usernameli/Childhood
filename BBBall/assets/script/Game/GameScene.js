cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad()
    {
        if(!cc.wwx)
        {
            initMgr();
        }
    },

});