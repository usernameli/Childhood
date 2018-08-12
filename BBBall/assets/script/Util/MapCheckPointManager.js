

cc.Class({
    extends:cc.Component,
    statics:{
        _MapMax:1000, //最大关卡数量
        _Map100Max:10, //白球模式关卡数量
        _MapBallList:[],
        initMapCheckPointBallInfo()
        {
            let mapFile = "map/gamedata_savelv.txt";
            let self = this;
            cc.loader.loadRes(mapFile,function(err,data) {
                if (err) {
                    cc.wwx.OutPut.warn('_getMapData mapFile 加载失败：' + mapFile);

                } else {
                    let mapData=data.split(new RegExp('\\r\\n|\\r|\\n'));

                    let mapFilter = [];
                    for(let i = 0; i < mapData.length;i++)
                    {
                        mapFilter.push(mapData[i].split(new RegExp(',| ')))

                    }

                    for(let i = 0; i < mapFilter.length;i++)
                    {

                        for(let loop = 0; loop < 3;loop++)
                        {
                            let findIndex  = [];
                            let filterList = mapFilter[i];
                            for(let k = 0; k < filterList.length;k++)
                            {
                                if(filterList[k] === "")
                                {
                                    findIndex.push(k);
                                    break;
                                }
                            }

                            if(findIndex.length > 0)
                            {
                                for(let j = 0; j < findIndex.length;j++)
                                {
                                    mapFilter[i].splice(findIndex[j],1);
                                }
                            }
                        }

                    }

                    self._MapBallList = mapFilter;



                }
            });

        },

        _getMapData(MapID,cb)
        {
            if(MapID < 1 || MapID > this._MapMax)
            {
                cc.wwx.OutPut.warn('_getMapData MapID 无效：' + MapID);
                return [];
            }
            let mapFile = 'map/mapdata' + MapID + ".txt";
            cc.loader.loadRes(mapFile,function(err,data){
                if(err){
                    cc.wwx.OutPut.warn('_getMapData mapFile 加载失败：' + mapFile);
                    if(cb)
                    {
                        cb([]);
                    }
                }else{
                    let mapData=data.split(new RegExp('\\r\\n|\\r|\\n'));
                    let mapFilter = [];
                    for(let i = 0; i < mapData.length;i++)
                    {
                        if(mapData[i] !== "type=Tile Layer 1" &&
                            mapData[i] !== "type=Tile Layer 2" &&
                            mapData[i] !== "data="
                        )
                        {
                            if(mapData[i].indexOf(",") >= 0 )
                            {
                                mapFilter.push(mapData[i].split(new RegExp(',')))

                            }
                        }
                    }

                    for(let i = 0; i < mapFilter.length;i++)
                    {
                        if(mapFilter[i][mapFilter[i].length - 1] === "0.")
                        {
                            mapFilter[i][mapFilter[i].length - 1] = "0";
                        }
                        else
                        {
                            mapFilter[i].pop();

                        }

                    }
                    if(cb)
                    {
                        cb(mapFilter);
                    }

                }
            });
        },
        _get100MapData(cb)
        {
            let MapID = Math.floor(Math.random() * 10+1);

            let mapFile = 'map/mapdata100ball_' + MapID + ".txt";
            cc.wwx.OutPut.log("_get100MapData",mapFile);
            cc.loader.loadRes(mapFile,function(err,data){
                if(err){
                    cc.wwx.OutPut.warn('_get100MapData mapFile 加载失败：' + mapFile);
                    if(cb)
                    {
                        cb([]);
                    }
                }else{
                    let mapData=data.split(new RegExp('\\r\\n|\\r|\\n'));
                    let mapFilter = [];
                    for(let i = 0; i < mapData.length;i++)
                    {
                        if(mapData[i] !== "type=Tile Layer 1" &&
                            mapData[i] !== "type=Tile Layer 2" &&
                            mapData[i] !== "data="
                        )
                        {
                            if(mapData[i].indexOf(",") >= 0 )
                            {
                                mapFilter.push(mapData[i].split(new RegExp(',')))

                            }


                        }

                    }


                    for(let i = 0; i < mapFilter.length;i++)
                    {
                        if(mapFilter[i][mapFilter[i].length - 1] === "0.")
                        {
                            mapFilter[i][mapFilter[i].length - 1] = "0";
                        }
                        else
                        {
                            mapFilter[i].pop();

                        }

                    }
                    if(cb)
                    {
                        cb(mapFilter);
                    }

                }
            });
        },
        getMapMax()
        {
            return this._MapMax;

        },
        get100MapMax()
        {
            return this._Map100Max;
        },
        //获取一个关卡的数据
        getTestMapCheckAllData()
        {
            for(let i = 1; i < 100;i++)
            {
                this._getMapData(i,function () {
                    
                });
            }

        },
        getMapCheckPointData(mapID,cb)
        {
            this._getMapData(mapID,cb);
        },
        get100MapCheckPointData(cb)
        {
            this._get100MapData(cb)
        },
        getBallInfoByMapId(mapId)
        {
            if(this._MapBallList.length > mapId)
            {
                return this._MapBallList[mapId-1][1];
            }
            else
            {
                return 55;
            }
        }
    }
})