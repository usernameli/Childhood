
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {},
    backMainMenuCallBack:function () {
        cc.director.GlobalEvent.emit("backMainMenu",{});

    },
    start () {

    },

    // update (dt) {},
});
