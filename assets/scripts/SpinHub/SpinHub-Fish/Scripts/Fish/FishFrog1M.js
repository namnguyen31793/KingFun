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
        Global.InGameManager.creatEffectStartFrogFish(0);      
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

    Handle_LogicDeathFish(fishValue, killActor){

        if(killActor.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) {
            cc.resources.load('SpinHub-Fish/Prefabs/Fish/ResultFrogFish', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish","ResultFrogFish", (prefab)=>{
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                return;
                let node = cc.instantiate(prefab);
                node.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
            
                node.setPosition(cc.v2(0,0));    
                node.active = false;
                Global.ResultFrogFish.result = node.getComponent("ResultFrogFish");
                Global.ResultFrogFish.result.Init(115,fishValue);
            
            });
        }
        else
        {
            this.scheduleOnce(()=>{
              //  killActor.playing_Icon.active = true;
              cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/NotifyFrogFishReward', cc.Prefab, function (err, prefab) {      
                //Global.DownloadManager.LoadPrefab("Fish","Special/NotifyFrogFishReward", (prefab)=>{
                    if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                    let notify = cc.instantiate(prefab);
                    notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                    notify.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));

                    let money = notify.getChildByName("WinLabelEnd").getComponent(cc.Label);
                    money.string = "";
                    notify.scale = 1;
                    let time = 2;
                    killActor.scheduleOnce(()=>{                     
                        money.getComponent("LbMonneyChange")._currentMonney = 0;
                        money.getComponent("LbMonneyChange").time = 2;
                        money.getComponent("LbMonneyChange").setMoney(fishValue);                     
                    } , time);
                    //sau 7s thì bot tự chơi tiếp
                    killActor.scheduleOnce(()=>{
                        notify.destroy();
                        //tắt thông báo đang chơi
                      //  killActor.playing_Icon.active = false;
                        //update lại tiền, hiện score
                        killActor.UpdateBalance(fishValue, true);
                        killActor.On_Attack();
                        //killActor.isCountTime = true;
                    } , time+3);
                });
            },1);
        }
        
        
    },

    
});
