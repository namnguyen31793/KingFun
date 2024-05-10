var RoadProperties2D = require ("RoadProperties2D");

cc.Class({
    extends: require("FishSpine"),

    ctor() {
        this.countMove = 0;
        this.lionSkinNames = ["B","R","G"];
        this.boardSkinname = ["B","R","G"];
        this.levelIndex = 0;
        this._fishBonusDescription = "";

    },
    properties: {   
        Multi_Label: cc.Node,   
        Board: cc.Node, 
        MultiBoard: cc.Node,
    },

    Init(properties) {
        this._super(properties);    
        this.ColorBoard = this.Board.getComponent(sp.Skeleton);
        this.countMove = 0;
        this.eventConfig = require ("PathStore").getIns().getEventConfig(require("ScreenManager").getIns().roomType.toString());       
        this.Multi_Label_content = this.Multi_Label.getComponent(cc.Label);
        this.Multi_Label_content.string = "x"+50;
        this.hitCombo = 50;
        this.isRotate = true;
        this.ske.setSkin(this.lionSkinNames[this.levelIndex]);
        this.ColorBoard.setSkin(this.boardSkinname[this.levelIndex]);
        this.ske.setAnimation(0, 'SWIM', true);
        this.ColorBoard.setAnimation(0, 'Swim', true);
        this._fishBonusDescription =  Global.Helper.formatString( "{DescriptionBonus_Type:1,Description_Info:\"{0}\"}", [this.hitCombo]);
        this.SetFishProperties_BonusDescription(this._fishBonusDescription);
    },
   
    UpdateHitCombo()
    {
       let randomValue = Global.RandomNumber(0,100);
       if(randomValue > 20)
            return;
        if(this.hitCombo > 200)
            return;
        this.lastHitCombo  = this.hitCombo;  
        this.hitCombo++;
        if(this.hitCombo > 200)
            this.hitCombo = 200;
            this.Multi_Label_content.string = "x"+this.hitCombo;  
        this._fishBonusDescription =  Global.Helper.formatString( "{DescriptionBonus_Type:1,Description_Info:\"{0}\"}", [this.hitCombo]);
        this.SetFishProperties_BonusDescription(this._fishBonusDescription);

        if(this.hitCombo == 100)
        {
            // update level 3
            cc.tween(this.node).by(0.5,{ scale:0.5}).by(0.5,{ scale:-0.5}).start();
            this.UpdateLevel(1);
        }
        else if(this.hitCombo == 150)
        {
            // update level 2
            cc.tween(this.node).by(0.5,{ scale:0.5}).by(0.5,{ scale:-0.5}).start();
            this.UpdateLevel(2);
        }

    },

    UpdateLevel(level)
    {
        this.ColorBoard.setAnimation(0, 'Change', false);
        this.ColorBoard.scheduleOnce(()=>{
            this.levelIndex++;
            this.ske.setSkin(this.lionSkinNames[this.levelIndex]);
            this.ColorBoard.setSkin(this.boardSkinname[this.levelIndex]);

            this.ske.setAnimation(0, 'SWIM', true);
            this.ColorBoard.setAnimation(0, 'SWIM', true);
        },2);
 
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
    


    reoveFishHaveEffect(fishValue, killActor,rewardDescription){


        this.ColorBoard.setAnimation(0, 'Catch', false);


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

       
        
        cc.resources.load('SpinHub-Fish/Prefabs/Fish3/LionDanceResultControl', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish3","LionDanceResultControl", (prefab)=>{
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
            node.getComponent("LionDanceController").Init_ShowLionDance_MultiReward(fishRewardDescription,fishValue,killActor);
            }
            catch(e)
            {
                this.node.action = false;
                cc.log("ERROR: "+e);
            }
           
        });
      
       
        
        this.scheduleOnce(()=>{
            this.reoveFishNoEffect();
        }, 2.1);
    },
    Handle_CullingMask()
    {
        return;
    },

    Handle_RotateFowardPath(angleValue)
    {
      

        angleValue = (angleValue + 360) % 360
        
        if(angleValue < 90)
        {
            this.node.scaleX = -1;
            this.node.scaleY = 1;  
            this.MultiBoard.scaleY = -0.3;
        }
        else if (angleValue < 180)
        {
            this.node.scaleY = 1;
            this.node.scaleX = -1;
            this.MultiBoard.scaleY = -0.3;
        }  
        else if(angleValue < 270)
        {
            this.node.scaleX = 1;
            this.MultiBoard.scaleY = 0.3;
        }
        else 
        {
            this.node.scaleX = 1;
        }

    },

     
});
  