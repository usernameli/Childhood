/**
 * 全局信息
 */
SML.GameData = {
    UUID_KEY: 'TU_UUID_KEY',
    appId: 9999,
    gameId: 6,
    clientId: 'H5_5.1_weixin.weixin.0-hall6.weixin.sml',
    intClientId:23186,
    cloudId:29,
    wxAppId: 'wx785e80cff6120de5',
    url:'https://openddz.nalrer.cn/',
    // url:'https://openddzfz.nalrer.cn/',
    deviceId: 'wechatGame',
    version: "5.08",
    socketPrefix : 'wss',
    wsUrl: '',
    uuid: '',
    snsId  : '',

    //BI打点错误日志服地址,暂时未用到
    // https://clienterr.touch4.me/api/bilog5/text/error
    // https://clienterr.touch4.me/api/bilog5/zip/error
    errorLogServer:"https://clienterr.touch4.me/api/bilog5/text/error",
    //BI打点日志服地址
    biLogServer:"https://cbi.touch4.me/api/bilog5/text",

    // 初始化uuid
    init:function() {
        if (this.uuid != '') return;
        // uuid
        if (CC_WECHATGAME) {
            var self = this;
            wx.getStorage({
                key: this.UUID_KEY,
                success: function(params) {
                    if (!params.data || params.data == '') {
                        self.createRandomUUID();
                        return;
                    };
                    self.uuid = params.data;
                },
                fail: function(params) {
                    self.createRandomUUID();
                },
                complete:function(params) {

                }
            });
        } else {
            this.uuid = '12345678123456781234567812345678';
        }
    },
    parseSnsData : function(result) {
        this.heartBeat = result.heartBeat || 2;

        var ip = result.tcpsrv.ip;
        var port = result.tcpsrv.wsport;
        if (port && SML.Utils.isIP(ip)) {
            var webSocketUrl = this.socketPrefix + '://' + ip.toString() + ':' + port.toString() + '/';
        } else {
            var webSocketUrl = this.socketPrefix + '://' + ip.toString() + '/';
        }
        this.wsUrl = webSocketUrl;
    },
    /**
     * 创建随机UUID
     */
    createRandomUUID: function () {
        this.uuid = this._uuid();
        wx.setStorage({
            key: this.UUID_KEY,
            data: this.uuid
        });
    },
    _uuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

        var uuid = s.join("");
        return uuid;
    },

    isConnectFormalServer : function() {
        return SML.GameData.url.startsWith('https');
    },
}

SML.GameData.url = SDK_URL;
SML.GameData.socketPrefix = WS_TYPE;
SML.GameData.version = VERSION;

if (CC_JSB) {
    // native模式下始终用test账号
    SML.GameData.wxAppId = WX_APP_IDS['test'];
} else {
    SML.GameData.wxAppId = WX_APP_IDS['online'];
}