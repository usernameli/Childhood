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

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);

        // cc.wwx.Timer.setTimer(this,this._timerCallBack1,0.01,999,0);
    },

    thirdLineOfExplosions()
    {
        this.closeWindow();
    },
    _timerCallBack1()
    {
        this.timerProgressRed.fillRange -= 0.001;

    },
    _timerCallBack()
    {
        this.timerNum -= 1;
        this.timerLabel.string = this.timerNum.toString();
        this.timerProgressRed.fillRange -= 0.1;

        if(this.timerNum == 10)
        {
            this.skipCallBack();
        }

    },
    onDestroy()
    {
        cc.wwx.Timer.cancelTimer(this,this._timerCallBack);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS,this.wxShareSuccess,this);


    },
    wxShareSuccess(argument)
    {
        cc.wwx.OutPut.log("ResultFirstWindow wxShareSuccess",JSON.stringify(argument));
        if( !argument["isShareGroupId"] && argument["burialId"] === cc.wwx.BurialShareType.DailyInviteGroupAlive)
        {
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_THIRD_LINE_OF_EXPLOSIONS);
            this.closeWindow();

        }
    },
    shareWeixCallBack()
    {
        cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupAlive);

    },
    consumeDiamondCallBack()
    {
        cc.wwx.TCPMSG.consumeItem(1011,1);

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