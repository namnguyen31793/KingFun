cc.Class({
    extends: cc.Component,
    ctor() {
        this.soundManager = null;
        this.isPlayMusic = true;
        this.isPlaySound = true;
        this.bgLink = "";
        this.clickLink = "";
        this.spinLink = "";
        this.winMoneyLink = "";
        this.bigWinLink = "";
        this.spinStart = "";
        this.spinStop = "";
        this.jackpotLink = "";
        this.freeLink = "";
        this.bonusStart = "";
        this.bonusEnd = "";
        this.soundManager2 = null;
        this.bundleName = "Slot";
    },

    properties: {
		isBattle: false,
        BigWinSound : cc.AudioClip,
        BgMusicSound : cc.AudioClip
    },

    Init() {
        this.soundManager = require('SoundManager1').getIns();
        this.soundManager2 = require('SoundManager2').getIns();
        this.SetLink();
        if(this.isBattle) {
            this.isPlayMusic = false;
            this.isPlaySound = false;
        }
    },
    
    SetLink() {
        this.bgLink = "Sound/SlotShockDeer";
        this.clickLink = "Sound/Egrypt/Click";
        this.spinLink = "Sound/Egrypt/Spining";
        this.winMoneyLink = "Sound/Egrypt/GetPrizeLine";
        this.bigWinLink = "Sound/Egrypt/BigWin";
        this.spinStart = "Sound/Egrypt/SpinStart";
        this.spinStop = "Sound/Egrypt/SpinStop";
        this.freeLink = "Sound/Egrypt/FreeSpin";
        this.jackpotLink = "Sound/Egrypt/JackpotV2";
        this.bonusStart = "Sound/Egrypt/BonusStart";
        this.bonusEnd = "Sound/Egrypt/BonusEndV2";
    },

    ChangeStateSound(state) {
        this.isPlaySound = state;
        if(!this.isPlaySound)
            this.StopSound();
    },

    ChangeStateMusic(state) {
        
        this.isPlayMusic = state;
        if(this.isPlayMusic)
            this.PlayBackgroundMusic();
        else 
            this.StopBackgroundMusic();
    },

    PlayBackgroundMusic() {
        if(this.isPlayMusic)
            if(this.BgMusicSound != null)
            {
                this.soundManager2.playMusicBackgroundClip(this.BgMusicSound,true);       
            }
            else
            {
                this.soundManager2.playMusicBackground2(this.bundleName, this.bgLink, 0.6);
            }
    },

    StopBackgroundMusic() {
        if(this.soundManager != null)
            this.soundManager.stopMusicBackground();
        if(this.soundManager2 != null)
            this.soundManager2.stopMusicBackground();
    },

    StopSound() {
        if(this.soundManager != null) {
            this.soundManager.stopEffect(this.clickLink);
            this.soundManager.stopEffect(this.spinLink);
            this.soundManager.stopEffect(this.winMoneyLink);
            this.soundManager.stopEffect(this.bigWinLink);
            this.soundManager.stopEffect(this.spinStart);
            this.soundManager.stopEffect(this.spinStop);
            this.soundManager.stopEffect(this.freeLink);
            this.soundManager.stopEffect(this.jackpotLink);
            this.soundManager.stopEffect(this.bonusStart);
            this.soundManager.stopEffect(this.bonusEnd);
        }
        
        if(this.soundManager2 != null) {
            this.soundManager2.stopEffect(this.clickLink);
            this.soundManager2.stopEffect(this.spinLink);
            this.soundManager2.stopEffect(this.winMoneyLink);
            this.soundManager2.stopEffect(this.bigWinLink);
            this.soundManager2.stopEffect(this.spinStart);
            this.soundManager2.stopEffect(this.spinStop);
            this.soundManager2.stopEffect(this.freeLink);
            this.soundManager2.stopEffect(this.jackpotLink);
            this.soundManager2.stopEffect(this.bonusStart);
            this.soundManager2.stopEffect(this.bonusEnd);
        }
       
    },

    StopAll() {
        if(this.soundManager != null)
            this.soundManager.stopAll();
        if(this.soundManager2 != null)
            this.soundManager2.stopAll();
    },

    PlayClick() {
        this.PlaySound(this.clickLink);
    },

    PlaySpin() {
        this.PlaySound(this.spinLink);
    },

    StopSpin() {
        if(this.soundManager != null)
            this.soundManager.stopEffect(this.spinLink);
        if(this.soundManager2 != null)
            this.soundManager2.stopEffect(this.spinLink);
    },

    PlayWinMoney() {
        this.PlaySound(this.winMoneyLink);
    },

    PlayBigWin() {
        //this.PlaySound(this.bigWinLink);        
        cc.audioEngine.playEffect(this.BigWinSound, false);         
    },

    PlaySpinStart() {
        // this.PlaySound(this.spinStart);
    },

    PlaySpinStop() {
        // this.PlaySound(this.spinStop);
    },

    PlayFreeSpin() {
        this.PlaySound(this.freeLink);
    },

    PlayJackpot() {
        this.PlaySound(this.jackpotLink);
    },

    PlayBonusStart() {
        this.PlaySound(this.bonusStart);
    },

    PlayBonusEnd() {
        this.PlaySound(this.bonusEnd);
    },

    PlaySound(resSound) {
        if(this.isPlaySound) {
            this.soundManager2.playEffect2(this.bundleName, resSound, false, 1 , true);
        }
    },

    PlaySoundClip(name, clip) {
        if(this.isPlaySound) {
            this.soundManager2.playEffectClip(name, clip, false, 1);
        }
    },
    HandleMatrixSound(matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, extendMatrixDescription)
    {

    },
});
