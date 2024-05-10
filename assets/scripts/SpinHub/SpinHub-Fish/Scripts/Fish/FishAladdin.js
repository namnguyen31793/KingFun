var RoadProperties2D = require ("RoadProperties2D");

cc.Class({
    extends: require("FishSpine"),

    ctor() {
        this.countMove = 0;
        this._fishBonusDescription = "";
    },
    properties: {     
        Multi_Label: cc.Node

    },

    Init(properties) {
        this._super(properties);        
        this.countMove = 0;
        this.eventConfig = require ("PathStore").getIns().getEventConfig(require("ScreenManager").getIns().roomType.toString());       
        this.Multi_Label_content = this.Multi_Label.getComponent(cc.Label);
        this.Multi_Label_content.string = 50;
        this.hitCombo = 50;
        this.isRotate = false;

        this._fishBonusDescription =  Global.Helper.formatString( "{DescriptionBonus_Type:1,Description_Info:\"{0}\"}", [50]);
     
        this.SetFishProperties_BonusDescription(this._fishBonusDescription);
        
        cc.resources.load('SpinHub-Fish/Prefabs/Fish3/Aladdin_Comming', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish3","Aladdin_Comming", (prefab)=>{
            
            try
            {
            if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                return;
            let Aladdin_Comming_node = cc.instantiate(prefab);
            Aladdin_Comming_node.parent = Global.InGameManager.luckyBoxWheelContainer;  
            Aladdin_Comming_node.setSiblingIndex(Aladdin_Comming_node.parent.children.length-1);
            Aladdin_Comming_node.setPosition(cc.v2(0,0));    
            Aladdin_Comming_node.active = true;
        
            this.scheduleOnce(()=>{
                Aladdin_Comming_node.active = false;
                Aladdin_Comming_node.destroy();
            },4);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
          });
    },
    /*
    start()
    {
        this.lastHitCombo = 0;
        this.Multi_Label_content = this.Multi_Label.getComponent(cc.Label);
        this.Multi_Label_content.string = 300;
        this.hitCombo = 300;
        this.Multi_Label_content.string = this.hitCombo;
   

    },
    */
    UpdateHitCombo()
    {
       let randomValue = Global.RandomNumber(0,100);
       if(randomValue > 20)
            return;
        if(this.hitCombo >= 200)
            return;
        this.lastHitCombo  = this.hitCombo;  
        this.hitCombo++;
        if(this.hitCombo > 200)
            this.hitCombo = 200;
            this.Multi_Label_content.string = this.hitCombo;  
        let _fishBonusDescription =  Global.Helper.formatString( "{DescriptionBonus_Type:1,Description_Info:\"{0}\"}", [this.hitCombo]);
    
        this.SetFishProperties_BonusDescription(_fishBonusDescription);

        if(this.hitCombo == 150)
        {
            // update level 3        
            
            this.Animation_UpdateLevel(3);
            this.scheduleOnce(()=>{
                this.UpdateLevel(3);
            }, 3)

           
        }
        else if(this.hitCombo == 100)
        {
            this.Animation_UpdateLevel(2);
            this.scheduleOnce(()=>{
                this.UpdateLevel(2);
            }, 3)
        }

    },

    UpdateLevel(level)
    {
        
        if(level == 3)
        {
            this.ske.setAnimation(0, 'Lv3', true);
    
        }
        else if(level == 2)
        {
            this.ske.setAnimation(0, 'Lv2', true);
        
        }
    },
    Animation_UpdateLevel(nextLevel)
    {
        if(nextLevel == 3)
        {
            this.ske.setAnimation(0, 'Lv2>Lv3', false);
        
        }
        else if(nextLevel == 2)
        {
            this.ske.setAnimation(0, 'Lv1>Lv2', false);
         
        }
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
        
        let obj = this.roadPropertiesList[indexRoad].UpdatePosByTime(currentTime, this.baseSpeed,false);
        this.SetSpeedAnimationByMove(obj.speedAniFish);
        /*
        if(obj.hadRotate)
        {
            
            let currentScale = this.Multi_Label_content.node.scaleX	;
            currentScale = currentScale * -1;
            this.Multi_Label_content.node.setScale(cc.v2(currentScale,1));
        }
        */
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

    SetupRoadList(){
        this.totalDuration = 0;
        this.roadPropertiesList.length = 0;
        let roadProperties = new RoadProperties2D();
        roadProperties.Setup(this, this.FishProperties.PathId, this.FishProperties.FishSpeed, this.FishProperties.Radius, this.vectorDireciton, 
            this.FishProperties.FishType, this.FishProperties.NumberOfGroup);
        this.roadPropertiesList.push(roadProperties);
        this.totalDuration += roadProperties.totalDuration;
    },
    biBan(){
        this._super();
        this.UpdateHitCombo();
    },
    
    Handle_CullingMask()
    {
        return;
    },


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

       /*
          if(killActor.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) 
          {     
        */      
            cc.resources.load('SpinHub-Fish/Prefabs/Fish3/AladdinController', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish3","AladdinController", (prefab)=>{
                try
                {
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                let node = cc.instantiate(prefab);
                node.parent = Global.InGameManager.luckyBoxWheelContainer;  
                node.setSiblingIndex(node.parent.children.length-1);
                node.setPosition(cc.v2(0,0));    
                node.active = true;
            
                let fishRewardDescription = JSON.parse(rewardDescription).Description_Info;   
                node.getComponent("AladdinController").Init_ShowAladdin_MultiReward(fishRewardDescription,fishValue,killActor);      
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
              });
     //   }  
        
        this.scheduleOnce(()=>{
            this.reoveFishNoEffect();
        }, 2.1);
    },

    
});
