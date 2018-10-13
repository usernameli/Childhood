var ObjBlock = require("ObjBlock");
cc.Class({
    extends: ObjBlock,
    properties: {
        plusOneSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        plusTwoSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        plusThreeSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        _plusNum:0,
        _isOnWall:false, //是否已经碰撞的地面
        _canMove:false,
        _centerPos:cc.v2(0,0)
    },
    onLoad()
    {
        this._super();
        this._plusNum = 0;
        this._centerPos = cc.v2(0,0);
        this._canMove = false;
        this._tag ="ObjBlockPlus";
        this._isOnWall = false;
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);


    },
    onDestroy()
    {
        this._super();
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,this.ballStopAction,this);

    },
    ballStopAction(argument)
    {
        if(this._isOnWall)
        {
            this._centerPos = argument["center"];
        }

    },
    initLabelNum(plusNum)
    {
        if(plusNum === 1)
        {
            //加一个球
            this._plusNum = plusNum;
            this.node.getComponent(cc.Sprite).spriteFrame = this.plusOneSpriteFrame;


        }
        else if(plusNum === 2)
        {
            //加两个球
            this._plusNum = plusNum;
            this.node.getComponent(cc.Sprite).spriteFrame = this.plusTwoSpriteFrame;


        }
        else if(plusNum === 3)
        {
            //加三个球
            this._plusNum = plusNum;
            this.node.getComponent(cc.Sprite).spriteFrame = this.plusThreeSpriteFrame;

        }
    },
    onBeginContact(contact, self, other)
    {

        if(cc.wwx.UserInfo.playMode === "GameVS")
        {
            if(other.tag === 2  || other.tag === 1)
            {
                this._isOnWall = true;
                // this.body.active = false;
                this.body.linearVelocity = cc.v2(0,0);


            }
            else if(other.tag === 0)
            {
                //碰的小球
                let componentBall = other.node.getComponent("Ball");
                let ballUserId = componentBall.getBelongTo();
                if(ballUserId === cc.wwx.UserInfo.userId)
                {
                    this.body.linearVelocity = cc.v2(0,-2000);

                }
                else
                {
                    this.body.linearVelocity = cc.v2(0,2000);

                }
                // this.body.gravityScale = 100.0;


            }
        }
        else
        {
            if(other.tag === 2)
            {
                this._isOnWall = true;
                // this.body.active = false;
                this.body.linearVelocity = cc.v2(0,0);


            }
            else if(other.tag === 0)
            {
                //碰的小球
                // this.body.gravityScale = 100.0;
                this.body.linearVelocity = cc.v2(0,-2000);


            }
        }

    },
    update()
    {

        if(this._isOnWall)
        {

            let parent = this.node.parent;
            this.node.position = cc.v2(this.node.x,(parent.height - this.node.height/2 - 1) * -1);

            this.body.active = false;
            this.body.enabledContactListener = false;//关闭碰撞

            if(this._centerPos.x !== 0 && this._centerPos.y !== 0)
            {
                this._centerPos = cc.v2(0,0);


                let moveTo = cc.moveTo(0.4, cc.v2(this._centerPos.x,(parent.height - this.node.height/2 - 1) * -1));
                let spawn = cc.spawn(moveTo, cc.scaleTo(0.4,0.001));
                let self = this;
                let seq = cc.sequence(spawn,cc.callFunc(function () {
                    //增加球球数量
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_ADD_BALLS,{plusNum: self._plusNum});
                    self.node.destroy();

                }));
                this.node.runAction(seq);
            }


        }
        else
        {
            this._super();
        }

    }

});