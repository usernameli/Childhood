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
        _objsPrefab:[],//预制资源列表
        _space:4,//方块与方块边界
        _boundary:12,//方块与边界的距离
        _showRowNum:0,//先显示7行
        _showCocumn:11,//11列
        _objWidth:60,
        _objHeight:60,
        _currentRowI:-1,//当前显示第几行了
        _currentRowJ:-1,
        _tag:"ObjManager",
        _pointCheckList:null,//关卡数据
    },
    onLoad()
    {


        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_ELIMINATE,this.haveEliminate,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_DROP_WARNING,this.showWarningAnim,this);

        if(cc.wwx.UserInfo.playMode === "checkPoint")
        {
            //关卡模式
            this._checkpointGame()
        }
        else if(cc.wwx.UserInfo.playMode === "ball100")
        {
            //百球模式
            this._ball100Game();
        }
        else
        {
            //经典模式
            this._classicGame();
        }


    },
    showWarningAnim()
    {
        if(this.warningNode.active === false)
        {
            this.warningNode.active = true;
            let anim = this.warningNode.getComponent(cc.Animation);
            let animState = anim.play();
            animState.wrapMode = cc.WrapMode.Loop;

        }
    },
    haveEliminate(argument)
    {
        cc.wwx.OutPut.log(this._tag,"haveEliminate",JSON.stringify(argument));
        if(argument["direction"] === "horizontal")
        {
            //水平

            let horizontal = cc.instantiate(this.horizontalLinePrefab);
            this.node.addChild(horizontal);
            horizontal.setPosition(cc.p(this.node.width/2 ,parseInt(argument["objPosition"].y)))

        }
        else
        {
            //竖
            let horizontal = cc.instantiate(this.verticalLinePrefab);
            this.node.addChild(horizontal);
            horizontal.setPosition(cc.p(parseInt(argument["objPosition"].x),this.node.height / 2 * -1))


        }
    },
    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,"onDestroy");
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_ELIMINATE,this.haveEliminate,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_DROP_WARNING,this.showWarningAnim,this);

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
                this._createObjBlock(objsList[objsID],this._showRowNum,k,1,0)

            }

        }
        this._showRowNum += 1;
    },
    _ball100Game()
    {
        this._checkpointGame();

    },
    _checkpointGame()
    {
        this._showRowNum = 7;
        this._currentRowI = -1;//当前显示第几行了
        this._currentRowJ = -1;
        let pointCheckData = cc.wwx.UserInfo.checkPointData;
        this._pointCheckList = pointCheckData;
        cc.wwx.OutPut.log("ObjManager","_checkpointGame",pointCheckData.length);
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
    _createObjBlock:function(dataValueObj,dataValueLabel,column,showRowNum,haveShowRow)
    {
        let objsPrefab = null;
        let objsComponent = null;
        if(parseInt(dataValueObj) === 1 || parseInt(dataValueObj) === 17)
        {
            //方块
            objsPrefab = this.objSquarePrefab;
            objsComponent = "ObjBlockSquare";

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
            objPrefab.setPosition(cc.p(posX , posY));
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
        cc.wwx.OutPut.log("ObjManager","_currentRowI: ",this._currentRowI);
        cc.wwx.OutPut.log("ObjManager","_currentRowJ: ",this._currentRowJ);

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
});