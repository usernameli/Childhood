/**
 * 弹窗包装器，统一处理弹窗类逻辑
 * 弹窗因为有动画是延迟显示，故需要屏蔽下面的视图操作和半透背景
 * Created by Aaron on 10/04/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 */

require("./BASE_ui");
SML.Core.BasePopup = cc.Class({
    extends: SML.Core.BaseUI,

    ctor () {
        /**
         * 销毁回调
         * @type {null}
         */
        this.destroyCallback = null;
    },

    push () {
        // SML.Output.log(this.name,"push");
        // 子类实现各自逻辑,因为此时还不知道具体push到哪个栈
    },

    pop () {
        // SML.Output.log(this.name,"pop");
        // 子类实现各自逻辑,因为此时还不知道具体push到哪个栈
    },

    popAll () {
        // SML.Output.log(this.name,"popAll");
        // 子类实现各自逻辑,因为此时还不知道具体push到哪个栈
    },


    setDestroyCallback (cb) {
        this.destroyCallback = cb;
    },

    onDestroy () {
        if (typeof this.destroyCallback == 'function') {
            this.destroyCallback();
        }
    },
});

