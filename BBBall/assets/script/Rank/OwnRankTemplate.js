cc.Class({
    extends:cc.Component,
    properties:{

        rankNum:{
            default:null,
            type:cc.Node
        },
        noRankTip:{
            default:null,
            type:cc.Node
        },
        rankNode:{
            default:null,
            type:cc.Node
        },
        headNode:{
            default:null,
            type:cc.Node
        },
        rankName:{
            default:null,
            type:cc.Label
        },
        rankSocre:{
            default:null,
            type:cc.Label
        },

        _rankList:[],
        _rankIndex:0,
    },
    onLoad: function () {
        this.updateItem();
        this._rankIndex = 0;
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_LEVEL,this._rankLevel,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_CHASSIC,this._rankChassic,this);
        cc.wwx.NotificationCenter.listen(cc.wwx.EventType.ACTION_RANK_100BALL,this._rank100Ball,this);
    },
    onDestroy()
    {
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_LEVEL,this._rankLevel,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_CHASSIC,this._rankChassic,this);
        cc.wwx.NotificationCenter.ignore(cc.wwx.EventType.ACTION_RANK_100BALL,this._rank100Ball,this);

    },
    _rankLevel()
    {
        this._rankIndex = 0;
        this.updateItem();
    },
    _rankChassic()
    {
        this._rankIndex = 1;
        this.updateItem();
    },
    _rank100Ball()
    {
        this._rankIndex = 2;
        this.updateItem();
    },
    findOwnRankList()
    {
        let rankList = cc.wwx.SystemInfo.rank[this._rankIndex]["rankDatas"];
        let ownIndex = -1;
        for(let i = 0; i < rankList.length;i++)
        {
            if(rankList[i]["userId"] === cc.wwx.UserInfo.userId)
            {
                ownIndex =  i;
                break;
            }
        }

        return ownIndex;
    }
    ,
    updateItem: function() {
        let onwIndex = this.findOwnRankList();

        if(onwIndex > -1)
        {
            let rankList = cc.wwx.SystemInfo.rank[this._rankIndex]["rankDatas"][onwIndex];

            this.rankNum.getComponent("cc.Label").string = rankList["rank"];

            this.rankNode.active = true;
            this.noRankTip.active = false;
            this.rankName.string = rankList["detail"]["name"];
            this.rankSocre.string = rankList["detail"]["rankValue"];
            cc.wwx.Loader.loadImg(rankList["detail"]["headUrl"], this.headNode);

        }
        else
        {
            this.rankNode.active = false;
            this.noRankTip.active = true;
        }
    }
});