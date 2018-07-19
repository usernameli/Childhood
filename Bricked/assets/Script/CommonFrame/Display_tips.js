
cc.Class({
    extends: cc.Component,

    properties: {
        wLabelDesc : cc.Label,
    },

    show : function(params) {
        this.wLabelDesc.string = params.content;

        this.node.runAction(cc.sequence(
            cc.delayTime(params.duration || 2),
            cc.callFunc(function() {
                this.node.removeFromParent();
            }.bind(this))
        ));
    },
});
