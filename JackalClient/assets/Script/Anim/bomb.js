cc.Class({
    extends: cc.Component,

    properties: {
        parentNode: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },
    /*
     动画播放完毕
     */
    onAnimCompleted()
    {
        console.log("bomb is destory");
        this.node.destroy();
        this.parentNode.node.destroy();
    },
    start () {

    },

    update (dt) {

    },
});
