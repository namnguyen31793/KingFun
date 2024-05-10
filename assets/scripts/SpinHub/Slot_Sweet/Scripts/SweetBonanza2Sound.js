cc.Class({
    extends: require("SlotSoundControl"),

    ctor(){
        this.boomEffect = "Sound/boom";
    },
    properties: {
		reelSpin : cc.AudioClip,
        showFreeSpin : cc.AudioClip,
        showWinMoney : cc.AudioClip,
    },
    SetLink() {
        this._super();
        this.bgLink = "Sound/BGFull";
        this.spinLink = "Sound/Spin";
        this.clickLink = "Sound/Click";
        this.winMoneyLink = "Sound/WinMoney";
        this.bigWinLink = "Sound/BigWin";
        this.spinStart = "Sound/SpinStart";
        this.spinStop = "Sound/SpinStop";
        this.freeLink = "Sound/FreeSpin";
        this.bundleName = "Slot_Sweet";
    },

    StopSound() {
        this._super();
        this.soundManager.stopEffect(this.boomEffect);
    },

    PlayBoom() {
        this.PlaySound(this.boomEffect);
    },

    PlaySpinStart() {
        this.PlaySoundClip("reelSpin", this.reelSpin);
        // cc.audioEngine.playEffect(this.reelSpin, false);   
    },

    Play_ShowFreeSpin()
    {
        this.PlaySoundClip("showFreeSpin", this.showFreeSpin);
        // cc.audioEngine.playEffect(this.showFreeSpin, false);   
    },
    Play_ShowWinMoney()
    {
        this.PlaySoundClip("showWinMoney", this.showWinMoney);
        // cc.audioEngine.playEffect(this.showWinMoney, false);   
    }

    
});