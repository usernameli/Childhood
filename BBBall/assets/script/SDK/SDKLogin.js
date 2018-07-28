cc.Class({
    extends: cc.Component,
    statics: {

        SESSION_KEY: 'BB_SESSION_STORAGE',

        login() {
            if (cc.wwx.IsWechatPlatform()) {
                this.getSystemInfo();
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
            let local_uuid = cc.wwx.Util.getLocalUUID();
            let dataObj = {
                snsId: 'wxapp:' + local_uuid,
                appId: cc.wwx.SystemInfo.appId,
                wxAppId: cc.wwx.SystemInfo.wxAppId,
                clientId: cc.wwx.SystemInfo.clientId,
                gameId: cc.wwx.SystemInfo.gameId,
                imei: null,
                uuid: local_uuid,
                invite_id: cc.wwx.UserInfo.invite_id || 0
            };

            let sdkPath = cc.wwx.SystemInfo.loginUrl;
            let completeUrl = sdkPath + 'open/v6/user/loginBySnsIdNoVerify' + '?' + cc.wwx.Util.dataToUrlStr(dataObj);
            let token = cc.sys.localStorage.getItem(self.SESSION_KEY);

            if (token && token !== '') {
                dataObj = {
                    appId: cc.wwx.SystemInfo.appId,
                    wxAppId: cc.wwx.SystemInfo.wxAppId,
                    clientId: cc.wwx.SystemInfo.clientId,
                    gameId: cc.wwx.SystemInfo.gameId,
                    imei: null,
                    uuid: local_uuid,
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
                        cc.sys.localStorage.setItem(self.SESSION_KEY, '');
                        // 失败
                        setTimeout(function () {
                            self.login();
                        }, 5000);
                        return;
                    }
                    // 保存用户名/用户ID/用户头像
                    let result = checkData.result;
                    self.updateUserInfo(result, local_uuid);

                },
                onFail: function (params) {
                    cc.wwx.OutPut.log('onFail loginSdk:', params);
                    cc.sys.localStorage.setItem(self.SESSION_KEY, '');
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
                    cc.wwx.OutPut.log(null, 'wx login success, params:' + JSON.stringify(params));
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
                    if (params.code) {
                        let code = params.code;
                        that.loginTuyooWithCode(code, {});
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
                    "purl": "http://ddz.image.tuyoo.com/avatar/head_female_0.png",
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
        loginTuyooWithCode: function (code, userInfo) {
            if (!cc.wwx.IsWechatPlatform()) {
                return;
            }
            // 微信授权成功后使用code登录途游服务器
            wx.showShareMenu({
                withShareTicket: true
            });

            let local_uuid = cc.wwx.Util.getLocalUUID();
            cc.wwx.OutPut.log("local_uuid:", local_uuid);
            let sdkPath = cc.wwx.SystemInfo.loginUrl;
            let dataObj = {
                appId: cc.wwx.SystemInfo.appId,
                wxAppId: cc.wwx.SystemInfo.wxAppId,
                clientId: cc.wwx.SystemInfo.clientId,
                gameId: cc.wwx.SystemInfo.gameId,
                snsId: 'wxapp:' + code,
                imei: null,
                uuid: local_uuid,
                //以下为上传玩家的微信用户信息
                //nickName: userInfo.nickName,
                //avatarUrl: userInfo.avatarUrl,
                scene_id: cc.wwx.UserInfo.scene_id || "",
                scene_param: cc.wwx.UserInfo.scene_param || "",
                invite_id: cc.wwx.UserInfo.invite_id || 0
            };
            if (userInfo && userInfo.nickName) {
                dataObj.nikeName = userInfo.nickName;
            }

            if (userInfo && userInfo.avatarUrl) {
                dataObj.avatarUrl = userInfo.avatarUrl;
            }

            cc.wwx.OutPut.log("SDKLogin", " *-*-*-*-*-  dataobj:  " + JSON.stringify(dataObj));

            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeLoginSDKStart, [code, local_uuid, userInfo.nickName]);
            let that = this;
            wx.request({
                url: sdkPath + 'open/v6/user/loginBySnsIdNoVerify',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: dataObj,
                method: 'GET',

                success: function (params) {
                    cc.wwx.OutPut.log(null, 'tuyoo login success, params:' + JSON.stringify(params));
                    let checkData = params.data;
                    if (checkData.error && checkData.error.code == 1) {
                        console.log('tuyoo login fail...');
                        return;
                    }
                    // 保存用户名/用户ID/用户头像
                    let result = checkData.result;

                    that.updateUserInfo(result, local_uuid, code);


                },

                fail: function (params) {
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeLoginSDKFailed, [code, local_uuid, userInfo.nickName]);
                    cc.wwx.OutPut.log(null, 'tuyoo login fail, params:' + JSON.stringify(params));
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
            cc.wwx.OutPut.log(null, 'userId:' + cc.wwx.UserInfo.userId + ' userName:' + cc.wwx.UserInfo.userName + ' userPic:' + cc.wwx.UserInfo.userPic);
            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeLoginSDKSuccess, [code, local_uuid, result.userName, result.userId]);
            // 发送登录成功事件
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.SDK_LOGIN_SUCCESS);
            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_LOGIN_SUCCESS);
            let token = result.token;
            cc.wwx.OutPut.log("updateUserInfo", 'token:' + token);
            if(cc.wwx.IsWechatPlatform())
            {
                wx.setStorage({
                    key: this.SESSION_KEY,
                    data: token
                });
            }
            else
            {

                cc.sys.localStorage.setItem(this.SESSION_KEY, token);

            }

            this.initWebSocketUrl(result);


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
                if (cc.wwx.SystemInfo.loginUrl.indexOf("https://") > -1) {
                    webSocketUrl = 'wss://' + ip + '/';
                }
                else {
                    webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
                }
                cc.wwx.OutPut.log(null, 'webSocketUrl:' + webSocketUrl);
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

        wechatAuthorize: function () {
            if (!cc.wwx.IsWechatPlatform()) {
                return;
            }
            wx.getSetting({
                success: function (res) {
                    if (!res.authSetting['scope.userInfo']) {
                        cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeAuthorizationStart, []);
                        wx.authorize({
                            scope: "scope.userInfo",
                            success: function () {
                                cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeAuthorizationSuccess, []);
                                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.START_AUTHORIZATION_SUCCESS);
                            },
                            fail: function () {
                                cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeAuthorizationFailed, []);
                                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.START_AUTHORIZATION_FAILED);
                            },
                            complete: function () {
                            }
                        });
                    }
                    else {
                        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.START_AUTHORIZATION_SUCCESS);
                    }
                }
            })
        },

        compareSDkVersion: function (SDkVersion) {
            if (SDkVersion == "2.0.1") {
                return true;
            }
            let data = SDkVersion.split(".");
            let index = 2;
            console.log("data" + JSON.stringify(data));
            for (let i = 0; i < data.length; i++) {
                let per = parseInt(data[i]);
                if (i == 0) {
                    index = 2;
                } else if (i == 1) {
                    index = 0;
                } else {
                    index = 1;
                }
                console.log("per" + per + "index" + index);
                if (per > index) {
                    return true;
                } else if (per < index) {
                    return false;
                } else {
                    continue;
                }
            }
            return false;
        },

        wxInviteFriendShare: function (titlestr, imageUrl, successCallBackFun, failCallBackFun) {
            let query = minihall.GlobalFuncs.getInvitedQuery();
            wx.shareAppMessage({
                title: titlestr,
                imageUrl: imageUrl,//5:4
                query: query,//'key1=val1&key2=val2',
                success: function (result) {
                    cc.wwx.OutPut.log(null, "shareAppMessage+++++++++++++++++" + JSON.stringify(result));
                    if (successCallBackFun) {
                        successCallBackFun(result);
                    }
                },
                fail: function () {
                    if (failCallBackFun) {
                        failCallBackFun();
                    }
                    cc.wwx.OutPut.log(null, JSON.stringify(arguments));
                },
                complete: function () {
                }
            })
        },

        wxShare: function (titlestr, imageUrl, successCallBackFun, failCallBackFun, isforce, sharePoint) {
            wx.shareAppMessage({
                title: titlestr,
                imageUrl: imageUrl,//5:4
                query: 'shareid=' + cc.wwx.UserInfo.userId,
                success: function (result) {
                    if (isforce == true)
                        result["sharePoint"] = sharePoint
                    cc.log("tuyoo wxShare = " + JSON.stringify(result))
                    cc.log("sharePoint = " + sharePoint)
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.SHARE_RESULT, result);

                    cc.wwx.OutPut.log(null, "shareAppMessage+++++++++++++++++" + JSON.stringify(result));
                    if (successCallBackFun) {
                        successCallBackFun(result);
                    }
                },
                fail: function () {
                    if (failCallBackFun) {
                        failCallBackFun();
                    }
                    cc.wwx.OutPut.log(null, JSON.stringify(arguments));
                },
                complete: function () {
                }
            })
        },
        WechatInterfaceInit: function () {
            if (cc.wwx.IsWechatPlatform()) {
                /**
                 * 小程序回到前台,具体逻辑自己实现
                 */
                wx.onShow(function (result) {
                    // {"0":{"scene":1044,"shareTicket":"beecdf9e-e881-492c-8a3f-a7d8c54dfcdb","query":{}}}  (从后台切到前台才有shareTicket,启动时没有)
                    cc.wwx.OutPut.log('', "+++++++++++++++++onShow+++++++++++++++++" + JSON.stringify(result));
                    //取相关参数
                    let scene = result.scene;
                    let query = result.query;
                    let scenePath = '';
                    //来源处理
                    cc.wwx.UserInfo.scene_id = scene;
                    cc.wwx.UserInfo.scene_param = query.from || "";
                    cc.wwx.UserInfo.invite_id = query.shareid || 0;
                    cc.wwx.StateInfo.isOnForeground = true;
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.GAME_SHOW, result);

                    if (query && query.shareid) {
                        //进行相应的处理和记录
                        cc.wwx.ShareInfo.queryId = query.shareid;
                        cc.wwx.OutPut.log("fengbing", "========share id : " + cc.wwx.ShareInfo.queryId);
                    }

                    if (query && query.gdt_vid && query.weixinadinfo) {
                        //从广点通广告跳过来的，from的开头加入gdt标识区分
                        let from = "gdt." + query.weixinadinfo;
                        cc.wwx.UserInfo.scene_param = from;
                        cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserFrom, [scene, from]);
                    }
                    else if (query && query.sourceCode) {
                        //从小程序消息卡片中点入,该场景为"点击用户分享卡片进入游戏注册时，分享用户的user_id直接当做场景参数放在param02，param03和param04分别代表分享点id和分享图文id"
                        //let query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
                        cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserFrom, [scene, query.shareid, query.sourceCode, query.imageType]);
                    } else {
                        if (cc.wwx.Util.isSceneQrCode(scene)) {
                            //从小程序码进入,相关见文档https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/qrcode.html
                            if (query.hasOwnProperty('scene')) {
                                scenePath = query.scene;
                            } else if (result.hasOwnProperty('path')) {
                                scenePath = result.path;
                            }
                            scenePath.replace(".html", "");     //生成时可能会在path后面添加.html
                            scenePath = decodeURIComponent(scenePath);
                            cc.wwx.UserInfo.scene_param = scenePath;
                            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserFrom, [scene, scenePath]);
                        } else {
                            //场景值和场景参数分别记录到可选参数param01和param02当中，如param01=1058，param02=tuyouqipai
                            //场景参数由项目组接入推广渠道时配置，如公众号dacihua、tuyouqipai，二维码填写企业或个人标识
                            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserFrom, [scene, query.from]);
                        }
                    }
                    this.login();
                });
                /**
                 * 小程序进入后台
                 */
                wx.onHide(function () {
                    cc.wwx.UserInfo.scene_id = 0;
                    cc.wwx.StateInfo.isOnForeground = false;
                    let date = new Date().getTime();
                    cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.GAME_HIDE);
                    cc.wwx.OutPut.log('', "+++++++++++++++++onHide+++++++++++++++++");
                    // cc.wwx.TCPClient.close();
                });

                let getNetSuccess = function (res) {
                    if (res.hasOwnProperty('isConnected')) {
                        cc.wwx.StateInfo.networkConnected = res.isConnected;
                    }
                    else if (res.hasOwnProperty('errMsg')) {
                        cc.wwx.StateInfo.networkConnected = res.errMsg == 'getNetworkType:ok'
                    }
                    else {
                        cc.wwx.StateInfo.networkConnected = res.networkType != 'none';
                    }

                    cc.wwx.StateInfo.networkType = res.networkType;//wifi,2g,3g,4g,none,unknown
                };

                wx.getNetworkType({
                    success: getNetSuccess
                });

                wx.onNetworkStatusChange(getNetSuccess);

                wx.onError(function (res) {
                    let d = new Date();
                    let errMsg = 'userId:' + cc.wwx.UserInfo.userId + 'time:' + d.toDateString() + ' ' + d.toTimeString() + ';' + res.message;
                    cc.wwx.BiLog.uploadLogTimely(errMsg);
                });

            }
        }
    }
});