
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {

    },

    start () {

    },
    showShopMenuCallBack:function () {
        cc.director.GlobalEvent.emit("shopMenu",{});
    },
    gameStartCallBack:function () {
        cc.director.loadScene("GameScene");
    },
    showSettingCallBack:function () {
        cc.director.GlobalEvent.emit("setting",{});
    },
    showAirWeaponCallBack:function () {
        cc.director.GlobalEvent.emit("airWeapon",{});
    },

    update (dt) {

    },
});
