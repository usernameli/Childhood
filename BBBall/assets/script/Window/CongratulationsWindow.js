var baseWindow = require("baseWindow");


cc.Class({
    extends:baseWindow,
    properties:{
        itemSprite:{
            default:null,
            type:cc.Sprite,
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
        }
        else if(reward['item'] === "1013")
        {
            spriteFrame = 'Ball_GuangXian';

        }
        else if(reward['item'] === "1014")
        {
            spriteFrame = 'Ball_Row';

        }
        else if(reward['item'] === "1015")
        {
            spriteFrame = 'Ball_Plus_Ball';

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
