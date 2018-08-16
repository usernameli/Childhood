cc.Class({
    extends:cc.Component,
    statics:{
        init:function() {
            if (!CC_WECHATGAME) { return; }
            var self = this;
            var isHide = false;

            // 后台进入前台
            wx.onShow(function(res){
                try {

                    cc.wwx.OutPut.warn('onShow:' + JSON.stringify(res));
                    cc.wwx.UserInfo.query = cc.wwx.Util.deepCopy(res.query);
                    cc.wwx.UserInfo.wxEnterInfo = res;
                } catch (e) {
                    cc.wwx.OutPut.err('Init.err.1 :' + JSON.stringify(e));
                }

                try {
                    /**
                     * 导量统计
                     */
                    self.guideStatistical();

                } catch (e) {
                    cc.wwx.OutPut.err('Init.err.2 :' + JSON.stringify(e));
                }

                self.updateGame();

                self.processPaymentLogic();

                // 常亮
                wx.setKeepScreenOn({
                    'keepScreenOn' : true
                });

                if (!isHide) return;
                isHide = false;

                if (cc.game.isPaused) {
                    cc.game.resume();
                }

                cc.wwx.TCPClient.resume();

                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_TO_SHOW);
            });
            // 进入后台
            wx.onHide(function() {
                cc.wwx.OutPut.warn('onHide');
                isHide = true;
                cc.game.pause();
                cc.wwx.TCPClient.pause();

                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_TO_HIDE);
            });
            // // 错误信息收集
            // wx.onError(function(res){
            //    var message = res.message;
            //    var stack = res.stack;
            //    cc.wwx.OutPut.err('[WX]', stack, message);
            // });

            wx.getSystemInfo({
                success:function(res) {
                    cc.wwx.OutPut.info('wx.getSystemInfo success:', JSON.stringify(res));
                    cc.wwx.SystemInfo.SysInfo = res;
                    if (res.model.indexOf('iPhone X') >= 0) {
                        cc.wwx.SystemInfo.SYS.phoneType = 1;
                    }

                    if (res.brand.indexOf('Apple')>=0 || res.model.indexOf('iPhone')>=0 || res.system.indexOf('iOS')>=0){
                        cc.wwx.SystemInfo.SYS.os = "iOS";
                    } else {
                        cc.wwx.SystemInfo.SYS.os = "Android";
                    }

                    cc.wwx.SystemInfo.SYS.wechatType = res.version;
                    cc.wwx.SystemInfo.SYS.SDKVersion = res.SDKVersion;
                    // 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50)
                    cc.wwx.SystemInfo.SYS.benchmarkLevel = res.benchmarkLevel;

                    cc.wwx.SystemInfo.screenWidth = res.screenWidth;
                    cc.wwx.SystemInfo.screenHeight = res.screenHeight;
                    cc.wwx.SystemInfo.windowWidth = res.windowWidth;
                    cc.wwx.SystemInfo.windowHeight = res.windowHeight;

                    if (typeof cc.wwx.SystemInfo.SYS.benchmarkLevel != 'undefined') {
                        if (cc.wwx.SystemInfo.SYS.benchmarkLevel == -2 || cc.wwx.SystemInfo.SYS.benchmarkLevel == 0) {
                            wx.setPreferredFramesPerSecond(20);
                        } else if (cc.wwx.SystemInfo.SYS.benchmarkLevel >= 1) {
                            var value = Math.floor(0.8 * cc.wwx.SystemInfo.SYS.benchmarkLevel + 20);
                            wx.setPreferredFramesPerSecond(Math.min(60, value));
                        } else {
                            wx.setPreferredFramesPerSecond(30);
                        }
                    } else {
                        var isNewiPhone = false;
                        var newiPhones = ['iPhone X', 'iPhone 8', 'iPhone 7'];
                        for (var i = 0; i < newiPhones.length; i++) {
                            if(res.model.indexOf(newiPhones[i]) >= 0) {
                                isNewiPhone = true;
                                wx.setPreferredFramesPerSecond(60);
                                break;
                            }
                        }
                        if (!isNewiPhone) {
                            wx.setPreferredFramesPerSecond(42);
                        }
                    }

                    //上报顺序为微信版本 基础库版本 平台 操作系统版本
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeSubmitVersionInfo,
                        [res.version, res.SDKVersion, res.platform, res.system, res.brand, res.model]);
                },
                fail:function(res) {
                    cc.wwx.OutPut.err('wx.getSystemInfo fail:', JSON.stringify(res));
                }
            });

            wx.getNetworkType({
                success:function(res){
                    cc.wwx.OutPut.info('getNetworkType:' + JSON.stringify(res));
                    cc.wwx.SystemInfo.SYS.networkType = res['networkType'];
                }
            });
        },

        /**
         * 导量统计
         * @param result
         * @private
         */
        guideStatistical:function(){
            var result = cc.wwx.UserInfo.wxEnterInfo;
            if (!result) return;

            //取相关参数
            var scene = result.scene;
            var query = result.query || {};
            var scenePath = '';

            //来源处理
            cc.wwx.UserInfo.scene_id = scene;
            cc.wwx.UserInfo.scene_param = query.from || "";
            cc.wwx.UserInfo.invite_id = query.inviteCode || 0;
            if(query && query.inviteCode) {
                // 从小程序消息卡片中点入,该场景为"点击用户分享卡片进入游戏注册时，分享用户的user_id直接当做场景参数放在param02，param03和param04分别代表分享点id和分享图文id"
                // var query = "inviteCode="+cc.wwx.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+cc.wwx.UserInfo.userName;
                // Card Active 未有userId，Game Start 有useId
                if (query.pointId) {
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserFrom,[scene, query.inviteCode, query.pointId || 0, query.shareId || 0,cc.wwx.UserInfo.userId || 0, query.burialId || 0]);
                }
            } else {
                if(cc.wwx.Util.isSceneQrCode(scene)) {
                    //从小程序码进入,相关见文档https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/qrcode.html
                    if (query.hasOwnProperty('scene')){
                        scenePath = query.scene;
                    } else if(result.hasOwnProperty('path')) {
                        scenePath = result.path;
                    }
                    scenePath = scenePath.replace(".html", "");     //生成时可能会在path后面添加.html
                    scenePath = decodeURIComponent(scenePath);
                    cc.wwx.OutPut.warn('scenePath:' + scenePath);
                    cc.wwx.UserInfo.scene_param = scenePath;
                    cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserFrom,[scene, scenePath]);
                } else {
                    //场景值和场景参数分别记录到可选参数param01和param02当中，如param01=1058，param02=tuyouqipai
                    //场景参数由项目组接入推广渠道时配置，如公众号dacihua、tuyouqipai，二维码填写企业或个人标识
                    var fromStr = query.from;
                    if (typeof fromStr == 'string') {
                        fromStr = fromStr.replace(".html", "");
                        cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeUserFrom,[scene, fromStr]);
                    }
                }
            }
        },

        initShareDefault:function() {
            if (!CC_WECHATGAME) { return; }

            // 转发初始化
            wx.showShareMenu({
                'withShareTicket': true,
                'success': function(res) {
                    cc.wwx.OutPut.log('showShareMenu:', 'success', res);
                    wx.onShareAppMessage(cc.wwx.Share.getWXShareMenuData);
                },
                'fail': function(res) {
                    cc.wwx.OutPut.warn('showShareMenu:', 'fail:', JSON.stringify(res));
                },
                'complete': function(res) {
                    cc.wwx.OutPut.log('showShareMenu:', 'complete:', res);
                }
            });
        },

        shareWXMsg:function(title, imageUrl, queryJson, pointId, successCallback, failCallback, completeCallback) {
            if (!CC_WECHATGAME) { return; }
            queryJson = queryJson || {};
            queryJson['inviteCode'] = cc.wwx.UserInfo.userId;
            queryJson['pointId'] = queryJson['pointId'] || 'xxxxxx';
            wx.shareAppMessage({
                'title': title,
                'imageUrl': imageUrl,
                'query': this.jsonToQuery(queryJson),
                'success': function(res) {
                    cc.wwx.OutPut.info('shareWXMsg:', 'success', JSON.stringify(res));
                    if(successCallback){
                        successCallback(res);
                    }
                },
                'fail': function(res) {
                    cc.wwx.OutPut.warn('shareWXMsg:', 'fail', JSON.stringify(res));
                    failCallback && failCallback(res);
                },
                'complete': function(res) {
                    cc.wwx.OutPut.log('shareWXMsg:', 'complete', JSON.stringify(res));
                    completeCallback && completeCallback(res);
                }
            });
            cc.wwx.OutPut.log('shareWXMsg:', title, imageUrl, this.jsonToQuery(queryJson),pointId);
        },

        updateGame () {
            if (!CC_WECHATGAME) {
                return;
            }
            /**
             * 自动下载更新
             */
            if (typeof wx.getUpdateManager === 'function') {
                const updateManager = wx.getUpdateManager();
                updateManager.onCheckForUpdate(function (res) {
                    // 请求完新版本信息的回调
                    cc.wwx.OutPut.warn('下载更新 hasUpdate：' + JSON.stringify(res));
                });
                updateManager.onUpdateReady(function () {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    // updateManager.applyUpdate();
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启应用？',
                        showCancel: false,
                        success: function (res) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                        }
                    });
                });
                updateManager.onUpdateFailed(function () {
                    // 新的版本下载失败
                    cc.wwx.OutPut.err('onUpdateFailed');
                });
            }
        },

        /**
         *  通知清理内存 ： 并不能保证马上触发回收
         */
        triggerGC () {
            if (!CC_WECHATGAME) {
                return;
            }
            wx.triggerGC();
        },

        openSetting:function() {
            if (!CC_WECHATGAME) { return; }
            wx.openSetting({
                success: function(res) {
                    cc.wwx.OutPut.log('set user info success:', res)
                    if (res.authSetting['scope.userInfo'] == true) {
                        cc.wwx.SDKLogin.wxUserInfo2({setting:true});
                    }
                },
                fail: function(res) {
                    cc.wwx.OutPut.log('set user info fail:', res)
                },
                complete: function(res) {
                    cc.wwx.OutPut.log('set user info complete:', res)
                }
            });
        },

        purchase : function(prodId, prodPrice, prodName, prodCount) {
            if (!CC_WECHATGAME) {
                return;
            }

            if (cc.sys.os === cc.sys.OS_IOS) {
                cc.wwx.PopWindowManager.popWindow("prefab/PopBoxWindow","PopBoxWindow",{text:'微信虚拟支付暂不支持IOS平台'});

                return;
            }
            let inputInfo = `prodId=${prodId} prodPrice=${prodPrice} prodName=${prodName} prodCount=${prodCount}`;
            cc.wwx.OutPut.info('===[develop]===', inputInfo);
            wx.request({
                url     : cc.wwx.SystemInfo.url + 'open/v4/pay/order',
                header  : {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data    : {
                    userId      : cc.wwx.UserInfo.userId,
                    appId       : cc.wwx.SystemInfo.appId,
                    wxAppId     : cc.wwx.SystemInfo.wxAppId,
                    clientId    : cc.wwx.SystemInfo.clientId,
                    imei        : 'null',
                    uuid        : cc.wwx.SystemInfo.uuid,

                    prodId      : prodId,
                    prodName    : prodName,
                    prodCount   : prodCount || 1,
                    prodPrice   : prodPrice,
                    chargeType  : "wxapp.iap",
                    gameId      : cc.wwx.SystemInfo.gameId,
                    appInfo     : '',
                    mustcharge  : 1,
                },
                method  : 'POST',
                success : function(params) {
                    cc.wwx.OutPut.info('===[develop]===', 'request pay-sdk | callback | ' + JSON.stringify(params));

                    var results = params.data.result;
                    if (results && results.code == 0) {
                        cc.wwx.OutPut.info('===[develop]===', 'request pay-sdk | success');

                        var chargeInfo = results.chargeInfo;
                        var chargeData = chargeInfo.chargeData;

                        wx.requestMidasPayment({
                            mode        : chargeData.mode,
                            env         : chargeData.env,
                            offerId     : chargeData.offerId,
                            buyQuantity : 10 * chargeInfo.chargeTotal,
                            platform    : chargeData.platform,
                            currencyType: "CNY",
                            zoneId      : chargeData.zoneId,
                            success     : function(params) {
                                cc.wwx.OutPut.info('===[develop]===', 'requestMidasPayment | success | ' + JSON.stringify(params));

                                this._pushPayment({
                                    url     : chargeData.notifyUrl,
                                    orderId : chargeData.platformOrderId
                                });
                            },
                            fail        : function(params) {
                                cc.wwx.OutPut.err('===[develop]===', inputInfo, 'requestMidasPayment | failed | [2] |' + JSON.stringify(params));
                                // 取消订单
                                wx.request({
                                    url: cc.wwx.SystemInfo.url + 'open/v4/pay/cancelorder',
                                    header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                    },
                                    data: {
                                        platformOrderId: chargeData.platformOrderId,
                                        appId: cc.wwx.SystemInfo.appId,
                                        wxAppId: cc.wwx.SystemInfo.wxAppId,
                                        userId: cc.wwx.UserInfo.userId,
                                        clientId: cc.wwx.SystemInfo.clientId,
                                        payType: "wxapp.iap"
                                    },
                                    method: 'POST',
                                    success: function(params) {
                                        cc.wwx.OutPut.info('===[cancelorder]===', 'request : ' + JSON.stringify(params));
                                    },
                                    fail    : function(params) {
                                        cc.wwx.OutPut.err('===[cancelorder]===', 'request failed :' + JSON.stringify(params));
                                    },
                                });
                            },
                        });
                    } else {
                        cc.wwx.OutPut.err('===[develop]===', inputInfo, 'request pay-sdk | failed | [0] |' + JSON.stringify(params));
                    }
                },
                fail    : function(params) {
                    cc.wwx.OutPut.err('===[develop]===', inputInfo, 'request pay-sdk | failed | [1] |' + JSON.stringify(params));
                },
            });
        },

        processPaymentLogic : function() {
            if (!this.mPaymentInited) {
                this.mPaymentInited = true;

                this.mPaymentOrderList = [];
                cc.wwx.Storage.getItem(cc.wwx.Storage.Key_Payment_Notify_Order_List, function(value) {
                    this.mPaymentOrderList = value.split('|');
                    // cc.wwx.OutPut.info('===[develop]===', 'Key_Payment_Notify_Order_List |' + JSON.stringify(this.mPaymentOrderList));
                }.bind(this), '')

                this.mPaymentUrl = '';
                cc.wwx.Storage.getItem(cc.wwx.Storage.Key_Payment_Notify_Url, function(value) {
                    this.mPaymentUrl = value;
                    // cc.wwx.OutPut.info('===[develop]===', 'Key_Payment_Notify_Url |' + this.mPaymentUrl);
                }.bind(this), '')

                var onGameServerConnected = function() {
                    this.notifyPaymentOnce();
                }
                cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_RECONNECT, onGameServerConnected, this);
                cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_LOGIN_SUCCESS, onGameServerConnected, this);
            }
        },

        notifyPaymentOnce : function() {
            if (this.mPaymentUrl && this.mPaymentUrl != '' && this.mPaymentOrderList.length > 0) {
                this.onPurchase(this.mPaymentUrl, this.mPaymentOrderList[0]);
            }
        },

        _pushPayment : function(params) {
            this.mPaymentOrderList.push(params.orderId)
            this.mPaymentUrl = params.url;

            cc.wwx.Storage.setItem(cc.wwx.Storage.Key_Payment_Notify_Url, params.url);
            cc.wwx.Storage.setItem(cc.wwx.Storage.Key_Payment_Notify_Order_List, this.mPaymentOrderList.join('|'));

            this.notifyPaymentOnce();
        },

        _popPayment : function(platformOrderId) {
            for (var i = 0; i < this.mPaymentOrderList.length; i++) {
                var orderId = this.mPaymentOrderList[i]
                if (platformOrderId == orderId) {
                    this.mPaymentOrderList.splice(i, 1);
                    break;
                }
            }

            cc.wwx.Storage.setItem(cc.wwx.Storage.Key_Payment_Notify_Order_List, this.mPaymentOrderList.join('|'));

            this.notifyPaymentOnce();
        },

        onPurchase : function(notifyUrl, platformOrderId) {
            cc.wwx.OutPut.info('===[onPurchase]===', `notifyUrl=${notifyUrl} platformOrderId=${platformOrderId}`);

            wx.request({
                url     : notifyUrl,
                header  : {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data    : {
                    userId  : cc.wwx.UserInfo.userId,
                    appId   : cc.wwx.SystemInfo.appId,
                    wxAppId : cc.wwx.SystemInfo.wxAppId,
                    clientId: cc.wwx.SystemInfo.clientId,
                    imei    : 'null',
                    uuid    : cc.wwx.SystemInfo.uuid,
                    platformOrderId : platformOrderId,
                },
                method  : 'POST',
                success : function(params) {
                    cc.wwx.OutPut.info('===[develop]===', 'notify | success | ' + JSON.stringify(params));
                },
                fail    : function(params) {
                    cc.wwx.OutPut.warn('===[develop]===', 'notify | failed | ' + JSON.stringify(params));
                },
                complete: function() {
                    cc.wwx.OutPut.info('===[develop]===', 'notify | complete');
                    this._popPayment(platformOrderId);
                },
            });
        },

        /**
         * 查询数据解析
         */
        queryToJson:function (queryStr) {
            var retJson = {};
            if (!queryStr || queryStr == '') {
                return retJson;
            }
            var queryArr = queryStr.split('&');
            for (var i = 0; i < queryArr.length; i++) {
                var k_v = queryArr[i];
                if (k_v && k_v != '') {
                    var kv = k_v.split('=');
                    if (kv.length == 2) {
                        retJson[kv[0]] = kv[1];
                    }
                }
            }
            return retJson;
        },

        /**
         * 封装查询数据
         */
        jsonToQuery:function(queryJson) {
            queryJson = queryJson || {};
            var str = '';
            for (var key in queryJson) {
                if (str != '') str += '&';
                str += (key + '=' + queryJson[key]);
            }
            return str;
        },

        /**
         * 判断开放域是否可用
         * @returns {boolean}
         */
        isOpenDataContextValid : function() {
            if (!cc.wwx.SystemInfo.SYS.wechatType) {
                return false;
            }

            var type = cc.wwx.SystemInfo.SYS.wechatType.split('.');
            if (type[1] < 6 || (type[1] == 6 && type[2] < 2)) {
                return false;
            }
            return true;
        },

        // 上传排行榜数据
        uploadRank : function(cb) {
            if (!CC_WECHATGAME) { return; }
            if (!this.isOpenDataContextValid()) { return; }

            var openDataContext = wx.getOpenDataContext();
            var params = {
                method : 'upload',
                data : {
                    levelHighStars  : cc.wwx.UserInfo.getHighLevelStars(),
                    levelHighLv     : cc.wwx.UserInfo.gdata["levelHighLv"],
                    userId      : cc.wwx.UserInfo.userId,
                    classicHighScore    : cc.wwx.UserInfo.gdata["classicHighScore"],
                    ball100HighScore      : cc.wwx.UserInfo.gdata["100ballHighScore"],
                    issue       : cc.wwx.UserInfo.mIssue,
                },
            };
            openDataContext.postMessage(params);
            cc.wwx.OutPut.log('uploadRank data:' + JSON.stringify(params));

            this._listen('getFriendCloudStorage', cb);
        },

        getUserInfo : function(cb) {
            if (!CC_WECHATGAME) { return; }
            // 6.2版本以下的微信客户端，不一定拿不到sharedCanvas，待测试
            // if (!this.isOpenDataContextValid()) { return; }

            var openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                method : 'getUserInfo',
                data : {
                },
            })

            this._listen('getUserInfo', cb);
        },

        getGroupRank : function(shareTicket, cb) {
            if (!CC_WECHATGAME) { return; }

            var openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                method : 'getGroupRank',
                data : {
                    shareTicket : shareTicket,
                },
            })

            this._listen('getGroupRank', cb);
        },

        cancelListen:function(key) {
            this.mEvents = this.mEvents || {};
            delete this.mEvents[key];
        },

        _listen : function(event, cb) {
            this.mEvents = this.mEvents || {};
            this.mEvents[event] && cc.warn("微信开放数据域 | 该事件监听已存在，执行覆盖操作!", event);
            this.mEvents[event] = cb;

            this._triggerUpdate();
        },

        _triggerUpdate : function() {
            if (this.mOpenRegionScheduleExist) {
                return;
            }

            cc.wwx.OutPut.log("_triggerUpdate: ",JSON.stringify(this.mEvents));
            cc.wwx.OutPut.log("mOpenRegionScheduleExist: ",this.mOpenRegionScheduleExist);
            var exist = false;
            for (var key in this.mEvents) {
                exist = true;
                break;
            }

            if (exist) {
                this.mOpenRegionScheduleExist = true;
                setTimeout(function() {
                    this.mOpenRegionScheduleExist = false;
                    cc.wwx.OutPut.log("mOpenRegionScheduleExist: ",this.mOpenRegionScheduleExist);

                    var openDataContext = wx.getOpenDataContext();
                    var sharedCanvas = openDataContext.canvas;
                    var context = sharedCanvas.getContext("2d");

                    var removed = [];
                    for (var key in this.mEvents) {
                        cc.wwx.OutPut.log("context[`game_${key}`] : ",context[`game_${key}`]);

                        if (typeof(context[`game_${key}`]) != 'undefined') {
                            this.mEvents[key](context["status_" + key], context["game_" + key]);
                            removed.push(key);
                        }
                    }

                    removed.forEach(function(key) {
                        delete this.mEvents[key]
                    }.bind(this))

                    this._triggerUpdate();
                }.bind(this), 100);
            }
        },

        openCustomerServiceConversation(object){
            if(CC_WECHATGAME && wx.openCustomerServiceConversation) {
                object = object || {};
                wx.openCustomerServiceConversation({
                    sessionFrom: object['sessionFrom'] || '',
                    showMessageCard: object['showMessageCard'] || true,
                    sendMessageTitle: object['sendMessageTitle'] || '回复"充值"获取充值链接',
                    sendMessagePath: object['sendMessagePath'] || '',
                    sendMessageImg: object['sendMessageImg'] || 'https://ddzqn.nalrer.cn/ddz/share/180519_10.jpg',
                    success: object['success'] || null,
                    fail: object['fail'] || null,
                    complete: object['complete'] || null
                })
            } else {
                cc.wwx.TipManager.showMsg('微信版本过低，请升级微信');
            }
        }
    }
})