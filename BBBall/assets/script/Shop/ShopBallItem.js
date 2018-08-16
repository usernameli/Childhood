cc.Class({
    extends:cc.Component,
    properties:{
        isOwn:{
            default:null,
            type:cc.Node,
        },
        isUsed:{
            default:null,
            type:cc.Node,
        },
        ballName:{
            default:null,
            type:cc.Label
        },
        ballSpriteFrame:{
            default:null,
            type:cc.Sprite
        },
        ballPrice:{
            default:null,
            type:cc.Label
        },
        isUsedOwnBTN:{
            default:null,
            type:cc.Node
        },
        isUsedOwnLabel:{
            default:null,
            type:cc.Label
        },
        isUnOwnBTN:{
            default:null,
            type:cc.Node
        },
        _tag:"ShopBallItem",
        itemID:0,
    },
    onLoad()
    {
        this._ballList = cc.wwx.PayModel.mExchangeList;
        this._ballItemList = null;
    },

    updateItem(itemID)
    {
        this.isOwn.active = false;
        this.isUsed.active = false;
        this.isUsedOwnBTN.active = false;
        this.isUnOwnBTN.active = true;
        cc.wwx.OutPut.log(this._tag,"updateItem itemID",itemID);
        cc.wwx.OutPut.log('ShopBall Item ',JSON.stringify(this._ballList[itemID - 1]));

        this.itemID = itemID;
        let list = this._ballList[itemID - 1];

        if(list)
        {
            this.node.active = true;
            this._ballItemList = list;

            this.ballName.string = list['name'];
            this.ballPrice.string = list['price_diamond'];
            let spriteFrame = 'SHOP_' + list['id'];
            let self = this;
            cc.wwx.Util.loadResAtlas("image/Ball",function (err,atlas) {
                self.ballSpriteFrame.spriteFrame = atlas.getSpriteFrame(spriteFrame);
            });
        }
        else
        {
            this.node.active = false;
        }


    },
    exchangeCallBack()
    {
        let diamondNum = parseInt(cc.wwx.UserInfo.bagData.diamondCount);
        if(this._ballItemList["price_diamond"] > diamondNum)
        {
            //砖石不够
            cc.wwx.TipManager.showMsg('您的钻石不足', 3);

            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_CHANGE_TAB_SHOP,{index:1});
        }
        else
        {
            let self = this;
            cc.wwx.PopWindowManager.popWindow("prefab/PopBoxWindow","PopBoxWindow",
                {text:'您确定使用'+this._ballItemList["price_diamond"]+"钻石兑换" + this._ballItemList["name"]+"吗？",okCallBack:function () {
                        cc.wwx.TCPMSG.exchange(self._ballItemList["id"])
                    }});

        }

    },
    isOwnCallBack()
    {

    },
    update()
    {

    }
})