/**
 * 分享接口
 * @type {{}}
 */

SML.ShareManager = {
    /**
     * 段位升级
     * @param segment
     * @param segmentName
     */
    shareSegmentUp : function(segment, segmentName) {
        SML.GlobalFuncs.runCustomShare({
            burialId:SML.BurialShareType.SegmentUp,
            paintConfig:{
                nodes: [
                    {type:"img",url:cc.url.raw("resources/images/share/share_rank_bg.png"),pos:{x:180,y:140},scale:1},
                    {type:"img",url:cc.url.raw(`resources/images/share/nopack_icon_title_segment_${segment}.png`),pos:{x:180,y:140},scale:1},
                    {type:"txt",pos:{x:148,y:53},fsize:18,content: segmentName,fcolor:"#ffffff"}
                ]
            }
        });
    },

    /**
     * 好友桌结算
     * @param info
     */
    shareFTResult: function (info) {
        var url0 = SML.Loader.dealHeadIconUrl(info[0].avatar, '/46').url;
        var url1 = SML.Loader.dealHeadIconUrl(info[1].avatar, '/46').url;
        var url2 = SML.Loader.dealHeadIconUrl(info[2].avatar, '/46').url;
        SML.Output.warn('FT icon 1: ' + url0);
        SML.Output.warn('FT icon 2: ' + url1);
        SML.Output.warn('FT icon 3: ' + url2);
        SML.GlobalFuncs.runCustomShare({
            burialId:SML.BurialShareType.FriendTableResult,
            paintConfig:{
                nodes: [
                    {type:"img",url:cc.url.raw("resources/images/share/share_ft_result_bg.jpg"),pos:{x:180,y:140},scale:1},

                    {type:"img",url:url0,pos:{x:197,y:174},scale:1,size:{width:30,height:30}},
                    {type:"txt",pos:{x:218,y:167},fsize:15,content:SML.GlobalFuncs.sliceStringToLength(info[0].nickname, 10),fcolor:"#626262"},
                    {type:"txt",pos:{x:307,y:167},fsize:15,content:info[0].score,fcolor:"#ff0000"},

                    {type:"img",url:url1,pos:{x:197,y:131},scale:1,size:{width:30,height:30}},
                    {type:"txt",pos:{x:218,y:126},fsize:15,content:SML.GlobalFuncs.sliceStringToLength(info[1].nickname, 10),fcolor:"#626262"},
                    {type:"txt",pos:{x:307,y:126},fsize:15,content:info[1].score,fcolor:"#208196"},

                    {type:"img",url:url2,pos:{x:197,y:92},scale:1,size:{width:30,height:30}},
                    {type:"txt",pos:{x:218,y:84},fsize:15,content:SML.GlobalFuncs.sliceStringToLength(info[2].nickname, 10),fcolor:"#626262"},
                    {type:"txt",pos:{x:307,y:84},fsize:15,content:info[2].score,fcolor:"#208196"},
                ]
            }
        });
    },

    /**
     * 分享排行
     * @param rank
     * @param segmentName
     */
    shareRank:function(rank, segmentName) {
        var msg = "第" + rank + "名";
        if (rank < 1) {
            msg = '未上榜';
        }
        var nameStr = SML.GlobalFuncs.sliceStringToLength(SML.UserInfo.userName, 12);
        SML.GlobalFuncs.runCustomShare({
            burialId:SML.BurialShareType.RankNotify,
            paintConfig:{
                nodes: [
                    {type:"img",url:cc.url.raw("resources/images/share/share_ty_rank_bg.jpg"),pos:{x:180,y:140},scale:1},

                    {type:"txt",pos:{x:55,y:116},fsize:16,content:msg,fcolor:"#984723"},
                    {type:"img",url:SML.UserInfo.userPic,pos:{x:145,y:123},scale:1,size:{width:30,height:30}},
                    {type:"txt",pos:{x:169,y:116},fsize:16,content:nameStr,fcolor:"#626262"},
                    {type:"txt",pos:{x:267,y:116},fsize:16,content: segmentName,fcolor:"#208196"},
                ]
            }
        });
    },

    /**
     * 分享高倍
     * @param desc
     */
    shareHeightMultiple:function(desc) {
        SML.GlobalFuncs.runCustomShare({
            burialId:SML.BurialShareType.HighRate,
            paintConfig:{
                nodes: [
                    {type:"img",url:cc.url.raw("resources/images/share/share_gb_bg.jpg"),pos:{x:180,y:140},scale:1},
                    {type:"txt",pos:{x:159,y:217},fsize:45,content:desc,fcolor:"#000000"}
                ]
            }
        });
    },

    /**
     * 分享比赛结算截图
     * @param desc
     */
    shareMatchResult:function(matchBurial, isWin, rank, rewardDesc) {
        if (isWin) {
            var url = cc.url.raw("resources/images/share/share_match_result_win.jpg");
        } else {
            var url = cc.url.raw("resources/images/share/share_match_result_lose.jpg");
        }
        var nodes = [
            {type:"img",url:url,pos:{x:250,y:200},scale:1},
            {type:"txt",pos:{x:250,y:isWin?162:95},fsize:128,content:rank.toString(),fcolor:"#ffffff",align:"center"}
        ]
        if (rewardDesc) {
            var node = {type:"txt",pos:{x:250,y:50},fsize:28,content:rewardDesc,fcolor:"#FFCA25",align:"center"};
            nodes.push(node);
        }
        SML.GlobalFuncs.runCustomShare({
            'burialId':matchBurial,
            'paintConfig':{
                'nodes': nodes,
                'size':{'width':500, 'height':400}
            }
        });
    },

    /**
     * 分享连胜
     * @param desc '99%'
     * @param winStreak
     */
    shareWinStreak:function(desc, winStreak) {
        SML.GlobalFuncs.runCustomShare({
            burialId:SML.BurialShareType.CoinRoomWinStreak,
            paintConfig:{
                nodes: [
                    {type:"img",url:cc.url.raw("resources/images/share/share_ls_bg.jpg"),pos:{x:250,y:200},scale:1},
                    {type:"txt",pos:{x:292,y:285},fsize:24,content:desc,fcolor:"#000000",rotation:-Math.PI/20},
                    {type:"img",url:cc.url.raw("resources/images/share/ddz_result_base_winstrea_" + winStreak +".png"),pos:{x:185,y:100},scale:1,rotation:-Math.PI/20}
                ],
                'size':{'width':500, 'height':400}
            }
        });
    },
};