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
        taiJiNode:{
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
    reloadData()
    {
        this.updateItem(this.itemID);
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
        //{"id":"PD101_BALL_10_STAR","name":"星星（大）","nameurl":"","price":"0",
        // "priceurl":"","desc":"星星（大）","discount":[],"pic":"","tag":"","buy_type":"exchange",
        // "price_diamond":"300","content":[{"itemId":"item:1025","count":1}]}
        if(list)
        {
            this.node.active = true;
            this._ballItemList = list;

            this.ballName.string = list['name'];
            this.ballPrice.string = list['price_diamond'];
            let spriteFrame = 'SHOP_' + list['id'];
            let self = this;
            cc.wwx.Util.loadResAtlas("images/Ball",function (err,atlas) {
                self.ballSpriteFrame.spriteFrame = atlas.getSpriteFrame(spriteFrame);
            });

            let itemInfo = cc.wwx.UserInfo.findBagItem(list["content"][0]["itemId"].split(":")[1]);
            this.isOwn.active = false;
            this.isUsed.active = false;

            this.taiJiNode.active = false;

            if(itemInfo)
            {
                this.isUnOwnBTN.active = false;
                this.isUsedOwnBTN.active = true;
                this.isUsed.active = false;
                this.isOwn.active = true;

                if(itemInfo["canUse"])
                {
                    this.isUsedOwnLabel.string = "使用中";
                    this.isUsed.active = true;
                    this.isOwn.active = false;

                }
                else
                {
                    this.isUsedOwnLabel.string = "使用";

                }

            }
            else
            {
                this.isUnOwnBTN.active = true;
                this.isUsedOwnBTN.active = false;

                if(list["id"] === "PD101_BALL_15_TAIJI")
                {
                    this.taiJiNode.active = true;
                    this.isUnOwnBTN.active = false;

                }
            }
        }
        else
        {
            this.node.active = false;
        }


    },
    taiJiShareCallBack()
    {
        cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.DailyInviteGroupBall);

    },
    exchangeCallBack()
    {
        let diamondNum = parseInt(cc.wwx.UserInfo.bagData.diamondCount);
        if(this._ballItemList["price_diamond"] > diamondNum)
        {
            //砖石不够
            cc.wwx.TipManager.showMsg('宝石不足,分享和邀请好友可以获得更多宝石', 3);
            // cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_CHANGE_TAB_SHOP,{index:1});
        }
        else
        {
            let self = this;
            cc.wwx.PopWindowManager.popWindow("prefab/PopBoxWindow","PopBoxWindow",
                {text:'您确定使用'+this._ballItemList["price_diamond"]+"宝石兑换" + this._ballItemList["name"]+"吗？",okCallBack:function () {
                        cc.wwx.TCPMSG.exchange(self._ballItemList["id"])
                    }});

        }

    },
    isOwnCallBack()
    {
        cc.wwx.TCPMSG.useItemBall(this._ballItemList["content"][0]["itemId"].split(":")[1]);
    },
    update()
    {

    }
})