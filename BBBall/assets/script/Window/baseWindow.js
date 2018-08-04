cc.Class({
    extends:cc.Component,
    properties:{

        _windowName:"unName",
    },
    setWindowName(wName)
    {
        this._windowName = wName;
    },
    onLoad()
    {

        this._maskNode = new cc.Node();
        var maskSpr = this._maskNode.addComponent(cc.Sprite);
        maskSpr.spriteFrame = new cc.SpriteFrame();
        maskSpr.spriteFrame.setTexture(cc.url.raw("resources/nopack/Ball_SingleColor.png"));
        this._maskNode.color = cc.Color.BLACK;
        this._maskNode.opacity = 0;
        this.node.addChild(this._maskNode,-1,9999);

        var widget = this._maskNode.addComponent(cc.Widget);
        widget.target = cc.director.getScene();
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.top = 0;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;
        widget.isAlignOnce = false;
        let self = this;
        this._maskNode.on(cc.Node.EventType.TOUCH_START, function() {
            self.closeWindow();
        }, this);
        this.node.scale = 0;
        this.node.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
        this._maskNode.runAction(cc.fadeTo(0.8, 120));

    },
    closeWindow()
    {
        cc.wwx.PopWindowManager.remvoeWindowByName(this._windowName);
    },
    update()
    {

    }
})