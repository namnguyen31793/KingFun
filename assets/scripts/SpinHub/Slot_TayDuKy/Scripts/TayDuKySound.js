cc.Class({
    extends: require("SlotSoundControl"),

    SetLink() {
        this._super();
        this.bgLink = "Music/BG";
        this.spinStart =  "Music/StartSpin";
        this.spinStop =  "Music/StopSpin";
        this.jackpotLink ="Music/Jackpot";
        this.spinLink = "Music/StartSpin";
        this.bonusStart = "Music/BonusMusic";
        this.freeLink = "Music/Freespin";
        this.winMoneyLink = "Music/GetPrizeLine";
        this.bigWinLink = "Music/BigWin";
        this.clickLink = "Music/Click";
        this.bundleName = "Slot_TayDuKy";
        
    },

    // PlayBackgroundMusic() {
    //     if(this.isPlayMusic)
    //         if(this.BgMusicSound != null)
    //         {
    //             this.soundManager2.playMusicBackgroundClip(this.BgMusicSound,true);       
    //             // cc.audioEngine.playEffect(this.BgMusicSound,true);       
    //         }
    //         else
    //         {
    //             this.soundManager2.playMusicBackground(this.bundleName, this.bgLink, 0.6);
    //          }
    // },
    
    // PlaySound(resSound) {
    //     if(this.isPlaySound) {
    //         this.soundManager2.playEffect(this.bundleName, resSound, false, 1 , true);
    //     }
            
    // },
});