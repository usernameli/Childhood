var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require("../utils/http");

var app = express();
var hallAddr = "";

function send(res,ret){
	var str = JSON.stringify(ret);
	res.send(str)
}

var config = null;

exports.start = function(cfg){
	config = cfg;
	hallAddr = config.HALL_IP  + ":" + config.HALL_CLIENT_PORT;
	app.listen(config.CLIENT_PORT);
	console.log("account http server is listening on " + config.CLIENT_PORT);
}

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/login',function(req,res){
	console.log("login req: " + JSON.stringify(req.query));

    //https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    if(req.query.code)
    {
        let data = {
            appid:"wx281737f4e987120b",
            secret:"96748141b8563c9c66a518068fb7238b",
            js_code:req.query.code,
            grant_type:"authorization_code"
        };

        let getOpenId = function (res,ret) {

            send(res,ret);
        };
        if(req.query.codeTest)
        {
            getOpenId(res,{openid:"ogRVG4488nJLhxLPK7RZHq6PuIRA",errcode:0})
        }
        else
        {
            http.get2("https://api.weixin.qq.com/sns/jscode2session",data,function (auth) {
                //auth: {"session_key":"agRdQDgV9tTivyV9lfHbEw==","openid":"ogRVG4488nJLhxLPK7RZHq6PuIRA"}
                console.log("auth: " + JSON.stringify(auth));
                getOpenId(res,{openid:auth["openid"],errcode:0});
            },true);
        }




    }
    else
    {
        send(res,{errcode:-1,errMsg:"invalid code"});

    }
});
app.get("/register",function (req,res) {

    console.log("login req: " + JSON.stringify(req.query));
    if(req.query.openId)
    {
        let fnFailed = function(){

            send(res,{errcode:-1,errmsg:"account has been used."});
        };

        let fnSucceed = function(){
            db.get_user_hp(account,function (ret) {
                if(ret)
                {
                    console.log("user hp " + JSON.stringify(ret));
                    send(res,{errcode:0,hpNum:ret["hp"]});
                }
                else
                {
                    send(res,{errcode:-1,errmsg:"account data error ."});

                }
            });
            // send(res,{errcode:0,errmsg:"ok"});
        };
        let account = "wx_" + req.query.openId;
        db.is_user_exist(account,function(IsNoExist)
        {
            if(IsNoExist)
            {
                let userInfo = req.query;
                console.log("userInfo nickName: " +JSON.stringify(req.query.nickName));
                db.create_account(req.query.nickName,
                                  req.query.avatarUrl,
                                  req.query.gender,
                                  req.query.province,
                                  req.query.city,
                                  req.query.country,
                                  req.query.openId,
                                  account,function(ret){
                    if (ret) {
                        fnSucceed();
                    }
                    else{
                        fnFailed();
                    }
                });
            }
            else
            {
                fnSucceed();
            }

        });


    }
    else
    {
        send(res,{errcode:-1,errmsg:"create account failed, openId invalid"});
    }

});
app.get('/get_version',function(req,res){
	var ret = {
		version:config.VERSION,
	}
	send(res,ret);
});

app.get('/get_serverinfo',function(req,res){
	var ret = {
		version:config.VERSION,
		hall:hallAddr,
		appweb:config.APP_WEB,
	}
	send(res,ret);
});

app.get('/guest',function(req,res){
	var account = "guest_" + req.query.account;
	var sign = crypto.md5(account + req.ip + config.ACCOUNT_PRI_KEY);
	var ret = {
		errcode:0,
		errmsg:"ok",
		account:account,
		halladdr:hallAddr,
		sign:sign
	}
	send(res,ret);
});

app.get('/auth',function(req,res){
	var account = req.query.account;
	var password = req.query.password;

	db.get_account_info(account,password,function(info){
		if(info == null){
			send(res,{errcode:1,errmsg:"invalid account"});
			return;
		}

        var account = "vivi_" + req.query.account;
        var sign = get_md5(account + req.ip + config.ACCOUNT_PRI_KEY);
        var ret = {
            errcode:0,
            errmsg:"ok",
            account:account,
            sign:sign
        }
        send(res,ret);
	});
});

var appInfo = {
	Android:{
		appid:"wxe39f08522d35c80c",
		secret:"fa88e3a3ca5a11b06499902cea4b9c01",
	},
	iOS:{
		appid:"wxcb508816c5c4e2a4",
		secret:"7de38489ede63089269e3410d5905038",		
	}
};

function get_access_token(code,os,callback){
	var info = appInfo[os];
	if(info == null){
		callback(false,null);
	}
	var data = {
		appid:info.appid,
		secret:info.secret,
		code:code,
		grant_type:"authorization_code"
	};

	http.get2("https://api.weixin.qq.com/sns/oauth2/access_token",data,callback,true);
}

function get_state_info(access_token,openid,callback){
	var data = {
		access_token:access_token,
		openid:openid
	};

	http.get2("https://api.weixin.qq.com/sns/userinfo",data,callback,true);
}

function create_user(account,name,sex,headimgurl,callback){
	var coins = 1000;
	var gems = 21;
	db.is_user_exist(account,function(ret){
		if(!ret){
			db.create_user(account,name,coins,gems,sex,headimgurl,function(ret){
				callback();
			});
		}
		else{
			db.update_user_info(account,name,headimgurl,sex,function(ret){
				callback();
			});
		}
	});
};
app.get('/wechat_auth',function(req,res){
	var code = req.query.code;
	var os = req.query.os;
	if(code == null || code == "" || os == null || os == ""){
		return;
	}
	console.log(os);
	get_access_token(code,os,function(suc,data){
		if(suc){
			var access_token = data.access_token;
			var openid = data.openid;
			get_state_info(access_token,openid,function(suc2,data2){
				if(suc2){
					var openid = data2.openid;
					var nickname = data2.nickname;
					var sex = data2.sex;
					var headimgurl = data2.headimgurl;
					var account = "wx_" + openid;
					create_user(account,nickname,sex,headimgurl,function(){
						var sign = crypto.md5(account + req.ip + config.ACCOUNT_PRI_KEY);
					    var ret = {
					        errcode:0,
					        errmsg:"ok",
					        account:account,
					        halladdr:hallAddr,
					        sign:sign
					    };
					    send(res,ret);
					});						
				}
			});
		}
		else{
			send(res,{errcode:-1,errmsg:"unkown err."});
		}
	});
});

app.get('/base_info',function(req,res){
	var userid = req.query.userid;
	db.get_user_base_info(userid,function(data){
		var ret = {
	        errcode:0,
	        errmsg:"ok",
			name:data.name,
			sex:data.sex,
	        headimgurl:data.headimg
	    };
	    send(res,ret);
	});
});