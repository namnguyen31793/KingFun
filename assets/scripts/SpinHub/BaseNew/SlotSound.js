cc.Class({
    extends: cc.Component,

    ctor() {
        this.soundManager2 = null;
        this.isPlayMusic = true;
        this.isPlaySound = true;
    },

    Init() {
        this.soundManager2 = require('SoundManager2').getIns();
        let isMusic = cc.sys.localStorage.getItem("HIT+123465") || 1;
        if(isMusic > 0) {
            this.ChangeStateMusic(true);
            
        } else {
            this.ChangeStateMusic(false);
        }
        let isAudio = cc.sys.localStorage.getItem("HIT+123465") || 1;
        if(isAudio > 0) {
            this.ChangeStateSound(true);
            
        } else {
            this.ChangeStateSound(false);
        }
    },

    onLoad() {
    },

    ChangeStateMusic(state) {

    },
    
    ChangeStateSound(state) {

    },
});
