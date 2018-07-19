/**
 * 所有非全屏弹窗的基类
 * Created by Aaron on 03/04/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 *
 * EXAMPLES
 * 脚本从resources动态加载prefab
 * cc.loader.loadRes("authorityTip", function (err, prefab) {
        var tip = cc.instantiate(prefab);
        this.pushWindows(tip);
        // tip.getComponent("authority_dialog").push();
    });
 *
 */

require("./BASE_popup");

SML.Core.BaseWindows = cc.Class({
    extends: SML.Core.BasePopup,

    properties: {
        // 设置窗体半透背景是否可见，默认可见
        maskVisible: {
            default: true,
            visible: true,
        },

        _offset: cc.p(0,0)
    },

    onLoad () {
        // 初始化弹窗的统一半透背景，具有防止点击事件穿透，点击弹窗外任意区域关闭，自动布局等功能
        // 若不继承此类，就需要手动每个弹窗单加背景，点击事件和屏蔽touch
        // SML.Output.log(this.name, "BaseWindows onLoad");

        // 是否点击窗体外关闭弹窗
        this.closeByTouchOutside = false;
        // 窗体节点
        this.windowsNode = this.node.getChildByName('windowsNode');
        if (this.windowsNode) {
            this.closeByTouchOutside = true;
        }

        // 半透黑色背景
        this._maskNode = new cc.Node();
        var maskSpr = this._maskNode.addComponent(cc.Sprite);
        maskSpr.spriteFrame = new cc.SpriteFrame();
        maskSpr.spriteFrame.setTexture(cc.url.raw("resources/images/single_color.png"));
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

        // 背景点击事件
        this.onTouchUp(this._maskNode,function(event){
            if (this.closeByTouchOutside){
                // SML.Output.log(this.name, "mask touched");
                SML.audioManager.playAudioButtonBack();
                this.pop();
            }
        }.bind(this),{isScale:false,hasAudio:true});

        // 弹窗动画
        if (this.windowsNode) {
            // 窗体点击吞噬
            this.setSwallowTouches(this.windowsNode);
            // 窗口弹出动画
            this.windowsNode.scale = 0;
            this.windowsNode.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
        }
        this.maskVisible && this._maskNode.runAction(cc.fadeTo(0.8, 120));
    },

    start () {
        // SML.Output.log(this.name, "BaseWindows start:" + this._maskNode.width + ' ' + this._maskNode.height);
    },

    push () {
        SML.Core.Scene.pushWindows(this.node);
    },

    pop () {
        SML.Core.Scene.popWindows();
    },

    popAll () {
        SML.Core.Scene.popAllWindows();
    }
});