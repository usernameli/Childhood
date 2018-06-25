
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {

    },

    start () {

    },
    backMainMenuCallBack:function () {
        cc.director.GlobalEvent.emit("backMainMenu",{});
    },



    // update (dt) {},
});
