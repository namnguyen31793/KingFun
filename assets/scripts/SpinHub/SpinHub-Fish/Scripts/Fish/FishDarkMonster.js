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
      
        let self = this;
        cc.resources.load('SpinHub-Fish/Prefabs/Fish3/DarkMonsterComming', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish3","DarkMonsterComming", (prefab)=>{
          
            try
            {
               
            if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                return;
            let DarkMonsterComming = cc.instantiate(prefab);
            DarkMonsterComming.parent = Global.InGameManager.luckyBoxWheelContainer;  
            DarkMonsterComming.setSiblingIndex(DarkMonsterComming.parent.children.length-1);
            DarkMonsterComming.setPosition(cc.v2(0,0));    
            DarkMonsterComming.active = true;
            
            let ani = DarkMonsterComming.getComponent(cc.Animation);
            let callBack = ()=>{
          
             ani.off("finished" , callBack);

             self.scheduleOnce(()=>{
                DarkMonsterComming.active = false;
                DarkMonsterComming.destroy();
            },4);

           
            }
            ani.on("finished" ,callBack );
            ani.play("DarkMonsterComming");
        
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        
          });
        //  DarkMonsterComming

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

    /*
    reoveFishHaveEffect(fishValue, killActor,rewardDescription){

        for(let i = 0 ; i < this.listColider.length ; i++){
            this.listColider[i].enabled = false;
        }
       this.inRun = false;
        this.isDie = true;
        this.SetSpeedAnimationByMove(5);
       
        let anim = this.node.getComponent(cc.Animation);
        let pos = this.node.getPosition();
        if(this.velocityBullet != null) {
            pos.x += this.velocityBullet.x / 15; 
            pos.y += this.velocityBullet.y / 15; 
            this.node.runAction(cc.moveTo(0.4,pos));
        }
        if(this.mar != null)
            this.node.eulerAngles = cc.v3(this.node.eulerAngles.x, 90, 0);
        if(anim != null) {
            let action = cc.callFunc(()=>{
                this.SetSpeedAnimationByMove(0);
                this.playAnimDie = true;
                anim.play();
                
            });
            this.node.runAction(cc.sequence(cc.delayTime(1.2), action));
        }
        else {
            this.SetSpeedAnimationByMove(8);
            this.node.runAction(cc.fadeOut(1.2));
        }


        if(killActor.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) {
        Global.DownloadManager.LoadPrefab("Fish3","DarkMonster_BigwinPanel", (prefab)=>{
            let node = cc.instantiate(prefab);
            node.parent = Global.InGameManager.luckyBoxWheelContainer;  
            node.setSiblingIndex(node.parent.children.length-1);   
            node.setPosition(cc.v2(0,0));    
            node.active = true;
            let fishRewardDescription = JSON.parse(rewardDescription).Description_String;   
            node.getComponent("DarkMonsterController").Init_MultiReward(this.node.getPosition(),fishRewardDescription,fishValue,killActor);
           
           
        });
        }  
        
        this.scheduleOnce(()=>{
            this.reoveFishNoEffect();
        }, 2.1);
    },
    */

    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {          
        //Global.InGameView.OnBlockClick();       
        let self = this;
        cc.resources.load('SpinHub-Fish/Prefabs/Fish3/DarkMonster_BigwinPanel', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish3","DarkMonster_BigwinPanel", (prefab)=>{
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
                node.getComponent("DarkMonsterController").Init_MultiReward(self.node.getPosition(),fishRewardDescription,fishValue,killActor);     
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
              
    },

    
});
