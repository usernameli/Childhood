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
        _centerPos:cc.p(0,0)
    },
    onLoad()
    {
        this._super();
        this._plusNum = 0;
        this._centerPos = cc.p(0,0);
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
        cc.wwx.OutPut.log(this._tag, 'ballStopAction:', JSON.stringify(argument));
        this._centerPos = argument["center"];
        if(this._isOnWall)
        {
            this._canMove = true;

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
        cc.wwx.OutPut.log(this._tag, 'onBeginContact:', other.tag);

        if(other.tag === 2)
        {
            //碰的地面
            this._isOnWall = true;
            // this.body.type = cc.RigidBodyType.Static
            // this.body.gravityScale = 0.0;
        }
        else if(other.tag === 0)
        {
            //碰的小球
            this.body.gravityScale = 100.0;

        }
    },
    update()
    {
        if(this._isOnWall)
        {
            this.body.active = false;

            this.body.type = cc.RigidBodyType.Static;//改为静态刚体
            this.body.enabledContactListener = false;//关闭碰撞

            if(this._canMove)
            {
                this._canMove = false;

                let parent = this.node.parent;
                let moveTo = cc.moveTo(0.4, cc.p(this._centerPos.x,(parent.height - this.node.height/2) * -1));
                let spawn = cc.spawn(moveTo, cc.scaleTo(0.4,0.001));
                let self = this;
                let seq = cc.sequence(spawn,cc.callFunc(function () {
                    self.destroy();
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