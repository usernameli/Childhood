import SocketController from './Socket/Socket-controller';
import Http from './Http/Http';
import AudioMgr from './Utils/Audio';
import WXMgr from "./Utils/WX";
import Event from  "./Utils/Event";

const JackalGlobal = {};
JackalGlobal.socket = new SocketController();
JackalGlobal.http = new Http();
JackalGlobal.AudioMgr = new AudioMgr();
JackalGlobal.WxMgr = new WXMgr();
JackalGlobal.Event = new Event();
export default  JackalGlobal;