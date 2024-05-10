// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require('AudioPool_V2'),

    properties: {
        musicBackground: cc.AudioSource,
        click_Btn : cc.AudioSource,
        Laser : cc.AudioSource,
        Ship_Explode : cc.AudioSource,
        KhoiHanh : cc.AudioSource,
        TauChinh_DangBay_1 : cc.AudioSource,

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
        if (this.click_Btn) {
            this.click_Btn.mute = !enable;        
            this.Laser.mute = !enable;
            this.Ship_Explode.mute = !enable;
            this.KhoiHanh.mute = !enable;
            this.TauChinh_DangBay_1.mute = !enable;
        }
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
    playClickBtn()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.click_Btn);
    },
    playLaser()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.Laser);
    },
    playShip_Explode()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.Ship_Explode);
        this.stopTauChinh_DangBay();
    },
    playKhoiHanh()
    {
        require("AudioController_V2").getIns().playSound_Direct(this.KhoiHanh);
    },
    playTauChinh_DangBay()
    {
       this.tauBaySound = require("AudioController_V2").getIns().playSound_Direct(this.TauChinh_DangBay_1,true);
    },
    stopTauChinh_DangBay()
    {
        if(this.tauBaySound)
            this.tauBaySound.stop();
        //require("AudioController_V2").getIns().playSound_Direct(this.TauChinh_DangBay_1);
    }


});
