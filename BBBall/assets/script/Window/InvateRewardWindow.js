var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{

    },
    onLoad()
    {
        this._super();
    },
    onDestroy()
    {

    },
    closeWindow()
    {
        cc.wwx.PopWindowManager.remvoeWindowByName("prefab/invate/Invate");
    }
});