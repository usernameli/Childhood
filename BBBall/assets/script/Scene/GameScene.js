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

        cc.wwx.AudioManager.playGameStart();

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


        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_UPDATE_GAME_SCORE,{updateScore:this._sumScore});
        this._score += 10;

    },
    ballSports()
    {
        //重置分数
        this._score = 10;
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

        cc.wwx.AudioManager.playAudioButton();
        //爆炸销毁一部分砖块
        let diamondNum = parseInt(cc.wwx.UserInfo.bagData.diamondCount);
        if(100 > diamondNum) {
            //砖石不够
            cc.wwx.TipManager.showMsg('您的钻石不足', 3);
            return;
        }
        this.demolitionBomb.active = true;
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB);

    },
    item2Click()
    {


        cc.wwx.AudioManager.playAudioButton();
        //添加5个小球
        let diamondNum = parseInt(cc.wwx.UserInfo.bagData.diamondCount);
        if(100 > diamondNum) {
            //砖石不够
            cc.wwx.TipManager.showMsg('您的钻石不足', 1);
            return;
        }
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_ITEM_ADD_BALL);

    },

    item3Click()
    {
        cc.wwx.AudioManager.playAudioButton();
        //消除最后一行
        let diamondNum = parseInt(cc.wwx.UserInfo.bagData.diamondCount);
        if(100 > diamondNum) {
            //砖石不够
            cc.wwx.TipManager.showMsg('您的钻石不足', 1);
            return;
        }
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_A_LINE_OF_EXPLOSIONS);

    },
    item4Click()
    {
        cc.wwx.AudioManager.playAudioButton();
        //随机释放四个射线方块
        let diamondNum = parseInt(cc.wwx.UserInfo.bagData.diamondCount);
        if(100 > diamondNum) {
            //砖石不够
            cc.wwx.TipManager.showMsg('您的钻石不足', 1);
            return;
        }
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.RANDOM_PLACEMENT_4_ELIMINATE);

    },
    clickBallCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        //商城界面
        cc.wwx.PopWindowManager.popWindow("prefab/shop/Shop","ShopWindow");

    },
    clickStopCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.PopWindowManager.popWindow("prefab/GameStopWindow","GameStopWindow");
    },
    clickHelpCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        //技能帮助
        cc.wwx.PopWindowManager.popWindow("prefab/HelpWindow","HelpWindow");
    },
    yellowGunCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.TipManager.showMsg('功能暂未开放', 1);


    },



});