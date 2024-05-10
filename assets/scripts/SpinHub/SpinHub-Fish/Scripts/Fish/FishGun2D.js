

cc.Class({
    extends: require("Fish2D"),

    properties: {
        gun : cc.Node,
        animEndName : "",
    },

    Init(properties) {
        this.gun.active = true;
        this._super(properties);
    },

    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {
       let  gunType = 0;
    if(this.FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE)
            gunType = Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID;
    else if(this.FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.LAZE_FISH_TYPE)
            gunType = Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID;

    if(killActor != null) {
        let animGum = cc.instantiate(this.gun);
        animGum.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
        animGum.getComponent(cc.Animation).play(this.animEndName);
        let posWorld = this.gun.parent.convertToWorldSpaceAR(this.gun);
        let posInGameView = Global.InGameManager.FishPoolInstance.OtherContainer.convertToNodeSpaceAR(posWorld);
        animGum.setPosition(posInGameView);
        animGum.runAction(cc.sequence(cc.moveTo(0.15, posInGameView.x, posInGameView.y+30), cc.moveTo(0.15, posInGameView.x, posInGameView.y), cc.moveTo(0.15, posInGameView.x, posInGameView.y+20), 
            cc.moveTo(0.15, posInGameView.x, posInGameView.y), cc.moveTo(0.15, posInGameView.x, posInGameView.y+10), cc.moveTo(0.15, posInGameView.x, posInGameView.y), cc.delayTime(0.3), 
            cc.moveTo(0.3, killActor.gun.node.getPosition()), cc.callFunc(() => {      
                killActor.ChangeGun_SpecialGun(gunType,fishValue);
                Global.InGameManager.creatEffectWinElectricFisht(killActor, Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)), this.FishProperties.FishType);         
                animGum.destroy();
            })));
        this.gun.active = false;
    }
    },

   
    
});
