const KEY_LIST = ["levelHighStars", 'levelHighLv','classicHighScore', 'userId', 'ball100HighScore'];
let validRenderLv = 0;


let segmentImgUrls = [
    "res/raw-assets/resources/images/share/Ball_Rank_Head_BG.png",
    "res/raw-assets/resources/images/share/Ball_Rank_Stretching_BG.png",
    "res/raw-assets/resources/images/share/Ball_Rank_First.png",
    "res/raw-assets/resources/images/share/Ball_Rank_Second.png",
    "res/raw-assets/resources/images/share/Ball_Rank_Third.png",
    "res/raw-assets/resources/images/share/Ball_Rank_Head.png",
    "res/raw-assets/resources/images/share/Ball_Result_RankBG.png",
    "res/raw-assets/resources/images/share/Ball_Result_RankHeadIcon.png",

];
/**
 * 裁剪字符串
 * @param str
 * @param length
 * @returns {*}
 */
function sliceStringToLength (str, length) {
    if(!str) {
        return str;
    }
    let len = 0;
    let tmp = 0;
    let s;
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            tmp += 1;
        } else { // 如果是中文则长度加2
            tmp += 2;
        }
        if (tmp <= length - 3) {
            len++;
        }
    }

    if (tmp <= length) {
        s = str.slice(0);
    } else {
        s = str.slice(0, len);
        s += "...";
    }
    return s;
};
let kv2dic = function(data) {
    let dic = {};
    for (let i = 0; i < data.length; i++) {
        dic[data[i]['key']] = data[i]['value'];
    }
    return dic;
};
let dic2kv = function(data) {
    let list = [];
    for (let key in data) {
        let value = data[key];
        value = typeof(value) == 'number'? value.toString() : value;
        list.push({key : key, value : value})
    }
    return list;
};

/**
 * 预加载图片
 * @param drawImage
 */
function preloadImages (imgUrls, drawImageCallback) {
    let imageCache = {};
    let count = 0;

    for (let i = 0; i < imgUrls.length; i++) {
        (function(src) {
            console.log('preloadImages src=' + src);
            let image = wx.createImage();
            image.src = src;
            image.onload = function (event) {
                let img = event.target;
                if (!imageCache[src]) {
                    count++;
                }
                imageCache[src] = img;

                if (count == imgUrls.length) {
                    drawImageCallback(imageCache);
                }
            };
        })(imgUrls[i]);
    }
}

function drawImage (context, url, level, x, y, w, h) {
    let image = wx.createImage();
    image.src = url;
    image.onload = function (event) {
        if (level != validRenderLv) {
            return;
        }
        let img = event.target;
        let width = w || img.width;
        let height = h || img.height;
        context.drawImage(img, x - width / 2, y - height / 2, width, height);
    };
}

function drawDirect (context, img, level, x, y, w, h) {
    if (level != validRenderLv) {
        return;
    }
    let width = w || img.width;
    let height = h || img.height;
    context.drawImage(img, x - width / 2, y - height / 2, width, height);
}

/**
 * 上传本人信息
 * @param data
 */

let upload = function(data) {
    wx.setUserCloudStorage({
        KVDataList : dic2kv(data),
        success : function (params) {
            console.log('OpenRegion | setUserCloudStorage | success | ' + JSON.stringify(arguments));
        },
        fail : function (params) {

        },
    });

};

/**
 * 绘制排行榜
 * @param canvasSize
 * @param rankData
 * @param myUserId
 */
function drawCanvasRank (canvasSize, rankData, selfData, maxCount,rankType) {
    validRenderLv++;
    let curRenderLv = validRenderLv;
    let sharedCanvas = wx.getSharedCanvas();
    let sharedContext = sharedCanvas.getContext("2d");
    sharedContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
    sharedContext.textBaseline = "middle";

    for (let i = 0; i < rankData.length; i++) {
        let data = rankData[i];
        data.rank = i + 1;

        if (data.userId == selfData.userId) {
            selfData.rank = i + 1;
        }
    }

    // 填充数据
    let emptyCount = maxCount - rankData.length;
    let len = rankData.length;
    for (let i = 0; i < emptyCount; i++) {
        rankData.push({
            rank: len + i + 1,
            default : true
        })
    }

    preloadImages(segmentImgUrls, function(imageCache) {
        if (curRenderLv != validRenderLv) {
            return;
        }

        let cellWidth = 580;
        let cellHeight = 90;
        let baseX = cellWidth / 2;
        let contentWidth = 0;
        for (let i = 0; i < maxCount; i++) {
            let baseY = contentWidth + cellHeight / 2;

            let params = rankData[i] || selfData;
            if (params.default) {
                drawDirect(sharedContext, imageCache[segmentImgUrls[0]], curRenderLv, baseX, baseY);

                sharedContext.font="34px Arial";
                sharedContext.fillStyle="#87D4FF";
                sharedContext.textAlign="center";
                sharedContext.fillText('虚位以待', baseX, baseY);

                let rank = params.rank;
                // rank
                let isTopRanker = rank < 4;
                if (isTopRanker) {
                    drawImage(sharedContext, segmentImgUrls[rank + 1], curRenderLv, cellWidth/2 - 240, baseY);
                } else {
                    sharedContext.font="30px Arial";
                    sharedContext.fillStyle="#87D4FF";
                    sharedContext.textAlign="center";
                    sharedContext.fillText(rank, cellWidth/2 - 240, baseY);
                }

            } else {
                let rank = params.rank;

                // panel
                if (params.userId == selfData.userId) {
                    drawDirect(sharedContext, imageCache[segmentImgUrls[1]], curRenderLv, baseX, baseY);
                } else {
                    drawDirect(sharedContext, imageCache[segmentImgUrls[0]], curRenderLv, baseX, baseY);
                }

                // rank
                let isTopRanker = rank < 4;
                if (isTopRanker) {
                    drawImage(sharedContext, segmentImgUrls[rank + 1], curRenderLv, cellWidth/2 - 240, baseY);
                } else {
                    sharedContext.font="34px Arial";
                    sharedContext.fillStyle="#87D4FF";
                    sharedContext.textAlign="center";
                    sharedContext.fillText(rank, cellWidth/2- 240, baseY);
                }

                // avatar
                drawImage(sharedContext, params.avatar, curRenderLv, cellWidth/2 - 150, baseY, 72, 72);

                // name
                sharedContext.font="34px Arial";
                sharedContext.fillStyle="#87D4FF";
                sharedContext.textAlign="left";
                sharedContext.fillText(sliceStringToLength(params.name, 12), cellWidth/2 - 100, baseY);




                // star number
                sharedContext.font="34px Arial";
                sharedContext.fillStyle="#87D4FF";
                sharedContext.textAlign="left";
                if(rankType === "level")
                {
                    sharedContext.fillText("第" + params.levelHighLv + "关", cellWidth/2 + 120, baseY);

                }
                else if(rankType === "classic")
                {
                    sharedContext.fillText(params.classicHighScore + '分', cellWidth/2 + 120, baseY);

                }
                else
                {
                    sharedContext.fillText(params.ball100HighScore + '分', cellWidth/2 + 120, baseY);

                }


            }
            // increase
            contentWidth = contentWidth + cellHeight;
        }
    })
}
/**
 * 游戏结果排行榜
 * @param canvasSize
 * @param rankData
 * @param myUserId
 */

function drawCanvasResultRank(canvasSize, rankData, selfData, maxCount,rankType) {
    validRenderLv++;
    let curRenderLv = validRenderLv;
    let sharedCanvas = wx.getSharedCanvas();
    let sharedContext = sharedCanvas.getContext("2d");
    sharedContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
    sharedContext.textBaseline = "middle";
    let selfIndex = -1;
    for (let i = 0; i < rankData.length; i++) {
        let data = rankData[i];
        data.rank = i + 1;
        if (data.userId == selfData.userId) {
            selfData.rank = i + 1;
            selfIndex = i;
        }

    }

    let rankList = [];
    console.log('drawFriendSegmentRank.selfIndex =', selfIndex);

    if(rankData.length <= 3)
    {
        rankList = rankData;
    }
    else
    {
        if(selfIndex === -1)
        {
            rankList.push(rankData[0]);
            rankList.push(rankData[1]);
            rankList.push(rankData[2]);
        }
        else if(selfIndex === 0)
        {
            rankList.push(rankData[selfIndex]);
            rankList.push(rankData[selfIndex + 1]);
            rankList.push(rankData[selfIndex + 2]);

        }
        else if(selfIndex === rankData.length - 1)
        {
            rankList.push(rankData[selfIndex - 2]);
            rankList.push(rankData[selfIndex - 1]);
            rankList.push(rankData[selfIndex]);

        }
        else
        {
            rankList.push(rankData[selfIndex - 1]);
            rankList.push(rankData[selfIndex]);
            rankList.push(rankData[selfIndex + 1]);
        }
    }

    console.log('drawFriendSegmentRank.rankList =', JSON.stringify(rankList));


    preloadImages(segmentImgUrls, function(imageCache) {
        if (curRenderLv != validRenderLv) {
            return;
        }

        let cellWidth = 180;
        let cellHeight = 258;
        let baseY = cellHeight / 2;
        let contentWidth = 0;
        for (let i = 0; i < rankList.length; i++) {
            let baseX = contentWidth + cellWidth / 2;

            let params = rankList[i];

            let rank = params.rank;

            // panel
            drawDirect(sharedContext, imageCache[segmentImgUrls[6]], curRenderLv, baseX, baseY);

            // rank

            sharedContext.font="30px Arial";
            sharedContext.fillStyle="#FFFFFF";
            sharedContext.textAlign="center";
            sharedContext.fillText(rank, baseX, 20);



            // avatar
            drawDirect(sharedContext, imageCache[segmentImgUrls[7]], curRenderLv, baseX, 105);
            drawImage(sharedContext, params.avatar, curRenderLv, baseX, 105, 128, 128);

            // name
            sharedContext.font="28px Arial";
            sharedContext.fillStyle="#FFFFFF";
            sharedContext.textAlign="center";
            sharedContext.fillText(sliceStringToLength(params.name, 12), baseX, 195);

            // star number
            sharedContext.font="30px Arial";
            sharedContext.fillStyle="#F1A040";
            sharedContext.textAlign="center";
            if(rankType === "level")
            {
                sharedContext.fillText("第" + params.levelHighLv + "关", baseX, 230);

            }
            else if(rankType === "classic")
            {
                sharedContext.fillText(params.classicHighScore + '分', baseX, 230);

            }
            else
            {
                sharedContext.fillText(params.ball100HighScore + '分', baseX, 230);

            }

            // increase
            contentWidth = contentWidth + cellWidth;
        }
    })
}

function drawSelfUserInfo(canvasSize,data) {
    validRenderLv++;
    let curRenderLv = validRenderLv;
    let sharedCanvas = wx.getSharedCanvas();
    let sharedContext = sharedCanvas.getContext("2d");
    sharedContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
    sharedContext.textBaseline = "middle";
    let imgUrl = [data.avatarUrl];
    preloadImages(imgUrl, function(imageCache) {

        drawDirect(sharedContext, imageCache[imgUrl[0]], curRenderLv, 50, 50,100,100);

        sharedContext.font="28px Arial";
        sharedContext.fillStyle="#FFFFFF";
        sharedContext.textAlign="center";
        sharedContext.fillText(sliceStringToLength(data.nickName, 12), 170, 30);

    });

}

function drawResultRank(data) {

    let canvasSize = data['canvasSize'];
    let selfData = data['selfData'];
    let rankType = data['rankType'];
    let itemCount  = data['count'];

    wx.getFriendCloudStorage({
        keyList : KEY_LIST,
        success : function (res) {
            let rankList = [];
            for (let i = 0; i < res.data.length; i++) {
                let info = res.data[i];
                let dicInfo = kv2dic(info['KVDataList']);
                let rankData = {
                    name: info['nickname'],
                    avatar: info['avatarUrl'],
                    userId: dicInfo['userId'],
                    levelHighLv: parseInt(dicInfo['levelHighLv']),
                    classicHighScore: parseInt(dicInfo['classicHighScore']),
                    ball100HighScore: parseInt(dicInfo['ball100HighScore']),
                };
                rankList.push(rankData);
            }
            if(rankType === "level")
            {
                rankList.sort(function(a, b){
                    return b.levelHighLv - a.levelHighLv;
                });
            }
            else if(rankType === "classic")
            {
                rankList.sort(function(a, b){
                    return b.classicHighScore - a.classicHighScore;
                });
            }
            else
            {
                rankList.sort(function(a, b){
                    return b.ball100HighScore - a.ball100HighScore;
                });
            }
            console.log('drawFriendSegmentRank.rankList =', JSON.stringify(rankList));

            drawCanvasResultRank(canvasSize, rankList, selfData, itemCount,rankType);
        },
        fail : function (res) {
            console.log('drawFriendSegmentRank.fail =', JSON.stringify(res));
        },
    });
}
/**
 *  drawRank
 */
function drawRank (data)
{
    let itemCount  = data['count'];
    let canvasSize = data['canvasSize'];
    let selfData = data['selfData'];
    let rankType = data['rankType'];

    wx.getFriendCloudStorage({
        keyList : KEY_LIST,
        success : function (res) {
            let rankList = [];
            for (let i = 0; i < res.data.length; i++) {
                let info = res.data[i];
                let dicInfo = kv2dic(info['KVDataList']);
                if(rankType === "level")
                {
                    if(parseInt(dicInfo['levelHighLv']) ===  0)
                    {
                        continue;
                    }
                }
                else if(rankType === "classic")
                {
                    if(parseInt(dicInfo['classicHighScore']) ===  0)
                    {
                        continue;
                    }
                }
                else
                {
                    if(parseInt(dicInfo['ball100HighScore']) === 0)
                    {
                        continue;
                    }
                }
                let rankData = {
                    name: info['nickname'],
                    avatar: info['avatarUrl'],
                    userId: dicInfo['userId'],
                    levelHighLv: parseInt(dicInfo['levelHighLv']),
                    classicHighScore: parseInt(dicInfo['classicHighScore']),
                    ball100HighScore: parseInt(dicInfo['ball100HighScore']),
                };
                rankList.push(rankData);
            }
            if(rankType === "level")
            {
                rankList.sort(function(a, b){
                    return b.levelHighLv - a.levelHighLv;
                });
            }
            else if(rankType === "classic")
            {
                rankList.sort(function(a, b){
                    return b.classicHighScore - a.classicHighScore;
                });
            }
            else
            {
                rankList.sort(function(a, b){
                    return b.ball100HighScore - a.ball100HighScore;
                });
            }


            drawCanvasRank(canvasSize, rankList, selfData, itemCount,rankType);
        },
        fail : function (res) {
            console.log('drawFriendSegmentRank.fail =', JSON.stringify(res));
        },
    });

}

function drawUserInfo(data) {
    let canvasSize = data['canvasSize'];
    wx.getUserInfo({
        openIdList: ['selfOpenId'],
        lang: 'zh_CN',
        success: function(res) {
            console.log('success', res.data[0]);
            drawSelfUserInfo(canvasSize,res.data[0]);
        },
        fail: function(res){

        }
    })
}
function drawGroupRank(data)
{
    let itemCount  = data['count'];
    let canvasSize = data['canvasSize'];
    let selfData = data['selfData'];
    let rankType = data['rankType'];
    let shareTicket = data['shareTicket'];

    wx.getGroupCloudStorage({
        shareTicket : shareTicket,
        keyList : KEY_LIST,
        success : function (res) {
            console.log('drawGroupRank.success =', JSON.stringify(res.data));
            let rankList = [];
            for (let i = 0; i < res.data.length; i++) {
                let info = res.data[i];
                let dicInfo = kv2dic(info['KVDataList']);
                let rankData = {
                    name: info['nickname'],
                    avatar: info['avatarUrl'],
                    userId: dicInfo['userId'],
                    levelHighLv: parseInt(dicInfo['levelHighLv']),
                    classicHighScore: parseInt(dicInfo['classicHighScore']),
                    ball100HighScore: parseInt(dicInfo['ball100HighScore']),
                };
                rankList.push(rankData);

            }
            if(rankType === "level")
            {
                rankList.sort(function(a, b){
                    return b.levelHighLv - a.levelHighLv;
                });
            }
            else if(rankType === "classic")
            {
                rankList.sort(function(a, b){
                    return b.classicHighScore - a.classicHighScore;
                });
            }
            else
            {
                rankList.sort(function(a, b){
                    return b.ball100HighScore - a.ball100HighScore;
                });
            }


            drawCanvasRank(canvasSize, rankList, selfData, itemCount,rankType);
        },
        fail : function (params) {
        },
    });
}
function initShareCanvas () {
    let sharedCanvas = wx.getSharedCanvas();
    let sharedContext = sharedCanvas.getContext("2d");
    sharedContext.clearRect(0, 0, 100, 100);
}

let transformMap = {
    'upload' : upload,
    'initShareCanvas': initShareCanvas,
    'drawFriendRank' : drawRank,
    'drawGroupRank'  : drawGroupRank,
    'drawResultRank' : drawResultRank,
    'getUserInfo'    : drawUserInfo,
};

wx.onMessage(function(data) {
    transformMap[data.method] && transformMap[data.method](data.data);
});