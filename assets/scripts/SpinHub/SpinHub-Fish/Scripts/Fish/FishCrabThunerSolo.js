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

    

    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {       
       let self = this;
        cc.resources.load('SpinHub-Fish/Prefabs/Fish3/CrabThunderSoloController', cc.Prefab, function (err, prefab) {      
        // Global.DownloadManager.LoadPrefab("Fish3","CrabThunderSoloController", (prefab)=>{
                try{
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                let node = cc.instantiate(prefab);
                node.parent = Global.InGameManager.luckyBoxWheelContainer;  
                node.setSiblingIndex(node.parent.children.length-1);   
                node.setPosition(cc.v2(0,0));    
                node.active = true;              
                node.getComponent("CrabThunderSoloController").Init_CrabthunderSolo(self.node.getPosition(),fishValue,killActor);   
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }  
            });
               
    },

   



    
});
