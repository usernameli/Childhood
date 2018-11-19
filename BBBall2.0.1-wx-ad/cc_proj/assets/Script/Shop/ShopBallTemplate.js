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

        itemID: 0
    },

    // use this for initialization
    onLoad: function () {
    },

    updateItem: function(itemId) {
        this.itemID = itemId;
        this["item0"].getComponent('ShopBallItem').updateItem(itemId * 2 - 1);
        this["item1"].getComponent('ShopBallItem').updateItem(itemId * 2);


    },
    reloadData()
    {
        this["item0"].getComponent('ShopBallItem').reloadData();
        this["item1"].getComponent('ShopBallItem').reloadData();
    },

});