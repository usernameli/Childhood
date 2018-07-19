var storage = cc._Class.extend({
    Key_Setting_Music_Volume : 'setting.music.volume',
    Key_Setting_Effect_Volume : 'setting.effect.volume',
    Key_Force_Start_Match_Title : 'force.start.match.title',

    Key_Payment_Notify_Order_List : 'payment.notify.order.list',
    Key_Payment_Notify_Url : 'payment.notify.url',
    Key_AD_Video_Reward_Time : 'ad.video.time',
    Key_Gongzh_RedPoint_Date : 'gzh.redPoint.date',

    ctor : function() {
    },

    setItem : function() {
        cc.error('[meta function] setItem must be implement')
    },

    getItem : function() {
        cc.error('[meta function] getItem must be implement')
    },
})

var jsb_storage = storage.extend({
    ctor : function() {
        this._super.apply(this, arguments)
    },

    setItem : function(key, data) {
        cc.sys.localStorage.setItem(key, data);
    },

    getItem : function(key, onSuccess, defaultValue) {
        if (onSuccess) {
            var result = cc.sys.localStorage.getItem(key);
            result = result == null? defaultValue : result;
            SML.Output.log("tuyoo_storage jsb getItem success",key,result);
            onSuccess(result);
        }
    },
})

var wechat_storage = storage.extend({
    ctor : function() {
        this._super.apply(this, arguments)
    },

    setItem : function(key, data) {
        wx.setStorage({
            key : key,
            data: data,
            success : function(params) {
                SML.Output.info('wechat_storage setItem success:key=' + key +' params=' + JSON.stringify(params));
            },
            fail   : function(params) {
                SML.Output.err('wechat_storage setItem fail:key='  + key +' params=' + JSON.stringify(params));
            }
        });
    },

    getItem : function(key, onSuccess, defaultValue) {
        wx.getStorage({
            key     : key,
            success : function(params) {
                if (onSuccess) {
                    SML.Output.info("tuyoo_storage wx getItem success:",key,params.data);
                    onSuccess(params.data);
                }
            },
            fail    : function() {
                if (onSuccess) {
                    onSuccess(defaultValue);
                }
            },
        });
    },
})

if (CC_WECHATGAME) {
    SML.Storage = new wechat_storage();
} else {
    SML.Storage = new jsb_storage();
}