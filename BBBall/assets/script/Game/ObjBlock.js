cc.Class({
    extends:cc.Component,
    properties:{

        _moveDrop:false,
        _width:0,
        _height:0,
        _space:4,
        _tag:"ObjBlock"


    },

    onLoad()
    {
        this._moveDrop = false;
        this._width = 60;
        this._height = 60;
        this._space = 4;
        cc.wwx.OutPut.log(this._tag,'onLoad');

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_MOVE_DROP,this.ballMoveDrop,this);


    },
    start()
    {
        this.body = this.getComponent(cc.RigidBody);
    },
    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,'onDestory:');

        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_MOVE_DROP,this.ballMoveDrop,this);

    },
    ballMoveDrop:function(argument)
    {
        cc.wwx.OutPut.log(this._tag,'ballMoveDrop:',JSON.stringify(argument));

        this._space = argument['space'];
        this._moveDrop = true;

    },
    onBeginContact(contact, self, other)
    {

    },
    initLabelNum()
    {

    },
    update()
    {

        if(this._moveDrop)
        {
            cc.wwx.OutPut.log(this._tag,'update:',this._moveDrop);

            let posY = this.node.getPositionY();
            let posX = this.node.getPositionX();
            this.node.setPosition(cc.p(posX,posY + (this._height + this._space) * -1));

            this._moveDrop = false;
        }
    }
})