import JackalGlobal from "../Global";

export default class WXMgr {

    constructor()
    {
        this.openId = "";
        this.nickName = "";
        this.avatarUrl = "";
        this.gender = 1; //性别 0：未知、1：男、2：女
        this.province = "";
        this.city = "";
        this.country = "";

    };
    login()
    {
        let that = this;
        wx.login({
            success:function (res) {
                console.log("login success : " +JSON.stringify(res));
                if (res.code)
                {
                    that.getOpenId(res);
                }
                else
                {
                    console.log('登录失败！' + res.errMsg)
                }
            },

        })
    };
    getOpenId(res)
    {
        let that = this;
        wx.request({
            url: jackalDefines.loginUrl + "/login",
            data: {
                code: res.code
            },
            success:function (res) {
                console.log("request success: " +JSON.stringify(res));
                if(res["data"]["errcode"] === 0)
                {
                    that.openId = res["data"]["openid"];
                    that.getUserInfo();
                }
                else
                {
                    console.log("request: " + res["data"]["errMsg"]);
                }

            },
            fail:function (res) {
                console.log("request fail : " +JSON.stringify(res));

            },
            complete:function (res) {
                console.log("request complete : " +JSON.stringify(res));

            },
        })
    };
    getUserInfo()
    {
        let that = this;
        wx.getUserInfo({
            success: function(res) {
                console.log("getUserInfo: " +JSON.stringify(res));
                var userInfo = res.userInfo;
                that.nickName = userInfo.nickName;
                that.avatarUrl = userInfo.avatarUrl;
                that.gender = userInfo.gender; //性别 0：未知、1：男、2：女
                that.province = userInfo.province;
                that.city = userInfo.city;
                that.country = userInfo.country;
                let data = {
                    nickName:userInfo.nickName,
                    avatarUrl:userInfo.avatarUrl,
                    gender:userInfo.gender,
                    province:userInfo.province,
                    city:userInfo.city,
                    country:userInfo.country,
                    openId:that.openId,
                };
                console.log("data: " + JSON.stringify(data));
                JackalGlobal.http.sendRequest("/register",data,function (res) {

                    console.log("register: " + JSON.stringify(res));
                    //用户注册成功
                })
            }
        })
    }

}