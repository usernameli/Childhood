cc.Class({
    extends:cc.Component,
    properties: {
        /*详细分享数据*/
        pointId: 0,
        title: "",
        pic: "",
        whereToReward: "all",

        /*埋点轻度数据*/
        burialId: "default",
        tips: "",

        /*自定义数据*/
        queryJson: null,

        /*数据阶段,0:未初始化,1埋点轻度数据,2包含详细分享数据*/
        dLevel: 0,

        /*奖励及分享次数相关*/
        remRewardCount: 0,
        totalRewardCount: 0,
        rewards: [],

        /*绘图相关*/
        paintConfig: null,
        roomId:0,
        tableId:0,
    },
    parseBurial (param) {
        this.dLevel = 1;
        this.burialId = param['action'] || cc.wwx.BurialShareType.Default;
        this.tips = param['tips'] || '';
    },
    getShareData()
    {

        return {
            pointId: this.pointId,
            title: this.title,
            pic: this.pic,
            whereToReward: this.whereToReward,
            shareId:this.shareId,
            /*埋点轻度数据*/
            burialId: this.burialId,
            tips:this.tips,

            /*自定义数据*/
            queryJson: this.queryJson,

            /*数据阶段,0:未初始化,1埋点轻度数据,2包含详细分享数据*/
            dLevel: this.dLevel,

            /*奖励及分享次数相关*/
            remRewardCount: this.remRewardCount,
            totalRewardCount: this.totalRewardCount,
            rewards: this.rewards,

            /*绘图相关*/
            paintConfig: this.paintConfig,

            roomId:this.roomId,
            tableId:this.tableId,
        }
    },
    parseShare (param,customData){
        this.dLevel = 2;
        this.pointId = param['pointId'] || 0;
        this.roomId = param['roomId'] || 0;
        this.hostId = param['hostId'] || cc.wwx.UserInfo.userId;
        this.shareId = param.shareId || 0;
        this.title = param['title'] || null;
        this.pic = param['pic'] || null;


        // this.whereToReward = param['whereToReward'] || cc.wwx.ShareWhereReward.All;

        this.remRewardCount = param['remRewardCount']||0;
        this.totalRewardCount = param['totalRewardCount']||0;
        this.rewards = param['rewards']||[];

        this.paintConfig = param['paintConfig'] || [];
        if(customData){
            customData['pointId'] && (this.pointId = customData['pointId']);
            customData['title'] && (this.title = customData['title']);
            customData['pic'] && (this.pic = customData['pic']);
            customData['whereToReward'] && (this.whereToReward = customData['whereToReward']);
            customData['queryJson'] && (this.queryJson = customData['queryJson']);
            customData['paintConfig'] && (this.paintConfig = customData['paintConfig']);
        }

        if(this.hostId !== 0)
        {
            this.queryJson = {hostId:this.hostId,roomID:this.roomId}
        }
    },

    completed (){
        return this.dLevel == 2;
    },

})