
cc.Class({
    extends: require("Fish2D"),

    properties: {
        gun : cc.Node,  
        animEndName : "",
        defaultFishType : 0,
        isMove : true,
    },

    start()
    {
      
        this.Init();
    },
    Init(properties) {    
        require("FishCollection").getIns().AddToTalFish();
        this.node.opacity = 255;
        this.node.scale = 1; 
        fishType = this.defaultFishType;
        
        let now = new Date().getTime();
        let cTime = now + Global.RandomNumber(0,1000);
        if(Global.ServerBot.isStartServer) 
                cTime -= Global.RandomNumber(4000,7000);

        let indexGroup = Global.RandomNumber(0,12);
        //let pathId = this.GetPathIdByGroup(indexGroup);
        let pathId = -1;
        let radius = Global.RandomNumber(-50,50);
        let fishId =  Global.ServerBot.moduleCreateFish.Inc_FishId();
        let tempFishProperties  = {
            FishId :fishId,
            FishSpeed : 1,
            FishType : fishType,
            ItemType : 0,
            PathId : pathId,
            Radius : radius,
            RewardMulti : 0,
            RewardType : 0,
            NumberOfGroup : -1,
            StartTimeSkipDate : "0001-01-01T00:00:00",
            TimeSkip : 0,
            UnTimeSkipDate: "0001-01-01T00:00:00",
            CreateTime : Global.ServerBot.timeControl.convertTimeToString(cTime),
            totalSkipTimeMinisecond : 0,
            startTimeCreated : cTime,
            fishBonusDescription: "",
        };
        this.FishProperties = tempFishProperties;
      
       // require("FishCollection").getIns().AddFishToList(this);
        require("FishCollection").getIns().listFish[this.FishProperties.FishId.toString()] = this;
       
        /*
        this.mar.getComponent(cc.MeshRenderer).getMaterial(0).setProperty("diffuseColor", this.sColor);
        if(this.mesh != null) {
            this.mesh.getMaterial(0).setProperty("diffuseColor", this.sColor);
        }
        */
       
        if(this.listColider) {
            for(let i = 0 ; i < this.listColider.length ; i++){
                this.listColider[i].enabled = true;
            }
        }
        this.currentFishStatus = 2;
        this.inRun = true;
        this.isDie = false;
        this.isPreDie = false;
        this.playAnimDie = false;
        this.velocityBullet = null;
        if(this.lightingObj != null)
            this.lightingObj.active = false;
        this.rotX = this.rotNormal.x;
        this.rotY = this.rotNormal.y;
        this.rotZ = this.rotNormal.z;
        this.vectorDireciton = cc.v2(1,1);
        this.RePlay();
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            this.FishProperties.NumberOfGroup = -1;
        } 
       
        this.baseSpeed = require ("PathStore").getIns().BaseSpeedAnimationFish(this.FishProperties.FishType);
        if(this.isMove)
        {
            this.SetupRoadList();
            this.updateCurrentMoveTime();// - this.FishProperties.totalSkipTimeMinisecond / 1000 - this.FishProperties.skipTime;
            this.HandleFishMove (0);
        }
        
    },

    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {

    },

    UpdatePositionByTime(currentTime)
    {

    },
    HandleFishMove(deltaTime)
    {
        
    },
   
    
});
