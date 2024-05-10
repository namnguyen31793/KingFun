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
      

        cc.resources.load('SpinHub-Fish/Prefabs/Fish3/PhoenixComming', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish3","PhoenixComming", (prefab)=>{
            
            try
            {
            if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                return;
            let PhoenixComming = cc.instantiate(prefab);
            PhoenixComming.parent = Global.InGameManager.luckyBoxWheelContainer;  
            PhoenixComming.setSiblingIndex(PhoenixComming.parent.children.length-1);
            PhoenixComming.setPosition(cc.v2(0,0));    
            PhoenixComming.active = true;
            
            let ani = PhoenixComming.getComponent(cc.Animation);
            let callBack = ()=>{
          
             ani.off("finished" , callBack);

           
             PhoenixComming.active = false;
             PhoenixComming.destroy();
          

           
            }
            ani.on("finished" ,callBack );
            ani.play("PhoenixComming");
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
          });

    },

    UpdatePositionByTime(currentTime)
    {
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
        
        let obj = this.roadPropertiesList[indexRoad].UpdatePosByTime(currentTime, this.baseSpeed);
        this.SetSpeedAnimationByMove(obj.speedAniFish);
        return obj.newPosition;
    },

    SetupNewRoad(id) {
        this.FishProperties.PathId = id;
        this.roadPropertiesList.length = 0;
        let roadProperties = new RoadProperties2D();
        roadProperties.Setup(this, id, this.FishProperties.FishSpeed, this.FishProperties.Radius, this.vectorDireciton, 
            this.FishProperties.FishType, this.FishProperties.NumberOfGroup);
        this.roadPropertiesList.push(roadProperties);
    },

    Handle_LogicDeathFish(fishValue, killActor,rewardDescription){
       
       // if(killActor.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) {
   
       cc.resources.load('SpinHub-Fish/Prefabs/Fish3/PhoenixRewardPanel', cc.Prefab, function (err, prefab) {      
        // Global.DownloadManager.LoadPrefab("Fish3","PhoenixRewardPanel", (prefab)=>{
            try
            {
            if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                return;
            let node = cc.instantiate(prefab);
            node.parent = Global.InGameManager.luckyBoxWheelContainer;  
            node.setSiblingIndex(node.parent.children.length-1);   
            node.setPosition(cc.v2(0,0));    
            node.active = true;
            let fishRewardDescription = JSON.parse(rewardDescription).Description_String;   
            node.getComponent("PhoenixController").Init_ShowPhoenix_MultiReward(fishRewardDescription,fishValue,killActor);    
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
            cc.resources.load('SpinHub-Fish/Prefabs/Fish3/NotifyPhoenixFishReward', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish3","NotifyPhoenixFishReward", (prefab)=>{
                try{
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                let notify = cc.instantiate(prefab);
                notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                notify.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));

                let money = notify.getChildByName("WinLabelEnd").getComponent(cc.Label);
                money.string = "";
                notify.scale = 1;
                let time = 7;
                killActor.scheduleOnce(()=>{                     
                    money.getComponent("LbMonneyChange")._currentMonney = 0;
                    money.getComponent("LbMonneyChange").time = 2;
                    money.getComponent("LbMonneyChange").setMoney(fishValue);                     
                } , time);
                //sau 7s thì bot tự chơi tiếp
                killActor.scheduleOnce(()=>{
                    notify.destroy();
                    //tắt thông báo đang chơi
            //        killActor.playing_Icon.active = false;
                    //update lại tiền, hiện score
                    killActor.UpdateBalance(fishValue, true);
                    killActor.On_Attack();
                   // m_ActorBot.isCountTime = true;
                } , time+3);
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        }  
        */
        
      
    },
    Handle_CullingMask()
    {
        return;
    }
    
});
