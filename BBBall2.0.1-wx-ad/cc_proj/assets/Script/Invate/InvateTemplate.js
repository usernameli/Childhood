cc.Class({
    extends:cc.Component,
    properties:{
        invateLabel:{
            default:null,
            type:cc.Label
        },
        rewordSprite:{
            default:null,
            type:cc.Node
        },
        isRewoarded:{
            default:null,
            type:cc.Node
        },
        rewardBTN:{
            default:null,
            type:cc.Node
        },
        itemDamondIcon:{
            default:null,
            type:cc.Node
        },
        itemRewordLabel1:{
            default:null,
            type:cc.Label
        },
        rewardHeadIcon:{
            default:null,
            type:cc.Node
        },
        rewardHeadSprite:{
            default:null,
            type:cc.SpriteFrame
        }
    },
    onLoad: function () {


    },
    reloadData()
    {
        this.updateItem(this.itemID);
    },
    getRewardCallBack()
    {
        cc.wwx.TCPMSG.getReward(this.itemID - 1);

    },

    updateItem: function(itemId) {
        cc.wwx.OutPut.log('Invate Item ',itemId);
        this.itemID = itemId;
        let list = cc.wwx.Invite.mInviteList2["rewards"][itemId - 1];
        let inviteCount = cc.wwx.Invite.mInviteList2["inviteCount"];
        if(list)
        {
            this.node.active = true;
            if(inviteCount <= itemId)
            {
                this.invateLabel.string = "邀请好友("+inviteCount + "/" + itemId + ")";

            }
            else
            {
                this.invateLabel.string = "邀请好友("+itemId + "/" + itemId + ")";

            }

            this.itemRewordLabel1.string = "奖励        +" + list["count"];

            this.rewardHeadIcon.getComponent(cc.Sprite).spriteFrame = this.rewardHeadSprite;

            if(list["state"] === 0)
            {
                this.rewardBTN.active = false;
                this.rewordSprite.active = true;
                this.isRewoarded.active = false;
            }
            else if(list["state"] === 1)
            {
                this.rewardBTN.active = true;
                this.rewordSprite.active = false;
                this.isRewoarded.active = false;

            }
            else
            {
                this.rewardBTN.active = false;
                this.rewordSprite.active = false;
                this.isRewoarded.active = true;

            }
            cc.wwx.Loader.loadImg(list["inviteeHeadUrl"], this.rewardHeadIcon);


        }
        else
        {
            this.node.active = false;
        }
    },

});