cc.Class({
    extends: cc.Component,

    properties: {
        wSpriteAvatar : cc.Sprite,
    },

    onLoad () {

    },

    reload : function(avatarUrl) {
        SML.Loader.loadImg(avatarUrl, this.wSpriteAvatar);
    },
});
