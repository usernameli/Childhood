cc.Class({
    extends:cc.Component,
    properties:{

        itemID: 0
    },
    onLoad: function () {

    },

    updateItem: function(itemId) {
        this.itemID = itemId;
        cc.wwx.OutPut.log('Rank Item ' + itemId);



    }
});