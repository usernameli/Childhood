cc.Class({
    extends: cc.Component,

    properties: {

        _tag:"GameScene",
        _size: cc.size(0, 0),
        _ReadyNode:null,
        _LRONode:null,
        _CloudsNode:null,
    },


    onLoad () {

        this._ReadyNode = this.node.getChildByName("ReadyNode");
        this._LRONode = this.node.getChildByName("LRONode");
        this._ReadyNode.active = true;
        this._LRONode.active = false;
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.debugDrawFlags =
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit
        ;

        this._createPhyBody();

    },

    _createPhyBody: function () {
        let width   = this._size.width || this.node.width;
        let height  = this._size.height || this.node.height;

        let node = new cc.Node();

        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        this._addBound(node, 0, height/2, width, 20);
        this._addBound(node, 0, -height/2, width, 20);
        this._addBound(node, -width/2, 0, 20, height);
        this._addBound(node, width/2, 0, 20, height);

        node.parent = this.node;
    },
    _addBound (node, x, y, width, height) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    },
    backMainMenuCallBack:function () {
        cc.director.loadScene("MainScene");

    },
    gameStartCallBack:function () {
        this._ReadyNode.active = false;
        this._LRONode.active = true;
    },
    start () {

    },

    // update (dt) {},
});
