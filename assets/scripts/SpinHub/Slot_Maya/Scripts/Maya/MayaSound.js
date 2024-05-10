cc.Class({
    extends: require("SlotSoundControl"),

    ctor(){
        this.MAYA_BG = "Sound/BG",
        this.MAYA_BONUS = "Sound/Bonus";
        this.MAYA_START_BONUS = "Sound/StartBonus";
    },

    SetLink() {
        this._super();
        this.bgLink = this.MAYA_BG;
        this.bonusStart = this.MAYA_START_BONUS;
        this.clickLink = "Sound/Click";
        this.spinLink = "Sound/Spining";
        this.winMoneyLink = "Sound/GetPrizeLine";
        this.bigWinLink = "Sound/BigWin";
        this.spinStart = "Sound/SpinStart";
        this.spinStop = "Sound/SpinStop";
        this.freeLink = "Sound/FreeSpin";
        this.jackpotLink = "Sound/JackpotV2";
        this.bonusEnd = "Sound/BonusEndV2";
        this.bundleName = "Slot_Maya";
    },
    
});