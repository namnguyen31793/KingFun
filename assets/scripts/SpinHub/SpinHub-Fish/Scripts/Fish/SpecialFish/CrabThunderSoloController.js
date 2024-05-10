// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor() {
        this.hitCombo = 0;
        this.timeHit = 7;
        
    },
    properties: {
       ThunderHammer : cc.Node,
       EffectThunder : cc.Node,
       afterSoundEffect: {
        default: null,
        type: cc.AudioClip
        },
        ExploreSoundEffect: {
            default: null,
            type: cc.AudioClip
        },
    },

    Init_CrabthunderSolo (startPosition,fishValue,killActor) {
       // bay ve giua ban va animation chuyen doi
       cc.audioEngine.playEffect(this.afterSoundEffect, false);
       this.ThunderHammer.setPosition(startPosition);
       this.ThunderHammer.active = true;
       this.thunderHammer_Animation = this.ThunderHammer.getComponent(cc.Animation);
       this.thunderHammer_Animation.play("Crab_HammerChange");
       this.ThunderHammer.runAction(
        cc.sequence
        (            
            cc.moveTo(2, 0, 0),
            cc.delayTime(0.5),
            cc.callFunc(()=>{
                this.PlayHitCombo(fishValue, killActor);
            })
        )
    );

    },

    PlayHitCombo(fishValue,killActor)
    {
           let callBack = ()=>{
         
            this.EffectThunder.active = true;                                  
            this.EffectThunder.getComponent(cc.Animation).play('Light');         
            this.thunderHammer_Animation.off("finished" , callBack);
            this.ThunderHammer.active = false;
            let fishAffect = require("FishCollection").getIns().GetListFishIdInScene (cc.winSize.width/2, 350);
            let affectDeathFishList =  require("FishCollection").getIns().GetRandomFishInSceneView (cc.winSize.width/2, 350,fishAffect.length);

            for(let i = 0; i < affectDeathFishList.length; i++) 
            {            
                        let fishDie = require("FishCollection").getIns().GetFishById(affectDeathFishList[i].FishProperties.FishId);
                        if(fishDie != null && fishDie.FishProperties != null) 
                        {                           
                            fishDie.reoveFishHaveEffect ();
                            Global.ServerBot.ServerKillFish(fishDie.FishProperties.FishId);                              
                        }
            } 

            if(killActor != null)
            {          
                this.EndReward(fishValue,killActor);
            }
            cc.audioEngine.playEffect(this.ExploreSoundEffect, false);
        }
        this.thunderHammer_Animation.on("finished" ,callBack );
        this.thunderHammer_Animation.play("Crab_HammerAttack");
      
    },

    EndReward(fishValue,killActor)
    {
        
        cc.resources.load('SpinHub-Fish/Prefabs/Fish3/ResultThunderCrab_Reward', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish3","ResultThunderCrab_Reward", (prefab)=>{
            try
            {
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                return;
            let node = cc.instantiate(prefab);
            node.parent = Global.InGameManager.luckyBoxWheelContainer; 
            node.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));
            node.active = true;                                                         
            node.getComponent("ResultThunderCrabFish").SetupRewardValue(fishValue,killActor);
            this.scheduleOnce(()=>{
                this.node.destroy();
            },2);  
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }   
        });   
        
    }
   

   
    
});
