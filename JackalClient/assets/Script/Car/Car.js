import JackalGlobal from "../Global";

cc.Class({
    extends: cc.Component,

    properties: {
        carSprite: {
            default: null,
            type: cc.Node

        },
        bulletDownNode:{
            default:null,
            type: cc.Node
        },
        grenadePrefab:{
            default:null,
            type:cc.Prefab
        },
        machineGunPrefab:{
            default:null,
            type:cc.Prefab
        },
        _isDied:false,
        _layerObstacleBefore:null,
        _layerObstacleAfter:null,
        _currentTime:0,
        _moveAnimaUpdate:0,
        _movePoyH:0,
        _isMoveH:false,
        _isCollision:false,//是否产生碰撞
        _bgNoPos:false,
        _grenadeFireEnd:true,
        _machineFireEnd:true,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._grenadeFireEnd = true;
        this._machineFireEnd = true;
    },

    setBankPosition(argument)
    {
        let pos = argument.pos;
        let angle = parseInt(argument.angle);

        if(angle >0 && angle <= 90)
        {

            this.carSprite.setRotation(90-angle)
        }
        else if(angle > 90 && angle < 180)
        {

            this.carSprite.setRotation((angle - 90) * -1);

        }
        else
        {

            this.carSprite.setRotation(angle* -1 + 90);
        }
        if(this._isCollision)
        {
            return;
        }
        // console.log("set-pos: " +JSON.stringify(argument));

        let newPosX = pos.x + this.carSprite.getPositionX();
        let newPosY = pos.y+ this.carSprite.getPositionY();



        if(newPosY > this.carSprite.getPositionY())
        {

            var screenSize = cc.view.getVisibleSize();
            if(newPosY > screenSize.height/2 && this._bgNoPos === false)
            {
                JackalGlobal.Event.emit("bank-set-pos",{posX:newPosX,posY:pos.y});
                this.carSprite.setPositionX(newPosX);

            }
            else
            {
                this.carSprite.setPosition(cc.p(newPosX,newPosY));

            }

        }
        else
        {
            this.carSprite.setPosition(cc.p(newPosX,newPosY));

        }




    },
    machineGunFireNow(argument)
    {
        console.log("machineGunFireNow: " + this._machineFireEnd);
        if(this._machineFireEnd  === false)
        {
            console.log("machineGunFireNow 1: " + this._machineFireEnd);

            return;
        }
        this._machineFireEnd = false;
        let machineGun = cc.instantiate(this.machineGunPrefab);
        this.node.addChild(machineGun);
        machineGun.setPosition(cc.p(0,0));
        let action = cc.moveTo(0.2,0,80);
        var delay = cc.delayTime(0.2);
        let callBack1 = cc.callFunc(this.gunFireEnd1,this);
        let callBack2 = cc.callFunc(this.gunFireEnd2,this);
        machineGun.runAction(cc.sequence(action,callBack1,delay,callBack2));
    },
    gunFireEnd1(machineGun)
    {
        machineGun.opacity = 0;
    },
    gunFireEnd2(machineGun)
    {
        machineGun.destroy();
        this._machineFireEnd = true;
        // console.log("data: " +JSON.stringify(data[0]));
    },
    grenadeFireNow()
    {
        if(this._grenadeFireEnd  === false)
        {
            return;
        }
        this._grenadeFireEnd = false;
        let grenade = cc.instantiate(this.grenadePrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(grenade);
        grenade.setPosition(cc.p(0,0));
        // let MoveX = this.bulletDownNode.getPositionX();
        // let MoveX = this.bulletDownNode.getPositionX();
        let action = cc.moveTo(1,0,80);
        grenade.runAction(action);
    },
    bgNoSetPosition()
    {
        this._bgNoPos = true;
    },
    start () {

    },

    update (dt) {
        this._currentTime += dt;
        if(this._currentTime - this._moveAnimaUpdate > 0.08)
        {
            let PosX = this.node.getPositionX();
            let PosY = this.node.getPositionY();
            if(this._isMoveH)
            {
                this._movePoyH = this._movePoyH * -1;
                this._isMoveH = false;
            }
            else
            {
                this._movePoyH = PosY * 0.003;
                this._isMoveH = true;
            }

            this.node.setPosition(cc.p(PosX,PosY + this._movePoyH));
            this._moveAnimaUpdate = this._currentTime;

        }
    },
});
