cc.Class({
    extends: cc.Component,

    properties: {

        ballPrefab:{
            default:null,
            type:cc.Prefab
        },
        _ballNum:0,
        _ballList:[],
        // defaults, set visually when attaching this script to the Canvas
    },

    // use this for initialization
    onLoad: function () {
        this._ballNum = 2;
        this._ballList = [];
        this.ctx = this.getComponent(cc.Graphics);
        SML.Output.log('onLoad:', 'width', this.node.width);
        SML.Output.log('onLoad:', 'height', this.node.height);
        this.center = cc.v2(this.node.width / 2, 20);

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelCallBack, this);

        this._createBall();
    },
    _createBall:function()
    {
        for(let i = 0; i < this._ballNum;i++)
        {
            let ballPrefab = cc.instantiate(this.ballPrefab);
            this.node.addChild(ballPrefab);
            let component = ballPrefab.getComponent('Ball');
            component._index = i + 1;
            ballPrefab.setPosition(cc.p(this.node.width / 2 , 20));

            this._ballList.push(ballPrefab);
        }
    },
    touchCancelCallBack:function()
    {
        this.ctx.clear();
    },
    touchEndCallBack:function(event)
    {
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        SML.Output.log('touchEndCallBack:', 'dottedline', JSON.stringify(touchPos));
        let touchPoint = cc.v2(touchPos);
        let linearVelocity = touchPoint.sub(this.center);
        linearVelocity.normalizeSelf();
        SML.Notify.trigger(SML.Event.ACTION_BALL_START_LINEARVELOCITY,{linearVelocity:linearVelocity});

        this.ctx.clear();

    },
    touchMoveCallBack:function(event)
    {
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        SML.Output.log('touchMoveCallBack:', 'dottedline', JSON.stringify(touchPos));
        this.drawDottleLine(touchPos);
    },
    touchStartCallBack:function(event)
    {
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        SML.Output.log('touchStartCallBack:', 'dottedline', JSON.stringify(touchPos));
        this.drawDottleLine(touchPos);
    },

    drawDottleLine: function (point) {

        let touchPoint = cc.v2(point);
        let DottedLineV2 = touchPoint.subSelf(this.center);
        var p1 = this.center;
        var p2 = DottedLineV2.mulSelf(100).addSelf( this.center );

        this.ctx.clear();

        this.rayCast(p1, p2);
    },

    rayCast: function (p1, p2) {
        var manager = cc.director.getPhysicsManager();
        var result = manager.rayCast(p1, p2)[0];
        if (result) {
            p2 = result.point;
            this.ctx.circle(p2.x, p2.y, 10);
            this.ctx.fillColor = cc.Color.RED;
            this.ctx.fill();
        }
        else
        {
            return;
        }
        console.log("=== p1: " +JSON.stringify(p1));
        console.log("=== p2: " +JSON.stringify(p2));

        this.drawLine(p1,p2,true);


        let normal = result.normal;
        if(normal.y === 0)
        {
            let newP = cc.v2(p1.x,2 * p2.y);
            console.log("newP: " +JSON.stringify(newP));
            p1 = p2;
            p2 = newP;
        }
        else
        {
            let newP = cc.v2(p1.x + 2 * (p2.x - p1.x),p1.y);
            console.log("newP: " +JSON.stringify(newP));
            p1 = p2;
            p2 = newP;
        }


        // p2 = result.normal.mul(300).add(p1);
        console.log("result.normal" +JSON.stringify(result.normal));
        console.log("result.normal" +JSON.stringify(p2));
        this.drawLine(p1,p2,false);



    },
    drawLine:function(start,end,fg)
    {
        //获得组件
        // this.ctx=this.node.getComponent(cc.Graphics)
        //获得从start到end的向量
        var line=end.sub(start)
        //获得这个向量的长度
        var lineLength=line.mag()

        if(fg === false)
        {
            lineLength= 100
        }
        //设置虚线中每条线段的长度
        var length=5
        //根据每条线段的长度获得一个增量向量
        var increment=line.normalize().mul(length)
        //确定现在是画线还是留空的bool
        var drawingLine=true
        //临时变量
        var pos=start.clone();
        //只要线段长度还大于每条线段的长度
        for(;lineLength>length;lineLength-=length)
        {
            //画线
            if(drawingLine)
            {
                // com.moveTo(pos.x,pos.y)
                // pos.addSelf(increment)
                // com.lineTo(pos.x,pos.y)
                // com.stroke()
                this.ctx.circle(pos.x, pos.y, 3);
                this.ctx.fillColor = cc.Color.GRAY;
                this.ctx.fill();
                pos.addSelf(increment)
            }
            //留空
            else
            {
                pos.addSelf(increment)
            }
            //取反
            drawingLine=!drawingLine
        }
        //最后一段
        if(drawingLine)
        {

            this.ctx.circle(pos.x, pos.y, 3);
            this.ctx.fillColor = cc.Color.GRAY;
            this.ctx.fill();
        }

    },
    // called every frame
    update: function (dt) {

    },
});
