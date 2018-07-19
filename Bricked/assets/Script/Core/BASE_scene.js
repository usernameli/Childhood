/**
 * Created by Aaron on 03/04/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 */

SML.Core.BaseScene = cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        // SML.Output.log(this.node.parent.name, this.name, "onLoad");

        // 全屏窗口视图堆栈
        this._viewStack = new SML.Core.StackNode();
        this._viewStack.name = "viewStack";
        this.node.addChild(this._viewStack, 100);
        this.addFullWidget(this._viewStack);

        // 弹窗视图堆栈
        this._windowsStack = new SML.Core.StackNode();
        this._windowsStack.name = "windowsStack";
        this._windowsStack.allRetain = true;
        this.node.addChild(this._windowsStack, 200);
        this.addFullWidget(this._windowsStack);

        // loading
        this._loadingStack = new SML.Core.StackNode();
        this._loadingStack.name = "loadingStack";
        this.node.addChild(this._loadingStack, 300);
        this.addFullWidget(this._loadingStack);

        // wifi connecting
        this._wifiStack = new SML.Core.StackNode();
        this._wifiStack.name = "wifiStack";
        this.node.addChild(this._wifiStack, 400);
        this.addFullWidget(this._wifiStack);

        // ad
        this._adStack = new SML.Core.StackNode();
        this._adStack.name = "adStack";
        this.node.addChild(this._adStack, 500);
        this.addFullWidget(this._adStack);


        // tip
        this._tipNode = new cc.Node();
        this._tipNode.name = "tipNode";
        this.node.addChild(this._tipNode, 1000);
        this.addFullWidget(this._tipNode);
    },

    addFullWidget:function(node) {
        var widget = node.addComponent(cc.Widget);
        widget.isAlignTop = true;
        widget.top = 0;
        widget.isAlignBottom = true;
        widget.bottom = 0;
        widget.isAlignLeft = true;
        widget.left = 0;
        widget.isAlignRight = true;
        widget.right = 0;
        widget.alignOnce = true;
    },

    start () {
        // SML.Output.log(this.name,"start");
    },

    onDestroy () {
        // SML.Output.log(this.name,"onDestroy");

    },

    onEnable () {
        // SML.Output.log(this.name,"onEnable");
    },

    onDisable () {
        // SML.Output.log(this.name,"onDisable");
    },

    // 场景push全屏view
    pushView: function (view) {
        // SML.Output.log(this.name,"pushView",this._viewStack.size);
        this._viewStack.push(view);
    },

    // 场景pop全屏view
    popView: function () {
        this._viewStack.pop();
    },

    popAllViews: function () {
        this._viewStack.popAll();
    },

    pushWindows: function (windows) {
        this._windowsStack.push(windows);
    },

    popWindows: function () {
        this._windowsStack.pop();
    },

    popAllWindows: function () {
        this._windowsStack.popAll();
    },

    pushLoading:function (loadingView) {
        this._loadingStack.push(loadingView);
    },

    popLoading:function() {
        this._loadingStack.pop();
    },

    popAllLoading:function() {
        this._loadingStack.popAll();
    },

    pushTip:function(tipView) {
        tipView.parent = this._tipNode;
    },

    pushWifiConnectingView:function(wifiView) {
        this._wifiStack.push(wifiView);
    },

    popWifiConnectingView:function() {
        this._wifiStack.popAll();
    },

    pushAdView:function(adView) {
        this._adStack.push(adView);
    },

    popAdView:function() {
        this._adStack.popAll();
    },

    popToWindows:function(windowsName) {
        if (this._windowsStack.findView(windowsName)) {
            return this._windowsStack.popToView(windowsName);
        }
        return null;
    },

    popToView:function(viewName) {
        if (this._viewStack.findView(viewName)) {
            return this._viewStack.popToView(viewName);
        }
        return null;
    },

    popAllWindowsExcept (windowsName) {
        this._windowsStack.popAllExcept(windowsName);
    },

    popAllViewExcept (viewName) {
        this._viewStack.popAllExcept(viewName);
    },

    isRoot(){
        if (this._viewStack.getSize() > 0){
            return false;
        } else {
            return true;
        }
    },
});