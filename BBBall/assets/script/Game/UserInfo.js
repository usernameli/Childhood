cc.Class({
    extends:cc.Component,
    statics:{
        wxAuthor:false,
        userId: 10001,
        userName: 'BBName',
        userPic: '',
        authorCode: '',
        systemType: 0, //1:苹果非iPhone X  2:iPhone X 3、安卓
        wechatType: "6.6.1",//微信版本号
        model: "未知设备",
        system: "iOS 10.0.1",
        loc: '',
        wxEnterInfo:'',
        query:'',
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
        gdata:{

        },
        checkPointData:[],
        checkPointID:1,
        bagData: {
            m_normalItemList:[], //背包数据
            'diamondInfo': {},
            'diamondCount': 0   // 真实的钻石个数
        },
        ballInfo:{
            speed:1500,
            ballType:"ballID",
            ballNum:30,
        },
        currentSocre:0,
        playMode:"checkPoint",  //默认关卡类型 checkPoint:关卡 classic:经典模式 ball100:百球模式
        SDKVersion:'',
        parseUdata: function (userInfoResult) {
            this.loc = userInfoResult['loc'];
            this.udata = userInfoResult['udata'];
            this.udata = userInfoResult['gdata'];
        },
        parseBag: function (bagResult) {
            if (bagResult) {
                let result = bagResult;
                let bagList = result["normal_list"] || [];
                this.bagData.m_normalItemList = bagList;
                let getNum = false;
                for (let  i = 0 ; i < bagList.length ; i ++){
                    let bagInfo = bagList[i];
                    let bagID = bagInfo["id"];
                    // 钻石
                    if (bagID == 1011){
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