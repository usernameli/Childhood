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
        _space:4,//方块与方块边界
        _boundary:12,//方块与边界的距离
        _showRowNum:7,//先显示7行
        _showCocumn:11,//11列
        _Grids:[],//每一个格子的位置
        _objWidth:60,
        _objHeight:60,
        _currentRowI:-1,//当前显示第几行了
        _currentRowJ:-1,
        _pointCheckList:null,//关卡数据
    },
    onLoad()
    {


        this._currentRowI = -1;//当前显示第几行了
        this._currentRowJ = -1;
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);

        cc.wwx.MapCheckPoint.getMapCheckPointData(123);
        let pointCheckData = [["1","1","1","0","0","21","1","6","1","3","1"],["1","1","0","0","1","1","1","5","0","6","1"],["0","4","21","1","0","1","0","1","1","4","0"],["1","6","1","5","0","0","0","21","0","1","0"],["6","1","21","0","0","0","0","0","0","0","1"],["1","1","5","1","6","3","1","1","1","0","1"],["4","1","0","0","0","1","21","1","0","4","1"],["21","1","5","1","5","0","1","1","0","1","1"],["0","1","1","5","1","4","1","1","0","21","1"],["1","3","1","3","0","0","0","1","21","0","1"],["1","5","1","0","0","21","0","0","0","0","0"],["1","1","0","3","1","0","0","0","0","0","21"],["1","0","0","0","21","0","0","0","0","0","0"],["0","0","0","21","0","0","0","0","1","4","1"],["0","0","21","0","0","0","0","0","1","4","1"],["1","0","21","1","0","0","0","0","4","1","0"],["1","1","1","0","1","3","1","5","4","1","1"],["1","6","1","0","0","21","1","1","6","1","1"],["1","0","1","3","21","0","1","4","0","0","1"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["78","78","78","0","0","0","78","78","78","78","78"],["77","77","0","0","77","77","77","77","0","77","77"],["0","86","0","86","0","86","0","86","86","86","0"],["92","92","92","92","0","0","0","0","0","92","0"],["91","91","0","0","0","0","0","0","0","0","91"],["64","64","64","64","64","64","64","64","64","0","64"],["83","83","0","0","0","83","0","83","0","83","83"],["0","73","73","73","73","0","73","73","0","73","73"],["0","73","73","73","73","73","73","73","0","0","73"],["73","73","73","73","0","0","0","73","0","0","73"],["72","72","72","0","0","0","0","0","0","0","0"],["71","71","0","71","71","0","0","0","0","0","0"],["63","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","62","62","62"],["0","0","0","0","0","0","0","0","61","61","61"],["60","0","0","60","0","0","0","0","60","60","0"],["42","42","42","0","42","42","42","42","42","42","42"],["53","53","53","0","0","0","53","53","53","53","53"],["58","0","58","58","0","0","58","58","0","0","58"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"]];
        this._pointCheckList = pointCheckData;
        cc.wwx.OutPut.log("ObjManager","onLoad",pointCheckData.length);

        // this._initGridByOBSrray(this.node.width,this.node.height)
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
                        this._createObjBlock(dataValueObj,dataValueLabel,k,haveShowRow)

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
    _createObjBlock:function(dataValueObj,dataValueLabel,column,haveShowRow)
    {
        let objsPrefab = null;
        let objsComponent = null;
        if(parseInt(dataValueObj) === 1)
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
            objsPrefab = this.objPlusPrefab;
            objsComponent = "ObjBlockPlus";


        }
        if(objsPrefab)
        {
            let objPrefab = cc.instantiate(objsPrefab);
            this.node.addChild(objPrefab);

            let posY = -1 * (84 + (this._showRowNum - haveShowRow - 1) * (this._objHeight + this._space) + this._objHeight / 2);
            let posX =  this._boundary + this._objWidth / 2 + column * (this._objWidth + this._space);
            let ObjBlockSquare = objPrefab.getComponent(objsComponent);
            ObjBlockSquare.initLabelNum(dataValueLabel);
            objPrefab.setPosition(cc.p(posX , posY));
        }
    },
    ballStopAction:function()
    {
        cc.wwx.OutPut.log("ObjManager","ballStopAction");

        cc.wwx.OutPut.log("ObjManager","_currentRowI: ",this._currentRowI);
        cc.wwx.OutPut.log("ObjManager","_currentRowJ: ",this._currentRowJ);

        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_MOVE_DROP,{space:this._space});
        return;
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

                        this._createObjBlock(dataValueObj,dataValueLabel,k,6);

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