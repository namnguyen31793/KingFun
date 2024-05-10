// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lbiBalance = this.node.getComponent(cc.LabelIncrement_V2);
        cc.BalanceController.getInstance().addBalanceView(this);  
    },

    start () {

    },

    updateBalance(balance) {
        this.balance = balance;
        this.lbiBalance.tweenValueto(balance);
    },

    refreshBalance() {
        this.lbiBalance.tweenValueto(this.balance);
    },

    onDestroy() {
        cc.BalanceController.getInstance().removeBalanceView(this);
    },

    // update (dt) {},
});
