cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad()
    {
        cc.wwx.Util.adaptIpad();

    },
    goBackHallCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.SceneManager.switchScene("GameHall");

    },
    roomClickCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.SceneManager.switchScene("GameVSReady");
    },
})