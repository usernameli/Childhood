
require('./BASE_ui');
SML.Core.BaseLoading = cc.Class({
    extends: SML.Core.BaseUI,
    onLoad () {
        this.setSwallowTouches(this.node);
    },

    push () {
        SML.Core.Scene.pushLoading(this.node);
    },

    pop () {
        SML.Core.Scene.popAllLoading();
    },

    popAll () {
        SML.Core.Scene.popAllLoading();
    }
})