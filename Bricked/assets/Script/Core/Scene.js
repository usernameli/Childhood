/**
 * 具体到各项目的场景管理器
 * Created by Aaron on 10/04/2018.
 * Copyright 2013 sml Games. All Rights Reserved.
 */
SML.Core.Scene = {
    curScene:'login',
    /**
     * 预加载
     * @param sceneName
     */
    preLoad : function(sceneName, cb) {
        cc.director.preloadScene(sceneName, function(error){
            // SML.Output.log('SML.Core.Scene:' + JSON.stringify(error));
            if (error) {
                SML.Output.err(`SML.Core.Scene.preLoad error[${sceneName}]`, JSON.stringify(error));
                SML.Notify.trigger(SML.Event.MSG_LOADED_SCENE, {success:false, scene:sceneName});
            } else {
                SML.Notify.trigger(SML.Event.MSG_LOADED_SCENE, {success:true, scene:sceneName});
            }

            if (typeof cb == 'function') {
                cb();
            }
        });
    },

    /**
     * 加载场景
     * @param sceneName
     */
    load : function(sceneName, cb) {
        if (SML.Core.Scene.curScene == 'login') {
            SML.BiLog.record_game_progress('SceneLoginLeaveStart');
            SML.GameProgress.sceneLoginLeaveStart();
        }
        cc.director.loadScene(sceneName, function(){
            if (SML.Core.Scene.curScene == 'login') {
                SML.BiLog.record_game_progress('SceneLoginLeaveEnd');
                SML.GameProgress.sceneLoginLeaveEnd();

                var params = ['complete'].concat(SML.GameProgress.progeressData());
                SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeProgress, params);
            }
            SML.Core.Scene.curScene = sceneName;
            var scene = cc.director.getScene();
            SML.Output.info('SML.Core.Scene ', 'go to scene : ' + scene.name);
            var cv = scene.getChildByName('Canvas');
            cc.assert(cv && cv instanceof cc.Node, 'Please check scene has Canvas!');
            if (!cv.getComponent(SML.Core.BaseScene)) {
                cv.addComponent(SML.Core.BaseScene);
            }

            SML.LoadingManager.isLoading = false;
            SML.ConnectManager.isConnecting = false;
            if (typeof cb == 'function') {
                cb();
            }

        });
    },

    /**
     * 获取场景根结点Canvas上的场景管理组件
     */
    getScene () {
        var scene = cc.director.getScene();
        if (!scene) return null;
        var cv = scene.getChildByName('Canvas');
        cc.assert(cv && cv instanceof cc.Node, 'Please check scene has Canvas!');
        var baseScene = cv.getComponent(SML.Core.BaseScene);
        if (!baseScene) {
            baseScene = cv.addComponent(SML.Core.BaseScene);
        }
        return baseScene;
    },

    // 场景push全屏view
    pushView: function (view) {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.pushView(view);
        }

        SML.Notify.trigger('isRoot',baseScene.isRoot());
    },

    // 场景pop全屏view
    popView: function () {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popView();
        }

        SML.Notify.trigger('isRoot',baseScene.isRoot());
    },

    popAllViews: function () {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popAllViews();
        }

        SML.Notify.trigger('isRoot',baseScene.isRoot());
    },

    pushWindows: function (windows) {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.pushWindows(windows);
        }
    },

    popWindows: function () {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popWindows();
        }
    },

    popAllWindows: function () {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popAllWindows();
        }
    },

    pushLoading:function (loadingView) {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.pushLoading(loadingView);
        }
    },

    popLoading:function() {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popLoading();
        }
    },

    popAllLoading:function() {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popAllLoading();
        }
    },

    pushTip:function(tipView) {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.pushTip(tipView);
        }
    },

    pushWifiConnectingView:function(wifiView) {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.pushWifiConnectingView(wifiView);
        }
    },

    pushAdView:function(adView) {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.pushAdView(adView);
        }
    },

    popAdView:function() {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popAdView();
        }
    },

    popWifiConnectingView:function() {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popWifiConnectingView();
        }
    },

    popToWindows:function(windowsName) {
        var baseScene = this.getScene();
        if (baseScene) {
            return baseScene.popToWindows(windowsName);
        }
        return null;
    },

    popToView:function(viewName) {
        var baseScene = this.getScene();
        if (baseScene) {
            return baseScene.popToView(viewName);
        }
        return null;
    },

    popAllWindowsExcept (windowsName) {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popAllWindowsExcept(windowsName);
        }
    },

    popAllViewExcept (viewName) {
        var baseScene = this.getScene();
        if (baseScene) {
            baseScene.popAllViewExcept(viewName);
        }
    },
};