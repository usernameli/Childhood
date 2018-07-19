/**
 * 下载资源
 */

SML.Loader = {
    imageDic : {},
    imgHDCache : {},  // 节约内存 不再缓存
    /**
     * 下载图片
     * @node 必须是带有cc.Sprite组件的cc.Node
     */
    loadImg (url, sprite, callback, autosize,tag) {
        if (!sprite) {
            SML.Output.err('no node!!!');
            return;
        }
        if (!SML.Utils.isUrl(url)) {
            SML.Output.err('not url : ' + url);
            return;
        }

        let successCB = function(texture) {
            var sf = new cc.SpriteFrame(texture);
            if (!autosize){
                var w, h;
                if (sprite instanceof cc.Node) {
                    w = sprite.width, h = sprite.height;
                    sprite.getComponent(cc.Sprite).spriteFrame = sf;
                    sprite.width = w;
                    sprite.height = h;
                } else if (sprite instanceof cc.Sprite && sprite.node instanceof cc.Node) {
                    w = sprite.node.width, h = sprite.node.height;
                    sprite.spriteFrame = sf;
                    sprite.node.width = w;
                    sprite.node.height = h;
                }
            } else {
                if (sprite instanceof cc.Sprite && sprite.node instanceof cc.Node) {
                    sprite.node.width = 0;
                    sprite.node.height = 0;
                    sprite.spriteFrame = sf;
                } else if (sprite instanceof cc.Node) {
                    sprite.width = 0;
                    sprite.height = 0;
                    sprite.getComponent(cc.Sprite).spriteFrame = sf;
                }
            }

            if (typeof callback == 'function') {
                callback(texture);
            }
        }

        var urlString = SML.hex_md5(url);
        if (SML.Loader.imageDic[urlString] && SML.Loader.imageDic[urlString] instanceof cc.Texture2D) {
            SML.Output.log('SML.Loader load with cache : ' + url);
            successCB(SML.Loader.imageDic[urlString]);
            return;
        }
        delete SML.Loader.imageDic[urlString];

        /**
         * 控制生命周期的节点，节点存在的期间内，图片没下载完成，则持续调用加载图片的方法。
         * @type {null}
         */
        if (sprite instanceof cc.Node) {
            var liftComponent = sprite.addComponent(cc.Component);
        } else if (sprite instanceof cc.Sprite) {
            var liftComponent = sprite.node.addComponent(cc.Component);
        } else {
            var liftComponent = null;
        }

        var callLoader = function(resources){
            SML.Output.log('load img : ' + resources.url);
            cc.loader.load(resources, function (err, texture) {
                if (err) {
                    SML.Output.warn('load img err:[' + JSON.stringify(err) + ']' + url);
                    return;
                }
                liftComponent && liftComponent.destroy();

                SML.Output.log('SML.Loader load with net : ' + url);
                successCB(texture);

                // SML.Loader.imageDic[urlString] = texture;
            });
        };

        var loadType = SML.Loader.dealHeadIconUrl(url,tag);
        if (liftComponent) {
            callLoader(loadType);
            // liftComponent.schedule(callLoader, 5, cc.macro.REPEAT_FOREVER, 0);
            liftComponent.scheduleOnce(function(){
                var loadType2 = SML.Loader.dealHeadIconUrl(url, '/96');
                callLoader(loadType2);
            }, 5);
            liftComponent.scheduleOnce(function(){
                var loadType2 = SML.Loader.dealHeadIconUrl(url, '/64');
                callLoader(loadType2);
            }, 10);
            liftComponent.scheduleOnce(function(){
                var loadType2 = SML.Loader.dealHeadIconUrl(url, '/46');
                callLoader(loadType2);
            }, 15);
        } else {
            callLoader(loadType);
        }
    },


    loadImgHD (url, sprite, callback) {
        if (!sprite) {
            SML.Output.err('no node!!!');
            return;
        }

        if (!SML.Utils.isUrl(url)) {
            SML.Output.err('not url : ' + url);
            return;
        }

        let successCB = function(texture) {
            var sf = new cc.SpriteFrame(texture);
            var w, h;
            if (sprite instanceof cc.Node) {
                w = sprite.width, h = sprite.height;
                sprite.getComponent(cc.Sprite).spriteFrame = sf;
                sprite.width = w;
                sprite.height = h;
            } else if (sprite instanceof cc.Sprite && sprite.node instanceof cc.Node) {
                w = sprite.node.width, h = sprite.node.height;
                sprite.spriteFrame = sf;
                sprite.node.width = w;
                sprite.node.height = h;
            }

            if (typeof callback == 'function') {
                callback(texture);
            }
        };

        var urlString = SML.hex_md5(url);

        // 如果大图有缓存直接用大图
        if (SML.Loader.imgHDCache[urlString] && SML.Loader.imgHDCache[urlString] instanceof cc.Texture2D){
            SML.Output.log('SML.Loader load with cache hd : ' + url);
            successCB(SML.Loader.imgHDCache[urlString]);
            return;
        }
        // 如果大图没有缓存再判断小图是否有缓存，有则用小图临时显示
        if (SML.Loader.imageDic[urlString] && SML.Loader.imageDic[urlString] instanceof cc.Texture2D) {
            SML.Output.log('SML.Loader load with cache : ' + url);
            successCB(SML.Loader.imageDic[urlString]);
        }

        if (sprite instanceof cc.Node) {
            var lifeComponent = sprite.addComponent(cc.Component);
        } else if (sprite instanceof cc.Sprite) {
            var lifeComponent = sprite.node.addComponent(cc.Component);
        } else {
            var lifeComponent = null;
        }

        function load(resources){
            SML.Output.log('load img : ' + resources.url);
            cc.loader.load(resources, function (err, texture) {
                if (err) {
                    SML.Output.warn('load img err:[' + JSON.stringify(err) + ']' + url);
                    return;
                }
                lifeComponent && lifeComponent.destroy();

                SML.Output.log('SML.Loader load with net : ' + url);
                successCB(texture);

                // SML.Loader.imgHDCache[urlString] = texture;
            });
        };

        load(SML.Loader.dealHeadIconUrl(url,'/0'));
        if (lifeComponent) {
            lifeComponent.scheduleOnce(function(){
                load(SML.Loader.dealHeadIconUrl(url));
            }, 10);
        }
    },


    /**
     * 处理头像url
     */
    dealHeadIconUrl (url, tag) {
        tag = tag || '/132';
        var imgTypes = ['png', 'jpg', 'jpeg', 'gif'];
        var idx = url.lastIndexOf(".");
        if (idx >= 0) {
            var ext = url.substring(idx+1).toLowerCase();
            if (imgTypes.indexOf(ext) != -1) {
                return {url: url, type: ext};
            }
        }

        var wxHeadTags = ['/0','/46','/64','/96','/132'];
        for (var i = 0; i < wxHeadTags.length; i++) {
            if (url.endsWith(wxHeadTags[i])) {
                return {url: url.replace(wxHeadTags[i], tag), type: 'jpeg'};
            }
        }

        return {url: url, type: 'jpg'};
    },
}
