cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad()
    {
        initMgr();
    },
    shareTestCallBack()
    {
        cc.wwx.IOSSDK.IOSShare("弹球传奇","快乐消消消","https://open.weixin.qq.com");
    }
})