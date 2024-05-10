cc.Class({
    extends: cc.Component,

    properties: {                   
        lbValue : require("TextJackpot"),
        buddha_Circle : cc.Node,
        EndPanelEffectSound : cc.AudioClip,
        CoinJumpSound : cc.AudioClip,
    },

    OnStart() {
        Global.InGameView.OffAuto();
     
    },
    show()
    {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
    },

    Init(TotalMoney,killActor,rewardPanel) {
        cc.audioEngine.playEffect(this.EndPanelEffectSound, false);   
       this.node.active = true;     
       rewardPanel.active = false;
        this.lbValue.StartIncreaseTo(TotalMoney);  
        cc.audioEngine.playEffect(this.CoinJumpSound, false);   
        let playTweenTime = 1.3;
        this.buddha_Circle.setScale(cc.v2(1,1));
        this.buddha_Circle.opacity = 180;     
        cc.tween(this.bgMark)            
            .to(playTweenTime, { opacity: 0 })         
            .start(); 
        cc.tween(this.buddha_Circle).to(playTweenTime,{ scale:2.5}).start();
        
        let t = cc.tween;
        t(this.node)
         .parallel( t().to(1, { scale: 0.5 }), t().to(1, { position: Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-488,-100)) }) )
         .call(() => {

            this.scheduleOnce(()=>{
                if(killActor!= null)
                {
                 killActor.On_Attack();
                 killActor.UpdateBalance(TotalMoney, true);     
                 this.node.active = false; 
                }
                this.node.destroy();
            },2);    
          
        })
        .start();


        /*
        this.scheduleOnce(()=>{
           // this.lbValue.reset();              
            killActor.UpdateBalance(TotalMoney, true);     
            console.log(">>>>>   Buddha killActor.UpdateBalance") ;
        } , 3);
        this.scheduleOnce(()=>{
            this.lbValue.reset();            
            this.node.active = false;    
            rewardPanel.active = false;
        } , 5);
        */

    },

    onLoad() {
        Global.ResultBuddhaFish = this;
    },

    onDestroy() {
        Global.ResultBuddhaFish = null;
    },
});
