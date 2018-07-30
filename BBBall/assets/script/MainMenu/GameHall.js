cc.Class({
    extends:cc.Component,
    properties:{
        shopPrefab:{
            default:null,
            type:cc.Prefab
        },
        signInPrefab:{
            default:null,
            type:cc.Prefab
        },
        invateRewardPrefab:{
            default:null,
            type:cc.Prefab
        },
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
        cc.director.loadScene("GameScene")

    },
    classicMode()
    {
        //经典模式
        cc.wwx.UserInfo.playMode = "classic";

        cc.director.loadScene("GameScene");
    },
    ball100Mode()
    {
        //白球模式
        cc.wwx.UserInfo.playMode = "ball100";
        cc.director.loadScene("GameScene");
    },
    signInReward()
    {
        //签到奖励
        let ballPrefab = cc.instantiate(this.signInPrefab);
        this.node.addChild(ballPrefab);

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
        let ballPrefab = cc.instantiate(this.shopPrefab);
        this.node.addChild(ballPrefab);
    },
    reward()
    {
        //奖励
        let ballPrefab = cc.instantiate(this.invateRewardPrefab);
        this.node.addChild(ballPrefab);
    },
    skin()
    {
        //皮肤
    }
});