
cc.Class({
    extends: cc.Component,

    properties: {
        clouds0Prefab:{
            default:null,
            type:cc.Prefab

        },
        clouds1Prefab:{
            default:null,
            type:cc.Prefab

        },
        clouds2Prefab:{
            default:null,
            type:cc.Prefab

        },
        clouds3Prefab:{
            default:null,
            type:cc.Prefab

        },
        Fly:{
            default:null,
            type:cc.Node
        },
        _cloudList:null,
    },

    onLoad () {
        this._cloudList = [];

        for(let i = 0; i < 20;i++)
        {
            this._createFirstClounds();

        }


        var scheduler = cc.director.getScheduler();
        // scheduler.schedule(this._createLastClouds, this, 1, cc.macro.REPEAT_FOREVER);
    },
    _createFirstClounds()
    {
        this._createClouds(true)
    },
    _createLastClouds()
    {
        this._createClouds(false);
    },
    _createClouds(isFirst) {
        // if(this._cloudList.length > 12)
        // {
        //     return;
        // }
        console.log("isFirst: " + isFirst);
        let First = isFirst || false;
        let widthnew = cc.random0To1() * this.node.width;
        let heightnew  = cc.random0To1() * this.node.height;
        if(First)
        {

        }
        else
        {
            let showIndex = Math.floor(Math.random() * 2+1);
            let swing = 1;
            if(showIndex === 1)
            {
                swing = -1;
            }
            let flyPos = this.Fly.getPosition();
            widthnew =  flyPos.x + (this.node.width  + cc.random0To1() * this.node.width) * swing;
            heightnew  = flyPos.y + (cc.random0To1() * this.node.height + this.node.height) * swing;
        }

        console.log("widthnew: " + widthnew);
        console.log("heightnew: " + heightnew);
        let cloudsList = [this.clouds0Prefab,this.clouds1Prefab,this.clouds2Prefab,this.clouds3Prefab];
        let showIndex = Math.floor(Math.random() * 4+1);
        let newClouds = cc.instantiate(cloudsList[showIndex - 1]);
        newClouds.getComponent('Cloud').Fly = this.Fly;
        this.node.addChild(newClouds);
        newClouds.setPosition(cc.p(widthnew,heightnew));
        this._cloudList.push(newClouds);
    },
    start () {

    },

    update (dt) {

        // let reIndex = -1;
        // // console.log("this._cloudList : " + this._cloudList.length);
        //
        // for(let i = 0; i < this._cloudList.length;i++)
        // {
        //     let cloud = this._cloudList[i];
        //     if(cloud.getPositionX() < (-1 * this.node.width / 2)  ||
        //     cloud.getPositionY()  < (-1 * this.node.height / 2))
        //     {
        //         let component = cloud.getComponent("Cloud");
        //         component.onPicked();
        //         reIndex = i;
        //     }
        // }
        //
        // if(reIndex >= 0)
        // {
        //     this._cloudList.splice(reIndex,1);
        // }
        //
        // console.log("this._cloudList : " + this._cloudList.length);

    },
});
