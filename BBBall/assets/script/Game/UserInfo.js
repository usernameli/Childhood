cc.Class({
    extends:cc.Component,
    statics:{
        userId: 10001,
        userName: 'BBName',
        userPic: '',
        authorCode: '',
        systemType: 0, //1:苹果非iPhone X  2:iPhone X 3、安卓
        wechatType: "6.6.1",//微信版本号
        model: "未知设备",
        system: "iOS 10.0.1",
        loc: '',
        scene_id : "",
        scene_param : "",
        invite_id : 0,
        wxgame_session_key: "",
        udata: {
            "coupon": 0,
            "exchangedCoupon": 0,
            "diamond": 0,               // 没有用到，请使用 bagData.diamondCount
            'chip':0,
        },
        checkPointData:[],
        bagData: {
            'diamondInfo': {},
            'diamondCount': 0   // 真实的钻石个数
        },
        ballInfo:{
            speed:1500,
            ballType:"ballID",
            ballNum:10,
        },
        playMode:"checkPoint",  //默认关卡类型 checkPoint:关卡 classic:经典模式 ball100:百球模式
        SDKVersion:'',
        parseUdata: function (userInfoResult) {
            this.loc = userInfoResult['loc'];
            this.udata = userInfoResult['udata'];
        },
        parseBag: function (bagResult) {
            if (bagResult) {
                var result = bagResult;
                var bagList = result["normal_list"] || [];
                var getNum = false;
                for (var  i = 0 ; i < bagList.length ; i ++){
                    var bagInfo = bagList[i];
                    var bagID = bagInfo["id"];
                    // 钻石
                    if (bagID == 1311){
                        this.bagData.diamondInfo = bagInfo;
                        this.bagData.diamondCount = bagInfo["num"];
                        getNum = true;
                    }
                }
                if (!getNum){
                    this.bagData.diamondCount = 0;
                }
                cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.MSG_UPDATE_DIAMOND);
            }
        },

    }
})