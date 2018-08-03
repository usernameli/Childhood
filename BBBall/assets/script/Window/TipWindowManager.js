cc.Class({
    extends:cc.Component,
    statics:{
        proload () {
            cc.loader.loadRes('prefab/display/display_tips', function(err, prefab) {});
        },
        showMsg (msg, duration) {
            cc.loader.loadRes('prefab/display/display_tips', function(err, prefab) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }

                var node = cc.instantiate(prefab);
                var component = node.getComponent('Display_tips');
                component.show({content : msg, duration: duration || 3});


                var scene = cc.director.getScene();
                if (!scene) return null;
                var cv = scene.getChildByName('Canvas');
                cc.assert(cv && cv instanceof cc.Node, 'Please check scene has Canvas!');
                cv.addChild(node);

            });
        }
    }
});