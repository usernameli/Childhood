var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        resultScore:{
            default:null,
            type:cc.Label
        },
        tropNode:{
            default:null,
            type:cc.Node
        },
        levelNode:{
            default:null,
            type:cc.Node
        },
        starNode:{
            default:[],
            type:cc.Node
        },
        experienceLabel:{
            default:null,
            type:cc.Label
        },
        experienceProgress:{
            default:null,
            type:cc.ProgressBar
        },
        continueSprite:{
            default:null,
            type:cc.Sprite
        },
        continueSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        historyScoreLabel:{
            default:null,
            type:cc.Label
        },
        topTitile:{
            default:null,
            type:cc.Label
        },
        _gameResult:false,

    },
    onLoad()
    {
        this._super();
        let gameResult = this._params['GameResult'];
        this.resultScore.string = cc.wwx.UserInfo.currentSocre;
        let gameData = cc.wwx.UserInfo.gdata;
        this._gameResult = gameResult;
        if(this._gameResult)
        {
            cc.wwx.AudioManager.playGameResultSuccess();
        }
        else
        {
            cc.wwx.AudioManager.playGameResultFailed();
        }
        if(cc.wwx.UserInfo.playMode === "level")
        {

            this.experienceLabel.string = gameData["curProgressValue"] + "/" + gameData['maxProgressValue'];
            this.experienceProgress.progress = gameData["curProgressValue"]/gameData['maxProgressValue']
            this.levelNode.active = true;
            this.tropNode.active = false;


            if(gameResult === true)
            {
                this.topTitile.string = "闯关成功";
                this.continueSprite.spriteFrame = this.continueSpriteFrame;
                let star = gameData["levelHighStar"][0];
                if(star === 1)
                {
                    this.starNode[0].active = true;

                    let star1 = this.starNode[1].getChildByName('star1');
                    let star2 = this.starNode[1].getChildByName('star2');
                    star1.active = false;
                    star2.active = false;

                    star1 = this.starNode[2].getChildByName('star1');
                    star2 = this.starNode[2].getChildByName('star2');
                    star1.active = false;
                    star2.active = false;
                }
                else if(star === 2)
                {
                    this.starNode[0].active = true;
                    this.starNode[1].active = true;
                    let star1 = this.starNode[2].getChildByName('star1');
                    let star2 = this.starNode[2].getChildByName('star2');
                    star1.active = false;
                    star2.active = false;
                }
                else
                {
                    this.starNode[0].active = true;
                    this.starNode[1].active = true;
                    this.starNode[2].active = true;
                }
            }
            else
            {
                this.topTitile.string = "闯关失败";
                let star1 = this.starNode[0].getChildByName('star1');
                let star2 = this.starNode[0].getChildByName('star2');
                star1.active = false;
                star2.active = false;

                star1 = this.starNode[1].getChildByName('star1');
                star2 = this.starNode[1].getChildByName('star2');
                star1.active = false;
                star2.active = false;

                star1 = this.starNode[2].getChildByName('star1');
                star2 = this.starNode[2].getChildByName('star2');
                star1.active = false;
                star2.active = false;
            }

        }
        else if(cc.wwx.UserInfo.playMode === "100ball")
        {
            this.levelNode.active = false;
            this.tropNode.active = true;
            this.historyScoreLabel.string = "历史最佳:" + gameData['100ballHighScore'];
        }
        else
        {
            this.levelNode.active = false;
            this.tropNode.active = true;
            this.historyScoreLabel.string = "历史最佳:" +gameData['classicHighScore'];

        }
    },
    homeCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.SceneManager.switchScene("GameHall");

    },
    continueBtnCallBack()
    {

        if(this._gameResult && cc.wwx.UserInfo.playMode === "level")
        {
            //下一关
            cc.wwx.UserInfo.checkPointID += 1;
            let self = this;
            cc.wwx.MapCheckPoint.getMapCheckPointData(cc.wwx.UserInfo.checkPointID ,function (checkPointData) {
                cc.wwx.UserInfo.checkPointData = checkPointData;
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_GAME_RESTART);
                self.closeWindow();


            });
        }
        else
        {
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_GAME_RESTART);
            this.closeWindow();

        }


    }
})