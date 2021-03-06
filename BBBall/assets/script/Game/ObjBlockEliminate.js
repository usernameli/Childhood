var ObjBlock = require("ObjBlock");

cc.Class({
    extends: ObjBlock,
    properties: {
        eliminatepriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        _labelNum:0,
        _isContactF:false,

    },
    initLabelNum(num,number)
    {
        this._number = number;
        if(num === 8)
        {
            this.node.getComponent(cc.Sprite).spriteFrame = this.eliminatepriteFrame;
        }

        this._labelNum = num;
    },
    onLoad()
    {
        this._super();
        this._tag = "ObjBlockEliminate";
        this._isContactF = false;
        this._labelNum = 7;

    },
    onBeginContact(contact, self, other) {
        this._isContactF = true;

        if(this._labelNum === 8)
        {
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_ELIMINATE,{
                objPosition:this.node.position,
                belongUserID:this._belongUserID,
                direction:"vertical"});

        }
        else
        {
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_ELIMINATE,{
                objPosition:this.node.position,
                belongUserID:this._belongUserID,
                direction:"horizontal"});
        }
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