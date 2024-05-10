cc.Class({
    extends: cc.Component,

    properties: {                   
        lbValue : require("TextJackpot")     ,
        coinJump: cc.AudioClip, 
        startSound  : cc.AudioClip, 
    },

    OnStart() {
        Global.InGameView.OffAuto();
     
    },

    Init(TotalMoney,killActor,rewardPanel) {
       this.node.active = true;     
        this.lbValue.StartIncreaseTo(TotalMoney);  
        cc.audioEngine.playEffect(this.coinJump, false);      
        cc.audioEngine.playEffect(this.startSound, false);      
       
        /*
        this.scheduleOnce(()=>{
           // this.lbValue.reset();              
            killActor.UpdateBalance(TotalMoney, true);     
            killActor.On_Attack(); 
        } , 3);
        this.scheduleOnce(()=>{
            this.lbValue.reset();            
            this.node.active = false;    
            rewardPanel.active = false;
        } , 5);
        */
        try
        {
        
        let t = cc.tween;
        t(this.node)
         .parallel( t().to(1, { scale: 0.5 }), t().to(1, { position: Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-388,-100)) }) )
         .call(() => {

            this.scheduleOnce(()=>{
                if(killActor!= null)
                {
                 killActor.On_Attack();                
                 killActor.UpdateBalance(TotalMoney, true);     
                 this.node.active = false; 
               
                }
                this.node.destroy();
            },3);    
          
        })
        .start();
        }
        catch(e)
        {
            this.node.active = false;
           
        }
    },

    onLoad() {
        Global.ResultPhoenixFish = this;
    },

    onDestroy() {
        Global.ResultPhoenixFish = null;
    },
});
