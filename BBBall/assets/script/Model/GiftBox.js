cc.Class({
    extends:cc.Component,
    statics:{
        GiftLevelList:[],//{"cmd":"level_gift_conf","result":{"userId":20017,"gameId":101,"conf":[{"level":[1,100],"step":30},{"level":[100,200],"step":15},{"level":[200,300],"step":10},{"level":[300,-1],"step":5}]}}
        OpendLevels:[],//{"cmd":"level_gift_conf","result":{"userId":20017,"gameId":101,"conf":[{"level":[0,100],"step":20},{"level":[100,200],"step":15},{"level":[200,300],"step":10},{"level":[300,1000],"step":5}],"opendLevels":[]}}
        ParseGift(giftConfig)
        {
            this.GiftLevelList = giftConfig["conf"];
            this.OpendLevels = giftConfig["opendLevels"];
        }
    },
});