cc.Class({
    extends:cc.Component,
    statics:{
        tmpLogsForServer:[], // 前段log数据保存，用于上传err
        maxCount: 100,
        index: 0,
        log: function (){
            if (CC_WECHATGAME) {
                return;
                var strLog = this.getDateString() + cc.js.formatStr.apply(cc,arguments);
                this.addLog(strLog);
            }
            if(cc.wwx.OUTPUT_LV & cc.wwx.OUTPUT_LOG){
                let backLog = CC_WECHATGAME ? console.log : cc.log;
                // console.log('===================>>>[Start]');
                if (CC_WECHATGAME) {
                    backLog.call(this,`【${cc.wwx.UserInfo.userId}】【log 】`,this.getDateString(),cc.js.formatStr.apply(cc,arguments));
                } else {
                    backLog.call(this,`【${cc.wwx.UserInfo.userId}】【log 】`,this.getDateString(),this.stack(2),cc.js.formatStr.apply(cc,arguments));
                }
                // console.log('<<<===================[End]\r\n');
            }
        },

        info: function () {
            if (CC_WECHATGAME) {
                return;
                var strLog = this.getDateString() + cc.js.formatStr.apply(cc,arguments);
                this.addLog(strLog);
            }
            if(cc.wwx.OUTPUT_LV & cc.wwx.OUTPUT_INFO){
                let backLog = CC_WECHATGAME ? console.info : cc.log;
                // console.info('===================>>>[Start]');
                if (CC_WECHATGAME) {
                    backLog.call(this, `【${cc.wwx.UserInfo.userId}】【info 】`, this.getDateString(), cc.js.formatStr.apply(cc,arguments));
                } else {
                    backLog.call(this, `【${cc.wwx.UserInfo.userId}】【info 】`,this.getDateString(),this.stack(2),cc.js.formatStr.apply(cc,arguments));
                }
                // console.info('<<<===================[End]\r\n');
            }
        },

        warn: function(){
            if (CC_WECHATGAME) {
                return;
                var strLog = this.getDateString() + cc.js.formatStr.apply(cc,arguments);
                this.addLog(strLog);
            }
            if(cc.wwx.OUTPUT_LV & cc.wwx.OUTPUT_WARN){
                let backLog = CC_WECHATGAME ? console.warn : cc.warn;
                // console.warn('===================>>>[Start]');
                if (CC_WECHATGAME) {
                    backLog.call(this,`【${cc.wwx.UserInfo.userId}】【warn 】`,this.getDateString(),cc.js.formatStr.apply(cc,arguments));
                } else {
                    backLog.call(this,`【${cc.wwx.UserInfo.userId}】【warn 】`,this.getDateString(),this.stack(2),this.stack(3),cc.js.formatStr.apply(cc,arguments));
                }
                // console.warn('<<<===================[End]\r\n');
            }
        },

        err: function(){
            if (CC_WECHATGAME) {
                var strLog = this.getDateString() + cc.js.formatStr.apply(cc,arguments);
                this.addLog(strLog);
            }
            if(cc.wwx.OUTPUT_LV & cc.wwx.OUTPUT_ERR){
                let backLog = CC_WECHATGAME ? console.warn : cc.error;
                // console.log('\r\n===================>>>[Start]');
                if (CC_WECHATGAME) {
                    var strErr = cc.js.formatStr.apply(cc,arguments);
                    backLog.call(this,`【${cc.wwx.UserInfo.userId}】【err 】`,this.getDateString(),strErr);
                    cc.wwx.BiLog.uploadLogTimely(this.getDateString() + `【err】` + strErr);  // 上传错误
                } else {
                    backLog.call(this,`【${cc.wwx.UserInfo.userId}】【err 】`,this.getDateString(),this.stack(2),this.stack(3),this.stack(4),cc.js.formatStr.apply(cc,arguments));
                }
                // console.log('<<<===================[End]\r\n');
            }
        },

        dateFtt: function (fmt, date) {
            var o = {
                "M+" : date.getMonth()+1,                 //月份
                "d+" : date.getDate(),                    //日
                "h+" : date.getHours(),                   //小时
                "m+" : date.getMinutes(),                 //分
                "s+" : date.getSeconds(),                 //秒
                "q+" : Math.floor((date.getMonth()+3)/3), //季度
                "S"  : date.getMilliseconds()             //毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
            return fmt;
        },

        getDateString: function () {
            var crtTime = new Date();
            // return '【' + this.dateFtt("yyyy-MM-dd hh:mm:ss", crtTime) + '】';
            // return '【' + this.dateFtt("MM-dd hh:mm:ss", crtTime) + '】';
            return '【' + this.dateFtt("hh:mm:ss", crtTime) + '】';
        },

        stack: function (index) {
            var e = new Error();
            var lines = e.stack.split("\n");
            var msg = lines[index];
            if (!msg) return '';
            var startIdx = msg.indexOf('script/');
            return '【' + msg.slice(startIdx) + '】';
        },

        addLog (msg) {
            return;
            this.tmpLogsForServer.push('【' + this.index + '】' + msg);
            this.index++;
            if (this.tmpLogsForServer.length > this.maxCount) {
                this.tmpLogsForServer.shift();
            }
        },

        /**
         * 获取上传log日志
         * @returns {string}
         */
        getLogForServer () {
            return this.tmpLogsForServer.join(';');
        }
    },



});