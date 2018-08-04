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
        let self = this;
        let timerNum = 10;
        self.timerLabel.string = "10";
        self.timerProgressRed.fillRange = 1;
        cc.wwx.Timer.setTimer(this,function () {
            timerNum -= 1;
            self.timerProgressRed.fillRange = (timerNum / 10)
            self.timerLabel.string = timerNum.toString();
        },1,9,0)
    },
    showVideoCallBack()
    {

    },
    skipCallBack()
    {
        this.closeWindow()

    },
    update()
    {

    }
})