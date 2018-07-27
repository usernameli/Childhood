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
        particlePrefab:{
            default:null,
            type:cc.Prefab
        },
        _labelNum:0,
    },
    onLoad()
    {
        this._super();
        this._tag ="ObjBlockSquare";
        this._labelNum = 0;
    },

    initLabelNum:function (num) {
        cc.wwx.OutPut.log(this._tag,"initLabelNum",num);

        this._labelNum = parseInt(num);
        this.labelText.string = this._labelNum.toString();

    },
    onBeginContact(contact, self, other) {
        if(this._labelNum > 1)
        {
            this._labelNum -= 1;
            this.labelText.string = this._labelNum.toString();
            this.splashNode.active = true;

        }
        else
        {
            this.body.enabledContactListener = false;
            cc.wwx.OutPut.log('onBeginContact:', 'ObjBlockSquare', JSON.stringify(this._labelNum));
            //生成粒子系统
            let particle = cc.instantiate(this.particlePrefab);
            // this.node.addChild(particle);
            particle.parent = this.node.parent;
            particle.setPosition(this.node.position);
            this.node.active = false;
            this.node.destroy();
        }



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