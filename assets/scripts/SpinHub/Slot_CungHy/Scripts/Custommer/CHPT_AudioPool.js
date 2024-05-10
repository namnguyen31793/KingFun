// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({      
    extends: require('AudioPool_V2'),

    ctor()
    {
        this.lastMusicBackgroud = null;
    },

    properties: {
        musicBackground: cc.AudioSource,
        musicNormalBackground: cc.AudioClip,
        musicFreespinBackgroud: cc.AudioClip,
        musicJackpotViewBackgroud: cc.AudioClip,
        


        normalWin: cc.AudioSource,
        spin: cc.AudioSource,
        click: cc.AudioSource, 
        click_Bet:  cc.AudioSource, 
        button: cc.AudioSource,
        stopSpin: cc.AudioSource,

        gongEffect_Fx_Sound: cc.AudioSource,
        OffsetFX_Sound: cc.AudioSource,

        StartMultiCoin_Fx_Sound: cc.AudioSource,
        EndMultiCoin_Fx_Sound: cc.AudioSource,

        ThanTai_Start_Sound : cc.AudioSource,
        NearWin_Sound : cc.AudioSource,
        jackpotView_TienRoi : cc.AudioSource,
        jackpotView_EndTienRoi  : cc.AudioSource,
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
                audioClip = this.stopSpin;
                break;
            case cc.AudioTypes.STOP_SPIN_2:
                audioClip = this.stopSpin;
                break;
            case cc.AudioTypes.STOP_SPIN_3:
                audioClip = this.stopSpin;
                break;
            case cc.AudioTypes.STOP_SPIN_4:
                audioClip = this.stopSpin;
                break;
            case cc.AudioTypes.STOP_SPIN_5:
                audioClip = this.stopSpin;
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
            this.lastMusicBackgroud = this.musicBackground.clip;

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

    playFreeViewBgMusic()
    {
        if (this.musicFreespinBackgroud && this.musicFreespinBackgroud.clip) {            
            this.musicBackground.stop();
            this.musicFreespinBackgroud.loop = true; // Đặt âm nhạc nền để loop
            this.musicFreespinBackgroud.play();
        }
    },

    stopAllBgMusic()
    {

    },

    playClickBtn()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.click);
    },

    playClickChangeRoom()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.click_Bet);
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
    playOffset_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.OffsetFX_Sound);
    },

    playGoingEffect_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.gongEffect_Fx_Sound);
    },

    playNearWin_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.NearWin_Sound);
    },

    playTakeJackpot_Reward()
    {
        require("AudioController_V2").getIns().stopSound(this.NearWin_Sound);
        this.play_ThanTaiAppear_Fx_Sound();
        require("AudioController_V2").getIns().playSound_Direct(this.jackpotView_TienRoi);
    },

    

    playNormalWin()
    {
        require("AudioController_V2").getIns().playSound(cc.AudioTypes.NORMAL_WIN);
        require("AudioController_V2").getIns().playSound_Direct(this.coinFall);
    },

    playFreeMusicBg()
    {
        this.setBackgroundMusic(this.musicFreespinBackgroud);
     
    },
    playJackpot_MusicBg()
    {
        this.setBackgroundMusic(this.musicJackpotViewBackgroud);
       
    },
    playNormal_MusicBg()
    {
        this.setBackgroundMusic(this.musicNormalBackground);
      
    },

    playLastBackgroud_Music()
    {
        this.setBackgroundMusic(this.lastMusicBackgroud);
    },
  
    playStartBonus_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.startBonus_Fx_Sound);
    },
    playSelectBonusItem_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.bonus_SelectItem_Sound);
    },
    play_StartMultiCoin_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.StartMultiCoin_Fx_Sound);
    },
    play_EndMultiCoin_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.EndMultiCoin_Fx_Sound);
    },
    play_JackpotView_EndTienRoi_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.jackpotView_EndTienRoi);
    },

    play_ThanTaiAppear_Fx_Sound()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.ThanTai_Start_Sound);
    },
   
});
