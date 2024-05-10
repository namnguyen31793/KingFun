// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        soundOn: {
            default: true,
            tooltip: 'Toggle sound on/off',
        },
        soundEffects: {
            default: [],
            type: cc.AudioClip,
            tooltip: 'List of sound effects to be played once',
        },
        killBigFishSoundEffects: {
            default: [],
            type: cc.AudioClip,
            tooltip: 'List of sound effects to be played once',
        },
        CoinJumpSoundEffect: {
            default: null,
            type: cc.AudioClip,      
        },
        LazelSound : cc.AudioClip,
    },

    onLoad: function () {
        // Lưu trữ trạng thái đã phát âm thanh
        this.hasPlayedSounds = [];
        for (let i = 0; i < this.soundEffects.length; i++) {
            this.hasPlayedSounds[i] = false;
        }
    },

    playSoundEffectOnce: function (index) {
        if (this.soundOn && this.soundEffects.length > index && !this.hasPlayedSounds[index]) {
            cc.audioEngine.playEffect(this.soundEffects[index], false);
            this.hasPlayedSounds[index] = true;
        }
    },

    playRandomSoundEffect: function () {
        if (this.soundOn && this.soundEffects.length > 0) {
            const availableIndexes = this.getAvailableSoundIndexes();
            if (availableIndexes.length > 0) {
                const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
                cc.audioEngine.playEffect(this.soundEffects[randomIndex], false);
                this.hasPlayedSounds[randomIndex] = true;
            }
        }
    },

    playKillBigFishRandomSoundEffect: function () {
        if (this.soundOn && this.killBigFishSoundEffects.length > 0) {
        //    const availableIndexes = this.getAvailableSoundIndexes();
         
                const randomIndex = Math.floor(Math.random() * this.killBigFishSoundEffects.length);
                cc.audioEngine.playEffect(this.killBigFishSoundEffects[randomIndex], false);
                //this.hasPlayedSounds[randomIndex] = true;
            
        }
    },
    playCoinJumpSoundEffect: function () {  
        
        cc.audioEngine.playEffect(this.CoinJumpSoundEffect, false);
            
    },

    toggleSound: function () {
        this.soundOn = !this.soundOn;
    },

    // Hàm trợ giúp để lấy chỉ mục âm thanh chưa được phát
    getAvailableSoundIndexes: function () {
        const availableIndexes = [];
        for (let i = 0; i < this.hasPlayedSounds.length; i++) {
            if (!this.hasPlayedSounds[i]) {
                availableIndexes.push(i);
            }
        }
        return availableIndexes;
    },

    PlayLazelSound()
    {
        cc.audioEngine.playEffect(this.LazelSound, false);
        
    },

    // Additional methods for managing other sounds within the game
    // ...

    // Optional: You can add lifecycle methods like onDestroy if needed
    // ...
});
