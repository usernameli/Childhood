var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        text:{
            default:null,
            type:cc.Label
        }
    },
    onLoad()
    {
        this._super();
        this.text.string = this._params['text'];
    },
    okWindowCallBack()
    {

    },
    closeWindowCallBack()
    {
        this.closeWindow();
    }
})