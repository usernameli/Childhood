cc.Class({
    extends: cc.Component,
    statics: {

        SESSION_KEY: 'BB_SESSION_STORAGE',

        login() {
            if (CC_WECHATGAME) {
                this.getSystemInfo();
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_SDK_WX_CHECK_SESSION);

                this.wechatLogin();
            }
            else {
                //BB
                cc.wwx.OutPut.log('not wx login，just for test!');
                this.testLogin();
            }
        },
        testLogin() {
            let self = this;
            let code = cc.wwx.SystemInfo._uuid();

            let dataObj = {
                snsId: 'wxapp:' + code,
                appId: cc.wwx.SystemInfo.appId,
                wxAppId: cc.wwx.SystemInfo.testAppId,
                clientId: cc.wwx.SystemInfo.clientId,
                gameId: cc.wwx.SystemInfo.gameId,
                imei: null,
                uuid: cc.wwx.SystemInfo.uuid,
                invite_id: cc.wwx.UserInfo.invite_id || 0
            };

            let sdkPath = cc.wwx.SystemInfo.loginUrl;

            if(cc.wwx.SystemInfo.debug)
            {
                sdkPath = cc.wwx.SystemInfo.loginUrlDev
            }

            let completeUrl = sdkPath + 'open/v6/user/loginBySnsIdNoVerify' + '?' + cc.wwx.Util.dataToUrlStr(dataObj);
            let token = null;
            // let token = cc.wwx.Storage.getItem(this.SESSION_KEY);
            // let token = "7cc8c4d6-cd3a-4b36-ae2f-ae59a812473c";
            if (token && token !== '') {
                dataObj = {
                    appId: cc.wwx.SystemInfo.appId,
                    wxAppId: cc.wwx.SystemInfo.wxAppId,
                    clientId: cc.wwx.SystemInfo.clientId,
                    gameId: cc.wwx.SystemInfo.gameId,
                    imei: null,
                    uuid: cc.wwx.SystemInfo.uuid,
                    token: token,
                    invite_id: cc.wwx.UserInfo.invite_id || 0
                };
                completeUrl = sdkPath + 'open/v6/user/loginByToken' + '?' + cc.wwx.Util.dataToUrlStr(dataObj);

            }
            cc.wwx.OutPut.log('completeUrl: ' + completeUrl);

            cc.wwx.HttpUtil.request(completeUrl, {
                onSuccess: function (response) {
                    let checkData = response;
                    cc.wwx.OutPut.warn('testLogin onSuccess:' + JSON.stringify(checkData.result));
                    if (!checkData || !checkData.result || checkData.result.code !== 0) {
                        cc.wwx.OutPut.warn('testLogin onSuccess no data, retry!');

                        cc.wwx.TipManager.showMsg(checkData.result.info,2);
                        cc.wwx.Storage.setItem(self.SESSION_KEY, '');
                        // 失败
                        setTimeout(function () {
                            self.login();
                        }, 5000);
                        return;
                    }
                    // 保存用户名/用户ID/用户头像
                    let result = checkData.result;
                    self.updateUserInfo(result, cc.wwx.SystemInfo.uuid);
                    self.initWebSocketUrl(result);


                },
                onFail: function (params) {
                    cc.wwx.OutPut.log('onFail loginSdk:', params);
                    cc.wwx.Storage.setItem(self.SESSION_KEY, '');
                    setTimeout(function () {
                        self.login();
                    }, 5000);
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.WEIXIN_LOGIN_FAIL);
                },
            });
        },
        // 微信登录
        wechatLogin: function () {
            if (!cc.wwx.IsWechatPlatform()) {
                return;
            }
            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeWxLoginStart, []);
            let that = this;
            wx.login({
                success: function (params) {
                    cc.wwx.OutPut.log("login", 'wx login success, params:' + JSON.stringify(params));
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
                    if (params.code) {
                        let code = params.code;
                        that.loginBallWithCode(code, null,function (result) {
                            that.initWebSocketUrl(result);
                        });
                        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.WEIXIN_LOGIN_SUCCESS);
                    }
                },

                fail: function (params) {
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
                    cc.wwx.OutPut.log(null, 'wx login fail, params:' + JSON.stringify(params));
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.WEIXIN_LOGIN_FAIL);
                },

                complete: function (params) {

                }
            });
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
                    "purl": "http://wwx.image.ball.com/avatar/head_female_0.png",
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
        /**
         * 静默同步玩家信息
         */
        wxUserInfo1 ()
        {
            cc.wwx.OutPut.info('wxUserInfo1.');
            var self = this;

            var getUserInfo = function() {
                wx.getUserInfo({
                    'lang' : 'zh_CN',
                    success: function (res) {
                        cc.wwx.OutPut.log('wx getUserInfo ok:', JSON.stringify(res));
                        var userInfo = res['userInfo'];
                        if (userInfo.nickName !== cc.wwx.UserInfo.userName || userInfo.avatarUrl !== cc.wwx.UserInfo.userPic) {
                            wx.login({
                                success: function (res) {
                                    if (res.code) {
                                        let code = res.code;
                                        self.loginBallWithCode(code, userInfo);
                                    }
                                }
                            });
                        }
                    },
                    fail: function (res) {

                    }
                });
            };
            // 获取用户授权情况
            wx.getSetting({
                success: function (res) {
                    cc.wwx.OutPut.log('get user setting :', JSON.stringify(res));
                    var authSetting = res.authSetting;
                    if (authSetting['scope.userInfo'] === true) {
                        cc.wwx.UserInfo.wxAuthor = true;
                        // 用户已授权
                        getUserInfo();
                    }
                    else
                    {
                        getUserInfo();
                    }
                }
            });

        },



        loginBallWithCode: function (code, userInfo,onSuccess,onFail) {
            if (!CC_WECHATGAME) {
                return;
            }
            // 微信授权成功后使用code登录途游服务器
            wx.showShareMenu({
                withShareTicket: true
            });

            let local_uuid = cc.wwx.SystemInfo.uuid;
            cc.wwx.OutPut.log("local_uuid:", local_uuid);
            let sdkPath = cc.wwx.SystemInfo.loginUrl;
            if(cc.wwx.SystemInfo.debug)
            {
                sdkPath = cc.wwx.SystemInfo.loginUrlDev
            }

            let dataObj = {
                appId: cc.wwx.SystemInfo.appId,
                wxAppId: cc.wwx.SystemInfo.wxAppId,
                clientId: cc.wwx.SystemInfo.clientId,
                gameId: cc.wwx.SystemInfo.gameId,
                snsId: 'wxapp:' + code,
                imei: null,
                uuid: local_uuid,
                scene_id: cc.wwx.UserInfo.scene_id || "",
                scene_param: cc.wwx.UserInfo.scene_param || "",
                invite_id: cc.wwx.UserInfo.invite_id || 0
            };
            if (userInfo) {
                cc.wwx.OutPut.info('_loginBallWithCode userInfo:' + JSON.stringify(userInfo));
                dataObj.nickName = userInfo.nickName;
                dataObj.gender = userInfo.gender;
                dataObj.avatarUrl = userInfo.avatarUrl;
                cc.wwx.UserInfo.parseGender(userInfo.gender);

            }

            cc.wwx.OutPut.log("SDKLogin", " *-*-*-*-*-  dataobj:  " + JSON.stringify(dataObj));
            cc.wwx.OutPut.log("sdkPath", " *-*-*-*-*-  sdkPath:  " +sdkPath + 'open/v6/user/loginBySnsIdNoVerify');

            // cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeLoginSDKStart, [code, local_uuid, userInfo.nickName]);
            let that = this;
            wx.request({
                url: sdkPath + 'open/v6/user/loginBySnsIdNoVerify',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: dataObj,
                method: 'GET',

                success: function (params) {
                    cc.wwx.OutPut.log("login", 'ball login success, params:' + JSON.stringify(params));
                    let errMsg = null;
                    if (params.data && params.data.error) {
                        cc.wwx.OutPut.err('loginSdk success, but error params 1:' + JSON.stringify(params));
                        var code = params.data.error.code;
                        var info = params.data.error.info;
                        errMsg = code + ':' + info;
                    }
                    if (!params.data || !params.data.result || params.data.result.code !== 0) {
                        cc.wwx.OutPut.err('loginSdk success, but error  params 2:' + JSON.stringify(params));
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

                        // 保存用户名/用户ID/用户头像
                        let result = params.data.result;
                        that.updateUserInfo(result, local_uuid, code);

                        if (typeof onSuccess == 'function') {
                            onSuccess(result);
                        }
                    }

                },

                fail: function (params) {
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeLoginSDKFailed, [code, local_uuid, userInfo.nickName]);
                    cc.wwx.OutPut.log(null, 'ball login fail, params:' + JSON.stringify(params));
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.SDK_LOGIN_FAIL);
                },

                complete: function (params) {

                }
            });
        },
        updateUserInfo(result, local_uuid, code) {
            cc.wwx.UserInfo.userId = result.userId;
            cc.wwx.UserInfo.userName = result.userName;
            cc.wwx.UserInfo.userPic = result.purl;
            cc.wwx.UserInfo.authorCode = result.authorCode;
            cc.wwx.UserInfo.wxgame_session_key = result.wxgame_session_key;
            cc.wwx.OutPut.log("updateUserInfo1", 'userId:' + cc.wwx.UserInfo.userId + ' userName:' + cc.wwx.UserInfo.userName + ' userPic:' + cc.wwx.UserInfo.userPic);
            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeLoginSDKSuccess, [code, local_uuid, result.userName, result.userId]);
            // 发送登录成功事件
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.SDK_LOGIN_SUCCESS);
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_LOGIN_SUCCESS);
            let token = result.token;
            cc.wwx.OutPut.log("updateUserInfo2", 'token:' + token);

            cc.wwx.WeChat.guideStatisticalball();
            cc.wwx.UserInfo.wxEnterInfo = null;
            cc.wwx.Storage.setItem(this.SESSION_KEY,token);
            cc.wwx.OutPut.log("updateUserInfo3", 'token:' + token);

        },
        /**
         * 使用sdk登陆返回信息解析得到服务器连接地址,对于单机游戏来说无效
         * @param loginResult
         */
        initWebSocketUrl: function (loginResult) {
            if (loginResult && loginResult.tcpsrv) {
                let ip = loginResult.tcpsrv.ip;
                let port = loginResult.tcpsrv.wsport || loginResult.tcpsrv.port; //优先使用wsport
                let webSocketUrl;
                let loginUrl = cc.wwx.SystemInfo.loginUrl;
                if(cc.wwx.SystemInfo.debug)
                {
                    loginUrl = cc.wwx.SystemInfo.loginUrlDev;
                }

                if (loginUrl.indexOf("https://") > -1) {
                    webSocketUrl = 'wss://' + ip + ':' + port.toString() + '/';
                }
                else {
                    webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
                }
                cc.wwx.OutPut.log("initWebSocketUrl", 'webSocketUrl:' + webSocketUrl);
                cc.wwx.SystemInfo.webSocketUrl = webSocketUrl;
                cc.wwx.TCPClient.connect(cc.wwx.SystemInfo.webSocketUrl);


            }
        },

        getSystemInfo: function () {
            if (!cc.wwx.IsWechatPlatform()) {
                return;
            }
            wx.getSystemInfo({
                success: function (result) {
                    let model = result.model;
                    let isiPhone = model.indexOf("iPhone") >= 0;
                    let windowHeight = result.windowHeight;
                    let resultType = 0;
                    if (isiPhone) {
                        if (windowHeight == 812) {   //iPhoneX
                            resultType = 2;
                        } else if (windowHeight == 736) { // 7p 8p
                            resultType = 4;
                        } else {  //其他iPhone
                            resultType = 1;
                        }
                    } else { //cc.sys.OS_ANDROID
                        resultType = 3;
                    }
                    cc.wwx.UserInfo.systemType = resultType;
                    cc.wwx.UserInfo.wechatType = result.version;
                    cc.wwx.UserInfo.model = result.model;
                    cc.wwx.UserInfo.system = result.system;
                    cc.wwx.UserInfo.SDKVersion = result.SDKVersion;
                },
                fail: function () {
                },
                complete: function () {
                }
            });
        },

    }
});