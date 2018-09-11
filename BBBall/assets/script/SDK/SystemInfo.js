cc.Class({
    extends:cc.Component,
    statics:{
        UUID_KEY: 'TU_UUID_KEY',
        clientId: 'H5_1.21_weixin.weixin.0-hall101.weixin.test',
        intClientId: 23832,
        cloudId:28,
        version:2.25,
        webSocketUrl: 'ws://192.168.10.88/',
        loginUrl : "http://xdev.ks.shpuchi.com/",      //线上
        // loginUrl : "http://localhost:9000/",      //自己仿真
        //  loginUrl : "https://ztfz.nalrer.cn/",      //征途仿真
        // loginUrl : "http://localhost:1337/open.andla.cn/"          //线上
        shareManagerUrl : 'https://market.touch4.me/',
        deviceId: 'ballGame',
        wxAppId: 'wx281737f4e987120b',
        testAppId:'wx6ac3f5090a6b99c5',
        appId: 9999,
        gameId: 101,
        uuid: '',
        cdnPath:"https://xiaoyouxi.qiniu.andla.cn/pkgame/bbball",
        remotePackPath:"remote_res/res.zip",
        biLogServer : "https://cbi.touch4.me/api/bilog5/text",
        errorLogServer : "https://clienterr.touch4.me/api/bilog5/clientlog",
        SysInfo:'',
        SYS:{},
        screenWidth:0,
        screenHeight:0,
        windowWidth:0,
        windowHeight:0,
        rank:{},
        // 初始化uuid
        init:function()
        {
            if (this.uuid != '')
            {
                return;

            }
            // uuid
            if (CC_WECHATGAME) {
                var self = this;
                wx.getStorage({
                    key: this.UUID_KEY,
                    success: function(params) {
                        if (!params.data || params.data == '') {
                            self.createRandomUUID();
                            return;
                        };
                        self.uuid = params.data;
                    },
                    fail: function(params) {
                        self.createRandomUUID();
                    },
                    complete:function(params) {

                    }
                });
            } else {
                this.uuid = '12345678123456781234567812340000';
            }
        },
        /**
         * 创建随机UUID
         */
        createRandomUUID: function () {
            this.uuid = this._uuid();
            wx.setStorage({
                key: this.UUID_KEY,
                data: this.uuid
            });
        },
        _uuid: function () {
            var s = [];
            var hexDigits = "0123456789abcdefsml";
            for (var i = 0; i < 32; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

            var uuid = s.join("");
            return uuid;
        },
    }
});