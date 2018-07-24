/**
 * 游戏中智能分享接口使用:
 * 1.创建对象
 * 2.监听智能分享事件
 * 3.调用接口wxAutoShare
 */

cc.Class({
    extends: cc.Component,
    properties: {
        soundOpen: 0,
    },

    init : function () {
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.GET_SHARE_CONFIG_SUCCESS, this._onGetShareConfigSuc, this);
    },

    /**
     * 获取分享成功
     * @private
     */
    _onGetShareConfigSuc : function () {
        if(this._inshare==true){
            var config = cc.wwx.ShareInterface.getRandomOnShareAppMessageInfo();
            if(config){
                cc.wwx.ShareInterface.share(config.title, config.imageUrl, config.sharePointId, config.shareSchemeId
                    , this._successCallBack, this._failCallBack);
            }
            this._inshare = false;
        }
    },
    //
    // destroy : function () {
    //     this.super();
    //     cc.wwx.NotificationCenter.ignoreScope(this);
    // },

    /**
     * 智能分享接口
     * @param sharepoint: 分享点, 回传, 用于游戏辨别不同分享源
     * @param param : 分享参数 回传
     */
    wxAutoShare : function (sharepoint, param) {
        if(this._inshare==true)
            return;

        this._shareparam = param;
        this._sharepoint = sharepoint;

        var config = this._getShareMessageInfo(sharepoint);
        if(config==-1)
            return;

        this._inshare = true;
        if(config){
            this._inshare = false;
            cc.wwx.ShareInterface.share(config.title, config.imageUrl, config.sharePointId, config.shareSchemeId
                , this._successCallBack, this._failCallBack);
        }else {
            cc.wwx.PropagateInterface.getShareConfigInfo();
        }
    },

    /**
     * 获取来自指定分享点的配置信息
     * @param sharepoint
     * @returns {*}
     * @private
     */
    _getShareMessageInfo: function(sharepoint) {
        var shareKeys = Object.keys(cc.wwx.PropagateInterface.ShareConfig);
        if(shareKeys && shareKeys.length > 0) {
            var sharePointKey = sharepoint;
            if(sharepoint && shareKeys.indexOf(sharepoint)<0){
                var randomIndex = (Math.floor(Math.random()*10000))%shareKeys.length;
                sharePointKey = shareKeys[randomIndex];
            }
            var sharePointInfo = cc.wwx.PropagateInterface.ShareConfig[sharePointKey];
            if(sharePointInfo && sharePointInfo.length > 0) {
                randomIndex = (Math.floor(Math.random()*10000))%sharePointInfo.length;
                var config = {
                    title: sharePointInfo[randomIndex].shareContent,
                    imageUrl: sharePointInfo[randomIndex].sharePicUrl,
                    sharePointId: sharePointInfo[randomIndex].sharePointId,
                    shareSchemeId: sharePointInfo[randomIndex].shareSchemeId
                }
                return config;
            }else{
                wx.showToast({title: "分享失败"});
            }
            return -1;
        }
        return null;
    },
    /**
     * 微信分享成功回调
     * @private
     */
    _successCallBack : function (result) {
        if(result) {
            var ret = {
                result : result,
                sharefrom : cc.wwx.GameShare._sharepoint,
                param : cc.wwx.GameShare._shareparam
            };
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.PROPAGATE_SHARE_SUCESS, ret)
        }
        wx.showToast({title: "分享成功"});
    },

    /**
     * 微信分享失败回调
     * @private
     */
    _failCallBack : function () {
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.PROPAGATE_SHARE_FAIL);
        wx.showToast({title: "分享失败"});
    }

});

