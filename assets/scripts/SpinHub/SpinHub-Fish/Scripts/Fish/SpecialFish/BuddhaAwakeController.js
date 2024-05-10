// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Buddha_Awaken : cc.Node,
        Buddha_Awaken_Animation_Object :cc.Node,
        Buddha_BetIcon: cc.Node,
        Buddha_AccumulatedBoard: cc.Node,
        Buddha_CarpBoard: cc.Node,
        Buddha_DragonBoard : cc.Node,
        MoneyResult_Panel: cc.Node,
        bgMark : cc.Node,
        CloudPanel : cc.Node,
        CloudMove : cc.Node,
        Coin_Animation_Object : cc.Node,
        CoinJump : cc.AudioClip,
        CarpLaughVoice  : cc.AudioClip,
        DragonLaughVoice : cc.AudioClip,
    },

   
  
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
  
      //  this.Buddha_Awaken_Animation = this.Buddha_Awaken_Animation.getComponent(cc.Animation);
       this.Buddha_Awaken_Object_Ske = this.Buddha_Awaken_Animation_Object.getComponent("sp.Skeleton");
       this.Buddha_BetIcon_Label = this.Buddha_BetIcon.getChildByName("Bet_Label").getComponent(cc.Label);
       this.Accumulate_Label =  this.Buddha_AccumulatedBoard.getChildByName("Accumulate_Label").getComponent("TextJackpot");
       this.Accumulate_Label.reset();
       this.CarpBoard_Label =  this.Buddha_CarpBoard.getChildByName("CarpBoard_Label").getComponent("TextJackpot");
       this.CarpBoard_Label.reset();
       this.DragonBoard_Label =  this.Buddha_DragonBoard.getChildByName("DragonBoard_Label").getComponent(cc.Label);
       this.CloudPanel.opacity = 0;
       this.Coin_Animation_Object.active = false;
       this.Coin_Animation_Spine = this.Coin_Animation_Object.getComponent("sp.Skeleton");
       

     },

    start () {
       

    },

    show()
    {
        Global.InGameView.OffAuto();
    },




    Init_ShowBuddha_MultiReward(matrixCombo , totalReward,killActor)
    {
      this.killActor = killActor;
      this.totalReward = totalReward;
        this.bgMark.opacity = 0;     
        cc.tween(this.bgMark)            
            .to(1, { opacity: 150 })         
            .start();

        this.CloudPanel.opacity = 0;
         cc.tween(this.CloudPanel)            
            .to(3, { opacity: 255 })         
            .start();

        killActor.Off_Attack();

        let rewardCombo = JSON.parse(matrixCombo);
       this.RewardComboDescription = rewardCombo.TichLuy_RewardDescription;
       this.hitCombo = rewardCombo.HitMulti;
       this.killGunPrice = rewardCombo.GunPrice;
       this.basicReward = this.hitCombo*this.killGunPrice;
       this.Animation_ShowBuddha_StartAnimation();
       this.Buddha_BetIcon_Label.string =  this.killGunPrice;
       this.dragonCombo = 1;

       this.rewardList = this.RewardComboDescription.split(';');
     

       this.loopIndex = 0;
      
     
      
    },

    LoopAction()
    {    
       
        this.delayTime = 0;
        if( this.loopIndex >= (this.rewardList.length-1))
        {
              
                this.Animation_ShowBuddha_EndAnimation();
                return;
        }
        let rewardItem = this.rewardList[this.loopIndex];
        let itemArray = rewardItem.split("-");
        let rewardType =  parseInt(itemArray[0]);
        let carpMulti =  parseInt(itemArray[1]);
        if(rewardType == 1) // coinType
        {
          
            this.Animation_ShowBuddha_CoinAnimation(this.rewardList[this.loopIndex]);
        }
        else if (rewardType == 2) // carpType
        {
           
            this.Animation_ShowBuddha_CarpAnimation(this.rewardList[this.loopIndex]);
        }else if (rewardType == 3) // dragonType
        {
          
            this.Animation_ShowBuddha_GoldenDragonAnimation(this.rewardList[this.loopIndex]);
        }
    },


    Animation_ShowBuddha_StartAnimation()
    {

                      
        let timeStart = 0.8;
        this.Buddha_BetIcon.active = true;
        this.Buddha_AccumulatedBoard.active = true;
        
        this.Buddha_DragonBoard.setPosition(cc.v2(110, -160));
        this.Buddha_DragonBoard.active = false;
        this.Buddha_CarpBoard.setPosition(cc.v2(0, -170));
      
        this.MoneyResult_Panel.setPosition(cc.v2(0, 0));
       

        this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha01_Pray',false);

        this.Buddha_Awaken_Animation_Object.setScale(cc.v2(0.3,0.3));       
        cc.tween(this.Buddha_Awaken_Animation_Object).to(timeStart,{ scale:1}).start();

        this.scheduleOnce(()=>{
            this.Accumulate_Label.StartIncreaseTo(this.hitCombo);
        },1.3);
        this.scheduleOnce(()=>{
            this.CarpBoard_Label.StartIncreaseTo(this.basicReward);
            cc.audioEngine.playEffect(this.CoinJump, false);
        },2.3);

        timeStart += 0.4;
        let positionTime = 0.1;
         timeStart = timeStart + 3*(positionTime);

        this.delayTime = 4;
        this.scheduleOnce(()=>{
            this.Buddha_BetIcon.active = false;
            this.Buddha_AccumulatedBoard.active = false;
          
           
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha03_LuckyBagAppear',false);
            
        },this.delayTime);
        this.delayTime += 1.5;

        this.scheduleOnce(()=>{
            this.Buddha_DragonBoard.active = true;
            cc.tween(this.Buddha_DragonBoard).to(0.5,{ position: cc.v2(110, -160)}).start();
            cc.tween(this.Buddha_CarpBoard).to(0.5,{ position: cc.v2(-150, -170)}).start();
        },this.delayTime)
        
        this.delayTime += 1;
        this.scheduleOnce(()=>{
                 this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha04_DanceLoop',false);      
        },  this.delayTime);

        this.delayTime += 1.8;
        this.scheduleOnce(()=>{
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha05_ReadyToDig',false);             
        },this.delayTime);

        this.scheduleOnce(()=>{           
            this.LoopAction();
        },this.delayTime+0.4);

       
    },
    Animation_ShowBuddha_CarpAnimation(carpRewardDescriptionItem,isReadyToDig = true)
    {
        var carpItemArray = carpRewardDescriptionItem.split("-");
        
        let rewardType =  parseInt(carpItemArray[0]);
        let carpMulti =  parseInt(carpItemArray[1]);

        let bonusValue = carpMulti * this.killGunPrice;
        this.basicReward += bonusValue;

        this.delayTime += 0.5;
        this.scheduleOnce(()=>{
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha06_DigLoop',false);      
        },this.delayTime)
        this.delayTime += 0.5;
        this.scheduleOnce(()=>{                   
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha08_Carp',false);   
            cc.audioEngine.playEffect(this.CarpLaughVoice, false);       
        },this.delayTime);


        this.scheduleOnce(()=>{                   
            cc.tween(this.Buddha_CarpBoard).by(0.1,{ scale:0.5}).by(0.1,{ scale:-0.5}).start(); 
            this.CarpBoard_Label.StartIncreaseTo(this.basicReward);     
            cc.audioEngine.playEffect(this.CoinJump, false);
        },this.delayTime + 1.55);

        
        this.delayTime += 2.3;
      
        if(isReadyToDig)
        {
        
        this.scheduleOnce(()=>{
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha05_ReadyToDig',false);      
        },this.delayTime);
        this.delayTime += 0.5;
        }

        this.scheduleOnce(()=>{
            ++this.loopIndex;
            this.LoopAction();
        },this.delayTime+0.4);


    },

    Animation_ShowBuddha_GoldenDragonAnimation(dragonRewardDescriptionItem,isReadyToDig = true)
    {
      
        let dragonItemArray = dragonRewardDescriptionItem.split("-");
        
        let rewardType =  parseInt(dragonItemArray[0]);
        let carpMulti =  parseInt(dragonItemArray[1]);
        ++this.dragonCombo;
        this.scheduleOnce(()=>{
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha06_DigLoop',false);      
        },this.delayTime)
        this.delayTime += 0.5;
        this.scheduleOnce(()=>{                              
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha09_GoldenDragon',false);   
            cc.audioEngine.playEffect(this.DragonLaughVoice, false);                                
        },this.delayTime);
        this.delayTime += 2.1;

        this.scheduleOnce(()=>{                              
            this.DragonBoard_Label.string =  "X"+this.dragonCombo;
            cc.tween(this.Buddha_DragonBoard).by(0.1,{ scale:0.5}).by(0.1,{ scale:-0.5}).start();
        },this.delayTime-0.2);
       

        if(isReadyToDig)
        {
      
        this.scheduleOnce(()=>{
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha05_ReadyToDig',false);      
        },this.delayTime);
        this.delayTime += 0.5;
        }
        this.scheduleOnce(()=>{
            ++this.loopIndex;
            this.LoopAction();
        },this.delayTime+0.4);

    },

    Animation_ShowBuddha_CoinAnimation(coinRewardDescriptionItem,isReadyToDig = true)
    {
        let coinItemArray = coinRewardDescriptionItem.split("-");
        
        let rewardType =  parseInt(coinItemArray[0]);
        let carpMulti =  parseInt(coinItemArray[1]);
        
      
        this.scheduleOnce(()=>{
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha06_DigLoop',false);      
        },this.delayTime)
        this.delayTime += 0.5;
        this.scheduleOnce(()=>{                   
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha11_Coin',false);     
            this.Coin_Animation_Object.active = true;
            this.Coin_Animation_Spine.setAnimation(0,'active',false);      
        },this.delayTime)

        this.scheduleOnce(()=>{                           
            cc.tween(this.Buddha_CarpBoard).by(0.1,{ scale:0.5}).by(0.1,{ scale:-0.5}).start();      
             let bonusValue = carpMulti * this.killGunPrice;
             this.basicReward += bonusValue; 
           //  console.log("this.CarpBoard_Label.StartIncreaseTo: "+ this.basicReward);
            this.CarpBoard_Label.StartIncreaseTo(this.basicReward);     
            cc.audioEngine.playEffect(this.CoinJump, false);
        },this.delayTime + 0.5);

        
        this.delayTime += 1;
        this.scheduleOnce(()=>{                            
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha07_DigOut_02',false);                  
        },this.delayTime);
        this.delayTime += 0.8;
        if(isReadyToDig)
        {
        
        this.scheduleOnce(()=>{
            this.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha05_ReadyToDig',false);      
        },this.delayTime);
        this.delayTime += 0.5;
        }
        this.scheduleOnce(()=>{
            ++this.loopIndex;
            this.LoopAction();
        },this.delayTime+0.4);

    },

    Animation_ShowBuddha_EndAnimation()
    {
       let self = this;
       this.scheduleOnce(()=>{
        self.Buddha_Awaken_Object_Ske.setAnimation(0,'Buddha01_Pray',false);      
        },self.delayTime);
        self.delayTime += 1;

        this.scheduleOnce(()=>{
            
            cc.tween(self.Buddha_DragonBoard).to(0.2,{ position: cc.v2(80, -160)}).start();
            cc.tween(self.Buddha_CarpBoard).to(0.2,{ position: cc.v2(-60, -170)}).start();
           
        },this.delayTime);
        this.delayTime += 1;
        this.scheduleOnce(()=>{          
            cc.tween(self.MoneyResult_Panel).to(0.2,{ position: cc.v2(0, 50)}).start();     
            self.basicReward = self.basicReward * self.dragonCombo;
            self.CarpBoard_Label.StartIncreaseTo(self.basicReward);      
          
        },this.delayTime);

        this.scheduleOnce(()=>{      
            
            cc.resources.load('SpinHub-Fish/Prefabs/Fish3/ResultBuddhaPanel', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish3","ResultBuddhaPanel", (prefab)=>{
                try{
              
                    if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                let node = cc.instantiate(prefab);
                node.parent = Global.InGameManager.luckyBoxWheelContainer;  
                node.setSiblingIndex(node.parent.children.length-1);
                node.setPosition(cc.v2(0,0));
                node.active = false;                             
                node.getComponent("ResultBuddhaFish"). Init(self.basicReward,self.killActor,self.node);
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                    self.node.active = false;
                }
            });
            // this.node,active = false;
            

        },this.delayTime+3);

    },


     onDestroy(){
       
        Global.BuddhaAwakeController = null;
	},

    // update (dt) {},
   

});
