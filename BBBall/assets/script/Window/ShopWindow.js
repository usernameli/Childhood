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
        this._changeTabState(2);
        this.tab1.active = false;
        this.tab2.active = false;
        this.tab3.active = false;
        this.tab2Select.active = false;
        this.tab2ProductNode.position = cc.v2(0,0);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_CHANGE_TAB_SHOP,this._changeActionTab,this);
        // cc.wwx.PayModel.mExchangeList
    },
    _changeActionTab(argument)
    {
        let index = argument['index'];
        this._changeTabState(index);
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_CHANGE_TAB_SHOP,this._changeActionTab,this);

    },
    tab1CallBack()
    {
        this._changeTabState(1);
    },
    _changeTabState(index)
    {
        if(index === 1)
        {
            this.tab1Select.active = true;
            this.tab1ProductNode.active = true;
            this.tab1.active = false;

            this.tab2Select.active = false;
            this.tab2ProductNode.active = false;
            this.tab2.active = true;

            this.tab3Select.active = false;
            this.tab3GiftNode.active = false;
            this.tab3.active = true;
        }
        else if(index === 2)
        {
            this.tab1Select.active = false;
            this.tab1ProductNode.active = false;
            this.tab1.active = true;

            this.tab2Select.active = true;
            this.tab2ProductNode.active = true;
            this.tab2.active = false;

            this.tab3Select.active = false;
            this.tab3GiftNode.active = false;
            this.tab3.active = true;
        }
        else
        {
            this.tab1Select.active = false;
            this.tab1ProductNode.active = false;
            this.tab1.active = true;

            this.tab2Select.active = false;
            this.tab2ProductNode.active = false;
            this.tab2.active = true;

            this.tab3Select.active = true;
            this.tab3GiftNode.active = true;
            this.tab3.active = false;
        }
    },
    tab2CallBack()
    {
        cc.wwx.AudioManager.playAudioButton();

        this._changeTabState(2);

    },
    tab3CallBack()
    {
        cc.wwx.AudioManager.playAudioButton();

        this._changeTabState(3);

    },
    closeWindowCallBack()
    {
        this.closeWindow()

    }
});