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
    initLabelNum(num)
    {
        cc.wwx.OutPut.log(this._tag,"initLabelNum",num);
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
    },
    onBeginContact(contact, self, other) {
        cc.wwx.OutPut.log(this._tag,"onBeginContact");
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