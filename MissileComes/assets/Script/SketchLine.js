
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {

    },

    start () {
        setTimeout(function () {

            var that = this;
            var walk = cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                that.node.destroy();
            }));
            this.node.runAction(walk);

        }.bind(this), 1000);
    },

    // update (dt) {},
});
