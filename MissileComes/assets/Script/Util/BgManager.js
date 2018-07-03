
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
    },

    onLoad () {



        for(let i = 0; i < 4;i++)
        {
            this._createClouds(this.node);

        }


    },


    start () {

    },

    update (dt) {

        // let flyPos = this.Fly.getPosition();
        // console.log("flyPos: " + JSON.stringify(flyPos));
        // this.node.position = cc.p(flyPos.x * -1 ,flyPos.y * -1);
    },
});
