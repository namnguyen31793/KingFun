// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

    /*
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
    */




    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {
        if(killActor.actorPropertis.AccountId != Global.GameLogic.mainActor.actorPropertis.AccountId)
        {
        //    killActor.playing_Icon.active = true;
            cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectWinElectricFish', cc.Prefab, function (err, prefab) {      
                /*
                try
                {
                    */
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                let notify = cc.instantiate(prefab);
                notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                Global.Helper.GetFishBigIcon(Global.Enum.FISH_TYPE_CONFIG.WHEEL_TYPE, notify.children[0].children[0].getComponent(cc.Sprite));
                notify.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));
                notify.scale = 0.6;
                notify.getComponent(cc.Animation).play();
                let time = Global.RandomNumber(10, 16);
                killActor.scheduleOnce(()=>{
                    notify.getComponentInChildren("TextJackpot").StartIncreaseTo(fishValue);
                } , time);
                //sau 15s thì bot tự chơi tiếp
                killActor.scheduleOnce(()=>{
                    notify.destroy();
                    //tắt thông báo đang chơi
            //        killActor.playing_Icon.active = false;
                    //update lại tiền, hiện score
                    killActor.UpdateBalance(fishValue, true);              
                    killActor.On_Attack();    
                } , time+3);
                /*
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
                */
            });
        }
    },
   
    
   
});
