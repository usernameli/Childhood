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
    },
    onLoad()
    {
        this._super();
        cc.wwx.AudioManager.playGameOver();

        let self = this;
        let timerNum = 10;
        self.timerLabel.string = "10";
        self.timerProgressRed.fillRange = 1;
        cc.wwx.Timer.setTimer(this,function () {
            timerNum -= 1;
            self.timerProgressRed.fillRange = (timerNum / 10);
            self.timerLabel.string = timerNum.toString();

            if(timerNum === 0)
            {
                cc.wwx.PopWindowManager.popWindow("prefab/ResultWindow","ResultWindow",{GameResult:false});
            }
        },1,9,0)
    },
    showVideoCallBack()
    {

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