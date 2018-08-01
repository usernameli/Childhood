cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad()
    {

    },
    onDestroy()
    {
        cc.wwx.OutPut.log("eliminate ondestroy");
    },
    animatedPlayCallBack()
    {
        this.node.destroy();
    },
})