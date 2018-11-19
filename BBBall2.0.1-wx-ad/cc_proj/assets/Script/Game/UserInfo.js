cc.Class({
    extends:cc.Component,
    statics:{
        wxAuthor:false,
        userId: 10001,
        userName: undefined,
        userPic: '',
        authorCode: '',
        systemType: 0, //1:苹果非iPhone X  2:iPhone X 3、安卓
        wechatType: "6.6.1",//微信版本号
        wxEnterInfo: null,//微信打开小程序的场景信息
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
        checkPointID:0,
        bagData: {
            m_normalItemList:[], //背包数据
            'diamondInfo': {},
            'diamondCount': 0   // 真实的宝石个数
        },
        ballInfo:{
            speed:1500,
            ballType:"ballID",
            ballNum:30,
            ballPosY:15 + 108,
        },
        mFriendRankList:[],
        mIssue:null,
        currentSocre:0,
        currentStar:0,
        playMode:"checkPoint",  //默认关卡类型 checkPoint:关卡 classic:经典模式 ball100:百球模式
        SDKVersion:'',
        parseUdata: function (userInfoResult) {
            this.loc = userInfoResult['loc'];
            this.udata = userInfoResult['udata'];
            if(!this.userPic)
            {
                this.userPic = this.udata["purl"];
            }
        },
        getHighLevelStars()
        {
            let levelHighStar = cc.wwx.UserInfo.gdata["levelHighStar"];
            let sumStar = 0;
            for(let i = 0; i < levelHighStar.length;i++)
            {
                sumStar += levelHighStar[i];
            }
            return sumStar;
        },
        parseGdata:function(params)
        {
            this.gdata = params['gdata'];
            this.checkPointID = this.gdata["levelHighLv"];
            this.mIssue = "mIssue";
            if(cc.wwx.SystemInfo.debug)
            {
                return;
            }
            cc.wwx.WeChat.uploadRank(function(status, params)
            {
                if (status) {
                    this.mFriendRankList = [];
                    JSON.parse(params)[0].data.forEach(function(data) {
                        var kvdata = cc.wwx.Util.kv2dic(data.KVDataList);
                        cc.wwx.OutPut.log("UserInfo kvdata: ",JSON.stringify(kvdata));
                        if (kvdata.issue == this.mIssue) {
                            this.mFriendRankList.push({
                                total   : parseInt(kvdata.levelHighStars),
                                userId  : parseInt(kvdata.userId),
                                name    : data.nickname,
                                avatar  : data.avatarUrl,
                                levelHighLv : parseInt(kvdata.levelHighLv),
                                ball100HighScore : parseInt(kvdata.ball100HighScore),
                                classicHighScore     : parseInt(kvdata.classicHighScore),
                            })
                        }
                    }.bind(this));

                    this.mFriendRankList.sort(function(a, b) {
                        return b.total - a.total;
                    });
                    for(var i = 0; i < this.mFriendRankList.length; i++) {
                        this.mFriendRankList[i].rank = i + 1;
                    }
                }
            }.bind(this));
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
                    // 宝石
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
        findBagUseBall()
        {
            let useId = 1016;
            for(let i = 0; i < this.bagData.m_normalItemList.length;i++)
            {
                if(this.bagData.m_normalItemList[i]["canUse"])
                {
                    useId = this.bagData.m_normalItemList[i]["id"];
                    break;
                }
            }
            return useId;
        },
        getBagItemNum(itemId)
        {
            let num = 0;
            for(let i = 0; i < this.bagData.m_normalItemList.length;i++)
            {
                if(itemId == this.bagData.m_normalItemList[i]["id"])
                {
                    num = this.bagData.m_normalItemList[i]["num"];
                    break;
                }
            }

            return parseInt(num);
        },
        findBagItem(itemId)
        {

            let findIndex = -1;
            for(let i = 0; i < this.bagData.m_normalItemList.length;i++)
            {
                if(itemId == this.bagData.m_normalItemList[i]["id"])
                {
                    findIndex = i;
                    break;
                }
            }
            if(findIndex > -1)
            {
                return this.bagData.m_normalItemList[findIndex];
            }

            return null;
        },
        parseGender(gender){
            switch(gender){
                case 0:
                    this.gender = 2;
                    break;
                case 1:
                    this.gender = 0;
                    break;
                case 2:
                    this.gender = 1;
                    break;
            }
        },

    }
})