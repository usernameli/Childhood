var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{

        checkInRewardLabel:{
            default:[],
            type:cc.Label
        },
        checkInMaskNode:{
            default:[],
            type:cc.Node
        },
        checkInYellowBG:{
            default:[],
            type:cc.Node
        },
        checkInButton:{
            default:null,
            type:cc.Node
        },
        isCheckInButton:{
            default:null,
            type:cc.Node
        },
        doubleCheckInButton:{
            default:null,
            type:cc.Node
        },
        isDoubleCheckInButton:{
            default:null,
            type:cc.Node
        },
        diamondList:{
            default:[],
            type:cc.Sprite
        }
    },
    onLoad()
    {
        // this._isAction = false;
        this._super();
        // cc.wwx.OutPut.log(this._windowName,"onLoad",JSON.stringify(this._params));
        this.isCheckInButton.active = false;
        this.isDoubleCheckInButton.active = false;
        this.checkInButton.active = true;
        // this.doubleCheckInButton.active = true;
        this.refreshUI(this._params);

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN,this.ballDailyCheckin,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);

    },
    ballDailyCheckin(argument)
    {
        let result = argument['result'];
        this.refreshUI(result);
    },
    refreshUI(checkData)
    {
        if(checkData)
        {
            let haveCheckIn = false;
            let haveDoubleCheckIn = false;
            let self = this;
            for(let i = 0; i < checkData['states'].length;i++)
            {
                let list = checkData['states'][i];
                this.checkInRewardLabel[i].string = list['rewards'][0]['count'];
                this.checkInYellowBG[i].active = false;

                if(list['st'] === 2)
                {
                    this.checkInMaskNode[i].active = true;
                }
                else if(list['st'] === 0)
                {
                    this.checkInMaskNode[i].active = false;

                }
                else
                {
                    this.checkInMaskNode[i].active = false;
                    this.checkInYellowBG[i].active = true;
                }

                if(list['st'] === 1)
                {
                    haveCheckIn = true;
                }

                if(list['canDoubleReward'] === 1)
                {
                    haveDoubleCheckIn = true;
                }
                let itemId = list['rewards'][0]['itemId'];
                let spriteFrame = 'Ball_Shop__Diamonds_1';
                if(itemId === "item:1012")
                {
                    spriteFrame = 'Ball_Sigln_DiZheng';
                }
                else if(itemId === "item:1013")
                {
                    spriteFrame = 'Ball_Sigln_JiGuang';

                }
                else if(itemId === "item:1014")
                {
                    spriteFrame = 'Ball_Sigln_Row';

                }
                else if(itemId === "item:1015")
                {
                    spriteFrame = 'Ball_Sigln_Plus_Ball';

                }
                else
                {
                    spriteFrame = 'Ball_Shop__Diamonds_1';
                }

                cc.wwx.Util.loadResAtlas("images/MainMenu",function (err,atlas) {
                    self.diamondList[i].spriteFrame = atlas.getSpriteFrame(spriteFrame);
                });
            }

            if(haveCheckIn)
            {
                this.checkInButton.active = true;
                this.isCheckInButton.active = false;
            }
            else
            {
                this.checkInButton.active = false;
                this.isCheckInButton.active = true;
            }

            if(haveDoubleCheckIn)
            {
                this.doubleCheckInButton.active = true;
                this.isDoubleCheckInButton.active = false;
            }
            else
            {
                this.doubleCheckInButton.active = false;
                this.isDoubleCheckInButton.active = true;
            }
        }

    },
    signShareCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        if(CC_WECHATGAME && cc.wwx.VideoAD.getShowVideoAdIsLoaded())
        {
            cc.wwx.VideoAD.showVideoAd(function (end) {

                if(end)
                {
                    cc.wwx.TCPMSG.getShareReward("sign");

                }
            },function () {

                cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupReward);

            })
        }
        else
        {
            cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupReward);

        }

    },
    wxShareSuccess(argument)
    {
        cc.wwx.OutPut.log("signInWindow wxShareSuccess",JSON.stringify(argument));
        if(!argument["isShareGroupId"] && argument["burialId"] === cc.wwx.BurialShareType.DailyInviteGroupReward)
        {
            cc.wwx.TCPMSG.getShareReward("sign");

        }
    },
    signInCallBack()
    {
        cc.wwx.TCPMSG.daily_checkin();
        // this.closeWindow()
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DAILY_CHECKIN,this.ballDailyCheckin,this);

    },
    closeWindowCallBack()
    {
        this.closeWindow()

    }
});