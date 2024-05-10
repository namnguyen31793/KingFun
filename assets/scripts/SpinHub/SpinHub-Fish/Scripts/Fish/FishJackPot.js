

cc.Class({
    extends: require("Fish2D"),

    properties: {
        ske : sp.Skeleton,
        animCoin : sp.Skeleton,
        imgName : cc.Node,
        imgNote : cc.Node,
    },

    SetUpAnimation() {
      //  this.imgName.opacity = 255;
        this.node.opacity = 255;
        this.ske.setAnimation(0, 'SWIM', true);
        this.SetHide();
    },

    

    Handle_AnimationDeathFish(fishValue, killActor,rewardDescription)
    {
        /*
        this.ske.setAnimation(0, 'CATCH2', false);
        this.scheduleOnce(()=>{
            this.imgName.runAction(cc.fadeOut(0.4));
        }, 0.5);
        this.scheduleOnce(()=>{
            Global.InGameManager.SetValueWinElectric(killActor, fishValue, true);
        }, 2);
        this.scheduleOnce(()=>{          
            this.node.runAction(cc.fadeOut(1));      
        }, 3);
        this.scheduleOnce(()=>{
            this.animCoin.node.active = true;
            this.animCoin.setAnimation(0, 'active', false);
        }, 1.7);
        */
    },
    
    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {
  
        if (killActor != null) {
            killActor.scheduleOnce(()=>{
                    killActor.UpdateBalance(fishValue, true);
                    killActor.On_Attack();
                } , 3.5);
        }
    },


    SetHide() {
        if(!this.isDie) {
            if(Global.agent == 0) {
               
                    this.ske.node.opacity = 150;
                    if(this.imgNote != null)
                        this.imgNote.active = true
                
            } else {
                this.ske.node.opacity = 255;
            }
        }
    },

    update (dt) {
        this._super(dt);
        /*
        if(this.node.scaleX < 0) {
            this.imgName.scaleX = -1;
        }
        */
    },

    SetSpeedAnimationByMove(speed){
        this.ske.timeScale = speed;
    },

    RePlay() {
        this.ske.setAnimation(0, 'SWIM', true);
    },

    onLoad() {
        this.listColider = this.getComponents(cc.BoxCollider);   
    },
    
});
