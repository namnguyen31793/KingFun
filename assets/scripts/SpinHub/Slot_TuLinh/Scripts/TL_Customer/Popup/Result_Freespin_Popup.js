// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbiTotalWin: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.active = false;
    },

    Reward_Setup(totalReward)
    {
        this.lbiTotalWin.string  = cc.Tool.getInstance().formatNumber(totalReward); ;
        this.node.active = true;
        this.scheduleOnce(()=>{
           this.ResetInfo();
        }, 5);     
    },

    ResetInfo()
    {
        this.lbiTotalWin.string  = 0;
        this.node.active = false;
    }


    // update (dt) {},
});
