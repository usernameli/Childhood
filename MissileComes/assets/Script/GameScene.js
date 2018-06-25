cc.Class({
    extends: cc.Component,

    properties: {
        _tag:"GameScene",
    },


    onLoad () {
    },
    backMainMenuCallBack:function () {
        cc.director.loadScene("MainScene");

    },
    start () {

    },

    // update (dt) {},
});
