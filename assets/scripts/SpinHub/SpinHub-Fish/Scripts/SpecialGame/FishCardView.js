

cc.Class({
    extends: cc.Component,
    ctor() {
        this.type = 0;
        this.heso = 0;
        this.accountId = 0;
    },

    properties: {
        fishImg : [cc.Node],
        lbHeso : cc.Label,
        anim : sp.Skeleton,
        effect : sp.Skeleton,
    },

    InitFishCard(type, heso, index, total, accountId) {
        this.accountId = accountId;
        for(let i = 0; i < this.fishImg.length; i++) {
            this.fishImg[i].active = false;
        }
        this.lbHeso.node.active = false;
        this.effect.node.active = false;
        let fish = require("FishCollection").getIns().GetFishByType(Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE);
        let pos = cc.v2(0,0);
        if(fish != null) {
            pos = fish.node.getPosition();
        }
        this.type = type;
        this.heso = heso;
        if(type <= 6) {
            this.anim.setAnimation(0,'dong- hien ca',false);
        } else if(type <= 12) {
            this.anim.setAnimation(0,'bac- hien ca',false);
        } else if(type <= 16) {
            this.anim.setAnimation(0,'vang- hien ca',false);
        } else {
            this.anim.setAnimation(0,'mega-hien ca',false);
        }
        this.anim.timeScale = 0;
        this.node.scale = 0.3;
        this.node.setPosition(pos);
        let newPos = cc.v2(Global.RandomNumber(-100,100)+pos.x, Global.RandomNumber(-100,100)+pos.y);
        this.node.runAction(cc.spawn(cc.moveTo(0.3, newPos), cc.rotateTo(0.3, Global.RandomNumber(180,360))));
        let nua = parseInt(total/2);
        let y = 120;
        let x = 0;
        if(index >= nua) {
            y = -120;
            x = this.SetPosX(index-nua, total-nua);
        } else {
            x = this.SetPosX(index, nua);
        }
        this.scheduleOnce(()=>{
            this.node.runAction(cc.spawn(cc.moveTo(0.3, cc.v2(x,y)), cc.rotateTo(0.3, 0), cc.scaleTo(0.3,1)));
        } , 0.8);  
        this.scheduleOnce(()=>{
            if(type <= 6) {
                this.anim.setAnimation(0,'dong- hien ca',false);
            } else if(type <= 12) {
                this.anim.setAnimation(0,'bac- hien ca',false);
            } else if(type <= 16) {
                this.anim.setAnimation(0,'vang- hien ca',false);
            } else {
                this.anim.setAnimation(0,'mega-hien ca',false);
            }
            this.anim.timeScale = 2;
            this.scheduleOnce(()=>{
                if(type <= 16) {
                    this.fishImg[type-1].active = true;
                } else {
                    if(heso == 50)
                        this.fishImg[16].active = true;
                    else if(heso == 75)
                        this.fishImg[17].active = true;
                    else if(heso == 100)
                        this.fishImg[18].active = true;
                    else if(heso == 200)
                        this.fishImg[19].active = true;
                }
            } , 0.6);
            
            this.scheduleOnce(()=>{
                this.lbHeso.node.active = true;
                this.lbHeso.node.parent.scale = 0;
                this.lbHeso.string = Global.Helper.formatNumber(heso * Global.GameLogic.mainActor.GetMoneyPerShotByCurrentGunId());
                this.lbHeso.node.parent.runAction(cc.spawn(cc.scaleTo(0.2,1), cc.callFunc(()=>{ 
                    this.effect.node.active = true;
                    this.effect.setAnimation(0,'active',false);
                })));
            } , 0.6);
            this.scheduleOnce(()=>{
                if(type <= 6) {
                    this.anim.setAnimation(0,'thedong-xuat hien',true);
                } else if(type <= 12) {
                    this.anim.setAnimation(0,'thebac-xuat hien',true);
                } else if(type <= 16) {
                    this.anim.setAnimation(0,'thevang-xuat hien',true);
                } else {
                    this.anim.setAnimation(0,'themega-xuat hien',true);
                }
            } , 0.7);
            
        } , 1.3 + index * 0.6);

        this.scheduleOnce(()=>{
            this.node.runAction(cc.spawn(cc.rotateTo(0.8, 720), cc.scaleTo(0.4, 0.4), cc.fadeOut(0.4)));
        } , 3.3 + total * 0.6 + index * 0.1);
        this.scheduleOnce(()=>{
            if(index == total-1) {
                this.ShowNotifyWin();
            } else {
                this.node.destroy();
            }
        } , 3.7 +total * 0.6 + index * 0.1);
    },

    ShowNotifyWin() {
        let actor = require("ActorCollection").getIns().GetActorByPlayerId(this.accountId);
        if(actor != null) {
            let fishCardView = this;
            cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/NotifyWinCard', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish","Special/NotifyWinCard", (prefab)=>{
                let notify = cc.instantiate(prefab);
                notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                notify.getComponentInChildren("sp.Skeleton").setAnimation(0,'xuat hien thong bao',false);
                fishCardView.scheduleOnce(()=>{
                    fishCardView.scheduleOnce(()=>{
                        notify.children[0].active = true;
                    } , 1);
                    notify.getComponentInChildren("sp.Skeleton").setAnimation(0,'cho dem tien',true);
                    notify.getComponentInChildren("TextJackpot").StartIncreaseTo(actor.cacheReward);
                    fishCardView.scheduleOnce(()=>{
                        notify.children[0].active = false;
                        notify.runAction(cc.spawn(cc.scaleTo(0.4, 0.4), cc.moveTo(0.4,  Global.Helper.GetPositionSliceBySittingIdAndMainSitting(actor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)))));
                    } , 3);
                    fishCardView.scheduleOnce(()=>{
                        actor.CreateScore(actor.cacheReward);
                        actor.AddBalance(actor.cacheReward);
                    } , 3.5);
                    fishCardView.scheduleOnce(()=>{
                        if(fishCardView.accountId == Global.GameLogic.mainActor.actorPropertis.AccountId) {
                            actor.On_Attack();
                        }
                        notify.destroy();
                        fishCardView.node.destroy();
                    } , 5);
                } , 1);
            });
        }
    },

    SetPosX(index, numb) {
        let x = 0;
        if(numb % 2 == 0) {
            x = (numb/2-index) * -180 + 90;
        } else {
            x = (parseInt(numb/2) - index) *-180;
        }
        return x;
    },

    InitBotCard(type, actorPos) {
        for(let i = 0; i < this.fishImg.length; i++) {
            this.fishImg[i].active = false;
        }
        this.lbHeso.node.active = false;
        this.effect.node.active = false;
        let fish = require("FishCollection").getIns().GetFishByType(Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE);
        let pos = cc.v2(0,0);
        if(fish != null) {
            pos = fish.node.getPosition();
        }
        if(type <= 6) {
            this.anim.setAnimation(0,'dong- hien ca',false);
        } else if(type <= 12) {
            this.anim.setAnimation(0,'bac- hien ca',false);
        } else if(type <= 16) {
            this.anim.setAnimation(0,'vang- hien ca',false);
        } else {
            this.anim.setAnimation(0,'mega-hien ca',false);
        }
        this.anim.timeScale = 0;
        this.node.scale = 0.3;
        this.node.setPosition(pos);
        let newPos = cc.v2(Global.RandomNumber(-100,100)+pos.x, Global.RandomNumber(-100,100)+pos.y);
        this.node.runAction(cc.spawn(cc.moveTo(0.3, newPos), cc.rotateTo(0.3, Global.RandomNumber(180,360))));
        this.scheduleOnce(()=>{
            this.node.runAction(cc.spawn(cc.moveTo(0.5, actorPos), cc.rotateTo(0.5, 0)));
        } , 0.8); 
        this.scheduleOnce(()=>{
            this.node.destroy();
        } , 1.3); 
    },
});
