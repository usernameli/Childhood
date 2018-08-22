var baseWindow = require("baseWindow");


cc.Class({
    extends:baseWindow,
    properties:{
        itemSprite:{
            default:null,
            type:cc.Sprite,
        },
        tipLable:{
            default:null,
            type:cc.Label
        },
        itemNum:{
            default:null,
            type:cc.Label
        }
    },
    onLoad()
    {
        this._super();
        let reward = this._params['reward'][0];
        let self = this;
        let spriteFrame = 'Ball_GetRewardDamond';
        if(reward['item'] === "1012")
        {
            spriteFrame = 'Ball_DiZheng';
            this.tipLable.string = "摧毁每个砖块一定的数量";
        }
        else if(reward['item'] === "1013")
        {
            spriteFrame = 'Ball_GuangXian';
            this.tipLable.string = "随机放置4个射线道具";
        }
        else if(reward['item'] === "1014")
        {
            spriteFrame = 'Ball_Row';
            this.tipLable.string = "直接消除最下方一行";


        }
        else if(reward['item'] === "1015")
        {
            spriteFrame = 'Ball_Plus_Ball';
            this.tipLable.string = "仅限当次增加小球数量";


        }
        else
        {
            spriteFrame = 'Ball_GetRewardDamond';
        }

        cc.wwx.Util.loadResAtlas("images/MainMenu",function (err,atlas) {
            self.itemSprite.spriteFrame = atlas.getSpriteFrame(spriteFrame);
        });

        this.itemNum.string = "x" + reward['count'];


    },
    closeWindowCallBack()
    {
        this.closeWindow();
    }
});
