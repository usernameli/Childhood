cc.Class({
    extends: cc.Component,

    properties: {
        demolitionBomb:{
            default:null,
            type:cc.Node
        },
        objArea:{
            default:null,
            type:cc.Node
        },
        jumpScorePrefab:{
            default:null,
            type:cc.Prefab,
        },
        itemNode:{
            default:null,
            type:cc.Node
        },
        recoveryBTN:{
            default:null,
            type:cc.Node
        },
        _tag:"gameScene",
        _score:0,
        _sumScore:0,
    },
    onLoad()
    {
        if(!cc.wwx)
        {
            initMgr();
        }
        this._score = 0;
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB_END,this.demolitionBombEnd,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_SPORTS,this.ballSports,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_OBJ_BREAK,this.ballBomb,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);

    },
    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,"onDestroy");
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB_END,this.demolitionBombEnd,this);

        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_SPORTS,this.ballSports,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_OBJ_BREAK,this.ballBomb,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);

    },
    ballBomb(argument)
    {
        cc.wwx.OutPut.log(this._tag,"ballBomb",JSON.stringify(argument));
        //有方块碎了
        let score = this._score;
        let bombPosition = argument["objPosition"];
        this._sumScore += score;

        let jumpScorePrefab = cc.instantiate(this.jumpScorePrefab);
        this.objArea.addChild(jumpScorePrefab);
        jumpScorePrefab.setPosition(bombPosition);
        let component = jumpScorePrefab.getComponent('ScoreJump');
        component.setScoreNum(score);

        let spawn1 = cc.spawn(cc.moveBy(0.2,cc.p(0,40)),cc.fadeIn(0.1));
        let spawn2 = cc.spawn(cc.moveBy(0.1,cc.p(0,-15)),cc.scaleTo(0.1,2));
        let spawn3 = cc.spawn(cc.moveBy(0.4,cc.p(0,25)),cc.scaleTo(0.4,1));
        jumpScorePrefab.runAction(cc.sequence(spawn1,spawn2,spawn3,cc.callFunc(function () {

            jumpScorePrefab.destroy();
        })));



        this._score += 10;
    },
    ballSports()
    {
        //重置分数
        this._score = 10;
        this._sumScore = 0;
        this.itemNode.active = false;
        this.recoveryBTN.active = true;

    },
    ballStopAction()
    {
        this.itemNode.active = true;
        this.recoveryBTN.active = false;

    },
    objBombBegin()
    {
        this.objBomb.active = true;

    },
    objBombEnd()
    {
        this.objBomb.active = false;
    },
    demolitionBombEnd()
    {
        this.demolitionBomb.active = false;

    },

    item1Click()
    {
        //爆炸销毁一部分砖块
        this.demolitionBomb.active = true;
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB);

    },
    item2Click()
    {
        //
        //添加5个小球
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_ITEM_ADD_BALL);

    },

    item3Click()
    {
        //消除最后一行
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_A_LINE_OF_EXPLOSIONS);

    },
    item4Click()
    {
        //随机释放四个射线方块
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.RANDOM_PLACEMENT_4_ELIMINATE);

    },

    clickStopCallBack()
    {
        cc.wwx.PopWindowManager.popWindow("prefab/GameStopWindow");
    },
    clickHelpCallBack()
    {

    },
    clickBallCallBack()
    {

    }


});