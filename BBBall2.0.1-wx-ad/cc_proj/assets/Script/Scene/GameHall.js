cc.Class({
    extends:cc.Component,
    properties:{
        diamondsNum:{
            default:null,
            type:cc.Label
        },
        checkInNode:{
            default:null,
            type:cc.Sprite
        },
        checkInSpriteFrame1:{
            default:null,
            type:cc.SpriteFrame,
            displayName:"可以领取"
        },
        checkInSpriteFrame2:{
            default:null,
            type:cc.SpriteFrame,
            displayName:"已经领取了"
        },
        checkInLabel:{
            default:null,
            type:cc.Label
        },
        rewardNode:{
            default:null,
            type:cc.Node
        },
        soundBtnSprite:{
            default:null,
            type:cc.Sprite
        },
        soundOnSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        soundOffSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },

        // 按钮点击
        audioBg:{
            default:null,
            type:cc.AudioClip
        },
        headBG:{
            default:null,
            type:cc.Node
        },
        headIcon:{
            default:null,
            type:cc.Sprite
        },
        userName:{
            default:null,
            type:cc.Label
        },
        shopNode:{
            default:null,
            type:cc.Node
        },
        shareNode:{
            default:null,
            type:cc.Node
        },
        _openCheckIn:false,
        _clickShare:false,
        _tag:"GameHall"

    },
    onLoad()
    {

        cc.wwx.Util.adaptIpad();
        // this.adaptIphoneX();

        this.loginSuccessCallBack();
        cc.wwx.AudioManager.playMusic(this.audioBg);
        this._openCheckIn = false;
        this.diamondsNum.string = cc.wwx.UserInfo.bagData.diamondCount;

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_LOGIN_SUCCESS, this.loginSuccessCallBack, this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_BAG,this.gameBagData,this);

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN_STATUS,this.daily_checkin_status,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_INVITE_CONF,this.invate_conf_status,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_POP,this._rankPopWindow,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.CMD_PAYMENT_LIST,this.shopList,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_USER_INFO, this.gameUserInfo, this);

        this.shopList();


        if(CC_WECHATGAME && wx.createBannerAd && wx.getSystemInfoSync)
        {
            this.onResizeBind = this.onResizeBind || this.onResize.bind(this);
            this.onLoadBind = this.onLoadBind || this.onBannerLoad.bind(this);
            this.onErrorBind = this.onErrorBind || this.onError.bind(this);

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
            if(cc.wwx.SystemInfo.SYS.phoneType == 1) {
                if (res.height > 100) {
                    this.bannerAd.style.top = cc.wwx.SystemInfo.screenHeight - res.height - 1 + 0.1 ;//-5
                } else {
                    this.bannerAd.style.top = cc.wwx.SystemInfo.screenHeight - res.height - 1 + 0.1 ;//-10
                }
            } else {
                if(res.height > 100) {
                    this.bannerAd.style.top = cc.wwx.SystemInfo.screenHeight - res.height;
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
    shopList()
    {
        let taiji  = cc.wwx.PayModel.mExchangeList[0];
        let isOwn = cc.wwx.UserInfo.findBagItem(taiji["content"][0]["itemId"].split(":")[1]);
        this.shopNode.removeAllChildren();
        if(!isOwn)
        {
            cc.wwx.Util.addRedPoint(this.shopNode,1,cc.v2(45,45));

        }

    },
    gameBagData()
    {
        //更新钻石数量
        this.shopList();
        this.diamondsNum.string = cc.wwx.UserInfo.bagData.diamondCount;
    },
    loginSuccessCallBack()
    {
        if(cc.wwx.UserInfo.userPic)
        {
            cc.wwx.Loader.loadImg(cc.wwx.UserInfo.userPic, this.headIcon);
            this.userName.string = cc.wwx.UserInfo.userName;
            this.headBG.active = true;
        }
        else
        {
            this.headBG.active = false;
        }
    },

    start()
    {
        // 获取玩家微信信息
        if (CC_WECHATGAME && !cc.wwx.UserInfo.wxAuthor) {
            // 低版本兼容处理,微信wx.getUserInfo()方法已经不弹授权了,度需要用微信授权按钮
            cc.wwx.SDKLogin.wxUserInfo1();
        }

        if(CC_WECHATGAME && wx.createGameClubButton && !cc.wwx.UserInfo.gameClub)
        {
            var info = wx.getSystemInfoSync();
            var btnwidth = info['windowWidth'];
            var btnheight = info['windowHeight'];
            let button = wx.createGameClubButton({
                icon: 'green',
                style: {
                    left: 13,
                    top: btnheight / 2,
                    width: 40,
                    height: 40
                },
            });

            cc.wwx.UserInfo.gameClub = button;
            button.show();
        }


        cc.wwx.TCPMSG.getDaily_checkin_status();
        cc.wwx.TCPMSG.getInvite();

        let musicSwith = cc.wwx.AudioManager.getAudioMusicSwitch();
        let effectSwith = cc.wwx.AudioManager.getAudioEffectSwitch();
        if(musicSwith || effectSwith)
        {
            this.soundBtnSprite.spriteFrame = this.soundOnSpriteFrame;
        }
        else
        {
            this.soundBtnSprite.spriteFrame = this.soundOffSpriteFrame;

        }
        this.shareNode.removeAllChildren();
        let dayShareGroupRewardCount = cc.wwx.UserInfo.gdata["dayShareGroupRewardLeftCount"];
        if(dayShareGroupRewardCount > 0)
        {
            cc.wwx.Util.addRedPoint(this.shareNode,dayShareGroupRewardCount,cc.v2(45,45));

        }


        cc.director.preloadScene("GameScene", function () {
            cc.log("Next GameScene scene preloaded");
        });
    },
    gameUserInfo()
    {
        this.shareNode.removeAllChildren();

        let dayShareGroupRewardCount = cc.wwx.UserInfo.gdata["dayShareGroupRewardLeftCount"];
        if(dayShareGroupRewardCount > 0)
        {
            cc.wwx.Util.addRedPoint(this.shareNode,dayShareGroupRewardCount,cc.v2(45,45));

        }

        cc.wwx.TCPMSG.getInvite();

    },
    wxShareSuccess(argument)
    {
        cc.wwx.OutPut.log("InvateRewardWindow wxShareSuccess",JSON.stringify(argument));
        let find = cc.wwx.PopWindowManager.findWindowByName("prefab/invate/Invate");

        if(!find && !argument["isShareGroupId"] && argument["burialId"] === cc.wwx.BurialShareType.DailyInviteGroup)
        {
            cc.wwx.TCPMSG.getShareReward("group");

        }
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN_STATUS,this.daily_checkin_status,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_INVITE_CONF,this.invate_conf_status,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_POP,this._rankPopWindow,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_LOGIN_SUCCESS, this.loginSuccessCallBack, this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_BAG,this.gameBagData,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.CMD_PAYMENT_LIST,this.shopList,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_USER_INFO, this.gameUserInfo, this);

        if(this.bannerAd){
            this.bannerAd.offLoad(this.onLoadBind);
            this.bannerAd.offError(this.onErrorBind);
            this.bannerAd.offResize(this.onResizeBind);

            this.bannerAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
        if(cc.wwx.UserInfo.gameClub)
        {
            cc.wwx.UserInfo.gameClub.destroy();
            cc.wwx.UserInfo.gameClub = null;
        }
    },
    invate_conf_status(params)
    {
        let result = params['result'];
        let rewards = result['inviteConf']["rewards"];

        let stateNum = 0;
        for(let i = 0; i < rewards.length;i++)
        {

            if(rewards[i]["state"] == 1)
            {
                stateNum += 1;
            }
        }

        this.rewardNode.removeAllChildren();

        let dayShareGroupRewardCount = cc.wwx.UserInfo.gdata["dayShareGroupRewardLeftCount"];

        if(stateNum + dayShareGroupRewardCount> 0)
        {

            if(dayShareGroupRewardCount  + stateNum> 0)
            {
                cc.wwx.Util.addRedPoint(this.rewardNode,dayShareGroupRewardCount  + stateNum,cc.v2(45,45));

            }
        }

    },
    daily_checkin_status(params)
    {
        let result = params['result'];
        let states = result['states'];
        cc.wwx.OutPut.log("daily_checkin_status: " + JSON.stringify(params));
        //
        // if(this._openCheckIn)
        // {
        //     cc.wwx.PopWindowManager.popWindow("prefab/signIn/SignIn","SignInWindow",result);
        //     return;
        // }
        //
        // this._openCheckIn = false;

        let isCheckIn = false;
        for(let i = 0 ; i < states.length;i++)
        {
            if(states[i]['st'] === 1)
            {
                isCheckIn = true;
                break;

            }
        }
        if(isCheckIn)
        {
            this.checkInNode.spriteFrame = this.checkInSpriteFrame1;
            this.checkInLabel.string = "可领取";
            cc.wwx.PopWindowManager.popWindow("prefab/signIn/SignIn","SignInWindow",result);

        }
        else
        {
            this.checkInLabel.string = "每日奖励";
            this.checkInNode.spriteFrame = this.checkInSpriteFrame2;
            if(this._openCheckIn)
            {
                cc.wwx.PopWindowManager.popWindow("prefab/signIn/SignIn","SignInWindow",result);
            }
            this._openCheckIn = false;


        }
        cc.wwx.OutPut.log("daily_checkin_status: " + isCheckIn);


    },
    checkpointMode()
    {
        cc.wwx.AudioManager.playAudioButton();

        //关卡模式
        cc.wwx.UserInfo.playMode = "level";
        cc.wwx.SceneManager.switchScene("CheckPoint");


    },
    classicMode()
    {
        cc.wwx.AudioManager.playAudioButton();

        //经典模式
        cc.wwx.UserInfo.playMode = "classic";
        cc.wwx.UserInfo.ballInfo.ballNum = 1;
        cc.wwx.SceneManager.switchScene("GameScene");

    },
    ball100Mode()
    {
        //白球模式
        cc.wwx.AudioManager.playAudioButton();

        cc.wwx.UserInfo.ballInfo.ballNum = 100;
        cc.wwx.UserInfo.playMode = "100ball";

        cc.wwx.MapCheckPoint.get100MapCheckPointData(function (checkPointData) {
            cc.wwx.OutPut.log("clickItemCallBack: " + JSON.stringify(checkPointData));
            cc.wwx.UserInfo.checkPointData = checkPointData;
            cc.wwx.SceneManager.switchScene("GameScene");

        });

    },
    signInReward()
    {
        //签到奖励
        this._openCheckIn = true;
        cc.wwx.TCPMSG.getDaily_checkin_status();


    },
    showAdsReward()
    {
        //看广告得奖励
    },
    _rankPopWindow()
    {
        cc.wwx.PopWindowManager.popWindow("prefab/GameRanKWindow","GameRankWindow");
    },
    rank()
    {
        cc.wwx.AudioManager.playAudioButton();

        //排行榜
        cc.wwx.TCPMSG.getRank();


    },
    shop()
    {
        cc.wwx.AudioManager.playAudioButton();

        //商城
        if(cc.wwx.PayModel.mExchangeList.length > 0)
        {
            cc.wwx.PopWindowManager.popWindow("prefab/shop/Shop","ShopWindow");

        }

    },
    invateRewardCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();

        //奖励
        cc.wwx.PopWindowManager.popWindow("prefab/invate/Invate","InvateRewardWindow");


    },
    soundCallBack()
    {
        let musicSwith = cc.wwx.AudioManager.getAudioMusicSwitch();
        let effectSwith = cc.wwx.AudioManager.getAudioEffectSwitch();
        if(musicSwith || effectSwith)
        {
            cc.wwx.AudioManager.trunAudioSound(0);
            this.soundBtnSprite.spriteFrame = this.soundOffSpriteFrame;


        }
        else
        {
            cc.wwx.AudioManager.trunAudioSound(1);
            this.soundBtnSprite.spriteFrame = this.soundOnSpriteFrame;


        }
    },
    shareCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroup);

        //皮肤
    },

});