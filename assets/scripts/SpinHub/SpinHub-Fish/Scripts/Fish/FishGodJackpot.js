var RoadProperties2D = require ("RoadProperties2D");

cc.Class({
    extends: require("FishSpine"),

    properties: {
       lbMulti : require("TextJackpot"),
    },

    ctor() {
        this.countMove = 0;
    },

    Init(properties) {
        this._super(properties);
        this.countMove = 0;
        this.eventConfig = require ("PathStore").getIns().getEventConfig(require("ScreenManager").getIns().roomType.toString());
    },

    UpdateJackpotValue(jackpotValue) {
        this.lbMulti.StartIncreaseTo(jackpotValue);
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
            let pathId = this.CreateRandomPathIdBigFish();
            this.SetupNewRoad(pathId);
        }
        
        let obj = this.roadPropertiesList[indexRoad].UpdatePosByTime(currentTime, this.baseSpeed);
        this.SetSpeedAnimationByMove(obj.speedAniFish);
        return obj.newPosition;
    },

    CreateRandomPathIdBigFish() {
        let listPath = require ("PathStore").getIns().getPathEvent().path;
        let pathId = listPath[Global.RandomNumber(0, listPath.length)];
        return pathId;
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

        cc.resources.load('SpinHub-Fish/Prefabs/Fish3/NotifyGodJackpot', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish3","NotifyGodJackpot", (prefab)=>{
            try
            {
            if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                return;
            let node = cc.instantiate(prefab);
            node.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
            node.setPosition(cc.v2(0,0));    
            node.active = true;
            let result = node.getComponent("ResultGodJackpot");
            if(killActor == null) {
                node.destroy();
            } else {
                let pos = Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135));
                let isMe = killActor.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId();
                result.Init(fishValue, isMe, killActor, pos);
            }
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        
        });
        
        this.scheduleOnce(()=>{
            this.reoveFishNoEffect();
        }, 2.1);
    },

    reoveFishNoEffect(){
        this._super();
        this.lbMulti.reset();
    },

    update (dt) {
        this._super(dt);
        this.lbMulti.node.scaleX = this.node.scaleX;
        this.lbMulti.node.scaleY = this.node.scaleY;
    },
});
