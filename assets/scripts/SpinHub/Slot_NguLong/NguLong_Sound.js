cc.Class({
    extends: require('SlotSound'),

    ctor(){
        bgLinkAudio = "";
        cacheMusic = "";
    },
    properties: {
        clickLink: {
            default : "Sound/Click",
        },
        winMoneyLink: {
            default : "Sound/Win",
        },
        spinStop : {
            default : "Sound/realStop",
        },
        jackpotLink : {
            default : "Sound/Jackpot",
        },
    },

    ChangeStateMusic(state) {
        
        this.isPlayMusic = state;
        if(this.isPlayMusic)
            this.PlayBackgroundMusic();
        else 
            this.StopBackgroundMusic();
    },

    PlayBackgroundMusic(isLoop = true) {
        if(this.isPlayMusic && this.bgLinkAudio != "" && this.bgLinkAudio != undefined)
            this.soundManager2.playMusicBackground2("Slot_NguLong", this.bgLinkAudio, 0.6, isLoop);
        else if(this.bgLinkAudio == "" || this.bgLinkAudio == undefined)
            this.soundManager2.stopMusicBackground();
    },

    StopBackgroundMusic() {
        if(this.soundManager2 != null)
            this.soundManager2.stopMusicBackground();
    },

    PlayAudioBigwin(){
        cc.log("PlayAudioBigwin "+this.bgLinkAudio)
        if(this.bgLinkAudio != "Sound/bgBigwinStop")
            this.cacheMusic = this.bgLinkAudio;
        this.bgLinkAudio = "Sound/BgBigWin";
        this.PlayBackgroundMusic(false);
    },

    PlayStopBigWin(){
        this.bgLinkAudio = "Sound/bgBigwinStop";
        this.PlayBackgroundMusic(false);
        this.scheduleOnce(() => {
            cc.tween(this.node)
                .delay(0.5) // Delay 0.5 giây trước khi thực hiện action
                .call(() => {
                    cc.log("PlayStopBigWin "+this.cacheMusic)
                    this.bgLinkAudio = this.cacheMusic;
                    this.PlayBackgroundMusic();
                })
                .start();
        }, 2);
    },

    PlayBgSelectFree(){
        this.bgLinkAudio = "Sound/BGSelectFree";
        this.PlayBackgroundMusic();
    },

    PlayBgFree(){
        this.bgLinkAudio = "Sound/BGFree";
        this.PlayBackgroundMusic();
    },

    PlayBgNorMal(){
        this.bgLinkAudio = "";
        this.PlayBackgroundMusic();
    },

    ChangeStateSound(state) {
        this.isPlaySound = state;
        if(!this.isPlaySound)
            this.StopSound();
    },

    StopSound() {
        if(this.soundManager2 != null) {
            this.soundManager2.stopEffect(this.clickLink);
            this.soundManager2.stopEffect(this.winMoneyLink);
            this.soundManager2.stopEffect(this.spinStop);
            this.soundManager2.stopEffect(this.jackpotLink);
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

    PlayAudioSpinStop() {
        this.PlaySound(this.spinStop);
    },

    PlayAudioWinMoney() {
        this.PlaySound(this.winMoneyLink);
    },

    PlayAudioJackpot() {
        this.PlaySound(this.jackpotLink);
    },

    /*-------------------*/
    PlaySound(resSound) {
        var seft = this;
        if(this.isPlaySound) {
            seft.soundManager2.playEffect2("Slot_NguLong", resSound, false, 0.7, true);
        }        
    },
});
