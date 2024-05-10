

cc.Class({
    extends: cc.Component,
    ctor() {
        this.actor = null;
        this.isGunVip = false;
        this.cacheBullet = null;
        this.ShootingAnimation = null;
       // this.gunProperties = null;
       
    },

    properties: {
        imgGun : cc.Sprite,
        imgGun2 : cc.Sprite,
        imgFire : cc.Sprite,
        posBullet : cc.Node,
        lazeView : cc.Node,
        startBoom : cc.Node,
        startDrill : cc.Node,
        posBulletSpecial : [cc.Node],
        //gun vip
        fireVip : cc.Node,
        bulletVip : cc.Node,
        hitVip : cc.Node,
        GunSpine : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    Init(actor) {
        this.isGunVip = false;
        this.actor = actor;
        this.node.active = true;
        this.lazeView.active = false;
        this.startBoom.active = false;
        this.startDrill.active = false;
        this.ChangeGunUi(actor.actorPropertis.CurrentGunId);

        this.gunProperties = {

        }
        this.CreateGunByVipId();  
      

    },
    CreateGunByVipId()
    {
       
       let vipId = (this.actor.actorPropertis.VipId % 12)+1;
     
       var self = this;
        cc.resources.load('SpinHub-Fish/Prefabs/GunPrefab/GunUI_'+vipId, cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadLocalPrefab("GameFish3/NewGun/GunPrefab/"+"GunUI_"+vipId,(prefab)=>{
            try{
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                let gunNode = cc.instantiate(prefab);
                let yPos = -95;
            
                    yPos = -10;
        
                gunNode.setPosition(cc.v2(0,yPos));
                gunNode.active = true;    
                gunNode.setScale(cc.v2(0.8,0.8)) ;                                                   
                self.node.addChild(gunNode);
                self.GunSpine = gunNode;  
                self.ShootingAnimation = gunNode.getComponent(cc.Animation);
                /*
                self.GunSpine_Animation = self.GunSpine.getComponentInChildren("sp.Skeleton");
                self.GunSpine_Animation.setAnimation(0,'Idle',true);        
                */
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }  
    });
   


    },
    CreateGunProperties()
    {
        //let
    },

    Remove() {
        this.node.active = false;
    },

    getPosCreateBullet() {
        let worldPos = this.node.convertToWorldSpaceAR(this.posBullet.getPosition());
        let viewPos = Global.InGameManager.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
        // return this.imgGun.node.getPosition().addSelf(this.posBullet.getPosition()).addSelf(this.node.getPosition());
    },

    ChangeGunVip() {
        if(Global.InGameManager.inBackGround)
            return;

        this.isGunVip = true;
        this.node.angle = 0;
        this.actor.effectChangeGun.play();
        let listImgGun = Global.InGameView.listImgGunSpecial;
        this.imgGun.spriteFrame = listImgGun[2];
        this.imgGun2.spriteFrame = listImgGun[2];
        this.GunSpine.active = false;
    },

    ChangeGunNormal() {
        this.isGunVip = false;
        this.ChangeGunUi(this.actor.actorPropertis.CurrentGunId);
    },

    ChangeGunUi(newGunId, isSpecialGun = false) {
 
            if(!isSpecialGun)
            {
                if(this.GunSpine != null)
                {
                    this.GunSpine.active = true;            
                    this.CreateGunByVipId();
                }
            }
    },

    ChangeGun_SpecialGunUI(newGunId,fishValue)
    {
        if(Global.InGameManager.inBackGround)
            return;
        this.actor.effectChangeGun.play();
        let listImgGun = Global.InGameView.listImgGunSpecial;
        this.imgGun.spriteFrame = listImgGun[newGunId-101];
        this.imgGun2.spriteFrame = listImgGun[newGunId-101];
        if(newGunId ==Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID) {
            this.lazeView.active = true;    
           // Global.ServerBot.modulePlayEffect.PlayEffectLaze();  
           Global.InGameManager.createEffectLaze(this.posBulletSpecial[0], this.actor);
        }
       
        if(newGunId ==Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID) {
            if(!this.actor.actorPropertis.VipId)
                this.actor.actorPropertis.VipId = 1;            
            this.cacheBullet = Global.InGameManager.FishPoolInstance.createSpecialBullet(this.actor.gunValue, this.getPosCreateBullet() , -this.node.angle ,Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID, this.actor.actorPropertis.VipId, 9999 , false, -1, this.actor.actorPropertis.AccountId, this.node,fishValue);
        }           
    },

  

    Handle_AutoForcus_TargetFish(targetFish)
    {
        if(targetFish == null)
        {       
            return false;
        }
        if(targetFish.node == null)
        {     
            return false;
        }
        
        let v2Touch = targetFish.node.getPosition();
        let worldPos = this.node.parent.convertToWorldSpaceAR(v2Touch);
       //let v2Touch = cc.v2(0,0);
        let posGun = this.getPosCreateBullet();
        let distance = cc.v2(worldPos.x - posGun.x , worldPos.x - posGun.y ).mag();
        let time = distance/1800;
        let vecTarget = targetFish.UpdatePositionByTime(targetFish.currentMoveTime + time);
     
        if(vecTarget == null)
            return;
       // let vecTarget = cc.v2(0,0);
        var diff =  vecTarget.subSelf(posGun);
        var angle = Math.atan2( diff.x , diff.y) * 180 /   Math.PI;
        //let pos = targetFish.node.getPosition();
        //cc.log("targetFish: X:"+pos.x + " | Y:"+pos.y);
      
        /*
        if(angle < -90 || angle > 90)
        {         
            return false;
        }
        */

        this.node.angle = -angle;
         return true;
    },

    Handle_AutoForcus_RandomPoint(randomPoint)
    {
        if(randomPoint == null)
            return false;
       
        
       // let v2Touch = targetFish.node.getPosition();
       let v2Touch = randomPoint;
        let posGun = this.getPosCreateBullet();
        let distance = cc.v2(v2Touch.x - posGun.x , v2Touch.x - posGun.y ).mag();
        let time = distance/900;
        //let vecTarget = targetFish.UpdatePositionByTime(targetFish.currentMoveTime + time);
        let vecTarget = randomPoint;
        var diff =  vecTarget.subSelf(posGun);
        var angle = Math.atan2( diff.x , diff.y) * 180 /   Math.PI;

        this.node.angle = -angle;
         return true;
    },

    Handle_ShowAnimationGun()
    {
        if(this.ShootingAnimation != null)
            this.ShootingAnimation.play();  
        this.node.getComponent(cc.Animation).play();   
       return;
        if(this.GunSpine_Animation != null)
        {
           
        let animationState = this.GunSpine_Animation.findAnimation('Shoot');
            if(animationState)
                this.GunSpine_Animation.setAnimation(0,'Shoot',false);   
            else
            {   
                let animationState_Vip4 = this.GunSpine_Animation.findAnimation('AdvanceShoot');
                if(animationState_Vip4)
                    this.GunSpine_Animation.setAnimation(0,'AdvanceShoot',false);   
                else
                    this.GunSpine_Animation.setAnimation(0,'Gun_Shoot',false);   
            }
         
        }
        else
            this.node.getComponent(cc.Animation).play();   
    },

    Handle_DestroyGun()
    {
        if(this.GunSpine != null)
        {
            this.GunSpine.destroy();
            this.GunSpine = null;
        }
    }
});
