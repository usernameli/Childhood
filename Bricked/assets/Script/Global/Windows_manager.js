
var metaclass = cc._Class.extend({
    _windowsMap:{},   // 弹窗资源路径
    _viewMap:{},      // 全屏资源路径
    _handleMap:{}, // 纪录事件句柄 (句柄用1代替)
    _preloadList:[],  // 预加载列表
    /**
     * 初始化
     */
     init:function() {
        this.registerWindows(SML.Event.MSG_WINDOWS_COMMON_TIP, 'prefabs/windows/windows_common_tip', 'windows_common_tip');
        this.registerWindows(SML.Event.MSG_WINDOWS_COMMON_TIP_SHARE, 'prefabs/windows/windows_common_tip_share', 'windows_common_tip_share');
        this.registerWindows(SML.Event.MSG_WINDOWS_COMMON_TIP_SURE, 'prefabs/windows/windows_common_tip_sure', 'windows_common_tip_sure');
        this.registerWindows(SML.Event.MSG_WINDOWS_COMMON_TIP_LOGINERR, 'prefabs/windows/windows_common_tip_loginerr', 'windows_common_tip_loginerr');
        this.registerWindows(SML.Event.MSG_WINDOWS_COMMON_TIP_ALERT, 'prefabs/windows/windows_common_tip_alert', 'windows_common_tip_alert');

        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_HELP_COIN, 'prefabs/windows/windows_main_help_coin', 'windows_main_help_coin');
        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_SETTING, 'prefabs/windows/windows_main_setting', 'windows_main_setting');
        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_TASK_GET_REWARD, 'prefabs/windows/windows_main_task_get_reward', 'windows_main_task_get_reward');
        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_INVITE, 'prefabs/windows/windows_main_invite', 'windows_main_invite');
        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_INVITE_TIPS, 'prefabs/windows/windows_main_invite_tips', 'windows_main_invite_tips');
        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_CONGRATULATION, 'prefabs/windows/windows_main_congratulation', 'windows_main_congratulation');
        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_INFORMATION, 'prefabs/windows/windows_main_information', 'windows_main_information');
        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_INFORMATION_DETAIL, 'prefabs/windows/windows_main_information_detail', 'windows_main_information_detail');
        this.registerWindows(SML.Event.MSG_WINDOWS_LOGIN_AUTHORITY_TIP, 'prefabs/windows/windows_login_authority_tip', 'windows_login_authority_tip');
        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_PAYMENT_PURCHASE, 'prefabs/windows/windows_main_payment_purchase', 'windows_main_payment_purchase');
        this.registerWindows(SML.Event.MSG_WINDOWS_MAIN_PAYMENT_EXCHANGE, 'prefabs/windows/windows_main_payment_exchange', 'windows_main_payment_exchange');

        this.registerWindows(SML.Event.MSG_WINDOWS_FT_RESULT, 'prefabs/windows/windows_ft_result', 'windows_ft_result');        // 好友桌总结算
        this.registerWindows(SML.Event.MSG_WINDOWS_FT_LIUSHUI, 'prefabs/windows/windows_ft_liushui', 'windows_ft_liushui');       // 弹出对局流水
        this.registerWindows(SML.Event.MSG_WINDOWS_FT_DISBAND, 'prefabs/windows/windows_ft_disband', 'windows_ft_disband');       //弹出解散好友桌
        this.registerWindows(SML.Event.MSG_WINDOWS_FT_DISBAND_TIP, 'prefabs/windows/windows_ft_disband_tip', 'windows_ft_disband_tip');       //弹出解散好友桌
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_RESULT, 'prefabs/windows/windows_match_result', 'windows_match_result');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_SIGNIN, 'prefabs/windows/windows_match_signin', 'windows_match_signin');
        this.registerWindows(SML.Event.MSG_WINDOWS_CASH_EXCHANGE, 'prefabs/windows/windows_cash_exchange', 'windows_cash_exchange');
        this.registerWindows(SML.Event.MSG_WINDOWS_CASH_EXCHANGE_SHARE, 'prefabs/windows/windows_cash_exchange_share', 'windows_cash_exchange_share');
        this.registerWindows(SML.Event.MSG_WINDOWS_DIAMOND_AWARD, 'prefabs/windows/windows_diamond_award', 'windows_diamond_award');
        this.registerWindows(SML.Event.MSG_WINDOWS_TABLE_PLAYER_INFO, 'prefabs/table/table_player_info', 'player_info_panel');  // 牌桌点击玩家头像的信息面板
        this.registerWindows(SML.Event.MSG_WINDOWS_FT_CREATE, 'prefabs/windows/windows_ft_create', 'windows_ft_create');
        this.registerWindows(SML.Event.MSG_WINDOWS_TABLE_CHAT, 'prefabs/table/table_chat_window', 'table_chat_panel');  // 牌桌聊天面板
        this.registerWindows(SML.Event.MSG_WINDOWS_TABLE_AWARD_RANK, 'prefabs/table/table_rank_window', 'window_red_rank');  // 牌桌奖励排名面板

        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_TITLE_NEWER_HONGBAO, 'prefabs/windows/windows_newer_hongbao', 'windows_newer_hongbao');  // 天梯结算
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_TITLE_ACTIVITY, 'prefabs/windows/windows_match_title_activity', 'windows_match_title_activity');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_TITLE_RECOVER, 'prefabs/windows/windows_match_title_recover', 'windows_match_title_recover');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_TITLE_RECOVER_BANNER, 'prefabs/windows/windows_match_title_recover_banner', 'windows_match_title_recover_banner');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_TITLE_SEGMENT_CHANGE_UP, 'prefabs/windows/windows_match_title_segment_change_up', 'windows_match_title_segment_change_up');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_TITLE_SEGMENT_CHANGE_DOWN, 'prefabs/windows/windows_match_title_segment_change_down', 'windows_match_title_segment_change_down');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_TITLE_GAMEOVER_WIN, 'prefabs/windows/windows_match_title_gameover_win', 'windows_match_title_gameover_win');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_TITLE_GAMEOVER_LOSE, 'prefabs/windows/windows_match_title_gameover_lose', 'windows_match_title_gameover_lose');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_WIN_TASK, 'prefabs/match_coin/win_task_window', 'win_task_window');

        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_CASH_GAMEOVER_WIN, 'prefabs/windows/windows_match_cash_gameover_win', 'windows_match_cash_gameover_win');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_CASH_GAMEOVER_LOSE, 'prefabs/windows/windows_match_cash_gameover_lose', 'windows_match_cash_gameover_lose');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_CASH_GAMEOVER_ABORT, 'prefabs/windows/windows_match_cash_gameover_abort', 'windows_match_cash_gameover_abort');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_CASH_BANKRUPTCY, 'prefabs/windows/windows_match_cash_bankruptcy', 'windows_match_cash_bankruptcy');
        this.registerWindows(SML.Event.MSG_WINDOWS_MATCH_CASH_JIUJI, 'prefabs/windows/windows_match_cash_jiuji', 'windows_match_cash_jiuji');
        this.registerWindows(SML.Event.MSG_WINDOWS_GAME_RESULT_SUPER_TIME, 'prefabs/windows/windows_game_result_super_time', 'windows_game_result_super_time');
        this.registerWindows(SML.Event.MSG_WINDOWS_GAME_RESULT_WIN_STREAK, 'prefabs/windows/windows_game_result_win_streak', 'windows_game_result_win_streak');
        this.registerWindows(SML.Event.MSG_WINDOWS_AD_REWARD, 'prefabs/windows/windows_ad_reward', 'windows_ad_reward');
        this.registerWindows(SML.Event.MSG_WINDOWS_LIBAO_ZY, 'prefabs/windows/windows_libao_zy', 'windows_libao_zy');

        this.registerView(SML.Event.MSG_WINDOWS_MATCH_TITLE_HELP_RULE, 'prefabs/windows/windows_match_title_help_rule', 'windows_match_title_help_rule');
        this.registerView(SML.Event.MSG_WINDOWS_MAIN_RANK, 'prefabs/windows/windows_main_rank', 'windows_main_rank');
        this.registerView(SML.Event.MSG_WINDOWS_TREASURE, 'prefabs/windows/windows_treasure_main', 'windows_treasure_main');
        this.registerView(SML.Event.MSG_WINDOWS_MATCH_TITLE_WAIT, 'prefabs/windows/windows_match_title_wait', 'windows_match_title_wait');
        this.registerView(SML.Event.MSG_WINDOWS_MATCH_WAITING, 'prefabs/windows/windows_match_waiting', 'windows_match_waiting');
        this.registerView(SML.Event.MSG_WINDOWS_USERINFO, 'prefabs/windows/windows_userinfo_debug', 'windows_userinfo_debug');
        this.registerView(SML.Event.MSG_WINDOWS_USERINFO_VIEW, 'prefabs/windows/windows_userinfo', 'windows_user_info');
        this.registerView(SML.Event.MSG_WINDOWS_GRAB_RED_ENVELOPE, 'prefabs/windows/windows_grab_red_envelope', 'windows_grab_red_envelope');
        this.registerView(SML.Event.MSG_WINDOWS_MATCH_COIN_VIEW, 'prefabs/match_coin/match_coin_view', 'match_coin_view');
        this.registerView(SML.Event.MSG_WINDOWS_MATCH_COIN_HALL_VIEW, 'prefabs/match_coin/match_coin_hall_view', 'match_coin_hall_view');


        this.registerWindows(SML.Event.MSG_WINDOWS_IMG_PREVIEW, 'prefabs/table/img_preview', 'img_preview');

        this.mWindowLoaded = this.mWindowLoaded || {};
    },

    /**
     * 开始预加载
     */
    preload () {
        if (this._preloadList.length == 0) return;
        var prefabPath = this._preloadList.shift();
        // SML.Output.log('preload windows :' + prefabPath);

        // 静默加载，每隔5秒下一个。
        setTimeout(function(){
            cc.loader.loadRes(prefabPath, cc.Prefab, function(completedCount, totalCount, item) {
                // SML.Output.log('preload progress[' + prefabPath  + ']:' + completedCount + '/' + totalCount);
            }, function(error, prefab) {
                if (error) {
                    SML.Output.warn('preload 加载失败：' + prefabPath);
                }
                this.preload(); // 加载下一个
            }.bind(this));
        }.bind(this), 500);
    },

    /**
     * 注册windows
     * @param eventName
     * @param prefabPath
     * @param scriptName
     */
    registerWindows:function(eventName, prefabPath, scriptName) {
        this._windowsMap[eventName] = {
            prefabPath : prefabPath,
            scriptName : scriptName
        };

        if (!this._preloadList.contains(prefabPath)) {
            this._preloadList.push(prefabPath);
        }
    },
    /**
     * 注册全屏弹窗
     * @param eventName
     * @param prefabPath
     * @param scriptName
     */
    registerView:function(eventName, prefabPath, scriptName) {
        this._viewMap[eventName] = {
            prefabPath : prefabPath,
            scriptName : scriptName
        };

        if (!this._preloadList.contains(prefabPath)) {
            this._preloadList.push(prefabPath);
        }
    },

    /**
     * 注册弹窗句柄标记，用于关闭弹窗时，弹窗并未加载完成，需要阻止继续弹窗。
     * @param eventName
     */
    registerHandle:function(eventName) {
        var cur = this._handleMap[eventName];
        this._handleMap[eventName] = cur ? cur + 1 : 1;
    },

    unregisterHandle:function(eventName) {
        var cur = this._handleMap[eventName];
        this._handleMap[eventName] = cur ? cur - 1 : 0;
    },

    unregisterHandle0:function(eventName) {
        this._handleMap[eventName] = 0;
    },

    unregisterAllHandle:function() {
        this._handleMap = {};
    },

    hasHandle:function(eventName) {
        var count = this._handleMap[eventName] || 0;
        return count > 0;
    },

    /**
     * 同时只展示一次同类窗口，
     * @param eventName
     * @param params
     */
    showWindowsOnce:function(eventName, params, cb) {
        if (!this.popToWindows(eventName, params)) {
            this.showWindows(eventName, params, cb);
        }
    },

    /**
     * 从上至下查找弹窗，找到了则pop到最上层
     * @param eventName
     * @param params
     * @returns {boolean}
     */
    popToWindows:function(eventName, params) {
        var data = this._windowsMap[eventName];
        if (!data) {
            SML.Output.err('popToWindows : no register view :' + eventName);
            return false;
        }
        var windows = SML.Core.Scene.popToWindows(eventName);
        if (windows) {
            var uiScript = windows.getComponent(data['scriptName']);
            if (uiScript) {
                uiScript.init && uiScript.init(params);
            }
            return true;
        }
        return false;
    },

    /**
     * 展示windows
     * @param eventName
     * @param params
     */
    showWindows:function(eventName, params, cb) {
        SML.Output.log('showWindows eventName:' + eventName);
        var data = this._windowsMap[eventName];
        if (!data) {
            SML.Output.err('showWindows : no register windows :' + eventName);
            return;
        }

        this._showPopup(eventName, data, params, SML.Core.BaseWindows, cb);
    },

    /**
     * 只展示一次同类窗口
     * @param eventName
     * @param params
     */
    showViewOnce:function(eventName, params) {
        if (!this.popToView(eventName, params)) {
            this.showView(eventName, params);
        }
    },

    popToView:function(eventName, params) {
        var data = this._viewMap[eventName];
        if (!data) {
            SML.Output.err('popToView : no register view :' + eventName);
            return;
        }
        var view = SML.Core.Scene.popToView(eventName);
        if (view) {
            SML.Output.log('windows mananger popToView:' + view.name);
            var uiScript = view.getComponent(data['scriptName']);
            if (uiScript) {
                uiScript.init && uiScript.init(params);
            }
            return true;
        }
        return false;
    },

    /**
     * 展示全屏弹窗
     * @param eventName
     * @param params
     */
    showView:function(eventName, params, cb) {
        var data = this._viewMap[eventName];
        if (!data) {
            SML.Output.err('showView : no register view :' + eventName);
            return;
        }

        var view = SML.Core.Scene.popToView(eventName);
        if (view) {
            var uiScript = view.getComponent(data['scriptName']);
            if (uiScript) {
                uiScript.init && uiScript.init(params);
            }
            return;
        }

        this._showPopup(eventName, data, params, SML.Core.BaseView, cb);
    },


    _showPopup:function(eventName, eventData, params, BaseUIClass, cb) {
        SML.Output.log('_showPopup [' + eventName + ']');
        var prefabPath = eventData['prefabPath'];
        var scriptName = eventData['scriptName'];

        SML.Notify.trigger(SML.Event.Event_Window_Or_View_Showed);

        let callback = function(prefab) {
            var ui = cc.instantiate(prefab);
            var baseUIScript = ui.getComponent(BaseUIClass);
            if (!baseUIScript) {
                baseUIScript = ui.addComponent(BaseUIClass);
            }
            baseUIScript.push();
            baseUIScript.setDestroyCallback(cb);
            ui.name = eventName;
            ui.position = cc.p(0, 0);

            var uiScript = ui.getComponent(scriptName);
            if (uiScript) {
                uiScript.init && uiScript.init(params);
            } else {
                SML.Output.warn('showView : ' + 'script is null with name:' + scriptName);
            }
        };

        this.registerHandle(eventName);
        var baseScene = SML.Core.Scene.getScene();

        var self = this;
        self.mTempScheduleCount = 0;
        cc.director.getScheduler().schedule(function() {
            self.mTempScheduleCount = self.mTempScheduleCount || 0;
            self.mTempScheduleCount++;

            if (self.mTempScheduleCount == 2) {
                if (!self.mWindowLoaded[prefabPath]) {
                    SML.LoadingManager.showLoading();
                }
            }
        }, self, 0, 1, 0, false);

        // SML.Output.log('show view ...... start [' + prefabPath + ']');
        cc.loader.loadRes(prefabPath, cc.Prefab, function(completedCount, totalCount, item) {
            // SML.Output.log('showUI progress[' + eventName  + ']:' + completedCount + '/' + totalCount);
        }, function(error, prefab) {
            // SML.Output.log('show view ...... end [' + prefabPath + ']');
            self.mWindowLoaded[prefabPath] = true;

            SML.LoadingManager.hideLoading();

            // 场景已经切换，就不要再弹窗了
            if (baseScene != SML.Core.Scene.getScene()) {
                return;
            }
            if (!self.hasHandle(eventName)) {
                return;
            }
            self.unregisterHandle(eventName);
            if (!error) {
                callback(prefab);
            } else {
                SML.Output.err('showView 加载失败：' + prefabPath);
            }
        });
    },
})

SML.WindowsManager = new metaclass();