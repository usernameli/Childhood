cc.Class({
    extends:cc.Component,
    properties:{
        sumStarNum:{
            default:null,
            type:cc.Label
        },

        _tag:"CheckPointScene",
    },
    onLoad()
    {

        cc.wwx.Util.adaptIpad();

        let levelHighStar = cc.wwx.UserInfo.gdata["levelHighStar"];
        let sumStar = 0;
        for(let i = 0; i < levelHighStar.length;i++)
        {
            sumStar += levelHighStar[i];
        }
        this.sumStarNum.string = sumStar;


        cc.director.preloadScene("GameScene", function () {
            cc.log("Next GameScene scene preloaded");
        });

        this.onResizeBind = this.onResizeBind || this.onResize.bind(this);
        this.onLoadBind = this.onLoadBind || this.onBannerLoad.bind(this);
        this.onErrorBind = this.onErrorBind || this.onError.bind(this);

        this.createrAD();
    },

    createrAD()
    {
        if(CC_WECHATGAME && wx.createBannerAd && wx.getSystemInfoSync)
        {

            if(this.bannerAd){
                console.log('old bannerAD destroies!');
                this.bannerAd.offResize(this.onResizeBind);
                this.bannerAd.offLoad(this.onLoadBind);
                this.bannerAd.offError(this.onErrorBind);
                this.bannerAd.destroy();
                this.bannerAd = null;
            }

            this.bannerAd = wx.createBannerAd({
                adUnitId: "adunit-fec03eabd3aea554",
                style: {
                    left:0,
                    top:0,
                    width: 300,
                }
            });

            this.bannerAd.onResize(this.onResizeBind);

            this.bannerAd.onLoad(this.onLoadBind);
            this.bannerAd.onError(this.onErrorBind);
        }
    },
    onResize: function(res) {
        console.log('图片宽高为：', res.width, res.height);
        if(this.bannerAd) {
            console.log('屏幕高度是！！！', cc.wwx.SystemInfo.screenHeight);
            this.bannerAd.style.left = (cc.wwx.SystemInfo.screenWidth - res.width) / 2 + 0.1;

            if(false && res.height > 100)
            {
                if(this.bannerAd){
                    console.log('old bannerAD destroies!');
                    this.bannerAd.offResize(this.onResizeBind);
                    this.bannerAd.offLoad(this.onLoadBind);
                    this.bannerAd.offError(this.onErrorBind);
                    this.bannerAd.destroy();
                    this.bannerAd = null;
                }
            }
            else
            {
                if(cc.wwx.SystemInfo.SYS.phoneType == 1) {
                    this.bannerAd.style.top = cc.wwx.SystemInfo.screenHeight - res.height - 1 + 0.1 ;//-10
                } else {
                    this.bannerAd.style.top = cc.wwx.SystemInfo.screenHeight - res.height;
                }
            }


        }
    },
    onShow(){
        if(this.bannerAd){
            this.showOnResult();
        }
    },
    showOnResult(){
        console.log('bannerAd showOnResult');
        this.bannerAd.show().then(() => {
            console.log('bannerAd show1 success');
            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeBannerAD, ['show']);
        }).catch(err => console.log(err));
    },
    onBannerLoad(){
        console.log('bannerAd onLoad');
        this.onShow();
    },
    onError(err){
        console.log('bannerAd onError');
    },

    clickGoHome()
    {
        cc.wwx.SceneManager.switchScene("GameHall");
    },
    onDestroy()
    {
        if(this.bannerAd){
            this.bannerAd.offLoad(this.onLoadBind);
            this.bannerAd.offError(this.onErrorBind);
            this.bannerAd.offResize(this.onResizeBind);

            this.bannerAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }
})