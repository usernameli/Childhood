var mvs = require("Matchvs");
var Glb = require("Glb");
var response = require("MatchvsResponse");
function MatchvsEngine() {
    console.log('MatchvsEngine init');
}

/**
 * 初始化
 * @param channel
 * @param platform
 * @param gameID
 */
MatchvsEngine.prototype.init = function(channel, platform, gameID){
    response.prototype.bind();
    var result = mvs.engine.init(mvs.response,channel,platform,gameID);
    console.log("初始化result"+result);
    return result;
};
/**
 * 独立部署使用的初始化接口
 * @param {MatchvsResponse} response1
 * @param {string} endPoint
 * @param {number} gameID
 */
MatchvsEngine.prototype.premiseInit = function (endPoint, gameID) {
    response.prototype.bind();
    var result = mvs.engine.premiseInit(mvs.response,endPoint,gameID);
    console.log("独立部署初始化result"+result);
    return result;
}

/**
 * 注册
 * @returns {number|*}
 */
MatchvsEngine.prototype.registerUser = function() {
    var result = mvs.engine.registerUser();
    console.log("注册result"+result);
    return result;
};

/**
 * 注册
 * @param userID
 * @param token
 * @returns {DataView|*|number|void}
 */
MatchvsEngine.prototype.login = function(userID,token){
    var DeviceID = 'abcdef';
    var gatewayID = 0;
    var result = mvs.engine.login(userID,token,Glb.gameID,Glb.gameVersion,
        Glb.appKey,Glb.secret,DeviceID,gatewayID);
    console.log("登录result"+result);
    return result;
};

/**
 * 断线重连
 * @returns {*|number}
 */
MatchvsEngine.prototype.reconnect = function () {
    var result = mvs.engine.reconnect();
    console.log("重连result"+result);
    return result;
};

/**
 * 退出游戏
 * @returns {DataView|number|*}
 */
MatchvsEngine.prototype.logout = function () {
    var result = mvs.engine.logout("退出游戏");
    console.log('退出游戏result'+result);
    return result;
};

/**
 * 反初始化
 */
MatchvsEngine.prototype.uninit =function () {
    var result = mvs.engine.uninit();
    console.log('反初始化result'+result);
    return result;
}

/**
 * 随机匹配
 * @param mxaNumer 房间最大人数
 * @returns {number}
 */
MatchvsEngine.prototype.joinRandomRoom = function(mxaNumer,profile){
    var result = mvs.engine.joinRandomRoom(mxaNumer,MatchvsEngine.prototype.getUserProfile(profile));
    console.log("随机匹配result"+result);
    return result;
};

/**
 * 属性匹配
 * @param matchinfo
 * @param profile
 */
MatchvsEngine.prototype.joinRoomWithProperties = function (matchinfo,profile) {
    var result = mvs.engine.joinRoomWithProperties(matchinfo,MatchvsEngine.prototype.getUserProfile(profile));
    console.log("属性匹配result"+result);
    return result;
}

/**
 * 离开房间
 */
MatchvsEngine.prototype.leaveRoom = function () {
    var obj = {name:Glb.name,profile:'主动离开了房间'};
    var result = mvs.engine.leaveRoom(JSON.stringify(obj));
    console.log(Glb.name+"主动离开房间result"+result);
    return result;
};

/**
 * 关闭房间
 * @returns {number}
 */
MatchvsEngine.prototype.joinOver = function(){
    var result = mvs.engine.joinOver("关闭房间");
    console.log("joinOver result"+result);
    return result;
};

/**
 * 打开房间
 * @returns {number}
 */
MatchvsEngine.prototype.joinOpen = function(){
    var result = mvs.engine.joinOpen("打开房间");
    console.log("joinOpen result"+result);
    return result;
};

/**
 * 获取房间列表扩展接口
 * @param roomFilter
 * @returns {*|number}
 */
MatchvsEngine.prototype.getRoomListEx = function (roomFilter) {
    var result = mvs.engine.getRoomListEx(roomFilter);
    console.log("加载房间列表扩展接口 result"+result);
    return result;
}

/**
 * 加入指定房间
 * @param roomID
 * @param userProfile
 */
MatchvsEngine.prototype.joinRoom = function (roomID,profile) {
    var result = mvs.engine.joinRoom(roomID,MatchvsEngine.prototype.getUserProfile(profile));
    console.log("加入指定房间 result"+result);
    return result;
}

/**
 * 创建指定房间
 * @param roomFilter
 * @returns {number}
 */
MatchvsEngine.prototype.createRoom = function (roomFilter,profile) {
    var result = mvs.engine.createRoom(roomFilter,MatchvsEngine.prototype.getUserProfile(profile));
    console.log("创建指定类型房间 result"+result);
    return result;
}

/**
 * 踢出指定玩家
 * @param userID
 * @param cpProto
 */
MatchvsEngine.prototype.kickPlayer = function (userID,profile) {
    var obj = {name:profile,profile:profile+'被踢出了房间'};
    var result = mvs.engine.kickPlayer(userID,JSON.stringify(obj));
    console.log(userID+"被踢出游戏 result"+result);
    return result;
}

/**
 * 修改房间属性
 * @param roomID
 * @param roomProperty
 * @returns {*}
 */
MatchvsEngine.prototype.setRoomProperty = function(roomID,roomProperty){
    var result = mvs.engine.setRoomProperty(roomID,roomProperty);
    console.log("修改房间属性 result"+ result);
    return result;
};


/**
 * 修改房间属性
 * @param roomID
 * @param roomProperty
 * @returns {*}
 */
MatchvsEngine.prototype.getRoomDetail = function(roomID){
    var result = mvs.engine.getRoomDetail(roomID);
    console.log("获取房间详情 result"+ result);
    return result;
};

MatchvsEngine.prototype.sendEvent = function (msg) {
    var data =  mvs.engine.sendEvent(msg);
    // console.log("发送信息 result"+ data.result);
    return data.result;
};

MatchvsEngine.prototype.sendEventEx = function (msg) {
    var data = mvs.engine.sendEventEx(0,msg,1,[]);
    return data.result;
};
/**
 * 设置帧率
 * @param frameRate
 * @returns {DataView|number|*}
 */
MatchvsEngine.prototype.setFrameSync = function (frameRate) {
    var result = mvs.engine.setFrameSync(frameRate);
    console.log('设置帧率 result：'+result);
    return result;
}

/**
 * 帧同步发送
 * @param cpProto
 * @returns {DataView|number|*}
 */
MatchvsEngine.prototype.sendFrameEvent = function (cpProto) {
    var result = mvs.engine.sendFrameEvent(cpProto);
    return result;
};

/**
 * http
 */
// MatchvsEngine.prototype.httpPost = function (httpUrl,params) {
//     mvs.http(response.prototype);
//     mvs.post(httpUrl,params);
// },

/**
 * http
 */
// MatchvsEngine.prototype.httpGet = function (httpUrl) {
    // mvs.http(response.prototype);
    // mvs.get(httpUrl);
// },


    /**
 * 获取进入房间负载信息
 * @param profile
 * @returns {string}
 */
MatchvsEngine.prototype.getUserProfile = function (profile) {
    var userProfile = {name:Glb.name,avatar:Glb.avatar,profile:profile};
    var userProfileStr = JSON.stringify(userProfile);
    console.log("进入房间负载信息"+userProfileStr);
    return userProfileStr;
};



module.exports = MatchvsEngine;