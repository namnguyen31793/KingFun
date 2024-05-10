var TIME_LEAVE_BY_NOT_ENOUGH_MONEY = 40;
var TIME_CHANGE_GUN = 20;

cc.Class({
    extends: cc.Component,
    ctor() {
        this.isActive = false;
        this.actor = null;
        this.timeUpdate = 0;
        this.fishTarget = null;
        
        // this.timeDelay = 0.3;
        this.countTime = 0;
        this.countTimeChangeGun = 0;
        this.isCountTime = true;
        this.state = 0; //1-het tien,2-moi vao,3-cho remove
        this.timeChangeGun = 0;
        this.botType;
        this.existsTime = 0;
    },

    properties: {
        playObj : cc.Node,
    },

    onEnable() {
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            this.state = 3;
            return;
        }
        this.state = 0;
        this.timeDelay = Global.GameConfig.SystemGameConfig.TimeNormalShoot;
        this.timeChangeGun = Global.RandomNumber(20,31);
        if(Global.ServerBot.isBot) {
           
            /*
            this.scheduleOnce(()=>{
                this.isActive = true;
            } , 1);
           */
            this.actor = this.node.getComponent("Actor");
            this.setBotType();
           
        }
    },

    onDisable() {
        this.isActive = false;
        this.clear();
    },

    clear() {
        this.state = 0;
        this.countTime = 0;
    },
    setBotType()
    {
        let rand = Global.RandomNumber(0,100) % 4;  
        if(rand == 0)
            rand = Global.Enum.FISHING_BOT_TYPE.SPAM;
        this.botType = rand;     
        if(this.actor.AccountBalance <= 5000)
            this.botType = Global.Enum.FISHING_BOT_TYPE.NOT_SHOOTING
        
       // this.botType = Global.Enum.FISHING_BOT_TYPE.NOT_SHOOTING;
        rand = Global.RandomNumber(0,2);
       
        this.existsTime = rand*7 + 8;
        //this.timeDelay =  Global.GameConfig.SystemGameConfig.TimeNormalShoot * Global.RandomNumber(1,3) ;
        const min = 1.0;
        const max = 2.7;
        const randomNumber = min + Math.random() * (max - min);
        this.timeUpdate = Global.GameConfig.SystemGameConfig.TimeNormalShoot;
        this.timeDelay =  Global.GameConfig.SystemGameConfig.TimeNormalShoot * randomNumber;
        this.isActive = true;
    },

    autoAtack(){
       
     
            if(!this.actor.isAttack)
                return;

           if(this.botType ==  Global.Enum.FISHING_BOT_TYPE.NOT_SHOOTING)
            return;

            let randValue = Global.RandomNumber(0,100);
          
            if(randValue < 3)
            {
                this.setBotType();
                return;
            }
            if(this.botType == Global.Enum.FISHING_BOT_TYPE.IDLE)
                return;
            else if(this.botType ==  Global.Enum.FISHING_BOT_TYPE.LESS_SHOOTING)
            {
                if(randValue < 20)
                return;
            }
           
            if(randValue < 5)
                return;
           

            let obj = require("FishCollection").getIns().listFish;
            if(this.fishTarget == null || !this.fishTarget.CheckPositionInScreen() || obj[this.fishTarget.FishProperties.FishId] == null ){
                let indexrd = Global.RandomNumber(0 , this.getLengthObj(obj));
                let count = 0;
                for(let temp in obj){
                    let fish = obj[temp];
                    count++;
                    if(count >=indexrd && this.checkFishInScreen (fish)){
                        this.fishTarget = fish;
                        break;
                    }
                }
            }
            if( this.fishTarget != null && obj[this.fishTarget.FishProperties.FishId] != null){
                if(Global.InGameManager.numberFishInScene >= 3 || (Global.InGameView.indexBg == 4 && Global.GameLogic.kraken != null && Global.GameLogic.kraken.listKraken != null &&
                    Global.GameLogic.kraken.listKraken.GetCount() >= 2)) {
                        let v2Touch = this.fishTarget.node.getPosition();
                        this.CreateNormalShootingBullet(v2Touch);                     
                        this.playerAtack();
                }              
            }

            if(Global.InGameManager.numberFishInScene <= 3)
            {
                if(this.botType == Global.Enum.FISHING_BOT_TYPE.IDLE)
                return;
             
                let rand = Global.RandomNumber(0,100);
                if(rand < 20 ||  this.randomPos == null)
                {
                let xRandomValue =    Global.RandomNumber(-600,600);              
                let yRandomValue = Global.RandomNumber(-300,300);
                this.randomPos = cc.v2(xRandomValue,yRandomValue);
                }

                if(this.botType == Global.Enum.FISHING_BOT_TYPE.LESS_SHOOTING)
                {
                    if(rand > 75)
                    return;
                }
                this.CreateNormalShootingBullet(this.randomPos);       
                        this.playerAtack();
            }        
       
       
       
    },


    checkFishInScreen(fish)
    {
        if(fish == null)
         return false;
        if(fish.listColider[0] == null)
        return false;
        let x = fish.listColider[0].offset.x;
        let y = fish.listColider[0].offset.y;

        const screenLeft = -640 
        const screenRight = 640
        const screenBottom = -360
        const screenTop = 360


        let   objectWorldPosition = fish.node.convertToWorldSpaceAR(cc.v2*(x,y));
        let objectInScreen =
        objectWorldPosition.x >= screenLeft &&
        objectWorldPosition.x <= screenRight &&
        objectWorldPosition.y >= screenBottom &&
        objectWorldPosition.y <= screenTop;
     
        return objectInScreen;
    },

    getLengthObj(obj){
        let size = 0;
        for(let temp in obj){
            if(obj.hasOwnProperty(temp))size++;
        }
        return size
    },
    ClickShotSpecial() {
        this.ChangeRotateGun();      
        this.isCountTime = false;

        this.ChangeParentForDrillBullet();  
        if(this.actorPropertis.CurrentGunId ==Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID)
        {        
          Global.ServerBot.modulePlayEffect.PlayEffectLaze();
         }
         if(this.actorPropertis.CurrentGunId ==Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID)
        {
          this.PlaySpecialGun();
          this.scheduleOnce(()=>{
            if(this.actor.actorPropertis.CurrentGunId ==Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID) {
                Global.ServerBot.RemoveBot(this.actor);
            }
        } , 20);
         }
    },

    


    BackToShot() {
       
        let timeWait = Global.RandomNumber(3,6);
        this.scheduleOnce(()=>{
                
            this.actor.On_Attack();
            this.isCountTime = true;     
        } , timeWait);
        
    },

    Stop() {
        this.countTime = 0;
        this.state = 1;
        this.isActive = false;
    },

    Delay(time, timeEvent = 0, event = null) {
        this.isActive = false;
        if(event != null) {
            this.scheduleOnce(()=>{
                event();
            } , timeEvent);
        }
        this.scheduleOnce(()=>{
            this.isActive = true;
        } , time);
    },

    UpGun() {
        if(this.actor.actorPropertis.CurrentGunId > 1 && this.actor.actorPropertis.CurrentGunId <= 7) {      
            this.actor.ChangeGun(this.actor.actorPropertis.CurrentGunId-1);
            this.BackToShot();
        }
    },

    DownGun() {
        if(this.actor.actorPropertis.CurrentGunId < 7) {      
            this.actor.ChangeGun(this.actor.actorPropertis.CurrentGunId+1);
            this.BackToShot();
        }
    },

    update (dt) {
        if(Global.InGameManager == null || Global.InGameManager.inBackGround)
            return;
        if(!Global.isConnect)
            return;
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            return;
        }
        if(this.state == 3) {
            return;
        }
        if(!this.actor.isAttack)
        {
            return;
        }
       
            
        if(this.state != 0 && this.isCountTime ) {
            this.countTime += dt;
            if(this.state == 1) {
                if(this.countTime >= TIME_LEAVE_BY_NOT_ENOUGH_MONEY) {
                    this.state = 3;
                    Global.ServerBot.RemoveBot(this.actor);
                    return;
                }
            }
        }
        if(this.isActive) {
            this.countTimeChangeGun += dt;
            if(this.countTimeChangeGun >= this.timeChangeGun) {
                this.countTimeChangeGun = 0;
                this.timeChangeGun = Global.RandomNumber(20,31);
                let check = Global.RandomNumber(0,100);
                if(check < 20) {
                    this.DownGun();
                    return;
                    // this.Delay(Global.RandomNumber(20,40)/10, 1.5, this.DownGun());
                } else if(check < 50) {
                    this.UpGun();
                    return;
                    // this.Delay(Global.RandomNumber(20,40)/10, 1.5, this.UpGun());
                } else {
                    // this.Delay(3);
                }
            }
        }
     

        if(this.isActive && Global.ServerBot.botAttack) {
            this.timeUpdate += dt;
            if(this.timeUpdate < this.timeDelay) return;     
            if(this.botType != Global.Enum.FISHING_BOT_TYPE.NOT_SHOOTING)
                 this.actor.Handle_AutoShooting();
          
            this.timeUpdate = 0; 
           // return;
        }
        
        if(this.existsTime > 0)
        {
            this.existsTime -= dt;
           
            if(this.existsTime <= 0)
            {
                this.existsTime = 0;
              
                Global.ServerBot.RemoveBot(this.actor);
            }       
        }
        
    },

    ChangeRotateGun() {
        if(this.actor.actorPropertis.SittingId == 3) {
            this.actor.gun.node.angle = Global.RandomNumber(15,61);
            cc.log("ChangeRotateGun : 3 ");
        } else if(this.actor.actorPropertis.SittingId == 5) {
            cc.log("ChangeRotateGun : 5 ");
            this.actor.gun.node.angle = Global.RandomNumber(105,151);
        } else if(this.actor.actorPropertis.SittingId == 7) {
            cc.log("ChangeRotateGun : 7 ");
            this.actor.gun.node.angle = Global.RandomNumber(200,261);
        }
    },

  

    CreateNormalShootingBullet(v2Touch)
    {   
        let posGun = this.actor.gun.getPosCreateBullet();
        let distance = cc.v2(v2Touch.x - posGun.x , v2Touch.x - posGun.y ).mag();
        let time = distance/900;
        let vecTarget = v2Touch;
        var diff =  vecTarget.subSelf(posGun);
        var angle = Math.atan2( diff.x , diff.y) * 180 /   Math.PI; 
        this.actor.gun.node.angle = -angle;
    }
});
