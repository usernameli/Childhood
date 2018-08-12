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
        tab3GiftNode:{
            default:null,
            type:cc.Node
        },
        tab1ProductNode:{
            default:null,
            type:cc.Node
        },
        tab2ProductNode:{
            default:null,
            type:cc.Node
        },
    },
    onLoad()
    {
        this._isAction = false;
        this._super();
        this.tab1CallBack();

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

        this.tab3GiftNode.active = false;
        this.tab1ProductNode.active = true;
        this.tab2ProductNode.active = false;
    },
    tab2CallBack()
    {
        this.tab1Select.active = false;
        this.tab2Select.active = true;
        this.tab3Select.active = false;

        this.tab3GiftNode.active = false;
        this.tab1ProductNode.active = false;
        this.tab2ProductNode.active = true;

    },
    tab3CallBack()
    {
        this.tab1Select.active = false;
        this.tab2Select.active = false;
        this.tab3Select.active = true;
        this.tab3GiftNode.active = true;
        this.tab1ProductNode.active = false;
        this.tab2ProductNode.active = false;

    },
    closeWindowCallBack()
    {
        this.closeWindow()

    }
});