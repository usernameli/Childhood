cc.Class({
    extends: cc.Component,

    properties: {
        dottedLineManager: {
            default: null,
            serializable: false
        },
        ballSpriteFrame:{
            default:[],
            type:cc.SpriteFrame
        },
        _ballId:0,
        _speed:0,
        _isStop:true,
        _index:0,
        _tag:"Ball",
        _recoverFg:false,
        _isOnWall:false,
        _isSports:false,
        _noShut:false,

    },

    onLoad() {
        this._speed = 1500;
        this._recoverFg = false;
        this._isOnWall = false;
        this._isSports = false;
        this._noShut = false;
        this.body = this.getComponent(cc.RigidBody);//初始化速度linearVelocity = cc.v2(800,800)
        cc.wwx.OutPut.log('onLoad:', 'ball');

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_START_LINEARVELOCITY, this._ballStartLinearVelocity, this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RECOVERY_BALL, this._ballRecoverNow, this);
    },
    setBallID(id)
    {
        this._ballId = id;
        if(id > 1021)
        {
            this.node.getComponent("cc.Sprite").spriteFrame = this.ballSpriteFrame[this._ballId - 1022];

        }
        else
        {
            this.node.getComponent("cc.Sprite").spriteFrame = this.ballSpriteFrame[this._ballId - 1016];

        }
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_START_LINEARVELOCITY, this._ballStartLinearVelocity, this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RECOVERY_BALL, this._ballRecoverNow, this);
    },
    _ballStartLinearVelocity:function(argument)
    {

        this._noShut = false;
        let linearVelocity = argument["linearVelocity"].clone();
        linearVelocity.mulSelf(this._speed);
        let self = this;
        setTimeout(function () {
            if(self._noShut)
            {
                self._isOnWall = true;
                self._recoverFg = false;
                return;
            }
            self.body.linearVelocity = linearVelocity;

            self._recoverFg = false;
            self._isOnWall = false;
            self.body.active = true;
            self._isSports = true;
            self.body.enabledContactListener = true;
            if(self._index === 1)
            {
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_SPORTS);
                self.dottedLineManager.isBallSporting = true;
                self.dottedLineManager.isFirstBallCome = false;
                self.dottedLineManager.ballOnWallNum = 0;
                self.dottedLineManager.ballNumText.active = false;

            }

        }, this._index * 50);

    },
    _ballRecoverNow()
    {

        if(this._isSports)
        {

            this.body.active = false;
            let self = this;
            this._recoverFg = true;
            this._isSports = false;
            this.node.stopAllActions();
            this.node.runAction(cc.sequence(cc.moveTo(0.1,this.dottedLineManager.center),cc.callFunc(function () {
                self.onBeginContact(null,null,{tag:2},true);

            })));
            this._noShut = false;
        }
        else
        {
            this._noShut = true;


        }


    },
    onBeginContact(contact, self, other,artificial) {



        if(this.dottedLineManager.isBallSporting === false || this._isSports === false)
        {

            return;
        }
        switch (other.tag) {
            case 1://上面
                break;
            case 2://地面


                if(this._isOnWall)
                {
                    return;
                }
                this._isOnWall = true;

                this.body.linearVelocity = cc.v2(0,0);

                if(this.dottedLineManager.isFirstBallCome === false)
                {
                    let posX = this.dottedLineManager.center.x;
                    if(artificial)
                    {
                        posX = this.dottedLineManager.center.x;
                    }
                    else
                    {
                        var worldManifold = contact.getWorldManifold();
                        var points = worldManifold.points;
                        posX =  Math.ceil(points[0].x);
                    }
                    this.dottedLineManager.isFirstBallCome = true;
                    this.dottedLineManager.center = cc.v2(posX,cc.wwx.UserInfo.ballInfo.ballPosY);

                }
                this.dottedLineManager.ballOnWallNum += 1;

                if(this.dottedLineManager.ballMaxNum == this.dottedLineManager.ballOnWallNum)
                {
                    //最后一个球回到地面
                    this.dottedLineManager.isBallSporting = false;
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,{center:this.dottedLineManager.center});

                }
                this.dottedLineManager.setBallNumTextPosition(this.dottedLineManager.ballOnWallNum);

                break;
            case 3://左面
                break;
            case 4://右面
                break;
        }
    },
    update(dt)
    {

        if(this._isOnWall)
        {

            this.body.active = false;

        }

        if(this._isSports)
        {
            let nowLinearLength = this.body.linearVelocity;
            //速度补偿
            if(nowLinearLength.mag() > 0 && this._speed !== parseInt(nowLinearLength.mag()))
            {
                nowLinearLength.normalizeSelf();
                nowLinearLength.mulSelf(this._speed);
                this.body.linearVelocity = nowLinearLength;
            }
        }

        if(this._noShut)
        {
            this._ballRecoverNow();
        }


        if(this._isOnWall)
        {
            this.body.enabledContactListener = false;

            if(this._recoverFg === false)
            {
                this.node.y = cc.wwx.UserInfo.ballInfo.ballPosY;
                var moveTo = cc.moveTo(0.4, this.dottedLineManager.center);
                this.node.runAction(moveTo);
                this._recoverFg = true;
                this._isSports = false;
                this._isOnWall = false;
            }

        }
    }

});