cc.Class({
    extends:cc.Component,
    statics:{
        isConnecting: false,
        _windowList:[],
        _tag:"windowManager",
        preload()
        {

            let prefabList = [
                'prefab/connecting_wifi',
                'prefab/GameStopWindow',
                'prefab/PopBoxWindow',
                'prefab/Invate',
                'prefab/SignIn',
                'prefab/node',
                'prefab/Shop',
            ];

            for(let i = 0; i < prefabList.length;i++)
            {
                cc.loader.loadRes(prefabList[i], cc.Prefab, function(completedCount, totalCount, item) {
                    cc.wwx.OutPut.log(prefabList[i],'preload  progress:' + completedCount + '/' + totalCount);
                }, function(error, prefab) {
                    cc.wwx.OutPut.log(prefabList[i],'preload  finished:' + cc.wwx.Util.obj2String1(error));
                });
            }


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
            cc.wwx.OutPut.log(this._tag,"remvoeWindowByName windowName: ", windowName);
            cc.wwx.OutPut.log(this._tag,"remvoeWindowByName windowList: ", JSON.stringify(this._windowList[0]["windowName"]));
            let windowIndex = -1;
            for(let window = 0; window < this._windowList.length;window++)
            {
                if(this._windowList[window]["windowName"] == windowName)
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
        popWindow(windowName)
        {
            var baseScene = this.getScene();
            let self = this;
            cc.loader.loadRes(windowName, cc.Prefab, function(completedCount, totalCount, item) {
                    // ty.Output.log('connecting_wifi progress:' + completedCount + '/' + totalCount);
                }, function(error, prefab) {
                    if(baseScene !== self.getScene())
                    {
                        return;
                    }

                    if(!error)
                    {
                        var window = cc.instantiate(prefab);
                        window.position = cc.p(0, 0);
                        baseScene.addChild(window);
                        self._windowList.push({windowName:windowName,windowNode:window});
                    }
            });
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