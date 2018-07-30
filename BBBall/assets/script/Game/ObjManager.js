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
    onDestroy()
    {
        cc.wwx.OutPut.log(this._tag,"onDestroy");
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);

    },
    _classicGame()
    {
        this._showRowNum = 1;
        this._createOneRowObjs();

    },
    _createOneRowObjs()
    {
        let objsList = [8,1,2,10,11,17,3,4,14,5,15,16,6,21,22,23,7,9,12,13];
        for(let k = 0; k < 11;k++)
        {
            let objsID = Math.floor(Math.random() * objsList.length+1);
            this._createObjBlock(objsID,this._showRowNum,k,1,0)

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
        cc.wwx.MapCheckPoint.getMapCheckPointData(524);
        let pointCheckData = [["16","16","16","1","1","1","16","1","0","1","1"],["1","2","0","1","1","1","1","2","2","2","1"],["16","18","18","7","7","21","0","0","18","2","1"],["1","1","24","0","0","0","8","0","0","1","1"],["16","1","21","7","16","0","1","0","21","16","1"],["17","2","8","0","2","0","19","0","0","19","1"],["1","1","0","21","16","0","16","21","0","16","1"],["2","19","0","0","1","8","19","7","21","19","1"],["2","2","21","0","0","0","0","0","21","2","2"],["2","2","0","0","2","0","2","7","8","1","1"],["18","18","0","0","0","24","0","0","0","18","2"],["1","1","1","24","0","8","0","0","1","1","1"],["2","1","0","1","1","1","2","1","2","2","1"],["19","17","2","1","1","19","1","17","0","2","1"],["2","2","1","2","0","1","2","1","2","1","1"],["2","2","1","2","2","1","1","0","1","2","1"],["18","18","18","0","0","21","0","0","2","16","1"],["19","19","7","0","0","0","0","0","0","19","2"],["18","2","0","0","0","18","0","0","0","18","1"],["19","19","21","0","0","19","0","0","21","2","1"],["2","18","0","0","7","18","0","0","0","18","1"],["19","19","7","0","0","2","0","0","0","19","1"],["16","16","21","0","0","0","8","0","21","16","1"],["17","1","0","0","0","17","0","7","0","17","1"],["1","1","0","0","0","8","0","0","0","1","1"],["1","1","1","8","0","21","7","0","1","1","1"],["1","1","1","1","0","1","1","1","1","1","1"],["1","2","1","17","1","0","19","17","19","2","1"],["0","1","1","1","1","1","1","1","1","1","1"],["1","2","2","1","1","0","1","2","2","1","1"],["1","1","1","0","0","7","0","0","1","1","1"],["2","2","0","0","8","0","0","0","0","2","2"],["1","1","8","0","1","1","1","0","0","1","1"],["19","19","21","0","1","0","2","7","21","19","1"],["1","1","0","0","0","1","1","0","0","1","1"],["17","17","8","21","0","17","0","21","0","1","1"],["1","1","0","0","0","0","7","0","0","1","1"],["1","1","8","0","0","1","0","0","21","1","1"],["1","1","0","0","0","0","8","0","0","1","1"],["1","1","1","7","0","21","0","0","1","1","1"],["1","1","1","1","1","16","1","16","0","16","1"],["1","1","1","1","1","1","0","1","1","1","1"],["1","1","1","1","8","1","7","1","1","1","1"],["2","0","2","0","1","2","1","8","2","0","1"],["21","0","0","1","16","1","1","16","0","0","21"],["8","0","1","1","1","23","1","1","1","8","0"],["0","0","0","16","2","2","16","1","0","0","0"],["0","21","1","0","17","1","1","8","17","21","0"],["0","0","1","1","0","1","0","1","1","0","0"],["21","0","0","0","1","0","1","0","0","0","21"],["1","0","1","1","0","0","0","1","1","0","1"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["67","67","67","135","135","135","67","135","0","135","135"],["135","135","0","135","135","135","135","135","135","135","135"],["137","274","274","0","0","0","0","0","274","274","274"],["272","272","0","0","0","0","0","0","0","272","272"],["102","204","0","0","102","0","204","0","0","102","204"],["108","217","0","0","217","0","217","0","0","217","217"],["145","145","0","0","72","0","72","0","0","72","145"],["286","286","0","0","286","0","286","0","0","286","286"],["131","131","0","0","0","0","0","0","0","131","131"],["256","256","0","0","256","0","256","0","0","256","256"],["192","192","0","0","0","0","0","0","0","192","192"],["278","278","278","0","0","0","0","0","278","278","278"],["126","126","0","126","126","126","126","126","126","126","126"],["126","63","126","126","126","126","126","63","0","126","126"],["116","116","116","116","0","116","116","116","116","116","116"],["116","116","116","116","116","116","116","0","116","116","116"],["128","128","128","0","0","0","0","0","128","64","128"],["207","207","0","0","0","0","0","0","0","207","207"],["138","138","0","0","0","138","0","0","0","138","138"],["138","138","0","0","0","138","0","0","0","138","138"],["187","187","0","0","0","187","0","0","0","187","187"],["187","187","0","0","0","187","0","0","0","187","187"],["93","93","0","0","0","0","0","0","0","93","187"],["99","199","0","0","0","99","0","0","0","99","199"],["199","199","0","0","0","0","0","0","0","199","199"],["266","266","266","0","0","0","0","0","266","266","266"],["110","110","110","110","0","110","110","110","110","110","110"],["110","110","110","55","110","0","110","55","110","110","110"],["0","110","110","110","110","110","110","110","110","110","110"],["119","119","119","119","119","0","119","119","119","119","119"],["198","198","198","0","0","0","0","0","198","198","198"],["198","198","0","0","0","0","0","0","0","198","198"],["183","183","0","0","183","183","183","0","0","183","183"],["183","183","0","0","183","0","183","0","0","183","183"],["120","120","0","0","0","120","120","0","0","120","120"],["97","97","0","0","0","97","0","0","0","195","195"],["190","190","0","0","0","0","0","0","0","190","190"],["190","190","0","0","0","190","0","0","0","190","190"],["174","174","0","0","0","0","0","0","0","174","174"],["174","174","174","0","0","0","0","0","174","174","174"],["104","104","104","104","104","52","104","52","0","52","104"],["96","96","96","96","96","96","0","96","96","96","96"],["212","212","212","212","0","212","0","212","212","212","212"],["159","0","159","0","159","159","159","0","159","0","159"],["0","0","0","96","48","96","96","48","0","0","0"],["0","0","188","188","188","0","188","188","188","0","0"],["0","0","0","46","93","93","46","93","0","0","0"],["0","0","139","0","69","139","139","0","69","0","0"],["0","0","91","91","0","91","0","91","91","0","0"],["0","0","0","0","91","0","91","0","0","0","0"],["90","0","90","90","0","0","0","90","90","0","90"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"]];
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
        cc.wwx.OutPut.log("ObjManager","ballStopAction");


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
            cc.wwx.OutPut.log("ObjManager","ballStopAction checkList: ",JSON.stringify(checkList));
            cc.wwx.OutPut.log("ObjManager","ballStopAction checkList: ",JSON.stringify(this._pointCheckList[this._currentRowJ]));

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