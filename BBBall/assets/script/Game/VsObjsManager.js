cc.Class({
    extends:cc.Component,
    properties:{
        objBombPrefab: {
            default: null,
            type: cc.Prefab,
            displayName: "炸弹方块"
        },
        objDivergentPrefab: {
            default: null,
            type: cc.Prefab,
            displayName: "分散方块"
        },
        objTrianglePrefab3: {
            default: null,
            type: cc.Prefab,
            displayName: "三角形方块"
        },
        objTrianglePrefab4: {
            default: null,
            type: cc.Prefab,
            displayName: "三角形方块"
        },
        objTrianglePrefab5: {
            default: null,
            type: cc.Prefab,
            displayName: "三角形方块"
        },
        objTrianglePrefab6: {
            default: null,
            type: cc.Prefab,
            displayName: "三角形方块"
        },
        objSquarePrefab: {
            default: null,
            type: cc.Prefab,
            displayName: "方形方块"
        },
        objPlusPrefab: {
            default: null,
            type: cc.Prefab,
            displayName: "加球球形"
        },
        objEliminatePrefab: {
            default: null,
            type: cc.Prefab,
            displayName: "消除行或者列"

        },
        _space: 4,//方块与方块边界
        _emptyGrid: [],
        _boundary: 12,//方块与边界的距离
        _showRowNum: 0,//先显示7行
        _showCocumn: 11,//11列
        _objWidth: 60,
        _objHeight: 60,
        _currentRowI: -1,//当前显示第几行了
        _currentRowJ: -1,
    },
    onLoad()
    {
        this._showRowNum = 1;


        this._createOneRowObjs();
        this._createOneRowObjs1();


    },
    _createOneRowObjs1()
    {


        let addPusF = true;
        let objsList = [14,7,-1,-1, 5,-1,-1,5,-1,-1,5,-1, 15, -1,6,1, 2,-1, 17,-1,-1,1,-1,2,-1,17,-1,11,-1,11,3,4,-1,-1,-1,1,2,-1,-1,17,-1,11,-1,3,-1,4,-1,5,-1,6,-1,4,-1,5,6,-1];

        cc.wwx.OutPut.log("this._showRowNum : ",this._showRowNum);

        for (let k = 0; k < 11; k++)
        {
            let objsID = Math.floor(Math.random() * objsList.length + 1);

            objsID = Math.floor(Math.random() * objsList.length + 1);

            objsID = Math.floor(Math.random() * objsList.length + 1);



            if (objsList[objsID]) {

                let posY = ((1 - 0 - 1) * (this._objHeight + this._space) + this._objHeight / 2);
                let posX =  this._boundary + this._objWidth / 2 + k * (this._objWidth + this._space);

                if(objsList[objsID] === -1 && addPusF)
                {
                    addPusF = false;
                    this._createObjBlock(21, this._showRowNum, k, 1, 0,posX,posY);

                }
                else
                {
                    this._createObjBlock(objsList[objsID], this._showRowNum, k, 1, 0,posX,posY);

                }
            }


        }
        this._showRowNum += 1;

    },
    _createOneRowObjs()
    {


        let addPusF = true;
        let objsList = [14,7,-1,-1, 5,-1,-1,5,-1,-1,5,-1, 15, -1,6,1, 2,-1, 17,-1,-1,1,-1,2,-1,17,-1,11,-1,11,3,4,-1,-1,-1,1,2,-1,-1,17,-1,11,-1,3,-1,4,-1,5,-1,6,-1,4,-1,5,6,-1];

        cc.wwx.OutPut.log("this._showRowNum : ",this._showRowNum);

        for (let k = 0; k < 11; k++)
        {
            let objsID = Math.floor(Math.random() * objsList.length + 1);

            objsID = Math.floor(Math.random() * objsList.length + 1);

            objsID = Math.floor(Math.random() * objsList.length + 1);



            if (objsList[objsID]) {

                let posY =  -1 * ((1 - 0 - 1) * (this._objHeight + this._space) + this._objHeight / 2);
                let posX =  this._boundary + this._objWidth / 2 + k * (this._objWidth + this._space);

                if(objsList[objsID] === -1 && addPusF)
                {
                    addPusF = false;
                    this._createObjBlock(21, this._showRowNum, k, 1, 0,posX,posY);

                }
                else
                {
                    this._createObjBlock(objsList[objsID], this._showRowNum, k, 1, 0,posX,posY);

                }
            }


        }
        this._showRowNum += 1;

    },
    _createObjBlock:function(dataValueObj,dataValueLabel,column,showRowNum,haveShowRow,posX,posY)
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
            objPrefab.setPosition(cc.v2(parseInt(posX) , parseInt(posY)));
        }
    },
});