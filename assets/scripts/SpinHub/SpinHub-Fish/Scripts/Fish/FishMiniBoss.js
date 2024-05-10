

cc.Class({
    extends: require("FishSpine"),

    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {     
        if(killActor == null)
                return;      
        killActor.scheduleOnce(()=>{
                killActor.UpdateBalance(fishValue, true);
                killActor.On_Attack();
            } , 2.5);
            
    },

   
});
