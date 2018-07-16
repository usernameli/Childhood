
cc.Class({
    extends: cc.Component,

    properties: {

        sketchLinePrefab:{
            default: null,
            type: cc.Prefab,
            displayName:'导弹后面的轨迹'
        },
        flyNode: {
            default: null,
            serializable: false
        },
        parentNode: {
            default: null,
            serializable: false
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
        var scheduler = cc.director.getScheduler();
        this.node.setLocalZOrder(1);
        scheduler.schedule(this.createSketchLine, this, 0.15, cc.macro.REPEAT_FOREVER);

    },
    //每一秒产生一个轨迹
    createSketchLine(){
        var sketchLine = cc.instantiate(this.sketchLinePrefab);
        this.parentNode.addChild(sketchLine);
        sketchLine.setLocalZOrder(-1);
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

        this.node.setRotation(deltaRotation);
        let flyPosV = cc.v2(flyPos.x,flyPos.y);
        let missPosV = cc.v2(nodePos.x,nodePos.y);

        let subV =  flyPosV.sub(missPosV);
        let velocity = this.body.linearVelocity;
        subV.mulSelf(dt * 10);
        velocity.addSelf(subV);
        velocity.normalizeSelf();
        velocity.mulSelf(350);
        this.body.linearVelocity = velocity;

    },
});
