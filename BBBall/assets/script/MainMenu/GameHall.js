cc.Class({
    extends:cc.Component,
    properties:{
        diamondsNum:{
            default:null,
            type:cc.Label
        },
        _tag:"GameHall"

    },
    onLoad()
    {
        if(!cc.wwx)
        {
            initMgr();
        }

        this.diamondsNum.string = cc.wwx.UserInfo.bagData.diamondCount;
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
        cc.wwx.PopWindowManager.popWindow("prefab/signIn/SignIn","SignInWindow");

    },
    showAdsReward()
    {
        //看广告得奖励
    },
    rank()
    {
        //排行榜
        cc.wwx.PopWindowManager.popWindow("prefab/GameRanKWindow","GameRankWindow");

    },
    shop()
    {
        //商城
        // let ballPrefab = cc.instantiate(this.shopPrefab);
        // this.node.addChild(ballPrefab);

        cc.wwx.PopWindowManager.popWindow("prefab/shop/Shop","ShopWindow");

    },
    reward()
    {
        //奖励
        // let ballPrefab = cc.instantiate(this.invateRewardPrefab);
        // this.node.addChild(ballPrefab);

        cc.wwx.PopWindowManager.popWindow("prefab/invate/Invate","InvateRewardWindow");


    },
    skin()
    {
        //皮肤
    }
});