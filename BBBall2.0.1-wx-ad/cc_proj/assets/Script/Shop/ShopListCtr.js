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
        itemTemplateName:"",
        spawnCount: 0, // 实际创建的项数量
        totalCount: 0, // 在列表中显示的项数量
        spacing: 0, // 项之间的间隔大小

    },
    onLoad()
    {
        this.content = this.scrollView.content;
        this.items = []; // 存储实际创建的项数组
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        // 使用这个变量来判断滚动操作是向上还是向下
        this.lastContentPosY = 0;

        if(this.itemTemplateName === "ShopTemplate")
        {
            this.totalCount = cc.wwx.PayModel.mPurchaseList.length;
        }
        else if(this.itemTemplateName === "ShopBallTemplate")
        {
            this.totalCount = Math.ceil(cc.wwx.PayModel.mExchangeList.length / 2);

        }
        else if(this.itemTemplateName === "InvateTemplate")
        {
            this.totalCount = cc.wwx.Invite.mInviteList2["rewards"].length;
        }
        cc.wwx.OutPut.log("this.totalCount: ",this.totalCount);


        // 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
        this.bufferZone = this.spawnCount * (this.itemTemplate.height + this.spacing) / 2;

        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.MSG_BAG,this.gameBagData,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_INVITE_CONF,this.invateConfData,this);


        this.initialize();

    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.MSG_BAG,this.gameBagData,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_INVITE_CONF,this.invateConfData,this);

    },
    invateConfData()
    {
        this.reloadData();

    },
    gameBagData()
    {
        if(this.itemTemplateName === "ShopBallTemplate")
        {
            this.reloadData();

        }
    },
    // 列表初始化
    initialize: function () {
        // 获取整个列表的高度
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
    reloadData()
    {
        for (let i = 0; i < this.items.length; ++i) { // spawn items, we only need to do this once
            // 设置该item的坐标（注意父节点content的Anchor坐标是(0.5, 1)，所以item的y坐标总是负值）
            this.items[i].getComponent(this.itemTemplateName).reloadData();
        }
    },
    scrollToFixedPosition: function () {
        // 在2秒内完成
        this.scrollView.scrollToOffset(cc.v2(0, 500), 2);
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
    update(dt)
    {
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
                    items[i].y = newY;
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
                    items[i].y = newY;
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