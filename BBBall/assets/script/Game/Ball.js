cc.Class({
    extends: cc.Component,

    properties: {
        dottedLineManager: {
            default: null,
            serializable: false
        },
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
    _ballStartLinearVelocity:function(argument)
    {
        cc.wwx.OutPut.log('_ballStartLinearVelocity:', '_index: ' + this._index, JSON.stringify(argument));

        let linearVelocity = argument["linearVelocity"].clone();
        linearVelocity.mulSelf(this._speed);
        setTimeout(function () {
            if(this._noShut)
            {
                return;
            }
            this.body.linearVelocity = linearVelocity;
            this._recoverFg = false;
            this._isOnWall = false;
            this.body.active = true;
            this._isSports = true;
            this.body.enabledContactListener = true;
            if(this._index === 1)
            {
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_SPORTS);
                this.dottedLineManager.isBallSporting = true;
                this.dottedLineManager.isFirstBallCome = false;
                this.dottedLineManager.ballOnWallNum = 0;
                this.dottedLineManager.ballNumText.active = false;

            }

        }.bind(this), this._index * 50);

    },
    _ballRecoverNow()
    {

        if(this._isSports)
        {
            cc.wwx.OutPut.log(this._tag,"_ballRecoverNow",this.dottedLineManager.isBallSporting)

            this.body.active = false;
            let self = this;
            this._recoverFg = true;
            this._isSports = false;
            this.node.stopAllActions();
            this.node.runAction(cc.sequence(cc.moveTo(0.1,this.dottedLineManager.center),cc.callFunc(function () {
                self.onBeginContact(null,null,{tag:2},true);
            })));
        }
        else
        {
            this._noShut = true;
        }


    },
    onBeginContact(contact, self, other,artificial) {

        if(this.dottedLineManager.isBallSporting === false)
        {

            return;
        }
        switch (other.tag) {
            case 1://上面
                break;
            case 2://地面
                console.log("碰撞地面" + this._index);

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
                    this.dottedLineManager.center = cc.p(posX,118);

                }
                this._isOnWall = true;
                this.dottedLineManager.ballOnWallNum += 1;
                if(this.dottedLineManager.ballMaxNum === this.dottedLineManager.ballOnWallNum)
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


        if(this.dottedLineManager.isFirstBallCome && this._isOnWall)
        {
            this.body.enabledContactListener = false;

            if(this._recoverFg === false)
            {
                var moveTo = cc.moveTo(0.4, this.dottedLineManager.center);
                this.node.runAction(moveTo);
                this._recoverFg = true;
                this._isSports = false;
            }

        }
    }

});