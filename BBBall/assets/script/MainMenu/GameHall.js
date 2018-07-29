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

    },
    onLoad()
    {

    },
    checkpointMode()
    {
        //关卡模式
    },
    classicMode()
    {
        //经典模式
    },
    ball100Mode()
    {
        //白球模式
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