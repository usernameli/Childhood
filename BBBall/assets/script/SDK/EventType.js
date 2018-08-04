cc.Class({
    extends:cc.Component,
    statics:{
        CMD_GAME: 'game',
        CMD_BIND_USER: 'bind_user',
        CMD_BIND_GAME: 'bind_game',
        CMD_USER_INFO: 'user_info',
        CMD_BAG: 'bag',
        CMD_GAME_DATA: 'game_data',
        CMD_UPDATE_NOTIFY: 'update_notify',

        MSG_TCP_OPEN: 'tcp_open',
        MSG_TCP_CLOSE: 'tcp_close',
        MSG_TCP_ERROR: 'tcp_error',             // tcp 失败
        MSG_TCP_SEND_ERROR: 'tcp_send_error',   // tcp发消息，微信接口调用失败
        MSG_TCP_ERROR_COUNT_MAX: 'tcp_error_count_max', //  tcp心跳失败次数达到上限
        MSG_RECONNECT: 'reconnect',
        MSG_SERVER_MESSAGE: 'server_message',

        CMD_INVITE_INFO: 'invite_info', // 邀请信息
        CMD_UPDATE_SCORE: 'update_score', //更新分数
        CMD_PAYMENT_LIST: 'store_config', // 支付 - 商品列表
        CMD_PAYMENT_EXCHANGE: 'store', // 支付 - 金币兑换
        CMD_PRODUCT_DELIVERY: 'prod_delivery', // 支付 - 金币兑换 回调
        ACTION_PAYMENT_LIST_UPDATE : 'update',

        ACTION_PAYMENT_EXCHANGE_BUY : 'buy',

        SDK_LOGIN_SUCCESS: 'sdk_login_success',
        SDK_LOGIN_FAIL: 'sdk_login_fail',
        WEIXIN_LOGIN_SUCCESS: 'weixin_login_success',
        WEIXIN_LOGIN_FAIL: 'weixin_login_fail',

        MSG_UPDATE_DIAMOND: 'msg_update_diamond',       // 钻石信息更新

        GET_USER_FEATURE_SUCCESS: 'GET_USER_FEATURE_SUCCESS',
        GET_USER_FEATURE_FAIL: 'GET_USER_FEATURE_FAIL',
        GET_SHARE_CONFIG_SUCCESS: 'GET_SHARE_CONFIG_SUCCESS',
        GET_SHARE_CONFIG_FAIL: 'GET_SHARE_CONFIG_FAIL',

        GET_OPEN_DATA_RESULT_SUCCESS: "GET_OPEN_DATA_RESULT_SUCCESS",
        GET_OPEN_DATA_RESULT_FAIL: "GET_OPEN_DATA_RESULT_FAIL",
        GET_OPEN_DATA_RESULT_TIMEOUT: "GET_OPEN_DATA_RESULT_TIMEOUT",

        SEND_HEART_BEAT: 'SEND_HEART_BEAT',
        GAME_SHOW: 'GAME_SHOW',
        GAME_HIDE: 'GAME_HIDE',

        START_AUTHORIZATION_SUCCESS : 'START_AUTHORIZATION_SUCCESS', //授权成功
        START_AUTHORIZATION_FAILED : 'START_AUTHORIZATION_FAILED', //授权失败

        SHARE_RESULT : 'SHARE_RESULT_RET', 				//分享返回
        FORCESHARE_SUCCESS : 'FORCE_SHARE_SUCESS', 			//暴力分享成功,
        GROUP_SHARE_SUCCESS : 'GROUP_SHARE_SUCCESS', 	//群分享成功,
        GETRFRIENDRANK_SUSSESS:"GETRFRIENDRANK_SUSSESS" ,    //获取好友排行成功

        MSG_LOGIN_SUCCESS : "MSG_LOGIN_SUCCESS",

        PROPAGATE_SHARE_SUCESS : "propagate_share_sucess",  //智能分享成功
        PROPAGATE_SHARE_FAIL : "propagate_share_fail",  //智能分享失败

        GETRFRIENDRANK_SUCCESS: "GETRFRIENDRANK_SUCCESS", //获取好友排行成功
        GETUSERINFO_SUCCESS: "GETUSERINFO_SUCCESS", //获取个人数据成功
        GETGROUPRANK_SUCCESS: "GETGROUPRANK_SUCCESS", //获取群排行数据



        ACTION_BALL_START_LINEARVELOCITY:'ball_start_linearvelocity', //球球线性运动
        ACTION_BALL_STOP_LINEARVELOCITY:'action_ball_stop_linearvelocity',//球球线性运动停止
        ACTION_BALL_MOVE_DROP:'action_ball_move_drop',
        ACTION_BALL_ADD_BALLS:'action_ball_add_balls',
        ACTION_BALL_DEMOLITION_BOMB:'action_ball_demolition_bomb', //道具爆炸效果
        ACTION_BALL_ITEM_ADD_BALL:'action_ball_item_add_ball', //道具添加球球效果
        ACTION_BALL_OBJ_BOMB:'action_ball_obj_bomb', //方块爆炸效果
        ACTION_BALL_ELIMINATE:'action_ball_eliminate', //消除行或者列
        ACTION_BALL_OBJ_BOMB_END:'action_ball_obj_bomb_end', //方块爆炸效果
        ACTION_BALL_DEMOLITION_BOMB_END:'action_ball_demolition_bomb_end', //道具爆炸效果
        ACTION_OBJ_BREAK:'action_obj_break', //方块碰碎了
        ACTION_BALL_SPORTS:'action_ball_sports', //球球开始运动了
        ACTION_BALL_TOUCHBOTTOM:'action_ball_touchbottom', //球球到了最底层
        ACTION_BALL_DROP_WARNING:'action_ball_drop_warning', //球球马上到了最底层
        ACTION_A_LINE_OF_EXPLOSIONS:'action_a_line_of_explosions', //消除最后一行
        RANDOM_PLACEMENT_4_ELIMINATE:'random_placement_4_eliminate', //随机放置4个射线
        ACTION_RECOVERY_BALL:'action_recovery_ball', //收回球球
        ACTION_BALL_GAME_RESTART:'action_ball_game_restart',//游戏重新开始
        GETSWITCH_RESULT: "GETSWITCH_RESULT", //获取分享开关
    }
})