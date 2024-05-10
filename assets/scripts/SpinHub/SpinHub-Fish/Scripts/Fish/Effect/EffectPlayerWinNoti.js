// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        ScoreLabel : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.WinNoti_Animation = this.node.getComponent(cc.Animation);
    },

    WinNoti_Init(SittingId,Score)
    {
        this.node.active = true;
        if(this.WinNoti_Animation == null)
        {
             this.WinNoti_Animation = this.node.getComponent(cc.Animation);
           
        }
     
        this.ScoreLabel.string = Global.Helper.formatNumber2(Score);
 
        let pos = Global.Helper.GetPositionSliceBySittingIdAndMainSitting(SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-250,-190));

        if(SittingId == 5 || SittingId == 7)
            this.node.angle = -180;
        else
            this.node.angle = 0;

        this.node.setPosition(pos);

        let callBack = ()=>{
           
            this.WinNoti_Animation.off("finished" , callBack);
            //this.node.active = false;
            Global.InGameManager.FishPoolInstance.RestorePlayerWinEffect(this.node);
           
        }
        this.WinNoti_Animation.on("finished" ,callBack);
        this.WinNoti_Animation.play();
        
    },

    // update (dt) {},
});
  