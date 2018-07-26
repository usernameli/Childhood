cc.Class({
    extends: cc.Component,

    properties: {

        ballPrefab:{
            default:null,
            type:cc.Prefab
        },
        _ctx:null,//Graphics
        isBallSporting:false, //球开始射出
        isFirstBallCome:false,//第一个球回到地面
        ballMaxNum:0, //球的数量
        center:cc.v2(0,0),//球的发球位置
        _ballList:[], //球保存的数组里面
        ballOnWallNum:0, //回到地面的球的数量
    },

    // use this for initialization
    onLoad: function () {
        this.ballMaxNum = 10;
        this._ballList = [];
        this.isBallSporting = false;
        this.isFirstBallCome = false;
        this._ctx = this.getComponent(cc.Graphics);

        cc.wwx.OutPut.log('onLoad:', 'width', this.node.width);
        cc.wwx.OutPut.log('onLoad:', 'height', this.node.height);
        this.center = cc.v2(this.node.width/ 2, 117);

        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCancelCallBack, this);

        this._createBall();
    },
    _createBall:function()
    {
        for(let i = 0; i < this.ballMaxNum;i++)
        {
            let ballPrefab = cc.instantiate(this.ballPrefab);
            this.node.addChild(ballPrefab);
            let component = ballPrefab.getComponent('Ball');
            component._index = i + 1;
            ballPrefab.setPosition(cc.p(this.node.width /2 , 117));
            ballPrefab.getComponent('Ball').dottedLineManager = this;
            this._ballList.push(ballPrefab);
        }
    },
    _touchCancelCallBack:function()
    {
        this._ctx.clear();
    },
    _touchEndCallBack:function(event)
    {
        if(this.isBallSporting)
        {
            return;
        }
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        cc.wwx.OutPut.log('touchEndCallBack:', 'dottedline', JSON.stringify(touchPos));
        let touchPoint = cc.v2(touchPos);
        let linearVelocity = touchPoint.sub(this.center);
        linearVelocity.normalizeSelf();
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_START_LINEARVELOCITY,{linearVelocity:linearVelocity});

        this._ctx.clear();

    },
    _touchMoveCallBack:function(event)
    {
        if(this.isBallSporting)
        {
            return;
        }
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        cc.wwx.OutPut.log('touchMoveCallBack:', 'dottedline', JSON.stringify(touchPos));
        this._drawDottleLine(touchPos);
    },
    _touchStartCallBack:function(event)
    {
        if(this.isBallSporting)
        {
            return;
        }
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        cc.wwx.OutPut.log('touchStartCallBack:', 'dottedline', JSON.stringify(touchPos));
        this._drawDottleLine(touchPos);
    },

    _drawDottleLine: function (point) {

        let touchPoint = cc.v2(point);
        let DottedLineV2 = touchPoint.subSelf(this.center);
        var p1 = this.center;
        var p2 = touchPoint.mulSelf(100).addSelf(this.center);
        cc.wwx.OutPut.log('_drawDottleLine:', 'P1', JSON.stringify(p1));
        cc.wwx.OutPut.log('_drawDottleLine:', 'P2', JSON.stringify(p2));

        this._ctx.clear();

        this._rayCast(p1, p2);
    },

    _rayCast: function (p1, p2) {
        let manager = cc.director.getPhysicsManager();
        let results = manager.rayCast(p1, p2,cc.RayCastType.All);
        let result = null;
        for (let i = 0; i < results.length; i++) {
            var collider = results[i].collider;
            if(collider.tag > 0)
            {
                result = results[i];
                break;
            }


        }

        if (result) {
            cc.wwx.OutPut.log('_drawDottleLine:', 'result.point', JSON.stringify(result.point));
            cc.wwx.OutPut.log('_drawDottleLine:', 'result.collider', JSON.stringify(result.collider.tag));
            cc.wwx.OutPut.log('_drawDottleLine:', 'result.normal', JSON.stringify(result.collider.normal));

            p2 = result.point;
            this._ctx.circle(p2.x, p2.y, 10);
            this._ctx.fillColor = cc.Color.RED;
            this._ctx.fill();
        }
        else
        {
            return;
        }

        this.drawLine(p1,p2,true);
        let normal = result.normal;
        if(normal.y === 0)
        {
            let newP = cc.v2(p1.x,2 * p2.y);
            p1 = p2;
            p2 = newP;
        }
        else
        {
            let newP = cc.v2(p1.x + 2 * (p2.x - p1.x),p1.y);
            p1 = p2;
            p2 = newP;
        }

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
                this._ctx.circle(pos.x, pos.y, 3);
                this._ctx.fillColor = cc.Color.GRAY;
                this._ctx.fill();
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

            this._ctx.circle(pos.x, pos.y, 3);
            this._ctx.fillColor = cc.Color.GRAY;
            this._ctx.fill();
        }

    },
    // called every frame
    update: function (dt) {

    },
});
