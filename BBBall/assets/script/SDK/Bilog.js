/**
 * Created by xiaochuntian on 2018/5/2.
 */


cc.Class({
    extends: cc.Component,
    statics: {


        /**
         * 上传实时log,富豪斗地主用此接口上传错误情况下的日志
         * @param logtxt:log内容
         */
        uploadLogTimely: function (logtxt) {
            return;
            if (!cc.wwx.StateInfo.networkConnected) {
                cc.wwx.OutPut.log('cc.wwx.BiLog', 'net error!');
                return;
            }
            if (logtxt) {
                var header = ['Content-Type:text/plain'];
                var configObj = {
                    'url': cc.wwx.SystemInfo.errorLogServer + '?cloudname=' + cc.wwx.SystemInfo.cloudId + '.' + cc.wwx.SystemInfo.intClientId,
                    'header': header,
                    'postData': logtxt,
                    'callback': null
                };
                cc.wwx.HttpUtil.httpPost(configObj, 'POST');
            }
        },

        getSystemInfo: function () {
            this.cloud_id = cc.wwx.SystemInfo.cloudId;   //独立服务id
            this.rec_type = '1';   //日志类型
            this.rec_id = '0'; //日志记录id
            this.receive_time = '0'; // 日志接收时间  输出日志时统一填0，BI服务会在接收时添加
            this.user_id = cc.wwx.UserInfo.userId || '0';      //用户id
            this.game_id = cc.wwx.SystemInfo.gameId;      //游戏id
            this.client_id = cc.wwx.SystemInfo.clientId;
            this.device_id = cc.wwx.Util.getLocalUUID();	//device id
            this.ip_addr = '#IP';// ip地址	占位--服务器处理
            this.nettype = "0"; //网络状况
            this.phone_maker = "0"; //手机制造商
            this.phone_model = cc.wwx.UserInfo.model; //手机型号
            this.phone_carrier = "0";//手机运营商
            this.reserved = '0';
        },
        /*BI组打点
         参数1是事件id，参数2是[],内含扩展参数
         60001事件id
         在查询工具，cloud id+game id+事件id即可找到,GDSS有前端日志查询工具

         */
        uploadClickStatLogTimely: function (logtxt) {
            var callbackObj = this;
            if (logtxt != undefined && logtxt != '') {
                var header = ['Content-Type:text/plain'];
                var configObj = {
                    'url': cc.wwx.SystemInfo.biLogServer,
                    'headers': header,
                    'postData': logtxt,
                    'obj': callbackObj,
                    'tag': null,
                    'callback': null
                };
            }
            return;
            cc.wwx.HttpUtil.httpPost(configObj, 'POST');
        },

        /**
         * 打点接口
         * @param eventId      打点事件
         * @param ParamsList   额外参数,最多10位,参见bi组文档说明
         */
        clickStat: function (eventId, paramsList) {
            return;
            if (cc.wwx.StateInfo.debugMode) {
                return;
            }
            paramsList = paramsList || [];
            var dyeparams = [];
            if (paramsList.length < 10) {
                for (var i = 0; i < 9; i++) {
                    if (i < paramsList.length) {
                        dyeparams.push(paramsList[i]);
                    }
                    else {
                        dyeparams.push(0);
                    }
                }
            }
            else {
                dyeparams = paramsList;
            }
            cc.wwx.OutPut.log('BI打点', "eventid= " + eventId + " 描述 = " + JSON.stringify(dyeparams));
            var bilog = this.assemblelog(eventId, dyeparams);
            this.uploadClickStatLogTimely(bilog + '\n');
        },

        /**
         * BIlog拼接
         * @param eventid
         * @param paramsarr
         * @returns {*}
         */
        assemblelog: function (eventid, paramsarr) {
            var time = new Date().getTime();
            if (time - this._timetag > 60000) {
                this._timetag = time;
                this.nettype = 0;
            }
            var paramstr = paramsarr.join('\t');

            this.getSystemInfo();
            var logStr = this.cloud_id + '\t' + this.rec_type + '\t' + time + '\t' + this.rec_id + '\t' + this.receive_time +
                '\t' + eventid + '\t' + this.user_id + '\t' + this.game_id + '\t' + this.client_id + '\t' + this.device_id + '\t' +
                this.ip_addr + '\t' + this.nettype + '\t' + this.phone_maker + '\t' + this.phone_model + '\t' + this.phone_carrier + '\t' + paramstr + '\t' + this.reserved;

            var str = this.trimTab0(logStr);
            return str;
        },

        /**
         * 精简上报字符串,结尾都是默认值的部分可以去掉,由BI接收端进行补齐
         * @param str
         * @returns {*}
         */
        trimTab0: function (str) {
            if (str == null || str == undefined)
                return '';
            var txt = str.replace(/(\t0)*$/, '');
            return txt;
        },
    }

});
