cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad()
    {


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
        this._addBound(node, width/2, 0, width, 2,2);//下面
        this._addBound(node, 0, height/2 , 4, height,3);//左面
        this._addBound(node, width, height/2, 4, height,4);//右面




        node.parent = this.node;
    },
    onDestroy()
    {
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = false;
    },
    _addBound (node, x, y, width, height,tag) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.tag = tag;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;

    },
})