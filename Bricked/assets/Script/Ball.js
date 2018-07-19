cc.Class({
    extends: cc.Component,

    properties: {

        _speed:0,
        _isStop:true,
        _index:0,

    },

    onLoad() {
        this._speed = 1000;
        this.body = this.getComponent(cc.RigidBody);//初始化速度linearVelocity = cc.v2(800,800)

        SML.Notify.listen(SML.Event.ACTION_BALL_START_LINEARVELOCITY, this._ballStartLinearVelocity, this);
        SML.Notify.listen(SML.Event.ACTION_BALL_STOP_LINEARVELOCITY, this._ballLStopinearVelocity, this);
    },
    _ballStartLinearVelocity:function(argument)
    {
        SML.Output.log('_ballStartLinearVelocity:', 'ball', JSON.stringify(argument));
        let linearVelocity = argument["linearVelocity"].clone();
        linearVelocity.mulSelf(this._speed);
        setTimeout(function () {
            this.body.linearVelocity = linearVelocity;
        }.bind(this), this._index * 50);

    },

    _ballLStopinearVelocity:function(argument)
    {
        SML.Output.log('_ballLStopinearVelocity:', 'ball', JSON.stringify(argument));
        this.body.linearVelocity = cc.v2(0,0);
    },
    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://上面
                break;
            case 2://地面
                console.log("碰撞地面");
                this.body.linearVelocity = cc.v2(0,0);
                break;
            case 3://左面
                break;
            case 4://右面
                break;
        }
    },

});