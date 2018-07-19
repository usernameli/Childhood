/**
 * 全局消息
 */
SML.Notify = {
    events : {},
    listen : function(eName, handler, scope){
        this.events[eName] = this.events[eName] || [];
        this.events[eName].push({
            scope: scope || this,
            handler: handler
        });
    },

    ignore : function(eName, handler, scope){
        scope = scope || this;
        var fns = this.events[eName];

        if(!fns) 
            return;

        this.events[eName] = fns.filter(function(fn){
            return fn.scope!=scope || fn.handler!=handler
        });
    },

    ignoreScope : function (scope) {
        for(var msg in this.events){
            var obs = this.events[msg];
            if(obs){
                this.events[msg] = obs.filter(function(fn){
                    if(fn.scope != scope){
                        return true;
                    } else{
                        return false;
                    }
                })
            }
        }
    },
    // 
    trigger : function(eventName, params){
        var fns = this.events[eventName];
        
        if(!fns){
          return;
        }

        var fn;
    
        for(var i = 0; i < fns.length; i++){
            fn = fns[i];
            // fn.handler.apply(fns.scope, params||[]);
            // 用call直接把各个参数回调出去
            fn.handler.call(fn.scope, params)
        }
    }
};