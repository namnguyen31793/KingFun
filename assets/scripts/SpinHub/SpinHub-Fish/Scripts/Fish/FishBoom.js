var RoadProperties2D = require ("RoadProperties2D");

cc.Class({
    extends: require("Fish_SpecialBase"),

    properties: {
       
    },
   
    ctor() {
        this.countMove = 0;
    },
    Handle_AnimationDeathFish(fishValue, killActor,rewardDescription)
    {
        this.ske.timeScale = 0.5;
        this.ske.setAnimation(0, 'die', false);
        
    },
    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {
        if(killActor == null)
        {
            
        }

        let gameLogic = Global.GameLogic;
        if(Global.InGameManager.fishTarget != null ) {
            Global.InGameManager.fishTarget = null;
          
        }
      
        Global.AudioManager.PlayFishBoomSound();
        Global.InGameManager.shakeScrenn(0.5);
        Global.InGameManager.FishPoolInstance.creatEffectBoom2(this.node.getPosition());

        if (Global.GameLogic.roomProperties.RoomType != 3) // room bot
        {
            this.BotRoom_HandleFishDeath(fishValue, killActor,rewardDescription)
        }
        else
        {
            // room thuong 
          
        }


    },
    BotRoom_HandleFishDeath(fishValue, killActor,rewardDescription)
    {
        let fishAffect = require("FishCollection").getIns().GetListFishIdInScene (cc.winSize.width/2, 350);
        let listAffectDie = require("FishCollection").getIns().GetRandomFishInSceneView (cc.winSize.width/2, 350,fishAffect.length/2);
        let deathFishIds = [];
        for(let i = 0; i < listAffectDie.length;i++){
            if(listAffectDie[i] != null){
                let fishtemp = listAffectDie[i];              
                Global.ServerBot.ServerKillFish(fishtemp.FishProperties.FishId);
                deathFishIds.push(listAffectDie[i].FishProperties.FishId);            
            }
        }

        Global.GameLogic.Handle_KillMultiFish(killActor,deathFishIds);
        
        if (killActor != null) {
            killActor.scheduleOnce(()=>{
                    killActor.UpdateBalance(fishValue, true);
                } , 1.5);
        }
        

    }
    

});  
