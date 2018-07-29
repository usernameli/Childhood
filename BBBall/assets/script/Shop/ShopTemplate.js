cc.Class({
    extends:cc.Component,
    properties:{
        itemID: 0
    },
    onLoad: function () {
        this.node.on('touched', function() {
            console.log('Item ' + this.itemID + ' clicked');
        }, this);
    },

    updateItem: function(itemId) {
        console.log('Item ' + itemId);

    }
});