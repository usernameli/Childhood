cc.Class({
    extends:cc.Component,
    statics:{
        _MapMax:1000, //最大关卡数量
        _Map100Max:10, //白球模式关卡数量
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
        getMapCheckPointData(mapID,cb)
        {
            this._getMapData(mapID,cb);
        },
        get100MapCheckPointData(cb)
        {
            this._get100MapData(cb)
        }
    }
})