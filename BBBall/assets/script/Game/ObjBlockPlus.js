var ObjBlock = require("ObjBlock");
cc.Class({
    extends: ObjBlock,
    properties: {
        plusNum:0,
        _isOnWall:false, //是否已经碰撞的地面
    },
    onLoad()
    {
        this._super();
        this.plusNum = 0;
        this._tag ="ObjBlockPlus";
        this._isOnWall = false;

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
            this.body.gravityScale = 10.0;

        }
    },
    update()
    {
        if(this._isOnWall)
        {
            this.body.type = cc.RigidBodyType.Static;//改为静态刚体
            this.body.enabledContactListener = false;//关闭碰撞

        }
        else
        {
            this._super();
        }

    }

});