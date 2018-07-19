/**
 * 【视图栈组件】
 * 可在creator绑定container，若没绑定，则当前脚本绑定的根节点作为容器
 * Created by Aaron on 03/04/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 */

SML.Core.StackComponent = cc.Class({
    extends: cc.Component,

    //切记！切记！切记！初始化复杂变量只定义不要在此处赋值，否则会导致不同实例的复杂变量指向全局同一个引用
    properties: {
        TAG: "SML.Core.StackComponent",
        container: {
            default: null,
            type: cc.Node,
        },

        size: {
            get() {
                return this._list.length;
            }
        }
    },

    onLoad () {
        // SML.Output.log(this.TAG,this.name,"onLoad");
        this._list = new Array();
        this.container = this.container || this.node;
    },

    start () {
        // SML.Output.log(this.TAG,this.name,"start");
    },

    /**
     * 将node压入栈，并retain住，以防被销毁，若和当前node重复，则不做操作
     */
    push (newNode,isRetain,cleanup) {
        cc.assert(newNode && newNode instanceof cc.Node, "node不能为空！");
        // 将堆栈中最后一个元素从显示列表中移除,但仍在堆栈中保留引用
        // SML.Output.log(this.TAG,this.name,"push node = "+newNode);
        if (newNode && newNode instanceof cc.Node) {
            let topNode = this._list[this._list.length - 1];
            if (topNode != newNode) {
                if (!topNode.isRetain) {
                    container.removeChild(topNode, cleanup == null || cleanup == undefined ? false : cleanup);
                }
            } else {
                return;
            }
        } else {
            SML.Output.warn(this.TAG,this.name,"newNode must not to be null!");
        }

        newNode.retain();
        this._list.push(newNode);
        this.container.addChild(newNode);
        // SML.Output.log(this.TAG,this.name,"push",container.name,this._list.length,newNode);
    },


    pop () {
        if (this._list.length > 0) {
            // 将堆栈中最后一个元素从从堆栈移除,从显示列表移除并释放
            let removed = this._list.pop();
            this.container.removeChild(removed,true);
            removed.release();
        }

        // 从堆栈取最后一个元素添加到显示列表
        if (this._list.length > 0) {
            let added = this._list[this._list.length - 1];
            if (!added.isRetain){
                this.container.addChild(added);
            }
            else {
                //不重新添加但手动执行一次onEnter()
                // added.onEnter();
            }
        }
    },

    replace (newNode) {
        cc.assert(newNode && newNode instanceof cc.Node, "node不能为空！");
        let removed = this._list[this._list.length - 1];
        if (removed == newNode) {
            return;
        } else {
            this.container.removeChild(removed);
            removed.release();
            this._list.pop();
        }

        newNode.retain();
        this._list.push(newNode);
        this.container.addChild(newNode);
    },


    // 相同点：都返回栈顶的值。
    // 不同点：peek不改变栈的值(不删除栈顶的值)，pop会把栈顶的值删除。
    peek () {
        cc.assert(this._list && this._list.length > 0, "stack不能为空！");
        if (this._list.length > 0) {
            return this._list[this._list.length - 1];
        } else {
            return null;
        }
    },

    popAll () {
        cc.assert(this._list && this._list.length > 0, "stack不能为空！");
        for (let i = this._list.length - 1; i > 0; i--) {
            let topNode = this._list[i];
            if (topNode && topNode instanceof cc.Node) {
                this.container.removeChild(topNode);
                this._list.pop();
                topNode.release();
            }
        }
    },

    popAllExceptFirst: function () {
        cc.assert(this._list && this._list.length > 0, "stack不能为空！");
        for (let i = this._list.length - 1; i > 1; i--) {
            let topNode = this._list[i];
            if (topNode && topNode instanceof cc.Node) {
                container.removeChild(topNode);
                this._list.pop();
                topNode.release();
            }
        }
    },

    popAllExcept: function (idx) {
        cc.assert(this._list && this._list.length > 0, "stack为空！");
        for (let i = stack.length - 1; i > idx + 1; i--) {
            let node = this._list[i];
            if (node && node instanceof cc.Node) {
                this.container.removeChild(node);
                this._list.pop();
            }
        }

        for (let i = 0; i < idx - 1; i++) {
            let node = this._list[i];
            if (node && node instanceof cc.Node) {
                this.container.removeChild(node);
                this._list.shift();
            }
        }
    },

    clear: function (cleanup) {
        cc.assert(this._list && this._list.length > 0, "stack为空！");
        this.container.removeAllChildren(cleanup);
        for (let i=this._list.length-1;i>0;i++){
            let node = this._list.shift();
            node.release();
        }
    },

    getSize: function () {
        return this._list.length;
    }

});