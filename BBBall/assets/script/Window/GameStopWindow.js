var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        _tag:"GameStopWindow"
    },
    onLoad()
    {
        this._super();
    },
    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,"onDestroy");
    },
    _closeWindow()
    {
        cc.wwx.PopWindowManager.remvoeWindowByName("prefab/GameStopWindow")

    },
    goBackHallCallBack()
    {
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
    musicCallBack()
    {

    }
})