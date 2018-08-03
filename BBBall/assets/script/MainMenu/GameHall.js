cc.Class({
    extends:cc.Component,
    properties:{
        _tag:"GameHall"

    },
    onLoad()
    {
        if(!cc.wwx)
        {
            initMgr();
        }
    },
    checkpointMode()
    {
        //关卡模式
        cc.wwx.UserInfo.playMode = "checkPoint";
        cc.wwx.SceneManager.switchScene("CheckPoint");


    },
    classicMode()
    {
        //经典模式
        cc.wwx.UserInfo.playMode = "classic";

        cc.wwx.SceneManager.switchScene("GameScene");

    },
    ball100Mode()
    {
        //白球模式
        cc.wwx.UserInfo.ballInfo.ballNum = 100;
        cc.wwx.UserInfo.playMode = "ball100";

        cc.wwx.MapCheckPoint.get100MapCheckPointData(function (checkPointData) {
            cc.wwx.OutPut.log("clickItemCallBack: " + JSON.stringify(checkPointData));
            cc.wwx.UserInfo.checkPointData = checkPointData;
            cc.wwx.SceneManager.switchScene("GameScene");

        });

    },
    signInReward()
    {
        //签到奖励
        cc.wwx.PopWindowManager.popWindow("prefab/signIn/SignIn");

    },
    showAdsReward()
    {
        //看广告得奖励
    },
    rank()
    {
        //排行榜
    },
    shop()
    {
        //商城
        // let ballPrefab = cc.instantiate(this.shopPrefab);
        // this.node.addChild(ballPrefab);

        cc.wwx.PopWindowManager.popWindow("prefab/shop/Shop");

    },
    reward()
    {
        //奖励
        // let ballPrefab = cc.instantiate(this.invateRewardPrefab);
        // this.node.addChild(ballPrefab);

        cc.wwx.PopWindowManager.popWindow("prefab/invate/Invate");


    },
    skin()
    {
        //皮肤
    }
});