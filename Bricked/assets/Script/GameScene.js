cc.Class({
    extends: cc.Component,

    properties: {
        // defaults, set visually when attaching this script to the Canvas
    },

    // use this for initialization
    onLoad: function () {

        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.debugDrawFlags =
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit
        ;
        let width   =  this.node.width;
        let height  =  this.node.height;

        let node = new cc.Node();
        node.group = "wall";
        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        this._addBound(node, 0, height/2, width, 20,1);//上面
        this._addBound(node, 0, -height/2, width, 20,2);//下面
        this._addBound(node, -width/2, 0, 20, height,3);//左面
        this._addBound(node, width/2, 0, 20, height,4);//右面

        node.parent = this.node;
    },
    _addBound (node, x, y, width, height,tag) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.tag = tag;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    },
    // called every frame
    update: function (dt) {

    },
});
