cc.Class({
    extends: require('SlotSound'),

    properties: {
        linkBgSound : {
            default : "Sound/BG",
        },
        clickLink: {
            default : "Sound/Click",
        },
        spinLink : {
            default : "Sound/Spin",
        },
        winMoneyLink: {
            default : "Sound/Win",
        },
        bigWinLink2 : {
            default : "Sound/LoopBigwin",
        },
        spinStart: {
            default : "Sound/StartSpin",
        },
        spinStop : {
            default : "Sound/StopSpin",
        },
        jackpotLink : {
            default : "Sound/Jackpot",
        },
        freeLink2 : {
            default : "Sound/TiengSong",
        },
        bonusStart : {
            default : "Sound/StartBonus",
        },
        bonusEnd : {
            default : "Sound/EndBonus",
        },
    },

    ChangeStateMusic(state) {
        
        this.isPlayMusic = state;
        if(this.isPlayMusic)
            this.PlayBackgroundMusic();
        else 
            this.StopBackgroundMusic();
    },

    PlayBackgroundMusic() {
        var seft = this;
        if(this.isPlayMusic)
            seft.soundManager2.playMusicBackground2("Slot_AnKhe", this.linkBgSound, 0.6);
    },

    StopBackgroundMusic() {
        if(this.soundManager2 != null)
            this.soundManager2.stopMusicBackground();
    },

    ChangeStateSound(state) {
        this.isPlaySound = state;
        if(!this.isPlaySound)
            this.StopSound();
    },

    StopSound() {
        if(this.soundManager2 != null) {
            this.soundManager2.stopEffect(this.clickLink);
            this.soundManager2.stopEffect(this.spinLink);
            this.soundManager2.stopEffect(this.winMoneyLink);
            this.soundManager2.stopEffect(this.bigWinLink2);
            this.soundManager2.stopEffect(this.spinStart);
            this.soundManager2.stopEffect(this.spinStop);
            this.soundManager2.stopEffect(this.freeLink2);
            this.soundManager2.stopEffect(this.jackpotLink);
            this.soundManager2.stopEffect(this.bonusStart);
            this.soundManager2.stopEffect(this.bonusEnd);
        }
    },

    StopAll() {
        if(this.soundManager2 != null)
            this.soundManager2.stopAll();
    },

    /*CALL AUDIO*/

    PlayAudioClick() {
        this.PlaySound(this.clickLink);
    },

    PlayAudioSpin() {
        this.PlaySound(this.spinLink);
    },

    PlayAudioSpinStart() {
        // this.PlaySound(this.spinStart);
    },

    PlayAudioSpinStop() {
        // this.PlaySound(this.spinStop);
    },

    PlayAudioFreeSpin() {
        this.PlaySound(this.freeLink2);
    },

    PlayAudioBonusStart() {
        this.PlaySound(this.bonusStart);
    },

    PlayAudioBonusEnd() {
        this.PlaySound(this.bonusEnd);
    },

    PlayAudioWinMoney() {
        this.PlaySound(this.winMoneyLink);
    },

    PlayAudioBigWin() {      
        this.PlaySound(this.bigWinLink2);   
    },

    PlayAudioJackpot() {
        this.PlaySound(this.jackpotLink);
    },

    StopSpin() {
        if(this.soundManager2 != null)
            this.soundManager2.stopEffect(this.spinLink);
    },

    /*-------------------*/
    PlaySound(resSound) {
        var seft = this;
        if(this.isPlaySound) {
            seft.soundManager2.playEffect2("Slot_AnKhe", resSound, false, 0.7, true);
        }        
    },
});
