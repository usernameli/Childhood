var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        musicBTNOn:{
            default:null,
            type:cc.Node
        },
        musicBTNOff:{
            default:null,
            type:cc.Node
        },
        _tag:"GameStopWindow"
    },
    onLoad()
    {
        this._super();
        this.musicBTNOn.active = true;
        this.musicBTNOff.active = false;

        let musicSwith = cc.wwx.AudioManager.getAudioMusicSwitch();
        let effectSwith = cc.wwx.AudioManager.getAudioEffectSwitch();
        if(musicSwith || effectSwith)
        {
            this.musicBTNOn.active = true;
            this.musicBTNOff.active = false;
        }
        else
        {


            this.musicBTNOn.active = false;
            this.musicBTNOff.active = true;
        }

    },
    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,"onDestroy");
    },
    _closeWindow()
    {
        this.closeWindow();
    },
    goBackHallCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();

        if(cc.wwx.UserInfo.playMode === "classic")
        {
            cc.wwx.TCPMSG.updateUpLoadGameScore(cc.wwx.SystemInfo.gameId,
                cc.wwx.UserInfo.playMode,
                cc.wwx.UserInfo.currentSocre,
                cc.wwx.UserInfo.checkPointID,0,cc.wwx.UserInfo.currentStar);
        }

        cc.wwx.SceneManager.switchScene("GameHall");
    },
    restartCallBack()
    {

        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_GAME_RESTART);
        this._closeWindow();

    },
    continueCallBack()
    {
        this._closeWindow();
    },
    musicOnCallBack()
    {

        this.musicBTNOn.active = false;
        this.musicBTNOff.active = true;
        cc.wwx.AudioManager.stopMusic();
        cc.wwx.AudioManager.trunAudioSound(0);

        cc.wwx.AudioManager.playAudioButton();

    },
    musicOffCallBack()
    {
        this.musicBTNOn.active = true;
        this.musicBTNOff.active = false;
        cc.wwx.AudioManager.trunAudioSound(1);

        cc.wwx.AudioManager.playMusicGame();

    }
})