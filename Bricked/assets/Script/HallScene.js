cc.Class({
    extends: cc.Component,

    properties: {
        // defaults, set visually when attaching this script to the Canvas
    },

    // use this for initialization
    onLoad: function () {
        SML.Output.log('HallScene:', 'width', this.node.width);
        SML.Output.log('HallScene:', 'height', this.node.height);
    },

});