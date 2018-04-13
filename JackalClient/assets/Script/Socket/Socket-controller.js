
// if(window.io == null){
//     window.io = require("socket-io");
// }


export default class SocketController {
    constructor()
    {
        this._socket = undefined;
    };
    init()
    {
        var opts = {
            'reconnection':false,
            'force new connection': true,
            'transports':['websocket', 'polling']
        }
        this._socket = window.io.connect(jackalDefines.serverUrl,opts);
        this._socket.on('connect',function (data) {
            console.log("connect = " + JSON.stringify(data));
        })
        this._socket.on('reconnect',function(){
            console.log('reconnection');
        });


        this._socket.on('disconnect',function(data){
            console.log("disconnect");
        });

        this._socket.on('connect_failed',function (){
            console.log('connect_failed');
        });
    }
}