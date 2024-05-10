

cc.Class({
    extends: cc.Component,
   
    properties: {
        RewardLabel : require("TextJackpot")  
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.RewardLabel.reset();
     },

    start () {
        this.rewardValue = 0;
    },
    OnStart() {     
    },
 
    Inc_RewardValue(incValue)
    {
        this.rewardValue += incValue;
        this.ShowEffectReward();
    },
   
     ShowEffectReward()
    {
        this.RewardLabel.StartIncreaseTo(this.rewardValue);  
    },
    SetupRewardValue(totalValue)
    {
        this.rewardValue = totalValue;
        this.ShowEffectReward();
        this.scheduleOnce(()=>{
            this.RewardLabel.reset();   
            this.node.active = false;   
            this.node.destroy();   
        } , 5);
    },
   
});