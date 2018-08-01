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
        checkPointNum:{
            default:null,
            type:cc.Label,
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
        _checkPointItem:0,
    },
    onLoad()
    {
        this.bgUnLock.active = false;
    },
    clickItemCallBack()
    {
        console.log('clickItemCallBack ' + this._checkPointItem + ' clicked');
        cc.wwx.MapCheckPoint.getMapCheckPointData(117,function (checkPointData) {
            cc.wwx.OutPut.log("clickItemCallBack: " + JSON.stringify(checkPointData));
            cc.wwx.UserInfo.checkPointData = checkPointData;
            cc.director.loadScene("GameScene");

        });
    },
    updateItem(itemID)
    {
        this.checkPointNum.string =  itemID;
        this._checkPointItem = itemID;

    },
    update()
    {

    }
})