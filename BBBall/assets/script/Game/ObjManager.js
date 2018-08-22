cc.Class({
    extends: cc.Component,

    properties: {

        objBombPrefab:{
            default:null,
            type:cc.Prefab,
            displayName:"炸弹方块"
        },
        objDivergentPrefab:{
            default:null,
            type:cc.Prefab,
            displayName:"分散方块"
        },
        objTrianglePrefab3:{
            default:null,
            type:cc.Prefab,
            displayName:"三角形方块"
        },
        objTrianglePrefab4:{
            default:null,
            type:cc.Prefab,
            displayName:"三角形方块"
        },
        objTrianglePrefab5:{
            default:null,
            type:cc.Prefab,
            displayName:"三角形方块"
        },
        objTrianglePrefab6:{
            default:null,
            type:cc.Prefab,
            displayName:"三角形方块"
        },
        objSquarePrefab:{
            default:null,
            type:cc.Prefab,
            displayName:"方形方块"
        },
        objPlusPrefab:{
            default:null,
            type:cc.Prefab,
            displayName:"加球球形"
        },
        objEliminatePrefab:{
            default:null,
            type:cc.Prefab,
            displayName:"消除行或者列"

        },
        horizontalLinePrefab:{
            default:null,
            type:cc.Prefab
        },
        verticalLinePrefab:{
            default:null,
            type:cc.Prefab
        },
        warningNode:{
            default:null,
            type:cc.Node
        },
        aLineOfExplosionsNode:{
            default:null,
            type:cc.Node
        },
        _objsPrefab:[],//预制资源列表
        _space:4,//方块与方块边界
        _emptyGrid:[],
        _boundary:12,//方块与边界的距离
        _showRowNum:0,//先显示7行
        _showCocumn:11,//11列
        _objWidth:60,
        _objHeight:60,
        _currentRowI:-1,//当前显示第几行了
        _currentRowJ:-1,
        _tag:"ObjManager",
        _gameOver:false,
        _pointCheckList:null,//关卡数据
    },
    onLoad()
    {




        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_ELIMINATE,this.haveEliminate,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_A_LINE_OF_EXPLOSIONS,this.aLineOfExplosions,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.RANDOM_PLACEMENT_4_ELIMINATE,this.randomPlacement4Eliminate,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this.gameRestart,this);



    },

    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,"onDestroy");
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_ELIMINATE,this.haveEliminate,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_A_LINE_OF_EXPLOSIONS,this.aLineOfExplosions,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.RANDOM_PLACEMENT_4_ELIMINATE,this.randomPlacement4Eliminate,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_GAME_RESTART,this.gameRestart,this);

    },

    gameInit()
    {
        this._emptyGrid = [];
        if(cc.wwx.UserInfo.playMode === "level")
        {
            //关卡模式
            this._showRowNum = 7;

            this._checkpointGame()
        }
        else if(cc.wwx.UserInfo.playMode === "100ball")
        {
            //百球模式
            this._ball100Game();
        }
        else
        {
            //经典模式
            this._classicGame();
        }

        //计算方块矩阵里面的空位置

        this.findEmptyGridPosition();

        this._gameOver = false;

    },
    start()
    {
        this.gameInit();
    },
    gameRestart()
    {

        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_REMOVE_OBJ_BLOCKS);
        let self = this;
        setTimeout(function () {
            cc.wwx.OutPut.log(self._tag,"gameRestart ",self.node.childrenCount);
            self.gameInit();
        }, 500);

    },
    findEmptyGridPosition()
    {
        this._emptyGrid = [];
        let lowestPosY = this.findLastRowPosY();
        let topPosY = this.findTopRowPosY(lowestPosY);
        for(let posY = lowestPosY;posY <= topPosY;posY += (this._objWidth + this._space))
        {
            for(let k = 0; k < this._showCocumn;k++)
            {
                let posX =  this._boundary + this._objWidth / 2 + k * (this._objWidth + this._space);

                let find = false;
                for (var i = 0; i < this.node.childrenCount; ++i)
                {
                    let name = this.node.children[i].name;
                    let x = this.node.children[i].x;
                    let y = this.node.children[i].y;

                    if(name === "WarnNode" || name === "ALineOfExplosions" || name === "DottedLine")
                    {
                        continue;
                    }

                    if(x === posX && y === posY)
                    {
                        find = true;
                        break;
                    }
                }
                if(!find)
                {
                    this._emptyGrid.push({posX:posX,posY:posY});
                }
            }

        }


    },
    randomPlacement4Eliminate()
    {
        this.findEmptyGridPosition();

        let eliminateType = [7,8];
        let loopLenth = 4;
        if(this._emptyGrid.length < loopLenth)
        {
            loopLenth = this._emptyGrid.length;
        }
        let haveIndexList = [];
        while (haveIndexList.length < loopLenth)
        {
            let index = Math.floor(Math.random() * this._emptyGrid.length);
            if(haveIndexList.contains(index))
            {
                continue;
            }
            let objPrefab = cc.instantiate(this.objEliminatePrefab);
            this.node.addChild(objPrefab);
            objPrefab.setPosition(this._emptyGrid[index].posX , this._emptyGrid[index].posY);

            haveIndexList.push(index);
        }

    },
    showWarningAnim()
    {
        if(this.warningNode.active === false)
        {
            cc.wwx.AudioManager.playWarning();

            let anim = this.warningNode.getComponent(cc.Animation);
            let animState = anim.play();
            animState.wrapMode = cc.WrapMode.Loop;
            this.warningNode.active = true;


        }
    },
    hideWarningAnim()
    {
        if(this.warningNode.active)
        {
            let anim = this.warningNode.getComponent(cc.Animation);
            anim.stop();
            this.warningNode.active = false;
        }
    },
    haveEliminate(argument)
    {
        cc.wwx.OutPut.log(this._tag,"haveEliminate",JSON.stringify(argument));

        cc.wwx.AudioManager.playJiGuang();

        if(argument["direction"] === "horizontal")
        {
            //水平

            let horizontal = cc.instantiate(this.horizontalLinePrefab);
            this.node.addChild(horizontal);
            horizontal.setPosition(this.node.width/2 ,parseInt(argument["objPosition"].y))

        }
        else
        {
            //竖
            let horizontal = cc.instantiate(this.verticalLinePrefab);
            this.node.addChild(horizontal);
            horizontal.setPosition(parseInt(argument["objPosition"].x),this.node.height / 2 * -1)


        }
    },

    _classicGame()
    {
        this._showRowNum = 1;
        this._createOneRowObjs();

    },
    _createOneRowObjs()
    {
        let objsList = [1,2,17,3,4,14,5,15,6,21,7,12,13];
        for(let k = 0; k < 11;k++)
        {
            let objsID = Math.floor(Math.random() * objsList.length+1);
            if(objsList[objsID])
            {
                this._createObjBlock(objsList[objsID],this._showRowNum,k,1,0);
            }


        }
        this._showRowNum += 1;
    },
    _ball100Game()
    {

        let pointCheckData = cc.wwx.UserInfo.checkPointData;
        this._pointCheckList = pointCheckData;
        let hallAhall = pointCheckData.length / 2;
        this._showRowNum = 0;
        for(let i = hallAhall - 1; i >= 0;i--)
        {
            let dataList = pointCheckData[i];
            if(this._judgeArrayValue(dataList))
            {
                this._showRowNum += 1;
            }
        }

        this._checkpointGame()


    },
    _checkpointGame()
    {
        this._currentRowI = -1;//当前显示第几行了
        this._currentRowJ = -1;
        let pointCheckData = cc.wwx.UserInfo.checkPointData;
        this._pointCheckList = pointCheckData;
        let hallAhall = pointCheckData.length / 2;
        let hallAIndex = pointCheckData.length;
        let haveShowRow = 0;

        for(let i = hallAhall - 1,j = hallAIndex - 1; i >= 0,j >= hallAhall;i--,j--)
        {
            let dataList = pointCheckData[i];
            if(this._judgeArrayValue(dataList))
            {
                for(let k = 0; k < dataList.length;k++)
                {
                    if(dataList[k] > 0)
                    {
                        let dataValueObj = dataList[k];
                        let dataValueLabel = pointCheckData[j][k];
                        this._createObjBlock(dataValueObj,dataValueLabel,k,this._showRowNum,haveShowRow)
                    }

                }
                haveShowRow += 1;
                //_showRowNum行显示完了 退出循环
                if(haveShowRow === this._showRowNum)
                {
                    this._currentRowI = i - 1;
                    this._currentRowJ = j - 1;
                    break;
                }

            }

        }


    },
    findTopRowPosY(bottomPosY)
    {
        let posY = bottomPosY;
        for (var i = 0; i < this.node.childrenCount; ++i)
        {
            var name = this.node.children[i].name;
            if(name === "Ball_Block_Square" ||
                name === "Ball_Block_Triangle_3" ||
                name === "Ball_Block_Triangle_5" ||
                name === "Ball_Block_Triangle_6" ||
                name === "Ball_Block_Triangle_4")
            {
                if(this.node.children[i].y > posY)
                {
                    posY = this.node.children[i].y
                }
            }


        }

        return posY;
    },
    findLastRowPosY()
    {
        let posY = 0;
        for (var i = 0; i < this.node.childrenCount; ++i)
        {
            var name = this.node.children[i].name;
            if(name === "Ball_Block_Square" ||
                name === "Ball_Block_Triangle_3" ||
                name === "Ball_Block_Triangle_5" ||
                name === "Ball_Block_Triangle_6" ||
                name === "Ball_Block_Triangle_4")
            {
                if(this.node.children[i].y < posY)
                {
                    posY = this.node.children[i].y
                }
            }


        }

        return posY;
    },
    aLineOfExplosions()
    {
        let posY = this.findLastRowPosY();
        if(posY === 0)
        {
            return;
        }
        cc.wwx.AudioManager.playBomb();

        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_OBJ_BOMB,{bomPosY:posY});
        this.aLineOfExplosionsNode.setPosition(this.node.width/2,posY);
        this.aLineOfExplosionsNode.active = true;
        let anim = this.aLineOfExplosionsNode.getComponent(cc.Animation);
        anim.play();
    },
    _createObjBlock:function(dataValueObj,dataValueLabel,column,showRowNum,haveShowRow)
    {
        let objsPrefab = null;
        let objsComponent = null;
        if(parseInt(dataValueObj) === 1 ||
            parseInt(dataValueObj) === 17 ||
            parseInt(dataValueObj) === 2 ||
            parseInt(dataValueObj) === 11)
        {
            //方块
            objsPrefab = this.objSquarePrefab;
            objsComponent = "ObjBlockSquare";

            if(parseInt(dataValueObj) === 2)
            {
                dataValueLabel *= 2;
            }

        }
        else if(parseInt(dataValueObj) === 3)
        {
            //三角形
            objsPrefab = this.objTrianglePrefab3;
            objsComponent = "ObjBlockTriangle";

        }
        else if(parseInt(dataValueObj) === 4)
        {
            objsPrefab = this.objTrianglePrefab4;
            objsComponent = "ObjBlockTriangle";


        }
        else if(parseInt(dataValueObj) === 5)
        {
            objsPrefab = this.objTrianglePrefab5;
            objsComponent = "ObjBlockTriangle";


        }
        else if(parseInt(dataValueObj) === 6)
        {
            objsPrefab = this.objTrianglePrefab6;
            objsComponent = "ObjBlockTriangle";


        }
        else if(parseInt(dataValueObj) >= 21 && parseInt(dataValueObj) <= 23)
        {
            //加球
            objsPrefab = this.objPlusPrefab;
            objsComponent = "ObjBlockPlus";

        }
        else if(parseInt(dataValueObj) === 7  || parseInt(dataValueObj) === 8)
        {
            //消除一行或者一列
            objsPrefab = this.objEliminatePrefab;
            objsComponent = "ObjBlockEliminate";
        }
        else if(parseInt(dataValueObj) === 9)
        {
            objsPrefab = this.objBombPrefab;
            objsComponent = "ObjBlockBomb";
        }
        else if(parseInt(dataValueObj) === 24)
        {
            objsPrefab = this.objDivergentPrefab;
            objsComponent = "ObjBlockDivergent";
        }
        if(objsPrefab)
        {
            let objPrefab = cc.instantiate(objsPrefab);
            this.node.addChild(objPrefab);
            let posY = -1 * (84 + (showRowNum - haveShowRow - 1) * (this._objHeight + this._space) + this._objHeight / 2);
            let posX =  this._boundary + this._objWidth / 2 + column * (this._objWidth + this._space);
            let ObjBlockSquare = objPrefab.getComponent(objsComponent);
            if(objsComponent === "ObjBlockPlus")
            {
                ObjBlockSquare.initLabelNum(parseInt(dataValueObj) - 20);

            }
            else if(objsComponent === "ObjBlockEliminate")
            {
                ObjBlockSquare.initLabelNum(parseInt(dataValueObj));
            }
            else
            {
                ObjBlockSquare.initLabelNum(dataValueLabel);

            }
            objPrefab.setPosition(posX , posY);
        }
    },

    ballStopAction:function(argument)
    {
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_MOVE_DROP,{space:this._space});
        if(cc.wwx.UserInfo.playMode === "classic")
        {
            this._createOneRowObjs();
            return;
        }
        else if(cc.wwx.UserInfo.playMode === "100ball")
        {
            this._gameIsSucess();
            this._gameOver = true;
            return;
        }

        if(this._currentRowI >= 0)
        {

            let checkList = this._pointCheckList[this._currentRowI];

            if(this._judgeArrayValue(checkList))
            {
                for(let k = 0; k < checkList.length;k++)
                {
                    if(checkList[k] > 0)
                    {
                        let dataValueObj = checkList[k];
                        let dataValueLabel = this._pointCheckList[this._currentRowJ][k];

                        this._createObjBlock(dataValueObj,dataValueLabel,k,this._showRowNum,6);

                    }
                }
            }

            this._currentRowI -= 1;
            this._currentRowJ -= 1;

        }
        else
        {
            if(this.node.childrenCount === 3)
            {
                this._gameIsSucess();
            }

        }

    },
    _gameIsSucess()
    {
        this._gameOver = true;
        //上报分数

        cc.wwx.TCPMSG.updateUpLoadGameScore(cc.wwx.SystemInfo.gameId,
            cc.wwx.UserInfo.playMode,
            cc.wwx.UserInfo.currentSocre,
            cc.wwx.UserInfo.checkPointID,1,2);
        cc.wwx.PopWindowManager.popWindow("prefab/ResultWindow","ResultWindow",{GameResult:true});

    },
    _gameIsOver()
    {
        //上报分数
        cc.wwx.TCPMSG.updateUpLoadGameScore(cc.wwx.SystemInfo.gameId,
            cc.wwx.UserInfo.playMode,
            cc.wwx.UserInfo.currentSocre,
            cc.wwx.UserInfo.checkPointID,0,3);

        cc.wwx.PopWindowManager.popWindow("prefab/ResultFirstWindow","ResultFirstWindow");
    },
    _judgeArrayValue:function (dataList) {
        let isFg = false;
        if(dataList.length > 0)
        {
            for(let k = 0; k < dataList.length;k++)
            {
                if(dataList[k] > 0)
                {
                    isFg = true;
                    break;
                }
            }
        }
        return isFg;
    },
    update()
    {

        if(this._gameOver)
        {

            return;
        }
        let posY = this.findLastRowPosY();
        if(posY === -818)
        {
            this.showWarningAnim();
        }
        else if(posY === -882)
        {
            this._gameOver = true;
            this._gameIsOver();
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_TOUCHBOTTOM)
        }
        else
        {
            this.hideWarningAnim();
        }
    }
});