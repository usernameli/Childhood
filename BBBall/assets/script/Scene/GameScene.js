cc.Class({
    extends: cc.Component,

    properties: {
        demolitionBomb:{
            default:null,
            type:cc.Node
        },
        guideNode:{

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
        item1Num:{
            default:null,
            type:cc.Node
        },
        item1Node:{
            default:null,
            type:cc.Node
        },
        item2Num:{
            default:null,
            type:cc.Node
        },
        item2Node:{
            default:null,
            type:cc.Node
        },
        item3Num:{
            default:null,
            type:cc.Node
        },
        item3Node:{
            default:null,
            type:cc.Node
        },
        item4Num:{
            default:null,
            type:cc.Node
        },
        item4Node:{
            default:null,
            type:cc.Node
        },

        _tag:"gameScene",
        _score:0,
        _sumScore:0,
        _ballSporting:false,
    },
    onLoad()
    {


        this.init();
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB_END,this.demolitionBombEnd,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_GUIDE_ANIMATION_END,this.guideAnimationEnd,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_SPORTS,this.ballSports,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_OBJ_BREAK,this.ballBomb,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this.gameRestart,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_CONSUME_ITEM,this.consumeItemCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_BAG,this.gameBagData,this);

    },
    gameRestart()
    {

        this.init();
    },
    init()
    {
        this._score = 0;
        this._sumScore = 0;
        this._ballSporting = false;
        cc.wwx.AudioManager.playGameStart();
    },
    start()
    {
        let list = cc.wwx.UserInfo.bagData.m_normalItemList;

        this.refreshBottomItem(list);


        if(cc.wwx.UserInfo.playMode === "level" && cc.wwx.UserInfo.checkPointID === 1)
        {
            this.guideNode.active = true;
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_GUIDE_ANIMATION);

        }

    },
    gameBagData()
    {
        let list = cc.wwx.UserInfo.bagData.m_normalItemList;

        this.refreshBottomItem(list);
    },
    guideAnimationEnd()
    {
        this.guideNode.active = false;

    },
    refreshBottomItem(itemList)
    {
        this.item1Num.active = false;
        this.item1Node.active = true;

        this.item2Num.active = false;
        this.item2Node.active = true;

        this.item3Num.active = false;
        this.item3Node.active = true;

        this.item4Num.active = false;
        this.item4Node.active = true;

        for(let i = 0; i < itemList.length;i++)
        {
            if(itemList[i]['id'] == "1012")
            {
                this.item1Num.active = true;
                this.item1Node.active = false;
                this.item1Num.getComponent("cc.Label").string =  "x" + itemList[i]['num'];
            }
            else if(itemList[i]['id'] == "1015")
            {
                this.item2Num.active = true;
                this.item2Node.active = false;
                this.item2Num.getComponent("cc.Label").string =  "x" + itemList[i]['num'];
            }
            else if(itemList[i]['id'] == "1014")
            {
                this.item3Num.active = true;
                this.item3Node.active = false;
                this.item3Num.getComponent("cc.Label").string =  "x" + itemList[i]['num'];
            }
            else if(itemList[i]['id'] == "1013")
            {
                this.item4Num.active = true;
                this.item4Node.active = false;
                this.item4Num.getComponent("cc.Label").string =  "x" + itemList[i]['num'];
            }
        }

    },
    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,"onDestroy");
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB_END,this.demolitionBombEnd,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this.gameRestart,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_CONSUME_ITEM,this.consumeItemCallBack,this);

        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_SPORTS,this.ballSports,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_OBJ_BREAK,this.ballBomb,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_GUIDE_ANIMATION_END,this.guideAnimationEnd,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_BAG,this.gameBagData,this);

    },
    consumeItemCallBack(argument)
    {
        //{"cmd":"user","params":{"gameId":101,"count":1,"action":"consume_item","itemId":1012,"userId":20006,"version":2.25,"clientId":"H5_1.21_weixin.weixin.0-hall101.weixin.test"}}
        cc.wwx.OutPut.log(this._tag,"consumeItemCallBack: ",JSON.stringify(argument));

        if(argument["action"]==="consume_item")
        {
            if(argument["itemId"] == 1012)
            {
                this.demolitionBomb.active = true;
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_DEMOLITION_BOMB);

            }
            else if(argument["itemId"] == 1015)
            {
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_ITEM_ADD_BALL);

            }
            else if(argument["itemId"] == 1014)
            {
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_A_LINE_OF_EXPLOSIONS);

            }
            else if(argument["itemId"] == 1013)
            {
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.RANDOM_PLACEMENT_4_ELIMINATE);

            }

        }
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

        let spawn1 = cc.spawn(cc.moveBy(0.2,cc.v2(0,40)),cc.fadeIn(0.1));
        let spawn2 = cc.spawn(cc.moveBy(0.1,cc.v2(0,-15)),cc.scaleTo(0.1,2));
        let spawn3 = cc.spawn(cc.moveBy(0.4,cc.v2(0,25)),cc.scaleTo(0.4,1));
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
        this._ballSporting = true;
    },
    ballStopAction()
    {
        this.itemNode.active = true;
        this.recoveryBTN.active = false;
        this._ballSporting = false;


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

        this.userItem("1012");


    },
    item2Click()
    {


        this.userItem("1015");


    },

    item3Click()
    {
        this.userItem("1014");


    },
    item4Click()
    {
        this.userItem("1013");

    },
    userItem(itemID)
    {
        cc.wwx.AudioManager.playAudioButton();
        //随机释放四个射线方块
        let itemNum = cc.wwx.UserInfo.getBagItemNum(itemID);

        let diamondNum = parseInt(cc.wwx.UserInfo.bagData.diamondCount);
        if(itemNum && 100 > diamondNum) {
            //砖石不够
            cc.wwx.TipManager.showMsg('您的宝石不足,邀请好友可以获得宝石奖励', 1);
            return;
        }

        if(itemNum > 0)
        {
            cc.wwx.TCPMSG.consumeItem(parseInt(itemID),1);

        }
        else
        {
            cc.wwx.PopWindowManager.popWindow("prefab/PopBoxWindow","PopBoxWindow",
                {text:'您确定花费100宝石使用道具吗?',okCallBack:function () {
                        // cc.wwx.TCPMSG.consumeItem("1011",1);
                        cc.wwx.TCPMSG.consumeItem(parseInt(itemID),1);

                    }});
        }
    },
    clickBallCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        //商城界面
        if(this._ballSporting === false)
        {
            cc.wwx.PopWindowManager.popWindow("prefab/shop/Shop","ShopWindow");

        }

    },
    clickStopCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        if(this._ballSporting === false)
        {
            cc.wwx.PopWindowManager.popWindow("prefab/GameStopWindow","GameStopWindow");

        }
    },
    clickHelpCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        //技能帮助
        if(this._ballSporting === false)
        {
            cc.wwx.PopWindowManager.popWindow("prefab/HelpWindow","HelpWindow");

        }
    },
    yellowGunCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.TipManager.showMsg('功能暂未开放', 1);


    },



});