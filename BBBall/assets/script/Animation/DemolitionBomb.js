cc.Class({
    extends:cc.Component,
    properties:{
        _anim:null,
        _tag:"DemolitionBomb"
    },
    onLoad()
    {
        this._anim = this.getComponent(cc.Animation);
        // this._anim.play();
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB,this.demolitionBomb,this);
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB,this.demolitionBomb,this);

    },
    demolitionEndCallBack()
    {
        cc.wwx.OutPut.log(this._tag,"demolitionEndCallBack ");
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB_END);
    },
    demolitionBomb()
    {
        this._anim.play();
    },
    start()
    {

    }
})