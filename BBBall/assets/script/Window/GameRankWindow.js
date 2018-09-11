var baseWindow = require("baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        tab1Select:{
            default:null,
            type:cc.Node
        },
        tab2Select:{
            default:null,
            type:cc.Node
        },
        tab3Select:{
            default:null,
            type:cc.Node
        },
        tab1Unselect:{
            default:null,
            type:cc.Node
        },
        tab2Unselect:{
            default:null,
            type:cc.Node
        },
        tab3Unselect:{
            default:null,
            type:cc.Node
        },
        worldButton:{
            default:null,
            type:cc.Button
        },
        friendButton:{
            default:null,
            type:cc.Button
        },
        worldLine:{
            default:null,
            type:cc.Node
        },
        friendLine:{
            default:null,
            type:cc.Node
        },
        ownTemplate:{
            default:null,
            type:cc.Node
        },
        _tag:"GameRankWindow"
    },
    onLoad()
    {
        this._isAction = false;
        this._super();
        this.clickTabChange(1);
        this.worldButton.interactable = false;
        this.worldLine.active = true;
        this.friendButton.interactable = true;
        this.friendLine.active = false;
        cc.wwx.OutPut.log(this._tag,"mFriendRankList: ",JSON.stringify(cc.wwx.UserInfo.mFriendRankList))
    },
    clickTabChange(index)
    {

        if(index === 1)
        {
            this.tab1Select.active = true;
            this.tab2Select.active = false;
            this.tab3Select.active = false;

            this.tab1Unselect.active = false;
            this.tab2Unselect.active = true;
            this.tab3Unselect.active = true;
        }
        else if(index === 2)
        {
            this.tab1Select.active = false;
            this.tab2Select.active = true;
            this.tab3Select.active = false;

            this.tab1Unselect.active = true;
            this.tab2Unselect.active = false;
            this.tab3Unselect.active = true;
        }
        else
        {
            this.tab1Select.active = false;
            this.tab2Select.active = false;
            this.tab3Select.active = true;

            this.tab1Unselect.active = true;
            this.tab2Unselect.active = true;
            this.tab3Unselect.active = false;
        }

    },
    closeWindowCallBack()
    {
        this.closeWindow();
    },
    tab1CallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        this.clickTabChange(1);
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_RANK_LEVEL);

    },
    tab2CallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        this.clickTabChange(2);
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_RANK_CHASSIC);

    },
    tab3CallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        this.clickTabChange(3);
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_RANK_100BALL);

    },
    worldRankCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        if(this.worldButton.interactable == false)
        {
            return;
        }
        this.clickTabChange(1);
        this.ownTemplate.active = true;
        this.worldButton.interactable = false;
        this.friendButton.interactable = true;
        this.worldLine.active = true;
        this.friendLine.active = false;
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_RANK_WORLD);
    },
    friendRankCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        if(this.friendButton.interactable === false)
        {
            return;
        }
        this.clickTabChange(1);
        this.ownTemplate.active = false;

        this.worldButton.interactable = true;
        this.friendButton.interactable = false;
        this.worldLine.active = false;
        this.friendLine.active = true;
        cc.wwx.NotificationCenter.trigger(cc.wwx.EventType.ACTION_RANK_FRINED);

    },
    groupRankShareCallBack()
    {
        cc.wwx.AudioManager.playAudioButton();
        this.ownTemplate.active = false;
        cc.wwx.TCPMSG.getShare3BurialInfo(cc.wwx.BurialShareType.FetchGroupID);


    }
});