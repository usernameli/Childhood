cc.Class({
    extends: cc.Component,

    properties: {
        ballPrefab:{
            default:[],
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
        _usePrefabBall:null,
        _tag:"DattleLineManager",
        _ctx:null,//Graphics
        isBallSporting:false, //球开始射出
        isFirstBallCome:false,//第一个球回到地面
        ballMaxNum:0, //球的数量
        center:cc.v2(0,0),//球的发球位置
        _ballList:[], //球保存的数组里面
        _colliderMaxPoint:0,
        _colliderPoint:0,
        _userBallId:0,
        _isUseBallChange:false,
        ballOnWallNum:0, //回到地面的球的数量
    },

    // use this for initialization
    onLoad: function () {

        this._ctx = this.getComponent(cc.Graphics);

        this.gameInit();
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCancelCallBack, this);

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_ADD_BALLS,this.plusBallsCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_ITEM_ADD_BALL,this.itemAddBallsCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this.gameRestart,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_USE_BALL_ITEM,this.useBallItem,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_BAG,this.gameBagData,this);

        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        // physicsManager.debugDrawFlags =
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit
        // ;
        let width   =  this.node.width;
        let height  =  this.node.height;
        let node = new cc.Node();
        node.group = "wall";
        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        this._addBound(node, width/2, height, width, 10,1);//上面
        this._addBound(node, width/2, 108, width, 10,2);//下面
        this._addBound(node, 0, height / 2, 10, height,3);//左面
        this._addBound(node, width, height / 2, 10, height,4);//右面

        node.parent = this.node;
        this._createBall(this.ballMaxNum,0);

    },
    gameRestart()
    {
        for(var i = 0; i < this._ballList.length;i++)
        {
            this._ballList[i].destroy();
        }
        this._ballList = [];
        this.gameInit();
        this._createBall(this.ballMaxNum,0);

    },
    gameBagData()
    {
        if(this._isUseBallChange)
        {
            for(var i = 0; i < this._ballList.length;i++)
            {
                this._ballList[i].destroy();
            }
            this._ballList = [];
            this._userBallId = cc.wwx.UserInfo.findBagUseBall();
            if(this._userBallId <= 1021)
            {
                this._usePrefabBall = this.ballPrefab[0];
                cc.wwx.UserInfo.ballInfo.ballPosY = 15 + 108

            }
            else
            {
                this._usePrefabBall = this.ballPrefab[1];
                cc.wwx.UserInfo.ballInfo.ballPosY = 25 + 108

            }
            this.center = cc.v2(this.node.width/ 2, cc.wwx.UserInfo.ballInfo.ballPosY);

            this._createBall(this.ballMaxNum,0);
        }
    },
    useBallItem()
    {
        this._isUseBallChange = true;


    },
    gameInit()
    {
        this.ballMaxNum = cc.wwx.UserInfo.ballInfo.ballNum;

        this._ballList = [];
        this.isBallSporting = false;
        this.isFirstBallCome = false;
        this._isUseBallChange = false;
        cc.wwx.OutPut.log('onLoad:', 'width', this.node.width);
        cc.wwx.OutPut.log('onLoad:', 'height', this.node.height);
        this._userBallId = cc.wwx.UserInfo.findBagUseBall();
        if(this._userBallId <= 1021)
        {
            this._usePrefabBall = this.ballPrefab[0];
            cc.wwx.UserInfo.ballInfo.ballPosY = 15 + 108

        }
        else
        {
            this._usePrefabBall = this.ballPrefab[1];
            cc.wwx.UserInfo.ballInfo.ballPosY = 25 + 108

        }


        this.center = cc.v2(this.node.width/ 2, cc.wwx.UserInfo.ballInfo.ballPosY);

    },
    _addBound (node, x, y, width, height,tag) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.tag = tag;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_BAG,this.gameBagData,this);

        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_USE_BALL_ITEM,this.useBallItem,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this.gameRestart,this);
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
        this.ballNumText.setPosition(this.center.x ,this.center.y + 20);
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
            let ballPrefab = cc.instantiate(this._usePrefabBall);
            this.node.addChild(ballPrefab);
            let component = ballPrefab.getComponent('Ball');
            component._index = index + i + 1;
            ballPrefab.setPosition(this.center);
            ballPrefab.getComponent('Ball').dottedLineManager = this;
            ballPrefab.getComponent('Ball').setBallID(this._userBallId);

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
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        cc.wwx.OutPut.log("_touchStartCallBack: ",JSON.stringify(touchPos));
        this._drawDottleLine(touchPos);
    },

    _drawDottleLine: function (touchP) {


        let touchPoint = cc.v2(touchP);
        cc.wwx.OutPut.log("_drawDottleLine touchPoint : ",JSON.stringify(touchPoint));
        cc.wwx.OutPut.log("_drawDottleLine this.center : ",JSON.stringify(this.center));

        if(touchPoint.y <= this.center.y + 10)
        {
            return;
        }
        touchPoint.subSelf(this.center);

        let p1 = this.center;
        touchPoint.mulSelf(100);


        this._ctx.clear();

        this._rayCast(p1, touchPoint);
    },
    _filterCollider(tag)
    {
        let flg = true;
        let filterTag = [2];
        if(filterTag.contains(tag))
        {
            flg = false;
        }
        return flg;
    },
    _rayCast: function (p1, p2) {

        let manager = cc.director.getPhysicsManager();
        let results = manager.rayCast(p1, p2,cc.RayCastType.All);
        let result = null;
        for (let i = 0; i < results.length; i++) {
            var collider = results[i].collider;
            cc.wwx.OutPut.log("p2: ",collider.tag);
            cc.wwx.OutPut.log("p2: ",collider.tag);

            if(collider.tag > 0 && collider.tag !== 2)
            {
                result = results[i];
                break;
            }

        }

        if (result) {
            p2 = result.point;
            // let p2x = p2.x;
            if(p2.y > 923)
            {
                // p2 = this.node.convertToNodeSpaceAR(p2);
                // p2.y -= 108;
                this._ctx.circle(p2.x, p2.y, 10);

            }
            else
            {
                this._ctx.circle(p2.x, p2.y, 10);
            }
            this._ctx.fillColor = cc.Color.RED;
            this._ctx.fill();
        }
        else
        {
            return;
        }

        cc.wwx.OutPut.log("p2: ",p2);

        this.drawLine(p1,p2,true);


        let normal = result.normal;
        if(normal.y === 0)
        {
            let newP = cc.v2(p1.x,2 * p2.y - p1.y);

            if(p1.y > p2.y)
            {
                newP = cc.v2(p1.x,p1.y - p2.y * 2);
            }
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
        cc.wwx.OutPut.log(this._tag,"drawLine");
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
        cc.wwx.AudioManager.playAudioButton();

        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_RECOVERY_BALL);
        // this.isBallSporting = false;
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,{center:this.center});
    },
    // called every frame
    update: function (dt) {

    },
});
