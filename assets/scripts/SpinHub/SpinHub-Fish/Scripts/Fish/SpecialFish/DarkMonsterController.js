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
        DarkMonsterBall : cc.Node,
        Hit_Label : cc.Label,    
        Money_Label : require("TextJackpot"),
        BoomEffect: cc.Node,
        Title_Img : cc.Node,
        effectBoomBig : cc.Node,
        RewardContent: cc.Node,
    },

    Init (fishValue,killActor) {
        this.RewardContent.active = true;
        this.DarkMonsterBall.active = true;
        this.DarkMonsterBall_Animation = this.DarkMonsterBall.getComponent(cc.Animation);        
        this.Money_Label.active = false;
        this.Money_Label.reset();
       // this.DarkMonsterBall.setPosition(cc.v2(-530,240));
        this.BoomEffect.active = false;
        this.BoomEffect_sprite = this.BoomEffect.getComponent(cc.ParticleSystem);
        this.effectBoomBig.active = false;
        this.Title_Img.setScale(cc.v2(1,1));
        cc.tween(this.Title_Img.node).by(0.05,{ scale:1.5}).by(0.02,{ scale:-0.5}).start();
        
        var matrixStr = this.multiDescription.split(",");
        this.matrix = [];
        for (var i = 0; i < matrixStr.length; i++) {
            this.matrix[i] = parseInt(matrixStr[i]);
           
        }

        this.timeHit = this.matrix.length;
        this.index = 0;
        this.Hit_Label.active = false;
        this.Hit_Label.string = 0;
        this.PlayHitCombo(fishValue,killActor); 
        
    },
   

    show () {
      // Global.InGameView.OffAuto();
     
    },
    Init_MultiReward(startBallPosition,fishRewardDescription,fishValue,killActor)
    {
        this.killFishGunId = killActor.actorPropertis.CurrentGunId;
        this.killFishGunPrice = killActor.GetMoneyPerShotByCurrentGunId();
        this.fishValue = fishValue;
        this.DarkMonsterBall.setPosition(startBallPosition);
        this.multiDescription = fishRewardDescription;
        this.Init(fishValue,killActor);
    },
    creatEffectBoomBig(pos){    
        let efffectBigBoom_Clone = cc.instantiate(this.effectBoomBig);
        this.node.addChild(efffectBigBoom_Clone);
        efffectBigBoom_Clone.active = true;
        efffectBigBoom_Clone.getComponent(cc.ParticleSystem).resetSystem();    
        // node.getComponent(cc.Animation).play();
        efffectBigBoom_Clone.setPosition(pos);
        efffectBigBoom_Clone.runAction(cc.sequence(cc.delayTime(1) , cc.callFunc(()=>{
            efffectBigBoom_Clone.destroy();
        })))
    },

    PlayHitCombo(fishValue,killActor)
    {  

        if(this.hitCombo >= this.timeHit)
        {
            this.BoomEffect.setPosition(this.DarkMonsterBall.getPosition());
            this.DarkMonsterBall.active = false;
            this.BoomEffect.active = true;
            this.BoomEffect_sprite.resetSystem();    

            this.scheduleOnce(()=>{            
                this.Handle_EndReward(fishValue,killActor);       
 
             },2);

            return;
        }
        let multi = this.matrix[this.hitCombo];

      //  let startPosition = this.RandomPosition_Left();
        let endPosition =  this.RandomPosition_Right();

        var animState = this.DarkMonsterBall_Animation.play("DarkMonsterBall_Animation");
        if(this.hitCombo % 2 == 0)
        {
         //   startPosition = this.RandomPosition_Left();
            endPosition = this.RandomPosition_Right();
            this.DarkMonsterBall_Animation.wrapMode = cc.WrapMode.Normal;
        }
        else
        {
        //    startPosition = this.RandomPosition_Right();
            endPosition = this.RandomPosition_Left();
            //this.DarkMonsterBall_Animation.play("DarkMonsterBall_ReverseAnimation");
            this.DarkMonsterBall_Animation.wrapMode = cc.WrapMode.Reverse;
        }

      
        let timePlay =  1.6;
        cc.tween(this.DarkMonsterBall).to(timePlay, { position: endPosition}).start();
        
     
        this.hitCombo++;
        this.scheduleOnce(()=>{
            Global.InGameManager.shakeScrenn(1);   
            this.creatEffectBoomBig(this.DarkMonsterBall.getPosition());  
            let rewardValue =  this.killFishGunPrice * multi;
            this.Money_Label.StartIncreaseTo(rewardValue);   
            this.Hit_Label.active = true;  
            this.Hit_Label.string = this.hitCombo;


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


         },timePlay);

        this.scheduleOnce(()=>{            
               this.PlayHitCombo(fishValue,killActor);       

         },timePlay);
    },
    Handle_EndReward(fishValue,killActor)
    {
      
        let t = cc.tween;
        t(this.RewardContent)
         .parallel( t().to(1, { scale: 0 }), t().to(1, { position: killActor.node.getPosition() }) )
         .call(() => {
           if(killActor!= null)
           {
            killActor.On_Attack();
            killActor.UpdateBalance(fishValue, true);    
            this.node.active = false; 
           }
           this.node.destroy();
        })
        .start();
       },

    RandomPosition_Left()
    {
        let randValue = Global.RandomNumber(0,100);
        if(randValue < 30)
        {
            return cc.v2(-530,240)
        }
        else if(randValue < 60)
        {
            return cc.v2(-370,37)
        }
        else
        {
            return cc.v2(-520,222)
        }
    },
    RandomPosition_Right()
    {
        let randValue = Global.RandomNumber(0,100);
        if(randValue < 30)
        {
            return cc.v2(483,220)
        }
        else if(randValue < 60)
        {
            return cc.v2(560,-64)
        }
        else
        {
            return cc.v2(340,-259)
        }
    },
    
});
