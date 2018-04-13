import JackalGlobal from "../Global";

cc.Class({
    extends: cc.Component,

    properties: {
        bGMap:{
            default:null,
            type:cc.Node
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        JackalGlobal.Event.on("bank-set-pos",this.setSelfPosition.bind(this));

    },

    start () {

    },
    setSelfPosition(argument)
    {
        let newPosX = argument.posX;
        let newPosY = argument.posY * -1 + this.node.getPositionY();
        var screenSize = cc.view.getVisibleSize();
        if(newPosY + screenSize.height/2 * -1 > -2880)
        {
            this.node.setPositionY(newPosY);

        }
        else
        {
            JackalGlobal.Event.emit("bg-no-pos",{});

        }

    },
    update (dt) {

    },
});
