cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad()
    {
        this.anim = this.node.getComponent(cc.Animation);
        this.anim.play();
    }
});