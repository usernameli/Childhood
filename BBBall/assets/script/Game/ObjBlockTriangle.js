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
    initLabelNum:function (num) {

        this._labelNum = parseInt(num);
        this.labelText.string = this._labelNum.toString();

        let randomColor = this.setRandomColor(this._labelNum);
        this.node.color = new cc.Color(randomColor.r,randomColor.g,randomColor.b);

        // if(this._belongUserID !== cc.wwx.UserInfo.userId)
        // {
        //     this.labelText.node.scale = -1;
        // }
    },
    objsBreak()
    {
        this.body.enabledContactListener = false;
        //生成粒子系统
        let particle = cc.instantiate(this.particlePrefab);
        particle.parent = this.node.parent;
        particle.setPosition(this.node.position);
        this.node.active = false;
        this.node.destroy();
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_OBJ_BREAK,{objPosition:this.node.position})
    },
    randomElimination()
    {
        let randNum = Math.floor(Math.random() * this._labelNum+1);
        this._labelNum = randNum;
        this.labelText.string = this._labelNum.toString();
        let randomColor = this.setRandomColor(this._labelNum);
        this.node.color = new cc.Color(randomColor.r,randomColor.g,randomColor.b);

    },
    eliminateRowColumn()
    {
        this.onBeginContact();
    },
    onBeginContact(contact, self, other)
    {
        this.splashNode.active = true;
        cc.wwx.AudioManager.playBrick();

        if(cc.wwx.UserInfo.playMode === "GameVS")
        {
            let ballComponent = other.node.getComponent("Ball");
            if(this._belongUserID === ballComponent.getBelongTo())
            {
                if(this._labelNum > 1)
                {
                    this._labelNum -= 1;
                    this.labelText.string = this._labelNum.toString();

                }
                else
                {

                    this.objsBreak();

                }
            }

            return;
        }

        // cc.wwx.AudioManager.playBlockClick(this._labelNum % 10);

        let randomColor = this.setRandomColor(this._labelNum);
        this.node.color = new cc.Color(randomColor.r,randomColor.g,randomColor.b);


        if (this._labelNum > 1)
        {
            this._labelNum -= 1;
            this.labelText.string = this._labelNum.toString();

        }
        else
        {
            this.objsBreak();
        }
    },
    onLoad()
    {
        this._super();
        this._tag ="ObjBlockTriangle";

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