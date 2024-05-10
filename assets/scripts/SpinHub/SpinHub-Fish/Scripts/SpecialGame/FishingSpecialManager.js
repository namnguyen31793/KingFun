var FishingSpecialManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new FishingSpecialManager();
            return this.self;
        }
    },

    ctor() {
       this.wheelView = null;
       this.luckyBoxView = null;
    },

    
    ShowSpecialGame(fishType, accountId, nextInfoTurn,totalReward) {
       
        let actor = require("ActorCollection").getIns().GetActorByPlayerId(accountId);
       
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.WHEEL_TYPE) {
            cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/Wheel', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish","Special/Wheel", (prefab)=>{
                let wheel = cc.instantiate(prefab);
				wheel.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                require("FishingSpecialManager").getIns().wheelView = wheel.getComponent("FishingWheelView");
                let actor = require("ActorCollection").getIns().GetActorByPlayerId(accountId);
                require("FishingSpecialManager").getIns().wheelView.show(actor.actorPropertis.SittingId, nextInfoTurn);
			})
        } else if(fishType == Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE) {
            cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/FishCard', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish","Special/FishCard", (prefab)=>{
                let data = nextInfoTurn.split(',');
                let listCard = [];
                for(let i = 0; i < data.length; i++) {
                    let str = data[i].split('.');
                    listCard[listCard.length] = {
                        type : str[0],
                        heso : str[1],
                    }
                }
                for(let i = 0; i < listCard.length; i++) {
                    let card = cc.instantiate(prefab);
                    card.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                    let fishCard = card.getComponent("FishCardView");
                    fishCard.InitFishCard(listCard[i].type, listCard[i].heso, i, listCard.length, accountId);
                }               
            })
        } else if(fishType == Global.Enum.FISH_TYPE_CONFIG.LUCKY_BOX_TYPE) {
            cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/LuckyBoxWheel', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish","Special/LuckyBoxWheel", (prefab)=>{
                let wheel = cc.instantiate(prefab);
				wheel.parent = Global.InGameManager.luckyBoxWheelContainer;                
                wheel.scale = 0;
                wheel.runAction(cc.scaleTo(0.3, 1).easing(cc.easeBackOut()));
                require("FishingSpecialManager").getIns().luckyBoxView = wheel.getComponent("FishingLuckyBoxView");
                let baseMoney = actor.GetMoneyPerShotByCurrentGunId();
                require("FishingSpecialManager").getIns().luckyBoxView.show(baseMoney, nextInfoTurn);
			})
        } else if(fishType == Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE) {
            actor.scheduleOnce(()=>{
                Global.InGameManager.creatEffectWinElectricFisht(actor, Global.Helper.GetPositionSliceBySittingIdAndMainSitting(actor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)), Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE);
                if(actor.actorPropertis.CurrentGunId < 10) {
                    actor.ChangeGun_SpecialGun(Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID,totalReward);
                }
            } , 1.5);
            
        } else if(fishType == Global.Enum.FISH_TYPE_CONFIG.LAZE_FISH_TYPE) {
            actor.scheduleOnce(()=>{
                Global.InGameManager.creatEffectWinElectricFisht(actor, Global.Helper.GetPositionSliceBySittingIdAndMainSitting(actor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)), Global.Enum.FISH_TYPE_CONFIG.LAZE_FISH_TYPE);
                if(actor.actorPropertis.CurrentGunId < 10) {
                    actor.ChangeGun_SpecialGun(Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID,totalReward);
                }
            } , 1.5);
        } else {
            
         //   actor.On_Attack();
        }
    },

    PlaySpin(actor, reward, result, nextInfoTurnStr, accountBalance, fishType) {
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.LUCKY_BOX_TYPE){
            this.luckyBoxView.PlaySpin(actor, reward, result, nextInfoTurnStr, accountBalance);
        }else if(fishType == Global.Enum.FISH_TYPE_CONFIG.WHEEL_TYPE){
            this.wheelView.PlaySpin(actor, reward, result, nextInfoTurnStr, accountBalance);
        }
    },

});
module.exports = FishingSpecialManager;