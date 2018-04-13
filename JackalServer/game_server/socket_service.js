var crypto = require('../utils/crypto');
var db = require('../utils/db');
var io = null;
exports.start = function(config,mgr){
	io = require('socket.io')(config.CLIENT_PORT);
	
	io.sockets.on('connection',function(socket){
        socket.emit('connect',{ok:'ok'});
	});

	console.log("game server socket is listening on " + config.CLIENT_PORT);
};