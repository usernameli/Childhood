SML.VideoAD = {
    // adUnitIds : ['adunit-664b8e736700fc51','adunit-cf2ffd798091a013'],
    adUnitIds : ['adunit-664b8e736700fc51'],
    videoAds: [],
    _initialized: false,
    adUnitId:0, // 当前展示的广告ID
    closeCb:null,
    errorCb:null,

    init: function () {
        if (!CC_WECHATGAME || !wx.createRewardedVideoAd || !CC_WECHATGAME) {
            return;
        }

        if(!this._initialized){
            this._initialized = true;

            // SML.Notify.listen(SML.Event.CMD_DIZHU, this._onMsgDizhu, this);

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
            SML.Output.info('videoAd.onClose :' + JSON.stringify(res));
            SML.audioManager.onShow();
            SML.Output.info('video ad onClose',this.adUnitId,JSON.stringify(res));
            let ended = (!res || (res && res.isEnded));
            if (ended){
                SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeVideoAD, ['finish']);
            }
            if (typeof this.closeCb == 'function') {
                this.closeCb(ended);
            }
            this.cleanupCbs();
        });

        videoAd.onError(err => {
            SML.Output.err('videoAd.onError', err.errMsg);
            // videoAd.isLoaded = false;
            // videoAd.load().then(() => { videoAd.isLoaded = true });
            SML.audioManager.onShow();
            if (typeof this.errorCb == 'function') {
                this.errorCb();
            }
            this.cleanupCbs();
        });

        videoAd.load().then(() => {videoAd.isLoaded = true});

        return videoAd;
    },

    showVideoAd: function(idx,type,closeCb, errorCb) {
        if(!wx.createRewardedVideoAd){
            SML.TipManager.showMsg('微信版本过低，请升级微信');
        }

        let video = this.videoAds[idx];
        if (!video) {
            return;
        }
        if (!video.isLoaded) {
            video.load().then(() => { video.isLoaded = true});
            SML.TipManager.showMsg('视频未准备好。');
            return;
        }
        this.closeCb = closeCb;
        this.errorCb = errorCb;
        SML.audioManager.onHide();
        video.show()
            .then(() => {
                console.log('视频广告显示ing...');
                this.adUnitId = this.adUnitIds[idx];
                SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeVideoAD, ['show',type?'behavior':'hall']);
            });
        SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeVideoAD, ['click',type?'behavior':'hall']);
    },

    cleanupCbs: function () {
        delete this.closeCb;
        delete this.errorCb;
    },
};