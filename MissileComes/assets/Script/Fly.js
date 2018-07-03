cc.Class({
    extends: cc.Component,
    properties: {
        leftBtn:{
            default:null,
            type:cc.Node
        },
        rightBtn:{
            default:null,
            type:cc.Node
        },
        vpNode:{
            default:null,
            type:cc.Node
        }
    },
    onLoad () {
        this.noUp = false;
        cc.director.GlobalEvent.on("set_pos_fly", this.setPosFly, this);

        this.leftBtn.on(cc.Node.EventType.TOUCH_START, this._touchStartEventLeft, this);

        this.leftBtn.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEventLeft, this);

        // 触摸在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        this.leftBtn.on(cc.Node.EventType.TOUCH_END, this._touchEndEventLeft, this);
        this.leftBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEventLeft, this);


        this.rightBtn.on(cc.Node.EventType.TOUCH_START, this._touchStartEventRight, this);

        this.rightBtn.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEventRight, this);

        // 触摸在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        this.rightBtn.on(cc.Node.EventType.TOUCH_END, this._touchEndEventRight, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEventRight, this);

    },
    _touchStartEventLeft:function () {
        // console.log("_touchStartEvent");
        this.body.angularVelocity = 50;
    },
    _touchMoveEventLeft:function () {
        // console.log("_touchMoveEvent");
    },
    _touchEndEventLeft:function () {
        // console.log("_touchEndEvent");
        this.body.angularVelocity = 0;
    },

    _touchStartEventRight:function () {
        // console.log("_touchStartEvent");
        this.body.angularVelocity = -50;
    },
    _touchMoveEventRight:function () {
        // console.log("_touchMoveEvent");
    },
    _touchEndEventRight:function () {
        // console.log("_touchEndEvent");
        this.body.angularVelocity = 0;
    },

    setPosFly(argument) {
        console.log("argument: " + JSON.stringify(argument));
    },
    start () {
        this.body = this.getComponent(cc.RigidBody);

    },
    update (dt) {


        let flyPos = this.body.getWorldPosition();
        console.log("node x: " +flyPos.x);
        console.log("node y: " +flyPos.y);

        let ratation = this.body.getWorldRotation;

        let newPos = this.vpNode.convertToWorldSpaceAR(this.vpNode.getPosition());
        var nowPos = this.body.getWorldPosition();
        // console.log("pos: " + JSON.stringify(nowPos));
        // console.log("pos: " + JSON.stringify(newPos));
        let v2Vector = cc.v2(newPos.x - nowPos.x, newPos.y - nowPos.y);
        // console.log("v2Vector: " + JSON.stringify(v2Vector));
        v2Vector.normalizeSelf();
        v2Vector.mulSelf(200);
        var x = Math.cos(ratation * (Math.PI/180));
        var y = Math.sin(ratation * (Math.PI/180));
        // console.log("x: " +x);
        // console.log("y: " +y);
        //

        // console.log("ratation: " +ratation);
        // console.log("this.body.angularVelocity: " +this.body.angularVelocity);
        // //
        this.body.linearVelocity = v2Vector;
        // let v2Pos = cc.v2(x,y);
        // let velocity =  v2Pos.normalize().mulSelf(100);
        // this.body.applyForceToCenter(v2Vector,false);
        // this.body.applyLinearImpulse(v2Vector, nowPos);
    }
});