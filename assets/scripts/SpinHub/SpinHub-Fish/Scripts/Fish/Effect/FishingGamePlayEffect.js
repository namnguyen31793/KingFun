import List from "List";

cc.Class({
    extends: cc.Component,
    ctor() {
        this.totalLighting = 0;
        this.totalRewardLighting = 0;
    },

    CreateEffectLighting(killActor, electricFish, totalReward) {
        this.totalRewardLighting = 0;
        this.killActor = killActor;
        this.totalRewardElectric = totalReward;
        this.totalLighting = 4;
        if(this.totalLighting > 3)
        this.totalLighting = 3;
        for(let i = 0; i < this.totalLighting;i++) {
            let index = this.GetFishNeighbor(electricFish.node.getPosition(), this.listFishAffect);
            if(index != -1) {
                let bulletLighting = Global.InGameManager.createLightingBullet().getComponent("LightingBullet");
                bulletLighting.Init(electricFish.node.getPosition(), this.listFishAffect.Get(index));
                this.listFishAffect.RemoveAt(index);
            }
        }
        electricFish.reoveFishHaveEffect();
    },

    EndLighting(killedFish, bullet) {
        let index = this.GetFishNeighbor(killedFish.node.getPosition(), this.listFishAffect);
        if(index != -1) {
            let bulletLighting = Global.InGameManager.createLightingBullet().getComponent("LightingBullet");
            bulletLighting.Init(killedFish.node.getPosition(), this.listFishAffect.Get(index));
            this.listFishAffect.RemoveAt(index);
        } else {
            this.totalLighting -= 1;
            if(this.totalLighting <= 0) {
                Global.InGameManager.SetValueWinElectric(this.killActor, this.totalRewardElectric, true);
            }
            Global.InGameManager.poolLightingBullet.put(bullet);
        }
        let exist = false;
        for(let i = 0; i < this.listFishDeath.GetCount(); i++) {
            if(killedFish.FishProperties.FishId == this.listFishDeath.Get(i).FishProperties.FishId) {             
                killedFish.reoveFishHaveEffect ();
                this.totalRewardLighting += this.listReward.Get(i);
                this.listFishDeath.RemoveAt(i);
                this.listReward.RemoveAt(i);
                Global.InGameManager.SetValueWinElectric(this.killActor, this.totalRewardLighting, false);
                exist = true;
                break;
            }
        }
        if(!exist) {
            killedFish.SetLighting();
        }
    },

    GetFishNeighbor(check,list) {
        let min = 10000;
        let index = -1;
        for(let i = 0; i < list.GetCount(); i++) {
            let distance = list.Get(i).node.getPosition().subSelf(check).mag();
            if(distance < min) {
                index = i;
                min = distance;
            }
        }
        return index;
    },

    onLoad() {
        Global.FishingGamePlayEffect = this;
    },

    onDestroy() {
        Global.FishingGamePlayEffect = null;
    },

    
});
