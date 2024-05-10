var RoadProperties2D = require ("RoadProperties2D");

cc.Class({
    extends: require("FishSpine"),

    properties: {
       
    },

    ctor() {
        this.countMove = 0;
    },

    Init(properties) {
        this._super(properties);
        this.countMove = 0;
        this.eventConfig = require ("PathStore").getIns().getEventConfig(require("ScreenManager").getIns().roomType.toString());       
        
     
        this.ske.timeScale = 1;
        this.ske.setAnimation(0, 'idle', true);
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

    reoveFishHaveEffect(fishValue, killActor,rewardDescription){
      
        for(let i = 0 ; i < this.listColider.length ; i++){
            this.listColider[i].enabled = false;
        }
       this.inRun = false;
        this.isDie = true;
        this.SetSpeedAnimationByMove(5);
       
        //death Fish
        let anim = this.node.getComponent(cc.Animation);
        if(anim == null)
        {
        
            this.Handle_AnimationDeathFish(fishValue, killActor,rewardDescription);
        }
        else
        {
           
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
        }

        this.scheduleOnce(()=>{
            this.reoveFishNoEffect();
        }, 2.1);
     
        this.Handle_LogicDeathFish(fishValue, killActor,rewardDescription);
    },

    Handle_AnimationDeathFish(fishValue, killActor,rewardDescription)
    {

    },

    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {

    },

});
