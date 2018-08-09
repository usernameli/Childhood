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
        }
    },
    onLoad()
    {
        this._super();
        this.resultScore.string = cc.wwx.UserInfo.currentSocre;
        let gameData = cc.wwx.UserInfo.gdata;

        if(cc.wwx.UserInfo.playMode === "level")
        {
            this.experienceLabel.string = gameData["curProgressValue"] + "/" + gameData['maxProgressValue'];
            this.experienceProgress.progress = gameData["curProgressValue"]/gameData['maxProgressValue']
            this.levelNode.active = true;
            this.tropNode.active = false;
            let star = gameData["levelHighStar"][0];
            if(star === 1)
            {
                this.starNode[0].active = true;
                this.starNode[1].active = false;
                this.starNode[2].active = false;
            }
            else if(star === 2)
            {
                this.starNode[0].active = true;
                this.starNode[1].active = true;
                this.starNode[2].active = false;
            }
            else
            {
                this.starNode[0].active = true;
                this.starNode[1].active = true;
                this.starNode[2].active = true;
            }


        }
        else if(cc.wwx.UserInfo.playMode === "100ball")
        {
            this.levelNode.active = false;
            this.tropNode.active = true;
        }
        else
        {
            this.levelNode.active = false;
            this.tropNode.active = true;
        }
    },
})