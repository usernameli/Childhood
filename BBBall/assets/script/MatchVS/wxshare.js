var wxShareConf = {
    getOpenIDAddr:"http://test79open.matchvs.com/getOpenID?" //传入code获取微信openID的服务端地址
}
var engine = require("MatchvsEngine");
/**
 * 获取启动参数
 */
function getLaunchOptionsSync() {
    var LaunchOption = wx.getLaunchOptionsSync();
    console.log("LaunchOption:" + JSON.stringify(LaunchOption));
    console.log("LaunchOption quary:" + JSON.stringify(LaunchOption.query));
    return LaunchOption;
}

/**
 * 约战API
 * @param {string} title 
 * @param {string} query getLaunchOptionsSync 中的参数
 */
function together(title, query) {
    wx.shareAppMessage({
        title: title,
        query: query,
        complete: function () {
            console.log(arguments);
        },
        success: function (shareTickets, groupMsgInfos) {
            console.log(shareTickets);
            console.log(groupMsgInfos);
        }
    })

    wx.updateShareMenu({
        withShareTicket: true,//开启群发
        success: function () {
            console.log("updateShareMenu success");
        },
        fail: function (e) {
            console.log("updateShareMenu fail" + e);
        }
    });


}

/**
 * 获取用户信息
 */
function getWxUserInfo(data) {
    wx.getUserInfo({
        openIdList: ['selfOpenId'],
        lang: 'zh_CN',
        success: function (res) {
            console.log('success', res.userInfo);
            return data(res.userInfo);
        },
        fail: function (res) {
            // reject(res);
            if (res.errMsg == "getUserInfo:fail scope unauthorized") {
                console.warn("getWxUserInfo error");
                engine.prototype.registerUser();
            }
            console.log("fail", res);
            return "";
        }
    });
}


/**
 * 获取用户OpenID
 */
function getUserOpenID(obj) {
    var callObj = obj;
    wx.login({
        success: function (res) {
            var wcode = res.code;
            wx.request({
                url: wxShareConf.getOpenIDAddr,
                method: "GET",
                data: {
                    code: wcode
                },
                success: function (res) {
                    console.log(res.data);
                    return obj(res.data);
                }
            });
        },
        fail: function (res) {
            obj.fail(res);
            console.log(res.data);
            return obj(res.data);
        },
    });

}



window.getLaunchOptionsSync = getLaunchOptionsSync;
window.together = together;
window.getWxUserInfo = getWxUserInfo;
window.getUserOpenID = getUserOpenID;