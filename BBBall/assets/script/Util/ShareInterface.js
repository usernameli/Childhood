/**
 * Created by sumingliang on 2018/5/3.
 */
cc.Class({
    extends: cc.Component,
    properties: {
        OnShareAppMessageInfo: 0,
    },
    onShareAppMessageInit:function()
    {
        if (cc.wwx.IsWechatPlatform())
        {
            wx.onShareAppMessage(function (result) {
                /**
                 * 获取转发信息,手动设置过则使用设置信息,否则随机获取一个分享点信息
                 */
                var config = this.getOnShareAppMessageInfo();
                if (config == null) {
                    config = this.getRandomOnShareAppMessageInfo();
                }
                cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserShare, [config.sharePointId, 1, config.shareSchemeId]);
                return {
                    title: config.title,
                    imageUrl: config.imageUrl,
                    query: "inviteCode=" + cc.wwx.UserInfo.userId + "&sourceCode=" + config.sharePointId + "&inviteName=" + cc.wwx.UserInfo.userName + "&imageType=" + config.shareSchemeId,
                    success: function (shareTickets, groupMsgInfos) {
                        cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserShare, [config.sharePointId, 2, config.shareSchemeId]);
                    },
                    fail: function () {

                    },
                    complete: function () {
                    }
                }
            });
        }
    },
    /**
     * 设置右上角"转发"对应的分享信息
     * @param title
     * @param imageUrl
     * @param sharePointId
     * @param shareSchemeId
     */
    setOnShareAppMessageInfo: function(title, imageUrl, sharePointId, shareSchemeId){
        this.OnShareAppMessageInfo = {
            title: title,
            imageUrl: imageUrl,
            sharePointId: sharePointId,
            shareSchemeId: shareSchemeId
        }
    },

    /**
     * 获取右上角"转发"对应的分享信息
     * @returns {null}
     */
    getOnShareAppMessageInfo: function() {
        return this.OnShareAppMessageInfo;
    },

    /**
     * 随机获取一个分享点作为"转发"对应的分享信息
     * @returns {*}
     */
    getRandomOnShareAppMessageInfo: function() {
        var shareKeys = Object.keys(cc.wwx.PropagateInterface.ShareConfig);
        if(shareKeys && shareKeys.length > 0) {
            var randomIndex = (Math.floor(Math.random()*10000))%shareKeys.length;
            var sharePointKey = shareKeys[randomIndex];
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
            }
        }
        return null;
    },

    /**
     * 根据分享信息调用分享接口,并封装了必要的打点和处理
     * @param title
     * @param imageUrl
     * @param sharePointId
     * @param shareSchemeId
     * @param successCallback
     * @param failCallback
     */
    share: function(title, imageUrl, sharePointId, shareSchemeId, successCallback, failCallback) {
        if(cc.wwx.IsWechatPlatform()) {
            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserShare,[sharePointId, 1, shareSchemeId]);
            wx.shareAppMessage({
                title: title,
                imageUrl : imageUrl,
                query : 'inviteCode='+cc.wwx.UserInfo.userId+'&sourceCode='+sharePointId+"&inviteName="+cc.wwx.UserInfo.userName+"&imageType="+shareSchemeId+'&shareid='+cc.wwx.UserInfo.userId,
                success : function (result) {
                    //分享成功相关处理
                    if(successCallback) {
                        successCallback(result);
                    }
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserShare,[sharePointId, 2, shareSchemeId]);
                },
                fail : function () {
                    //分享失败相关处理
                    if(failCallback) {
                        failCallback();
                    }
                },
                complete : function () {
                }
            });
        }
    }
});