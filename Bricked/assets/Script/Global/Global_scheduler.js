var scheduler = cc.director.getScheduler();

var metaclass = cc._Class.extend({
    Key_Setting_Music_Volume : 'setting.music.volume',
    Key_Setting_Effect_Volume : 'setting.effect.volume',

    ctor : function() {
        this.mTimetamp = Date.parse(new Date()) / 1000;

        scheduler.schedule(this.update, this, 0.1, false);
    },

    update : function(dt) {
        this.mTimetamp += dt;
    },

    pause : function() {

    },

    resume : function() {
        this.mTimetamp = Date.parse(new Date()) / 1000;
    },
})

SML.GlobalScheduler = new metaclass();