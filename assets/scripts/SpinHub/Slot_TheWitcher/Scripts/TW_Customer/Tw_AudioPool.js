
cc.Class({
    extends: require('AudioPool_V2'),

    properties: {
        musicBackground: cc.AudioSource,
        musicBonusBackground: cc.AudioSource,
        normalWin: cc.AudioSource,
        Jackpot: cc.AudioSource,        
        spin: cc.AudioSource,
        stopSpin1: cc.AudioSource,
        stopSpin2: cc.AudioSource,
        stopSpin3: cc.AudioSource,
        stopSpin4: cc.AudioSource,
        stopSpin5: cc.AudioSource,
    
        click: cc.AudioSource,
        freespin: cc.AudioSource,

        bigWin :  cc.AudioSource,
        superWin :  cc.AudioSource,
        megaWin :  cc.AudioSource,
        epicWin :  cc.AudioSource,

        jackpotWin_bg: cc.AudioSource,
        horseGo : cc.AudioSource,

    },

    enableMusic: function (enable) {
        if (this.musicBackground) {
            if (enable) {
                if (!this.musicBackground.isPlaying) {
                    this.musicBackground.play();
                }
            } else {
                this.musicBackground.stop();
            }
        }
    },

    enableSound: function (enable) {
        if (this.normalWin) {
            this.normalWin.mute = !enable;        
            this.spin.mute = !enable;
            this.stopSpin1.mute = !enable;
            this.stopSpin2.mute = !enable;
            this.stopSpin3.mute = !enable;
            this.stopSpin4.mute = !enable;
            this.stopSpin5.mute = !enable;
          
            this.click.mute = !enable;
            this.freespin.mute = !enable;
        }
    },

    getAudioClip: function (clipType) {
        var audioClip;
        audioClip = null;
        switch (clipType) {
            case cc.AudioTypes.BACKGROUND:
                audioClip = this.musicBackground;
                break;
            case cc.AudioTypes.NORMAL_WIN:
                audioClip = this.normalWin;
                break; 
            case cc.AudioTypes.SPIN:
                audioClip = this.spin;
                break;
            case cc.AudioTypes.STOP_SPIN_1:
                audioClip = this.stopSpin1;
                break;
            case cc.AudioTypes.STOP_SPIN_2:
                audioClip = this.stopSpin2;
                break;
            case cc.AudioTypes.STOP_SPIN_3:
                audioClip = this.stopSpin3;
                break;
            case cc.AudioTypes.STOP_SPIN_4:
                audioClip = this.stopSpin4;
                break;
            case cc.AudioTypes.STOP_SPIN_5:
                audioClip = this.stopSpin5;
                break;
          
            case cc.AudioTypes.CLICK:
                audioClip = this.click;
                break;   
            case cc.AudioTypes.FREESPIN:
                audioClip = this.freespin;
                break;   
            case cc.AudioTypes.JACKPOT:
                audioClip = this.Jackpot;
                break;
            case cc.AudioTypes.BIGWIN:
                audioClip = this.bigWin;
                break;
            case cc.AudioTypes.SUPER_WIN:
                audioClip = this.superWin;
                break;
            case cc.AudioTypes.MEGA_WIN:
                audioClip = this.megaWin;
                break;
            case cc.AudioTypes.EPIC_WIN:
                audioClip = this.epicWin;
                break;
            case cc.AudioTypes.JACKPOT_BACKGROUD:
                audioClip = this.jackpotWin_bg;
                break;
        }
        return audioClip;
    },


    setBackgroundMusic: function (newMusicClip) {
        if (newMusicClip) {
            if (this.musicBackground) {
                this.musicBackground.stop();
            }
            this.musicBackground.clip = newMusicClip; // Gán âm nhạc mới
            this.musicBackground.loop = true; // Đặt âm nhạc nền để loop
            this.musicBackground.play();
        }
    },

    playBackgroundMusic: function () {
        if (this.musicBackground && this.musicBackground.clip) {
            this.musicBackground.loop = true; // Đặt âm nhạc nền để loop
            this.musicBackground.play();
        }
    },
    stopBackgroundMusic()
    {
        if (this.musicBackground && this.musicBackground.clip) {
            this.musicBackground.stop();
        }
    },

    playBonusBgMusic()
    {
        if (this.musicBonusBackground && this.musicBonusBackground.clip) {            
            this.musicBackground.stop();
            this.musicBonusBackground.loop = true; // Đặt âm nhạc nền để loop
            this.musicBonusBackground.play();
        }
    },

   

   

    
    // update (dt) {},
});
