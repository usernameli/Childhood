// banner广告接入

cc.Class({
    extends:cc.Component,
    statics:{
        bannerAd: null,
        mHeight:285,
        createBannerAd: function ()
        {
            if (typeof wx !== 'undefined') {
                try {
                    this.destroyBannerAd();
                    var sysInfo = wx.getSystemInfoSync();
                    // 判断是否为iphonex
                    // var isFitIphoneX = (sysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphone11", 0) != -1);
                    var isFitIphoneX = (sysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphonex", 0) != -1) || (sysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphone11", 0) != -1);
                    this.bannerAd = wx.createBannerAd({
                        adUnitId: 'adunit-fec03eabd3aea554',
                        style: {
                            left: 0,
                            top: 0,
                            width: sysInfo.screenWidth
                        }
                    })

                    if (this.bannerAd) {
                        this.bannerAd.onLoad(res =>{
                            this.bannerAd.show();
                        });
                        this.bannerAd.onError(res=>{

                        });

                        this.bannerAd.onResize(res => {
                            if (this.bannerAd && this.bannerAd.style) {
                                console.log("res:", res.width, res.height)
                                if (this.bannerAd && this.bannerAd.style) {
                                    console.log("real:", this.bannerAd.style.realWidth, this.bannerAd.style.realHeight)
                                }
                                var fitOffsetY = isFitIphoneX ? -15 : 0;

                                if (this.bannerAd && this.bannerAd.style) {
                                    this.bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                                    this.bannerAd.style.top = sysInfo.screenHeight - res.height + fitOffsetY; //- Global.bannerAdConfig.showHeight + fitOffsetY;
                                }
                            }
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },

        hideBannerAd: function ()
        {
            console.log('call hideBannerAd');
            try {
                if (this.bannerAd) {
                    this.bannerAd.hide();
                }
            } catch (error) {

            }
        },

        showBannerAd: function ()
        {
            console.log('call showBannerAd');
            try {
                if (this.bannerAd) {
                    this.bannerAd.show();
                }
            } catch (error) {

            }
        },

        //销毁广告
        destroyBannerAd:function ()
        {
            try {
                if (this.bannerAd) {
                    this.bannerAd.destroy();
                    this.bannerAd = null;
                }
            } catch (error) {
                this.bannerAd = null;
            }
        },
    },


});
