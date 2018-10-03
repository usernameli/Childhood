cc.Class({
    extends:cc.Component,
    statics:{

        getLevelStarScore(level,ballNum,objNum)
        {
            if(level === 1)
            {
                return 920;
            }
            else if(level <= 10)
            {
                let scoreList = [670,1060,1370,2540,2320,2110,2320,4660,2540];
                return scoreList[level - 2];
            }
            else if(level <= 109)
            {
                let num = Math.floor(objNum * ballNum / 100  + 14);
                return 5 * (num / 2 + 1) * num / 2
            }
            else
            {
                let num = Math.floor(objNum * ballNum / 100  + 20);
                return 5 * (num / 2 + 1) * num / 2
            }
        }
    }
});