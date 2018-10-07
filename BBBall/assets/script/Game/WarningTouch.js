cc.Class({
    extends:cc.Component,
    properties:{
        _contactNum:0,
    },
    onLoad()
    {
        this._contactNum = 0;
    },
    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {

        cc.wwx.OutPut.log("onBeginContact:this._contactNum  ",this._contactNum);
        cc.wwx.OutPut.log("onBeginContact:tag  ",otherCollider.tag);

        if(otherCollider.tag === 100 || otherCollider.tag === 103 ||
            otherCollider.tag === 104 || otherCollider.tag === 105 ||otherCollider.tag === 106)
        {
            this._contactNum += 1;
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_WARNING_NEED);
            cc.wwx.OutPut.log("onBeginContact:this._contactNum  ",this._contactNum);

        }
    },
    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

        if(otherCollider.tag === 100 || otherCollider.tag === 103 ||
            otherCollider.tag === 104 || otherCollider.tag === 105 ||otherCollider.tag === 106)
        {
            this._contactNum -= 1;

            if(this._contactNum === 0)
            {
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_WARNING_NO_NEED);

            }
            cc.wwx.OutPut.log("onEndContact:this._contactNum  ",this._contactNum);

        }
    },


});