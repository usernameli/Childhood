
cc.Class({
    extends: cc.Component,

    properties: {
        Fly:{
            default:null,
            type:cc.Node
        },
        clouds0Prefab:{
            default:null,
            type:cc.Prefab

        },
        clouds1Prefab:{
            default:null,
            type:cc.Prefab

        },
        clouds2Prefab:{
            default:null,
            type:cc.Prefab

        },
        clouds3Prefab:{
            default:null,
            type:cc.Prefab

        },
        _couldsList:[],
    },

    onLoad () {
        this._couldsList = [];

        for(let k = 1; k < 10;k++)
        {
            let coulds = this.node.getChildByName("Coulds" + k);

            if(coulds)
            {
                for(let i = 0; i < 4;i++)
                {
                    this._createClouds(coulds);

                }
                this._couldsList.push(coulds);
            }
        }

    },
    _createClouds(parentNode) {
        let size = parentNode.getContentSize();
        let widthnew = cc.random0To1() * size.width * -1;
        let heightnew  = cc.random0To1() * size.height * -1;
        let cloudsList = [this.clouds0Prefab,this.clouds1Prefab,this.clouds2Prefab,this.clouds3Prefab];
        let showIndex = Math.floor(Math.random() * 4+1);
        let newClouds = cc.instantiate(cloudsList[showIndex - 1]);
        parentNode.addChild(newClouds);
        newClouds.setPosition(cc.p(widthnew,heightnew));
    },
    //查找在哪个云场景下面
    _checkInCouldsIndex:function()
    {
        let findIndex = -1;
        for(let k = 0; k < this._couldsList.length;k++)
        {

            let targetPos = this.Fly.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let pos1 = this._couldsList[k].convertToNodeSpaceAR(targetPos);
            if(Math.abs(pos1.x) < this.node.width / 2 && Math.abs(pos1.y) < this.node.height/2)
            {
                findIndex = k;
                break;
            }
        }
        // console.log("findIndex: " +findIndex);
        return findIndex;
    },

    _deformableMatrix:function(centerIndex)
    {
        let centerClouds = this._couldsList[centerIndex];
        let centerPos = centerClouds.getPosition();
        //cc.p(320,1704)
        let listPos = [
            {pos:cc.p(centerPos.x + this.node.width,centerPos.y),flg:false}, //右边
            {pos:cc.p(centerPos.x - this.node.width,centerPos.y),flg:false},//左边
            {pos:cc.p(centerPos.x,centerPos.y + this.node.height),flg:false},//上边
            {pos:cc.p(centerPos.x - this.node.width, centerPos.y + this.node.height),flg:false}, //左上

            {pos:cc.p(centerPos.x + this.node.width,centerPos.y + this.node.height),flg:false},//右上

            {pos:cc.p(centerPos.x,centerPos.y - this.node.height),flg:false},//下
            {pos:cc.p(centerPos.x - this.node.width,centerPos.y - this.node.height),flg:false},//左下
            {pos:cc.p(centerPos.x + this.node.width, centerPos.y - this.node.height),flg:false} //右下
            ];
        let noFindIndex = [];
        // for(let i = 0;i < this._couldsList.length;i++)
        // {
        //     console.log("this._cloudList 1 : "+JSON.stringify(this._couldsList[i].getPosition()));
        //
        // }
        for(let k = 0; k < this._couldsList.length;k++)
        {
            if(centerIndex !== k)
            {
                let find = false;
                let coulds = this._couldsList[k];
                let cPos = coulds.getPosition();
                for(let i = 0; i < listPos.length;i++)
                {
                    if(listPos[i]["flg"] === false &&
                        cPos.x === listPos[i]["pos"].x &&
                        cPos.y === listPos[i]["pos"].y)
                    {
                        find = true;
                        listPos[i]["flg"] = true;
                        break;
                    }
                }
                //没有找到
                if(find === false)
                {
                    noFindIndex.push(k);
                }
            }
        }
        // console.log("noFindIndex: "+JSON.stringify(noFindIndex));
        // console.log("listPos: "+JSON.stringify(listPos));
        // for(let i = 0;i < this._couldsList.length;i++)
        // {
        //     console.log("this._cloudList 2 : "+JSON.stringify(this._couldsList[i].getPosition()));
        //
        // }

        if(noFindIndex.length > 0)
        {
            for(let j = 0;j < noFindIndex.length;j++)
            {
                let clouds = this._couldsList[noFindIndex[j]];
                for(let i = 0; i < listPos.length;i++)
                {
                    if(listPos[i]["flg"] === false)
                    {
                        clouds.setPosition(listPos[i]["pos"]);
                        listPos[i]["flg"] = true;
                    }
                }

            }
        }
        // for(let i = 0;i < this._couldsList.length;i++)
        // {
        //     console.log("this._cloudList 3 : "+JSON.stringify(this._couldsList[i].getPosition()));
        //
        // }

    },
    start () {


    },


    update (dt) {

        let findIndex = this._checkInCouldsIndex();
        if(findIndex > -1)
        {
            this._deformableMatrix(findIndex);
        }

    },
});
