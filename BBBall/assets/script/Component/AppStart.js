

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
    //应用系统信息
    cc.wwx.SystemInfo = {
        clientId: 'H5_1.21_weixin.weixin.0-hall101.weixin.test',
        intClientId: 23832,
        cloudId:28,
        version:2.25,
        webSocketUrl: 'ws://192.168.10.88/',
        loginUrl : "https://xdev.ks.shpuchi.com/",      //线上
        // loginUrl : "http://localhost:9000/",      //自己仿真
        //  loginUrl : "https://ztfz.nalrer.cn/",      //征途仿真
        // loginUrl : "http://localhost:1337/open.andla.cn/"          //线上
        shareManagerUrl : 'https://market.touch4.me/',
        deviceId: 'wechatGame',
        wxAppId: 'wx281737f4e987120b',
        appId: 9999,
        gameId: 101,
        cdnPath:"https://xiaoyouxi.qiniu.andla.cn/pkgame/bbball",
        remotePackPath:"remote_res/res.zip",
        biLogServer : "https://cbi.touch4.me/api/bilog5/text",
        errorLogServer : "https://clienterr.touch4.me/api/bilog5/clientlog",
        // serverUrl : "https://openxyxfz.nalrer.cn/api/wx/",
        serverUrl : "https://open.andla.cn/api/wx/"
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


    cc.wwx.EventType = {
        // tcp状态的事件
        CMD_BIND_USER: 'bind_user',
        CMD_USER_INFO: 'user_info',
        CMD_BAG: 'bag',
        CMD_UPDATE_NOTIFY: 'update_notify',

        MSG_TCP_OPEN: 'tcp_open',
        MSG_TCP_CLOSE: 'tcp_close',
        MSG_TCP_ERROR: 'tcp_error',             // tcp 失败
        MSG_TCP_SEND_ERROR: 'tcp_send_error',   // tcp发消息，微信接口调用失败
        MSG_TCP_ERROR_COUNT_MAX: 'tcp_error_count_max', //  tcp心跳失败次数达到上限
        MSG_RECONNECT: 'reconnect',
        MSG_SERVER_MESSAGE: 'server_message',

        CMD_INVITE_INFO: 'invite_info', // 邀请信息

        CMD_PAYMENT_LIST: 'store_config', // 支付 - 商品列表
        CMD_PAYMENT_EXCHANGE: 'store', // 支付 - 金币兑换
        CMD_PRODUCT_DELIVERY: 'prod_delivery', // 支付 - 金币兑换 回调
        ACTION_PAYMENT_LIST_UPDATE : 'update',

        ACTION_PAYMENT_EXCHANGE_BUY : 'buy',

        SDK_LOGIN_SUCCESS: 'sdk_login_success',
        SDK_LOGIN_FAIL: 'sdk_login_fail',
        WEIXIN_LOGIN_SUCCESS: 'weixin_login_success',
        WEIXIN_LOGIN_FAIL: 'weixin_login_fail',

        MSG_UPDATE_DIAMOND: 'msg_update_diamond',       // 钻石信息更新

        GET_USER_FEATURE_SUCCESS: 'GET_USER_FEATURE_SUCCESS',
        GET_USER_FEATURE_FAIL: 'GET_USER_FEATURE_FAIL',
        GET_SHARE_CONFIG_SUCCESS: 'GET_SHARE_CONFIG_SUCCESS',
        GET_SHARE_CONFIG_FAIL: 'GET_SHARE_CONFIG_FAIL',

        GET_OPEN_DATA_RESULT_SUCCESS: "GET_OPEN_DATA_RESULT_SUCCESS",
        GET_OPEN_DATA_RESULT_FAIL: "GET_OPEN_DATA_RESULT_FAIL",
        GET_OPEN_DATA_RESULT_TIMEOUT: "GET_OPEN_DATA_RESULT_TIMEOUT",

        SEND_HEART_BEAT: 'SEND_HEART_BEAT',
        GAME_SHOW: 'GAME_SHOW',
        GAME_HIDE: 'GAME_HIDE',

        START_AUTHORIZATION_SUCCESS : 'START_AUTHORIZATION_SUCCESS', //授权成功
        START_AUTHORIZATION_FAILED : 'START_AUTHORIZATION_FAILED', //授权失败

        SHARE_RESULT : 'SHARE_RESULT_RET', 				//分享返回
        FORCESHARE_SUCCESS : 'FORCE_SHARE_SUCESS', 			//暴力分享成功,
        GROUP_SHARE_SUCCESS : 'GROUP_SHARE_SUCCESS', 	//群分享成功,
        GETRFRIENDRANK_SUSSESS:"GETRFRIENDRANK_SUSSESS" ,    //获取好友排行成功

        MSG_LOGIN_SUCCESS : "MSG_LOGIN_SUCCESS",

        PROPAGATE_SHARE_SUCESS : "propagate_share_sucess",  //智能分享成功
        PROPAGATE_SHARE_FAIL : "propagate_share_fail",  //智能分享失败

        GETRFRIENDRANK_SUCCESS: "GETRFRIENDRANK_SUCCESS", //获取好友排行成功
        GETUSERINFO_SUCCESS: "GETUSERINFO_SUCCESS", //获取个人数据成功
        GETGROUPRANK_SUCCESS: "GETGROUPRANK_SUCCESS", //获取群排行数据



        ACTION_BALL_START_LINEARVELOCITY:'ball_start_linearvelocity', //球球线性运动
        ACTION_BALL_STOP_LINEARVELOCITY:'action_ball_stop_linearvelocity',//球球线性运动停止
        ACTION_BALL_MOVE_DROP:'action_ball_move_drop',
        ACTION_BALL_ADD_BALLS:'action_ball_add_balls',

        GETSWITCH_RESULT: "GETSWITCH_RESULT", //获取分享开关


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
    cc.wwx.PopWindowManager = require("../Util/PopWindonwManager");
    cc.wwx.TipManager = require("../Util/TipWindowManager");

    cc.wwx.PayModel = require("../Model/PayModel");
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