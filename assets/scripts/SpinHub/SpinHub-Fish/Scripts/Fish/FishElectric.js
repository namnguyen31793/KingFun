
var RoadProperties2D = require ("RoadProperties2D");
cc.Class({
    extends: require("Fish2D"),

    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {     
     
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
  
        this.SetShock();
        Global.InGameManager.shakeScrenn(0.3);
        if(killActor == null)
        {
       
            return;
        }
       
         Global.InGameManager.creatEffectWinElectricFisht(killActor, Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)), Global.Enum.FISH_TYPE_CONFIG.ELECTRIC_FISH_TYPE);
        let affectFishList =  require("FishCollection").getIns().GetListFishIdInScene (cc.winSize.width/2, 350);
        let affectDeathFishList =  require("FishCollection").getIns().GetRandomFishInSceneView (cc.winSize.width/2, 350,affectFishList.length/2);
        let listFishShock = [];
        listFishShock[listFishShock.length] = this;
      
        for(let i = 0; i< affectDeathFishList.length;i++)
        {
            let killedFish =  require("FishCollection").getIns().GetFishById(affectDeathFishList[i].FishProperties.FishId);
            if(killedFish == null)
                continue;
            killedFish.SetShock();
            listFishShock[listFishShock.length] = killedFish;
           
        }
       
        Global.InGameManager.creatEffectLighting(listFishShock, ()=>{  
            for(let j = 0;j< listFishShock.length;j++)
            {
                if(listFishShock[j] == null )
                    continue;
                if(this != null && this.FishProperties != null && listFishShock[j].FishProperties.FishId == this.FishProperties.FishId)
                    continue;
                
                listFishShock[j].reoveFishHaveEffect(null,killActor);
            }
            if(killActor == null)
                return;
            Global.InGameManager.SetValueWinElectric(killActor, fishValue, true);
            
            killActor.scheduleOnce(()=>{
                killActor.UpdateBalance(fishValue, true);
                killActor.On_Attack();
            } , 2.5);
            
            Global.AudioManager.PlayFishBoomSound();
        });
    },

});
