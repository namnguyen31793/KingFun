var FishCollection = require("FishCollection").getIns();
var ActorCollection = require("ActorCollection").getIns();

cc.Class({
    extends: cc.Component,

    ResponseHandle_PlayEffectKillElectricFish(fishId, accountId, fishValue, normalValue, specialValue, deathFishIds, isMulti = false){
       
        let gameLogic = Global.GameLogic;
        let electricFish = FishCollection.GetFishById(fishId);
        if (electricFish != null) {
            electricFish.SetShock();
            if(Global.InGameManager.fishTarget != null && Global.InGameManager.fishTarget.node == electricFish.node) {
                Global.InGameManager.fishTarget = null;
                         
            }
            Global.InGameManager.shakeScrenn(0.3);
            // Global.InGameManager.creatEffectNo2(electricFish.node.getPosition());
        }
        let killActor = ActorCollection.GetActorByPlayerId(accountId);
        if (killActor != null) {
            this.scheduleOnce(()=>{
                Global.InGameManager.creatEffectWinElectricFisht(killActor, Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)), Global.Enum.FISH_TYPE_CONFIG.ELECTRIC_FISH_TYPE);
            } , 0.5);
            
        }
        let listFishShock = [];
        listFishShock[0] = electricFish
        for (let i = 0; i < deathFishIds.length; i++) {
            let killedFish = FishCollection.GetFishById(deathFishIds[i]);
            if (killedFish != null) {
                killedFish.SetShock();
                listFishShock[listFishShock.length] = killedFish;
            }
        }

        Global.InGameManager.creatEffectLighting(listFishShock, ()=>{
            for(let j = 0;j< listFishShock.length;j++)
            {
                if(listFishShock[j] == null)
                    continue;
                listFishShock[j].reoveFishHaveEffect(killActor);
            }
            if(killActor == null)
                return;
            Global.InGameManager.SetValueWinElectric(killActor, fishValue, true);
            /*
            killActor.scheduleOnce(()=>{
                killActor.UpdateBalance(fishValue, true);
            } , 2.5);
            */
            Global.AudioManager.PlayFishBoomSound();
        });
   
    },


    ResponseHandle_PlayEffectKillBoomFish(fishId, accountId, fishValue, normalValue, specialValue, listId, isMulti = false){
        
        let gameLogic = Global.GameLogic;
        let boomFish = FishCollection.GetFishById(fishId);
        let killActor = ActorCollection.GetActorByPlayerId(accountId);
        boomFish.reoveFishHaveEffect(fishValue,killActor,'');

        gameLogic.Handle_KillMultiFish(killActor,listId)
        /*
        if (killActor != null) {
        killActor.scheduleOnce(()=>{
                killActor.UpdateBalance(fishValue, true);
            } , 1.5);
        }
        */
       
    },
    SetupEffectLazes(killActor,fishValue)
    {
        this.fishValue = fishValue;
        this.killActor = killActor;
    },
    PlayEffectLaze() {
       
        if( this.killActor.gun.cacheBullet != null) {
            this.killActor.lazeCollider.node.active = false;
            this.killActor.gun.lazeView.active = false;
            this.killActor.PlaySpecialGun(false);
            Global.InGameManager.creatEffectStartLaze( this.killActor.gun.posBulletSpecial[0]);
            this.node.runAction(cc.sequence(cc.delayTime(1) , cc.callFunc(()=>{
                console.log("play effect laze");
                this.killActor.gun.cacheBullet.node.active = true;
                let ani =  this.killActor.gun.cacheBullet.node.getComponent(cc.Animation);
                Global.InGameManager.shakeScrenn(1.2);
                let callBack = ()=>{
                    ani.off("finished" , callBack);
                    this.killActor.lazeCollider.node.active = true;
                    this.scheduleOnce(()=>{
                        let fishAffect =  this.killActor.lazeCollider.End();
                        this.killActor.lazeCollider.node.destroy();
                        this.killActor.gun.cacheBullet.Handle_ShootingLazes(fishAffect,this.fishValue);
                        this.killActor.On_Attack();
                        this.killActor = null;
                        this.fishValue = 0;
                    } , 0.05)
                }
                ani.on("finished" ,callBack );
                ani.play();
            })));
        } else {
          
            this.scheduleOnce(()=>{
                this.PlayEffectLaze();
            } , 1)
        }
        
    },
    
});
