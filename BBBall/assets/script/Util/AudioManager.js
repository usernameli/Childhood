cc.Class({
    extends: cc.Component,
    properties:{
        //背景音乐
        audioGameBgm0:{
            default:null,
            type:cc.AudioClip
        },
        // 按钮点击
        audioButtonClick:{
            default:null,
            type:cc.AudioClip
        },
        // 报警音效
        audioWarning:{
            default:null,
            type:cc.AudioClip
        },
        //爆炸音效
        audioBomb:{
            default:null,
            type:cc.AudioClip
        },

        //游戏开始音效
        audioGameStart:{
            default:null,
            type:cc.AudioClip
        },
        //碰撞方块的声音
        audioObj:{
            default:null,
            type:cc.AudioClip
        },
        //关卡结束的声音
        audioGameOver:{
            default:null,
            type:cc.AudioClip
        },
        //游戏失败的声音
        audioGameResultFail:{
            default:null,
            type:cc.AudioClip
        },
        //游戏成功的声音
        audioGameResultSuccess:{
            default:null,
            type:cc.AudioClip
        },
        //游戏激光的声音
        audioJiGuang:{
            default:null,
            type:cc.AudioClip
        },
        //技能爆炸的声音
        audioItem1:{
            default:null,
            type:cc.AudioClip
        }

    },
    ctor: function () {
        this.mAudioMap = {};

        /**
         * 默认音量大小
         * @type {number}
         */
        this.bgMusicVolume = 0.5;
        this.effectMusicVolume = 1;

        this.mMusicSwitch = 1;
        this.mEffectSwitch = 1;
    },
    play : function(audioSource, loop, callback, isBgMusic) {
        if (isBgMusic && !this.mMusicSwitch) return;
        if (!isBgMusic && !this.mEffectSwitch) return;

        var volume = isBgMusic ? this.bgMusicVolume : this.effectMusicVolume;

        // if (CC_JSB) {
        var context = cc.audioEngine.play(audioSource, loop, volume);
        if (callback){
            cc.audioEngine.setFinishCallback(context, function(){
                callback.call(this);
            }.bind(this));
        }
        this.mAudioMap[audioSource] = context;
        cc.wwx.OutPut.log('play audio effect : ' + audioSource);

        return audioSource;
        // } else {
        //     var context = wx.createInnerAudioContext();
        //     context.autoplay = true;
        //     context.loop = loop;
        //     context.obeyMuteSwitch = true;
        //     context.volume = volume;
        //     if (callback) {
        //         context.onEnded(function() {
        //             callback.call(this);
        //         }.bind(this));
        //     } else {
        //         context.offEnded();
        //     }
        //
        //     var audioPath = wxDownloader.REMOTE_SERVER_ROOT + audioSource;
        //     if (audioSource && audioPath != wxDownloader.REMOTE_SERVER_ROOT && audioPath.endsWith('.mp3')) {
        //         context.src = audioPath;
        //         context.play();
        //
        //         this.mAudioMap[audioSource] = context;
        //     }
        //
        //     cc.wwx.OutPut.log('play audio effect : ' + context.src);
        //
        //     return audioSource;
        // }
    },

    save: function () {
        cc.wwx.Storage.setItem(cc.wwx.Storage.Key_Setting_Music_Volume, this.mMusicSwitch);
        cc.wwx.Storage.setItem(cc.wwx.Storage.Key_Setting_Effect_Volume, this.mEffectSwitch);
    },
    onLoad() {
        cc.wwx.Storage.getItem(cc.wwx.Storage.Key_Setting_Music_Volume, function(volume) {
            this.mMusicSwitch = parseInt(volume);
        }.bind(this), 1);

        cc.wwx.Storage.getItem(cc.wwx.Storage.Key_Setting_Effect_Volume, function(volume) {
            this.mEffectSwitch = parseInt(volume);
        }.bind(this), 1);

        this.preload();
    },
    preload : function() {
        if (!CC_WECHATGAME) { return; }

        var musics = [
            this.audioGameBgm0,
        ];
        musics.forEach(function(path) {
            var musicPath = wxDownloader.REMOTE_SERVER_ROOT + path;
            if (musicPath != wxDownloader.REMOTE_SERVER_ROOT && musicPath.endsWith('.mp3')) {
                cc.loader.load(musicPath, function(err, remoteUrl) {
                    if (err) {
                        cc.error(err.message || err);
                        return;
                    }
                });
            }
        })
    },

    getAudioMusicSwitch()
    {
        return this.mMusicSwitch;

    },
    getAudioEffectSwitch()
    {
        return this.mEffectSwitch;
    },
    trunAudioSound(on)
    {
        this.switchMusic(on);
        this.switchEffect(on)
    },
    switchMusic : function(on) {
        if (this.mMusicSwitch != (on?1:0))
        {
            this.mMusicSwitch = 1-this.mMusicSwitch;
            this.save();
            if(on)
            {
                this.playMusicGame();
            }
            else
            {
                this.stopMusic();
            }
        }
    },
    switchEffect : function(on) {
        if (this.mEffectSwitch != (on?1:0)){
            this.mEffectSwitch = 1-this.mEffectSwitch;
            this.save();

        }
    },
    onHide () {
        cc.audioEngine.pauseAll();

        // if (CC_JSB) {
        // } else {
        //     for (var key in this.mAudioMap) {
        //         if (key === this.mMusicKey) {
        //             this.mAudioMap[key].pause();
        //         } else {
        //             this.mAudioMap[key].stop();
        //         }
        //     }
        // }
    },

    onShow () {
        cc.audioEngine.resumeAll();

        // if (CC_JSB) {
        // } else {
        //     if (!this.mMusicSwitch) return;
        //     var context = this.mAudioMap[this.mMusicKey];
        //     if (context) {
        //         context.play();
        //     }
        // }
    },
    playMusic : function(key, callback, loop) {

        loop = typeof loop == 'undefined'  || loop ? true : false;

        this.stopMusic();
        this.mMusicKey = this.play(key, loop, callback, true);
    },
    /**
     * 游戏背景音乐
     */
    playMusicGame () {
        this.playMusic(this.audioGameBgm0);
    },
    /**
     * 停止背景音乐播放
     */
    stopMusic () {
        var context = this.mAudioMap[this.mMusicKey];

        if (typeof(context) != 'undefined') {
            // if (CC_JSB) {
            //     cc.audioEngine.stop(context);
            // } else {
            //     context.stop();
            // }
            cc.audioEngine.stop(context);

        }
    },
    // 炸弹、火箭爆炸音效
    playBomb () {
        return this.play(this.audioBomb, false);
    },
    //激光音效
    playJiGuang()
    {
        return this.play(this.audioJiGuang, false);
    },
    //技能音效
    playItem1()
    {
        return this.play(this.audioItem1, false);
    },
    /*
     * 游戏开始音效
     *
     */
     playGameStart()
     {
         return this.play(this.audioGameStart, false);
     },
     /*
      * 失败的游戏结束
      */
     playGameOver()
     {
         return this.play(this.audioGameOver,false);
     },
    /*
      * 成功的游戏结束
      */
    playGameResultFailed()
    {
        return this.play(this.audioGameResultFail,false);
    },
    /*
  * 成功的游戏结束
  */
    playGameResultSuccess()
    {
        return this.play(this.audioGameResultSuccess,false);
    },
    /**
     * 报警的音效
     */
    playWarning()
    {
        return this.play(this.audioWarning,false);

    },
    /**
     * 按钮
     */
    playAudioButton () {
        return this.play(this.audioButtonClick, false);
    },


});