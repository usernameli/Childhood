cc.Class({
    extends:cc.Component,
    properties:{
        redPointNum:{
            default:null,
            type:cc.Label,
        }
    },
    onLoad()
    {

    },
    setRedPointNum(num)
    {
        this.redPointNum.string = num.toString();
    },
    onDestroy()
    {

    }
})