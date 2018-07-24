cc.Class({
    extends: cc.Component,
    properties: {
        soundOpen : 0,
    },
    init : function () {
        this.getMusicPlayManager();
        this.getMusicState();
    },
    getMusicPlayManager:function () {

        this.stopMusic();

        this.musicPlayManager = wx.createInnerAudioContext();
        return this.musicPlayManager;
    },

    /**
     * 播放音乐 (音效只可以播放一个,如果再调用此方法,之前的音乐会被停止)
     * @param file 文件名,例如: '/resources/sound/table_sound_After_the_bomb.mp3'
     * @param isloop 是否循环
     * @param volume 可选参数,音量
     */
    playMusic : function (file, isloop, volume) {

        if(this.soundOpen == -1)
            return;

        if (this._curMusicFile && this._curMusicFile == file){
            return;
        }
        this._curMusicFile = file;
        var playManager = this.getMusicPlayManager();

        if(playManager) {
            if (arguments.length == 3) {
                playManager.volume = volume;
            }

            playManager.autoplay = true;
            playManager.loop = isloop;
            playManager.src = cc.wwx.SystemInfo.cdnPath + file;
        }
    },

    rePlayMusic:function () {
        if (this.musicPlayManager && this.musicPlayManager.loop){
            this.musicPlayManager.play();
        }
    },

    stopMusic:function () {
        if (this.musicPlayManager){
            this.musicPlayManager.stop();
            this.musicPlayManager.destroy();
            this.musicPlayManager = null;
            this._curMusicFile = undefined;
        }
    },


    /**
     * 播放音效 (音效可以同时播放多个)
     * @param file 文件名,例如: '/resources/sound/table_sound_After_the_bomb.mp3'
     * @param isloop 是否循环
     * @param volume 可选参数,音量
     */
    playEffect : function (file, isloop, volume) {

        if(this.soundOpen == -1)
            return;

        if (arguments.length == 3){
            this.setEffectsVolume(volume);
        }
        cc.wwx.OutPut.log("AudioHelper", "  play effect *-*-*-   :  "+(cc.wwx.SystemInfo.cdnPath + file));
        cc.audioEngine.playEffect(cc.wwx.SystemInfo.cdnPath + file, isloop);
    },
    /**
     * 播放本地音效
     * @param file
     * @param isloop
     * @param volume
     */
    playLocalEffect : function (file, isloop, volume) {

        if(this.soundOpen == -1)
            return;

        if (arguments.length == 3){
            this.setEffectsVolume(volume);
        }
        // cc.wwx.OutPut.log("AudioHelper", "  play local effect *-*-*-   :  "+file);
        cc.audioEngine.playEffect(cc.url.raw(file), isloop);
    },

    /**
     * 停止音效
     * @param effectId
     */
    stopEffect: function(effectId) {
        if(effectId < 0) {
            return;
        }
        cc.audioEngine.stopEffect(effectId);
    },

    /**
     * 停止所有音效
     */
    stopAllEffects: function() {
        cc.wwx.OutPut.log("AudioHelper", "-========== stop effect =======");
        cc.audioEngine.stopAllEffects();
    },

    /**
     * 卸载所有文件
     */
    unloadAll: function() {
        cc.audioEngine.uncacheAll();
    },

    /**
     * 更改音效音量
     * @param val 音量
     */
    setEffectsVolume : function (val) {
        cc.sys.localStorage.setItem("effect_sound_volume_", val)
        cc.audioEngine.setEffectsVolume(val);
        cc.wwx.OutPut.log("AudioHelper", "-========== setEffectsVolume ======="+val);
        if(val==0)
            this.stopAllEffects();
    },

    /**
     * 更改音乐音量
     * @param val 音量
     */
    setMusicVolume : function (val) {
        cc.sys.localStorage.setItem("music_sound_volume_", val)
        if(this.musicPlayManager) {
            this.musicPlayManager.volume = val;
            cc.wwx.OutPut.log("AudioHelper", "-========== setMusicVolume ======="+val);
        }
        if(val==0)
            this.stopMusic();
    },

    /**
     * 获取音乐音量
     */
    getMusicVolume: function() {
        var _temp = cc.sys.localStorage.getItem("music_sound_volume_");
        return _temp? 1 : _temp;
    },

    /**
     * 获取音效音量
     */
    getEffectsVolume: function() {
        var _temp = cc.sys.localStorage.getItem("effect_sound_volume_");
        return _temp? 0 : _temp;
    },

    closeMusic : function () {
        this.soundOpen = -1;
        cc.sys.localStorage.setItem("_sound_state_", -1);
    },

    openMusic : function () {
        this.soundOpen = 1;
        cc.sys.localStorage.setItem("_sound_state_", 1);
    },

    getMusicState : function () {
        var _temp = cc.sys.localStorage.getItem("_sound_state_");
        cc.wwx.OutPut.log("AudioHelper",  "  music state:   "+_temp);
        this.soundOpen = _temp==1? 1 : -1;
        return this.soundOpen;
    }

});