cc.Class({
    extends:cc.component,
    statics: {
        _obs_square_pool: null,
        _obj_triangle_pool: null,
        _ball_poll: null,

        init() {
            this._obs_square_pool = new cc.NodePool();
            this._obj_triangle_pool = new cc.NodePool();
            this._ball_poll = new cc.NodePool();
        },
        putPool(obsType, objs) {
            if (obsType === "square") {
                this._obs_square_pool.put(objs);
            }
            else if (obsType === "triangle") {
                this._obj_triangle_pool.put(objs)
            }
            else if (obsType === "ball") {
                this._ball_poll.put(objs)

            }
        },
        getPool(obsType, prefab) {
            if (obsType === "square") {
                if (this._obs_square_pool.size() > 0) {
                    return this._obs_square_pool.get();

                }
                else {
                    let objPrefab = cc.instantiate(prefab);
                    return objPrefab;
                }
            }
            else if (obsType === "triangle") {
                if (this._obj_triangle_pool.size() > 0) {
                    return this._obj_triangle_pool.get();
                }
                else {
                    let objPrefab = cc.instantiate(prefab);
                    return objPrefab;
                }
            }
            else if (obsType === "ball") {
                if (this._ball_poll.size() > 0) {
                    return this._ball_poll.get();
                }
                else {
                    let objPrefab = cc.instantiate(prefab);
                    return objPrefab;
                }
            }
        }
    }


});