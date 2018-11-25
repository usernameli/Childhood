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
    initLabelNum:function (num,number) {

        this._labelNum = parseInt(num);
        this._number = number;
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
        if (this._labelNum > 1)
        {
            this._labelNum -= 1;
            let randomColor = this.setRandomColor(this._labelNum);
            this.node.color = new cc.Color(randomColor.r,randomColor.g,randomColor.b);
            this.labelText.string = this._labelNum.toString();
        }
        else
        {
            this._labelNum -= 1;
            this.objsBreak();
        }

        if(cc.wwx.UserInfo.playMode === "GameVS" && cc.wwx.UserInfo.userId === this._belongUserID)
        {
            cc.wwx.TCPMSG.syncSquare(cc.wwx.VS.GameRoomID,cc.wwx.VS.TableID,this._labelNum,this._number);

        }
    },
    onLoad()
    {
        this._super();
        this._tag ="ObjBlockTriangle";
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_TABLE,this._tableCallBack,this);

    },
    onDestroy()
    {
        this._super();
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_TABLE,this._tableCallBack,this);

    },
    _tableCallBack(argument)
    {
        if(argument["action"] === cc.wwx.EventType.MSG_PK_SQUARE_NUM)
        {
            cc.wwx.OutPut.log("objBlockTriangle _number ",this._number);
            cc.wwx.OutPut.log("objBlockTriangle _belongUserID ",this._belongUserID);
            cc.wwx.OutPut.log("objBlockTriangle argument ",JSON.stringify(argument));

            if(argument["number"] === this._number && argument["actionUserId"] === this._belongUserID)
            {
                this.splashNode.active = true;
                cc.wwx.AudioManager.playBrick();
                this._labelNum = argument["squareNum"];
                if(this._labelNum > 0)
                {
                    let randomColor = this.setRandomColor(this._labelNum);
                    this.node.color = new cc.Color(randomColor.r,randomColor.g,randomColor.b);
                    this.labelText.string = this._labelNum.toString();
                }
                else
                {
                    this.objsBreak();
                }
            }
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