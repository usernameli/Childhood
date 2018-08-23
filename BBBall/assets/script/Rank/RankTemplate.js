cc.Class({
    extends:cc.Component,
    properties:{

        itemID: 0,
        rankIcon:{
            default:null,
            type:cc.Node
        },
        rankNum:{
            default:null,
            type:cc.Node
        },
        rankNode:{
            default:null,
            type:cc.Node
        },
        noRankTip:{
            default:null,
            type:cc.Node
        },
        ownBg:{
            default:null,
            type:cc.Node
        },
        headNode:{
            default:null,
            type:cc.Node
        },
        rankName:{
            default:null,
            type:cc.Label
        },
        rankSocre:{
            default:null,
            type:cc.Label
        },
        rankSpriteFrame1:{
            default:null,
            type:cc.SpriteFrame
        },
        rankSpriteFrame2:{
            default:null,
            type:cc.SpriteFrame
        },
        rankSpriteFrame3:{
            default:null,
            type:cc.SpriteFrame
        },
        _rankList:[],
        _rankIndex:0,
    },
    onLoad: function () {

    },
    setRankIndex(typeIndex)
    {
        this._rankIndex = typeIndex;
    },

    updateItem: function(itemId) {
        this.itemID = itemId;
        let rankList = cc.wwx.SystemInfo.rank[this._rankIndex]["rankDatas"];
        cc.wwx.OutPut.log('Rank Item ' + itemId);

        if(itemId <= 3)
        {
            this.rankIcon.active = true;
            this.rankNum.active = false;
            this.rankIcon.getComponent("cc.Sprite").spriteFrame = this["rankSpriteFrame" + itemId];

        }
        else
        {
            this.rankIcon.active = false;
            this.rankNum.active = true;
        }

        this.rankNum.getComponent("cc.Label").string = itemId;

        if(rankList[itemId - 1])
        {
            this.rankNode.active = true;
            this.noRankTip.active = false;
            this.rankName.string = rankList[itemId -1 ]["detail"]["name"];
            this.rankSocre.string = rankList[itemId -1 ]["detail"]["rankValue"];
            cc.wwx.Loader.loadImg(rankList[itemId -1 ]["detail"]["headUrl"], this.headNode);


        }
        else
        {
            this.rankNode.active = false;
            this.noRankTip.active = true;
        }
    }
});