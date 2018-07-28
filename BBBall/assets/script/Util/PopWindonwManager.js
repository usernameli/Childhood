cc.Class({
    extends:cc.Component,
    statics:{
        isConnecting: false,
        _windowList:[],
        preload()
        {
            cc.loader.loadRes('prefab/connecting_wifi', cc.Prefab, function(completedCount, totalCount, item) {
                // ty.Output.log('preload | connecting_wifi progress:' + completedCount + '/' + totalCount);
            }, function(error, prefab) {
                // ty.Output.log('preload | connecting_wifi finished:' + ddz.GlobalFuncs.obj2String1(error));
            })
        },
        getScene () {
            var scene = cc.director.getScene();
            if (!scene) return null;
            var cv = scene.getChildByName('Canvas');
            cc.assert(cv && cv instanceof cc.Node, 'Please check scene has Canvas!');

            return cv;
        },
        removeAllWindow()
        {
            for(let window = 0; window < this._windowList;window++)
            {
                this._windowList[window]["windowNode"].destroy();


            }

            this._windowList = [];
        },

        remvoeWindowByName(windowName)
        {
            let windowIndex = -1;
            for(let window = 0; window < this._windowList;window++)
            {
                if(this._windowList[window]["windowName"] === windowName)
                {
                    this._windowList[window]["windowNode"].destroy();
                    windowIndex = window;
                    break;
                }
            }

            if(windowIndex > -1)
            {
                this._windowList.splice(windowIndex, 1);
            }
        },
        showWifiView(windowName)
        {
            if(this.isConnecting)
            {
                return;
            }
            var baseScene = this.getScene();
            let self = this;
            cc.loader.loadRes('prefab/' + windowName, cc.Prefab, function(completedCount, totalCount, item) {
                    // ty.Output.log('connecting_wifi progress:' + completedCount + '/' + totalCount);
                }, function(error, prefab) {
                if(baseScene !== self.getScene())
                {
                    return;
                }

                if(self.isConnecting)
                {
                    return;
                }

                if(!error)
                {
                    var wifiView = cc.instantiate(prefab);
                    wifiView.position = cc.p(0, 0);
                    baseScene.addChild(wifiView);
                    self._windowList.push({windowName:windowName,windowNode:wifiView});
                }
            });

        },
        hideWifiView()
        {
            if(!this.isConnecting)
            {
                return;
            }
            this.isConnecting = false;
            this.remvoeWindowByName("connecting_wifi");
        }
    }
})