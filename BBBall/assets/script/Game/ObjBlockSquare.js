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
    randomElimination()
    {
        let randNum = Math.floor(Math.random() * this._labelNum+1);
        this._labelNum = randNum;
        this.labelText.string = this._labelNum.toString();

    },
    initLabelNum:function (num) {
        this._labelNum = parseInt(num);
        this.labelText.string = this._labelNum.toString();

    },
    objsBreak()
    {
        this.body.enabledContactListener = false;
        //生成粒子系统
        let particle = cc.instantiate(this.particlePrefab);
        // this.node.addChild(particle);
        particle.parent = this.node.parent;
        particle.setPosition(this.node.position);
        this.node.active = false;
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_OBJ_BREAK,{objPosition:this.node.position})
        this.node.destroy();
    },
    eliminateRowColumn()
    {
        this.onBeginContact();
    },
    onBeginContact(contact, self, other) {
        this.splashNode.active = true;

        if(this._labelNum > 1)
        {
            this._labelNum -= 1;
            this.labelText.string = this._labelNum.toString();

        }
        else
        {

            this.objsBreak();

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