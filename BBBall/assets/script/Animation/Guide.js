cc.Class({
    extends:cc.Component,
    properties:{
        _anim:null,
        _tag:"Guide"
    },
    onLoad()
    {
        this._anim = this.getComponent(cc.Animation);
        // this._anim.play();
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_GUIDE_ANIMATION,this.guideAnimation,this);
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_GUIDE_ANIMATION,this.guideAnimation,this);

    },
    guideCallBack()
    {
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_GUIDE_ANIMATION_END);
    },
    guideAnimation()
    {
        this._anim.play();
    },
    start()
    {

    }
})