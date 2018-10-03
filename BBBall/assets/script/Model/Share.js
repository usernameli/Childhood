cc.Class({
    extends:cc.Component,
    statics: {
        burialShareList: [],//埋点分享列表
        burialAutoShareMap: {},

        shareData: null,//当前分享数据
        customDataMap: {},
        rewardGetList: [],//等待向服务器发送分享结果的分享列表

        LOCAL_STORAGE_SHARE_KEY: "LOCAL_STORAGE_SHARE_KEY",

        localShareRecord: {},
        init: function () {
            //读取今天的分享情况
            var recordStr = cc.wwx.Storage.getItem(this.LOCAL_STORAGE_SHARE_KEY);
            if (!recordStr) {
                this.localShareRecord = {};
                // this.print(' localShareRecord:{}');
            } else {
                // this.print(' localShareRecord:'+recordStr);
                this.localShareRecord = JSON.parse(recordStr);
            }
            this.refreshLocalShare();
        },

        setLocalShareRecord: function (burialId, groupId) {
            if (!burialId || !groupId) {
                this.print(' setLocalShareRecord error');
                return;
            }
            var record = this.localShareRecord[burialId];
            if (!record) {
                record = {};
                this.localShareRecord[burialId] = record;
            }

            var date = new Date();
            var curTime = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            this.print(' setLocalShareRecord ' + burialId + ' curTime: ' + curTime);
            if (record.time != curTime) {
                //过期数据,清空
                this.print(' setLocalShareRecord ' + burialId + ' overdue:' + record.time);
                record.time = curTime;
                record.groups = [{groupId: groupId, count: 1}];
            } else {
                var exist = false;
                for (var i = 0; i < record.groups.length; i++) {
                    if (record.groups[i]['groupId'] == groupId) {
                        record.groups[i]['count']++;
                        this.print(' setLocalShareRecord ' + burialId + ' update count:' + record.groups[i]['count']);
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    record.groups.push({groupId: groupId, count: 1});
                }
            }
            this.saveShareRecordToLocaL();
        },

        checkShareTodayVaild: function (burialId, groupId) {
            if (!burialId || !groupId) {
                this.print(' checkShareTodayVaild error');
                return true;
            }
            this.print(' checkShareTodayVaild burialId:' + burialId + ", groupId:" + groupId);

            var record = this.localShareRecord[burialId];
            if (!record) {
                //一直都没有分享过,肯定是有效的分享
                this.print(' checkShareTodayVaild ' + burialId + " first share.");
                return true;
            }
            var date = new Date();
            var curTime = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            if (record.time != curTime) {
                //今天没有分享过
                this.print(' checkShareTodayVaild ' + burialId + " first share toaday.");
                return true;
            } else {
                for (var i = 0; i < record.groups.length; i++) {
                    this.print(' checkShareTodayVaild record:' + JSON.stringify(record.groups[i]));
                    if (record.groups[i]['groupId'] == groupId) {
                        //今天已经分享过了,对比已经分享的次数
                        return false;
                    }
                }
                //今天没有分享过
                this.print(' checkShareTodayVaild ' + burialId + " not share toaday.");
                return true;
            }
        },

        saveShareRecordToLocaL: function () {
            var str = JSON.stringify(this.localShareRecord);
            this.print("saveShareRecordToLocaL :" + str);
            cc.wwx.Storage.setItem(this.LOCAL_STORAGE_SHARE_KEY, str);
        },

        refreshLocalShare: function () {
            var changed = false;
            for (var typ in this.localShareRecord) {
                var record = this.localShareRecord[typ];
                var date = new Date();
                var curTime = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
                if (record.time != curTime) {
                    //过期数据,清空
                    this.print(' refreshLocalShare ' + typ + " do refresh.");
                    record.time = curTime;
                    record.groups = [];
                    changed = true;
                }
            }

            if (changed) {
                this.saveShareRecordToLocaL();
            }
        },

        cleanup: function () {
            this.burialShareList = [];
        },

        print: function (str) {
            cc.wwx.OutPut.log("[cc.wwx.Share] " + str);
        }
        ,
        parse: function (param) {
            var result = param['result'];
            let action = result["action"];

            var share = new cc.wwx.ShareData();
            share.parseBurial(result['conf']);
            share.burialId = result['action'];
            if(share.burialId === cc.wwx.BurialShareType.DailyInviteFriend)
            {
                //日常分享好友
                share.whereToReward =cc.wwx.ShareWhereReward.Friend
            }
            else
            {
                //日常分享群
                share.whereToReward =cc.wwx.ShareWhereReward.Group


            }

            share.parseShare(result['conf']);
            this.shareData = share;

            this.runShare(share);


        },



        getShareRewards: function () {
            var rewardGetList = this.rewardGetList;
            if (!rewardGetList || rewardGetList.length == 0) return;
            this.rewardGetList = [];
            //连发消息会不会有问题?通常来说rewardGetList只会有一个数据
            for (var i = 0; i < rewardGetList.length; i++) {
                var bid = rewardGetList[i]['burialId'];
                var res = rewardGetList[i]['result'];
                var pid = rewardGetList[i]['pointId'];
                var that = this;

                if (res)
                {
                    //通过分享票据获取分享群ID
                    wx.getShareInfo({
                        shareTicket: res,
                        success: function (obj) {
                            var encryptedData = obj.encryptedData;
                            that.print("encryptedData :" + encryptedData);

                            var decryptedData = cc.wwx.Util.wxDecrypt(cc.wwx.UserInfo.wxgame_session_key, obj.iv, obj.encryptedData);
                            that.print("decryptedData :" + decryptedData);
                            decryptedData = JSON.parse(decryptedData);
                            var groupId = decryptedData.openGId;
                            var isShareGroupId = false;
                            if (!that.checkShareTodayVaild(bid, groupId)) {

                                cc.wwx.TipManager.showMsg('今天已经分享过这个微信群咯');
                                isShareGroupId = true;
                            }

                            that.setLocalShareRecord(bid, groupId);
                            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS, {
                                burialId: bid,
                                result: groupId,
                                shareTicket: res,
                                isShareGroupId:isShareGroupId,
                                pointId: pid
                            });
                        },
                        fail: function () {
                            cc.wwx.OutPut.log("getShareInfo fail!!!!!!");
                            // cc.wwx.TCPMSG.getShare3Reward(pid, cc.wwx.ShareWhereReward.Group);
                            cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_WX_SHARE_FAILED);
                            //     burialId: bid,
                            //     result: null,
                            //     shareTicket: res,
                            //     pointId: pid
                            // });
                        }
                    });
                }
                else
                {
                    //好友分享
                    // cc.wwx.TCPMSG.getShare3Reward(pid, cc.wwx.ShareWhereReward.Friend);
                    // cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS, rewardGetList[i]);
                    cc.wwx.OutPut.log("getShareRewards bid ",bid);
                    if(bid === cc.wwx.BurialShareType.DailyInviteFriend);
                    {
                        cc.wwx.TipManager.showMsg('分享好友成功,赶快提醒好友加入游戏吧');

                    }

                }
            }
        },

        /*
        * 执行分享
        * shareDataOrBurialType: 支持以下三种数据格式
        *  (1)cc.wwx.BurialShareType - 不完整数据,需要请求,customData附带自定义参数
        *  (2)burialShareList列表元素 - 不完整数据,需要请求,customData附带自定义参数
        *  (3)完整分享数据,customData附带自定义参数
        * */
        runShare: function (share, customData) {

            let shareData = share.getShareData();
            cc.wwx.OutPut.log("runShare: ",JSON.stringify(shareData));
            this.print('ready share');
            var that = this;
            var success = function (res) {

                var result = res.shareTickets ? cc.wwx.ShareWhereReward.Group : cc.wwx.ShareWhereReward.Friend;
                cc.wwx.OutPut.log('[cc.wwx.Share]', 'whereToReward=' + shareData["whereToReward"] + ' result=' + result);
                if (shareData["whereToReward"] != cc.wwx.ShareWhereReward.All && shareData["whereToReward"] != result) {
                    // 不要此类提示
                    var str = shareData["whereToReward"] === cc.wwx.ShareWhereReward.Group ? '群' : '好友';
                    cc.wwx.TipManager.showMsg('只有分享到微信'+str+'才可获得奖励哟');
                }

                that.rewardGetList.push({pointId:shareData["pointId"],result:res.shareTickets?res.shareTickets[0]:null,burialId:shareData['burialId']});

                that.record_share_success_behavior(shareData);

                if (cc.wwx.TCPClient.opened) {
                    // 分享发奖
                    cc.wwx.Share.getShareRewards();
                }
            };

            var fail = function (res) {
                cc.wwx.TipManager.showMsg('分享失败');
            };

            var complete = function (res) {
                // cc.wwx.TipManager.showMsg('分享完成');

            };

            var sConfig = cc.wwx.BurialShareConfig[shareData["burialId"] || "0"];
            if (shareData['paintConfig'] && sConfig && sConfig.painting) {
                //截屏分享
                if (!shareData['isPainted']) {
                    cc.wwx.Util.runPaintingShare(shareData['paintConfig'], shareData);
                    return;
                }
            }

            var shareQuery = cc.wwx.Util.deepCopy(shareData["queryJson"]) || {};
            shareQuery['pointId'] = shareData["pointId"];
            shareQuery["burialId"] = shareData["burialId"] || "0";
            shareQuery.shareId = shareData.shareId;
            cc.wwx.WeChat.shareWXMsg(shareData["title"], shareData["pic"], shareQuery, shareData["pointId"], success, fail, complete);

            this.record_invoke_share_behavior(shareData);
        },

        record_invoke_share_behavior: function (shareData) {
            // cc.log('===[develop]===', 'record_invoke_share_behavior | ' + JSON.stringify(shareData));
            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeShare,
                [shareData.pointId || 0, 1, shareData.shareId || 0, shareData.burialId || 0]);
        },

        record_share_success_behavior: function (shareData) {
            // cc.log('===[develop]===', 'record_share_success_behavior | ' + JSON.stringify(shareData));
            cc.wwx.BiLog.clickStat(cc.wwx.clickStatEventType.clickStatEventTypeShare,
                [shareData.pointId || 0, 2, shareData.shareId || 0, shareData.burialId || 0]);
        },

        /**
         * 封装查询数据
         */
        jsonToQuery: function (queryJson) {
            queryJson = queryJson || {};
            var str = '';
            for (var key in queryJson) {
                if (str != '') str += '&';
                str += (key + '=' + queryJson[key]);
            }
            return str;
        },

        /*获取微信菜单分享数据*/
        getWXShareMenuData: function () {
            var that = cc.wwx.Share;
            var whereToReward = cc.wwx.ShareWhereReward.All;
            var pointId = 0;
            var url = wxDownloader.REMOTE_SERVER_ROOT + '/share/share_default.jpg';
            var title = ' 发现一款很好玩的弹弹球游戏，快来一起看看！';

            var shareQueryStr = that.jsonToQuery({
                'inviteCode': cc.wwx.UserInfo.userId,
                'pointId': pointId,
                "burialId": cc.wwx.BurialShareType.Default,
                'shareId': 0,
            });

            return {
                'title': title,
                'imageUrl': url,
                'query': shareQueryStr,
                'success': function (obj) {
                    var result = obj.shareTickets ? cc.wwx.ShareWhereReward.Group : cc.wwx.ShareWhereReward.Friend;
                    cc.wwx.OutPut.log('[cc.wwx.Share]', 'whereToReward=' + whereToReward + ' result=' + result);
                    if (whereToReward != cc.wwx.ShareWhereReward.All && whereToReward != result) {
                        // var str = whereToReward == cc.wwx.ShareWhereReward.Group ? '群' : '好友';
                        // cc.wwx.TipManager.showMsg('只有分享到微信' + str + '才可获得奖励哟');
                    } else {
                        that.rewardGetList.push({
                            pointId: pointId,
                            result: obj.shareTickets ? obj.shareTickets[0] : null,
                            burialId: cc.wwx.BurialShareType.Default
                        });

                        if (cc.wwx.TCPClient.opened) {
                            // 分享发奖
                            cc.wwx.Share.getShareRewards();
                        }
                    }
                },
                'fail': function (obj) {
                    cc.wwx.OutPut.warn('onShareAppMessage: fail:' + JSON.stringify(obj));
                },
                'complete': function (obj) {
                    that.print('onShareAppMessage: complete:' + JSON.stringify(obj));
                    // that.record_invoke_share_behavior(share);
                }
            }
        }
    }
})