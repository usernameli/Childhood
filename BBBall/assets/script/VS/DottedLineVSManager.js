cc.Class({
    extends:cc.Component,
    properties:{
        ballPrefab:{
            default:[],
            type:cc.Prefab
        },
        roundTins:{
            default:null,
            type:cc.Prefab,
        },
        ballNumText:{
            default:null,
            type:cc.Node
        },
        _pk_update_coordinate:false,
        _touchPos:cc.v2(0,0),
    },
    onLoad()
    {
        // this.ballMaxNum = cc.wwx.UserInfo.ballInfo.ballNum;
        this.ballMaxNum = 1;
        this._pk_update_coordinate = false;
        this._ctx = this.getComponent(cc.Graphics);

        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndCallBack, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCancelCallBack, this);

        this._userBallId = cc.wwx.UserInfo.findBagUseBall();
        this._ballList= [];
        if(this._userBallId <= 1021)
        {
            this._usePrefabBall = this.ballPrefab[0];
            cc.wwx.UserInfo.ballInfo.ballPosY = 10

        }
        else
        {
            this._usePrefabBall = this.ballPrefab[1];
            cc.wwx.UserInfo.ballInfo.ballPosY = 16

        }
        this.center = cc.v2(this.node.width/ 2, cc.wwx.UserInfo.ballInfo.ballPosY);

        this._createBall(this.ballMaxNum,0);





        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_ADD_BALLS,this.plusBallsCallBack,this);

    },

    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_ADD_BALLS,this.plusBallsCallBack,this);

    },
    plusBallsCallBack(argument)
    {
        cc.wwx.OutPut.log(this._tag, 'plusBallsCallBack argument: ', JSON.stringify(argument));

        let plusNum = argument["plusNum"];
        let oldMaxNum = this.ballMaxNum;
        this.ballMaxNum += plusNum;
        this._createBall(plusNum,oldMaxNum);

        cc.wwx.TCPMSG.updateCoordinate(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.center,cc.v2(0,0));

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
        this.ballNumText.postion = cc.v2(this.center.x ,this.center.y + 20);
        cc.wwx.OutPut.log("setBallNumTextPosition: ",JSON.stringify(this.ballNumText.postion));

        this.ballNumText.active = true;
        var ballNumlabel = this.ballNumText.getComponent("cc.Label");
        ballNumlabel.string =  "x" + ballNum;

    },

    _touchCancelCallBack:function()
    {
        if(cc.wwx.VS.RoundUserID !== cc.wwx.UserInfo.userId)
        {
            return;
        }
        this._ctx.clear();
        this._pk_update_coordinate = false;
        cc.wwx.Timer.cancelTimer(this,this._updateCoordinate);
        cc.wwx.TCPMSG.updateCoordinate(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.center,cc.v2(0,0));

    },
    _touchEndCallBack:function(event)
    {

        if(cc.wwx.VS.RoundUserID !== cc.wwx.UserInfo.userId)
        {
            return;
        }
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        touchPos = cc.v2(parseInt(touchPos.x), parseInt(touchPos.y));
        let touchPoint = cc.v2(touchPos);
        this._touchPos = touchPos;
        cc.wwx.TCPMSG.updateCoordinate(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.center,cc.v2(0,0));

        let linearVelocity = touchPoint.sub(this.center);
        linearVelocity.normalizeSelf();
        // linearVelocity = cc.v2(linearVelocity.x.toFixed(1),linearVelocity.y.toFixed(1));


        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_START_LINEARVELOCITY,{linearVelocity:linearVelocity,ballUserId:cc.wwx.UserInfo.userId});

        this._ctx.clear();
        this._pk_update_coordinate = false;
        cc.wwx.Timer.cancelTimer(this,this._updateCoordinate);


    },
    _touchMoveCallBack:function(event)
    {
        if(cc.wwx.VS.RoundUserID !== cc.wwx.UserInfo.userId)
        {
            return;
        }
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        touchPos = cc.v2(parseInt(touchPos.x), parseInt(touchPos.y));

        this._drawDottleLine(touchPos);
        this._touchPos = touchPos;

        if(this._pk_update_coordinate === false)
        {
            this._pk_update_coordinate = true;
            cc.wwx.TCPMSG.updateCoordinate(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.center,this._touchPos);

            cc.wwx.Timer.setTimer(this,this._updateCoordinate,0.3,cc.macro.REPEAT_FOREVER,0);

        }

    },
    _updateCoordinate()
    {
        cc.wwx.TCPMSG.updateCoordinate(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.center,this._touchPos);

    },
    _touchStartCallBack:function(event)
    {

        if(cc.wwx.VS.RoundUserID !== cc.wwx.UserInfo.userId)
        {
            let roundTips = cc.instantiate(this.roundTins);
            roundTips.parent = cc.director.getScene();
            let roundTipsComponent = roundTips.getComponent("RoundTints");
            roundTipsComponent.setShowNode(false);
            return;
        }
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        touchPos = cc.v2(parseInt(touchPos.x), parseInt(touchPos.y));

        this._touchPos = touchPos;

        cc.wwx.OutPut.log("_touchStartCallBack: ",JSON.stringify(touchPos));
        this._drawDottleLine(touchPos);
        this._pk_update_coordinate = false;
        cc.wwx.Timer.cancelTimer(this,this._updateCoordinate);
        cc.wwx.TCPMSG.updateCoordinate(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.center,touchPos);


    },

    _drawDottleLine: function (touchP) {
        this._ctx.clear();
        let touchPoint = cc.v2(touchP);

        touchPoint.subSelf(this.center);

        cc.wwx.OutPut.log("_drawDottleLine center: ",JSON.stringify(this.center));
        cc.wwx.OutPut.log("_drawDottleLine touchP: ",JSON.stringify(touchP));
        let p1 = this.center;
        touchPoint.mulSelf(100);

        cc.wwx.Util.rayCast2(this._ctx,this.node, p1, touchPoint);
    },



});