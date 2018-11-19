cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad()
    {
        this._ctx = this.getComponent(cc.Graphics);
        this.center = cc.v2(this.node.width/ 2, 10);
        this._drawDottleLine(cc.v2(720,462));

        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCancelCallBack, this);


        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_LINE_TEST,this.testCallBack,this);
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_LINE_TEST,this.testCallBack,this);

    },
    testCallBack(argument)
    {
        cc.wwx.OutPut.log("testCallBack argument: ",JSON.stringify(argument));
        this._drawDottleLine(cc.v2(argument["touchPos"].x,argument["touchPos"].y));

    },
    _touchStartCallBack:function(event)
    {

        var touchPos = event.touch.getLocation();
        touchPos = cc.v2(parseInt(touchPos.x), parseInt(touchPos.y));
        this._touchPos = touchPos;

        this._drawDottleLine(touchPos);


    },

    _drawDottleLine: function (touchP) {
        this._ctx.clear();
        let touchPoint = cc.v2(touchP);

        touchPoint.subSelf(this.center);

        let p1 = this.center;
        touchPoint.mulSelf(100);

        cc.wwx.Util.rayCast2(this._ctx,this.node, p1, touchPoint);
    },
    _touchCancelCallBack:function()
    {

        this._ctx.clear();

    },
    _touchEndCallBack:function(event)
    {

        var touchPos = event.touch.getLocation();
        touchPos = cc.v2(parseInt(touchPos.x), parseInt(touchPos.y));


        let touchPoint = cc.v2(touchPos);

        this._touchPos = touchPos;

        let linearVelocity = touchPoint.sub(this.center);
        linearVelocity.normalizeSelf();


        this._ctx.clear();


    },
    _touchMoveCallBack:function(event)
    {

        var touchPos = event.touch.getLocation();
        touchPos = cc.v2(parseInt(touchPos.x), parseInt(touchPos.y));
        this._drawDottleLine(touchPos);
        this._touchPos = touchPos;

        cc.wwx.OutPut.log("testCallBack touchPos: ",JSON.stringify(touchPos));


    },
});