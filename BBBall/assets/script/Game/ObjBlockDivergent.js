var ObjBlock = require("ObjBlock");

cc.Class({
    extends: ObjBlock,
    properties: {
        _offsetVertical:cc.v2(0,1),
        _offsetLeft:cc.v2(-1,1),
        _offsetRight:cc.v2(1,1),
        _isContactF:false,
    },
    onLoad()
    {
        this._super();
        this._offset = [this._offsetVertical,this._offsetLeft,this._offsetRight];

    },
    onBeginContact(contact, self, other) {
        let otherBody = other.body;
        let linear = other.body.linearVelocity;
        if(linear.y < 0)
        {
            return;
        }

        let offsetId = Math.floor(Math.random() * 3+1);
        let offset = this._offset[offsetId - 1];

        linear.normalizeSelf();

        linear.addSelf(offset);
        linear.normalizeSelf();

        linear.mulSelf(cc.wwx.UserInfo.ballInfo.speed);
        other.body.linearVelocity = linear;
        this._isContactF = true;

    },
    ballMoveDrop(argument)
    {
        this._super(argument);
        if(this._isContactF)
        {
            this.node.destroy();
        }
    }
});