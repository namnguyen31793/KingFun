var RoadProperties2D = require ("RoadProperties2D");

cc.Class({
    extends: require("FishSpine"),

    ctor() {
        this.countMove = 0;
        
    },


 

    Init(properties) {
        this._super(properties);
        this.countMove = 0;
        this.eventConfig = require ("PathStore").getIns().getEventConfig(require("ScreenManager").getIns().roomType.toString());
        this.inRun = false;
        this.node.setPosition(cc.v2(0,0));
     
        Global.InGameManager.creatEffectStartBlackDragon(0);

    
        this.BlackDragon_sprite = this.node.getChildByName("New Node").getChildByName("BlackDragon_spine").getComponent("sp.Skeleton");
        this.BlackDragon_sprite.setAnimation(0,'SWIM',false);
        
												  
			  
        this.schedule(() => {            
           
                this.UpdateStartPosition();
        }, 20);
        this.swinTime = 0;
        
    },

    UpdateStartPosition()
    {
        if(this.isDie)
            return;
       let randomValue = Global.RandomNumber(0,100);
	   this.BlackDragon_sprite.timeScale = 1;
     
       if(randomValue < 30)
       {
        this.node.setPosition(cc.v2(0,0));
        this.node.angle  = 0;
        this.node.setScale(cc.v2(1,1));
       
       }
       else if(randomValue < 50)
       {
         this.node.setPosition(cc.v2(-50,300));
         this.node.angle  = 80;
         this.node.setScale(cc.v2(1,1));
       }
       else if(randomValue < 70)
       {
         this.node.setPosition(cc.v2(-150,-500));
         this.node.angle  = 30;
         this.node.setScale(cc.v2(-1,1));
       }  
       else
       {
        this.node.setPosition(cc.v2(660,-100));
        this.node.angle  = -40;
        this.node.setScale(cc.v2(1,1));
       }

       this.BlackDragon_sprite.setAnimation(0,'SWIM',false);

       this.swinTime = this.swinTime + 1;
    
       if(this.swinTime >= 7)
       {      
                Global.ServerBot.ServerKillFish(this.FishProperties.FishId);
                this.reoveFishNoEffect();
       }      
    },

    UpdatePositionByTime(currentTime)
    {
        if(this.isDie)
            return;
        let  indexRoad = 0;
        if(currentTime >= this.totalDuration) {
            this.countMove += 1;
            if(this.countMove >= this.eventConfig.turn) {
                Global.ServerBot.ServerKillFish(this.FishProperties.FishId);
                this.reoveFishNoEffect();
            }
            this.currentMoveTime -= this.totalDuration;
            currentTime = this.currentMoveTime;
            let pathId = Global.ServerBot.moduleCreateFish.CreateRandomPathIdBigFish();
            this.SetupNewRoad(pathId);
        }
        return cc.v2(0,0);
    
    },

    SetupNewRoad(id) {
        this.FishProperties.PathId = id;
        this.roadPropertiesList.length = 0;
        let roadProperties = new RoadProperties2D();
        roadProperties.Setup(this, id, this.FishProperties.FishSpeed, this.FishProperties.Radius, this.vectorDireciton, 
            this.FishProperties.FishType, this.FishProperties.NumberOfGroup);
        this.roadPropertiesList.push(roadProperties);
    },

    Handle_AnimationDeathFish(fishValue, killActor,rewardDescription)
    {
     
        this.BlackDragon_sprite.pause = true;
        this.BlackDragon_sprite.timeScale = 0;
        this.scheduleOnce(()=>{    
            this.BlackDragon_sprite.pause = false;
            this.BlackDragon_sprite.timeScale = 3;
            this.BlackDragon_sprite.setAnimation(0,'CATCH',false);
          } , 1.5);  
        
    },
    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {          
        Global.InGameView.OnBlockClick();       
        
     
        this.scheduleOnce(()=>{       
            Global.InGameView.OffBlockClick();       
            Global.InGameManager.shakeScrenn(2);                
                this.node.active = false;     
                /* 
                if(killActor.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) 
                {
                */
                    cc.resources.load('SpinHub-Fish/Prefabs/Fish3/BlackDragon_BigWinShow', cc.Prefab, function (err, prefab) {      
                    //Global.DownloadManager.LoadPrefab("Fish3", "BlackDragon_BigWinShow", function (prefab) {
                    try
                    {
                    if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                        return;
                    var node = cc.instantiate(prefab);
                    node.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                    node.setPosition(cc.v2(0, 0));
                    node.active = true;
                    
              

                    let tempMatrix = JSON.parse(rewardDescription).Description_String;   
                    let totalReward = fishValue;		
             
                    node.getComponent("BlackDragonController").Init_ShowBlackDragon_MultiReward(tempMatrix , totalReward,killActor);
                    }
                    catch(e)
                    {
                        cc.log("ERROR: "+e);
                    }
                   
                  });
                  /*
                  }
                  else
                  {
                      Global.DownloadManager.LoadPrefab("Fish","Special/NotifyBlackDragonReward", (prefab)=>{
                        try
                        {
                        if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                            return;
                          let notify = cc.instantiate(prefab);
                        //  killActor.playing_Icon.active = true;
                          notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                          notify.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));
      
                          let money = notify.getChildByName("WinLabelEnd").getComponent(cc.Label);
                          money.string = "";
                          notify.scale = 1;
                          let time = 8;
                          killActor.scheduleOnce(()=>{                     
                              money.getComponent("LbMonneyChange")._currentMonney = 0;
                              money.getComponent("LbMonneyChange").time = 2;
                              money.getComponent("LbMonneyChange").setMoney(fishValue);                     
                          } , time);
                          //sau 7s thì bot tự chơi tiếp
                          killActor.scheduleOnce(()=>{
                              notify.destroy();    
                              //tắt thông báo đang chơi
                           //   killActor.playing_Icon.active = false;
                              //update lại tiền, hiện score
                              killActor.UpdateBalance(fishValue, true);
                              killActor.On_Attack();
                              //killActor.isCountTime = true;
                          } , time+3);
                            }
                            catch(e)
                            {
                                cc.log("ERROR: "+e);
                                
                            }
                      });
                  }
                  */
               
      } , 0.5);     
        
    },
});
