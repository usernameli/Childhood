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
        objTrianglePrefab:{
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

        // cc.wwx.MapCheckPoint.getMapCheckPointData(6);
        let pointCheckData = [["1","0","1","0","1","1","1","1","1","0","1"],["1","0","1","0","0","0","0","0","0","0","1"],["1","1","1","0","1","1","1","1","1","0","1"],["1","0","0","0","1","0","1","0","0","0","1"],["1","0","1","1","1","0","1","0","1","1","1"],["0","0","0","1","0","0","1","0","0","1","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["26","0","26","0","26","26","26","26","26","0","26"],["28","0","28","0","0","0","0","0","0","0","28"],["23","23","23","0","23","23","23","23","23","0","23"],["28","0","0","0","28","0","28","0","0","0","28"],["26","0","26","26","26","0","26","0","26","26","26"],["0","0","0","28","0","0","28","0","0","28","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0"]];
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

                        if(dataValueObj == 1)
                        {
                            let objPrefab = cc.instantiate(this.objSquarePrefab);
                            this.node.addChild(objPrefab);
                            let posY = -1 * (60 + (this._showRowNum - haveShowRow - 1) * (this._objHeight + this._space) + this._objHeight / 2);
                            let posX =  this._boundary + this._objWidth / 2 + k * (this._objWidth + this._space);
                            let ObjBlockSquare = objPrefab.getComponent('ObjBlockSquare');
                            ObjBlockSquare.initLabelNum(dataValueLabel);
                            objPrefab.setPosition(cc.p(posX , posY));

                        }

                    }
                }
                haveShowRow += 1;
                //_showRowNum行显示完了 退出循环
                if(haveShowRow === this._showRowNum)
                {
                    this._currentRowI = i;
                    this._currentRowJ = j;
                    break;
                }

            }

        }

    },
    ballStopAction:function()
    {
        cc.wwx.OutPut.log("ObjManager","ballStopAction");

        cc.wwx.OutPut.log("ObjManager","_currentRowI: ",this._currentRowI);
        cc.wwx.OutPut.log("ObjManager","_currentRowJ: ",this._currentRowJ);

        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_MOVE_DROP,{space:this._space});
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

                        if(dataValueObj == 1)
                        {
                            let objPrefab = cc.instantiate(this.objSquarePrefab);
                            this.node.addChild(objPrefab);
                            let posY = -1 * (60 + this._space + this._objHeight / 2);
                            let posX =  this._boundary + this._objWidth / 2 + k * (this._objWidth + this._space);
                            let ObjBlockSquare = objPrefab.getComponent('ObjBlockSquare');
                            ObjBlockSquare.initLabelNum(dataValueLabel);
                            objPrefab.setPosition(cc.p(posX , posY));
                        }
                    }
                    }
            }


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