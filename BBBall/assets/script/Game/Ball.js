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
        _recoverFg:false,
        _isOnWall:false,

    },

    onLoad() {
        this._speed = 1500;
        this._recoverFg = false;
        this._isOnWall = false;
        this.body = this.getComponent(cc.RigidBody);//初始化速度linearVelocity = cc.v2(800,800)
        cc.wwx.OutPut.log('onLoad:', 'ball');
        // this.body.enabledContactListener = false;

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_BALL_START_LINEARVELOCITY, this._ballStartLinearVelocity, this);
        // cc.wwx.NotificationCenter.listen(SML.Event.ACTION_BALL_STOP_LINEARVELOCITY, this._ballLStopinearVelocity, this);
    },
    _ballStartLinearVelocity:function(argument)
    {
        cc.wwx.OutPut.log('_ballStartLinearVelocity:', 'ball', JSON.stringify(argument));
        let linearVelocity = argument["linearVelocity"].clone();
        linearVelocity.mulSelf(this._speed);
        this.body.enabledContactListener = true;

        setTimeout(function () {
            this.body.linearVelocity = linearVelocity;
            this._recoverFg = false;
            this._isOnWall = false;
            if(this._index === 1)
            {
                // SML.Notify.trigger(SML.Event.ACTION_BALL_SPORTS,{});
                this.dottedLineManager.isBallSporting = true;
                this.dottedLineManager.isFirstBallCome = false;
                this.dottedLineManager.ballOnWallNum = 0;
            }

        }.bind(this), this._index * 50);

    },

    _ballLStopinearVelocity:function(argument)
    {
        cc.wwx.OutPut.log('_ballLStopinearVelocity:', 'ball', JSON.stringify(argument));
        this.body.linearVelocity = cc.v2(0,0);
    },
    onBeginContact(contact, self, other) {

        if(this.dottedLineManager.isBallSporting === false)
        {
            console.log("isBallSporting " + this._index);

            return;
        }
        switch (other.tag) {
            case 1://上面
                break;
            case 2://地面
                console.log("碰撞地面" + this._index);

                this.body.linearVelocity = cc.v2(0,0);
                this.dottedLineManager.ballOnWallNum += 1;
                if(this.dottedLineManager.ballMaxNum === this.dottedLineManager.ballOnWallNum)
                {
                    //最后一个球回到地面
                    this.dottedLineManager.isBallSporting = false;
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY);

                }

                if(this.dottedLineManager.isFirstBallCome === false)
                {
                    var worldManifold = contact.getWorldManifold();
                    var points = worldManifold.points;
                    // var normal = worldManifold.normal;
                    cc.wwx.OutPut.log('onBeginContact:', 'ball points', JSON.stringify(points[0]));
                    let posX = parseInt(points[0].x);
                    let posY = parseInt(points[0].y);
                    //
                    this.dottedLineManager.isFirstBallCome = true;
                    this.dottedLineManager.center = cc.p(posX,posY);
                }

                this._isOnWall = true;

                break;
            case 3://左面
                break;
            case 4://右面
                break;
        }
    },
    update(dt)
    {
        if(this.dottedLineManager.isFirstBallCome && this._isOnWall)
        {
            if(this._recoverFg === false)
            {
                var moveTo = cc.moveTo(0.4, this.dottedLineManager.center);
                this.node.runAction(moveTo);
                this._recoverFg = true;
            }

        }
    }

});