

window.initMgr = function() {
    cc.wwx = {};

    console.log("初始化");



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

        DailyInviteFriend : 'invite_friend', // 日常邀请好友
        DailyInviteGroup : 'invate_group', // 日常分享群
        DailyInviteGroupAlive: 'invate_alive', //日常分享群复活
        DailyInviteGroupReward: 'invate_rewared',//分享奖励翻倍
        DailyInviteGroupBox: 'invate_box',  //宝箱分享奖励
        DailyInviteGroupBall: 'invate_ball',  //分享领取球球

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
        FetchGroupID:{
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

        clickStatEventTypeClickAdBtn : 99990007,//点击分流icon
        clickStatEventTypeClickAdVideo : 99990020,// 视频广告
        clickStatEventTypeVideoAD : 67890029, // 视频广告
        clickStatEventTypeBannerAD : 67890030, // banner广告
        clickStatEventTypeBannerAD2 : 67890033, // banner广告干预

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
    cc.wwx.WeChat.initShareDefault();
    cc.wwx.WeChat.init();
    cc.wwx.Share = require('../Model/Share');
    cc.wwx.Share.init();
    cc.wwx.ShareData = require('../Model/ShareData');

    cc.wwx.Gift = require("../Model/GiftBox");

    cc.wwx.IOSSDK = require("../IOS/IOSSDK");
    cc.wwx.IOSSDK.init();

    cc.wwx.Invite = require('../Model/Invite');
    cc.wwx.ClientConf = require("../Model/ClientConf");

    cc.wwx.BannerAD = require("../Ads/Banner_ad");
    cc.wwx.BannerAD.init();

    cc.wwx.VideoAD = require("../Ads/Video_ad");
    cc.wwx.VideoAD.init();

    cc.wwx.VS = require("../Model/VS");

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
        canvas:{
            default:null,
            type:cc.Canvas
        },
        _userInfoButton:null,
    },

    onLoad()
    {

        this.initComponent();
        cc.wwx.Util.adaptIpad();

        this._userInfoButton = null;
        cc.game.addPersistRootNode(this.globalNode);
        cc.wwx.AudioManager = cc.wwx.AudioManager || this.globalNode.getChildByName('AudioManager').getComponent('AudioManager');

    },
    createGetUserInfoBtn()
    {
        let self = this;
        var info = wx.getSystemInfoSync();
        var btnwidth = info['windowWidth'];
        var btnheight = info['windowHeight'];
        this._userInfoButton = wx.createUserInfoButton({
            type: 'image',
            text: '',
            image: 'res/raw-assets/resources/images/share/Ball_LoginBtn.png',
            style: {
                left: btnwidth / 2 - 100,
                top: btnheight/2 + 100,
                width: 200,
                height: 45,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });
        this._userInfoButton.onTap(function(res){
            console.log("获取用户信息: "+JSON.stringify(res));
            self.enterGame();
        });
        this._userInfoButton.show();
    },
    getOpenSetting()
    {
        let self = this;

        wx.getSetting({
            success: function (res) {
                cc.wwx.OutPut.log('get user setting :', JSON.stringify(res));
                var authSetting = res.authSetting;
                if (authSetting['scope.userInfo'] === true) {
                    // 用户已授权 直接进入游戏
                    self.enterGame();
                    // self.createGetUserInfoBtn();

                }
                else
                {
                    self.createGetUserInfoBtn();
                }
            }
        });


    },
    start()
    {
        let self = this;
        if(CC_WECHATGAME)
        {

            wx.getSetting({
                success: function (res) {
                    cc.wwx.OutPut.log('get user setting :', JSON.stringify(res));
                    var authSetting = res.authSetting;
                    if (authSetting['scope.userInfo'] === true) {
                        // 用户已授权 直接进入游戏
                        self.enterGame();
                        // self.createGetUserInfoBtn();

                    }
                    else
                    {
                        if (cc.wwx.Util.compareVersion(cc.wwx.SystemInfo.SYS.SDKVersion, '2.0.1') < 0)
                        {
                            if (cc.wwx.Util.compareVersion(cc.wwx.SystemInfo.SYS.wechatType, '6.6.6') > 0)
                            {
                                self.getOpenSetting();
                            }
                            else
                            {
                                self.enterGame();
                            }
                        }
                        else
                        {
                            self.getOpenSetting();
                        }
                    }
                }
            });


        }
        else
        {
            self.enterGame();
        }

    },
    enterGame()
    {
        cc.wwx.SDKLogin.login();
        this.loadingProgress.progress = 0.3;
        cc.wwx.Timer.setTimer(this,this.loadingCallBack,0.1,7,0)
    },
    loadingCallBack()
    {
        this.loadingProgress.progress += 0.1;
    },
    onDestroy()
    {
        cc.wwx.OutPut.log("AppStar OnDestroy");
        if(this._userInfoButton)
        {
            this._userInfoButton.destroy();
        }
        cc.wwx.Timer.cancelTimer(this,this.loadingCallBack)

    },

    initComponent()
    {
        initMgr();

    }

});