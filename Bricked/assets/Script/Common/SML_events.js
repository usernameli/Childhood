SML.Event = {
    CMD_ROOM: 'room',
    CMD_LED: 'led',
    CMD_HALL_SHARE2:'hall_share2',
    CMD_HALL_SHARE3: 'hall_share3',
    CMD_MESSAGE: 'message',
    CMD_TODO_TASKS: 'todo_tasks',
    CMD_HEART_BEAT : 'heart_beat',
    CMD_BIND_USER: 'bind_user',
    CMD_USER_INFO: 'user_info',
    CMD_UPDATE_NOTIFY: 'update_notify',
    CMD_BIND_GAME: 'bind_game',
    CMD_GAME_DATA: 'game_data',
    CMD_HALL_INFO: 'hall_info',
    CMD_TABLE_INFO: 'table_info',
    CMD_DIZHU: 'dizhu',
    CMD_GAME: 'game',
    CMD_HALL: 'hall',
    CMD_TABLE_CALL: 'table_call',
    CMD_TABLE: 'table',
    CMD_TABLE_CHAT: 'table_chat',
    CMD_CASH: 'cash',
    CMD_BAG: 'bag',
    CMD_MATCH_DESCRIPRTION: 'm_des',//获取比赛描述信息
    CMD_QUICK_START: 'quick_start',
    CMD_QUICK_START_RES: 'quick_start_res',
    CMD_MATCH_SIGNIN: 'm_signin',   //报名
    CMD_MATCH_SIGNS: 'm_signs',     // 获取是否报名
    CMD_MATCH_SIGNOUT: 'm_signout', //退赛
    CMD_MATCH_ENTER: 'm_enter',
    CMD_MATCH_LEAVE: 'm_leave',
    CMD_MATCH_UPDATE: 'm_update',
    CMD_MATCH_START: 'm_start',
    CMD_MATCH_WAIT: 'm_wait',
    CMD_MATCH_RANK: 'm_rank',//更新排名
    CMD_MATCH_PLAY_ANIMATION : 'm_play_animation',
    CMD_MATCH_OVER: 'm_over',
    CMD_ROOM_LEAVE:'room_leave',  // 离开房间
    CMD_INVITE_INFO: 'invite_info', // 邀请信息
    CMD_PAYMENT_LIST: 'store_config', // 支付 - 商品列表
    CMD_PAYMENT_EXCHANGE: 'store', // 支付 - 金币兑换
    CMD_PRODUCT_DELIVERY: 'prod_delivery', // 支付 - 金币兑换 回调


    ACTION_BALL_START_LINEARVELOCITY:'ball_start_linearvelocity',//球发射
    ACTION_BALL_STOP_LINEARVELOCITY:'ball_stop_linearvelocity',//球停止


    ACTION_PAYMENT_LIST_UPDATE : 'update',
    ACTION_PAYMENT_EXCHANGE_BUY : 'buy',
    ACTION_LOGIN : 'login',             // 地主登陆
    ACTION_WX_SHARE : 'wx_share',       // 微信分享提示：用于提示玩家去分享获得奖励

    // tbbox
    ACTION_TBBOX_GET_REWARD: 'tbox_getReward',
    ACTION_USER_SHARE_BEHAVIOR_INFO: 'user_share_behavior_info',  //    用户分享干预
    ACTION_USER_SHARE_BEHAVIOR_DEAL: 'user_share_behavior_deal',

    // 任务
    ACTION_TASK_CURRENT_TASK : 'get_segment_task', // 任务 - 获取当前任务
    ACTION_TASK_GET_REWARD : 'get_segment_task_award', // 任务 - 获取奖励

    ACTION_SEGMENT_RECOVER : 'segment_recover',

    // 天梯排位赛
    ACTION_MATCH_TITLE_INFO : 'segment_info', // 天梯排位赛 - 段位信息
    ACTION_MATCH_TITLE_RANK_LIST : 'segment_rank_list', // 天梯排位赛 - 排行榜
    ACTION_MATCH_TITLE_RULE : 'segment_rules', // 天梯排位赛 - 奖励信息
    ACTION_ROOM_ONLINE_USERS : 'room_online_users', // 在线人数
    ACTION_AD_INFO : 'ad_info', // 广告信息:视频广告信息
    ACTION_WATCH_AD : 'watch_ad', // 看完视频广告
    ACTION_COUPON_WITHDRAW : 'coupon_withdraw', // 提现额度

    // 夺宝
    ACTION_TREASURE_SHOP_LIST : 'treasure_shop_list', // 商品列表

    // 分享
    ACTION_DAILY_INVITE_INFO : 'query_invite_info', //
    ACTION_DAILY_INVITE_BIND_USER : 'bind_invite_user', //
    ACTION_DAILY_INVITE_REWARD : 'get_invite_reward_all', //
    Event_Daily_Invite_Complete_Status_Changed : 'event.daily.invite.complete.status.changed',

    ACTION_COUPON_DETAILS : 'coupon_details', // 红包券获取途径详情 cmd:dizhu

    ACTION_GET_CASH: 'get_cash',
    ACTION_GET_MATCH_RULES : "get_match_rules", // 获取比赛场规则介绍
    ACTION_DDZ_MSG_ALERT: 'SML:msg:alert',
    ACTION_GET_REWARD : 'get_reward',
    ACTION_GIVEUP: 'giveup',

    ACTION_GET_BURIALS : 'get_burials', //获取埋点数据列表
    ACTION_GET_BURIAL_SHARE : 'get_burial_share',//获取埋点内容
    ACTION_GET_SHARE_REWARD: 'get_share_reward',//获取share3奖励

    // 邀请奖励
    ACTION_BIND_INVITE_CODE : 'bind_invite_code',
    ACTION_QUERY_INVITE_CODE : 'query_invite_info',
    ACTION_GET_INVITE_REWARD : 'get_invite_reward',

    ACTION_GLOBAL_UPDATE: 'global_update',
    ACTION_PRIVATE_UPDATE: 'private_update',
    ACTION_LIST: 'list',

    ACTION_FT_CREATE: 'ft_create',                             // 创建好友桌 cmd : dizhu
    ACTION_FT_ENTER_TABLE : "ft_enter",                        // 进入好友桌 cmd : dizhu
    ACTION_FT_GET_CONF: 'ft_get_conf',                         // 好友桌界面配置 cmd : dizhu
    ACTION_FRIEND_RANK_LIST:'friend_rank_list',                // 好友排行 cmd : dizhu
    ACTION_FT_REQ_DISBAND: 'ft_req_disbind',                    // 请求+回应解散牌桌 cmd : table_call 服务器会广播所有玩家
    ACTION_FT_REQ_DISBAND_ANSWER: 'ft_req_disbind_answer',      // 请求+回应解散牌桌 cmd : table_call  （我请求的）
    ACTION_FT_REQ_DISBAND_RESULT: 'ft_req_disbind_result',      // 回应解散牌桌 cmd : table_call  （后端主动发的解散牌桌结果）
    ACTION_FT_DISBAND: 'ft_disbind',                            // 解散牌桌(最终) cmd : table_call（后端主动发的）
    ACTION_FT_CONTINUE: 'ft_continue',                          // 继续牌桌 cmd : table_call

    ACTION_READY: 'ready',                          // cmd : table_call  好友桌用到
    ACTION_GAME_READY: 'game_ready',                // cmd : table_call
    ACTION_START_HUANPAI: 'startHuanpai',           // cmd : table_call
    ACTION_HUANPAI: 'huanpai',                      // cmd : table_call
    ACTION_END_HUANPAI: 'endHuanpai',               // cmd : table_call
    ACTION_NEXT: 'next',                            // cmd : table_call
    ACTION_CALL: 'call',                            // cmd : table_call
    ACTION_WAIT_NM_JIABEI: 'wait_nm_jiabei',        // cmd : table_call
    ACTION_WAIT_DZ_JIABEI: 'wait_dz_jiabei',        // cmd : table_call
    ACTION_JIABEI: 'jiabei',                        // cmd : table_call
    ACTION_GAME_START: 'game_start',                // cmd : table_call
    ACTION_WILD_CARD: 'wild_card',                  // cmd : table_call
    ACTION_CARD: 'card',                            // cmd : table_call
    ACTION_GAME_WIN: 'game_win',                    // cmd : table_call
    ACTION_NOTE: 'note',                            // cmd : table_call
    ACTION_SMILIES: 'smilies',                      // cmd : table_call
    ACTION_RB: 'rb',                                // 接收 // cmd : table_call
    ACTION_ROBOT: 'robot',                          // 发送 // cmd : table_call
    ACTION_SHOW: 'show',                            // cmd : table_call
    ACTION_CHAT: 'chat',

    MSG_UPDATE_DIAMOND: 'msg_update_diamond',       // 钻石信息更新

    MSG_CONNECTED_SDK: 'msg_connected_sdk',         // 链接咱们的SDK成功

    //触发弹窗
    MSG_WINDOWS_FT_CREATE: 'msg_windows_ft_create',
    MSG_WINDOWS_FT_RESULT: 'msg_windows_ft_result',             // 好友桌对局结算排行弹窗
    MSG_WINDOWS_FT_LIUSHUI: 'msg_windows_ft_liushui',           // 对局流水
    MSG_WINDOWS_FT_DISBAND: 'msg_windows_ft_disband',           // 自己请求解散牌局弹窗
    MSG_WINDOWS_FT_DISBAND_TIP: 'msg_windows_ft_disband_tip',   // 解散牌局弹窗
    MSG_WINDOWS_MATCH_RESULT: 'msg_windows_match_result',
    MSG_WINDOWS_MATCH_SIGNIN: 'msg_windows_match_signin',
    MSG_WINDOWS_CASH_EXCHANGE: 'msg_windows_cash_exchange',
    MSG_WINDOWS_CASH_EXCHANGE_SHARE: 'msg_windows_cash_exchange_share', // 提现分享
    MSG_WINDOWS_TABLE_PLAYER_INFO: 'msg_windows_table_player_info', // 牌桌点击头像的玩家信息面板
    MSG_WINDOWS_TABLE_CHAT: 'msg_windows_table_chat', // 牌桌聊天面板
    MSG_WINDOWS_TABLE_AWARD_RANK: 'msg_windows_table_award_rank', // 牌桌奖励排行面板
    MSG_WINDOWS_MATCH_WIN_TASK: 'msg_windows_match_win_task', // 连胜任务奖励面板
    MSG_WINDOWS_IMG_PREVIEW: 'msg_windows_img_preview', // 高清大图预览

    MSG_WINDOWS_USERINFO: 'msg_windows_userinfo',
    MSG_WINDOWS_USERINFO_VIEW : 'msg_windows_userinfo_view',
    MSG_WINDOWS_GRAB_RED_ENVELOPE : 'msg_windows_grab_red_envelope',
    MSG_WINDOWS_MATCH_WAITING: 'msg_windows_match_waiting',     // 比赛等待【赛前、赛间】 params = {matchBefore:0/1}
    MSG_WINDOWS_FT_REQ_DISBAND_ANSWER: 'msg_ft_req_disband_answer',  //有人回应解散牌局
    MSG_WINDOWS_FT_REQ_DISBAND_RESULT: 'msg_ft_req_disband_result',  //解散牌局的结果
    MSG_WINDOWS_COMMON_TIP: 'msg_windows_common_tip', // 提示框
    MSG_WINDOWS_COMMON_TIP_SHARE: 'msg_windows_common_tip_share',
    MSG_WINDOWS_COMMON_TIP_SURE: 'msg_windows_common_tip_sure',
    MSG_WINDOWS_COMMON_TIP_LOGINERR: 'msg_windows_common_tip_loginerr',
    MSG_WINDOWS_COMMON_TIP_ALERT: 'msg_windows_common_tip_alert',
    MSG_WINDOWS_TREASURE: 'msg_windows_treasure', // 夺宝
    MSG_WINDOWS_MAIN_RANK: 'msg_windows_main_rank', // 天梯排行
    MSG_WINDOWS_MAIN_PAYMENT_PURCHASE: 'msg_windows_main_payment_purchase', // 购买钻石
    MSG_WINDOWS_MAIN_PAYMENT_EXCHANGE: 'msg_windows_main_payment_exchange', // 兑换金币
    MSG_WINDOWS_MAIN_HELP_COIN: 'msg_windows_main_help_coin', // 帮助 - 获取金币
    MSG_WINDOWS_MAIN_SETTING: 'msg_windows_main_setting', // 设置
    MSG_WINDOWS_MAIN_TASK_GET_REWARD: 'msg_windows_main_task_get_reward', // 任务 - 领取奖励
    MSG_WINDOWS_MAIN_INFORMATION: 'msg_windows_main_information',
    MSG_WINDOWS_MAIN_INVITE : 'msg_windows_main_invite',
    MSG_WINDOWS_MAIN_INVITE_TIPS : 'msg_windows_main_invite_tips',
    MSG_WINDOWS_MAIN_CONGRATULATION : 'msg_windows_main_congratulation',
    MSG_WINDOWS_MATCH_TITLE_WAIT: 'msg_windows_match_title_wait', // 天梯 - 等待中
    MSG_WINDOWS_MATCH_TITLE_HELP_RULE: 'msg_windows_match_title_help_rule', // 天梯 - 帮助
    MSG_WINDOWS_MATCH_TITLE_ACTIVITY: 'msg_windows_match_title_activity', // 天梯 - 活动 & 赛季说明
    MSG_WINDOWS_MATCH_TITLE_NEWER_HONGBAO: 'msg_windows_title_newer_hongbao', // 天梯 结算红包
    MSG_WINDOWS_MATCH_TITLE_RECOVER: 'msg_windows_match_title_recover', // 天梯 - 保段
    MSG_WINDOWS_MATCH_TITLE_RECOVER_BANNER: 'msg_windows_match_title_recover_banner', // 天梯 - 保段banner
    MSG_WINDOWS_MATCH_TITLE_SEGMENT_CHANGE_UP: 'msg_windows_match_title_segment_change_up', // 天梯结算变动动画
    MSG_WINDOWS_MATCH_TITLE_SEGMENT_CHANGE_DOWN: 'msg_windows_match_title_segment_change_down', // 天梯结算变动动画
    MSG_WINDOWS_MATCH_TITLE_GAMEOVER_WIN: 'msg_windows_match_title_gameover_win', // 天梯结算win
    MSG_WINDOWS_MATCH_TITLE_GAMEOVER_LOSE: 'msg_windows_match_title_gameover_lose', // 天梯结算lose
    MSG_WINDOWS_GAME_RESULT_SUPER_TIME: 'msg_windows_game_result_super_time', // 超级加倍
    MSG_WINDOWS_GAME_RESULT_WIN_STREAK: 'msg_windows_game_result_win_streak', // 连胜

    MSG_WINDOWS_MATCH_CASH_GAMEOVER_WIN: 'msg_windows_match_cash_gameover_win', // 金币桌结算win
    MSG_WINDOWS_MATCH_CASH_GAMEOVER_LOSE: 'msg_windows_match_cash_gameover_lose', // 金币桌结算lose
    MSG_WINDOWS_MATCH_CASH_GAMEOVER_ABORT: 'msg_windows_match_cash_gameover_abort', // 金币桌结算流局
    MSG_WINDOWS_MATCH_CASH_BANKRUPTCY: 'msg_windows_match_cash_bankruptcy',
    MSG_WINDOWS_MATCH_CASH_JIUJI: 'msg_windows_match_cash_jiuji',

    MSG_WINDOWS_LOGIN_AUTHORITY_TIP: 'msg_windows_login_authority_tip',
    MSG_WINDOWS_DIAMOND_AWARD: 'msg_windows_diamond_award', // 分享&邀请好友-领钻石
    MSG_WINDOWS_MAIN_INFORMATION_DETAIL :'msg_windows_main_information_detail',
    MSG_WINDOWS_MATCH_COIN_VIEW : 'msg_windows_match_coin_view', // 金币房间
    MSG_WINDOWS_MATCH_COIN_HALL_VIEW : 'msg_windows_match_coin_hall_view', // 金币大厅房间
    MSG_WINDOWS_AD_REWARD : 'msg_windows_ad_reward', // 广告奖励
    MSG_WINDOWS_LIBAO_ZY : 'msg_windows_libao_zhuanyun',  // 礼包 转运

    Event_Window_Or_View_Showed : 'windows_manager_window_or_view_showed', //
    Event_Editor_Match_Title_Start : 'editor_match_title_start', // 动画回调参数事件

    MSG_TCP_OPEN: 'tcp_open',
    MSG_TCP_CLOSE: 'tcp_close',
    MSG_TCP_ERROR: 'tcp_error',             // tcp 失败
    MSG_TCP_SEND_ERROR: 'tcp_send_error',   // tcp发消息，微信接口调用失败
    MSG_TCP_ERROR_COUNT_MAX: 'tcp_error_count_max', //  tcp心跳失败次数达到上限
    MSG_RECONNECT: 'reconnect',
    MSG_SERVER_MESSAGE: 'server_message',
    MSG_LOGIN_SUCCESS: 'login_success',
    MSG_LOGIN_AUTHORITY_TIP: 'login_authority_tip',     // 用户信息授权提示 params true:提示去授权/false：取消提示提示
    MSG_TOUCH_EVENT: 'touch_event',
    MSG_CALL_PLAYNO: 'call_playno',                     // 要不起事件

    MSG_LOADED_SCENE: 'msg_loaded_scene',               // 预加载场景回调事件
    MSG_TABLE_PLAYER_FULL: 'msg_table_player_full',     //

    MSG_WX_SHARE_SUCCESS:'msg_wx_share_success',        //分享成功
    MSG_CHANGE_UNREAD_MESSAGE_NUMBER: 'msg_change_unread_message_number',  // 未读消息个数改变
    MSG_UPDATE_TBBOX: 'msg_update_tbbox',               // tbbox刷新

    MSG_GOTO_STORE : 'dizhu_goto_store',      // 购买金币

    MSG_SDK_WX_CHECK_SESSION: 'msg_sdk_wx_check_session',
    MSG_SDK_WX_GET_SETTING: 'msg_sdk_wx_get_setting',
    MSG_SDK_WX_GET_USERINFO: 'msg_sdk_wx_get_userinfo',

    MSG_TO_SHOW: 'msg_to_show',
    MSG_TO_HIDE: 'msg_to_hide',
};