cc.Class({
    extends:cc.component,
    properties:{
        _obs_square_pool:null,
        _obj_triangle_pool:null,
    },
    init()
    {
        this._obs_square_pool = new cc.NodePool('obs_square_pool');
        this._obj_triangle_pool = new cc.NodePool('obj_triangle_pool');
    },
    putPool(obsType,objs)
    {
        if(obsType === "square")
        {
            this._obs_square_pool.put(objs);
        }
        else if(obsType === "triangle")
        {
            this._obj_triangle_pool.put(objs)
        }
    },
    getPool(obsType,prefab)
    {
        if(obsType === "square")
        {
            if(this._obs_square_pool.size() > 0)
            {
                return this._obs_square_pool.get();

            }
            else
            {
                let objPrefab = cc.instantiate(prefab);
                return objPrefab;
            }
        }
        else if(obsType === "triangle")
        {
            if(this._obj_triangle_pool.size() > 0)
            {
                return this._obj_triangle_pool.get();
            }
            else
            {
                let objPrefab = cc.instantiate(prefab);
                return objPrefab;
            }
        }
    }


});