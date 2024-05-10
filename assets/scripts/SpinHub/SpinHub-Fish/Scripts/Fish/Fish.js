
var RoadProperties = require ("RoadProperties");
cc.Class({
    extends: cc.Component,
    ctor(){
        this.roadPropertiesList = [];
		this.totalMoveDurationTime= 0;
		this.currentRoadIndex = 0;
		this.currentMoveTime = 0;
		this.timeGate = 0;
		this.FishProperties = null;
		this.totalDuration = 0;
        this.isSpecialTurn = false;
		this.status = 0;;
		this.fishId  = 0;
		this.pathId = 0;
		this.flip = 1;
        this.baseSpeed = [];
        this.inRun = true;
        this.isDie = false;
        this.isPreDie = false;
        this.alpha = 255;
        this.isFoward = true;
        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;
        this.currentFishStatus = 0;
        this.animationState = [];
        this.playAnimDie = false;
        this.velocityBullet = null;
        this.cacheReward = 0;
        this.isBiBan = false;
        this.delayBiBanCounter = 0.2;
    },

    properties: {
        // img : cc.Node,
        test : false,
        mar : cc.MeshRenderer,  
        mesh : cc.MeshRenderer,
        sColor : cc.Color,
        nodeFish : cc.Node,
        playAnim : require("PlayAnimFish3D"),
        rotNormal : {
            default : cc.v3(0,0,0)
        },
        rotInverse : {
            default : cc.v3(0,0,0)
        },
        lightingObj : cc.Node,
        effectFowrad : cc.Node,
        effectInverse : cc.Node,
    },

    Init(properties) {
       
        require("FishCollection").getIns().AddToTalFish();
        this.node.opacity = 255;
        this.node.scale = 1;
        this.FishProperties = properties;
      

        /*
        this.mar.node.getComponent(cc.MeshRenderer).getMaterial(0).setProperty("diffuseColor", this.sColor);
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
        this.SetupRoadList();
        this.updateCurrentMoveTime();// - this.FishProperties.totalSkipTimeMinisecond / 1000 - this.FishProperties.skipTime;
        this.baseSpeed = require ("PathStore").getIns().BaseSpeedAnimationFish(this.FishProperties.FishType);
        this.HandleFishMove (0);
    },
    SetFishProperties_BonusDescription(_fishBonusDescription)
    {
        this.FishProperties.fishBonusDescription = _fishBonusDescription;
    },
    SetFishRedundancy(useCollider) {
        if(Global.InGameManager.inBackGround) {
            this.reoveFishNoEffect();
            return;
        }
        if(!useCollider) {
            for(let i = 0 ; i < this.listColider.length ; i++){
                this.listColider[i].enabled = false;
            }
        }
        this.currentFishStatus = 5;
    },

    SetupRoadList(){
        this.isSpecialTurn = false;
        this.totalDuration = 0;
        this.roadPropertiesList.length = 0;
        let roadProperties = new RoadProperties();
        roadProperties.Setup(this, this.FishProperties.PathId, this.FishProperties.FishSpeed, this.FishProperties.Radius, this.vectorDireciton, 
            this.FishProperties.FishType, this.FishProperties.NumberOfGroup);
        this.roadPropertiesList.push(roadProperties);
        
        this.totalDuration += roadProperties.totalDuration;
        if(this.FishProperties.PathId >= 1000)
            this.isSpecialTurn = true;
    },
    
    GetTimeMovedOfFish(){
        let currentTimeServer = new Date().getTime();// require("SyncTimeControl").getIns().GetCurrentTimeServer();
        if(this.FishProperties == null)
            return 0;
        let returnTime = currentTimeServer - this.FishProperties.startTimeCreated;
        return returnTime < 0 ? 0 : returnTime;
    },

    updateCurrentMoveTime(){
        if(this.FishProperties != null)
            this.currentMoveTime = this.GetTimeMovedOfFish () * 0.001 - this.FishProperties.totalSkipTimeMinisecond /1000 - this.FishProperties.skipTime;
    },

    SetPreDie(reward) {
        this.cacheReward = reward;
        this.isPreDie = true;
    },

    UpdatePositionByTime(currentTime)
    {
        let  indexRoad = 0;
        if(currentTime >= this.totalDuration) {
            currentTime = 0;
            if(this.FishProperties == null)
            {
              
            }
            Global.ServerBot.ServerKillFish(this.FishProperties.FishId);
            this.reoveFishNoEffect();
        }
        
        try {
            let obj = this.roadPropertiesList[indexRoad].UpdatePosByTime(currentTime, this.baseSpeed);
            this.SetSpeedAnimationByMove(obj.speedAniFish);
            return obj.newPosition;
        } catch {
          
            return cc.v2(-9999,-9999);
        }
        
      
        
    },

    SetSpeedAnimationByMove(mSpeed){
        for(let i = 0; i < this.animationState.length; i++)
            if(this.playAnim) {
                this.playAnim.SetSpeed(mSpeed);
            } else {
                this.animationState[i].speed = mSpeed;
            }
            
    },

    SyncIce(timeFreeze) {
        this.currentMoveTime -= timeFreeze;
        HandleFishMove (0);
    },

    HandleFishMove(deltaTime)
    {
        
        if(this.isBiBan)
        {
            this.delayBiBanCounter -= deltaTime;
            if(this.delayBiBanCounter < 0)
            {
                this.isBiBan = false;
                this.delayBiBanCounter = 0.2;           
            }
            return;
        }

        this.currentMoveTime += deltaTime;
        this.node.setPosition(this.UpdatePositionByTime(this.currentMoveTime));
        if(this.node.position.z > 0) {
            this.node.scale = 1 + this.node.position.z/1500;
        } else {
            this.node.scale = 1 + this.node.position.z/1000;
        }
    },

    SetShock() {
        for(let i = 0 ; i < this.listColider.length ; i++){
            this.listColider[i].enabled = false;
        }
        this.inRun = false;
        this.isPreDie = true;
        this.SetSpeedAnimationByMove(8);
    },

    SetLighting() {
        this.inRun = false;
        if(this.lightingObj != null)
            this.lightingObj.active = true;
        this.scheduleOnce(()=>{
            this.inRun = true;
            if(this.lightingObj != null)
                this.lightingObj.active = false;
            this.FishProperties.totalSkipTimeMinisecond = 1000;
        }, 1)
    },

    update (dt) {
        if(this.playAnimDie) {
            this.alpha -= dt * 120;
            /*
            this.mar.node.getComponent(cc.MeshRenderer).getMaterial(0).setProperty("diffuseColor", cc.color(this.sColor.r, this.sColor.g, this.sColor.b, parseInt(this.alpha)));
            if(this.mesh != null) {
                this.mesh.getMaterial(0).setProperty("diffuseColor", cc.color(this.sColor.r, this.sColor.g, this.sColor.b, parseInt(this.alpha)));
            }
            */
        }
        if(Global.InGameManager.isIce) return;
        if(!this.inRun) return;

        

        this.rotX = this.CheckRot(this.rotX, this.rotNormal.x, this.rotInverse.x, this.isFoward, dt);
        this.rotY = this.CheckRot(this.rotY, this.rotNormal.y, this.rotInverse.y, this.isFoward, dt);
        this.rotZ = this.CheckRot(this.rotZ, this.rotNormal.z, this.rotInverse.z, this.isFoward, dt);
        this.nodeFish.eulerAngles = cc.v3(this.rotX, this.rotY, this.rotZ);
        
        // if(this.currentFishStatus == 5){
        //     this.HandleFishMove(dt*2);
        // }else{
            this.HandleFishMove(dt);
        // }  
    },

    CheckRot(rot, total1, total2, direction, dt) {
        let heso = 1;
        let check = 0;
        let numbEnd = 0;
        if(direction) {
            check  = total2 - total1;
            numbEnd = total1;
        } else {
            check = total1 - total2;
            numbEnd = total2;
        }
        if(check > 0)
            heso = -1;
        if(heso > 0) {
            if(rot < numbEnd) {
                rot += dt * 180;
                if(rot > numbEnd)
                rot = numbEnd;
            }
        } else {
            if(rot > numbEnd) {
                rot -= dt * 180;
                if(rot < numbEnd)
                    rot = numbEnd;
            }
        }
        return rot;
    },

    biBan(){
        
        /*
        this.mar.node.getComponent(cc.MeshRenderer).getMaterial(0).setProperty("diffuseColor", cc.color(255, 150, 150, 255));
        this.node.runAction(cc.sequence(cc.delayTime(0.2) , cc.callFunc(()=>{
            this.mar.node.getComponent(cc.MeshRenderer).getMaterial(0).setProperty("diffuseColor", this.sColor);
        })));
        if(this.mesh != null) {
            this.mesh.getMaterial(0).setProperty("diffuseColor", cc.color(255, 150, 150, 255));
            this.node.runAction(cc.sequence(cc.delayTime(0.2) , cc.callFunc(()=>{
                this.mesh.getMaterial(0).setProperty("diffuseColor", this.sColor);
            })));
        }
        */
       this.Handle_BiBanLogic();

    },
    Handle_BiBanLogic()
    {
        if(!this.isBiBan)
        {      
            if(Global.GameLogic.roomProperties.RoomType == 3)
                return;
            let rand = Global.RandomNumber(0,100);       
            if(rand < 30)
            {
                this.delayBiBanCounter = 0.2;
                this.isBiBan = true;
               
             }
        }
    },
    reoveFishNoEffect(){
        require("FishCollection").getIns().SubToTalFish();
        this.node.stopAllActions();
        this.node.color = cc.Color.WHITE;
        this.node.opacity = 255;
        this.node.scale = 1;
        let anim = this.node.getComponent(cc.Animation);
        if(anim != null) {
            anim.stop();
        }
        this.unscheduleAllCallbacks();
        let type = this.FishProperties.FishType;
        let str = "poolFish" + type;
        require("FishCollection").getIns()[str].put(this.node);
		require("FishCollection").getIns().RemoveFishToList(this.FishProperties.FishId);
    },
    
    reoveFishHaveEffect(fishValue, killActor,rewardDescription,heso){
        for(let i = 0 ; i < this.listColider.length ; i++){
            this.listColider[i].enabled = false;
        }
        this.inRun = false;
        this.isDie = true;
        this.Handle_AnimationDeathFish(fishValue, killActor,rewardDescription);
       
        this.scheduleOnce(()=>{
            this.reoveFishNoEffect();
        }, 2.1);
       
       
        this.Handle_LogicDeathFish(fishValue, killActor,rewardDescription);
        this.Handle_CreateEffectWhenDeath(fishValue, killActor,rewardDescription,heso);
    },

    SetPreDieBigWin() {
        for(let i = 0 ; i < this.listColider.length ; i++){
            this.listColider[i].enabled = false;
        }
        this.inRun = false;
        this.isDie = true;
        this.SetSpeedAnimationByMove(5);
        if(this.mar != null)
            this.node.eulerAngles = cc.v3(this.node.eulerAngles.x, 90, 0);
    },

    EndPreDie() {
        let anim = this.node.getComponent(cc.Animation);
        if(anim != null) {
            let action = cc.callFunc(()=>{
                this.SetSpeedAnimationByMove(0);
                this.playAnimDie = true;
                anim.play();
            });
            this.node.runAction(cc.sequence(cc.delayTime(2), action));
            
        }
        else {
            this.SetSpeedAnimationByMove(8);
            this.node.runAction(cc.fadeOut(1.5));
        }
        this.scheduleOnce(()=>{
            this.reoveFishNoEffect();
        }, 3.5);
    },

    setVelocityBullet(velocityBullet) {
        this.velocityBullet = velocityBullet;
    },

    SetFoward() {
        this.isFoward = true;
        if(this.effectFowrad) {
            this.effectFowrad.active = true;
            this.effectInverse.active = false;
        }
    },

    SetInverse() {  
        this.isFoward = false;
        if(this.effectInverse) {
            this.effectFowrad.active = false;
            this.effectInverse.active = true;
        }
    },

    RePlay() {
        if(this.playAnim == null) {
            this.animation = this.getComponentsInChildren(cc.Animation);
            this.animationState[0] = this.node.children[0].getComponent(cc.Animation).play();
        }
    },

    onLoad() {
        this.loadCollider();
        if(this.playAnim == null) {
            this.animation = this.getComponentsInChildren(cc.Animation);
            this.animationState[0] = this.node.children[0].getComponent(cc.Animation).play();
        }
    },

    loadCollider()
    {
         this.listColider = this.getComponents(cc.BoxCollider);
        if(this.listColider == null || this.listColider[0] == null)
        {
            this.listColider = this.getComponentsInChildren(cc.BoxCollider);
        }
    },
    Handle_AnimationDeathFish(fishValue, killActor,rewardDescription)
    {
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
    },

    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {
        if(Global.InGameManager.fishTarget != null && Global.InGameManager.fishTarget.node == this.node) {
            Global.InGameManager.fishTarget = null;           
          
        }
        if(killActor!= null)
        {
            if(Global.InGameManager.fishTarget != null && Global.InGameManager.fishTarget.node == this.node) {
                killActor.HideItemLockFish();
            }     
        }
        
    },
    Handle_CreateEffectWhenDeath(fishValue, killActor,rewardDescription,heso)
    {
        if(Global.InGameManager.inBackGround)
        {
            if(killActor != null && fishValue > 0)
            {
                killActor.UpdateBalance(fishValue, true);
            }
            return;
        }
        
        let isUpdateBalance =  true;
        if(this.FishProperties.FishType < 30)
        {
            isUpdateBalance = this.Handle_CreateEffectWhenDeath_NormalFish(fishValue, killActor,rewardDescription,heso);  
        }
        else
        {          
            if(killActor == null)
                return;
            killActor.Off_Attack();
            Global.InGameView.OffAuto();
            isUpdateBalance = this.Handle_CreateEffectWhenDeath_SpecialFish(fishValue, killActor,rewardDescription,heso);
        }
        if(isUpdateBalance == true && killActor != null && fishValue > 0)
        {
            killActor.scheduleOnce(()=>{
              
                killActor.UpdateBalance(fishValue, true);
            } , 0.5);
        }   

    },

    Handle_CreateEffectWhenDeath_NormalFish(fishValue, killActor,rewardDescription,heso)
    {
        let isUpdateBalance =  true; // co truong hop se khong update tien o day 
        if(this.FishProperties.FishType < 8)
        {
             Global.InGameManager.FishPoolInstance.creatEffectBoom(this.node.getPosition());
            if(killActor!= null)
            Global.InGameManager.FishPoolInstance.creatCoint(killActor, this.node.getPosition(), this.FishProperties.FishType, fishValue);

        }
        else   
        {
           Global.InGameManager.FishPoolInstance.creatEffectBoomBig(this.node.getPosition());

           if(this.FishProperties.FishType > 13)
           {
                Global.InGameManager.InGameSoundManager.playRandomSoundEffect();
                if(killActor != null && killActor.actorPropertis != null)
                    Global.InGameManager.FishPoolInstance.createEffectPlayerWin(killActor.actorPropertis.SittingId,fishValue);
           }
        }
        if(killActor != null && fishValue != null && fishValue > 0)
            Global.InGameManager.FishPoolInstance.createScore(this.node.getPosition(), fishValue, killActor.actorPropertis.AccountId == Global.GameLogic.mainActor.actorPropertis.AccountId);
                
        return isUpdateBalance;
    },
    Handle_CreateEffectWhenDeath_SpecialFish(fishValue, killActor,rewardDescription,heso)
    {
        let isUpdateBalance =  false; 
        switch(this.FishProperties.FishType)
        {
            case Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE:
               // this.SetFishDieNoScore();
                break;
            case Global.Enum.FISH_TYPE_CONFIG.WHEEL_TYPE:
                break;
            case Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_1:  
            case Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_2:
            case Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_3:                   
                     Global.InGameManager.creatEffectWinMiniBoss(killActor, Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, 
                        cc.v2(-480,-135)), this.FishProperties.FishType, heso, fishValue, this.node.getPosition());
                        Global.InGameManager.SetValueWinElectric(killActor, fishValue, true);
                        Global.InGameManager.InGameSoundManager.playKillBigFishRandomSoundEffect();
                 //   this.SetFishDieNoScore();
                    let isUpdateBalance =  true; 
                    break;
            case Global.Enum.FISH_TYPE_CONFIG.ELECTRIC_FISH_TYPE: 
            case Global.Enum.FISH_TYPE_CONFIG.FISH_BOOM_TYPE:
            case Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE:
            case Global.Enum.FISH_TYPE_CONFIG.LAZE_FISH_TYPE:                      
                break;
            case Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINI_JACKPOT: 
            case Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINOR_JACKPOT: 
            case Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MAJOR_JACKPOT: 
            case Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GRAND_JACKPOT:
                Global.InGameManager.FishPoolInstance.createScore(this.node.getPosition(), fishValue, killActor.actorPropertis.AccountId == Global.GameLogic.mainActor.actorPropertis.AccountId);
                Global.InGameManager.creatEffectWinElectricFisht(killActor, Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)), this.FishProperties.FishType, true);
                isUpdateBalance = true;
                break;
           
            case Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE:
                try {  
                    killedFish.GoDie(killedFishId);
                    Global.InGameManager.shakeScrenn(1);  
                } catch {
                    
                }
                break;  
            case Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_PHOENIX:
            case Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_BLACK_DRAGON:
            case Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_FROG_1M:
            case Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_DARK_MONSTER:
                break;  
            case Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_MULTI_DRILL:
                break;  
            case Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_THUNDER_SOLO:
                break;  
            default:  
                Global.InGameManager.shakeScrenn(1);
                if(killActor != null)
                    killActor.ShowEffectBigWin(fishValue, heso, this);
        }
        return isUpdateBalance;
    },
    CheckPositionInScreen(){       
        if(this.node.x < 800 &&  this.node.x > -800 && this.node.y < 350 && this.node.y > -350 ){
            return true;
        }
        return false;
    },
    GetFishPos()
    {

    },
    Handle_RotateFowardPath(angleValue)
    {
        
    }
});
