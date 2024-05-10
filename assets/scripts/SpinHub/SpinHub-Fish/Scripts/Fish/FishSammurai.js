var RoadProperties2D = require ("RoadProperties2D");

cc.Class({
    extends: require("Fish2D"),
    ctor() {
        this.isSammurai = true;
        this.autoBouncing = false;
        this.levelSammurai = 0;
        this.indexMulti = -1;
    },

    properties: {
        ske : sp.Skeleton,
        listColliderSamurai : [cc.Node],
        shield : cc.Node,
        animMulti : [sp.Skeleton],

    },

    Init(properties) {
        this._super(properties);
        this.indexMulti = -1;
        for(let i = 0; i < this.animMulti.length; i++) {
            this.animMulti[i].node.active = false;
        }
        cc.log("Init Samurai");
        this.schedule(this.Evolution, 45); // Gọi updateLoop mỗi 1 giây
    },

    SetUpAnimation() {
        this.node.opacity = 255;
        this.levelSammurai = 0;
        this.ske.setAnimation(0, 'TUMBLR_SWIN', true);
        this.ActiveSammuraiCollider(0);
        this.shield.active = false;
    },

    ActiveSammuraiCollider(index) {
        this.autoBouncing = false;
        for(let i = 0; i < this.listColliderSamurai.length; i++) {
            if(i != index)
                this.listColliderSamurai[i].active = false;
            else this.listColliderSamurai[i].active = true;
        }
    },

    reoveFishHaveEffect(fishValue, killActor){
        killActor.Off_Attack();
        this.ActiveSammuraiCollider(-1);
        this.inRun = false;
        this.isDie = true;
        this.shield.active = false;
        if(this.levelSammurai == 0) {
            this.SetSpeedAnimationByMove(5);
            let anim = this.node.getComponent(cc.Animation);
            let pos = this.node.getPosition();
            if(this.velocityBullet != null) {
                pos.x += this.velocityBullet.x / 15; 
                pos.y += this.velocityBullet.y / 15;   
                this.node.runAction(cc.moveTo(0.4,pos));
            }
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
                killActor.On_Attack();
                this.reoveFishNoEffect();
            }, 2.1);
        } else {
            this.animMulti[this.indexMulti].setAnimation(0, 'bien mat', false);
                this.scheduleOnce(()=>{
                    this.animMulti[this.indexMulti].node.active = false;
                }, 0.3);
            this.SetSpeedAnimationByMove(1);
            this.ske.setAnimation(0, 'locxoay', false);
            this.scheduleOnce(()=>{
                if(killActor.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) {
                 
                    Global.SammuraiController.CreateResultSammurai(this.levelSammurai, fishValue/Global.SammuraiController.multi, killActor, fishValue);
                    this.ShowWinSammurai(killActor, fishValue);
                }
                else
                {
                    // xu ly bot 
                    this.Bot_ShowWinSamurai(killActor, fishValue);
                }
                this.reoveFishNoEffect();
            }, 1)
        }
    },

    ShowWinSammurai(killActor, fishValue) {
        cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/NotifySammurai', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish","Special/NotifySammurai", (prefab)=>{
            try
            {
            if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                return;
            let notify = cc.instantiate(prefab);
            notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
            notify.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));
                
            notify.getComponent(cc.Animation).play("AnimNotifyWinLuckyBoxWait");
            let money = notify.getChildByName("BG").getChildByName("WinLabelEnd").getComponent(cc.Label);
            money.string = "";
            notify.scale = 1;
            let time = 6.5;
            killActor.scheduleOnce(()=>{
                notify.getComponent(cc.Animation).play("AnimNotifyWinLuckyBoxEnd");
                money.getComponent("LbMonneyChange")._currentMonney = 0;
                money.getComponent("LbMonneyChange").time = 2;
                money.getComponent("LbMonneyChange").setMoney(fishValue);
            } , time);
            //sau 7s thì bot tự chơi tiếp
            killActor.scheduleOnce(()=>{
                notify.destroy();
                //tắt thông báo đang chơi
                killActor.UpdateBalance(fishValue, true);
                killActor.On_Attack();  
                Global.InGameView.OnAuto();
            } , time+3);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
    },

    Bot_ShowWinSamurai(killActor, fishValue)
    {
        cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/NotifySammurai', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish","Special/NotifySammurai", (prefab)=>{
            try
            {
            if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                return;
            let notify = cc.instantiate(prefab);
            notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
            notify.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));
                
            notify.getComponent(cc.Animation).play("AnimNotifyWinLuckyBoxWait");
            let money = notify.getChildByName("BG").getChildByName("WinLabelEnd").getComponent(cc.Label);
            money.string = "";
            notify.scale = 1;
            let time = 4;
            killActor.scheduleOnce(()=>{
                notify.getComponent(cc.Animation).play("AnimNotifyWinLuckyBoxEnd");
                money.getComponent("LbMonneyChange")._currentMonney = 0;
                money.getComponent("LbMonneyChange").time = 2;
                money.getComponent("LbMonneyChange").setMoney(fishValue);
            } , time);
            //sau 7s thì bot tự chơi tiếp
            killActor.scheduleOnce(()=>{
                notify.destroy();
                //tắt thông báo đang chơi
           //     killActor.playing_Icon.active = false;
                //update lại tiền, hiện score
                killActor.UpdateBalance(fishValue, true);
                killActor.On_Attack();  
            } , time+3);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
    },

    UpdatePositionByTime(currentTime)
    {
        let  indexRoad = 0;
        if(currentTime >= this.totalDuration) {
            if(this.FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_3) {
                Global.ServerBot.ServerKillFish(this.FishProperties.FishId);
                Global.ServerBot.EndSamurai();
                this.reoveFishNoEffect();
            }
            this.currentMoveTime -= this.totalDuration;
            currentTime = this.currentMoveTime;
            let listPath = require ("PathStore").getIns().getSammuraiConfig();
            let pathId = listPath[Global.RandomNumber(0,listPath.length)];
            this.SetupNewRoad(pathId);
        }
        
        let obj = this.roadPropertiesList[indexRoad].UpdatePosByTime(currentTime, this.baseSpeed);
        this.SetSpeedAnimationByMove(obj.speedAniFish);
        return obj.newPosition;
    },

    update (dt) {
        this._super(dt);
    
    },

    SetSpeedAnimationByMove(speed){
        this.ske.timeScale = speed;
    },

    RePlay() {
   
    },

    Evolution() {
        this.inRun = false;
        this.ske.timeScale = 1;
        this.autoBouncing = true;
        Global.InGameManager.FishPoolInstance.creatEffectLevelUp();
        this.scheduleOnce(()=>{
            if(this.FishProperties.FishType ==Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_0) {
                this.levelSammurai = 1;
                this.FishProperties.FishType =Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_1;
                this.ske.setAnimation(0, 'TRANSFER_BACK', false);
                this.scheduleOnce(()=>{
                    this.inRun = true;
                    this.ske.setAnimation(0, 'Lv2_SWIM', true);
                    this.shield.active = true;
                    this.ActiveSammuraiCollider(1);
                    this.animMulti[0].node.active = true;
                    this.animMulti[0].setAnimation(0, 'xuat hien', false);
                    this.scheduleOnce(()=>{
                        this.animMulti[0].setAnimation(0, 'xoay tron', true);
                    }, 0.3);
                    this.indexMulti = 0;
                }, 0.6)
            } else if(this.FishProperties.FishType ==Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_1) {
                this.levelSammurai = 2;
                this.FishProperties.FishType =Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_2;
                this.ske.setAnimation(0, 'Lv2_Up', false);
                this.animMulti[0].setAnimation(0, 'bien mat', false);
                this.scheduleOnce(()=>{
                    this.animMulti[0].node.active = false;
                }, 0.3);
                this.scheduleOnce(()=>{
                    this.inRun = true;
                    this.ske.setAnimation(0, 'Lv3_SWIM', true);
                    this.shield.active = true;
                    this.ActiveSammuraiCollider(2);
                    this.animMulti[1].node.active = true;
                    this.animMulti[1].setAnimation(0, 'xuat hien', false);
                    this.scheduleOnce(()=>{
                        this.animMulti[1].setAnimation(0, 'xoay tron', true);
                    }, 0.3);
                    this.indexMulti = 1;
                }, 1.3)
            } else if(this.FishProperties.FishType ==Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_2) {
                this.levelSammurai = 3;
                this.FishProperties.FishType =Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_3;
                this.ske.setAnimation(0, 'Lv3_Up', false);
                this.animMulti[1].setAnimation(0, 'bien mat', false);
                this.scheduleOnce(()=>{
                    this.animMulti[1].node.active = false;
                }, 0.3);
                this.scheduleOnce(()=>{
                    this.inRun = true;
                    this.ske.setAnimation(0, 'Lv4_SWIM', true);
                    this.shield.active = true;
                    this.ActiveSammuraiCollider(3);
                    this.animMulti[2].node.active = true;
                    this.animMulti[2].setAnimation(0, 'xuat hien', false);
                    this.scheduleOnce(()=>{
                        this.animMulti[2].setAnimation(0, 'xoay tron', true);
                    }, 0.3);
                    this.indexMulti = 2;
                }, 1.3)
            } else if(this.FishProperties.FishType ==Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_3) {              
                this.unschedule(this.Evolution);
                this.ske.setAnimation(0, 'Lv3_Up', false);
                this.animMulti[1].setAnimation(0, 'bien mat', false);
                Global.ServerBot.ServerKillFish(this.FishProperties.FishId);
                Global.ServerBot.EndSamurai();
                this.reoveFishNoEffect();
            }
        }, 3)
    },

    SetupNewRoad(id) {
        this.FishProperties.PathId = id;
        this.FishProperties.FishSpeed = 30;
        this.totalDuration = 30;
        this.roadPropertiesList.length = 0;
        let roadProperties = new RoadProperties2D();
        roadProperties.Setup(this, id, this.FishProperties.FishSpeed, this.FishProperties.Radius, this.vectorDireciton, 
            this.FishProperties.FishType, this.FishProperties.NumberOfGroup);
        this.roadPropertiesList.push(roadProperties);
    },

    CheckBouncing() {
        // return false;
        if(this.autoBouncing)
            return true;
        if(this.levelSammurai == 0) {
            return false;
        } else {
            let r = Global.RandomNumber(0,100);
            if(r < 70)
                return true;
        }
        return false;
    },

    reoveFishNoEffect(){
        this.FishProperties.FishType =Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_0;
        this._super();
        
    },

    onLoad() {
        this.listColider = this.getComponents(cc.BoxCollider);   
    },
    
});
