cc.Class({
    extends:cc.Component,
    statics:{
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
        appId: 9999,
        gameId: 101,
        cdnPath:"https://xiaoyouxi.qiniu.andla.cn/pkgame/bbball",
        remotePackPath:"remote_res/res.zip",
        biLogServer : "https://cbi.touch4.me/api/bilog5/text",
        errorLogServer : "https://clienterr.touch4.me/api/bilog5/clientlog",
        // serverUrl : "https://openxyxfz.nalrer.cn/api/wx/",
        SysInfo:'',
        SYS:{},
        screenWidth:0,
        screenHeight:0,
        windowWidth:0,
        windowHeight:0,
        serverUrl : "https://open.andla.cn/api/wx/"
    }
});