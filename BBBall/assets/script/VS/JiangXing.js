cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad()
    {
        this.anim = this.node.getComponent(cc.Animation);
    },
    showAnimationCallBack()
    {
        this.anim.play();
    },
    playAnimation()
    {
        this.scheduleOnce(this.showAnimationCallBack, 0.5);

    }
});