import JackalGlobal from "./../Global";

cc.Class({
    extends: cc.Component,

    properties: {
        bomb:{
            default:null,
            type:cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },
    /*
     动画播放完毕
     */
    onAnimCompleted()
    {
        console.log("grenade is destory");
        let bomb = cc.instantiate(this.bomb);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(bomb);
        bomb.setPosition(cc.p(0,0));
        bomb.getComponent('bomb').parentNode = this;
        JackalGlobal.AudioMgr.playSFX("bomb.wav");
        JackalGlobal.Event.emit("grenade-fire_end",{});
        // let MoveX = this.bulletDownNode.getPositionX();
        // let MoveX = this.bulletDownNode.getPositionX();
        // this.node.destroy();
    },
    start () {

    },

    update (dt) {

    },
});
