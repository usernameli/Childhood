
cc.Class({
    extends: cc.Component,

    properties: {

        flyNode: {
            default:null,
            type: cc.Node,
            displayName: '需要跟踪的对象',
        },
        sketchLinePrefab:{
            default: null,
            type: cc.Prefab,
            displayName:'导弹后面的轨迹'
        },
        vpNode:{
            default:null,
            type:cc.Node
        },
        _loopMaxTime:0.01,
        _loopTime:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // joy下的Game组件
        // game组件下的player节点
        this._loopMaxTime = 0.001;
        this._loopTime = 0;
        var scheduler = cc.director.getScheduler();
        this.node.setLocalZOrder(1);
        scheduler.schedule(this.createSketchLine, this, 0.15, cc.macro.REPEAT_FOREVER);
        // this.rigidbody = this.node.getComponent(cc.RigidBody);

    },
    //每一秒产生一个轨迹
    createSketchLine(){
        var sketchLine = cc.instantiate(this.sketchLinePrefab);
        this.node.parent.addChild(sketchLine);
        sketchLine.setLocalZOrder(0);
        sketchLine.setPosition(this.node.getPosition());
        sketchLine.setRotation(this.node.rotation)
    },
    start () {
        this.body = this.getComponent(cc.RigidBody);
        this.flybody = this.flyNode.getComponent(cc.RigidBody);
    },

    update (dt) {

        let flyPos = this.flybody.getWorldPosition();
        let nodePos = this.body.getWorldPosition();
        var deltaRotation = 90 - Math.atan2((flyPos.y)- nodePos.y, flyPos.x - nodePos.x) * 180 / Math.PI;
        // console.log("flyPos" + JSON.stringify(flyPos));
        // console.log("nodePos" + JSON.stringify(nodePos));
        // console.log("deltaRotation" + deltaRotation);
        this.node.setRotation(deltaRotation);
        let flyPosV = cc.v2(flyPos.x,flyPos.y);
        let missPosV = cc.v2(nodePos.x,nodePos.y);

        let subV =  flyPosV.sub(missPosV);
        let velocity = this.body.linearVelocity;
        velocity.x += subV.x * dt * 3;
        velocity.y += subV.y * dt * 3;
        var velocityLength = velocity.mag();
        // if(velocityLength > 200)
        // {
        //     velocity = cc.pMult(velocity,0.75)
        // }
        this.body.linearVelocity = velocity;



    },
});
