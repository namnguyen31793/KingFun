
cc.Class({
    extends: cc.Component,
    ctor() {
        this.timer = null;
        this.isCollision = false;
        this.accountId = 0;
        this.vipId = 0;
        this.gunValue = 0;
    },

    properties: {
        isMove:true,
        fishIdTarget : -1,
    },

    onLoad () {
        
        this.limitTop =  cc.winSize.height/2;;
        this.limitBottom = -cc.winSize.height/2;;
        this.limitRight = cc.winSize.width/2;
        this.limitLeft = -cc.winSize.width/2;
        this.lifeTime = 4;
    },

    onEventShow() {
        clearInterval(this.timer);
    },

    Bullet_Init(gunValue, type, vipId, id , isMe, _targetId, accountId){
        this.gunValue = gunValue;
        this.accountId = accountId;
        this.vipId = vipId;
        this.getComponent(cc.BoxCollider).enabled = true;
        this.isCollision = false;
        this.vx = 900 * Math.sin(-this.node.angle * Math.PI / 180);
        this.vy = 900 * Math.cos(-this.node.angle * Math.PI / 180);      
        this.type = type;  
        this.id = id;
        this.isMe =  isMe;
        this.node.scale = 1;
        this.isMove = true;
        this.lifeTime = 4;
        this.fishIdTarget = _targetId;
      
    },

    update (dt) {
        if(!this.isMove) 
        return;
        let vx = this.vx * dt;
        let vy = this.vy * dt;
        let x = this.node.x += vx;
        let y = this.node.y += vy;
        if (x >= this.limitRight || x <= this.limitLeft)
        {
            this.vx *= -1;
            vx = this.vx * dt;
            x = this.node.x += vx;
            this.lifeTime--;
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
            if(y >= this.limitTop)
            {
                y = this.limitTop - 2;
               
            }else{
                y = this.limitBottom + 2;
             
            }
          
            this.vy *= -1;  
            vy = this.vy * dt;
            y = y += vy;   
            this.node.angle = -180 - this.node.angle;
         
            this.lifeTime--;
            this.fishIdTarget = -1;
       
              
        }
       
        this.node.x = x;
        this.node.y = y;
   
   
    },

    onCollisionEnter(other , self){
      
        
        if (this.isCollision)
        {
           
            return;
        }
        let fishCollider = other.node.getComponent("FishCollider");
        let fishCollision = other.node.getComponent("Fish");
        if(fishCollider != null) {
            fishCollision = fishCollider.fish;           
        } else {
            if(fishCollision == null)
            {          
                fishCollision = other.node.parent.parent.getComponent("Fish");            
            }
            else
            {
                // fish in group
                if(fishCollision == null)
                    fishCollision = other.node.getComponent("FishElement");
                //cc.log("WARNING: --- COLLISION"); 
            }
        }
        let name = other.node.name;
       
        if(name == "Shield") {
            if(fishCollision.CheckBouncing()) {
                if(this.vx > this.vy) {
                    this.vx *= -1;
                    this.node.angle = -this.node.angle;
                } else {
                    this.vy *= -1;
                    this.node.angle = -180 - this.node.angle;
                }
                return;
            }
        }
        let mFishProperties = fishCollision.FishProperties;
        if(mFishProperties == null)
        {
          
            return;
        }
            
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MERCHANT != 3  && mFishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GRAND_JACKPOT) {
                if(this.gunValue < 5000)
                    return;
            }
        if(this.fishIdTarget != -1){
            let objFish = require("FishCollection").getIns().listFish;
            if(objFish[this.fishIdTarget] != null){
                if(fishCollision.FishProperties.FishId !=  this.fishIdTarget) return;
            }
        }
        if(fishCollision) {
            fishCollision.setVelocityBullet(cc.v2(this.vx, this.vy));
            fishCollision.biBan();
        }   
        
        this.isMove = false;
        this.isCollision = true;
        let indexBullet = this.vipId;
        if(Global.isOffline) {
            indexBullet = this.type;
        }
        Global.InGameManager.FishPoolInstance.creatSnare(this.node.getPosition() , indexBullet, this.isMe);
        this.removeBullet();

        if(fishCollision.isPreDie) 
            return;
        if(this.isMe == true){          
            this.SendHitFishRequest(fishCollision.FishProperties.FishId, fishCollision.FishProperties.FishType, fishCollision.FishProperties.fishBonusDescription);

        } else {
           
            this.SendOtherHitFishRequest(fishCollision.FishProperties.FishId, fishCollision.FishProperties.FishType, fishCollision.FishProperties.fishBonusDescription);
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

    SendHitFishRequest(fishId, fishType,fishBonusDescription) {
        let msg = {};
        msg[1] = Global.Helper.formatString("{0},{1},{2},{3},{4}", [fishId, this.type, this.id, fishType, this.accountId]);    
        if(fishBonusDescription !== "")
        {
            msg[2] =  fishBonusDescription;      
        }
        require("SendRequest").getIns().MST_Client_Fish_Collision(msg);
    },

    SendOtherHitFishRequest(fishId, fishType,fishBonusDescription) {
        let msg = {};
        msg[1] = Global.Helper.formatString("{0},{1},{2},{3},{4}", [fishId, this.type, this.id, fishType, this.accountId]);
        if(fishBonusDescription !== "")
        {
            msg[2] =  fishBonusDescription;    
           
        }
        require("SendRequest").getIns().MST_Client_Other_Fish_Collision(msg);
    },

    removeBullet(){
        this.getComponent(cc.BoxCollider).enabled = false;
        let indexBullet = this.vipId;
        if(Global.isOffline) {
            indexBullet = this.type;
        }
        Global.InGameManager.FishPoolInstance.RestoreBullet(indexBullet,this.node);
        
        // Global.InGameManager["poolB" + indexBullet].put(this.node);
    }
});  
