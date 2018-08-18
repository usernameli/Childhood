const KEY_LIST = ["levelHighStars", 'levelHighLv','classicHighScore', 'userId', 'ball100HighScore'];
let validRenderLv = 0;


let segmentImgUrls = [
    "res/raw-assets/resources/images/share/Ball_Rank_Head_BG.png",
    "res/raw-assets/resources/images/share/Ball_Rank_Stretching_BG.png",
    "res/raw-assets/resources/images/share/Ball_Rank_First.png",
    "res/raw-assets/resources/images/share/Ball_Rank_Second.png",
    "res/raw-assets/resources/images/share/Ball_Rank_Third.png",
    "res/raw-assets/resources/images/share/Ball_Rank_Head.png",

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
    var len = 0;
    var tmp = 0;
    var s;
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
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
var dic2kv = function(data) {
    var list = [];
    for (var key in data) {
        var value = data[key];
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

    for (var i = 0; i < imgUrls.length; i++) {
        (function(src) {
            console.log('preloadImages src=' + src);
            var image = wx.createImage();
            image.src = src;
            image.onload = function (event) {
                var img = event.target;
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
    var image = wx.createImage();
    image.src = url;
    image.onload = function (event) {
        if (level != validRenderLv) {
            return;
        }
        var img = event.target;
        var width = w || img.width;
        var height = h || img.height;
        context.drawImage(img, x - width / 2, y - height / 2, width, height);
    };
}

function drawDirect (context, img, level, x, y, w, h) {
    if (level != validRenderLv) {
        return;
    }
    var width = w || img.width;
    var height = h || img.height;
    context.drawImage(img, x - width / 2, y - height / 2, width, height);
}

/**
 * 上传本人信息
 * @param data
 */

var upload = function(data) {
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

    for (var i = 0; i < rankData.length; i++) {
        var data = rankData[i];
        data.rank = i + 1;

        if (data.userId == selfData.userId) {
            selfData.rank = i + 1;
        }
    }

    // 填充数据
    var emptyCount = maxCount - rankData.length;
    let len = rankData.length;
    for (var i = 0; i < emptyCount; i++) {
        rankData.push({
            rank: len + i + 1,
            default : true
        })
    }

    preloadImages(segmentImgUrls, function(imageCache) {
        if (curRenderLv != validRenderLv) {
            return;
        }

        var cellWidth = 580;
        var cellHeight = 90;
        let baseX = cellWidth / 2;
        var contentWidth = 0;
        for (var i = 0; i < maxCount; i++) {
            var baseY = contentWidth + cellHeight / 2;

            var params = rankData[i] || selfData;
            if (params.default) {
                drawDirect(sharedContext, imageCache[segmentImgUrls[0]], curRenderLv, baseX, baseY);

                sharedContext.font="34px Arial";
                sharedContext.fillStyle="#87D4FF";
                sharedContext.textAlign="center";
                sharedContext.fillText('虚位以待', baseX, baseY);

                var rank = params.rank;
                // rank
                var isTopRanker = rank < 4;
                if (isTopRanker) {
                    drawImage(sharedContext, segmentImgUrls[rank + 1], curRenderLv, cellWidth/2 - 240, baseY);
                } else {
                    sharedContext.font="30px Arial";
                    sharedContext.fillStyle="#87D4FF";
                    sharedContext.textAlign="center";
                    sharedContext.fillText(rank, cellWidth/2 - 240, baseY);
                }

            } else {
                var rank = params.rank;

                // panel
                if (params.userId == selfData.userId) {
                    drawDirect(sharedContext, imageCache[segmentImgUrls[1]], curRenderLv, baseX, baseY);
                } else {
                    drawDirect(sharedContext, imageCache[segmentImgUrls[0]], curRenderLv, baseX, baseY);
                }

                // rank
                var isTopRanker = rank < 4;
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
                sharedContext.textAlign="center";
                sharedContext.fillText(sliceStringToLength(params.name, 12), cellWidth/2 - 50, baseY);




                // star number
                sharedContext.font="34px Arial";
                sharedContext.fillStyle="#87D4FF";
                sharedContext.textAlign="left";
                if(rankType === "Level")
                {
                    sharedContext.fillText("第" + params.levelHighLv + "关", cellWidth/2 + 120, baseY);

                }
                else if(rankType === "Classic")
                {
                    sharedContext.fillText(classicHighScore + '分', cellWidth/2 + 120, baseY);

                }
                else
                {
                    sharedContext.fillText(ball100HighScore + '分', cellWidth/2 + 120, baseY);

                }


            }
            console.log("params.rank: ",params.rank);
            console.log("baseX: " ,baseX);
            console.log("baseY: " ,baseY);
            // increase
            contentWidth = contentWidth + cellHeight;
            console.log("contentWidth: ",contentWidth);
        }
    })
};

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
            console.log('drawFriendLevelRank.success =', JSON.stringify(res.data));
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
            if(rankType === "Level")
            {
                rankList.sort(function(a, b){
                    return b.levelHighLv - a.levelHighLv;
                });
            }
            else if(rankType === "Chassic")
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
            if(rankType === "Level")
            {
                rankList.sort(function(a, b){
                    return b.levelHighLv - a.levelHighLv;
                });
            }
            else if(rankType === "Chassic")
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

let transformMap = {
    'upload' : upload,
    'drawFriendRank' : drawRank,
    'drawGroupRank'  : drawGroupRank
};

wx.onMessage(function(data) {
    transformMap[data.method] && transformMap[data.method](data.data);
});