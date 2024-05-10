// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        RiseAngelfishKing : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {

     },

    start () {
        this.scheduleOnce(()=>{
            // this.lbValue.reset();              
           this.showEffect();
        
         } , 5);
    },
    OnStart() {
        Global.InGameView.OffAuto();
       
         
    },
 
    showEffect()
    {
       
        this.RiseAngelfishKing.active = true;
        this.RiseAngelfishKing.setScale(cc.v2(0.25,0.25));
        /*
        cc.tween(this.RiseAngelfishKing).to(0.5,{ scale:0.75}).by(0.25,{ scale:-0.25}).start();
        this.RiseAngelfishKing.setPosition(cc.v2(0, 0));
        */
        this.RiseAngelfishKing.runAction(cc.sequence(cc.scaleTo(1,1),cc.scaleTo(1,0.5),cc.callFunc(()=>{
            this.RiseAngelfishKing.active = false;
        })));
       

    },

    Init(TotalMoney,killActor,rewardPanel) {
        this.node.active = true;     
        this.RiseAngelfishKing.active = true;
        this.RiseAngelfishKing.setScale(cc.v2(0.5,0.5));
        cc.tween(this.Multi_Label.node).by(0.05,{ scale:1}).by(0.02,{ scale:-0.5}).start();
        this.RiseAngelfishKing.setPosition(cc.v2(0, 0));
         
        
         this.scheduleOnce(()=>{
            // this.lbValue.reset();              
             killActor.UpdateBalance(TotalMoney, true);     
        
         } , 3);
         this.scheduleOnce(()=>{
             this.lbValue.reset();            
             this.node.active = false;    
             rewardPanel.active = false;
         } , 5);
 
     },
});
