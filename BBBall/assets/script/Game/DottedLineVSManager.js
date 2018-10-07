cc.Class({
    extends:cc.Component,
    properties:{
        ballPrefab:{
            default:[],
            type:cc.Prefab
        },
        ballNumText:{
            default:null,
            type:cc.Node
        },
        ballNumTextOther:{
            default:null,
            type:cc.Node
        },
        _pk_update_coordinate:false,
        _touchPos:cc.v2(0,0),
    },
    onLoad()
    {
        this.center = cc.v2(this.node.width/ 2, 102);
        this.ballMaxNum = cc.wwx.UserInfo.ballInfo.ballNum;
        this._pk_update_coordinate = false;
        this._ctx = this.getComponent(cc.Graphics);

        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCancelCallBack, this);


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

        this._addBound(node, width/2, height, width, 2,1);//上面
        this._addBound(node, width/2, 102, width, 2,2);//下面
        this._addBound(node, 0, height/2 , 4, height,3);//左面
        this._addBound(node, width, height/2, 4, height,4);//右面

        node.parent = this.node;
        this._userBallId = cc.wwx.UserInfo.findBagUseBall();
        this._ballList= [];
        if(this._userBallId <= 1021)
        {
            this._usePrefabBall = this.ballPrefab[0];
            cc.wwx.UserInfo.ballInfo.ballPosY = 102 + 10

        }
        else
        {
            this._usePrefabBall = this.ballPrefab[1];
            cc.wwx.UserInfo.ballInfo.ballPosY = 102 + 16

        }
        this.center = cc.v2(this.node.width/ 2, cc.wwx.UserInfo.ballInfo.ballPosY);

        this._createBall(this.ballMaxNum,0);


        this.ballOtherMaxNum  = cc.wwx.UserInfo.otherBallInfo.ballNum;
        this._userOtherBallId =  cc.wwx.UserInfo.otherBallInfo.ballId;
        if(this._userOtherBallId <= 1021)
        {
            this._useOtherPrefabBall = this.ballPrefab[0];
            cc.wwx.UserInfo.otherBallInfo.ballPosY = this.node.height - 10

        }
        else
        {
            this._useOtherPrefabBall = this.ballPrefab[1];
            cc.wwx.UserInfo.otherBallInfo.ballPosY = this.node.height - 16

        }
        this.centerOther = cc.v2(this.node.width/ 2, cc.wwx.UserInfo.otherBallInfo.ballPosY);

        this._createBallOther(this.ballOtherMaxNum,0);

    },
    _createBallOther:function(ballNum,index)
    {

        for(let i = 0; i < ballNum;i++)
        {
            let ballPrefab = cc.instantiate(this._useOtherPrefabBall);
            this.node.addChild(ballPrefab);
            let component = ballPrefab.getComponent('Ball');
            component._index = index + i + 1;
            ballPrefab.setPosition(this.centerOther);
            ballPrefab.getComponent('Ball').dottedLineManager = this;
            ballPrefab.getComponent('Ball').setBallID(this._userBallId);
            ballPrefab.getComponent('Ball').setBelongTo(cc.wwx.VS.OtherUserID);

            this._ballList.push(ballPrefab);
        }
        this.setBallNumTextPositionOther(this.ballOtherMaxNum);


    },
    setBallNumTextPositionOther(ballNum)
    {
        this.ballNumTextOther.setPosition(this.centerOther.x ,this.centerOther.y - 20);
        this.ballNumTextOther.active = true;
        var ballNumlabel = this.ballNumTextOther.getComponent("cc.Label");
        ballNumlabel.string =  "x" + ballNum;

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
            ballPrefab.getComponent('Ball').setBelongTo(cc.wwx.UserInfo.userId);

            this._ballList.push(ballPrefab);
        }
        this.setBallNumTextPosition(this.ballMaxNum);


    },
    setBallNumTextPosition(ballNum)
    {
        this.ballNumText.setPosition(this.center.x ,this.center.y + 20);
        this.ballNumText.active = true;
        var ballNumlabel = this.ballNumText.getComponent("cc.Label");
        ballNumlabel.string =  "x" + ballNum;

    },
    _addBound (node, x, y, width, height,tag) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.tag = tag;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    },
    _touchCancelCallBack:function()
    {
        this._ctx.clear();
        this._pk_update_coordinate = false;
        cc.wwx.Timer.cancelTimer(this,this._updateCoordinate);

    },
    _touchEndCallBack:function(event)
    {

        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        let touchPoint = cc.v2(touchPos);
        this._touchPos = touchPos;

        let linearVelocity = touchPoint.sub(this.center);
        linearVelocity.normalizeSelf();
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_START_LINEARVELOCITY,{linearVelocity:linearVelocity});

        this._ctx.clear();
        this._pk_update_coordinate = false;
        cc.wwx.Timer.cancelTimer(this,this._updateCoordinate);


    },
    _touchMoveCallBack:function(event)
    {
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        this._drawDottleLine(touchPos);
        this._touchPos = touchPos;
        if(this._pk_update_coordinate === false)
        {
            this._pk_update_coordinate = true;
            cc.wwx.Timer.setTimer(this,this._updateCoordinate,1,cc.macro.REPEAT_FOREVER,0);

        }

    },
    _updateCoordinate()
    {
        cc.wwx.TCPMSG._updateCoordinate(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.center,this._touchPos);

    },
    _touchStartCallBack:function(event)
    {
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        cc.wwx.OutPut.log("_touchStartCallBack: ",JSON.stringify(touchPos));
        this._drawDottleLine(touchPos);
        this._pk_update_coordinate = false;
        cc.wwx.Timer.cancelTimer(this,this._updateCoordinate);

    },

    _drawDottleLine: function (touchP) {
        this._ctx.clear();
        let touchPoint = cc.v2(touchP);

        touchPoint.subSelf(this.center);
        let p1 = this.center;
        touchPoint.mulSelf(100);

        cc.wwx.Util.rayCast(this._ctx,this.node, p1, touchPoint);
    },



})