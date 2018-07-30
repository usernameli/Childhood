cc.Class({
    extends: cc.Component,

    properties: {
        demolitionBomb:{
            default:null,
            type:cc.Node
        },
        _tag:"gameScene"
    },
    onLoad()
    {
        if(!cc.wwx)
        {
            initMgr();
        }
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB_END,this.demolitionBombEnd,this);

    },
    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,"onDestroy");
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB_END,this.demolitionBombEnd,this);

    },
    demolitionBombEnd()
    {
        this.demolitionBomb.active = false;

    },
    item1Click()
    {
        //爆炸销毁一部分砖块
        this.demolitionBomb.active = true;
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB);

    },
    item2Click()
    {
        //
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB);

    },
    item3Click()
    {
        //
    },
    item4Click()
    {
        //
    }


});