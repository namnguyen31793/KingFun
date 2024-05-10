

cc.Class({
    extends: cc.Component,
    ctor() {
        this.currentIndex1 = 0;
        this.currentIndex2 = 7;
      
        this.musicValue = 0;
        this.soundValue = 0;
    },

    properties: {
        audios : [cc.AudioSource],
        backgroundMusicAudio : cc.AudioSource,
      
    },

    start() {
        cc.game.addPersistRootNode(this.node);
        this.SetUpAudioStartGame();
    },

    SetUpAudioStartGame() {

        let isSound = cc.sys.localStorage.getItem("SOUND_AllWin123465") || 1;
        this.soundValue = isSound;
        

        let isMusic = cc.sys.localStorage.getItem("MUSIC_AllWin123465") || 1;
        this.musicValue = isMusic;
        this.SetUpMusic(isMusic);
        this.SetUpSound(isSound);
        this.SaveStatusAudio();
    },

    SetUpSound(value) {
        for (let i = 0; i < this.audios.length; i++) {
            this.audios [i].volume = value;
        }
        if (value == 0) {
            for (let i = 0; i < this.audios.length; i++) {
                this.audios [i].stop();
            }
        }
        this.SaveStatusAudio();
    },

    SetUpMusic(value) {
        if(this.backgroundMusicAudio)
            this.backgroundMusicAudio.volume = value;
    },

    SaveStatusAudio() {
        cc.sys.localStorage.setItem("MUSIC_AllWin123465" , this.musicValue);
        cc.sys.localStorage.setItem("SOUND_AllWin123465" , this.soundValue);
    },

    ChangeValueMusic(value) {
        this.musicValue = value;
        this.SetUpMusic (value);
        this.SaveStatusAudio ();
    },

    ChangeValueSound (value) {
        this.soundValue = value;
        this.SetUpSound (value);
        this.SaveStatusAudio ();
    },

    GetValueMusic() {
        return this.musicValue;
    },

    GetValueSound() {
        return this.soundValue;
    },

    //music
    PlayMusicLogin() {
        if(Global.InGameManager.inBackGround)
            return;
        cc.resources.load("SpinHub-Fish/Sound/LobbyMusic1" , cc.AudioClip , (err , pre)=>{ 
            this.backgroundMusicAudio.volume = 0.6;
             this.backgroundMusicAudio.clip = pre;
             this.backgroundMusicAudio.play();
             this.backgroundMusicAudio.loop = true;
         });
    },

    PlayMusicLobby() {
        if(Global.InGameManager.inBackGround)
            return;
        cc.resources.load("SpinHub-Fish/Sound/LobbyMusic1" , cc.AudioClip , (err , pre)=>{ 
            this.backgroundMusicAudio.volume = 0.6;
             this.backgroundMusicAudio.clip = pre;
             this.backgroundMusicAudio.play();
             this.backgroundMusicAudio.loop = true;
         });
    },

    PlayMusicLobby2() {
        if(Global.InGameManager.inBackGround)
            return;
        this.backgroundMusicAudio.volume = 1;
        cc.resources.load("SpinHub-Fish/Sound/LobbyMusic" , cc.AudioClip , (err , pre)=>{
             Global.AudioManager.backgroundMusicAudio.clip = pre;
             Global.AudioManager.backgroundMusicAudio.play();
             Global.AudioManager.backgroundMusicAudio.loop = true;
         });
    },
    PlayMusicLobby3() {
        this.backgroundMusicAudio.volume = 0.5;
        cc.resources.load("SpinHub-Fish/Sound/LobbyMusic_OCK" , cc.AudioClip , (err , pre)=>{
             Global.AudioManager.backgroundMusicAudio.clip = pre;
             Global.AudioManager.backgroundMusicAudio.play();
             Global.AudioManager.backgroundMusicAudio.loop = true;
         });
    },

    PlayMusicInGame() {
        this.backgroundMusicAudio.volume = 1;
        cc.resources.load("SpinHub-Fish/Sound/BGM_Fish/Fish_BGM"  + Global.RandomNumber(1, 9), cc.AudioClip , (err , pre)=>{
             Global.AudioManager.backgroundMusicAudio.clip = pre;
             Global.AudioManager.backgroundMusicAudio.play();
             Global.AudioManager.backgroundMusicAudio.loop = true;
         });
    },

    PlayMusicInGame3() {
        this.backgroundMusicAudio.volume = 1;
        cc.resources.load("SpinHub-Fish/Sound/BGM_Fish/Fish_BGM"  + Global.RandomNumber(1, 9), cc.AudioClip , (err , pre)=>{
             Global.AudioManager.backgroundMusicAudio.clip = pre;
             Global.AudioManager.backgroundMusicAudio.play();
             Global.AudioManager.backgroundMusicAudio.loop = true;
         });
    },
   

    PlayMusicInGameSlot() {
        this.backgroundMusicAudio.stop();
    },

    //sound
    ClickButton() {
        this.PlayAudio1 ("ClickButton");
    },

    PlayStartJackpotAudio() {
        this.PlayFishAudio2 ("StartJackpot");
    },

    PlaySoundGun123() {
        this.PlayFishAudio1 ("GunMusic1");
    },

    PlaySoundGun456() {
        this.PlayFishAudio1 ("GunMusic4");
    },

    PlaySoundGun7() {
        this.PlayFishAudio1 ("GunMusic7");
    },

    PlaySoundGun8() {
        this.PlayFishAudio1 ("GunMusic8");
    },

    PlayFishBoomSound() {
        this.PlayFishAudio1 ("FishBoom");
    },

    PlayKillFish() {
        this.PlayAudio1 ("CoinMusic2");
    },

    PlayHightScore() {
        this.PlayFishAudio2 ("HightScore");
    },

    PlayMoneySound() {
        this.PlayAudio1 ("CoinMusic1");
    },

    PlayMegaWin() {
        this.PlayFishAudio2 ("KillJackpot");
    },

   

    //play
    PlayAudio1(clipName) {
       
        this.currentIndex1 += 1;
        if (this.currentIndex1 >= 6)
            this.currentIndex1 = 0;
        cc.resources.load("SpinHub-Fish/Sound/"+clipName, cc.AudioClip , (err , pre)=>{ 
            this.audios [this.currentIndex1].clip = pre;
            this.audios [this.currentIndex1].play ();
        });
    },

    PlayAudio2(clipName) {
       
        this.currentIndex2 += 1;
        if (this.currentIndex2 >= 9)
            this.currentIndex2 = 6;
        cc.resources.load("SpinHub-Fish/Sound/"+clipName, cc.AudioClip , (err , pre)=>{ 
            this.audios [this.currentIndex2].clip = pre;
            this.audios [this.currentIndex2].play ();
        });
    },

   

    PlayFishAudio1(clipName) {
        this.currentIndex1 += 1;
        if (this.currentIndex1 >= 6)
            this.currentIndex1 = 0;
        cc.resources.load("SpinHub-Fish/Sound/"+clipName, cc.AudioClip , (err , pre)=>{ 
            Global.AudioManager.audios [Global.AudioManager.currentIndex1].clip = pre;
            Global.AudioManager.audios [Global.AudioManager.currentIndex1].play ();
        });
    },

    PlayFishAudio2(clipName) {
        this.currentIndex2 += 1;
        if (this.currentIndex2 >= 9)
            this.currentIndex2 = 6;
        cc.resources.load("SpinHub-Fish/Sound/"+clipName, cc.AudioClip , (err , pre)=>{ 
            Global.AudioManager.audios [Global.AudioManager.currentIndex2].clip = pre;
            Global.AudioManager.audios [Global.AudioManager.currentIndex2].play ();
        });
    },

 


    onLoad() {
        Global.AudioManager = this;
    },
});
