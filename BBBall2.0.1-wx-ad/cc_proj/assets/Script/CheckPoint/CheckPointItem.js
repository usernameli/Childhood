cc.Class({
    extends:cc.Component,
    properties:{
        bgLock:{
            default:null,
            type:cc.Node,
        },
        bgUnLock:{
            default:null,
            type:cc.Node
        },
        checkPointNext:{
            default:null,
            type:cc.Node
        },
        checkPointNum:{
            default:null,
            type:cc.Node,
        },
        pointStar1:{
            default:null,
            type:cc.Sprite
        },
        pointStar2:{
            default:null,
            type:cc.Sprite
        },
        pointStar3:{
            default:null,
            type:cc.Sprite
        },
        starSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        starBlackSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        giftBox:{
            default:null,
            type:cc.Node
        },
        _checkPointItem:0,
        _gameData:null,
        _tag:"CheckPointItem"
    },
    onLoad()
    {
        this.bgUnLock.active = false;
        this._gameData = cc.wwx.UserInfo.gdata;
        this.checkPointNumLabel = this.checkPointNum.getComponent("cc.Label");
    },
    clickItemCallBack()
    {
        if(cc.wwx.SystemInfo.isScrollFlg)
        {
            return;
        }


        if(this._checkPointItem > this._gameData["levelHighLv"])
        {
            cc.wwx.TipManager.showMsg("关卡还未解锁.....",1);

            return;
        }
        if(this.giftBox.active && !cc.wwx.Gift.OpendLevels.contains(this._checkPointItem))
        {
            cc.wwx.UserInfo.checkPointID = this._checkPointItem;
            cc.wwx.PopWindowManager.popWindow("prefab/GameBoxWindow","GameBoxWindow",{level:true},100);

            return;
        }



        cc.wwx.OutPut.log("this._checkPointItem: ",this._checkPointItem);
        cc.wwx.UserInfo.ballInfo.ballNum = cc.wwx.MapCheckPoint.getBallInfoByMapId(this._checkPointItem);
        let self = this;
        cc.wwx.MapCheckPoint.getMapCheckPointData(this._checkPointItem,function (checkPointData) {
            cc.wwx.UserInfo.checkPointData = checkPointData;
            cc.wwx.UserInfo.checkPointID = self._checkPointItem;

            cc.wwx.SceneManager.switchScene("GameScene");

        });
    },            //

    updateItem(itemID)
    {
        cc.wwx.OutPut.log("updateItem itemID: ",itemID);
        if(itemID < 10)
        {
            this.checkPointNumLabel.string =  "0" + itemID;

        }
        else
        {
            this.checkPointNumLabel.string =  itemID;

        }

        this._checkPointItem = itemID;
        this.checkPointNum.color = new cc.Color(58,78,133,255);
        this.pointStar1.spriteFrame  =  this.starBlackSpriteFrame;
        this.pointStar2.spriteFrame  =  this.starBlackSpriteFrame;
        this.pointStar3.spriteFrame  =  this.starBlackSpriteFrame;
        this.giftBox.active = cc.wwx.Util.checkGiftShow(itemID);
        if(itemID === this._gameData["levelHighLv"])
        {

            this.bgLock.active = false;
            this.bgUnLock.active = false;
            this.checkPointNext.active = true;
            this.checkPointNum.setPosition(0,8);
        }
        else if(itemID < this._gameData["levelHighLv"])
        {

            this.giftBox.active = false;
            this.bgLock.active = false;
            this.bgUnLock.active = true;
            this.checkPointNext.active = false;
            this.checkPointNum.setPosition(0,-10);
            let starNum = this._gameData["levelHighStar"][itemID - 1];
            this.checkPointNum.color = new cc.Color(255,255,255,255);

            if(starNum === 1)
            {
                this.pointStar1.spriteFrame  =  this.starSpriteFrame;
            }
            else if(starNum === 2)
            {
                this.pointStar1.spriteFrame  =  this.starSpriteFrame;
                this.pointStar2.spriteFrame  =  this.starSpriteFrame;

            }
            else
            {
                this.pointStar1.spriteFrame  =  this.starSpriteFrame;
                this.pointStar2.spriteFrame  =  this.starSpriteFrame;
                this.pointStar3.spriteFrame  =  this.starSpriteFrame;
            }
        }
        else
        {
            this.bgLock.active = true;
            this.bgUnLock.active = false;
            this.checkPointNext.active = false;
            this.checkPointNum.setPosition(0,8);

        }
    },
    update()
    {

    }
})