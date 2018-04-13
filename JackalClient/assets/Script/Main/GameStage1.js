import JackalGlobal from "../Global";

cc.Class({
    extends: cc.Component,

    properties: {

        _boxManager:null,
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },
    onLoad () {
        JackalGlobal.AudioMgr.playBGM("soundbg1.mp3");
    },

    start () {
        this.initMapPos();
    },
    initMapPos()
    {
        // console.log("initMapPos");
        // this.tileMapBefore.setPosition(cc.p(0,0));
        // this.tileMapAfter.setPosition(cc.p(0,1440));
    },

    update (dt) {

    },
});
