/**
 *【视图栈node】
 * 用于脚本动态创建stack node
 * Created by Aaron on 04/04/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 */

require("./STACK_util");

SML.Core.StackNode = cc.Class({
    extends: cc.Node,

    properties: {
        TAG:'SML.Core.StackNode',
        size : {
            get () {
                return SML.Core.StackUtil.getSize(this._views);
            }
        }
    },

    ctor () {
        // SML.Output.log(this.TAG,"ctor");
        this.allRetain = false;
        this._views = [];
    },

    push (newNode,isRetain) {
        // SML.Output.log(this.TAG, "push",newNode,isRetain);
        SML.Core.StackUtil.push(this,this._views,newNode,isRetain || this.allRetain);
        newNode.stack = this;
    },

    pop() {
        // SML.Output.log(this.TAG, "pop");
        SML.Core.StackUtil.pop(this,this._views);
    },

    peek () {
        return SML.Core.StackUtil.peek(this._views);
    },

    replace (view) {
        SML.Core.StackUtil.replace(this,this._views,view);
    },

    popAll () {
        SML.Core.StackUtil.popAll(this,this._views);
    },

    popAllExceptFirst () {
        SML.Core.StackUtil.popAllExceptFirst(this,this._views);
    },

    popAllExcept (viewName) {
        SML.Core.StackUtil.popAllExcept(this,this._views,viewName);
    },

    getSize () {
        return SML.Core.StackUtil.getSize(this._views);
    },

    getCurrentView () {
        return this.peek();
    },

    popToView (viewName) {
        return SML.Core.StackUtil.popToView(this, this._views, viewName);
    },

    findView (viewName) {
        return SML.Core.StackUtil.findView(this, this._views, viewName);
    }
});