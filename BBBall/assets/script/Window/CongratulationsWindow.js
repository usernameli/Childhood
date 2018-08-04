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

    },
})
