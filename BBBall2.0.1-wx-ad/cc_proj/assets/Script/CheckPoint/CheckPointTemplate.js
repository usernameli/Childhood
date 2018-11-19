cc.Class({
    extends: cc.Component,

    properties: {

        item0:{
            default:null,
            type:cc.Node
        },
        item1:{
            default:null,
            type:cc.Node
        },
        item2:{
            default:null,
            type:cc.Node
        },
        item3:{
            default:null,
            type:cc.Node
        },

        itemID: 0
    },

    // use this for initialization
    onLoad: function () {
    },

    updateItem: function(itemId) {
        this.itemID = itemId;
        let maxID = (this.itemID - 1)  * 4 + 1;

        for(let i = 0; i < 4;i++)
        {
            this["item" + i ].getComponent('CheckPointItem').updateItem(maxID + i);
        }


    },

});
