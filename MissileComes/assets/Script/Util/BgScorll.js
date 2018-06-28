
cc.Class({
    extends: cc.Component,

    properties: {
        Fly:{
            default:null,
            type:cc.Node
        }
    },

    onLoad () {

    },

    start () {

    },

    update (dt) {

        let flyPos = this.Fly.getPosition();
        console.log("flyPos: " + JSON.stringify(flyPos));
        this.node.position = cc.p(flyPos.x * -1 ,flyPos.y * -1);
    },
});
