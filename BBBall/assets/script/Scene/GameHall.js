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
        iconInner:{
            default:null,
            type:cc.Node
        },
        _openCheckIn:false,
        _tag:"GameHall"

    },
    onLoad()
    {
        if(!cc.wwx)
        {
            initMgr();
        }

        cc.wwx.AudioManager.playMusic(this.audioBg);
        this._openCheckIn = false;
        this.diamondsNum.string = cc.wwx.UserInfo.bagData.diamondCount;

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_LOGIN_SUCCESS, this.loginSuccessCallBack, this);

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN_STATUS,this.daily_checkin_status,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_INVITE_CONF,this.invate_conf_status,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_POP,this._rankPopWindow,this);
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
    _createDisplay () {
        this.scheduleOnce(function(){
            let node = new cc.Node();
            this.display = node.addComponent(cc.Sprite);
            this.iconInner.removeAllChildren(true);
            this.iconInner.addChild(node);
            node.setAnchorPoint(0,0.5);
        }, 1);
    },
    start()
    {
        this.tex = new cc.Texture2D();
        // 获取玩家微信信息
        if (CC_WECHATGAME && !cc.wwx.UserInfo.wxAuthor) {
            // cc.wwx.SDKLogin.wxUserInfo1();
            // this._createDisplay();
            // cc.wwx.WeChat.drawUserInfo(cc.size(310 , 100))
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


        cc.director.preloadScene("GameScene", function () {
            cc.log("Next GameScene scene preloaded");
        });
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN_STATUS,this.daily_checkin_status,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_INVITE_CONF,this.invate_conf_status,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_POP,this._rankPopWindow,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_LOGIN_SUCCESS, this.loginSuccessCallBack, this);

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

        if(stateNum > 0)
        {
            cc.wwx.Util.addRedPoint(this.rewardNode,stateNum,cc.v2(45,45));
        }
        else
        {
            this.rewardNode.removeAllChildren();
        }
    },
    daily_checkin_status(params)
    {
        let result = params['result'];
        let states = result['states'];
        if(this._openCheckIn)
        {
            cc.wwx.PopWindowManager.popWindow("prefab/signIn/SignIn","SignInWindow",result);
            return;
        }

        this._openCheckIn = false;

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

        }


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
        cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInvite);

        //皮肤
    },
    // 刷新开放数据域的纹理
    _updateSubDomainCanvas () {

        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    update()
    {
        if (CC_WECHATGAME && this.tex && this.display) {
            this._updateSubDomainCanvas();
            return;
        }
    }
});