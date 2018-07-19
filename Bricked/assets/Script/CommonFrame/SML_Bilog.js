/**
 * Created by xiaochuntian on 2018/5/2.
 */

SML.clickStatEventType = {
    /**
     * 重要说明,必须看,地主以6666开头
     * 打点事件及其对应的编码,各项目组需要根据自己的需求进行设计
     * 99990001\99990002\10001-10011都是固定预设的
     * http://192.168.10.93:8090/pages/viewpage.action?pageId=14747501
     */
    clickStatEventTypeUserFrom : 99990001,//用户来源,这个ID值不能变!
    clickStatEventTypeShare : 99990002,//分享行为,这个ID值不能变!

    clickStatEventTypeSubmitVersionInfo : 9999, //上报微信版本及基础库信息
    clickStatEventTypeWxLoginStart : 10001,//微信登录开始
    clickStatEventTypeWxLoginSuccess : 10002,//微信登录成功
    clickStatEventTypeWxLoginFailed : 66660001,//微信登录失败

    clickStatEventTypeAuthorizationStart : 10003,//授权开始
    clickStatEventTypeAuthorizationSuccess : 10004,//授权成功
    clickStatEventTypeAuthorizationFailed : 10005,//授权失败

    clickStatEventTypeLoginSDKStart : 10006,//登录SDK开始
    clickStatEventTypeLoginSDKSuccess : 10007,//登录SDK成功
    clickStatEventTypeLoginSDKFailed : 10008,//登录SDK时失败

    clickStatEventTypeTCP_Start : 10009,//TCP连接开始
    clickStatEventTypeTCP_Success : 10010,//TCP连接成功
    clickStatEventTypeTCP_Failed : 10011,//TCP连接失败

    /***------------自定义打点事件-------------------***/
    //66660010 - 20 分享打点事件ID
    clickStatEventTypeSharePointShow : 66660010,//分享点展示

    clickStatEventTypeFriendRoomCreateClick : 67890018,//创建房间按钮点击
    clickStatEventTypeFriendRoomDissolveClick : 67890019,//解散按钮点击次数
    clickStatEventTypeFriendRoomDuiju : 67890020,//对局详情按钮点击

    clickStatEventTypeInviteFriendClick : 67890021,//邀请好友按钮点击
    clickStatEventTypeInviteFriendSuccess : 67890022,//邀请好友分享成功
    clickStatEventTypeInviteFriendCardClick : 67890023,//邀请卡片按钮点击
    clickStatEventTypeInviteFriendCardSuccess : 67890024,//邀请卡片激活

    clickStatEventTypeStartFriendGame : 67890025,//好友桌开场时参数
    clickStatEventTypeEndFriendGame : 67890026,//好友桌结束时参数

    clickStatEventTypeStartFriendFail : 67890027,//进入好友桌牌桌错误
    clickStatEventTypeStartFriendTime : 67890028,//创建房间成功

    clickStatEventTypeVideoAD : 67890029, // 视频广告
    clickStatEventTypeBannerAD : 67890030, // banner广告
    clickStatEventTypeBannerAD2 : 67890033, // banner广告干预
    clickStatEventTypeProgress : 67890032, // 游戏启动时长打点

    clickStatEventTypeGameProgress : 70000000, // 玩家经历的游戏进程
}

SML.BiLog = {
    /**
     * 上传实时log,富豪斗地主用此接口上传错误情况下的日志
     * @param logtxt:log内容
     */
    uploadLogTimely:function (logtxt) {
        if(!/^http/.test(SML.GameData.errorLogServer)){
            return
        }
        if(logtxt) {
            // var header = ['Content-Type:text/plain'];
            var header = { 'Content-Type':'text/plain'}; // , 'Content-Encoding':'gzip'
            var errorLogServer = SML.GameData.errorLogServer;
            var configObj = {
                'url': errorLogServer,
                'header': header,
                'postData': {
                    'cloud_id': SML.GameData.cloudId,
                    'time': Math.floor((new Date()).valueOf()/1000),
                    'client_id': SML.GameData.clientId,
                    'user_id': SML.UserInfo.userId,
                    'sys_version': SML.SysInfo.system || '0',
                    'mobile_models': SML.SysInfo.model || '',
                    'baseVersion': SML.SysInfo.SDKVersion || '0',
                    'wxVersion': SML.SysInfo.version || '0',
                    'clientVersion': SML.GameData.version,
                    'Nettype': SML.SYS.networkType || '',
                    'ip': '0',
                    'errMsg': logtxt
                }
            };
            SML.HTTP.biPost(configObj,'POST');
        }
    },

    getSystemInfo : function(){
        this.cloud_id = SML.GameData.cloudId;   //独立服务id
        this.rec_type = '1';   //日志类型
        this.rec_id     = '0'; //日志记录id
        this.receive_time  ='0'; // 日志接收时间  输出日志时统一填0，BI服务会在接收时添加
        this.user_id = SML.UserInfo.userId || '0';      //用户id
        this.game_id = SML.GameData.gameId;      //游戏id
        this.client_id = SML.GameData.clientId;
        this.device_id = SML.GameData.uuid;	//device id
        this.ip_addr='#IP';// ip地址	占位--服务器处理
        this.nettype= SML.SYS.networkType || '0'; //网络状况
        this.phone_maker= SML.SysInfo.brand || "0"; //手机制造商
        this.phone_model= SML.SysInfo.model || SML.GameData.deviceId; //手机型号
        this.phone_carrier= "0";//手机运营商
        this.reserved ='0';
    },
    /*BI组打点
     参数1是事件id，参数2是[],内含扩展参数
     60001事件id
     在查询工具，cloud id+game id+事件id即可找到,GDSS有前端日志查询工具
     SML.BiLog.clickStat(SML.StatEventInfo.DdzButtonClickInPlugin,
     [SML.PluginHall.Model.statInfoType[scope.index],SML.GameId]);

     // SML.BiLog.clickStat(hall5.BILogEvents.BILOG_EVENT_PLUGIN_UPDATE_SUCCESS,[hall5.BilogStatEvent.Plugin_Update_Success,gameid]);
     */
    uploadClickStatLogTimely:function (logtxt) {
        cc.log("logtxt:"+logtxt);
        var callbackObj = this;
        if(logtxt!=undefined && logtxt!='') {
            var header = {'Content-Type':'text/plain'};
            var configObj = {
                'url': SML.GameData.biLogServer,
                'header': header,
                'postData': logtxt,
                'obj': callbackObj,
                'tag': null,
                'callback': null
            };
            SML.HTTP.biPost(configObj,'POST');
        }
    },

    /**
     * 打点接口
     * @param eventId      打点事件
     * @param ParamsList   额外参数,最多10位,参见bi组文档说明
     */
    clickStat: function (eventId, paramsList) {
        return;
        paramsList = paramsList || [];
        var dyeparams = [];
        if (paramsList.length < 10) {
            for (var i = 0; i < 9; i++) {
                if (i < paramsList.length) {
                    dyeparams.push(paramsList[i]);}
                else {
                    dyeparams.push(0);
                }
            }
        }
        else {
            dyeparams = paramsList;
        }
        cc.log('BI打点', "eventid= " + eventId + " 描述 = " + JSON.stringify(dyeparams));
        var bilog = this.assemblelog(eventId, dyeparams);
        this.uploadClickStatLogTimely(bilog+ '\n');
    },

    assemblelog:function (eventid, paramsarr) {
        //获得1970到现在的秒数
        var time = new Date().getTime();
        //隔一分钟取网络状况
        if(time-this._timetag>60000)
        {
            this._timetag = time;
            this.nettype=0;
        }
        var paramstr = paramsarr.join('\t');

        this.getSystemInfo();
        var logStr =this.cloud_id+'\t'+this.rec_type+'\t'+time+'\t'+this.rec_id+'\t'+this.receive_time+
            '\t'+eventid+'\t'+this.user_id+'\t'+this.game_id+'\t'+this.client_id+'\t'+this.device_id+'\t'+
            this.ip_addr +'\t'+this.nettype+'\t'+this.phone_maker +'\t'+this.phone_model +'\t'+this.phone_carrier+'\t'+paramstr+'\t'+ this.reserved ;

        var str = this.trimTab0(logStr);
        return str;
    },

    trimTab0:function (str) {
        if(str==null || str==undefined)
            return '';
        var txt = str.replace(/(\t0)*$/,'');
        return txt;
    },

    record_game_progress : function(progress) {
        this.mGameProgressRecorded = this.mGameProgressRecorded || {
            'EnterGame' : false,                // 点击入口
            'SceneLoginLoaded' : false,         // 加载login界面
            'WXGetUserInfoOpenData' : false,    // 从开放数据域获取数据
            'WXGetUserInfoNormal' : false,      // 授权获取数据
            'WXLoginSuccess' : false,           // wx登陆成功
            'SDKLoginSuccess' : false,          // sdk登陆成功
            'TCPOpened' : false,                // 游戏服链接成功
            'BindUser' : false,                 // 绑定玩家信息
            'BindGame' : false,                 // 绑定插件
            'HallInfoData' : false,             // 获得hall_info
            'SegmentData' : false,              // 获得排位信息
            'Share3Data' : false,               // 获得分享3信息
            'GameLoginSuccess' : false,         // 成功登陆游戏（完成上面）
            'SceneLoginLeaveStart' : false,    // 开始离开登录场景成功进入下一个场景
            'SceneLoginLeaveEnd' : false,     // 成功离开登录场景成功进入下一个场景
            'SceneHallLoaded' : false,          // 进入大厅
            'SceneTableLoaded' : false,         // 进入牌桌
            'ExitGame' : false,                 // 点击退出
            'BadPhone' : false,                 // 设备无法运行小游戏
        }

        if (!this.mGameProgressRecorded[progress]) {
            this.mGameProgressRecorded[progress] = true;
            this.clickStat(SML.clickStatEventType.clickStatEventTypeGameProgress, [progress]);
        }
    },
};
