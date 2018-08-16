cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate:{
            default:null,
            type:cc.Node
        },
        scrollView:{
            default:null,
            type:cc.ScrollView
        },
        spawnCount: 0, // 实际创建的项数量
        totalCount: 0, // 在列表中显示的项数量
        spacing: 0, // 项之间的间隔大小
        _rankType:'world',//默认世界排行榜
        _shareTicket:null,
    },
    onLoad()
    {
        this.content = this.scrollView.content;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        // 使用这个变量来判断滚动操作是向上还是向下
        this.lastContentPosY = 0;
        this.itemTemplateName = "RankTemplate";
        this.totalCount = cc.wwx.PayModel.mExchangeList.length;
        cc.wwx.OutPut.log("this.totalCount: ",this.totalCount);

        // 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
        this.bufferZone = this.spawnCount * (this.itemTemplate.height + this.spacing) / 2;
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_FRINED,this._rankFriend,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_WORLD,this._rankWorld,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_LEVEL,this._rankLevel,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_CHASSIC,this._rankChassic,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_100BALL,this._rank100Ball,this);

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS, this.onMsgShareSuccess, this);

        this.initialize();

    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_FRINED,this._rankFriend,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_WORLD,this._rankWorld,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_LEVEL,this._rankLevel,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_CHASSIC,this._rankChassic,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_100BALL,this._rank100Ball,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_WX_SHARE_SUCCESS, this.onMsgShareSuccess, this);

    },

    onMsgShareSuccess : function(params) {
        if (params.burialId === cc.wwx.BurialShareType.FetchGroupID) {
            if (params.shareTicket) {
                this._shareTicket = params.shareTicket;
                this._rankType = "group";
                this._createDisplay();
                cc.wwx.WeChat.drawFriendGroupRank(cc.size(580, 90 * 20), 20,"Level",params.shareTicket);
            }
        }
    },

    // 列表初始化
    initialize: function () {
        // 获取整个列表的高度
        this.items = []; // 存储实际创建的项数组
        this.content.removeAllChildren(true);
        cc.wwx.OutPut.log("itemTemplateName",this.itemTemplateName);
        this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing;
        for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            let item = cc.instantiate(this.itemTemplate);
            this.content.addChild(item);
            // 设置该item的坐标（注意父节点content的Anchor坐标是(0.5, 1)，所以item的y坐标总是负值）
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            item.getComponent(this.itemTemplateName).updateItem(i + 1);
            this.items.push(item);
        }
    },
    _createDisplay () {
        this.scheduleOnce(function(){
            let node = new cc.Node();
            this.display = node.addComponent(cc.Sprite);
            this.content.height = 90 * 20;
            this.content.removeAllChildren(true);
            this.content.addChild(node);
            node.setAnchorPoint(0.5,1);
        }, 1);
    },
    start()
    {
        this.tex = new cc.Texture2D();
    },
    _rankLevel()
    {
        if(this._rankType === "friend")
        {
            delete this.display;
            this._createDisplay();

            cc.wwx.WeChat.drawFrienRank(cc.size(580 , 90 * 20), 20,"Level");
        }
        else if(this._rankType === "group")
        {
            delete this.display;
            this._createDisplay();

            cc.wwx.WeChat.drawFriendGroupRank(cc.size(580 , 90 * 20), 20,"Level",this._shareTicket);
        }
    },
    _rank100Ball()
    {
        if(this._rankType === "friend")
        {
            delete this.display;
            this._createDisplay();
            cc.wwx.WeChat.drawFrienRank(cc.size(580 , 90 * 20), 20,"Ball100");
        }
        else if(this._rankType === "group")
        {
            delete this.display;
            this._createDisplay();

            cc.wwx.WeChat.drawFriendGroupRank(cc.size(580 , 90 * 20), 20,"Ball100",this._shareTicket);
        }
    },
    _rankChassic()
    {
        if(this._rankType === "friend")
        {
            delete this.display;
            this._createDisplay();
            cc.wwx.WeChat.drawFrienRank(cc.size(580, 90 * 20), 20,"Chassic");
        }
        else if(this._rankType === "group")
        {
            delete this.display;
            this._createDisplay();

            cc.wwx.WeChat.drawFriendGroupRank(cc.size(580 , 90 * 20), 20,"Chassic",this._shareTicket);
        }
    },
    _rankWorld()
    {
        if(this._rankType === "friend"|| this._rankType === "group")
        {

            delete this.display;
            this.initialize();
            this._rankType = "world";
        }

    },
    _rankFriend()
    {
        if((this._rankType === "world" || this._rankType === "group") && CC_WECHATGAME)
        {
            this._rankType = "friend";
            this._createDisplay();

            cc.wwx.WeChat.drawFrienRank(cc.size(580, 90 * 20), 20,"Level");
        }

    },

    scrollEvent()
    {

    },
    // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },
    // 刷新开放数据域的纹理
    _updateSubDomainCanvas () {

        cc.wwx.OutPut.log('_updateSubDomainCanvas: width=' + this.display.node.width + ' height=' + this.display.node.height);
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update(dt)
    {

        if (this.tex && this.display) {
            this._updateSubDomainCanvas();
            return;
        }

        if(this._rankType === "friend" || this._rankType === "group")
        {
            return;
        }

        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.items;
        // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
        let isDown = this.scrollView.content.y < this.lastContentPosY;

        // 实际创建项占了多高（即它们的高度累加）
        let offset = (this.itemTemplate.height + this.spacing) * items.length;
        let newY = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // 提前计算出该item的新的y坐标
                newY = items[i].y + offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    items[i].setPositionY(newY);
                    let item = items[i].getComponent(this.itemTemplateName);
                    let itemId = item.itemID - items.length; // update item id
                    item.updateItem(itemId);
                }
            } else {
                // 提前计算出该item的新的y坐标
                newY = items[i].y - offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y > this.bufferZone && newY > -this.content.height) {
                    items[i].setPositionY(newY);
                    let item = items[i].getComponent(this.itemTemplateName);
                    let itemId = item.itemID + items.length;
                    item.updateItem(itemId);
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
        // this.lblTotalItems.string = "Total Items: " + this.totalCount;
    }
});