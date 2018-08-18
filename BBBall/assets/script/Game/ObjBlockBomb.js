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
        bomb:{
            default:null,
            type:cc.Node
        },

        _anim:null,
        _labelNum:0,
    },
    onLoad()
    {
        this._super();
        this._anim = this.getComponent(cc.Animation);
        this._tag = "ObjBlockBomb";

    },
    initLabelNum:function (num) {

        this._labelNum = parseInt(num);
        this.labelText.string = this._labelNum.toString();

    },
    objsBreak()
    {

    },
    objBombEndCallBack()
    {
        this.node.destroy();
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

            this._anim.play();
            cc.wwx.AudioManager.playBomb();

            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_BALL_OBJ_BOMB,{bomPosY:this.node.y});
            this.bomb.active = false;
        }
    },

    update()
    {
        this._super();
        if(this.splashNode.active)
        {
            this.splashNode.active = false;
        }
        if(this.bomb.active === false)
        {
            this.body.active = false;

        }
    }
});