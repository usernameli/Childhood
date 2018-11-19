cc.Class({
    extends:cc.Component,
    properties:{
        fgSprite:{
            default:null,
            type:cc.Node
        },
        diamondsIcon:{
            default:null,
            type:cc.Sprite
        },
        diamondsNum:{
            default:null,
            type:cc.Label
        },
        diamondPrice:{
            default:null,
            type:cc.Node
        },
        videoIcon:{
            default:null,
            type:cc.Node
        },
        itemID: 0,
        _shopList:null,
    },
    onLoad: function () {
        this._shopList = cc.wwx.PayModel.mPurchaseList;
        this._shopItemList = null;
    },

    updateItem: function(itemId) {
        cc.wwx.OutPut.log('Shop Item ',itemId);
        this.itemID = itemId;
        cc.wwx.OutPut.log('Shop Item ',JSON.stringify(this._shopList[itemId - 1]));
        let list = this._shopList[itemId - 1];
        this._shopItemList = list;
        let  price = this.diamondPrice.getComponent("cc.Label");
        price.string =  "￥" + list['price'] + ".00";

        this.diamondsNum.string = list['price_diamond'];
        var self = this;
        this.fgSprite.active = true;
        if(itemId === 1)
        {
            cc.loader.loadRes("images/MainMenu", cc.SpriteAtlas, function (err, atlas) {

                self.fgSprite.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('Ball_Shop__Free_Flg');
            });
        }
        else if(itemId >= 5)
        {
            let fileName = {
                5:'Ball_Shop__10_Flag',
                6:'Ball_Shop__15_Flag',
                7:'Ball_Shop__20_Flag',
                8:'Ball_Shop__25_Flag',
                9:'Ball_Shop__50_Flag'
            };
            cc.loader.loadRes("images/MainMenu", cc.SpriteAtlas, function (err, atlas) {
                self.fgSprite.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(fileName[itemId]);
            });
        }
        else
        {
            this.fgSprite.active = false;
        }

        cc.loader.loadRes("images/MainMenu", cc.SpriteAtlas, function (err, atlas) {
            let diamondsFileName = 'Ball_Shop__Diamonds_' + itemId;
            self.diamondsIcon.spriteFrame = atlas.getSpriteFrame(diamondsFileName);
        });


    },
    clickCallBack()
    {
        //点击购买
        // this._shopItemList
        cc.wwx.WeChat.purchase(this._shopItemList.id, this._shopItemList.price, this._shopItemList.name, 1);
    }
});