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
        _belongUserID:0,

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
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);

    },
    _tableCallCallBack(argument)
    {
        if(argument["action"] === cc.wwx.EventType.MSG_PK_SHUT_BALL)
        {

            if(argument["actionUserId"] === this._belongUserID && argument["ballIndex"] === this._index)
            {
                this.node.position = cc.v2(argument["linearVelocity"]);
                cc.wwx.OutPut.log('_tableCallCallBack isOnWall: ', argument["isOnWall"]);
                cc.wwx.OutPut.log('_tableCallCallBack this.dottedLineManager.isFirstBallCome: ', this.dottedLineManager.isFirstBallCome);
                cc.wwx.OutPut.log('_tableCallCallBack this.dottedLineManager.ballOnWallNum: ', this.dottedLineManager.ballOnWallNum);
                cc.wwx.OutPut.log('_tableCallCallBack this.dottedLineManager.ballOtherMaxNum: ', this.dottedLineManager.ballOtherMaxNum);

                if(argument["isOnWall"])
                {

                    if(this.dottedLineManager.isFirstBallCome === false)
                    {

                        let posX = this.node.x;
                        this.dottedLineManager.isFirstBallCome = true;
                        this.dottedLineManager.centerOther = cc.v2(posX,cc.wwx.UserInfo.otherBallInfo.ballPosY);
                        this.dottedLineManager.ballOnWallNum = 1;

                    }
                    else
                    {
                        this.dottedLineManager.ballOnWallNum += 1;

                    }

                    if(this.dottedLineManager.ballOnWallNum === this.dottedLineManager.ballOtherMaxNum)
                    {
                        //最后一个球回到地面
                        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,
                            {center:this.dottedLineManager.centerOther,belongID:this._belongUserID});
                        this.dottedLineManager.setBallNumTextPositionOther(this.dottedLineManager.ballOnWallNum);

                    }
                }
            }

        }
    },

    setBelongTo(userID)
    {
        this._belongUserID = userID;

        if(this._belongUserID === cc.wwx.VS.OtherUserID)
        {
            //去掉物理属性
            this.body.active = false;
        }
    },
    getBelongTo()
    {
        return this._belongUserID;
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
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE,this._tableCallCallBack,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_BALL_START_LINEARVELOCITY, this._ballStartLinearVelocity, this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RECOVERY_BALL, this._ballRecoverNow, this);
    },
    _ballStartLinearVelocity:function(argument)
    {


        if(argument["ballUserId"] !== this._belongUserID)
        {
            return;

        }
        this._noShut = false;
        let linearVelocity = argument["linearVelocity"].clone();
        linearVelocity.mulSelf(this._speed);
        let self = this;
        this._recoverFg = false;

        setTimeout(function () {

            if(self._noShut)
            {
                return;
            }
            self.body.linearVelocity = linearVelocity;
            self.body.active = true;
            self._isOnWall = false;

            self._isSports = true;
            self.body.enabledContactListener = true;

            self.dottedLineManager.isBallSporting = true;


            if(self._index === 1)
            {
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_SPORTS);
                self.dottedLineManager.isFirstBallCome = false;
                self.dottedLineManager.ballOnWallNum = 0;
                self.dottedLineManager.ballNumText.active = false;


            }

        }, this._index * 50);

    },
    _ballRecoverNow()
    {

        this._noShut = true;
        this.body.active = false;


        if(this._recoverFg)
        {
            return;
        }

        cc.wwx.OutPut.log('_ballRecoverNow _recoverFg:', this._recoverFg);
        cc.wwx.OutPut.log('_ballRecoverNow _noShut:', this._noShut);

        if(this._isSports)
        {
            this.onBeginContact(null,null,{tag:2},true);
        }
        else
        {
            this._isSports = true;
            this.onBeginContact(null,null,{tag:2},true);
            this._isSports = false;

        }

    },
    onBeginContact(contact, self, other,artificial) {

        if(this.dottedLineManager.isBallSporting === false || this._isSports === false)
        {

            return;
        }

        let tag = other.tag;
        let caseNum = 2;

        switch (other.tag) {

            case caseNum://地面
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
                cc.wwx.OutPut.log("this.dottedLineManager.ballOnWallNum: " ,this.dottedLineManager.ballOnWallNum)
                cc.wwx.OutPut.log("this.dottedLineManager.ballMaxNum: " ,this.dottedLineManager.ballMaxNum)

                if(this.dottedLineManager.ballMaxNum === this.dottedLineManager.ballOnWallNum)
                {
                    //最后一个球回到地面
                    let self = this;
                    if(this.dottedLineManager._gameOver === false)
                    {
                        setTimeout(function () {
                            self.dottedLineManager.isBallSporting = false;

                        },500);
                    }

                    if(cc.wwx.UserInfo.playMode === "GameVS")
                    {
                        cc.wwx.TCPMSG.shutBallOnWall(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.center);
                        //同步牌桌状态
                        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_PK_SYNC_TABLE_CARD_STATUS);

                    }

                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_STOP_LINEARVELOCITY,
                        {center:this.dottedLineManager.center,belongID:this._belongUserID});
                    this.dottedLineManager.setBallNumTextPosition(this.dottedLineManager.ballOnWallNum);

                }
                break;
            case 1://上面
                break;
            case 3://左面
                break;
            case 4://右面
                break;
        }
    },
    update(dt)
    {

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

            if(cc.wwx.UserInfo.playMode === "GameVS")
            {
                cc.wwx.TCPMSG.shutBall(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.node.position,this._index,this._isOnWall);

            }

        }


        if(this._isOnWall)
        {
            this.body.active = false;
            this.body.enabledContactListener = false;
            if(this._recoverFg === false)
            {
                if(this._belongUserID === cc.wwx.UserInfo.userId)
                {
                    this.node.y = cc.wwx.UserInfo.ballInfo.ballPosY;
                    var moveTo = cc.moveTo(0.4, this.dottedLineManager.center);
                    this.node.runAction(moveTo);
                }
                else
                {
                    this.node.y = cc.wwx.UserInfo.otherBallInfo.ballPosY;
                    var moveTo = cc.moveTo(0.4, this.dottedLineManager.centerOther);
                    this.node.runAction(moveTo);
                }
                if(this._isSports)
                {
                    cc.wwx.TCPMSG.shutBall(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this.node.position,this._index,this._isOnWall);

                }


                this._recoverFg = true;
                this._isSports = false;
                this._isOnWall = false;
            }

        }
    }

});