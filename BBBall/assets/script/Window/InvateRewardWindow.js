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
    closeWindowCallBack()
    {
        this.closeWindow();

    }
});