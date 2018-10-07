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
        cc.wwx.OutPut.log("haveBombObj: ",JSON.stringify(argument));
        cc.wwx.OutPut.log("this.node.y: ",parseInt(this.node.y));
        if(Math.abs(parseInt(argument["bomPosY"]) - parseInt(this.node.y)) < 2)
        {
            this.objsBreak();

        }
    },
    ballMoveDrop:function(argument)
    {
        cc.wwx.OutPut.log( this._tag,"ballMoveDrop");

        this._space = argument['space'];
        this._moveDrop = true;

    },
    setRandomColor(randNum)
    {
        // 赤色 【RGB】255, 0, 0 【CMYK】 0, 100, 100, 0
        // 橙色 【RGB】 255, 165, 0 【CMYK】0, 35, 100, 0
        // 黄色 【RGB】255, 255, 0 【CMYK】0, 0, 100, 0
        // 绿色 【RGB】0, 255, 0 【CMYK】100, 0, 100, 0
        // 青色 【RGB】0, 127, 255 【CMYK】100, 50, 0, 0
        // 蓝色 【RGB】0, 0, 255 【CMYK】100, 100, 0, 0
        // 紫色 【RGB】139, 0, 255 【CMYK】45, 100, 0, 0
        let randomColor = [
            {r:255, g:190,   b:121},
            {r:112, g:199, b:255},
            {r:240, g:165, b:104},
            {r:120,   g:184, b:255},
            {r:237,   g:137, b:102},
            {r:79,   g:155,   b:231},
            {r:235, g:116,   b:102},
            {r:67, g:112,   b:214},
            {r:228, g:72,   b:85},
            {r:54, g:112,   b:239},
        ];
        let randColor = randomColor[0];
        let num = randNum % 10;


        randColor = randomColor[num];




        cc.wwx.OutPut.log("setRandomColor randNum: ", randNum);
        cc.wwx.OutPut.log("setRandomColor randColor: ",JSON.stringify(randColor));
        return randColor;

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
            this.node.setPosition(posX,posY + (this._height + this._space) * -1);

            this._moveDrop = false;

        }
    }
})