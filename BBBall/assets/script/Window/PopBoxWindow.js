var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        text:{
            default:null,
            type:cc.Label
        },
        _okCallBack:null,
    },
    onLoad()
    {
        this._super();
        this.text.string = this._params['text'];

        if(typeof this._params['okCallBack']  === 'function')
        {
            this._okCallBack = this._params['okCallBack'];
        }
    },
    okWindowCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        if(typeof  this._okCallBack === 'function')
        {
            this._okCallBack();

        }
        this.closeWindow();
    },
    closeWindowCallBack()
    {
        this.closeWindow();
    }
})