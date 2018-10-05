/**
 * Created by Aaron on 19/06/2018.
 * Copyright 2013 TuYoo Games. All Rights Reserved.
 */
cc.Class({
    extends:cc.Component,
    statics:{
        _initialized: false,
        adUnitId : 'adunit-fec03eabd3aea554',
        stayTime: 2,
        animation: true,
        position: 0,

        TYPE: cc.Enum({
            TABLE: 0,
            RESULT_SEGMENT: 1,
            RESULT_COIN: 2,
            RESULT_ENDGAME: 3,
        }),

        init: function() {
            if (!CC_WECHATGAME || !wx.createBannerAd) {
                return;
            }

            if(!this._initialized){
                console.log('bannerAd init');
                this._initialized = true;
                this.onLoadBind = this.onLoadBind || this.onLoad.bind(this);
                this.onErrorBind = this.onErrorBind || this.onError.bind(this);
                this.onResizeBind = this.onResizeBind || this.onResize.bind(this);
            }
        },

        create: function() {
            if(!this.bannerAd){
                console.log('bannerAd create');
                this.onLoaded = false;
                this.bannerAd = wx.createBannerAd({
                    adUnitId: this.adUnitId,
                    style: {
                        left: (cc.wwx.SystemInfo.screenWidth-300)/2,
                        top: 0,
                        width: 300,
                    }
                });
                this.bannerAd.onLoad(this.onLoadBind);
                this.bannerAd.onError(this.onErrorBind);
                this.bannerAd.onResize(this.onResizeBind);
            }
            return this.bannerAd;
        },

        show(type){
            if(arguments.length){
                this.type = type;
                this.init();
                this.create();
            }
            if(this.onLoaded){
                switch(this.type){
                    case this.TYPE.TABLE:
                        if(this.isShow(this.type)){
                            this.showOnTable();
                        }
                        break;
                    case this.TYPE.RESULT_SEGMENT:
                    case this.TYPE.RESULT_COIN:
                    case this.TYPE.RESULT_ENDGAME:
                        if(this.isShow(this.type)){
                            this.showOnResult();
                        }
                        break;
                }
            }
        },

        hide: function() {
            if (!CC_WECHATGAME || !wx.createBannerAd) {
                return;
            }
            console.log('bannerAd hide');
            this.bannerAd.hide();
            // ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeBannerAD, ['hide']);
            cc.director.getScheduler().unschedule(this.updateFunc,cc.director);
            this.updateFunc = null;
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
                this.bannerAd.hide();
                this.bannerAd.destroy();
                this.bannerAd = null;
            }
            this.updateFunc && cc.director.getScheduler().unschedule(this.updateFunc,cc.director);
            this.updateFunc = null;
            this._initialized = false;
            this.onLoaded = false;
        },

        setWidth(w){
            this.bannerAd.style.width = w;
        },

        setPosition(left,top){
            this.bannerAd.style.left = left;
            this.bannerAd.style.top = top;
        },

        onLoad(){
            console.log('bannerAd onLoad');
            this.onLoaded = true;
            this.show();
        },

        onResize(res){
            console.log('bannerAd onResize',JSON.stringify(res));
            if (this.bannerAd){
                this.bannerSize = res;
                this.bannerAd.style.left = (cc.wwx.SystemInfo.screenWidth-res.width)/2 + 0.1;
                switch(this.type){
                    case this.TYPE.TABLE:
                        this.bannerAd.style.top = -res.realHeight;
                        break;
                    case this.TYPE.RESULT_SEGMENT:
                    case this.TYPE.RESULT_COIN:
                    case this.TYPE.RESULT_ENDGAME:
                        if(cc.wwx.SystemInfo.SYS.phoneType == 1){
                            this.bannerAd.style.top = cc.wwx.SystemInfo.screenHeight - res.height - 1 + 0.1;
                        } else {
                            this.bannerAd.style.top = cc.wwx.SystemInfo.screenHeight - res.height;
                        }
                        break;
                }
            }
        },

        onShow(){
            if(this.bannerAd){
                cc.director.getScheduler().schedule(function(){
                    this.bannerAd.style.top = this.bannerAd.style.top;
                }.bind(this),cc.director,0);
            }
        },

        onError(err){
            console.log('bannerAd onError');
        },

        showOnTable: function () {
            console.log('bannerAd showOnTable');
            this.bannerAd.show().then(() => {
                console.log('bannerAd show1 success');
                // ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeBannerAD, ['show']);
                this.playShowAction();
            }).catch(err => console.log(err));
            this.updateFunc && cc.director.getScheduler().unschedule(this.updateFunc,cc.director);
            this.updateFunc = this.updateFunc || this.update.bind(this);
            cc.director.getScheduler().schedule(this.updateFunc,cc.director,ddz.HallInfo.showBanner.freshSeconds);
        },

        showOnResult(){
            console.log('bannerAd showOnResult');
            this.bannerAd.show().then(() => {
                console.log('bannerAd show1 success');
                // ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeBannerAD, ['show']);
            }).catch(err => console.log(err));
            this.updateFunc && cc.director.getScheduler().unschedule(this.updateFunc,cc.director);
            this.updateFunc = this.updateFunc || this.update.bind(this);
            cc.director.getScheduler().schedule(this.updateFunc,cc.director,ddz.HallInfo.showBanner.freshSeconds);
            // cc.director.getScheduler().schedule(this.updateFunc,cc.director,3);
        },

        update: function(){
            console.log('bannerAd update',this.bannerAd);
            if(this.bannerAd){
                this.destroy();
                this.create();
            }
        },

        clearAllActions(){
            console.log('bannerAd clearAllActions');
            this.playHideActionBind && cc.director.getScheduler().unschedule(this.playHideActionBind,cc.director);
            this.stopShowAction();
            this.stopHideAction();
        },

        playShowAction: function(){
            console.log('bannerAd playShowAction');
            if(!this.bannerAd){
                return;
            }
            if(!this.bannerSize){
                return;
            }
            this.bannerAd.style.top = -this.bannerSize.realHeight;
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

        isShow(type){
            // banner广告策略
            if(CC_WECHATGAME && wx.createBannerAd){
                return true;
            } else {
                return false;
            }

        },
    },
})

// this = {
//
//
//
//
// };

