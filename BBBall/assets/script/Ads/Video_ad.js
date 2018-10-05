
cc.Class({
    extends:cc.Component,
    statics:{
        // adUnitIds : ['adunit-664b8e736700fc51','adunit-cf2ffd798091a013'],
        adUnitIds : ['adunit-d29ae21b46cccf16'],
        videoAds: [],
        _initialized: false,
        adUnitId:0, // 当前展示的广告ID
        closeCb:null,
        errorCb:null,
        noAdvertisement: false,  // 没有广告

        init: function () {
            if (!CC_WECHATGAME || !wx.createRewardedVideoAd || !CC_WECHATGAME) {
                return;
            }

            if(!this._initialized){
                this._initialized = true;

                for(let i=0;i<this.adUnitIds.length;i++){
                    this.videoAds[i] =  this.videoAds[i] || this.createVideoAd(this.adUnitIds[i]);
                }
            }
        },

        createVideoAd: function(adUnitId) {
            let videoAd = wx.createRewardedVideoAd({
                adUnitId: adUnitId
            });

            videoAd.onClose((res) => {
                // 用户点击了【关闭广告】按钮
                cc.wwx.OutPut.info('videoAd.onClose :' + JSON.stringify(res));
                cc.wwx.AudioManager.onShow();
                cc.wwx.OutPut.info('video ad onClose',this.adUnitId,JSON.stringify(res));
                let ended = (!res || (res && res.isEnded));
                if (ended){
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeVideoAD, ['finish', this.clickType]);
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeClickAdVideo, [this.clickType, 2]);
                } else {
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeClickAdVideo, [this.clickType, 3]);
                }
                if (typeof this.closeCb == 'function') {
                    this.closeCb(ended);
                }
                this.cleanupCbs();
            });

            videoAd.onError(err => {
                cc.wwx.OutPut.warn('videoAd.onError', err.errMsg);
                this.noAdvertisement = true;
                cc.wwx.AudioManager.onShow();
                if (typeof this.errorCb == 'function') {
                    this.errorCb();
                }
                this.cleanupCbs();

                cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeClickAdVideo, [this.clickType, 4]);
            });

            videoAd.load().then(() => {videoAd.isLoaded = true});

            return videoAd;
        },

        showVideoAd: function(idx,type,closeCb, errorCb) {
            if(!wx.createRewardedVideoAd){
                cc.wwx.TipManager.showMsg('微信版本过低，请升级微信');
            }

            let video = this.videoAds[idx];
            if (!video) {
                return;
            }
            if (!video.isLoaded) {
                video.load().then(() => { video.isLoaded = true});
                cc.wwx.TipManager.showMsg('视频未准备好。');
                cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeClickAdVideo, [this.clickType, 4]);
                return;
            }
            this.closeCb = closeCb;
            this.errorCb = errorCb;
            this.clickType = 0;
            cc.wwx.AudioManager.onHide();
            video.show()
                .then(() => {
                    console.log('视频广告显示ing...');
                    this.adUnitId = this.adUnitIds[idx];
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeVideoAD, ['show',this.clickType]);
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeClickAdVideo, [this.clickType, 1]);
                });
            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeVideoAD, ['click',this.clickType]);
        },

        cleanupCbs: function () {
            delete this.closeCb;
            delete this.errorCb;
        },

        createAdIcon(success){
            cc.loader.loadRes('prefabs/ads/ad_video_btn', cc.Prefab, null, function(error, prefab) {
                cc.wwx.OutPut.log('load video_ad_btn:' + ddz.GlobalFuncs.obj2String1(error));
                let node = cc.instantiate(prefab);
                // let script = node.getComponent('video_ad_btn');
                // script.init(title);
                // node.parent = parent;
                return success(node);
            }.bind(this));
        }
    }
})