cc.Class({
    extends:cc.Component,
    properties:{
        itemID: 0
    },
    onLoad: function () {

    },

    updateItem: function(itemId) {
        cc.wwx.OutPut.log('Shop Item ',itemId);

    }
});