
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
        _angleSum:false,
        _speed:200,
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
        scheduler.schedule(this.updateDegree, this, 0.01, cc.macro.REPEAT_FOREVER);
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

    updateDegree (dt) {

        let flyPos = this.flybody.getWorldPosition();
        let nodePos = this.body.getWorldPosition();
        var deltaRotation = 90 - Math.atan2((flyPos.y)- nodePos.y, flyPos.x - nodePos.x) * 180 / Math.PI;
        let flyRotation = this.flybody.getWorldRotation();
        let MissleRotation = this.body.getWorldRotation();
        console.log("flyRotation" + flyRotation);
        console.log("MissleRotation" + MissleRotation);
        console.log("deltaRotation" + deltaRotation);

        this.node.setRotation(deltaRotation);
        let flyPosV = cc.v2(flyPos.x,flyPos.y);
        let missPosV = cc.v2(nodePos.x,nodePos.y);

        let subV =  flyPosV.sub(missPosV);
        console.log("flyPos: " + JSON.stringify(flyPos));
        console.log("nodePos: " + JSON.stringify(nodePos));
        console.log("subV" + subV);
        let velocity = this.body.linearVelocity;
        console.log("velocity 1 " + velocity);
        subV.mulSelf(dt * 5);
        velocity.addSelf(subV);
        console.log("velocity 2 " + velocity);
        velocity.normalizeSelf();
        velocity.mulSelf(210);
        this.body.linearVelocity = velocity;


        // if(Math.abs(parseInt(flyRotation) - parseInt(MissleRotation)) < 5)
        // {
        //     // let subV =  flyPosV.sub(missPosV);
        //     // subV.normalizeSelf();
        //     // subV.mulSelf(210);
        //     this.body.linearVelocity = this.flybody.linearVelocity;
        // }
        // else
        // {
        //     let subV =  flyPosV.sub(missPosV);
        //     subV.normalizeSelf();
        //     subV.mulSelf(200);
        //     this.body.linearVelocity = subV;
        // }




        console.log("deltaRotation" + deltaRotation);

        // if(parseInt(deltaRotation) > 0)
        // {
        //     this.body.angularVelocity = 200
        //
        // }
        // else if(parseInt(deltaRotation) < 0)
        // {
        //     this.body.angularVelocity = -200
        // }
        // else
        // {
        //     this.body.angularVelocity = 0
        // }


        // let radians = cc.degreesToRadians(MissleRotation);
        // console.log("cc.degreesToRadians" + radians);
        // let MissleY = Math.cos(radians);
        // let MissleX = Math.sin(radians);
        // let cV = cc.v2(MissleX,MissleY);
        //
        // cV.normalizeSelf();
        // cV.mulSelf(200);
        // this.body.linearVelocity = cV;
        //
        // console.log("MissleX: " + MissleX);
        // console.log("MissleY: " + MissleY);



    },
});
