
cc.Class({
    extends: require('AudioPool_V2'),

    properties: {
        musicBackground: cc.AudioSource,
        musicNormalBackground: cc.AudioClip,
        musicBonusBackground: cc.AudioClip,
        music_FreeTopup_Background: cc.AudioClip,
        music_8Free_Background: cc.AudioClip,
        music_selectFree_Bg : cc.AudioClip,
       
        normalWin: cc.AudioSource,
        coinFall: cc.AudioSource,
        Jackpot: cc.AudioSource,        
        spin: cc.AudioSource,
        swithChoiThu: cc.AudioSource,
        start_SelectFree : cc.AudioSource,
      
        click_ChangeRoom_Btn : cc.AudioSource,
    
        click: cc.AudioSource,  
        button: cc.AudioSource,
        buy_Special_Btn: cc.AudioSource,

        fireFly_Fx_Sound: cc.AudioSource,
        startBonus_Fx_Sound: cc.AudioSource,

        bonus_SelectItem_Sound: cc.AudioSource,
        music_Jackpot_Background: cc.AudioSource,
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

    stopAllBgMusic()
    {

    },

    playClickBtn()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.click);
    },

    playBuySpecialBtn()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.buy_Special_Btn);
    },
    playChangeRoomBtn()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.click_ChangeRoom_Btn);
    },
    playSwitchChoiThuBtn()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.swithChoiThu);
    },
    playFireFly_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.fireFly_Fx_Sound);
    },
    playNormalWin()
    {
        require("AudioController_V2").getIns().playSound(cc.AudioTypes.NORMAL_WIN);
        require("AudioController_V2").getIns().playSound_Direct(this.coinFall);
    },

    playBonusMusicBg()
    {
        this.setBackgroundMusic(this.musicBonusBackground);
    },
    playFree8_MusicBg()
    {
        this.setBackgroundMusic(this.music_8Free_Background);
    },
    playFreeTopup_MusicBg()
    {
        this.setBackgroundMusic(this.music_FreeTopup_Background);
    },
    playNormal_MusicBg()
    {
        this.setBackgroundMusic(this.musicNormalBackground);
    },
    playJackpot_MusicBg()
    {        
        require("AudioController_V2").getIns().playSound_Direct(this.music_Jackpot_Background);
    },
    playStartBonus_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.startBonus_Fx_Sound);
    },
    playSelectBonusItem_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.bonus_SelectItem_Sound);
    },
    playSelectFree_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.start_SelectFree);
        this.stopBackgroundMusic();
        this.setBackgroundMusic(this.music_selectFree_Bg);
    },
  
    // update (dt) {},
});
