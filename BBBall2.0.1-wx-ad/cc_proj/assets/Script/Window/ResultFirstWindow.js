var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        scoreNum:{
            default:null,
            type:cc.Label,
        },
        timerLabel:{
            default:null,
            type:cc.Label,
        },
        timerProgressRed:{
            default:null,
            type:cc.Sprite
        },
        userDiamondBtn:{
            default:null,
            type:cc.Node
        },
        shareLiveBtn:{
            default:null,
            type:cc.Node
        }
    },
    onLoad()
    {
        this._super();
        cc.wwx.AudioManager.playGameOver();

        let self = this;
        this.timerNum = 10;
        self.timerLabel.string = "10";
        self.timerProgressRed.fillRange = 1;
        self.scoreNum.string = cc.wwx.UserInfo.currentSocre;
        if(cc.wwx.ClientConf.ClientConfList["hiddenNodes"])
        {
            if(cc.wwx.ClientConf.ClientConfList["hiddenNodes"].contains("shareReviveBtn"))
            {
                this.userDiamondBtn.position = cc.v2(0,-220);
                this.shareLiveBtn.active = false;
            }
        }
        cc.wwx.Timer.setTimer(this,this._timerCallBack,1,9,0);

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);

        // cc.wwx.Timer.setTimer(this,this._timerCallBack1,0.01,999,0);
    },

    thirdLineOfExplosions()
    {
        this.closeWindow();
    },
    _timerCallBack1()
    {
        this.timerProgressRed.fillRange -= 0.001;

    },
    _timerCallBack()
    {
        this.timerNum -= 1;
        this.timerLabel.string = this.timerNum.toString();
        this.timerProgressRed.fillRange -= 0.1;

        if(this.timerNum == 10)
        {
            this.skipCallBack();
        }

    },
    onDestroy()
    {
        cc.wwx.Timer.cancelTimer(this,this._timerCallBack);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);


    },
    wxShareSuccess(argument)
    {
        cc.wwx.OutPut.log("ResultFirstWindow wxShareSuccess",JSON.stringify(argument));
        if( !argument["isShareGroupId"] && argument["burialId"] === cc.wwx.BurialShareType.DailyInviteGroupAlive)
        {
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_THIRD_LINE_OF_EXPLOSIONS);
            this.closeWindow();

        }
    },
    shareWeixCallBack()
    {
        let dayShareGroupRewardCount = cc.wwx.UserInfo.gdata["dayShareLeftCount"];

        if(CC_WECHATGAME && dayShareGroupRewardCount === 0 && cc.wwx.VideoAD.getShowVideoAdIsLoaded())
        {
            let that = this;
            cc.wwx.VideoAD.showVideoAd(function (end) {

                if(end)
                {
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_THIRD_LINE_OF_EXPLOSIONS);
                    that.closeWindow();

                }
            },function () {

                cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupAlive);

            })
        }
        else
        {
            cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupAlive);

        }
    },
    consumeDiamondCallBack()
    {
        let diamondNum = parseInt(cc.wwx.UserInfo.bagData.diamondCount);
        if(diamondNum >= 200)
        {
            cc.wwx.TCPMSG.consumeItem(1011,200);

        }
        else
        {
            cc.wwx.TipManager.showMsg('宝石不足,邀请好友或分享可以获得更多宝石', 3);

        }

    },
    skipCallBack()
    {
        this.closeWindow();
        cc.wwx.PopWindowManager.popWindow("prefab/ResultWindow","ResultWindow",{GameResult:false});

    },
    update()
    {

    }
})