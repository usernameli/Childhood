/**
 * Created by Aaron on 21/06/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 */

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad()
    {


    },

    onDestroy() {
        cc.wwx.NotificationCenter.ignoreScope(this);
    }

});