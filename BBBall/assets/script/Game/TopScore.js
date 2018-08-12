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
        }
    },
    onLoad()
    {

        this._init();
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_UPDATE_GAME_SCORE,this._updateScore,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this._ballGameRestart,this);

    },
    _init()
    {
        cc.wwx.UserInfo.currentSocre = 0;

        let gameData = cc.wwx.UserInfo.gdata;
        this.trophyNowLabel.string = "0";
        this.levelScoreLabel.string = "0";

        if(cc.wwx.UserInfo.playMode === 'level')
        {
            this.classic100ballNode.active = false;
            this.levelCheckPointNode.active = true;
            this.levelCheckPointLabel.string = "第" +cc.wwx.UserInfo.checkPointID + "关";
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
    },
})