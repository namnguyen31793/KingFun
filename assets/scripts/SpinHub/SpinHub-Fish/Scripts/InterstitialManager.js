cc.Class({
    extends: cc.Component,
    ctor() {
        this.isCountTime = false;
        this.countTime = 0;
        this.numb = 1;
    },

    properties: {
        
    },

    start () {
        this.isCountTime = true;
        
    },

    update(dt) {
      
        
    },

    onReset() {
        this.countTime = true;
        this.countTime = 0;
        this.numb += 1;
        Global.showInterstitialAds = false;
    },

    onLoad() {
        Global.TimeCountIntertitial = this;
    },

    onDestroy() {
        Global.TimeCountIntertitial = null;
    },

    
});
