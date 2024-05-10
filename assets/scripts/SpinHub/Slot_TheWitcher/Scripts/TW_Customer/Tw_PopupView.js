// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        FreeSpin_Popup: cc.Node
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setPopupView(this);  
        this.FreeSpin_Popup_Animation = this.FreeSpin_Popup.getComponent(cc.Animation);
    },

    start () {

    },
    onEnable()
    {
        this.FreeSpin_Popup.active = false;
    },

    ShowPopup_FreespinPopup()
    {
       // this.FreeSpin_Popup_Animation.active = true;
       this.FreeSpin_Popup.active = true;
       let callBack = ()=>{         
        this.FreeSpin_Popup_Animation.off("finished" , callBack);

        this.scheduleOnce(()=>{
            this.FreeSpin_Popup.active = false;
        }, 2)

        }
          this.FreeSpin_Popup_Animation.on("finished" ,callBack );
          this.FreeSpin_Popup_Animation.play("FreePopup_Show");
    },

    OffPopup_FreespinPopup(callbackFunc = null)
    {
        if(callbackFunc != null)
            callbackFunc();
    }
    
});
