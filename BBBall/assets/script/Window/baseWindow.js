cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, function() {
            // console.log('Item ' + this.itemID + ' clicked');
        }, this);
    },
    update()
    {

    }
})