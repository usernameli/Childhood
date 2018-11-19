cc.Class({
    extends:cc.Component,
    statics:{
        ClientConfList:{},
        ParseClientConf(giftConfig)
        {
            this.ClientConfList = giftConfig["clientConf"];
        }
    },
});