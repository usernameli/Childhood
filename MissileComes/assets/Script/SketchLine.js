
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {

    },

    start () {
        setTimeout(function () {
            this.node.destroy();
        }.bind(this), 3000);
    },

    // update (dt) {},
});
