var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{

    },
    onLoad()
    {
        this._isAction = false;
        this._super();
    },
    closeWindowCallBack()
    {
        this.closeWindow();
    }
});