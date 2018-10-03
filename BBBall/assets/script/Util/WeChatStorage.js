cc.Class({
    extends:cc.Component,
    statics:{
        Key_Setting_Music_Volume : 'setting.music.volume',
        Key_Setting_Effect_Volume : 'setting.effect.volume',
        Key_Force_Start_Match_Title : 'force.start.match.title',
        Key_Help_Tip_Show:            'help_tip_show',
        Key_Payment_Notify_Order_List : 'payment.notify.order.list',
        Key_Payment_Notify_Url : 'payment.notify.url',
        Key_AD_Video_Reward_Time : 'ad.video.time',
        Key_Gongzh_RedPoint_Date : 'gzh.redPoint.date',

        setItem : function(key, data) {
            wx.setStorage({
                key : key,
                data: data,
                success : function(params) {
                    cc.wwx.OutPut.info('wechat_storage setItem success:key=' + key +' params=' + JSON.stringify(params));
                },
                fail   : function(params) {
                    cc.wwx.OutPut.err('wechat_storage setItem fail:key='  + key +' params=' + JSON.stringify(params));
                }
            });
        },

        getItem : function(key, onSuccess, defaultValue) {
            wx.getStorage({
                key     : key,
                success : function(params) {
                    if (onSuccess) {
                        cc.wwx.OutPut.info("ball_storage wx getItem success:",key,params.data);
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
    }
})