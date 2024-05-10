// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends:  require('AudioPool_V2'),

    properties: {
        musicBackground: cc.AudioSource,
        spin: cc.AudioSource,
        stopSpin1: cc.AudioSource,
        stopSpin2: cc.AudioSource,
        stopSpin3: cc.AudioSource,
        stopSpin4: cc.AudioSource,
        stopSpin5: cc.AudioSource,
    
        click: cc.AudioSource,
        normalWin: cc.AudioSource,

        multiEffect : cc.AudioSource,
        startLight_MultiEffect : cc.AudioSource,

        bigWin :  cc.AudioSource,
        bigWinScene :  cc.AudioSource,
        megaWin :  cc.AudioSource,
        superWin :  cc.AudioSource,
        epicWin :  cc.AudioSource,
    },
    SetupSpinController()
    {
        this.spinController = require("Tw_Freespin_Controller").getIns();
        this.spinController.setAudioPool(this);
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
            case cc.AudioTypes.BONUS_CLICK:
                audioClip = this.bonusClick;
                break;
            case cc.AudioTypes.BONUS_MISS:
                audioClip = this.bonusMiss;
                break;
            case cc.AudioTypes.BONUS_WIN:
                audioClip = this.bonusWin;
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

    playStart_LightEffect()
    {
        if(this.startLight_MultiEffect)
        {
            if(!this.AudioController.soundState)
            return;  
            this.AudioController.playSound_Direct(this.startLight_MultiEffect);
        }
    },

    playStart_MultiEffect()
    {
        if(this.multiEffect)
        {
            if(!this.AudioController.soundState)
            return;     
            this.AudioController.playSound_Direct(this.multiEffect);  
        }
    },

    playSound_Bigwin()
    {
        if(this.multiEffect)
        {
            if(!this.AudioController.soundState)
            return;     
            this.AudioController.playSound_Direct(this.bigWin);  
            this.AudioController.playSound_Direct(this.bigWinScene);
        }
    },
    playSound_SuperWin()
    {
        if(this.multiEffect)
        {
            if(!this.AudioController.soundState)
            return;     
            this.AudioController.playSound_Direct(this.megaWin);  
            this.AudioController.playSound_Direct(this.bigWinScene);
        }
    },
    playSound_SuperWin()
    {
        if(this.multiEffect)
        {
            if(!this.AudioController.soundState)
            return;     
            this.AudioController.playSound_Direct(this.superWin);  
            this.AudioController.playSound_Direct(this.bigWinScene);
        }
    },
    playSound_EpicWin()
    {
        if(this.multiEffect)
        {
            if(!this.AudioController.soundState)
            return;     
            this.AudioController.playSound_Direct(this.epicWin);  
            this.AudioController.playSound_Direct(this.bigWinScene);
        }
    },

   
});
