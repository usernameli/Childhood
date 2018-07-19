/**
 * 牌桌消息缓存池管理，用于牌桌UI初始化之前缓存消息
 * @type {{}}
 */

SML.TableMsgManager = {
    active : false, // 活动中的缓存池每一帧发送一条协议，非活动的仅仅存储协议
    _msgPool : [], // 缓存池
    CACHING_CMDs : [], // 需要缓存的协议
    _map: {},

    init : function () {
        this.active = false;
        this._msgPool = [];
        this.CACHING_CMDs = [];
        this.CACHING_CMDs.push(SML.Event.CMD_TABLE_INFO);
        this.CACHING_CMDs.push(SML.Event.CMD_TABLE_CALL);
        this.CACHING_CMDs.push(SML.Event.CMD_MATCH_WAIT);
        this.CACHING_CMDs.push(SML.Event.CMD_MATCH_OVER);

        // 注册协议，用于执行前的数据处理
        this.register(SML.Event.CMD_TABLE_INFO, this._onMsgTableInfo);

        // 启动定时器，每帧执行一次
        cc.director.getScheduler().schedule(function(df){
            this.update(df);
        }.bind(this), cc.director, 0, cc.macro.REPEAT_FOREVER, 0, false);
    },

    register: function(eventName, func) {
        this._map[eventName] = func;
    },

    exec:function(cmd, params) {
        var func = this._map[cmd];
        if (typeof func == 'function') {
            func.call(this, params);
        }
    },

    update:function(df) {
        if (this.active && this._msgPool.length > 0) {
            var msg = this._msgPool.shift();
            if (msg) {
                SML.Output.log('SML.TableMsgManager', '[update msg] ' + JSON.stringify(msg.params));
                this.exec(msg.cmd, msg.params);
                SML.Notify.trigger(msg.cmd, msg.params);
            }
        }
    },

    addMsg : function(cmd, params) {
        SML.Output.log('SML.TableMsgManager', '[add msg] ' + JSON.stringify(params));
        this._msgPool.push({
            cmd : cmd,
            params : params
        });
    },

    /**
     * 过滤牌桌协议，添加进缓存
     * @param params
     * @returns {boolean}
     */
    filterMsg : function (params) {
        var cmd = params.cmd;
        this.beforeFilter(cmd, params);
        if (this.CACHING_CMDs.contains(cmd)) {
            this.addMsg(cmd, params);
            return true;
        } else {
            return false;
        }
    },

    /**
     * 对过滤前操作
     * @param cmd
     * @param params
     */
    beforeFilter: function(cmd, params) {
        if (cmd == SML.Event.CMD_TABLE_INFO) {
            var result = params['result'];
            var seat1 = result['seat1'] || {uid:0};
            var seat2 = result['seat2'] || {uid:0};
            var seat3 = result['seat3'] || {uid:0};
            if (seat1.uid > 0 && seat2.uid > 0 && seat3.uid > 0) {
                // 天梯赛仅仅保留最后一条table_info消息，避免出现多次刷新玩家头像问题
                if (SML.TableModel.tableType() == SML.TableModel.TableType.segment) {
                    this._msgPool = [];
                }
                SML.Notify.trigger(SML.Event.MSG_TABLE_PLAYER_FULL);
            }
        } else if (cmd == SML.Event.CMD_QUICK_START) {
            this._msgPool = [];
        }
    },

    _onMsgTableInfo:function(params) {
        var result = params['result'];
        SML.TableModel.tableInfo.cleanup();
        SML.TableModel.tableInfo.parse(result);
        SML.TableModel.tbbox.parseTableInfo();
    },
}