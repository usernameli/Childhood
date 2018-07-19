/**
 * 全屏弹窗
 */

require('./BASE_popup');
SML.Core.BaseView = cc.Class({
    extends: SML.Core.BasePopup,
    onLoad () {
        this.setSwallowTouches(this.node);
    },

    push () {
        SML.Core.Scene.popAllWindows();
        SML.Core.Scene.pushView(this.node);
    },

    pop () {
        SML.Core.Scene.popView();
    },

    popAll () {
        SML.Core.Scene.popAllWindows();
        SML.Core.Scene.popAllViews();
    }
})