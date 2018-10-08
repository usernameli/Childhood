var baseWindow = require("../Window/baseWindow");

cc.Class({
    extends:baseWindow,
    properties:{
        segment:{
            default:null,
            type:cc.Label
        },
        starLightSprite:{
            default:null,
            type:cc.SpriteFrame
        },
        segmentPicList:{
            default:[],
            type:cc.SpriteFrame
        },
        nopack_icon_title_segment_15:{
            default:null,
            type:cc.Sprite
        },
        nopack_icon_title_segment_15tx:{
            default:null,
            type:cc.Sprite
        },
        starList:{
            default:[],
            type:cc.Sprite
        },
        shengxingPrefab:{
            default:null,
            type:cc.Prefab
        },
        jiangxingPrefab:{
            default:null,
            type:cc.Prefab
        }

    },
    onLoad()
    {
        this._super();
        let starNum = this._params["starNum"];
        let updownF    = this._params["updownF"];
        let segment = cc.wwx.Util.segmentStarCalculation(starNum);
        let segmentLevel = cc.wwx.Util.segmentLevel(starNum);
        this.segment.string = segment;
        let oldStarNum = starNum % 3;
        if(starNum === 0)
        {
            oldStarNum = 0;
        }
        else if(oldStarNum === 0)
        {
            oldStarNum = 3;
        }

        this.nopack_icon_title_segment_15.spriteFrame = this.segmentPicList[segmentLevel];
        this.nopack_icon_title_segment_15tx.spriteFrame = this.segmentPicList[segmentLevel];

        if(updownF)
        {
            //升星
            this.nopack_icon_title_segment_15.spriteFrame = this.segmentPicList[segmentLevel];
            this.nopack_icon_title_segment_15tx.spriteFrame = this.segmentPicList[segmentLevel];
            for(let i = 0; i < oldStarNum - 1;i++)
            {
                this.starList[i].spriteFrame = this.starLightSprite;
            }

            let shengxing = cc.instantiate(this.shengxingPrefab);
            this.starList[oldStarNum - 1].node.addChild(shengxing);
            let component = shengxing.getComponent("ShengXing");
            component.playAnimation();

        }
        else
        {
            //降星
            if(oldStarNum - 1 >= 0)
            {
                for(let i = 0; i < oldStarNum - 1;i++)
                {
                    this.starList[i].spriteFrame = this.starLightSprite;
                }

                let jiangxing = cc.instantiate(this.jiangxingPrefab);
                this.starList[oldStarNum - 1].node.addChild(jiangxing);
                let component = jiangxing.getComponent("JiangXing");
                component.playAnimation();
            }
            else
            {
                let jiangxing = cc.instantiate(this.jiangxingPrefab);
                this.starList[0].node.addChild(jiangxing);
                let component = jiangxing.getComponent("JiangXing");
                component.playAnimation();
            }


        }
        // for(let i = 0; i < 100;i++)
        // {
        //     cc.wwx.OutPut.log("GameVSResultWindow: star num:  " + i + " 段位: " + segment);
        // }


    }
});