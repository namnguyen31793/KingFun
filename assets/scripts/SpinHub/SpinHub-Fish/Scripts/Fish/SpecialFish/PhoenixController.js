// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        HitComponent : cc.Node,
        PheonixDashComponent : cc.Node,
        HitLabel : require("TextJackpot"), 
        BoomEffect: cc.Node,
        CoinFly_Particle: cc.Node,
        Phoenix_Fish: cc.Node,
        PhoenixVoiceSoundEffect: {
            default: null,
            type: cc.AudioClip,      
        },
        PhoenixExploreSoundEffect: {
            default: null,
            type: cc.AudioClip,      
        },
        PhoenixCountHitSoundEffect: {
            default: null,
            type: cc.AudioClip,      
        },
    },

   
  
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
      
        this.HitLabel.reset();
        this.HitComponent.active = true;   
        this.BoomEffect.active = false;
        this.BoomEffect_sprite = this.BoomEffect.getComponent("sp.Skeleton");
        this.CoinFly_Particle.active = false;
        this.CoinFly_particleSystem = this.CoinFly_Particle.getComponent(cc.ParticleSystem);
        this.Phoenix_Fish.getComponent(cc.BoxCollider).enabled = false ;
     },

    show () {
       
        Global.InGameView.OffAuto();
    },


    Init_ShowPhoenix_MultiReward(matrixCombo , totalReward,killActor)
    {
        this.TweenMovePhoenixComponent(matrixCombo,totalReward,killActor);
    },


    TweenMovePhoenixComponent(matrixCombo,totalReward,killActor)
    {
       

        var matrixStr = matrixCombo.split(",");
        this.matrix = [];
       // console.log("TweenMovePhoenixComponent: " + matrixStr);
        for (var i = 0; i < matrixStr.length; i++) {
            this.matrix[i] = parseInt(matrixStr[i]);
           
        }
        
        cc.audioEngine.playEffect(this.PhoenixVoiceSoundEffect, false);

        let count = 0;
        let comboTime = this.matrix.length;
        let self = this;
        self.schedule(
            self.callback = function () {

               if(count < comboTime)
               {
                let playTime = 1;
                self.PheonixDashComponent.setPosition(cc.v2(-1800 , 0));  
                cc.tween(self.PheonixDashComponent).to(playTime,{ position: cc.v2(1600, 0)}).start();

                self.scheduleOnce(()=>{
                        
                    cc.tween(self.HitComponent).by(0.05,{ scale:0.4}).by(0.02,{ scale:-0.2}).start();
                    self.HitComponent.active = true;
                    self.HitLabel.active = true;
                    let newMulti = self.matrix[count-1];                                        
                    self.HitLabel.StartIncreaseTo(newMulti);
                    self.BoomEffect.active = true;
                    self.BoomEffect_sprite.setAnimation(0,'animation',false);
                    self.CoinFly_Particle.active = true;
                    self.CoinFly_particleSystem.resetSystem();   
                    cc.audioEngine.playEffect(self.PhoenixExploreSoundEffect, false);     
                    cc.audioEngine.playEffect(self.PhoenixCountHitSoundEffect, false);  
                    
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
        
                } , playTime + 1);
                   
               }
               else
               {
                self.PheonixDashComponent.active = false;
                self.HitComponent.active = false;
              
                cc.resources.load('SpinHub-Fish/Prefabs/Fish3/ResultPhoenixPanel', cc.Prefab, function (err, prefab) {      
                //Global.DownloadManager.LoadPrefab("Fish3","ResultPhoenixPanel", (prefab)=>{
                    try{
                        if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                    let node = cc.instantiate(prefab);
                    node.parent = Global.InGameManager.luckyBoxWheelContainer;  
                    node.setSiblingIndex(node.parent.children.length-1);
                    node.setPosition(cc.v2(0,0));
                    node.active = false;                             
                    node.getComponent("ResultPhoenixFish"). Init(totalReward,killActor);
                    self.node.active = false;
                    }
                    catch(e)
                    {
                        cc.log("ERROR: "+e);
                        self.node.active = false;
                    }
                });
               
               }
                count++;    
            }
        ,4,(comboTime));

    },

     onDestroy(){
       
        Global.PhoenixController = null;
	},

    // update (dt) {},
   

});
