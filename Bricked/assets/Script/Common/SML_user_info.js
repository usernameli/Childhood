SML.UserInfo = {
    wxAuthor: false,        // 微信授权过（获取到玩家微信信息）
    userId: 10001,
    userName: '[途游]',
    userPic: '',
    scene_id: "",
    scene_param : "",
    invite_id : 0,
    authorCode : '',
    loc: '',
    query: {},  // 分享接口进入附带参数列表
    wxEnterInfo: null,//微信打开小程序的场景信息
    wx_session_key:"",//微信session_key
    udata: {
        "coupon": 0,
        "exchangedCoupon": 0,
        "diamond": 0,               // 没有用到，请使用 bagData.diamondCount
        'chip':0,
    },  // 用户信息
    bagData: {
        'diamondInfo': {},
        'diamondCount': 0   // 真实的钻石个数
    },
    // 返回所有的获取的现金（整数）
    allEarnedMoney () {
        return Math.round((this.udata.coupon + this.udata.exchangedCoupon) / 100);
    },
    parse: function (userInfoResult) {
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
            SML.Notify.trigger(SML.Event.MSG_UPDATE_DIAMOND);
        }
    },
    checkLoc: function () {
        SML.Output.info('checkLoc:' + this.loc);
        if (!this.loc || this.loc == '') return false;
        var locArr = this.loc.split('.');
        if (locArr.length != 4) return false;

        if( (locArr[0] == SML.GameData.gameId.toString()) && (locArr[1] != '0')) {
            return parseInt(locArr[1]);
        }
        return false;
    },
    checkQuery: function() {
        var ftId = this.query.ftId;
        SML.Output.log('checkQuery ftId: ', ftId);
        if (ftId) {
            var ftIdstr = ftId.toString();
            if (ftIdstr.length == 6) {
                return {'type':'friend', 'ftId':ftIdstr};
            }
        }

        return null;
    },

    /**
     * SDK
     * @param result
     */
    parseSnsData : function(result) {
        this.userId = result.userId;
        this.userName = SML.GlobalFuncs.sliceStringToLength(result.userName, 14);
        this.userPic = result.purl;
        this.authorCode = result.authorCode;
        this.wx_session_key = result.wxgame_session_key;
        SML.GameData.heartBeat = result.heartBeat || 2;
    }
}