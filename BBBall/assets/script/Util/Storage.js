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
            cc.sys.localStorage.setItem(key, data);
        },

        getItem : function(key, onSuccess, defaultValue) {
            if (onSuccess) {
                var result = cc.sys.localStorage.getItem(key);
                result = result == null? defaultValue : result;
                cc.wwx.OutPut.log("ball_storage jsb getItem success",key,result);
                onSuccess(result);
            }
            else
            {
                var result = cc.sys.localStorage.getItem(key);
                cc.wwx.OutPut.log("ball_storage jsb getItem success",key,result);

                return result;
            }
        },
    }
})