/**
 * loading
 */

SML.ConnectManager = {
    isConnecting: false,
    preload(){
        cc.loader.loadRes('prefabs/connecting_wifi', cc.Prefab, function(completedCount, totalCount, item) {
            // SML.Output.log('preload | connecting_wifi progress:' + completedCount + '/' + totalCount);
        }, function(error, prefab) {
            // SML.Output.log('preload | connecting_wifi finished:' + SML.GlobalFuncs.obj2String1(error));
        })
    },
    showWifiView: function () {
        if (SML.ConnectManager.isConnecting) {
            return;
        }
        var baseScene = SML.Core.Scene.getScene();

        cc.loader.loadRes('prefabs/connecting_wifi', cc.Prefab, function(completedCount, totalCount, item) {
            // SML.Output.log('connecting_wifi progress:' + completedCount + '/' + totalCount);
        }, function(error, prefab) {
            // 场景已经切换，就不要再弹窗了
            if (baseScene != SML.Core.Scene.getScene()) {
                return;
            }
            if (SML.ConnectManager.isConnecting) {
                return;
            }
            // SML.Output.log('connecting_wifi:', SML.GlobalFuncs.obj2String1(error));
            if (!error) {
                var wifiView = cc.instantiate(prefab);
                var baseViewScript = wifiView.getComponent(SML.Core.BaseConnecting);
                if (!baseViewScript) {
                    baseViewScript = wifiView.addComponent(SML.Core.BaseConnecting);
                }
                wifiView.position = cc.p(0, 0);
                baseViewScript.push();
                SML.ConnectManager.isConnecting = true;
            } else {
                SML.Output.warn('加载失败：prefabs/connecting_wifi');
            }
        });
    },

    hideWifiView: function () {
        if (!SML.ConnectManager.isConnecting) {
            return;
        }
        SML.Core.Scene.popWifiConnectingView();
        SML.ConnectManager.isConnecting = false;
    }
}