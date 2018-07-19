/**
 * 通用提示（）黑底白字
 */

SML.TipManager = {
    proload () {
        cc.loader.loadRes('prefabs/display/display_tips', function(err, prefab) {});
    },
    showMsg (msg, duration) {
        cc.loader.loadRes('prefabs/display/display_tips', function(err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            var node = cc.instantiate(prefab);
            var component = node.getComponent('display_tips');
            component.show({content : msg, duration: duration || 3});

            SML.Core.Scene.pushTip(node);
        });
    }
}
