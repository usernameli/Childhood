/**
 * 视图栈工具类, 用于管理视图的先入后出,是ViwStack的实现方法
 * Created by Aaron on 08/04/2018.
 * Copyright 20s13 sml Games. All Rights Reserved.
 */

SML.Core.StackUtil = {
    TAG : "SML.Core.StackUtil",

    push (container, stack, node, isRetain) {
        cc.assert(container && container instanceof cc.Node, "container不能为空！");
        cc.assert(stack && stack.constructor == Array, "stack不能为空！");
        cc.assert(node && node instanceof cc.Node, "node不能为空！");
        // 将堆栈中最后一个元素从显示列表中移除,但仍在堆栈中保留引用
        // SML.Output.log(this.TAG,"push start stack.length = ",stack.length);
        node.isRetain = isRetain;
        if (stack.length > 0) {
            let removed = stack[stack.length - 1];
            if (removed && removed instanceof cc.Node){
                if (removed == node){
                    return;
                } else {
                    // SML.Output.log(this.TAG," isRetain: " +removed.isRetain);
                    if (!removed.isRetain) {
                        removed.active = false;
                    } else {
                        var mask = removed.getChildByTag(9999);
                        if (mask) {
                            mask.stopAllActions();
                            mask.runAction(cc.fadeOut(1));
                        }; // 此行代码有奇效
                    }
                    // SML.Output.log(this.TAG,"push==========>added & current aren't the same!",node,removed);
                }
            }
        }
        let added = node;
        stack.push(added);
        added.parent = container;
        // SML.Output.log(this.TAG,"push end stack.length = ",stack.length);
    },

    pop: function (container, stack) {
        cc.assert(container && container instanceof cc.Node, "container不能为空！");
        cc.assert(stack && stack.constructor == Array, "stack不能为空！");
        if (stack.length > 0) {
            // 将堆栈中最后一个元素从从堆栈移除,从显示列表移除并释放
            let removed = stack.pop();
            if (removed && removed instanceof cc.Node) {
                removed.destroy();
            }
        }

        // 从堆栈取最后一个元素添加到显示列表
        if (stack.length > 0) {
            let added = stack[stack.length - 1];
            if (added && added instanceof cc.Node) {
                if (!added.isRetain){
                    added.active = true;
                } else {
                    var mask = added.getChildByTag(9999);
                    if (mask) {
                        mask.stopAllActions();
                        mask.opacity = 120;
                    } // 此行代码有奇效
                }
            }
        }
    },

    replace: function (container,stack,view,isRetain) {
        cc.assert(container && container instanceof cc.Node, "container不能为空！");
        cc.assert(stack && stack.constructor == Array, "stack不能为空！");
        cc.assert(view && view instanceof cc.Node, "view不能为空！");
        let removed = stack.pop();
        if (removed && removed instanceof cc.Node){
            removed.destroy();
        }
        view.isRetain = isRetain;
        stack.push(view);
        view.parent = container;
    },

    // 相同点：都返回栈顶的值。
    // 不同点：peek不改变栈的值(不删除栈顶的值)，pop会把栈顶的值删除。
    peek: function (stack) {
        cc.assert(stack && stack.constructor == Array, "stack不能为空！");
        if (stack.length > 0) {
            return stack[stack.length - 1];
        } else {
            return null;
        }
    },

    popAll: function (container, stack) {
        // SML.Output.warn("stack_util popAll",container.childrenCount,stack.length);
        cc.assert(container && container instanceof cc.Node, "container不能为空！");
        cc.assert(stack && stack.constructor == Array, "stack不能为空！");

        while (true) {
            if (stack.length == 0) return;
            let view = stack.pop();
            if (view && view instanceof cc.Node) {
                view.destroy();
            }
        }
    },

    popAllExceptFirst: function (container, stack) {
        cc.assert(container && container instanceof cc.Node, "container不能为空！");
        cc.assert(stack && stack.constructor == Array, "stack不能为空！");

        while (true) {
            if (stack.length <= 1) return;
            let view = stack.pop();
            if (view && view instanceof cc.Node) {
                view.destroy();
            }
        }
    },

    popAllExcept: function (container, stack, viewName) {
        cc.assert(container && container instanceof cc.Node, "container不能为空！");
        cc.assert(stack && stack.constructor == Array, "stack不能为空！");

        while (stack.length > 0) {
            var view = stack[stack.length-1];
            if (view.name != viewName) {
                stack.pop().destroy();
            }
        }

        while (stack.length > 0) {
            var view = stack[0];
            if (view.name != viewName) {
                stack.pop().destroy();
            }
        }

        if (stack.length > 1) {
            this.popAllExceptFirst(container, stack);
        }
    },

    getSize: function (stack) {
        return stack.length;
    },

    popToView:function(container, stack, viewName) {
        while (stack.length > 0) {
            var view = stack[stack.length-1];
            if (view.name == viewName) {
                return view;
            } else {
                stack.pop().destroy();
            }
        }
        return null;
    },

    findView:function(container, stack, viewName) {
        for (var i = 0; i < stack.length; i++) {
            var view = stack[i];
            if (view.name == viewName) {
                return true;
            }
        }
        return false;
    },
}

