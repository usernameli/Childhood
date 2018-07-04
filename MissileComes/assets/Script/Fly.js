cc.Class({
    extends: cc.Component,
    properties: {
        leftBtn:{
            default:null,
            type:cc.Node
        },
        rightBtn:{
            default:null,
            type:cc.Node
        },
        vpNode:{
            default:null,
            type:cc.Node
        },
        _nowRotation:0,
        _actionUp:false,
        _funNow:false
    },
    onLoad ()
    {
        this._actionUp = false;
        this._funNow = false;
        this._nowRotation = 0;
        cc.director.GlobalEvent.on(-1,"set_pos_fly", this.setPosFly.bind(this));

        this.leftBtn.on(cc.Node.EventType.TOUCH_START, this._touchStartEventLeft, this);

        this.leftBtn.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEventLeft, this);

        // 触摸在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        this.leftBtn.on(cc.Node.EventType.TOUCH_END, this._touchEndEventLeft, this);
        this.leftBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEventLeft, this);


        this.rightBtn.on(cc.Node.EventType.TOUCH_START, this._touchStartEventRight, this);

        this.rightBtn.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEventRight, this);

        // 触摸在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        this.rightBtn.on(cc.Node.EventType.TOUCH_END, this._touchEndEventRight, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEventRight, this);

    },
    _touchStartEventLeft:function () {
        this.body.angularVelocity = 50;
    },
    _touchMoveEventLeft:function () {
    },
    _touchEndEventLeft:function () {
        this.body.angularVelocity = 0;
    },

    _touchStartEventRight:function () {
        this.body.angularVelocity = -50;
    },
    _touchMoveEventRight:function () {
    },
    _touchEndEventRight:function () {
        this.body.angularVelocity = 0;
    },

    setPosFly(argument) {
        console.log("argument: " + JSON.stringify(argument));
        if(this._funNow || argument["angle"] === parseInt(this.node.rotation) || argument["angle"] === this._nowRotation)
        {
            return;
        }
        this._funNow = true;
        this._nowRotation = argument["angle"];
        let oldRotation = this._getOldRation();
        console.log("set PosFlg oldRotation: " + oldRotation);
        // let v2Pos = cc.v2(argument["posX"],argument["posY"]);
        // let velocity =  v2Pos.normalize().mulSelf(200);
        // this.body.linearVelocity = velocity;

        let newQuadrant = this._quadrantChange(this._nowRotation);
        let oldQuadrant = this._quadrantChange(oldRotation);

        console.log("set PosFlg newQuadrant: " + newQuadrant);
        console.log("set PosFlg oldQuadrant: " + oldQuadrant);

        //在同一个象限
        if(this._judageSameQuadrant(newQuadrant,oldQuadrant))
        {
            //旋转方向
            this._direction = this._nowRotation - oldRotation;

        }
        else //在不同的象限
        {
            //相邻象限

            if(newQuadrant === 2)
            {
                if(oldQuadrant === 1 )
                {
                    this._direction = -1;
                }
                else if(oldQuadrant === 4)
                {
                    let angle1 = Math.abs(this._nowRotation) + Math.abs(oldRotation);
                    if(angle1 < 180)
                    {
                        this._direction = -1;
                    }
                    else
                    {
                        this._direction = 1;
                    }
                }
            }
            else if(newQuadrant === 3)
            {
                if(oldQuadrant === 1 )
                {
                    let angle1 = Math.abs(this._nowRotation) + Math.abs(oldRotation);
                    if(angle1 < 180)
                    {
                        this._direction = -1;
                    }
                    else
                    {
                        this._direction = 1;
                    }
                }
                else if(oldQuadrant === 4)
                {
                    this._direction = 1;
                }
            }
            else if(newQuadrant === 4)
            {
                if(oldQuadrant === 2 )
                {
                    let angle1 = Math.abs(this._nowRotation) + Math.abs(oldRotation);
                    if(angle1 < 180)
                    {
                        this._direction = 1;
                    }
                    else
                    {
                        this._direction = -1;
                    }
                }
                else if(oldQuadrant === 3)
                {
                    this._direction = -1;
                }
            }
            else
            {
                if(oldQuadrant === 3 )
                {
                    let angle1 = Math.abs(this._nowRotation) + Math.abs(oldRotation);
                    if(angle1 < 180)
                    {
                        this._direction = -1;
                    }
                    else
                    {
                        this._direction = 1;
                    }
                }
                else if(oldQuadrant === 2)
                {
                    this._direction = 1;
                }
            }


        }

        this.body.angularVelocity = 200 * this._direction / Math.abs(this._direction);
        this._actionUp = true;
        this._funNow = false;

    },

    //判断在哪个象限
    _quadrantChange:function (rotation)
    {
        let quadrant = 1;
        if(rotation >= 0)
        {
            if(rotation > 90)
            {
                quadrant = 4;
            }
            else
            {
                quadrant = 1;
            }
        }
        else
        {
            if(rotation > -90)
            {
                quadrant = 2;
            }
            else
            {
                quadrant = 3;
            }
        }

        return quadrant;
    },
    //判断是否是相同的象限
    _judageSameQuadrant:function (newQuadrant, oldQuadrant) {
        let same = false;
        if(newQuadrant === oldQuadrant)
        {
            same = true;
        }
        else
        {
            if((newQuadrant === 1 && oldQuadrant === 4) || (newQuadrant === 4 && oldQuadrant === 1))
            {
                same = true;
            }
            else if((newQuadrant  === 2 && oldQuadrant === 3) ||(newQuadrant  === 3 && oldQuadrant === 2))
            {
                same = true;
            }

        }
        return same;
    },
    _getOldRation:function () {
        let oldRotation = parseInt(this.node.rotation);
        console.log("_getOldRation: "+oldRotation);
        oldRotation = oldRotation % 360;
        if(oldRotation > 180 )
        {
            oldRotation = oldRotation - 360;
        }
        else if(oldRotation < -180)
        {
            oldRotation = oldRotation + 360;
        }
        return oldRotation;
    },
    start () {
        this.body = this.getComponent(cc.RigidBody);

    },
    update (dt) {



        let ratation = this.body.getWorldRotation;

        let newPos = this.vpNode.convertToWorldSpaceAR(this.vpNode.getPosition());
        let nowPos = this.body.getWorldPosition();
        let v2Vector = cc.v2(newPos.x - nowPos.x, newPos.y - nowPos.y);
        v2Vector.normalizeSelf();
        v2Vector.mulSelf(200);
        this.body.linearVelocity = v2Vector;


        if(this._actionUp)
        {
            let oldRotation = this._getOldRation();
            console.log("this._actionUp: " + this._actionUp);
            console.log("oldRotation: " + oldRotation % 350);
            console.log("this._nowRotation: " + this._nowRotation);
            console.log("this.body.angularVelocity: " + this.body.angularVelocity);

            if(Math.abs(this._nowRotation%360 - oldRotation%360) < 5)
            {
                this._actionUp = false;
                this.node.rotation = this._nowRotation;
                this.body.angularVelocity = 0;
            }
        }

    }
});