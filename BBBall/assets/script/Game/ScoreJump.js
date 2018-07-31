cc.Class({
    extends:cc.Component,
    properties:{
        _score:null,
    },
    onLoad()
    {
        this._score = this.node.getComponent("cc.Label");
        this._anim = this.getComponent(cc.Animation);


    },
    jumpEndCallBack()
    {
        // this.node.destroy();
    },
    setScoreNum(score)
    {
        cc.wwx.OutPut.log("setScoreNum " + score);
        this.node.active = true;
        this._score.string = score.toString();
        // this._anim.play();

    }
})