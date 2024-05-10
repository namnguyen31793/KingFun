// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        BlackDragon_1 : cc.Node,
        BlackDragon_2 : cc.Node,
        EffectThunder : cc.Node,
        DragonTotem : cc.Node,
        ComboSpite : cc.Node,
        Combo_Label: cc.Node,
        X_Label:  cc.Node,
        Multi_Label : require("TextJackpot"),
        CoinFly_Particle: cc.Node,
        BlowDragonSoundEffect: {
            default: null,
            type: cc.AudioClip,      
        },
        ThundersoundEffect: {
            default: null,
            type: cc.AudioClip,      
        },
    },

   
  
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
    
     },

    show () {
        Global.InGameView.OffAuto();
    
    },

    Setup()
    {
   
        this.current = this;
        this.BlackDragon_1_sprite = this.BlackDragon_1.getChildByName("New Node").getChildByName("BlackDragon_spine").getComponent("sp.Skeleton");
        this.BlackDragon_2_sprite = this.BlackDragon_2.getChildByName("New Node").getChildByName("BlackDragon_spine").getComponent("sp.Skeleton");
        this.EffectThunder_Animation = this.EffectThunder.getComponent(cc.Animation);   
        this.BlackDragon_1.active = false;
        this.BlackDragon_2.active = false;
        this.EffectThunder.active = false;
        this.DragonTotem.active = false;
        this.ComboSpite.active = false;
        this.Combo_Label.active = false;
        this.Multi_Label.active = false;
        this.CoinFly_Particle.active = false;
        this.X_Label.active = false;
        this.Multi_Label.reset();
        this.CoinFly_particleSystem = this.CoinFly_Particle.getComponent(cc.ParticleSystem);
    },

    

    // update (dt) {},
    Init_ShowBlackDragon_MultiReward(matrixCombo , totalReward,killActor)
    {
        this.Setup();
        var matrixStr = matrixCombo.split(",");
        this.matrix = [];
     
        for (var i = 0; i < matrixStr.length; i++) {
            this.matrix[i] = parseInt(matrixStr[i]);
           
        }

                                  
                this.DragonTotem.active = true;
                this.DragonTotem.setPosition(cc.v2(0, 600));
                this.DragonTotem.setScale(cc.v2(1,1));
                this.Multi_Label.node.setScale(cc.v2(1,1));
                var  DragonTotem_Animation = this.DragonTotem.getComponent(cc.Animation);
                DragonTotem_Animation.play();
                cc.tween(this.DragonTotem).to(1,{ position: cc.v2(0, 0)}).start();
                
            
                this.count = 1;
                this.schedule(
                     this.callback = function () {
                         
                      
                        
                        if (this.count > this.matrix.length) {
         

                         this.scheduleOnce(()=>{
                            
                            DragonTotem_Animation.stop();
                            this.DragonTotem.active = false;
                            this.Multi_Label.reset();
                            this.X_Label.active = true;
                            this.Combo_Label.getComponent(cc.Label).string = '';
                            this.node.active = false;    
                          
                            cc.resources.load('SpinHub-Fish/Prefabs/Fish3/ResultBlackDragon', cc.Prefab, function (err, prefab) {      
                            //Global.DownloadManager.LoadPrefab("Fish3", "ResultBlackDragon", (prefab)=>{
                                try{
                                    if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                                    return;
                                let node = cc.instantiate(prefab);
                                node.parent = Global.InGameManager.luckyBoxWheelContainer; 
                                node.setPosition(cc.v2(0,0));
                                node.active = false;                                                         
                                node.getComponent("ResultBlackDragon"). Init(totalReward,killActor);
                                }
                                catch(e)
                                {
                                    cc.log("ERROR: "+e);
                                    this.node.active = false;
                                }
                            });                       
                         },5);

                        }
                        else
                        {
                        this.ShowComboEffect();
                       let newMulti = this.matrix[this.count-1];
                        this.scheduleOnce(()=>{
                            this.ShowCombo(this.count,newMulti);
                        },2.5);
                        }
                        this.count++;
                        }                      
                    ,3,this.matrix.length);
                    
             
               
    },

    ShowComboEffect()
    { 
       var intime = 1;
       cc.audioEngine.playEffect(this.BlowDragonSoundEffect, false);
        this.scheduleOnce(()=>{
          
            this.BlackDragon_1.active = true;
            
           
            this.BlackDragon_1_sprite.timeScale = 0.5;
            this.BlackDragon_1_sprite.setAnimation(0,'CATCH',false);
            this.scheduleOnce(()=>{
               
                this.BlackDragon_1_sprite.timeScale = 2;
               
            }, intime/3);
           
        }, intime);

        this.scheduleOnce(()=>{
            this.BlackDragon_2.active = true;
           
          
           this.BlackDragon_2_sprite.timeScale = 0.5;
           this.BlackDragon_2_sprite.setAnimation(0,'CATCH',false);
            this.scheduleOnce(()=>{
               
                this.BlackDragon_2_sprite.timeScale = 2;  
              
            }, intime/3);

        }, intime);

        intime = intime + 1.5;
        this.scheduleOnce(()=>{
           
            this.EffectThunder.active = true;                        
            this.EffectThunder_Animation.play('Light');       
            this.CoinFly_Particle.active = true;
            this.CoinFly_particleSystem.resetSystem(); 
            cc.audioEngine.playEffect(this.ThundersoundEffect, false);


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

        }, intime);


          
    },  

    ShowCombo(turnCounter,newMulti)
    {
       
        if(!this.Combo_Label.active)
         this.Combo_Label.active = true;
         this.Combo_Label.getComponent(cc.Label).string = turnCounter-1;
        
        if(!this.ComboSpite.active)
            this.ComboSpite.active = true;
       
        this.Multi_Label.StartIncreaseTo(newMulti);
        this.X_Label.active = true;
        cc.tween(this.Multi_Label.node).by(0.05,{ scale:0.4}).by(0.02,{ scale:-0.3}).start();
    },

    onDestroy(){
       
        Global.BlackDragonController = null;
	},

});
