cc.Class({
    extends:cc.Component,
    properties:{
        _tag:"ShopBallItem"
    },
    onLoad()
    {

    },

    updateItem(itemID)
    {
        cc.wwx.OutPut.log(this._tag,"updateItem itemID",itemID);
    },
    update()
    {

    }
})