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
        cc.wwx.OutPut.log("ObjBlockTriangle","initLabelNum",num);

        this._labelNum = parseInt(num);
        this.labelText.string = this._labelNum.toString();

    },
    onLoad()
    {
        this._super();
        this._tag ="ObjBlockTriangle";

    }
});