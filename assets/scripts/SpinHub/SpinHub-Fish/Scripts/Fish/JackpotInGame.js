cc.Class({
    extends: cc.Component,

    properties: {
        lbMoney : require("TextJackpot"),
    },

    UpdateJackpotValue(jackpotValue) {
        this.lbMoney.StartIncreaseTo(jackpotValue);  
    },

    onLoad() {
        Global.JackpotInFish = this;
    },

    onDestroy() {
        Global.JackpotInFish = null;
    },
    
});
