var mvs = require("Matchvs");

var GLB = require("Glb");
var engine = require("MatchvsEngine");
var response = require("MatchvsResponse");
var msg = require("MatvhvsMessage");
var userInfo;


cc.Class({
    extends:cc.Component,
    properties:{

    },
    onLoad()
    {
        var self = this;
        // initMgr();
        // cc.wwx.TCPClient.pause();

        this.initEvent(self);
        engine.prototype.init(GLB.channel,GLB.platform,GLB.gameID);

    },
    /**
     * 事件接收方法
     * @param event
     */
    onEvent:function (event) {
        cc.wwx.OutPut.log("GameMatchVSRoom eventData",JSON.stringify(event));

        var eventData = event.detail;
        if (eventData == undefined) {
            eventData = event;
        }
        switch (event.type){
            case msg.MATCHVS_INIT:
                console.log('初始化成功');
                this.getUserFromWeChat(this);
                break;
            case msg.MATCHVS_REGISTER_USER:
                this.login(eventData.userInfo.id,eventData.userInfo.token);
                break;
            case msg.MATCHVS_LOGIN:
                if (eventData.MsLoginRsp.roomID != null && eventData.MsLoginRsp.roomID !== '0') {
                    console.log("开始重连"+ eventData.MsLoginRsp.roomID);
                    engine.prototype.reconnect();
                } else {
                    cc.wwx.SceneManager.switchScene("GameMatchVSReady");
                }
                break;
            case msg.MATCHVS_RE_CONNECT:
                // cc.wwx.OutPut.log("GameMatchVSRoom eventData",JSON.stringify(eventData));

                GLB.roomID = eventData.roomUserInfoList.roomID;
                if (eventData.roomUserInfoList.owner == GLB.userID) {
                    GLB.isRoomOwner = true;
                } else {
                    GLB.isRoomOwner = false;
                }
                // cc.wwx.OutPut.log("GameMatchVSRoom eventData",JSON.stringify(eventData));

                if (eventData.roomUserInfoList.state == 1)
                {
                    if (eventData.roomUserInfoList.roomProperty == "")
                    {
                        engine.prototype.leaveRoom();
                        cc.wwx.SceneManager.switchScene("GameMatchVSReady");
                    } else  {
                        cc.director.loadScene('CreateRoom');
                    }
                } else {
                    cc.director.loadScene("Game");
                }
                break;
            case msg.MATCHVS_ERROE_MSG:
                console.log("[Err]errCode:"+eventData.errorCode+" errMsg:"+eventData.errorMsg);
                break;
            case msg.MATCHVS_WX_BINDING:
                engine.prototype.login(eventData.data.userid,eventData.data.token);
                break;
        }
    },
    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    initEvent:function (self) {
        response.prototype.init(self);
        this.node.on(msg.MATCHVS_RE_CONNECT,this.onEvent,this);
        this.node.on(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
        this.node.on(msg.MATCHVS_INIT, this.onEvent, this);
        this.node.on(msg.MATCHVS_REGISTER_USER,this.onEvent,this);
        this.node.on(msg.MATCHVS_LOGIN,this.onEvent,this);
        this.node.on(msg.MATCHVS_WX_BINDING,this.onEvent,this);
    },
    getUserFromWeChat:function(self){
        //获取微信信息
        try {
            getWxUserInfo(function(userInfos){
                getUserOpenID(function (openInfos) {
                    userInfos.openInfos = openInfos;
                    self.bindOpenIDWithUserID(userInfos);
                });
            });
        } catch (error) {
            console.warn("getUserFromWeChat for error:"+error.message);
            console.log("不是在微信平台，调用不进行绑定！");
            engine.prototype.registerUser();
        }
    },
    /**
     * 绑定微信OpenID 返回用户信息
     */
    bindOpenIDWithUserID:function(wxUserInfo){
        var self = this;
        console.log("获取到的微信用户信息",wxUserInfo);
        if(!wxUserInfo){
            return;
        }
        console.log('openid:'+wxUserInfo.openInfos.data.openid);
        if (wxUserInfo.openInfos.data.openid == undefined) {
            console.warn("没有获取到微信OpenID，获取OpenID请参考："+'http://www.matchvs.com/service?page=third');
            engine.prototype.registerUser();
            return;
        }
        GLB.name = wxUserInfo.nickName;
        GLB.avatar = wxUserInfo.avatarUrl;
        GLB.isWX = true;
        var req = new  XMLHttpRequest();
        let reqUrl = this.getBindOpenIDAddr(GLB.channel,GLB.platform);
        req.open("post",reqUrl , true);
        req.setRequestHeader("Content-Type", "application/json")
        req.onreadystatechange = function () {
            if (req.readyState == 4 && (req.status >= 200 && req.status < 400)) {
                try{
                    var response = req.responseText;
                    var data = JSON.parse(response).data;
                    console.log(data.userid,data.token);
                    self.login(data.userid,data.token);
                } catch(error){
                    console.warn(error.message);
                    engine.prototype.registerUser();
                }
            }
        };
        let params = "gameID="+GLB.gameID+"&openID="+wxUserInfo.openInfos.data.openid+"&session="+wxUserInfo.openInfos.data.session_key+"&thirdFlag=1";
        //计算签名
        let signstr = this.getSign(params);
        //重组参数
        params = "userID=0&"+params+"&sign="+signstr;

        let jsonParam ={
            userID:0,
            gameID:GLB.gameID,
            openID:wxUserInfo.openInfos.data.openid,
            session:wxUserInfo.openInfos.data.session_key,
            thirdFlag:1,
            sign:signstr
        };
        req.send(jsonParam);

    },
    getBindOpenIDAddr :function(channel, platform){
        if(channel == "MatchVS" || channel == "Matchvs"){
            if(platform == "release"){
                return "http://vsuser.matchvs.com/wc6/thirdBind.do?"
            }else if(platform == "alpha"){
                return "http://alphavsuser.matchvs.com/wc6/thirdBind.do?";
            }
        }else if(channel == "MatchVS-Test1"){
            if(platform == "release"){
                return "http://zwuser.matchvs.com/wc6/thirdBind.do?"
            }else if(platform == "alpha"){
                return "http://alphazwuser.matchvs.com/wc6/thirdBind.do?";
            }
        }
    },
    getSign:function(params){
        let str = GLB.appKey+"&"+params+"&"+GLB.secret;
        console.log(str);
        let md5Str = hex_md5(str);
        console.log(md5Str);
        return md5Str;
    },
    /**
     * 登录
     * @param id
     * @param token
     */
    login: function (id, token) {
        GLB.userID = id;
        console.log('开始登录...用户ID:' + id + " gameID " + GLB.gameID);
        engine.prototype.login(id,token);
    },
})