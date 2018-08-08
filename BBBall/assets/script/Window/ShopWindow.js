var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        tab1:{
            default:null,
            type:cc.Node,
        },
        tab2:{
            default:null,
            type:cc.Node,
        },
        tab3:{
            default:null,
            type:cc.Node,
        },
        tab1Select:{
            default:null,
            type:cc.Node,
        },
        tab2Select:{
            default:null,
            type:cc.Node,
        },
        tab3Select:{
            default:null,
            type:cc.Node,
        },
    },
    onLoad()
    {
        this._isAction = false;
        this._super();
        this.tab1Select.active = false;
        this.tab2Select.active = false;
        this.tab3Select.active = false;

        // cc.wwx.PayModel.mExchangeList
    },
    onDestroy()
    {

    },
    tab1CallBack()
    {
        this.tab1Select.active = true;
        this.tab2Select.active = false;
        this.tab3Select.active = false;
    },
    tab2CallBack()
    {
        this.tab1Select.active = false;
        this.tab2Select.active = true;
        this.tab3Select.active = false;

    },
    tab3CallBack()
    {
        this.tab1Select.active = false;
        this.tab2Select.active = false;
        this.tab3Select.active = true;

    },
    closeWindowCallBack()
    {
        this.closeWindow()

    }
});