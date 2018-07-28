cc.Class({
    extends: cc.Component,

    properties: {
        wSpriteAvatar : cc.Sprite,
    },

    onLoad () {

    },

    reload : function(avatarUrl) {
        cc.wwx.Loader.loadImg(avatarUrl, this.wSpriteAvatar);
    },
});
