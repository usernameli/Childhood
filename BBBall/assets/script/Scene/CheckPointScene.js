cc.Class({
    extends:cc.Component,
    properties:{
        sumStarNum:{
            default:null,
            type:cc.Label
        },

        _tag:"CheckPointScene",
    },
    onLoad()
    {
        if(!cc.wwx)
        {
            initMgr();
        }
        let levelHighStar = cc.wwx.UserInfo.gdata["levelHighStar"];
        let sumStar = 0;
        for(let i = 0; i < levelHighStar.length;i++)
        {
            sumStar += levelHighStar[i];
        }
        this.sumStarNum.string = sumStar;


        cc.director.preloadScene("GameScene", function () {
            cc.log("Next GameScene scene preloaded");
        });
    },
    clickGoHome()
    {
        cc.wwx.AudioManager.playAudioButton();

        cc.wwx.SceneManager.switchScene("GameHall");


    },
})