// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        BetIcon : cc.Node,
        LionDance_1: cc.Node,
        LionDance_2: cc.Node,
        ColorBoard_Ske: cc.Node,
        RewardBoard_Label :  require("TextJackpot"), 
        RewardBoard: cc.Node,
        FireWork: cc.Node,
        StartRewardEffect: {
            default: null,
            type: cc.AudioClip,      
        },
       
    },

      
  
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
     },

    start () {
       

    },

    show()
    {
        Global.InGameView.OffAuto();
    },




    Init_ShowLionDance_MultiReward(matrixCombo , totalReward,killActor)
    {
        this.Bet_Label = this.BetIcon.getComponent(cc.Label);
        this.HitLabel = this.RewardBoard_Label.node.getComponent(cc.Label);

        this.killActor = killActor;
        this.killActor.Off_Attack();
        this.totalReward = totalReward;
        let rewardCombo = JSON.parse(matrixCombo);
        this.RewardComboDescription = rewardCombo.TichLuy_RewardDescription;
        this.killGunPrice = rewardCombo.GunPrice;
        this.Bet_Label.string = this.killGunPrice;
        this.hitCombo = rewardCombo.HitMulti;
        this.HitLabel.string =  this.hitCombo;
        this.FireWork.active = false;
        cc.audioEngine.playEffect(this.StartRewardEffect, false);
        let correctFishType = parseInt(this.RewardComboDescription);
        if(correctFishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_LION_DANCE_LEVEL_1)
        {
            this.LionDance_1.getComponent("sp.Skeleton").setSkin("B");
            this.LionDance_2.getComponent("sp.Skeleton").setSkin("B");
            this.ColorBoard_Ske.getComponent("sp.Skeleton").setSkin("B");  
        }
        else  if(correctFishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_LION_DANCE_LEVEL_2)
        {
            this.LionDance_1.getComponent("sp.Skeleton").setSkin("R");
            this.LionDance_2.getComponent("sp.Skeleton").setSkin("R");
            this.ColorBoard_Ske.getComponent("sp.Skeleton").setSkin("R");
        }
        else  if(correctFishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_LION_DANCE_LEVEL_3)
        {
            this.LionDance_1.getComponent("sp.Skeleton").setSkin("G");
            this.LionDance_2.getComponent("sp.Skeleton").setSkin("G");
            this.ColorBoard_Ske.getComponent("sp.Skeleton").setSkin("G");
        }

       let currentAnimation = this.node.getComponent(cc.Animation);
       //.play("Liondance_ResultAnimation");
        
        let callback = ()=>{
            currentAnimation.off("finished" ,callback );
            this.LionDance_ShowReward();
        }
        currentAnimation.on("finished" ,callback );
        currentAnimation.play("Liondance_ResultAnimation");
        
        
      
    },

    LionDance_ShowReward()
    {
        this.LionDance_1.getComponent("sp.Skeleton").setAnimation(0, 'CATCH', true);
        this.LionDance_2.getComponent("sp.Skeleton").setAnimation(0, 'CATCH2', true);
        this.RewardBoard_Label.reset();
        this.RewardBoard_Label.StartIncreaseTo(this.totalReward);
        this.FireWork.active = true;
        this.FireWork.getComponent("sp.Skeleton").setAnimation(0, 'animation', true);
        Global.InGameManager.InGameSoundManager.playCoinJumpSoundEffect();
        this.scheduleOnce(()=>{
            this.Handle_EndReward();
        },5);    
    },

    Handle_EndReward()
    {
        try
        {
        this.FireWork.active = false;
        let t = cc.tween;
        t(this.RewardBoard)
         .parallel( t().to(1, { scale: 0.5 }), t().to(1, { position: Global.Helper.GetPositionSliceBySittingIdAndMainSitting(this.killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-488,-100)) }) )
         .call(() => {

            this.scheduleOnce(()=>{
                if(this.killActor!= null)
                {
                 this.killActor.On_Attack();
                 this.killActor.UpdateBalance(this.totalReward, true);    
                 this.node.active = false; 
                }
                this.node.destroy();
            },3);    
          
        })
        .start();
        }
        catch(e)
        {
            this.node.active = false;
        }
       },




     onDestroy(){
       
       // Global.LionDanceController = null;
	},

    // update (dt) {},
   

});
