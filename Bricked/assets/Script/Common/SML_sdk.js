/**
 * sdk
 */

if (CC_WECHATGAME) {
    SML.SDK = {
        SESSION_KEY: 'TU_SESSION_STORAGE',

        login: function () {
            SML.Output.log('wx login');
            this.wxLogin();
        },

        wxLogin: function() {
            SML.Notify.trigger(SML.Event.MSG_SDK_WX_CHECK_SESSION);
            this._wechatLogin();
        },

        /**
         * 静默同步玩家信息
         */
        wxUserInfo1 () {
            var self = this;
            wx.login({
                success: function(res) {
                    if (res.code) {
                        let code = res.code;
                        SML.WeChat.getUserInfo(function(status, params) {
                            if (status) {
                                try {
                                    var userInfo = JSON.parse(params)[0].data[0];
                                    self._loginTuyooWithCode(code, userInfo, function(){
                                        SML.UserInfo.wxAuthor = true;
                                    });
                                    SML.Output.info('wxUserInfo1.wx.getUserInfo.ok:', params);
                                } catch (e) {
                                    SML.Output.err('wxUserInfo1.wx.getUserInfo.ok.e:', params);
                                }
                            } else {
                                SML.Output.err('wxUserInfo1.wx.getUserInfo.fail:', params);
                            }
                        });
                    }
                }
            });
        },

        /**
         *  获取用户授权
         * @param obj.setting 是否已经同意授权了
         */
        wxUserInfo2 (obj) {
            obj = obj || {};
            var self = this;
            var getUserInfo = function() {
                wx.getUserInfo({
                    'lang' : 'zh_CN',
                    success: function (res) {
                        SML.Output.log('wx getUserInfo ok:', JSON.stringify(res));
                        var userInfo = res['userInfo'];

                        wx.login({
                            success: function (res) {
                                if (res.code) {
                                    let code = res.code;
                                    self._loginTuyooWithCode(code, userInfo, function(res){
                                        SML.UserInfo.wxAuthor = true;
                                        if (typeof obj.onSuccess == 'function') {
                                            obj.onSuccess(res);
                                        }
                                    }, function(errMsg){
                                        if (typeof obj.onFail == 'function') {
                                            obj.onFail(errMsg);
                                        }
                                    });
                                } else {
                                    if (typeof obj.onFail == 'function') {
                                        obj.onFail();
                                    }
                                }
                            }
                        });
                    },
                    fail: function (res) {
                        SML.Output.err('wx getUserInfo fail:', JSON.stringify(res));
                        // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                        if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1 ) {
                            // 处理用户拒绝授权的情况
                            SML.Output.log('wx getUserInfo fail:', 'to tip user');
                            wx.showModal({
                                title: '授权提示',
                                content: '获取用户信息失败，请确认授权！',
                                showCancel: false,
                                success: function () {
                                    SML.WeChat.openSetting();
                                }
                            });
                        }
                        if (typeof obj.onFail == 'function') {
                            obj.onFail();
                        }
                    }
                });
            };
            if (obj.setting) {
                getUserInfo();
            } else {
                // 获取用户授权情况
                wx.getSetting({
                    success: function (res) {
                        SML.Output.log('get user setting :', res);
                        var authSetting = res.authSetting;
                        if (authSetting['scope.userInfo'] === true) {
                            SML.UserInfo.wxAuthor = true;
                            // 用户已授权
                            SML.Output.info('wxUserInfo2.auth.ok');
                            if (typeof obj.onSuccess == 'function') {
                                obj.onSuccess();
                            }
                        } else if (authSetting['scope.userInfo'] === false){
                            // 用户已拒绝授权。处理用户拒绝授权的情况，跳出提示
                            wx.showModal({
                                title: '授权提示',
                                content: '获取用户信息失败，请确认授权！',
                                showCancel: false,
                                success: function () {
                                    SML.WeChat.openSetting();
                                }
                            });
                        } else {
                            // 未询问过用户授权
                            getUserInfo();
                        }
                    }
                });
            }
        },

        // 微信登录
        _wechatLogin () {
            SML.Output.log('wx _wechatLogin');
            var self = this;
            //登录开始打点
            SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeWxLoginStart);
            wx.login({
                success: function(params) {
                    if (params.code) {
                        //登录成功打点
                        SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeWxLoginSuccess);
                        var code = params.code;
                        self._loginTuyooWithCode(code, null, function(res){
                            self._successForUserInfo(res);
                            // sdk连接成功
                            SML.Notify.trigger(SML.Event.MSG_CONNECTED_SDK);
                            //登录SDK成功打点
                            SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeLoginSDKSuccess);
                        }, function(errMsg) {
                            SML.Notify.trigger(SML.Event.MSG_WINDOWS_COMMON_TIP_LOGINERR, errMsg);
                            SML.GameData.createRandomUUID();
                            //登录SDK失败打点
                            SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeLoginSDKFailed);
                        });
                    } else {
                        SML.Output.err('wx.login.success:', '获取code失败:' + JSON.stringify(params));
                        SML.Notify.trigger(SML.Event.MSG_WINDOWS_COMMON_TIP_LOGINERR, '获取code失败');
                    }
                },
                fail: function(params) {
                    SML.Output.err('wx.login.fail:', '获取code失败:' + JSON.stringify(params));
                    SML.Notify.trigger(SML.Event.MSG_WINDOWS_COMMON_TIP_LOGINERR, '获取code失败');
                    //登录失败打点
                    SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeWxLoginFailed);
                }
            });
        },

        // 微信授权成功后，使用
        _loginTuyooWithCode (code, userInfo, onSuccess, onFail) {
            SML.BiLog.record_game_progress('WXLoginSuccess');
            SML.GameProgress.wxLoginSuccess();
            // 微信授权成功后使用code登录途游服务器
            var baseUrl = SML.LoginData.addressByKey('wxLogin');
            var data = {
                snsId: 'wxapp:' + code,
                uuid: SML.GameData.uuid,
                scene_id : SML.UserInfo.scene_id || "",
                scene_param : SML.UserInfo.scene_param || "",
                invite_id : SML.UserInfo.invite_id || 0
            };
            if (userInfo) {
                SML.Output.info('_loginTuyooWithCode userInfo:' + JSON.stringify(userInfo));
                data.nickName = userInfo.nickName;
                data.gender = userInfo.gender;
                data.avatarUrl = userInfo.avatarUrl;
            }

            var urlData = SML.LoginData.dataByKey('wxLogin', data);
            SML.Output.log('loginSdk baseUrl :' + baseUrl);
            SML.Output.log('loginSdk urlData :' + JSON.stringify(urlData));
            //登录SDK开始打点
            SML.BiLog.clickStat(SML.clickStatEventType.clickStatEventTypeLoginSDKStart);

            wx.request({
                url: baseUrl,
                data: urlData,
                // method: 'POST',
                success: function(params) {
                    SML.Output.log('loginSdk success, params:' + JSON.stringify(params));
                    let errMsg = null;
                    if (params.data && params.data.error) {
                        SML.Output.err('loginSdk success, but error params 1:' + JSON.stringify(params));
                        var code = params.data.error.code;
                        var info = params.data.error.info;
                        errMsg = code + ':' + info;
                    }
                    if (!params.data || !params.data.result || params.data.result.code !== 0) {
                        SML.Output.err('loginSdk success, but error  params 2:' + JSON.stringify(params));
                        if (params.data.result) {
                            var code = params.data.result.code;
                            var info = params.data.result.info;
                            errMsg = code + ':' + info;
                        } else {
                            errMsg = params.data.statusCode;
                        }
                    }

                    if (errMsg) {
                        if (typeof onFail == 'function') {
                            onFail(errMsg);
                        }
                    } else {
                        var result = params.data.result;
                        SML.UserInfo.parseSnsData(result);
                        SML.GameData.parseSnsData(result);
                        SML.Notify.trigger(SML.Event.MSG_SDK_WX_GET_USERINFO);
                        if (typeof onSuccess == 'function') {
                            onSuccess(result);
                        }
                    }

                },

                fail: function(params) {
                    params = params || {"errMsg":"default request : fail timeout"};
                    let errMsg = JSON.stringify(params);
                    SML.Output.err('loginSdk.fail, params:' + errMsg);
                    if (typeof onFail == 'function') {
                        onFail(errMsg);
                    }
                }
            });
        },

        /**
         * 获取用户信息成功回调
         */
        _successForUserInfo (result) {
            SML.Output.log('_successForUserInfo:', JSON.stringify(result));
            SML.TCP.forcedInterrupt();
            SML.TCP.connect(SML.GameData.wsUrl);

            SML.WeChat.guideStatistical();
            SML.UserInfo.wxEnterInfo = null;  // 信息统计只调用一次
            SML.BiLog.record_game_progress('SDKLoginSuccess');
            SML.GameProgress.sdkLoginSuccess();

            var token = result.token;
            wx.setStorage({
                key: this.SESSION_KEY,
                data: token
            });
        }
    }
} else {
    SML.SDK = {
        SESSION_KEY: 'TU_SESSION_STORAGE',

        login: function () {
            SML.Output.log('not wx login，just for test!');
            this.testLogin();
        },

        wxUserInfo1 () {

        },

        wxUserInfo2 (obj) {
            obj = obj || {};
            if (typeof obj.onSuccess == 'function') {
                obj.onSuccess();
            }
        },

        testLogin: function() {
            var self = this;
            var token = cc.sys.localStorage.getItem(self.SESSION_KEY);
            if (token && token != '') {
                var baseUrl = SML.LoginData.addressByKey('wxSession');
                var data = {
                    token: token,
                    appId: SML.GameData.appId,
                    clientId: SML.GameData.clientId,
                    imei: "null",
                    uuid: SML.GameData.uuid
                }
                var completeUrl = baseUrl + '?' +SML.LoginData.argsString('wxSession', data);
                SML.Output.log('testLogin token:' + completeUrl);
                SML.HTTP.request(completeUrl, {
                    onSuccess: function(response) {
                        var checkData = response;
                        SML.Output.warn('testLogin onSuccess:' + JSON.stringify(checkData.result));
                        if (!checkData || !checkData.result || checkData.result.code !== 0){
                            SML.Output.warn('testLogin onSuccess no data, retry!');
                            cc.sys.localStorage.setItem(self.SESSION_KEY, '');
                            // 失败
                            setTimeout(function(){self.login();}, 5000);
                            return;
                        }
                        // 保存用户名/用户ID/用户头像
                        var result = checkData.result;
                        self._successForUserInfo(result);
                    },

                    onFail: function(params) {
                        SML.Output.log('onFail loginSdk:', params);
                        cc.sys.localStorage.setItem(self.SESSION_KEY, '');
                        setTimeout(function(){self.login();}, 5000);
                    },
                })
            } else {
                var code = SML.GameData._uuid();
                self._loginTuyooWithCode(code);
            }
        },


        // 微信授权成功后，使用
        /* {
            "data": {
                "result": {
                    "code": 0,
                    "userId": 10116,
                    "exception_report": 0,
                    "userType": 4,
                    "authInfo": "{\"authcode\": \"eyJ1aWQiOiAxMDExNiwgInVuYW1lIjogIlx1Njc2NVx1NWJiZTAwNzRBaWJzVCIsICJ1dG9rZW4iOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzEzMzgiLCAiY29pbiI6IDAsICJlbWFpbCI6ICIiLCAidXRpbWUiOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzA0NzEifQ==\", \"account\": \"\", \"uid\": 10116, \"usercode\": \"\"}",
                    "tcpsrv": {
                        "ip": "192.168.10.88",
                        "port": 8041
                    },
                    "isCreate": 1,
                    "changePwdCount": 0,
                    "360.vip": 0,
                    "logclient": {
                        "loguploadurl": "",
                        "logreporturl": ""
                    },
                    "userPwd": "ty817142",
                    "purl": "http://SML.image.sml.com/avatar/head_female_0.png",
                    "snsId": "wxapp:071Nehqt0Z4XEe1jN6qt007Cqt0Nehqz",
                    "userEmail": "",
                    "connectTimeOut": 35,
                    "appId": 9999,
                    "heartBeat": 6,
                    "userName": "来宾0074AibsT",
                    "mobile": "",
                    "token": "cce362d6-68a8-485e-b137-86ae6828e07a",
                    "authorCode": "eyJ1aWQiOiAxMDExNiwgInVuYW1lIjogIlx1Njc2NVx1NWJiZTAwNzRBaWJzVCIsICJ1dG9rZW4iOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzEzMzgiLCAiY29pbiI6IDAsICJlbWFpbCI6ICIiLCAidXRpbWUiOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzA0NzEifQ==",
                    "log_report": 0,
                    "showAd": 1
                }
            },
            "header": {
                "Server": "nginx/1.4.1",
                "Date": "Mon, 29 Jan 2018 06:13:12 GMT",
                "Content-Type": "application/json;charset=UTF-8",
                "Transfer-Encoding": "chunked",
                "Connection": "keep-alive",
                "Content-Encoding": "gzip"
            },
            "statusCode": 200,
            "errMsg": "request:ok"
        }
        */
        _loginTuyooWithCode: function(code) {
            var self = this;
            // 微信授权成功后使用code登录途游服务器
            var baseUrl = SML.LoginData.addressByKey('wxLogin');
            var data = {
                snsId: 'wxapp:' + code,
                uuid: SML.GameData.uuid
            };


            var loginSdk = function() {
                var completeUrl = baseUrl + '?' + SML.LoginData.argsString('wxLogin', data);
                SML.Output.log('_loginTuyooWithCode:' + completeUrl);
                SML.HTTP.request(completeUrl, {
                    onSuccess: function(response) {
                        var checkData = response;
                        SML.Output.warn('loginSdk onSuccess:' + JSON.stringify(checkData.result));
                        if (!checkData || !checkData.result || checkData.result.code !== 0){

                            SML.Output.warn('loginSdk onSuccess no data, retry!');
                            // 失败
                            setTimeout(function(){self.login();}, 10000);
                            return;
                        }

                        // 保存用户名/用户ID/用户头像
                        var result = checkData.result;
                        self._successForUserInfo(result);
                    },

                    onFail: function(params) {

                        SML.Output.log('onFail loginSdk:', params);
                        setTimeout(loginSdk, 5000);
                    },
                })
            }
            loginSdk();
        },

        /**
         * 获取用户信息成功回调
         */
        _successForUserInfo: function (result) {
            var self = this;
            SML.Output.log('_successForUserInfo:', JSON.stringify(result));

            var token = result.token;
            cc.sys.localStorage.setItem(self.SESSION_KEY, token);

            SML.UserInfo.parseSnsData(result);
            SML.GameData.parseSnsData(result);

            SML.TCP.connect(SML.GameData.wsUrl);
        }
    }
}
