cc.Class({
    extends: cc.Component,

    properties: {

        ballPrefab:{
            default:null,
            type:cc.Prefab
        },
        ballNumText:{
            default:null,
            type:cc.Node
        },
        itemAddBallsParticlePrefab:{
            default:null,
            type:cc.Prefab
        },
        _tag:"DattleLineManager",
        _ctx:null,//Graphics
        isBallSporting:false, //球开始射出
        isFirstBallCome:false,//第一个球回到地面
        ballMaxNum:0, //球的数量
        center:cc.v2(0,0),//球的发球位置
        _ballList:[], //球保存的数组里面
        _colliderMaxPoint:0,
        _colliderPoint:0,
        ballOnWallNum:0, //回到地面的球的数量
    },

    // use this for initialization
    onLoad: function () {
        this.remainLength = 1000;
        this.ballMaxNum = cc.wwx.UserInfo.ballInfo.ballNum;
        this._colliderMaxPoint = 4;
        this._colliderPoint = 0;
        this._ballList = [];
        this.isBallSporting = false;
        this.isFirstBallCome = false;
        this._ctx = this.getComponent(cc.Graphics);

        cc.wwx.OutPut.log('onLoad:', 'width', this.node.width);
        cc.wwx.OutPut.log('onLoad:', 'height', this.node.height);
        this.center = cc.v2(this.node.width/ 2, 118);

        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCancelCallBack, this);

        this._createBall(this.ballMaxNum,0);


        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_ADD_BALLS,this.plusBallsCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_ITEM_ADD_BALL,this.itemAddBallsCallBack,this);

    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_ADD_BALLS,this.plusBallsCallBack,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_ITEM_ADD_BALL,this.itemAddBallsCallBack,this);
    },
    itemAddBallsCallBack()
    {
        let particle = cc.instantiate(this.itemAddBallsParticlePrefab);
        this.node.addChild(particle);
        particle.setPosition(this.center);

        let oldMaxNum = this.ballMaxNum;
        this.ballMaxNum += 5;
        this._createBall(5,oldMaxNum);
    },
    setBallNumTextPosition(ballNum)
    {
        this.ballNumText.setPosition(cc.p(this.center.x ,this.center.y + 20));
        this.ballNumText.active = true;
        var ballNumlabel = this.ballNumText.getComponent("cc.Label");
        ballNumlabel.string =  "x" + ballNum;

    },
    plusBallsCallBack(argument)
    {
        cc.wwx.OutPut.log(this._tag, 'plusBallsCallBack argument: ', JSON.stringify(argument));
        let plusNum = argument["plusNum"];
        let oldMaxNum = this.ballMaxNum;
        this.ballMaxNum += plusNum;
        this._createBall(plusNum,oldMaxNum);


    },
    _createBall:function(ballNum,index)
    {
        for(let i = 0; i < ballNum;i++)
        {
            let ballPrefab = cc.instantiate(this.ballPrefab);
            this.node.addChild(ballPrefab);
            let component = ballPrefab.getComponent('Ball');
            component._index = index + i + 1;
            ballPrefab.setPosition(this.center);
            ballPrefab.getComponent('Ball').dottedLineManager = this;
            this._ballList.push(ballPrefab);
        }
        this.setBallNumTextPosition(this.ballMaxNum);


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
        this._drawDottleLine(touchPos);
    },
    _touchStartCallBack:function(event)
    {
        if(this.isBallSporting)
        {
            return;
        }
        this._colliderPoint = 0;
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        cc.wwx.OutPut.log('touchStartCallBack:', 'dottedline', JSON.stringify(touchPos));
        this._drawDottleLine(touchPos);
    },

    _drawDottleLine: function (point) {

        let touchPoint = cc.v2(point);

        if(touchPoint.y <= this.center.y)
        {
            return;
        }
        touchPoint.subSelf(this.center);

        var p1 = this.center;
        var p2 = touchPoint.mulSelf(100).addSelf(this.center);


        this._ctx.clear();

        this._rayCast(p1, p2,true);
    },

    _rayCast: function (p1, p2,startF) {
        let manager = cc.director.getPhysicsManager();
        // let results = manager.rayCast(p1, p2);
        let result = null;
        let results = manager.rayCast(p1, p2,cc.RayCastType.All);

        for (let i = 0; i < results.length; i++) {
            var collider = results[i].collider;
            if(collider.tag > 0)
            {
                result = results[i];
                break;
            }

        }

        if (result) {
            p2 = result.point;
            this._ctx.circle(p2.x, p2.y, 10);
            this._ctx.fillColor = cc.Color.RED;
            this._ctx.fill();
            if(startF)
            {
                this._colliderPoint = 0;
                this._colliderPoint += 1;
            }
            else
            {
                this._colliderPoint += 1;
            }
        }

        if(this._colliderPoint >= this._colliderMaxPoint)
        {
            this.drawLine(p1,p2,false);

            return;
        }
        else
        {
            this.drawLine(p1,p2);
        }
        if (!result) return;

        let normal = result.normal;
        if(normal.y === 0 || normal.x === 0)
        {
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

            // this.drawLine(p1,p2,false);
            this._rayCast(p1,p2);
        }
        else
        {
            let orRayCast = p2.sub(this.center);
            orRayCast.normalizeSelf();
            normal.normalizeSelf();
            p1 = p2;
            p2 = orRayCast.sub( normal.mulSelf(2 * orRayCast.dot(normal)));
            p2.mulSelf(1000);
            // this.drawLine(p1,p2,false);
            this._rayCast(p1,p2);
        }



        // this.remainLength = this.remainLength - p2.sub(p1).mag();
        // if (this.remainLength < 1) return;

        // this._rayCast(p1,p2);

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
            lineLength= 300
        }

        //设置虚线中每条线段的长度
        var length=10
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
                this._ctx.fillColor = cc.Color.YELLOW;
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
    //回收球球call back
    recoveryBallCallBack()
    {
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_RECOVERY_BALL)
    },
    // called every frame
    update: function (dt) {

    },
});
