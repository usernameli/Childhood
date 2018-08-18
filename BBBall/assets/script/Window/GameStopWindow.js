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
        cc.wwx.AudioManager.playAudioButton();

    },
    musicOffCallBack()
    {
        this.musicBTNOn.active = true;
        this.musicBTNOff.active = false;
        cc.wwx.AudioManager.playMusicGame();
    }
})