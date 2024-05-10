

cc.Class({
    extends: require("Fish2D"),

    properties: {
        bulletImg : cc.Node,     
        fishImg : cc.Node,   
        ShootingSoundEffect: {
            default: null,
            type: cc.AudioClip,      
        },
      
    },

    Init(properties) {
        this.bulletImg.active = false;
       // this.animationState[0].play();
        this.fishAnimation = this.fishImg.getComponent(cc.Animation);
        this._super(properties);
    },

    reoveFishHaveEffect(fishValue, killActor,rewardDescription,heso){
        for(let i = 0 ; i < this.listColider.length ; i++){
            this.listColider[i].enabled = false;
        }
        this.inRun = false;
        this.isDie = true;

        this.node.runAction(
            cc.sequence
            (
                cc.delayTime(1.0),
                cc.moveTo(2, 0, 0),
                cc.delayTime(1.0),
                cc.callFunc(()=>{
                    this.Handle_LogicDeathFish(fishValue, killActor,rewardDescription);
                })
            )
        );

       
       // 
    },
    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {
       
   

    let rewardMatrix = JSON.parse(rewardDescription).Description_String;   
    this.matrixStr = rewardMatrix.split(",");
    this.timeShooting = this.matrixStr.length;
    this.index = 0;
    this.totalReward = fishValue;
    let shootingReward = this.matrixStr[this.index];
                   
    this.Handle_ShootDrill(shootingReward, killActor,rewardDescription);
  
    },

    Handle_ShootDrill(shootingReward, killActor,rewardDescription)
    {
        cc.log("--------Handle_ShootDrill---------");
        cc.log("shootingReward: "+shootingReward);
        cc.log("rewardDescription: "+rewardDescription);
        
        cc.audioEngine.playEffect(this.ShootingSoundEffect, false);
        this.fishAnimation.play("Fish124_Fire");

        let posWorld = this.node.parent.convertToWorldSpaceAR(this.node);
        let posInGameView = Global.InGameManager.FishPoolInstance.BulletContainer.convertToNodeSpaceAR(posWorld);
    
        let  drillBullet = Global.InGameManager.FishPoolInstance.createSpecialBullet_DrillMulti(killActor.gunValue, posInGameView , -this.node.angle , Global.Enum.FISH_TYPE_CONFIG.MULTI_DRILL_ID, 1, 9999 , false, -1, killActor.actorPropertis.AccountId, posInGameView,shootingReward);
        drillBullet.isMove = true;
        drillBullet.isCollision = true;
        drillBullet.SetInfoBullet(killActor.actorPropertis.AccountId, 2.5, 0);
        this.index += 1;
     
        if(this.index  <   this.timeShooting)
        {
            this.scheduleOnce(()=>{
                this.fishAnimation.play("Fish124");
                this.node.runAction(
                    cc.sequence
                    (
                        cc.rotateBy(1.5 , 80),                 
                        cc.callFunc(()=>{
                            let shootingReward = this.matrixStr[this.index];
                            this.Handle_ShootDrill(shootingReward, killActor,rewardDescription);
                        })
                    )
                );
        
            }, 2)
        }
        else
        {

     

            this.scheduleOnce(()=>{

                cc.resources.load('SpinHub-Fish/Prefabs/Fish3/ResultMultiDrill_Reward', cc.Prefab, function (err, prefab) {      
                //Global.DownloadManager.LoadPrefab("Fish3","ResultMultiDrill_Reward", (prefab)=>{
                    try{
                    if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                        return;
                    let node = cc.instantiate(prefab);
                    node.parent = Global.InGameManager.luckyBoxWheelContainer; 
                    node.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));
                    node.active = true;                                                         
                    node.getComponent("ResultMultiDrillFish").SetupRewardValue(this.totalReward);     
                    }
                    catch(e)
                    {
                        cc.log("ERROR: "+e);
                    }
                });   

                this.Handle_AnimationDeathFish(this.totalReward, killActor,rewardDescription);
                this.scheduleOnce(()=>{
                    this.reoveFishNoEffect();
                }, 2.1);
                this.Handle_CreateEffectWhenDeath(this.totalReward, killActor,rewardDescription);
                killActor.On_Attack();
            },3.5);

        }
        

    }

   
    
});
 