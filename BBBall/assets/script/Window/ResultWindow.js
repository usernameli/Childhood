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
        experienceLabelSum:{
            default:null,
            type:cc.Label
        },
        experienceLabelOwn:{
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
        rankListLayOut:{
            default:null,
            type:cc.Node
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
        this.experienceLabelOwn.string = gameData["curProgressValue"] ;
        this.experienceLabelSum.string = "/" + gameData['maxProgressValue'];
        this.experienceProgress.progress = gameData["curProgressValue"]/gameData['maxProgressValue'];

        if(cc.wwx.UserInfo.playMode === "level")
        {


            this.levelNode.active = true;
            this.tropNode.active = false;


            if(gameResult === true)
            {
                this.topTitile.string = "闯关成功";
                this.continueSprite.spriteFrame = this.continueSpriteFrame;
                let star = gameData["levelHighStar"][cc.wwx.UserInfo.checkPointID - 1];
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
                else if(star === 3)
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

        if(CC_WECHATGAME)
        {
            this._createDisplay();
            cc.wwx.WeChat.drawResultFriendRank(cc.size(550, 258),cc.wwx.UserInfo.playMode);
        }

    },
    start()
    {
        this._super();
        this.tex = new cc.Texture2D();
    },
    _createDisplay () {
        this.scheduleOnce(function(){
            let node = new cc.Node();
            this.display = node.addComponent(cc.Sprite);
            this.rankListLayOut.removeAllChildren(true);
            this.rankListLayOut.addChild(node);
        }, 1);
    },
    // 刷新开放数据域的纹理
    _updateSubDomainCanvas () {

        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    update(dt)
    {

        if (CC_WECHATGAME && this.tex && this.display) {
            this._updateSubDomainCanvas();

            return;
        }
    },
    homeCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.SceneManager.switchScene("GameHall");

    },
    continueBtnCallBack()
    {

        if(cc.wwx.UserInfo.playMode === "level")
        {
            let self = this;

            //下一关
            if(this._gameResult)
            {
                cc.wwx.UserInfo.checkPointID += 1;
                cc.wwx.MapCheckPoint.getMapCheckPointData(cc.wwx.UserInfo.checkPointID ,function (checkPointData) {
                    cc.wwx.UserInfo.checkPointData = checkPointData;
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_GAME_RESTART);
                    self.closeWindow();


                });
            }
            else
            {
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_GAME_RESTART);
                self.closeWindow();

            }


        }
        else
        {
            if(cc.wwx.UserInfo.playMode === "classic")
            {
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_GAME_RESTART);

            }
            else
            {
                cc.wwx.MapCheckPoint.get100MapCheckPointData(function (checkPointData) {
                    cc.wwx.OutPut.log("clickItemCallBack: " + JSON.stringify(checkPointData));
                    cc.wwx.UserInfo.checkPointData = checkPointData;
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_GAME_RESTART);

                });
            }

            this.closeWindow();

        }


    }
})