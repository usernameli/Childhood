cc.Class({
    extends:cc.Component,
    statics:{

        getLevelStarScore(level,ballNum)
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
            else
            {
                return 5 * (ballNum / 2 + 1) * ballNum / 2
            }
        }
    }
})