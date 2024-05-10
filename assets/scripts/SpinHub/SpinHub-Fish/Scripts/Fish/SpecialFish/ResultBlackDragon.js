// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
      resultMoney :  require("TextJackpot")  ,
      coinJump: cc.AudioClip, 
      startSound  : cc.AudioClip, 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    OnStart() {
        Global.InGameView.OffAuto();
     
      
    },


    Init(TotalMoney,killActor)
    {
        this.node.active = true;
        this.resultMoney.active = true;     
        this.resultMoney.StartIncreaseTo(TotalMoney);  
        cc.audioEngine.playEffect(this.coinJump, false);      
        cc.audioEngine.playEffect(this.startSound, false);  
        /*    
        this.scheduleOnce(()=>{
            // this.lbValue.reset();              
             killActor.UpdateBalance(TotalMoney, true);     
             killActor.On_Attack();
         } , 3);
        this.scheduleOnce(()=>{
            this.resultMoney.reset();   
            this.node.active = false;     
           
        } , 5);
        */


        let t = cc.tween;
        t(this.node)
         .parallel( t().to(1, { scale: 0.5 }), t().to(1, { position: Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-388,-100)) }) )
         .call(() => {

            this.scheduleOnce(()=>{
                if(killActor!= null)
                {
                 killActor.On_Attack();
                 killActor.UpdateBalance(TotalMoney, true);   
                 this.resultMoney.reset();    
                 this.node.active = false; 
                }
                this.node.destroy();
            },4);    
          
        })
        .start();



        
    },

    onLoad() {
        Global.ResultBlackDragon = this;
    },

    onDestroy() {
        Global.ResultBlackDragon = null;
    },

    // update (dt) {},
});
