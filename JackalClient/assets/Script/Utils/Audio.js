

export default class AudioMgr {

    constructor()
    {
        this.bgmVolume = 1.0;
        this.sfxVolume = 1.0;
        this.bgmAudioID = -1;
    }
    init () {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if(t != null){
            this.bgmVolume = parseFloat(t);
        }

        var t = cc.sys.localStorage.getItem("sfxVolume");
        if(t != null){
            this.sfxVolume = parseFloat(t);
        }

        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    };


    getUrl(url){
        return cc.url.raw("resources/sounds/" + url);
    };
    playBGM(url){
        var audioUrl = this.getUrl(url);
        console.log(audioUrl);
        if(this.bgmAudioID >= 0){
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
    };

    playSFX(url){
        var audioUrl = this.getUrl(url);
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);
        }
    };

    setSFXVolume(v){
        if(this.sfxVolume != v){
            cc.sys.localStorage.setItem("sfxVolume",v);
            this.sfxVolume = v;
        }
    };

    setBGMVolume(v,force){
        if(this.bgmAudioID >= 0){
            if(v > 0){
                cc.audioEngine.resume(this.bgmAudioID);
            }
            else{
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if(this.bgmVolume != v || force){
            cc.sys.localStorage.setItem("bgmVolume",v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID,v);
        }
    };

    pauseAll(){
        cc.audioEngine.pauseAll();
    };

    resumeAll(){
        cc.audioEngine.resumeAll();
    }


}