cc.Class({
    extends:cc.Component,
    properties:{

        _windowName:"unName",
        _isAction:true,
        _params:null,
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

        // 初始化弹窗的统一半透背景，具有防止点击事件穿透，点击弹窗外任意区域关闭，自动布局等功能
        // 若不继承此类，就需要手动每个弹窗单加背景，点击事件和屏蔽touch
        // 是否点击窗体外关闭弹窗

        if(this._isAction && false)
        {
            let UINode = this.node.getChildByName('UINode');
            if(UINode)
            {
                UINode.scale = 0;
                UINode.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
            }


        }
        // this._maskNode.runAction(cc.fadeTo(0.8, 180));

    },
    start()
    {
        this.closeByTouchOutside = false;
        // 窗体节点
        this.windowsNode = this.node.getChildByName('BG');
        if (this.windowsNode) {
            this.closeByTouchOutside = true;
        }

        this.maskNode = new cc.Node();
        var maskSpr = this.maskNode.addComponent(cc.Sprite);
        maskSpr.spriteFrame = new cc.SpriteFrame();
        maskSpr.spriteFrame.setTexture(cc.url.raw("resources/images/nopack/Ball_SingleColor.png"));
        this.maskNode.color = cc.Color.BLACK;
        this.maskNode.opacity = 180;
        this.node.addChild(this.maskNode,-1);

        var widget = this.maskNode.addComponent(cc.Widget);
        widget.target = cc.director.getScene();
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.top = 0;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;
        let self = this;
        this.maskNode.on(cc.Node.EventType.TOUCH_START, function() {
            if(this.closeByTouchOutside)
            {
                self.closeWindow();
            }
        }, this);


        // 弹窗动画
        if (this.windowsNode) {
            // 窗体点击吞噬
            this.setSwallowTouches(this.windowsNode);
        }
    },
    setSwallowTouches (m_node) {
        m_node.on(cc.Node.EventType.TOUCH_START,function (event) {
            // ty.Output.log(m_node.name, 'swallow touch');
            event.stopPropagation();
        });
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