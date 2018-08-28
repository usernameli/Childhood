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
        }
    },
    onLoad()
    {
        //
        this._init();
        this.starProgress.progress = 0.0;

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_UPDATE_GAME_SCORE,this._updateScore,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this._ballGameRestart,this);

    },
    _init()
    {
        cc.wwx.UserInfo.currentSocre = 0;

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
    _ballGameRestart()
    {
        this._init();
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this._ballGameRestart,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_UPDATE_GAME_SCORE,this._updateScore,this);

    },
    _updateScore(params)
    {
        this.trophyNowLabel.string = params['updateScore'];
        this.levelScoreLabel.string = params['updateScore'];
        cc.wwx.UserInfo.currentSocre = params['updateScore'];


        let levelStarScore = cc.wwx.MapPointScore.getLevelStarScore(cc.wwx.UserInfo.checkPointID,cc.wwx.UserInfo.ballInfo.ballNum);
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

    },
})