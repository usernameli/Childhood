var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{

    },
    onLoad()
    {
        this._isAction = false;

        this._super();

    },
    onDestroy()
    {

    },
    closeWindowCallBack()
    {
        this.closeWindow();

    },
    invateCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.Share.runShare(cc.wwx.BurialShareType.DailyInvite);

    }
});