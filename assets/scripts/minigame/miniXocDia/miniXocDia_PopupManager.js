// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        content_Lb : cc.Label,
        SessionPopup: cc.Node,

        WinMoney_Lb : cc.Label,
        WinPopup: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.currentAnimation = this.getComponent(cc.Animation);
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetPopupManager(this);
        this.node.active = false;
    },
    ResetAllPopup()
    {
        this.DisableAllPopup();
    },

    showPopup(content,showTime = 1,position = cc.v2(0,0))
    {
        this.node.active = true; 
        this.DisableAllPopup();
        this.SessionPopup.active = true;
        this.content_Lb.string = content;
        this.currentAnimation.play("openPopup");

        this.scheduleOnce(()=>{
            this.closePopup();
        },showTime);
    },
    showWinPopup(winAmount)
    {
        this.node.active = true; 
        this.DisableAllPopup();
        this.WinPopup.active = true;
        this.WinMoney_Lb.string = 'THẮNG +'+cc.Tool.getInstance().formatMoney(winAmount);
        this.currentAnimation.play("openPopup");
        this.scheduleOnce(()=>{
            this.closePopup();
        },5);
    },

    closePopup()
    {
        let self = this;
        let callBack = ()=>{  
            self.currentAnimation.off("finished" , callBack);
            self.node.active = false; 
        }
       this.currentAnimation.on("finished" ,callBack );
       this.currentAnimation.play("closePopup");  
    },

    DisableAllPopup()
    {
        this.SessionPopup.active = false;
        this.WinPopup.active = false;
    }

    // update (dt) {},
});
