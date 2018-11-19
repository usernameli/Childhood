

cc.Class({
    extends:cc.Component,
    statics:{
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
                    cc.wwx.BiLog.clickStat(cc.wwx.BiLog.clickStatEventType.clickStatEventTypeVideoAD, ['finish']);
                    cc.wwx.BiLog.clickStat(cc.wwx.BiLog.clickStatEventType.clickStatEventTypeClickAdVideo, [2]);
                } else {
                    cc.wwx.BiLog.clickStat(cc.wwx.BiLog.clickStatEventType.clickStatEventTypeClickAdVideo, [3]);
                }
                if (typeof this.closeCb == 'function') {
                    this.closeCb(ended);
                }
                this.cleanupCbs();
            });

            videoAd.onError(err => {
                cc.wwx.OutPut.warn('videoAd.onError', err.errMsg);
                cc.wwx.AudioManager.onShow();
                if (typeof this.errorCb == 'function') {
                    this.errorCb();
                }
                this.cleanupCbs();

                cc.wwx.BiLog.clickStat(cc.wwx.BiLog.clickStatEventType.clickStatEventTypeClickAdVideo, [4]);
            });

            videoAd.load().then(() => {videoAd.isLoaded = true});

            return videoAd;
        },
        getShowVideoAdIsLoaded()
        {
            let video = this.videoAds[0];
            if(!video.isLoaded)
            {
                video.load().then(() => {video.isLoaded = true});
            }
            return video.isLoaded;
        },
        showVideoAd: function(closeCb, errorCb) {
            if (!wx.createRewardedVideoAd) {
                // cc.wwx.PopWindowManager.popWindow("ListPrefab/public_popWindows", "public_popWindow", {content: "微信版本过低，请升级微信"})
            }

            let video = this.videoAds[0];
            if (!video) {
                return;
            }
            this.closeCb = closeCb;
            this.errorCb = errorCb;

            if (!video.isLoaded) {
                video.load().then(() => {
                    video.isLoaded = true
                });
                // cc.wwx.PopWindowManager.popWindow("ListPrefab/public_popWindows", "public_popWindow", {content: "视频未准备好"})

                cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeClickAdVideo, [4]);
                return;
            }

            cc.wwx.AudioManager.onHide();
            video.show()
                .then(() => {
                    console.log('视频广告显示ing...');
                    this.adUnitId = this.adUnitIds[0];
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeVideoAD, ['show']);
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeClickAdVideo, [1]);
                })
                .catch(err => {
                    cc.wwx.OutPut.err('video.show.err', JSON.stringify(err));
                    cc.wwx.PopWindowManager.removeAllWindow();
                    // cc.wwx.PopWindowManager.popWindow("ListPrefab/public_popWindows", "public_popWindow", {content: "视频没有准备好"});
                    video.isLoaded = false;
                    this.cleanupCbs();
                });
            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeVideoAD, ['click']);

        },
        cleanupCbs: function () {
            delete this.closeCb;
            delete this.errorCb;
        },
    }
});