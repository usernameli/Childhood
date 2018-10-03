cc.Class({
    extends:cc.Component,
    properties:{
        classic100ballNode:{
            default:null,
            type:cc.Node
        },
        trophyLabel:{
            default:null,
            type:cc.Label
        },
        trophyNowLabel:{
            default:null,
            type:cc.Label
        },
        levelCheckPointNode:{
            default:null,
            type:cc.Node
        },
        levelCheckPointLabel:{
            default:null,
            type:cc.Label
        },
        levelScoreLabel:{
            default:null,
            type:cc.Label
        },
        starProgress:{
            default:null,
            type:cc.ProgressBar
        },
        starSprite:{
            default:[],
            type:cc.Sprite
        },
        starSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        unStarSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        shareBtn:{
            default:null,
            type:cc.Node
        },
        _objNum:0,
        _shareGroupClick:false,
    },
    onLoad()
    {
        //
        this._init();
        this.starProgress.progress = 0.0;

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_UPDATE_GAME_SCORE,this._updateScore,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this._ballGameRestart,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_WARNING_SHOW,this._ballWarningShow,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_WARNING_HIDE,this._ballWarningHide,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_FAILED,this.wxShareFailed,this);

    },
    shareGroupCallBack()
    {
        this._shareGroupClick = true;
        cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupAlive);

    },
    _init()
    {
        this._objNum = 0;
        if(cc.wwx.UserInfo.playMode === "level")
        {
            let pointCheckData = cc.wwx.UserInfo.checkPointData;
            let hallAhall = pointCheckData.length / 2;
            for(let i = hallAhall - 1; i >= 0;i--)
            {
                let list = pointCheckData[i];
                for(let k = 0; k < list.length;k++)
                {
                    if(list[k] > 0)
                    {
                        this._objNum += 1;
                    }
                }

            }
        }

        cc.wwx.UserInfo.currentSocre = 0;
        this._shareGroupClick = false;
        this.shareBtn.active = false;
        let gameData = cc.wwx.UserInfo.gdata;
        this.trophyNowLabel.string = "0";
        this.levelScoreLabel.string = "0";
        this.starProgress.progress  = 0;
        this.starSprite[0].spriteFrame = this.unStarSpriteFrame;
        this.starSprite[1].spriteFrame = this.unStarSpriteFrame;
        this.starSprite[2].spriteFrame = this.unStarSpriteFrame;

        if(cc.wwx.UserInfo.playMode === 'level')
        {
            this.classic100ballNode.active = false;
            this.levelCheckPointNode.active = true;
            this.levelCheckPointLabel.string = "关 卡\n" +cc.wwx.UserInfo.checkPointID;
        }
        else
        {
            this.classic100ballNode.active = true;
            this.levelCheckPointNode.active = false;

            if(cc.wwx.UserInfo.playMode === 'classic')
            {
                this.trophyLabel.string = "历史最佳\n" + gameData['classicHighScore'];
            }
            else
            {
                this.trophyLabel.string = "历史最佳\n" + gameData['100ballHighScore'];

            }
        }
    },
    _ballWarningShow()
    {
        let fg = true;
        if(cc.wwx.ClientConf.ClientConfList["hiddenNodes"])
        {
            if (cc.wwx.ClientConf.ClientConfList["hiddenNodes"].contains("shareReviveBtn"))
            {
                fg = false;
            }
        }

        this.shareBtn.active = fg;

    },
    _ballWarningHide()
    {
        this.shareBtn.active = false;
    },
    _ballGameRestart()
    {
        this._init();
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this._ballGameRestart,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_UPDATE_GAME_SCORE,this._updateScore,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_WARNING_SHOW,this._ballWarningShow,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_WARNING_HIDE,this._ballWarningHide,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_FAILED,this.wxShareFailed,this);

    },
    wxShareSuccess(argument)
    {
        cc.wwx.OutPut.log("ResultFirstWindow wxShareSuccess",JSON.stringify(argument));
        if( this._shareGroupClick && !argument["isShareGroupId"] && argument["burialId"] === cc.wwx.BurialShareType.DailyInviteGroupAlive)
        {
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_THIRD_LINE_OF_EXPLOSIONS);

        }
    },
    wxShareFailed(augument)
    {
        this._shareGroupClick = false;
    },
    _updateScore(params)
    {
        this.trophyNowLabel.string = params['updateScore'];
        this.levelScoreLabel.string = params['updateScore'];
        cc.wwx.UserInfo.currentSocre = params['updateScore'];

        if(cc.wwx.UserInfo.playMode === "level")
        {
            let levelStarScore = cc.wwx.MapPointScore.getLevelStarScore(cc.wwx.UserInfo.checkPointID,cc.wwx.UserInfo.ballInfo.ballNum,this._objNum);
            cc.wwx.OutPut.log("levelStarScore: ",cc.wwx.UserInfo.ballInfo.ballNum);
            cc.wwx.OutPut.log("levelStarScore: ",this._objNum);
            cc.wwx.OutPut.log("levelStarScore: ",levelStarScore);
            this.starProgress.progress = cc.wwx.UserInfo.currentSocre / levelStarScore;
            if(cc.wwx.UserInfo.currentSocre > 0)
            {
                this.starSprite[0].spriteFrame = this.starSpriteFrame;
                cc.wwx.UserInfo.currentStar = 1
            }
            if(cc.wwx.UserInfo.currentSocre >= levelStarScore * 0.7)
            {
                this.starSprite[1].spriteFrame = this.starSpriteFrame;
                cc.wwx.UserInfo.currentStar = 2

            }
            if(cc.wwx.UserInfo.currentSocre >= levelStarScore)
            {
                this.starSprite[2].spriteFrame = this.starSpriteFrame;
                cc.wwx.UserInfo.currentStar = 3

            }
        }


    },
})