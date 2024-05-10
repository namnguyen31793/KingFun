cc.Class({
    extends: require("SlotSoundControl"),
    ctor(){
        this.TakeExtraFree = "Sound/playButton";
        this.FreeEnd = "Sound/FreeSpinEnd";
    },

    SetLink() {
        this._super();
        
        this.bgLink = "Sound/BG";
        this.spinLink = "Sound/Spin";
        this.winMoneyLink = "Sound/winNormal";
        this.bigWinLink = "Sound/BigWin";
        this.freeLink = "Sound/FreeSpinStart";

        
        this.clickLink = "Sound/Click";
        this.spinStart = "Sound/SpinStart";
        this.spinStop = "Sound/SpinStop";
        this.bundleName = "Slot_DragonFire";
    },
    
    StopSound() {
        this._super();
        this.soundManager.stopEffect(this.TakeExtraFree);
        this.soundManager.stopEffect(this.FreeEnd);
    },

    PlayTakeExtraFree() {
        this.PlaySound(this.TakeExtraFree);
    },

    PlayFreeEnd() {
        this.PlaySound(this.FreeEnd);
    },
});