//全局事件
cc.director.GlobalEvent = {
    handles_: {},

    //发送事件
    emitold: function (eventName, data) {
        var returns = [] //返回值

        data.eventName = eventName//保存一下事件名字

        for ( var findEvenName in this.handles_ ){
            if (findEvenName === eventName) {
                for (var i = 0; i < this.handles_[findEvenName].length; i++) {
                    var returnValue = this.handles_[findEvenName][i](data);
                    returns.push(returnValue)
                }
            }
        }

        return returns
    },
    //添加普通事件
    onold: function (eventName, callback, target) {
        console.log('收到事件 ' + target._tag);
        this.handles_[eventName] = this.handles_[eventName] || [];

        this.handles_[eventName].push(callback.bind(target))
    },
    //通过事件名和target移除一个监听器
    off: function (eventName) {
        for (var i = 0; i < this.handles_[eventName].length; i++) {
            this.handles_[eventName][i] = null
        }
    },

    on : function(node, eventName, cb) {
        var eventListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName : eventName,
            callback : function(event) {
                var data = event.getUserData();
                if (cb) {
                    cb(data);
                }
            },
        });
        cc.eventManager.addListener(eventListener, node);

        return eventListener;
    },
    emit : function(eventName, optionData) {
        cc.eventManager.dispatchCustomEvent(eventName, optionData);
    },
}
