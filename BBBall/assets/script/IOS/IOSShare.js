cc.Class({
    extends:cc.Component,
    properties:{

        prefabShengxing : cc.Prefab,    // 升星

    },
    onLoad()
    {
        initMgr();
        let position = [];
        let self = this;



    },
    shareTestCallBack()
    {

        for(let i = 0; i < 100;i++)
        {
            let segment = cc.wwx.Util.segmentStarCalculation(i);
            cc.wwx.OutPut.log("shareTestCallBack: star num: "+ i+ " 段位: " + segment)
        }

        cc.wwx.PopWindowManager.popWindow("prefab/GameVSResultWindow","GameVSResultWindow",{starNum:100,updownF:true});

        // this.node.addChild(action);

        // cc.wwx.IOSSDK.IOSShare("弹球传奇","快乐消消消","https://open.weixin.qq.com");
    }
})