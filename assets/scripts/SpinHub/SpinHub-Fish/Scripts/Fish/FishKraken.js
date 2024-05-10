

cc.Class({
    extends: require("Fish2D"),
    ctor() {
        this.index = 0;
        this.countTime = 0;
        this.imgKraken = null;
    },

    properties: {
        listPosKraken: {
            default: [],
            type: cc.Vec2
        },
        listPosCollider: {
            default: [],
            type: cc.Vec2
        },
        listImg : [cc.SpriteFrame],
        attackPoint : cc.Node,
        clonePoint : cc.Node,
    },

    start() {
        this.imgKraken = this.img.getComponent(cc.Sprite);
    },

    Init(properties) {
        require("FishCollection").getIns().AddToTalFish();
        // this._super(properties);
        this.FishProperties = properties;
        this.currentFishStatus = 2;
        this.inRun = true;
        this.isDie = false;
        this.isPreDie = false;
        this.velocityBullet = null;
        if(this.lightingObj != null)
            this.lightingObj.active = false;
        this.vectorDireciton = Global.Helper.GetPositionSliceBySittingId(Global.GameLogic.mainActor.actorPropertis.SittingId , cc.v2(1,1));
        this.EnableAttackPoint(true);
    },

    SetSpeedAnimationByMove(speed){
        
    },

    SetupRoadList(){
    },

    updateCurrentMoveTime(){
        this.currentMoveTime = 0;
    },

    HandleFishMove(deltaTime)
    {
        this.currentMoveTime += deltaTime;
    },

    update (dt) {
        if(Global.InGameManager.isIce) return;
        if(!this.inRun) return;
        this.countTime += dt;
        if(this.countTime >= 0.1) {
            this.countTime = 0;
            this.index += 1;
            if(this.index >= this.listImg.length)
                this.index = 0;
            this.SetPositionKraken();
        }
        // if(this.currentFishStatus == 5){
        //     this.HandleFishMove(dt*5);
        // }else{
        //     this.HandleFishMove(dt);
        // }  
    },

    EnableAttackPoint(active) {
        this.attackPoint.active = active;
    },

    GoDie(fishId) {
        let posWorld = this.attackPoint.parent.convertToWorldSpaceAR(this.attackPoint);
        let posInGameView = Global.InGameManager.FishContainer.FishPoolInstance.convertToNodeSpaceAR(posWorld);
     
        this.EnableAttackPoint(false);
        this.reoveFishHaveEffect();
       
    },

    reoveFishHaveEffect(){
        for(let i = 0 ; i < this.listColider.length ; i++){
            this.listColider[i].enabled = false;
        }
        this.inRun = false;
        this.isDie = true;
        // let anim = this.node.getComponent(cc.Animation);
        // if(anim != null) {
        //     let action = cc.callFunc(()=>{
        //         this.SetSpeedAnimationByMove(0);
        //         this.playAnimDie = true;
        //         anim.play();
        //     });
        //     this.node.runAction(cc.sequence(cc.delayTime(1.2), action));
            
        // }
        // else {
        //     this.SetSpeedAnimationByMove(8);
        //     this.node.runAction(cc.fadeOut(1.2));
        // }
        this.scheduleOnce(()=>{
            this.reoveFishNoEffect();
        }, 2.1);
        for(let i = 0; i < this.animationState.length; i++)
            this.animationState[i].speed = 0;
        var action = cc.fadeOut(1.0);
        this.node.runAction(action);
    },

    reoveFishNoEffect(){
        this.unscheduleAllCallbacks();
        this.node.active = false;
        require("FishCollection").getIns().SubToTalFish();
    },

    UpdatePositionByTime(currentTime)
    {
        let distance = (currentTime - this.currentMoveTime)/10;
        let calIndex = parseInt((distance + this.index)%this.listPosCollider.length);
        this.clonePoint.setPosition(this.listPosCollider[calIndex]);
        let posWorld = this.attackPoint.parent.convertToWorldSpaceAR(this.clonePoint);
        let posInGameView = Global.InGameManager.FishContainer.FishPoolInstance.convertToNodeSpaceAR(posWorld);
        return posInGameView;
    },

    SetPositionKraken() {
        this.imgKraken.spriteFrame = this.listImg[this.index];
        this.img.setPosition(this.listPosKraken[this.index]);
        this.attackPoint.setPosition(this.listPosCollider[this.index]);
    },

    RePlay() {
        this.animation = this.getComponentsInChildren(cc.Animation);
        for(let i = 0; i < this.animation.length; i++)
            this.animationState[i] = this.animation[i].play();
    },

    onLoad() {
        this.listColider = this.attackPoint.getComponents(cc.Collider);
        this.animation = this.getComponentsInChildren(cc.Animation);
        for(let i = 0; i < this.animation.length; i++)
            this.animationState[i] = this.animation[i].play();
    },
});
