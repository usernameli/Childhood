import JackalGlobal from "./../Global";
cc.Class({
    extends: cc.Component,

    properties: {
        chioceCar:{
            default:null,
            type:cc.Node
        }
    },

    onLoad()
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        // cc.director.loadScene("gameScene");
        cc.director.loadScene("gameSceneStage1");

    },
    start () {

    },
    onKeyDown:function (event) {
        switch(event.keyCode)
        {
            case cc.KEY.up:
                this.chioceCar.setPosition(cc.p(-115,-130));
                break;
            case cc.KEY.down:
                this.chioceCar.setPosition(cc.p(-115,-170));
                break;
            case cc.KEY.enter:
                JackalGlobal.AudioMgr.playSFX("sounddead.wav");

        }
    },

    // update (dt) {},
});
