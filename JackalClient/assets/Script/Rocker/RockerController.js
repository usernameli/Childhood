import JackalGlobal from "../Global";

cc.Class({
    extends: cc.Component,

    properties: {

        // },
    },

    onLoad () {


    },
    bulletGrenadeFire()
    {
        JackalGlobal.Event.emit("grenade-fire",{});

    },
    machineGunFire()
    {
        JackalGlobal.Event.emit("machineGun-fire",{});

    },
    start () {

    },

});