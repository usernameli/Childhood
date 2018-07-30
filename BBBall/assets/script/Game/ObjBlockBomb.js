var ObjBlock = require("ObjBlock");

cc.Class({
    extends: ObjBlock,

    properties: {
        labelText:{
            default:null,
            type:cc.Label
        },
        splashNode:{
            default:null,
            type:cc.Node
        },
        _labelNum:0,
    },
    initLabelNum:function (num) {
        cc.wwx.OutPut.log(this._tag,"initLabelNum",num);

        this._labelNum = parseInt(num);
        this.labelText.string = this._labelNum.toString();

    },
    onBeginContact(contact, self, other)
    {
        this.splashNode.active = true;

        if (this._labelNum > 1) {
            this._labelNum -= 1;
            this.labelText.string = this._labelNum.toString();

        }
        else
        {

        }
    },
    onLoad()
    {
        this._super();
        this._tag = "ObjBlockBomb";

    },
    update()
    {
        this._super();
        if(this.splashNode.active)
        {
            this.splashNode.active = false;
        }
    }
});