

window.initMgr = function() {
    cc.wwx = {};

    console.log("初始化");
    //为了保证在creator下正常 微信平台下注掉
    cc.wwx.isInCreator = !("wechatgame"===cc.sys.browserType);

    if(cc.wwx.isInCreator){

        window.wx = {
            shareAppMessage (){},
            onShareAppMessage(){},
            onShow(){},
            getUserInfo(){},
            getSetting(){},
            getStorage(){},
            request(){},
            showShareMenu(){},
            onHide(){},
            getNetworkType(){},
            onNetworkStatusChange(){},
            onError(){},
            showToast(){},
            getOpenDataContext(){},
            createInnerAudioContext(){},
            createGameClubButton(){},
            getSystemInfo(){}
        };
    }

    //基础状态信息
    cc.wwx.StateInfo = {
        debugMode: true,
        networkConnected: true,   //网络状态
        networkType: 'none',      //网络类型
        isOnForeground: true      //当前是否是在前台
    };

    cc.wwx.ShareInfo = {
        queryId : -1              //分享id
    };

    /**
     * 日志相关方法,若不符合项目组标准,可自行进行扩展
     */

    cc.wwx.OUTPUT_LOG = 1;
    cc.wwx.OUTPUT_INFO = 1 << 1;
    cc.wwx.OUTPUT_WARN = 1 << 2;
    cc.wwx.OUTPUT_ERR = 1 << 3;
    cc.wwx.OUTPUT_LV = cc.wwx.OUTPUT_ERR | cc.wwx.OUTPUT_WARN | cc.wwx.OUTPUT_INFO | cc.wwx.OUTPUT_LOG;


    cc.wwx.IsWechatPlatform = function() {
        if(CC_WECHATGAME)
        {
            return true;
        }
        return false;
    };



    cc.wwx.clickStatEventType = {
        clickStatEventTypeUserFrom : 99990001,//用户来源
        clickStatEventTypeUserShare : 99990002,//用户分享

        clickStatEventTypeClickFirstAd : 99990003, //分流icon显示
        clickStatEventTypeClickSecondAd : 99990004, //玩家点击分流按钮

        clickStatEventTypeWxLoginStart : 10001,//微信登录开始
        clickStatEventTypeWxLoginSuccess : 10002,//微信登录成功
        clickStatEventTypeWxLoginFailed : 10003,//微信登录失败

        clickStatEventTypeAuthorizationStart : 10004,//授权开始
        clickStatEventTypeAuthorizationSuccess : 10005,//授权成功
        clickStatEventTypeAuthorizationFailed : 10006,//授权失败

        clickStatEventTypeLoginSDKStart : 10007,//登录SDK开始
        clickStatEventTypeLoginSDKSuccess : 10008,//登录SDK成功
        clickStatEventTypeLoginSDKFailed : 10009,//登录SDK时失败

        clickStatEventTypeTCP_Start : 10009,//TCP连接开始
        clickStatEventTypeTCP_Success : 10010,//TCP连接成功
        clickStatEventTypeTCP_Failed : 10011,//TCP连接失败


    };
    //应用系统信息
    cc.wwx.SystemInfo = require("../SDK/SystemInfo");

    cc.wwx.EventType = require("../SDK/EventType");

    cc.wwx.UserInfo  = require("../Game/UserInfo");

    cc.wwx.OutPut = require("../Util/LogOutPut");

    cc.wwx.HttpUtil= require("../SDK/HttpUtil");

    cc.wwx.BiLog = require("../SDK/Bilog");

    cc.wwx.TCPClient = require("../SDK/TCPClient");


    let AudioHelper = require("../Util/AudioHelper");
    cc.wwx.AudioHelper = new AudioHelper();
    cc.wwx.AudioHelper.init();
    cc.wwx.SDKLogin = require("../SDK/SDKLogin");


    cc.wwx.EncodeDecode = require("../Util/EncodeDecode");

    cc.wwx.NotificationCenter = require("../Util/NotificationCenter");

    cc.wwx.PropagateInterface = require("../Util/PropagateInterface");

    cc.wwx.Timer = require("../Util/Timer");


    cc.wwx.WxFileUtil = require("../Util/WxFileUtil");

    cc.wwx.Util = require("../Util/Util");

    cc.wwx.hex_md5 = cc.wwx.Util.whex_md5;
    cc.wwx.b64_md5 = cc.wwx.Util.wb64_md5;
    cc.wwx.str_md5 = cc.wwx.Util.wstr_md5;
    cc.wwx.hex_hmac_md5 =cc.wwx.Util.whex_hmac_md5;
    cc.wwx.b64_hmac_md5 =cc.wwx.Util.wb64_hmac_md5;
    cc.wwx.str_hmac_md5 =cc.wwx.Util.wstr_hmac_md5;

    cc.wwx.MapCheckPoint = require("../Util/MapCheckPointManager");

    cc.wwx.NodePool = require("../Util/NodePool");
    cc.wwx.NodePool.init();

    cc.wwx.TCPMSG = require("../SDK/TCP_Msg");
    cc.wwx.TCPRECEIVER = require("../SDK/TCP_Receiver");
    cc.wwx.TCPRECEIVER.init();

    cc.wwx.Loader = require("../Util/Loader");
    cc.wwx.PopWindowManager = require("../Window/PopWindonwManager");
    cc.wwx.TipManager = require("../Window/TipWindowManager");

    cc.wwx.PayModel = require("../Model/PayModel");

    cc.wwx.SceneManager = require("../Util/SceneManager");
}

cc.Class({
    extends: cc.Component,
    properties:{

    },
    onLoad()
    {
        this.initComponent();

        // 预加载
        cc.wwx.TipManager.proload();
        cc.wwx.PopWindowManager.preload();


        cc.wwx.SDKLogin.login();
        // cc.wwx.BiLog.uploadLogTimely("slsss");
    },
    start()
    {


    },
    initComponent()
    {
        initMgr();
        cc.wwx.SDKLogin.WechatInterfaceInit();

    }

});