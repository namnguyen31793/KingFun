// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        SymboSword_Skeleton : sp.Skeleton,
        Kikimora_Skeleton : sp.Skeleton,
        RewardPopup : cc.Node,
        MoneyLabel : cc.LabelIncrement,

        StartJackpotEffect :  cc.AudioSource,
        Kikimore_Kill_SoundEffect :  cc.AudioSource,
        Swort_SoundEffect :  cc.AudioSource,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

    },
    onEnable()
    {
        this.Setup(50000000);
        this.ShowAnimation_SymboSword();
    },

    Setup(totalReward)
    {
        this.jackpotAnimation = this.node.getComponent(cc.Animation);
        this.SymboSword_Skeleton.node.active = true;
        this.SymboSword_Skeleton.node.setPosition(cc.v2(0,0));
        this.Kikimora_Skeleton.node.setPosition(cc.v2(-552,292));
        this.Kikimora_Skeleton.node.active = true;
        this.totalReward = totalReward;
        this.AudioPool_Manager =   require("AudioController_V2").getIns();

    },

    ShowAnimation_SymboSword()
    {
        this.AudioPool_Manager.playSound_Direct(this.StartJackpotEffect);
      

        this.SymboSword_Skeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'animation') {
             
                this.ShowAnimation_StartEffect();
            }
        });
        this.SymboSword_Skeleton.setAnimation(0,'animation',false);
    },

    ShowAnimation_StartEffect()
    {   
       

        this.AudioPool_Manager.playSound_Direct(this.Kikimore_Kill_SoundEffect);
        let callBack = ()=>{    
            this.jackpotAnimation.off("finished" , callBack);
                this.ShowAnimation_KikimoraDie();
           }
           this.jackpotAnimation.on("finished" ,callBack );
           this.jackpotAnimation.play("Jackpot_Start");
    },
    ShowAnimation_KikimoraDie()
    {
        this.AudioPool_Manager.playSound_Direct(this.Swort_SoundEffect);
        this.Kikimora_Skeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'animation') {
                this.Kikimora_Skeleton.node.active = false;
                this.scheduleOnce(()=>{
                    this.ShowAnimation_RewardTotal();
                },1);
               
            }
        });
        this.Kikimora_Skeleton.setAnimation(0,'animation',false);
    },
    ShowAnimation_RewardTotal()
    {
        this.AudioPool_Manager.playSound(cc.AudioTypes.JACKPOT_BACKGROUD);
        this.AudioPool_Manager.playSound(cc.AudioTypes.BIGWIN);
        this.RewardPopup.active = true;
        this.MoneyLabel.tweenValueto(this.totalReward);

        this.scheduleOnce(()=>{
           let spinController =  require("SlotControllerFactory").getIns().GetCurrentSlotController();
           spinController.mainView.Destroy_JackpotView();
        },7);
    },

    onDestroy()
    {
        this.unscheduleAllCallbacks();
    },



    // update (dt) {},
});
