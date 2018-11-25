cc.Class({
    extends:cc.Component,
    properties:{
        ballPrefab:{
            default:[],
            type:cc.Prefab
        },
        ballNumTextOther:{
            default:null,
            type:cc.Node
        },
        _pk_update_coordinate:false,
        _touchPos:cc.v2(0,0),
        isFirstBallCome:false,//第一个球回到地面
        ballOnWallNum:0, //回到地面的球的数量

    },
    onLoad()
    {
        this._ctx = this.getComponent(cc.Graphics);
        this._ballList = [];
        this.isFirstBallCome = false;

        // this.ballOtherMaxNum  = cc.wwx.UserInfo.otherBallInfo.ballNum;
        this.ballOtherMaxNum  = 1;
        this.ballOnWallNum = 0;
        this._userOtherBallId =  cc.wwx.UserInfo.otherBallInfo.ballId;
        if(this._userOtherBallId <= 1021)
        {
            this._useOtherPrefabBall = this.ballPrefab[0];
            cc.wwx.UserInfo.otherBallInfo.ballPosY = 10

        }
        else
        {
            this._useOtherPrefabBall = this.ballPrefab[1];
            cc.wwx.UserInfo.otherBallInfo.ballPosY = 16

        }
        this.centerOther = cc.v2(this.node.width/ 2, cc.wwx.UserInfo.otherBallInfo.ballPosY);

        this._createBallOther(this.ballOtherMaxNum,0);

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);

    },

    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);

    },

    _tableCallCallBack(argument)
    {
        if(argument["action"] === cc.wwx.EventType.MSG_PK_UPDATE_COORDINATE)
        {
            if(cc.wwx.UserInfo.userId === argument["posUserId"])
            {
                return;
            }
            let startPos = argument["startPos"];
            let endPos = argument["endPos"];
            if(endPos.x === 0 && endPos.y === 0)
            {
                this._ctx.clear();

            }
            else
            {
                this._drawDottleLineOther(cc.v2(startPos),cc.v2(endPos));

            }


        }


    },

    _createBallOther:function(ballNum,index)
    {

        for(let i = 0; i < ballNum;i++)
        {
            let ballPrefab = cc.instantiate(this._useOtherPrefabBall);
            this.node.addChild(ballPrefab);
            let component = ballPrefab.getComponent('Ball');
            component._index = index + i + 1;
            ballPrefab.setPosition(this.centerOther);
            ballPrefab.getComponent('Ball').dottedLineManager = this;
            ballPrefab.getComponent('Ball').setBallID(this._userOtherBallId);
            ballPrefab.getComponent('Ball').setBelongTo(cc.wwx.VS.OtherUserID);

            this._ballList.push(ballPrefab);
        }
        this.setBallNumTextPositionOther(this.ballOtherMaxNum);


    },
    setBallNumTextPositionOther(ballNum)
    {
        this.ballNumTextOther.setPosition(this.centerOther.x ,this.centerOther.y + 20);
        this.ballNumTextOther.active = true;
        var ballNumlabel = this.ballNumTextOther.getComponent("cc.Label");
        ballNumlabel.string =  "x" + ballNum;

    },
    _drawDottleLineOther: function (center,touchP) {
        cc.wwx.OutPut.log("_drawDottleLineOther center: ",JSON.stringify(center));
        cc.wwx.OutPut.log("_drawDottleLineOther touchP: ",JSON.stringify(touchP));
        this._ctx.clear();
        let touchPoint = cc.v2(touchP);

        touchPoint.subSelf(center);
        let p1 = center;
        touchPoint.mulSelf(100);

        cc.wwx.Util.rayCast2(this._ctx,this.node, p1, touchPoint);
    },


})