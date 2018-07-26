cc.Class({
    extends: cc.Component,

    properties: {

        labelNum:{
            default:null,
            type:cc.Label
        },
        splashNode:{
            default:null,
            type:cc.Node
        },
        particlePrefab:{
            default:null,
            type:cc.Prefab
        },
        _labelNum:0,
        _moveDrop:false,
        _space:4,
    },
    onLoad()
    {
        this._moveDrop = false;
        this._space = 4;
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_MOVE_DROP,this.ballMoveDrop,this);

    },
    ballMoveDrop:function(argument)
    {
        cc.wwx.OutPut.log('onBeginContact:', 'ballMoveDrop', JSON.stringify(argument));


        this._space = argument['space'];
        this._moveDrop = true;

    },
    start()
    {
        this.body = this.getComponent(cc.RigidBody);
    },
    initLabelNum:function (num) {
        this._labelNum = parseInt(num);
        this.labelNum.string = this._labelNum.toString();

    },
    onBeginContact(contact, self, other) {
        if(this._labelNum > 0)
        {
            this._labelNum -= 1;
            this.labelNum.string = this._labelNum.toString();
            this.splashNode.active = true;

        }
        else
        {
            this.body.enabledContactListener = false;
            cc.wwx.OutPut.log('onBeginContact:', 'ObjBlockSquare', JSON.stringify(this._labelNum));
            //生成粒子系统
            let particle = cc.instantiate(this.particlePrefab);
            // this.node.addChild(particle);
            particle.parent = this.node.parent;
            particle.setPosition(this.node.position);
            this.node.active = false;
        }



    },
    update()
    {
        if(this.splashNode.active)
        {
            this.splashNode.active = false;
        }

        if(this._moveDrop)
        {
            let posY = this.node.getPositionY();
            let posX = this.node.getPositionX();
            this.node.setPosition(cc.p(posX,posY + (this.node.height + this._space) * -1));

            this._moveDrop = false;
        }
    }

});