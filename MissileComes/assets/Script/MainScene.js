var ShopJson = require('./Global/ShopJson');
cc.Class({
    extends: cc.Component,

    properties: {

        _tag:"MainScene",
        _MainMenu:null,
        _ShopMenu:null,
        _AirWeaponNode:null,
        _SettingNode:null,
    },


    onLoad () {
        cc.fy = {};
        var AudioMgr = require("./Util/Audio");
        cc.fy.audioMgr = new AudioMgr();
        cc.fy.audioMgr.init();
        cc.fy.audioMgr.playBGM("Airplane.wav");
        this._MainMenu = this.node.getChildByName("MainMenu");
        this._ShopMenu = this.node.getChildByName("ShopMenu");
        this._AirWeaponNode = this.node.getChildByName("AirWeaponNode");
        this._SettingNode = this.node.getChildByName("SettingNode");

        this._MainMenu.active = true;
        this._ShopMenu.active = false;
        this._AirWeaponNode.active = false;
        this._SettingNode.active = false;

        cc.director.GlobalEvent.on(-1,"shopMenu", this.showShopMenu.bind(this));
        cc.director.GlobalEvent.on(-1,"backMainMenu", this.backMainMenu.bind(this));
        cc.director.GlobalEvent.on(-1,"airWeapon", this.showAirWeapon.bind(this));
        cc.director.GlobalEvent.on(-1,"setting", this.showSetting.bind(this));

    },
    backMainMenu:function () {
        this._MainMenu.active = true;
        this._ShopMenu.active = false;
        this._AirWeaponNode.active = false;
        this._SettingNode.active = false;
    },
    showShopMenu:function () {
        this._MainMenu.active = false;
        this._ShopMenu.active = true;
        this._AirWeaponNode.active = false;
        this._SettingNode.active = false;
    },
    showAirWeapon:function () {
        this._MainMenu.active = false;
        this._ShopMenu.active = false;
        this._AirWeaponNode.active = true;
        this._SettingNode.active = false;
    },
    showSetting:function () {
        console.log("show setting "+ this._tag);
        this._MainMenu.active = false;
        this._ShopMenu.active = false;
        this._AirWeaponNode.active = false;
        this._SettingNode.active = true;
    },
    start () {

    },

    // update (dt) {},
});
