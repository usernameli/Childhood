
require('./BASE_ui');
SML.Core.BaseConnecting = cc.Class({
    extends: SML.Core.BaseUI,
    onLoad () {
        this.setSwallowTouches(this.node);
    },

    push () {
        SML.Core.Scene.pushWifiConnectingView(this.node);
    },

    pop () {
        SML.Core.Scene.popWifiConnectingView();
    },

    popAll () {
        SML.Core.Scene.popWifiConnectingView();
    }
})