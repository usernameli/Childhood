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
        let maxID = this.itemID  * 4;
        if(this.itemID % 2 === 0)
        {
            //偶数行
            for(let i = maxID,k = 0 ; i >= 0,k < 4;i--,k++)
            {
                this["item" + k ].getComponent('CheckPointItem').updateItem(i);
            }
        }
        else
        {
            //奇数行
            for(let i = maxID,j = 3; j >=0;i--,j--)
            {
                this["item" + j ].getComponent('CheckPointItem').updateItem(i);
            }
        }

    },

});
