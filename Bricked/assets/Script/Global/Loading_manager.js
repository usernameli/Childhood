/**
 * loading
 */

SML.LoadingManager = {
    isLoading: false,
    loadPrefab: null,
    /**
     * 提前预加载loading prefab
     */
    preload () {
        cc.loader.loadRes('prefabs/windows_loading', cc.Prefab, function(completedCount, totalCount, item) {
            // SML.Output.log('preload | LoadingManager progress:' + completedCount + '/' + totalCount);
        }, function(error, prefab) {
            SML.LoadingManager.loadPrefab = prefab;
            // SML.Output.log('preload | LoadingManager finished:' + SML.GlobalFuncs.obj2String1(error));
        });
    },

    showLoading: function () {
        if (SML.LoadingManager.isLoading) {
            return;
        }
        if (SML.LoadingManager.loadPrefab) {
            var loadingView = cc.instantiate(SML.LoadingManager.loadPrefab);
            if (loadingView && typeof loadingView.getComponent == 'function') {
                var baseViewScript = loadingView.getComponent(SML.Core.BaseLoading);
                if (!baseViewScript) {
                    baseViewScript = loadingView.addComponent(SML.Core.BaseLoading);
                }
                loadingView.position = cc.p(0, 0);
                baseViewScript.push();
                SML.LoadingManager.isLoading = true;
                // 设置倒计时干点loading界面
                baseViewScript.scheduleOnce(function(){
                    SML.LoadingManager.hideLoading();
                }, 5);
                return;
            }
        }

        var baseScene = SML.Core.Scene.getScene();
        cc.loader.loadRes('prefabs/windows_loading', cc.Prefab, function(completedCount, totalCount, item) {
            // SML.Output.log('LoadingManager progress:' + completedCount + '/' + totalCount);
        }, function(error, prefab) {
            SML.LoadingManager.loadPrefab = prefab;
            // 场景已经切换，就不要再弹窗了
            if (baseScene != SML.Core.Scene.getScene()) {
                return;
            }
            if (!error) {
                var loadingView = cc.instantiate(prefab);
                if (loadingView) {
                    var baseViewScript = loadingView.getComponent(SML.Core.BaseLoading);
                    if (!baseViewScript) {
                        baseViewScript = loadingView.addComponent(SML.Core.BaseLoading);
                    }
                    loadingView.position = cc.p(0, 0);
                    baseViewScript.push();
                    SML.LoadingManager.isLoading = true;

                    // 设置倒计时干点loading界面
                    baseViewScript.scheduleOnce(function(){
                        SML.LoadingManager.hideLoading();
                    }, 5);
                }
            } else {
                SML.Output.err('加载失败：prefabs/windows_loading');
            }
        });
    },

    hideLoading: function () {
        if (!SML.LoadingManager.isLoading) {
            return;
        }
        SML.Core.Scene.popAllLoading();
        SML.LoadingManager.isLoading = false;
    },
}
