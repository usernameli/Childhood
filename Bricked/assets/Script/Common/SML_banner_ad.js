/**
 * Created by Aaron on 19/06/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 */

SML.BannerAD = {
    adUnitId : 'adunit-66b7995ab157f82e',
    _initialized: false,
    stayTime: 2,
    animation: true,

    init: function(onLoad,onError,onResize) {
        if (!CC_WECHATGAME || !wx.createBannerAd) {
            return;
        }


        if(!this._initialized){
            console.log('bannerAd init');
            this._initialized = true;

            this.onLoadBind = this.onLoadBind || this.onLoad.bind(this);
            this.onErrorBind = this.onErrorBind || this.onError.bind(this);
            this.onResizeBind = this.onResizeBind || this.onResize.bind(this);

            this.create(onLoad,onError,onResize);
            this.createTip();
            // this.createCloseBtn();
        }
    },

    create: function(onLoad,onError,onResize) {
        if(this.bannerAd){
            console.log('old bannerAd off & destroy');
            this.bannerAd.offResize(this.onResizeBind);
            this.bannerAd.offLoad(this.onLoadBind);
            this.bannerAd.offError(this.onErrorBind);
            this.bannerAd.destroy();
        }

        console.log('bannerAd create');
        this.bannerAd = wx.createBannerAd({
            adUnitId: this.adUnitId,
            style: {
                left: (SML.screenWidth-300)/2,
                top: 0,
                width: 300,
            }
        });

        this.onLoadCb = onLoad;
        this.onErrorCb = onError;
        this.bannerAd.onLoad(this.onLoadBind);
        this.bannerAd.onError(this.onErrorBind);
        this.bannerAd.onResize(this.onResizeBind);

        return this.bannerAd;
    },

    onLoad(){
        console.log('bannerAd onLoad');
        this.show();

        if(this.onLoadCb && typeof(this.onLoadCb) == 'function')
        {
            this.onLoadCb();
        }
    },

    onResize(res){
        console.log('bannerAd onResize',res.width, res.height,'animation='+this.animation);
        if (this.bannerAd){
            this.bannerSize = res;
            this.bannerAd.style.left = (SML.screenWidth-res.width)/2;
            if (this.animation){
                this.bannerAd.style.top = -res.height;
            } else {
                this.bannerAd.style.top = 0;
            }
            this.moveTip();
        }
    },

    onError(err){
        SML.Output.err('bannerAd onError!!!');
        // console.log(err);
        if(this.onErrorCb && typeof(this.onErrorCb) == 'function')
        {
            this.onErrorCb();
        }
    },


    show: function (onShow) {
        if (!CC_WECHATGAME || !wx.createBannerAd) {
            return;
        }

        console.log('bannerAd show');

        try {
            this.bannerAd.show().then(() => {
                console.log('bannerAd show1 success');
                SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeBannerAD, ['show']);
                if(onShow && typeof(onShow) == 'function')
                {
                    onShow();
                }
                if(this.animation){
                    this.playShowAction();
                } else {
                    this.showTip();
                }
                // this.showCloseBtn();
            }).catch(err => console.log(err));
        } catch(err){

        }

        this.updateFunc && cc.director.getScheduler().unschedule(this.updateFunc,cc.director);
        this.updateFunc = this.updateFunc || this.update.bind(this);
        cc.director.getScheduler().schedule(this.updateFunc,cc.director,SML.HallInfo.showBanner.freshSeconds);
        // cc.director.getScheduler().schedule(this.updateFunc,cc.director,10);
    },

    update: function(){
        console.log('bannerAd update',this.bannerAd);
        if(this.bannerAd){
            // this.oldBannerAd = this.bannerAd;
            this.hideCloseBtn();
            this.bannerAd = this.create(function(){
                if(this.bannerAd){
                    this.bannerAd.show().then(() => {
                        console.log('bannerAd show2');
                        if(this.animation){
                            this.playShowAction();
                        } else {
                            this.showTip();
                        }
                        SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeBannerAD, ['show']);
                        // this.showCloseBtn();
                    });
                }
            }.bind(this));


            // this.oldBannerAd.offResize(this.onResizeBind);
            // this.oldBannerAd.offLoad(this.onLoadBind);
            // this.oldBannerAd.offError(this.onErrorBind);
            // this.oldBannerAd.destroy();
        }
    },

    hide: function() {
        if (!CC_WECHATGAME || !wx.createBannerAd) {
            return;
        }

        console.log('bannerAd hide');
        this.bannerAd.hide();
        this.hideCloseBtn();
        SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeBannerAD, ['hide']);
        // cc.director.getScheduler().unschedule(this.updateFunc,cc.director);

        this.clearAllActions();
    },

    destroy: function(){
        if (!CC_WECHATGAME || !wx.createBannerAd) {
            return;
        }
        console.log('bannerAd destroy');
        this.clearAllActions();
        if(this.bannerAd){
            this.bannerAd.offResize(this.onResizeBind);
            this.bannerAd.offLoad(this.onLoadBind);
            this.bannerAd.offError(this.onErrorBind);
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
        this.updateFunc && cc.director.getScheduler().unschedule(this.updateFunc,cc.director);
        this.updateFunc = null;
        this.hideCloseBtn();
        this.hideTip();
        this._initialized = false;
    },

    clearAllActions(){
        console.log('bannerAd clearAllActions');
        this.playHideActionBind && cc.director.getScheduler().unschedule(this.playHideActionBind,cc.director);
        this.stopShowAction();
        this.stopHideAction();
    },

    move: function(left,top){
        if(this.bannerAd){
            this.bannerAd.style.left = left;
            this.bannerAd.style.top = top;
        }
    },

    playShowAction: function(){
        console.log('bannerAd playShowAction');
        if(!this.bannerAd){
            return;
        }
        if(!this.bannerSize){
            return;
        }
        this.bannerAd.style.top = -this.bannerSize.height;
        this.stopShowAction();
        this.showActionUpdateBind = this.showActionUpdateBind || this.showActionUpdate.bind(this);
        cc.director.getScheduler().schedule(this.showActionUpdateBind,cc.director,0.01);
    },

    stopShowAction: function () {
        console.log('bannerAd stopShowAction');
        this.showActionUpdateBind && cc.director.getScheduler().unschedule(this.showActionUpdateBind,cc.director);
    },

    showActionUpdate: function(){
        // console.log('banner showActionUpdate');
        if(this.bannerAd.style.top >= -4){
            this.stopShowAction();
            this.bannerAd.style.top = 0;

            this.playHideActionBind && cc.director.getScheduler().unschedule(this.playHideActionBind,cc.director);
            this.playHideActionBind = this.playHideActionBind || this.playHideAction.bind(this);
            cc.director.getScheduler().schedule(this.playHideActionBind,cc.director,this.stayTime,1,0);

        } else {
            this.bannerAd.style.top = this.bannerAd.style.top + 4;
        }
    },

    playHideAction: function () {
        console.log('bannerAd playHideAction111');
        this.playHideActionBind && cc.director.getScheduler().unschedule(this.playHideActionBind,cc.director);
        this.stopHideAction();
        this.hideActionUpdateBind = this.hideActionUpdateBind || this.hideActionUpdate.bind(this);
        cc.director.getScheduler().schedule(this.hideActionUpdateBind,cc.director,0.01);
    },

    stopHideAction: function () {
        console.log('bannerAd stopHideAction');
        this.hideActionUpdateBind && cc.director.getScheduler().unschedule(this.hideActionUpdateBind,cc.director);
    },

    hideActionUpdate: function () {
        // console.log('banner hideActionUpdate',this.bannerAd.style.top,50 - this.bannerSize.height);
        if(!this.bannerSize){
            return;
        }
        if(this.bannerAd.style.top <= 50 - this.bannerSize.height + 4){
            this.stopHideAction();
            this.bannerAd.style.top = 50 - this.bannerSize.height;
        } else {
            this.bannerAd.style.top = this.bannerAd.style.top - 4;
        }
    },

    createCloseBtn: function(){
        console.log('bannerAd createCloseBtn');
        if(this.adCloseBtn){
            // this.adCloseBtn.active = false;
            return;
        }
        try{
            cc.loader.loadRes('prefabs/ads/ad_close_btn', cc.Prefab, null, function(error, prefab) {
                console.log('bannerAd load closeBtn success');
                this.adCloseBtn = cc.instantiate(prefab);
                if(this.adCloseBtn && typeof(this.adCloseBtn.getComponent) == 'function'){
                    this.script = this.adCloseBtn.getComponent('ad_close_btn');
                    this.script.push();
                    let x = cc.winSize.width/SML.screenWidth*300/2+15;
                    let y = cc.winSize.height/2 - 15;
                    this.moveCloseBtn(x,y);
                    this.hideCloseBtn();
                }
            }.bind(this));
        } catch(err){

        }
    },

    moveCloseBtn: function (x,y) {
        console.log('bannerAd moveCloseBtn');
        if(this.adCloseBtn){
            this.adCloseBtn.x = x;
            this.adCloseBtn.y = y;
        }
    },

    showCloseBtn(){
        console.log('bannerAd showCloseBtn',this.adCloseBtn instanceof cc.Node,this.adCloseBtn.active);
        if(this && this.adCloseBtn && this.adCloseBtn instanceof cc.Node){
            this.adCloseBtn.active = true;
        }
    },

    hideCloseBtn(){
        console.log('bannerAd hideCloseBtn');
        if(this.adCloseBtn && this.adCloseBtn.active){
            this.adCloseBtn.active = false;
        }
    },

    destroyCloseBtn(){
        console.log('bannerAd destroy');
        if(this.adCloseBtn){
            this.script && this.script.pop();
            delete this.adCloseBtn;
            this.adCloseBtn = null;
        }
    },

    createTip: function(){
        console.log('bannerAd loadTip');
        if (this.tip){
            this.hideTip();
            return;
        }
        try {
            cc.loader.loadRes('prefabs/ads/ad_tip', cc.Prefab, null, function (error, prefab) {
                console.log('bannerAd loadTip success');
                this.tip = cc.instantiate(prefab);
                if(this.tip && typeof(this.tip.getComponent)=='function'){
                    this.tipScript = this.tip.getComponent('ad_tip');
                    this.tipScript.push();
                    this.moveTip();
                    this.hideTip();
                }
            }.bind(this));
        } catch(err){

        }
    },

    moveTip: function () {
        console.log('bannerAd moveTip1',this.tip instanceof cc.Node);
        if(this.tip && this.tip.active){
            console.log('bannerAd moveTip2',this.tip.active);
            let y = 0;
            if(this.bannerSize){
                y = cc.winSize.height / 2 - cc.winSize.height / SML.screenHeight * this.bannerSize.height - 17;
            } else {
                y = cc.winSize.height / 2 - cc.winSize.height / SML.screenHeight * 100 - 17;
            }

            this.tip.x = 0;
            this.tip.y = y;
        }
    },

    showTip(){
        console.log('bannerAd showTip',this.tip instanceof cc.Node);
        if(this.tip){
            this.tip.active = true;
        }
    },

    hideTip(){
        console.log('bannerAd hideTip');
        if(this.tip){
            this.tip.active = false;
        }
    },

    destroyTip(){
        console.log('bannerAd destroyTip');
        if(this.tip){
            this.tipScript && this.tipScript.pop();
            delete this.tip;
            this.tip = null;
        }
    },

    isShow(condition){
        // banner广告策略
        switch (condition) {
            case 0: // 天梯赛牌桌是否显示banner
                if (SML.Switch.showRecharge && CC_WECHATGAME && wx.createBannerAd && SML.HallInfo.showBanner.isShow && SML.TableModel.tableType() == SML.TableModel.TableType.segment) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 1: // 天梯赛结算是否显示banner
                if (CC_WECHATGAME && wx.createBannerAd && SML.HallInfo.showBanner.isShow && SML.TableModel.tableType() == SML.TableModel.TableType.segment) {
                    return true
                } else {
                    return false;
                }
                break;
            default: // 其他位置默认是否显示banner
                if (CC_WECHATGAME && wx.createBannerAd && SML.HallInfo.showBanner.isShow) {
                    return true
                }
                break;
        }

    }

};

