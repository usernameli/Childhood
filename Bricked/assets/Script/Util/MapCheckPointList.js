/*
    关卡数据类
 */
let metaclass = cc._Class.extend({
    _MapMax:3000, //最大关卡数量
    _Map100Max:10, //白球模式关卡数量
    init()
    {

    },
    _getMapData(MapID)
    {
        if(MapID < 1 || MapID > this._MapMax)
        {
            SML.Output.warn('_getMapData MapID 无效：' + MapID);
            return [];
        }
        let mapFile = 'map/mapdata' + MapID + ".txt";
        cc.loader.loadRes(mapFile,function(err,data){
            if(err){
                SML.Output.warn('_getMapData mapFile 加载失败：' + mapFile);
                return [];
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

                SML.Output.log('_getMapData:', 'MapCheckPoint', JSON.stringify(mapFilter));
                return mapFilter;

            }
        });
    },
    _get100MapData()
    {
        let MapID = Math.floor(Math.random() * 10+1);
        let mapFile = 'map/mapdata100ball_' + MapID + ".txt";

        cc.loader.loadRes(mapFile,function(err,data){
            if(err){
                SML.Output.warn('_get100MapData mapFile 加载失败：' + mapFile);
                return [];
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

                SML.Output.log('_get100MapData:', 'MapCheckPoint', JSON.stringify(mapFilter));
                return mapFilter;

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
    getMapCheckPointData(mapID)
    {
        return this._getMapData(mapID);
    },
    get100MapCheckPointData()
    {
        return this._get100MapData()
    }
});


SML.MapCheckPointList = new metaclass();