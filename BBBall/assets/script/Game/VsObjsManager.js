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
        roundTins:{
            default:null,
            type:cc.Prefab
        },
        selfObjNode:cc.Node,
        otherObjNode:cc.Node,
        _space: 4,//方块与方块边界
        _emptyGrid: [],
        _boundary: 12,//方块与边界的距离
        _showSelfRowNum: 0,//先显示7行
        _showOtherRowNum: 0,//先显示7行
        _showCocumn: 11,//11列
        _objWidth: 60,
        _objHeight: 60,
        _currentRowI: -1,//当前显示第几行了
        _currentRowJ: -1,
        _objBlockNumber:0,
    },
    onLoad()
    {
        this._showSelfRowNum = 1;

        this._objBlockNumber = this._showSelfRowNum * 100;
        if(cc.wwx.VS.RoundUserID  === cc.wwx.VS.OtherUserID)
        {
            this._createSelfOneRowObjs(cc.wwx.VS.OtherUserID);
            this._createSelfOneRowObjs(cc.wwx.UserInfo.userId);
        }
        else
        {
            this._createSelfOneRowObjs(cc.wwx.UserInfo.userId);
            this._createSelfOneRowObjs(cc.wwx.VS.OtherUserID);
        }


        this._showSelfRowNum += 1;
        this._objBlockNumber = this._showSelfRowNum * 100;

        //游戏结束协议
        // cc.wwx.TCPMSG.shutGameOver(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID);
        // this._createSelfOneRowObjs();

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_PK_SYNC_TABLE_CARD_STATUS,this._syncTableCardStatus,this);



    },
    _syncTableCardStatus()
    {

        let above = this.getObjBlockInfo(this.otherObjNode);
        let below = this.getObjBlockInfo(this.selfObjNode);
        cc.wwx.TCPMSG.syncCardTableStatus(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,
            {
                otherUserID:cc.wwx.VS.OtherUserID,
                otherSeatID:cc.wwx.VS.OtherSeatID,
                aboveArea:above,
                below:below
            });

    },
    getObjBlockInfo(objNode)
    {
        let list = [];
        for (var i = 0; i < objNode.childrenCount; ++i)
        {
            let node = objNode.children[i];
            var name = node.name;
            if (name === "Ball_Block_Square")
            {
                let scriptComponet = node.getComponent("ObjBlockSquare");
                let squareNumber = scriptComponet.getNumber();
                list.push({objBlock:"square",number:squareNumber,objPosition:node.position})
            }
            else if(name === "Ball_Block_Triangle_3" ||
                name === "Ball_Block_Triangle_5" ||
                name === "Ball_Block_Triangle_6" ||
                name === "Ball_Block_Triangle_4") {
                let scriptComponet = node.getComponent("ObjBlockTriangle");
                let triangleNumber = scriptComponet.getNumber();

                list.push({objBlock:"triangle",number:triangleNumber,objPosition:node.position})

            }
            else if( name === "Ball_Block_Plus")
            {
                let scriptComponet = node.getComponent("ObjBlockPlus");
                let plusNumber = scriptComponet.getNumber();

                list.push({objBlock:"plus",number:plusNumber,objPosition:node.position})
            }

        }

        return list;

    },

    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_PK_SYNC_TABLE_CARD_STATUS,this._syncTableCardStatus,this);

    },
    _tableCallCallBack(argument)
    {
        if(argument["action"] === cc.wwx.EventType.MSG_PK_NEW_BLOCK)
        {
            //弹球结束
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_MOVE_DROP,{space:4});

            cc.wwx.VS.RoundUserID = argument["nextUserId"];
            cc.wwx.VS.NewBlocks = argument["nextBlock"];
            let roundTips = cc.instantiate(this.roundTins);
            roundTips.parent = cc.director.getScene();
            let roundTipsComponent = roundTips.getComponent("RoundTints");
            roundTipsComponent.setShowNode(cc.wwx.VS.RoundUserID === cc.wwx.UserInfo.userId);

            if(cc.wwx.VS.RoundUserID !== cc.wwx.UserInfo.userId)
            {
                this._createSelfOneRowObjs(cc.wwx.UserInfo.userId);

            }
            else
            {
                this._createSelfOneRowObjs(cc.wwx.VS.OtherUserID);

            }

            this._showSelfRowNum += 1;
            this._objBlockNumber = this._showSelfRowNum * 100;


        }
    },

    _createSelfOneRowObjs(userID)
    {

        cc.wwx.OutPut.log("this._showSelfRowNum : ",this._showSelfRowNum);
        for (let k = 0; k < cc.wwx.VS.NewBlocks.length; k++)
        {
            let posY =  -1 * ((1 - 0 - 1) * (this._objHeight + this._space) + this._objHeight / 2);
            let posX =  this._boundary + this._objWidth / 2 + k * (this._objWidth + this._space);
            this._createObjBlock(cc.wwx.VS.NewBlocks[k], this._showSelfRowNum, k, 1, 0,posX,posY,userID);

        }

    },
    _createObjBlock:function(dataValueObj,dataValueLabel,column,showRowNum,haveShowRow,posX,posY,belongUserID)
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
            if(belongUserID !== cc.wwx.UserInfo.userId)
            {
                this.otherObjNode.addChild(objPrefab);

            }
            else
            {
                this.selfObjNode.addChild(objPrefab);

            }

            let ObjBlockSquare = objPrefab.getComponent(objsComponent);
            ObjBlockSquare.setBelong(belongUserID);
            this._objBlockNumber += 1;
            if(objsComponent === "ObjBlockPlus")
            {
                ObjBlockSquare.initLabelNum(parseInt(dataValueObj) - 20,this._objBlockNumber);

            }
            else if(objsComponent === "ObjBlockEliminate")
            {
                ObjBlockSquare.initLabelNum(parseInt(dataValueObj),this._objBlockNumber);
            }
            else
            {
                ObjBlockSquare.initLabelNum(dataValueLabel,this._objBlockNumber);

            }
            objPrefab.setPosition(cc.v2(parseInt(posX) , parseInt(posY)));
        }
    },
});