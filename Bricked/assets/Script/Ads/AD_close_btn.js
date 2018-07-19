/**
 * Created by Aaron on 21/06/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 */

cc.Class({
    extends: cc.Component,

    properties: {
    },

    push () {
        SML.Core.Scene.pushAdView(this.node);
    },

    pop () {
        SML.Core.Scene.popAdView();
    },

    onClose : function() {
        SML.audioManager.playAudioButtonBack();
        // this.pop();
        SML.BannerAD.hide();
    },

    onDestroy() {
        SML.Notify.ignoreScope(this);
    }

});