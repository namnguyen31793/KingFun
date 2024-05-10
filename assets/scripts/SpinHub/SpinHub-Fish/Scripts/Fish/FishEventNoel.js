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

    reoveFishHaveEffect(fishValue, killActor){
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
        this.scheduleOnce(()=>{
            killActor.UpdateBalance(fishValue, true);   
            this.reoveFishNoEffect();
        }, 2.1);

        //cc.log("ICE VALUE: "+fishValue);
        
        this.scheduleOnce(()=>{
            this.PlayEffectDie();
        }, 0.5);
       
    },

    PlayEffectDie() {
      
        let self = this;
        cc.resources.load('SpinHub-Fish/Prefabs/Fish2/EffectSnow', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish2","EffectSnow", (prefab)=>{
            try
            {
            let node = cc.instantiate(prefab);
            Global.InGameManager.FishPoolInstance.OtherContainer.addChild(node);
            node.y = 95;
            self.scheduleOnce(()=>{
                Global.InGameManager.SetIce(12000);
                require("FishCollection").getIns().StopAnimation();
            }, 0.5);
            self.scheduleOnce(()=>{
                node.destroy();
            }, 2);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
    },
});
