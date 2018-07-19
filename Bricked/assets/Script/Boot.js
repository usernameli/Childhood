/**
 * 全局变量。
 */

window.DEBUG_MODEL = false;

window.SERVERS = [
    ['http://172.16.0.45:8000/', 'ws'],
    ['http://192.168.20.113:8000/', 'ws'],
    ['https://openddzfz.nalrer.cn/', 'wss'],
    ['https://openddz.nalrer.cn/', 'wss']
];

window.SERVER_INDEX = 2;
window.VERSION = '5.08';
window.SDK_URL = SERVERS[SERVER_INDEX][0];
window.WS_TYPE = SERVERS[SERVER_INDEX][1];

window.WX_APP_IDS = {
    test: 'wx6ac3f5090a6b99c5',
    online: 'wx785e80cff6120de5',
};

window.OUTPUT_LOG = 1;
window.OUTPUT_INFO = 1 << 1;
window.OUTPUT_WARN = 1 << 2;
window.OUTPUT_ERR = 1 << 3;
window.OUTPUT_LV = OUTPUT_ERR | OUTPUT_WARN | OUTPUT_INFO | OUTPUT_LOG;
// window.OUTPUT_LV = OUTPUT_ERR | OUTPUT_WARN | OUTPUT_INFO;

// sml 命名空间
window.SML = {};

SML.SYS = {};
SML.SYS.PHONE_TYPE = cc.Enum({
    NORMAL:0,
    IPONEX:1
});
SML.SYS.phoneType = SML.SYS.PHONE_TYPE.NORMAL;
SML.SysInfo = {};

SML.Core = {};
SML.TodoTasks = {};

// 玩家类型：0我、1右、2左
SML.SEAT_TYPE = cc.Enum({
    MINE:0,
    RIGHT:1,
    LEFT:2,
});
