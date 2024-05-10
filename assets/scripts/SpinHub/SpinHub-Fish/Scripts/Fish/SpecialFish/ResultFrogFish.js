cc.Class({
    extends: cc.Component,

    properties: {
        posFrog : cc.Node,        
        circle : cc.Node,
        lbValue : require("TextJackpot")     
    },

    OnStart() {
        Global.InGameView.OffAuto();
      /*  this.result.setAnimation(0, 'xuat hien', false);
        this.scheduleOnce(()=>{

            Global.SammuraiController.OnCheckLoad();
            this.result.setAnimation(0, 'loop', true);
        } , 0.3);
        */
      
    },

    Init(frogFishType,value) {
       this.node.active = true;
        this.circle.active = true;
        this.lbValue.StartIncreaseTo(value);  
        
        this.scheduleOnce(()=>{
            this.lbValue.reset();   
            this.node.active = false;             
        } , 3);
        

    },

    onLoad() {
        Global.ResultFrogFish = this;
    },

    onDestroy() {
        Global.ResultFrogFish = null;
    },
});
