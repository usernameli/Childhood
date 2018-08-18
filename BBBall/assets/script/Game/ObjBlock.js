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
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_OBJ_BOMB,this.haveBombObj,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_ELIMINATE,this.haveEliminate,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB,this.randomElimination,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_REMOVE_OBJ_BLOCKS,this.removeObjBlock,this);
    },
    start()
    {
        this.body = this.getComponent(cc.RigidBody);
    },
    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,'onDestory');

        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_MOVE_DROP,this.ballMoveDrop,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_OBJ_BOMB,this.haveBombObj,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_ELIMINATE,this.haveEliminate,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB,this.randomElimination,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_REMOVE_OBJ_BLOCKS,this.removeObjBlock,this);

    },
    removeObjBlock()
    {
        this.node.destroy();

    },
    //随机销毁一部分方块
    randomElimination()
    {

    },
    haveEliminate(argument)
    {
        if(argument["direction"] === "horizontal")
        {
            //水平消除
            if(parseInt(argument["objPosition"].y) === this.node.y)
            {
                this.eliminateRowColumn();
            }
        }
        else
        {
            if(parseInt(argument["objPosition"].x) === this.node.x)
            {
                this.eliminateRowColumn();
            }
        }
    },
    eliminateRowColumn()
    {

    },
    objsBreak()
    {
        this.node.destroy();
    },
    haveBombObj(argument)
    {
        if(parseInt(argument["bomPosY"]) === this.node.y)
        {
            this.objsBreak();

        }
    },
    ballMoveDrop:function(argument)
    {

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

            let posY = this.node.y;
            let posX = this.node.x;
            this.node.setPosition(cc.p(posX,posY + (this._height + this._space) * -1));

            this._moveDrop = false;

        }
    }
})