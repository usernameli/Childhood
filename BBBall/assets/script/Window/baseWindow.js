cc.Class({
    extends:cc.Component,
    properties:{

        _windowName:"unName",
        _isAction:true,
        _params:null,
        _uINode:null,
    },
    setWindowParams(params)
    {
        cc.wwx.OutPut.log("setWindowParams: " + JSON.stringify(params));
        this._params = params;
    },
    setWindowName(wName)
    {
        this._windowName = wName;
    },
    onLoad()
    {
        // 窗体节点
        this.windowsNode = this.node.getChildByName('UINode');
        this.maskNode = this.node.getChildByName('MaskNode');

        if(this.windowsNode)
        {
            this.windowsNode.scale = 0;
            this.windowsNode.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
        }

        if(cc.wwx.SystemInfo.SYS.phoneType === 1)
        {
            this.node.scale = 0.9;
        }

    },
    start()
    {


        this.maskNode.on(cc.Node.EventType.TOUCH_START, function(event) {
            event.stopPropagation();
        }, this);



    },

    closeWindow()
    {
        cc.wwx.AudioManager.playAudioButton();
        cc.wwx.PopWindowManager.remvoeWindowByName(this._windowName);
    },
    update()
    {

    }
})