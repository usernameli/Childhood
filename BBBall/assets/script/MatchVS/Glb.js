var obj = {
    RANDOM_MATCH: 1,  // 随机匹配
    PROPERTY_MATCH: 2,  // 属性匹配
    MAX_PLAYER_COUNT: 2,


    channel: 'Matchvs',
    platform: 'alpha',
    gameID: 202230,
    gameVersion: 1,
    appKey: '6c81398138514b26a78afd93c2af6244#M',
    secret: '7a2f8a248dfd4817a7bdeffc0d15dc0a',
    isWX:false,
    matchType: 1,
    tagsInfo: {"title": "A"},
    frameInfo: {"title" : "frameInfo"},
    userID: 0,
    name: "",
    avatar: "",
    ARROW_LEFT: 1,
    ARROW_RIGHT: 2,
    ARROW_STOP: 0,
    playerUserIds: [],
    isRoomOwner: false,
    syncFrame: false,
    FRAME_RATE: 20,
    roomID: 0,
    playertime: 120,
    isGameOver: false,
    NEW_STAR_POSITION : 0,
    number1: "",
    number2: "",
    number3: "",
    ownew:0, //只为做分数展示时判断使用
    mapType: "",
    FPS:30,//数据帧每秒采样次数
};
/**
 * 去重复item
 * @returns {Array}
 */


module.exports = obj;