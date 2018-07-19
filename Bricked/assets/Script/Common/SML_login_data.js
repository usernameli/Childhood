/**
 * 登录数据
 */
SML.LoginData = {
    init:function() {
        this.base = {
            url: SML.GameData.url,
            data: {
                appId: SML.GameData.appId,
                gameId: SML.GameData.gameId,
                clientId: SML.GameData.clientId,
                imei: "null"
            }
        };
        this.wxLogin = {
            route: 'open/v6/user/LoginBySnsIdNoVerify',
            data: {
                wxAppId: SML.GameData.wxAppId
            },
            need: {
                snsId: ''
            }
        };
        this.wxSession = {
            route: 'open/v4/user/loginByToken',
            data: {
                // wxAppId: SML.GameData.wxAppId,
                imei: "null"
            },
            need: {
                token: ''
            }
        };
    },

    addressByKey: function (key) {
        return this.base.url + this[key].route;
    },
    dataByKey:function(key, params) {
        var baseData = SML.Utils.mergeJson(this['base']['data'], this[key]['data']);
        var needData = SML.Utils.mergeJson(this[key]['need'], params);
        var args = SML.Utils.mergeJson(baseData, needData);
        return args;
    },
    argsString:function(key, params) {
        return SML.Utils.dataToUrlStr(this.dataByKey(key, params));
    }
}