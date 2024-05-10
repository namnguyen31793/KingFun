cc.Class({
    extends: cc.Component,
    ctor() {
        this.timer = null;
        this.heso = 1;
        this.countTime = 0;
        this.isCount = false;
        this.TIME_COUNT = 1.5;
        this.fishIdTarget = -1;
        this.accountId = 0;
        this.killActor = null;
        this.totalWin = 0;
        this.surplus = 0;
        this.isCollision = false;
        this.fishValue = 0;
        this.fishType = 0;
    },

    properties: {
        isMove:true,
        BoomSoundEffects: {
            default: null,
            type: cc.AudioClip,        
        },
    },

    onLoad () {
        
        this.limitTop = 360;
        this.limitBottom = -360
        this.limitRight = 640;
        this.limitLeft = -640;
        this.lifeTime = 8;
    },

    Init(type , id , isMe, _targetId){
        this.getComponent(cc.Collider).enabled = true;
        this.vx = 900 * Math.sin(-this.node.angle * Math.PI / 180);
        this.vy = 900 * Math.cos(-this.node.angle * Math.PI / 180);
        this.type = type;
        this.id = id;
        this.isMe = isMe
        this.node.scale = 1;
        this.isMove = true;
        this.lifeTime = 4;
        this.fishIdTarget = _targetId;
       
    },

    Init_MultiDrill(type , id , isMe, _targetId, heso,fishValue){
        this.getComponent(cc.Collider).enabled = true;
        this.vx = 900 * Math.sin(-this.node.angle * Math.PI / 180);
        this.vy = 900 * Math.cos(-this.node.angle * Math.PI / 180);
        this.type = type;
        this.id = id;
        this.isMe = isMe
        this.node.scale = 1;
        this.lifeTime = 12;
        this.fishIdTarget = _targetId;
        this.heso = heso;
        this.countTime = 0;
        
        this.fishValue = fishValue;
       
        this.isCount = true;
        Global.InGameManager.shakeScrenn(0.3);
        this.isMove = false;
        switch(this.type)
        {
            case Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE:  
                this.fishType = Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE;
                break;
            case Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID:
                this.fishType = Global.Enum.FISH_TYPE_CONFIG.LAZE_FISH_TYPE;
                break;
        }
       
      
    },

    ReCalculatorVelocity() {
        this.vx = 900 * Math.sin(-this.node.angle * Math.PI / 180);
        this.vy = 900 * Math.cos(-this.node.angle * Math.PI / 180);
    },

    SetInfoBullet(accountId, timeCount, surplus, type) {
        this.surplus = surplus;
        this.accountId = accountId;
        this.killActor = require("ActorCollection").getIns().GetActorByPlayerId(this.accountId);
        this.TIME_COUNT = timeCount;
        if(this.type == Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID) {
            cc.find("img" , this.node).active = true;
            cc.find("Drill" , this.node).active = false;
            this.isCount = false;
        }
    },

    update (dt) {
        if(!this.isMove) return;
        if(this.isCount) {
            this.countTime += dt;
            if(this.countTime >= this.TIME_COUNT) {         
                if(this.type == Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID|| this.type == Global.Enum.FISH_TYPE_CONFIG.MULTI_DRILL_ID) {
                    Global.InGameManager.shakeScrenn(1.3);
                    Global.InGameManager.FishPoolInstance.creatEffectBoom2(this.node.getPosition());
                    cc.audioEngine.playEffect(this.BoomSoundEffects, false);
                    this.node.active = false;
                    this.isMove = false;
                    this.EndBullet();
                }
                
                return;
            }
        }

        let vx = this.vx * dt* this.heso;
        let vy = this.vy * dt* this.heso;
        let x = this.node.x += vx;
        let y = this.node.y += vy;
        if (x >= this.limitRight || x <= this.limitLeft)
        {
          
            this.vx *= -1;
            vx = this.vx * dt;
            x = this.node.x += vx;
            this.lifeTime--;
            if(this.type == Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID || this.type == Global.Enum.FISH_TYPE_CONFIG.MULTI_DRILL_ID) {
                Global.InGameManager.shakeScrenn(0.25);
            }
                
            this.fishIdTarget = -1;
            this.node.angle = -this.node.angle;
            if(x >= this.limitRight){
                this.node.x = this.limitRight - 1;
                
            }else{
                this.node.x = this.limitLeft + 1;
            }
        
            
        }
        if (y >= this.limitTop || y <= this.limitBottom)
        {
            // cc.log("doc:"+this.lifeTime+"   "+this.limitTop+"  "+this.limitBottom+"    "+y+"   "+vy+"   "+this.vy+"    "+this.node.y);
            this.vy *= -1;
            vy = this.vy * dt;
            y = this.node.y += vy;   
            this.node.angle = -180 - this.node.angle;
            if(y >= this.limitRight){
                this.node.y = this.limitTop - 1;
            }else{
                this.node.y = this.limitBottom + 1;
            }
            this.lifeTime--;
            if(this.type == Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID)
                Global.InGameManager.shakeScrenn(0.25);
            this.fishIdTarget = -1;
        }
        if (this.lifeTime < 1 && !this.isCount)
        {
            // cc.log(this.lifeTime);
            this.countTime = 0;
            this.isCount = true;
            this.heso = 0.15;
            cc.find("img" , this.node).active = false;
            cc.find("Drill" , this.node).active = true;
            cc.find("Drill" , this.node).getComponent(cc.Animation).play();
            
        }
        this.node.x = x;
        this.node.y = y;
    },

    onCollisionEnter(other , self){
        if(!this.isCollision)
            return;
        let fishCollision = other.node.getComponent("Fish");
        if(fishCollision == null)
            return;
        let mFishProperties = fishCollision.FishProperties;
        if(mFishProperties == null)
            return;
        if(fishCollision)
        {
          
            fishCollision.biBan();
            if(fishCollision.FishProperties.FishType < 10 &&  this.totalWin < this.fishValue )
            {
                fishCollision.reoveFishHaveEffect();
                if(this.killActor != null)
                {
               
                this.totalWin += (this.fishValue/20);     
                 ;         
                }
            }
        }
        let timeWait = 0;
        if(this.type != Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID) {
            timeWait = Global.RandomNumber(0,15)/10;
        }
       
    },

    CheckCollsion(){
        let listFish = require("FishCollection").getIns().listFish;
        let point = new cc.Vec2(this.node.x, this.node.y);
        for(let temp in listFish){
            let x = listFish[temp].node.x + listFish[temp].listColider[0].offset.x;
            let y = listFish[temp].node.y + listFish[temp].listColider[0].offset.y;
            let w = listFish[temp].listColider[0].size.width;
            let h = listFish[temp].listColider[0].size.height;
            let rect = new cc.Rect(x-w/2,y-h/2,w,h);
            if(rect.contains(point)) {
                this.onCollisionEnter(listFish[temp], null);
            }
		}
    },

    SendHitFishRequest(fishId) {
        let msg = {};
        msg[1] = Global.Helper.formatString("{0},{1},{2}", [fishId, this.type, this.id]);
        require("SendRequest").getIns().MST_Client_Fish_Collision(msg);
    },

    SendHitJackpot(fishId) {
        let msg = {};
        msg[1] = Global.Helper.formatString("{0},{1},{2}", [fishId, this.type, this.id]);
        require("SendRequest").getIns().MST_Client_Shooting_Jackpot(msg);
    },

    removeBullet(){
        this.getComponent(cc.Collider).enabled = false;
        this.node.destroy();
    },

    EndBullet(fishAffect = null) {
        let timeWait = 0.3;
        if(this.type != Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID) {
            timeWait = 0;
        }
        
        
            this.scheduleOnce(()=>{
                if(fishAffect == null)
                    fishAffect = require("FishCollection").getIns().GetListFishIdInScene (cc.winSize.width/2, 350);
                 let affectDeathFishList =  require("FishCollection").getIns().GetRandomFishInSceneView (cc.winSize.width/2, 350,fishAffect.length/2);
                //let data = Global.ServerBot.GetListFishDieByMultiElectric(Global.ServerBot.GetSurplusSpecial(this.accountId), fishAffect);            
                let surplus = 0;
                if(this.killActor == null) {
                    this.removeBullet();
                    Global.ServerBot.RemoveSpecialFish(this.accountId);
                    return;
                }
                let multiGun = this.killActor.GetMoneyPerShotByCurrentGunId();
                this.fishValue = this.fishValue * multiGun;
                if(this.killActor != null && this.killActor.actorPropertis != null) {                   
                   // this.killActor.ChangeGun(this.killActor.actorPropertis.CacheGun);
                    let perWin = this.fishValue/affectDeathFishList.length;
                    let totalWin = 0;
                for(let i = 0; i < affectDeathFishList.length; i++) 
                {
                    totalWin += perWin;
                            let fishDie = require("FishCollection").getIns().GetFishById(affectDeathFishList[i].FishProperties.FishId);
                            if(fishDie != null && fishDie.FishProperties != null) 
                            {                           
                                fishDie.reoveFishHaveEffect ();
                                Global.ServerBot.ServerKillFish(fishDie.FishProperties.FishId);                              
                            }
                } 
              

                Global.ServerBot.RemoveSpecialFish(this.accountId);                            
                this.killActor.UpdateBalance(this.fishValue, true);
                

                this.removeBullet();
                this.killActor.On_Attack();    
                } else {  
                    this.removeBullet();
                Global.ServerBot.RemoveSpecialFish(this.accountId);
                }
            } , timeWait); 
        
        
        
    },

   
    Handle_OnCanAttack(killActor)
    {
        if(killActor != null)
            killActor.On_Attack();    
    }


});
