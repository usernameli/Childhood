

window.initMgr = function() {
    cc.wwx = {};

    console.log("初始化");
    //为了保证在creator下正常 微信平台下注掉
    cc.wwx.isInCreator = !("wechatgame"===cc.sys.browserType);

    if(!CC_WECHATGAME){

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

    /*
        * 客户端埋点分享类型
    */
    cc.wwx.BurialShareType = {
        Default : "default",        //默认分享类型,分享到群
        Invite : "invite",          // 邀请好友
        SegmentRecover : "segementRecover", // 天梯赛保段
        SegmentUp : 'SegmentUp',   // 升段升星炫耀
        UserInfo : "userInfo", //个人信息
        FriendTableInvite : "FTInvite", //朋友桌邀请
        FriendTableResult : "FTResult", //朋友桌结算
        FetchGroupID : 'FetchGroupID', // 群排行
        RankNotify : 'RankNotify',  // 排行榜普通分享，炫耀，支持发给好友
        TaskDouble : 'TaskDouble',  // 任务奖励加倍，指定为群分享
        CashExchange : 'cash', // 提现分享
        DailyInvite : 'DailyInvite', // 日常邀请
        MatchResult : 'matchResult',  // 比赛结算分享
        MatchFix5: 'MatchFix5',                          // 5元红包赛
        MatchFix20: 'MatchFix20',                        // 20元红包赛
        MatchFix100: 'MatchFix100',                      // 100元红包赛
        MatchFix500: 'MatchFix500',                      // 500元红包赛
        NewerRedEnvelope: 'newerRedEnvelope',            // 新手红包
        CoinRoomResult: 'coinRoomResult',                // 金币桌结算
        HighRate : "highRate",//高倍分享
        CoinRoomWinStreak: 'coinRoomWinStreak',         // 连胜
        CoinRoomBankruptcy1: 'coinRoomBankruptcy1',         // 金币桌破产
        CoinRoomBankruptcy2: 'coinRoomBankruptcy2',         // 金币桌破产
        CoinRoomBankruptcy3: 'coinRoomBankruptcy3',         // 金币桌破产
    };

    cc.wwx.BurialShareConfig = {
        invite:{
            oneGroupDayCount:1//同一个群一天最多分享次数:超过次数将不再向服务器获取奖励,并且提醒用户分享到不同的群
        },

        SegmentUp:{
            painting :true, //升星分享指定为截屏分享模式
        },

        RankNotify:{ //排行榜分享
            painting :true,
        },

        FTResult:{ //朋友桌结算分享
            painting :true,
        },

        highRate:{ //高倍分享
            painting :true,
        },

        matchResult:{ // 比赛结算分享
            painting :true,
        },
        MatchFix5: { // 比赛结算分享
            painting :true,
        },
        MatchFix20: { // 比赛结算分享
            painting :true,
        },
        MatchFix100: { // 比赛结算分享
            painting :true,
        },
        MatchFix500: { // 比赛结算分享
            painting :true,
        },
        coinRoomWinStreak: {
            painting :true,
        },
    };


    /*
     * 分享到哪儿给奖励 group frined all
     */
    cc.wwx.ShareWhereReward = {
        Group :"group", //微信群
        Friend : "friend",//好友
        All : "all", //不区分
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
        clickStatEventTypeShare : 99990002,//用户分享


        clickStatEventTypeSubmitVersionInfo : 9999, //上报微信版本及基础库信息

        clickStatEventTypeClickFirstAd : 99990003, //分流icon显示
        clickStatEventTypeClickSecondAd : 99990004, //玩家点击分流按钮

        clickStatEventTypeWxLoginStart : 10001,//微信登录开始
        clickStatEventTypeWxLoginSuccess : 10002,//微信登录成功
        clickStatEventTypeWxLoginFailed : 10003,//微信登录失败

        clickStatEventTypeAuthorizationStart : 10003,//授权开始
        clickStatEventTypeAuthorizationSuccess : 10004,//授权成功
        clickStatEventTypeAuthorizationFailed : 10005,//授权失败


        clickStatEventTypeLoginSDKStart : 10007,//登录SDK开始
        clickStatEventTypeLoginSDKSuccess : 10008,//登录SDK成功
        clickStatEventTypeLoginSDKFailed : 10009,//登录SDK时失败

        clickStatEventTypeTCP_Start : 10009,//TCP连接开始
        clickStatEventTypeTCP_Success : 10010,//TCP连接成功
        clickStatEventTypeTCP_Failed : 10011,//TCP连接失败


    };
    //应用系统信息
    cc.wwx.SystemInfo = require("../SDK/SystemInfo");
    cc.wwx.SystemInfo.init();
    cc.wwx.EventType = require("../SDK/EventType");

    cc.wwx.UserInfo  = require("../Game/UserInfo");

    cc.wwx.OutPut = require("../Util/LogOutPut");

    cc.wwx.HttpUtil= require("../SDK/HttpUtil");

    cc.wwx.BiLog = require("../SDK/Bilog");

    cc.wwx.TCPClient = require("../SDK/TCPClient");

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

    cc.wwx.MapCheckPoint = require("../Util/MapCheckPointManager");
    cc.wwx.MapCheckPoint.initMapCheckPointBallInfo();
    cc.wwx.MapPointScore = require("../CheckPoint/CheckPointScore");


    if (CC_WECHATGAME) {
        cc.wwx.Storage = require('../Util/WeChatStorage');
    } else {
        cc.wwx.Storage = require('../Util/Storage');
    }


    cc.wwx.WeChat = require('../SDK/weChat');
    cc.wwx.WeChat.init();
    cc.wwx.Share = require('../Model/Share');
    cc.wwx.Share.init();
    cc.wwx.Invite = require('../Model/Invite');

};

cc.Class({
    extends: cc.Component,
    properties:{

        globalNode:{
            default:null,
            type:cc.Node
        },
        loadingProgress:{
            default:null,
            type:cc.ProgressBar
        },
    },

    onLoad()
    {

        this.initComponent();
        cc.game.addPersistRootNode(this.globalNode);
        cc.wwx.AudioManager = cc.wwx.AudioManager || this.globalNode.getChildByName('AudioManager').getComponent('AudioManager');

    },
    start()
    {

        cc.wwx.SDKLogin.login();
        let self = this;
        self.loadingProgress.progress = 0.3;
        cc.wwx.Timer.setTimer(this,function () {

            self.loadingProgress.progress += 0.1;

        },0.1,7,0)

    },
    onDestroy()
    {


    },

    initComponent()
    {
        initMgr();

    }

});