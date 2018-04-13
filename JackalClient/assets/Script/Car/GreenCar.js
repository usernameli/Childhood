import JackalGlobal from "../Global";

var  Car = require("./Car");
cc.Class({
    extends: Car,

    properties: {

        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        this._grenadeFireEnd = true;
        this._machineFireEnd = true;
        JackalGlobal.Event.on("set-pos",this.setBankPosition,this);
        JackalGlobal.Event.on("bg-no-pos",this.bgNoSetPosition,this);
        JackalGlobal.Event.on("machineGun-fire",this.machineGunFireNow,this);
        JackalGlobal.Event.on("grenade-fire",this.grenadeFireNow,this);
        JackalGlobal.Event.on("grenade-fire_end",this.grenadeFireEnd,this);

        // this._boxManager = cc.director.getCollisionManager();
        // this._boxManager.enable = true;
        // this._boxManager.enabledDebugDraw = true;
        // this._boxManager.enabledDrawBoundingBox = true;

    },
    machineGunFireNow()
    {
        this._super();
    },
    grenadeFireEnd()
    {
        this._grenadeFireEnd = true;
    },
    grenadeFireNow()
    {
        this._super();
    },
    bgNoSetPosition()
    {
        this._super();
    },
    setBankPosition(argument)
    {
        this._super(argument)
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider) {
        // contact.disabled = true;
        console.log("onBeginContact:" +JSON.stringify(selfCollider.tag));
        this._isCollision = true;
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, selfCollider, otherCollider) {
        console.log("onEndContact:");
        this._isCollision = false;
        // contact.disabled = false;
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve(contact, selfCollider, otherCollider) {
        console.log("onPreSolve:");
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve(contact, selfCollider, otherCollider) {
        console.log("onPostSolve:");
    },
    onCollisionEnter(other, self) {
        this._isCollision = true;

        console.log('on collision enter');


    },
    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay(other, self) {
        // console.log('on collision stay');
    },
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self) {
        this._isCollision = false;

        console.log('on collision exit');
    },
    start () {

    },

    // update (dt) {},
});
