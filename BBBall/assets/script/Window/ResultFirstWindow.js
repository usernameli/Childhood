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
        this.timerNum = 10;
        self.timerLabel.string = "10";
        self.timerProgressRed.fillRange = 1;
        cc.wwx.Timer.setTimer(this,this._timerCallBack,1,9,0);
    },
    _timerCallBack()
    {
        this.timerNum -= 1;
        this.timerProgressRed.fillRange = (this.timerNum / 10);
        this.timerLabel.string = this.timerNum.toString();
    },
    onDestroy()
    {
        cc.wwx.Timer.cancelTimer(this,this._timerCallBack)
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