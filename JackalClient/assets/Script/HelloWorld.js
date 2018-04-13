import JackalGlobal from "./Global";
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        JackalGlobal.AudioMgr.playBGM("soundbg2.mp3");
        // global.socket.init();
        //微信返回数据{"errMsg":"login:ok","code":"011bWVzb2jRg2Q0Dkkzb2lmPzb2bWVzu"}
        if(typeof wx !== undefined)
        {
            JackalGlobal.WxMgr.login();
        }
        else
        {
            let data = {
                code:"011bWVzb2jRg2Q0Dkkzb2lmPzb2bWVzu",
                codeTest:true
            };
            JackalGlobal.http.sendRequest("/login",data,function (ret) {
                if(ret.errcode === 0)
                {
                    console.log("login: " +JSON.stringify(ret));
                }
                else
                {
                    console.log(ret.errMsg);
                }
            })
        }


    },

    // called every frame
    update: function (dt) {

    },
});
