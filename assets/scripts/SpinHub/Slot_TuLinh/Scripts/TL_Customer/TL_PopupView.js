// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        FreeSpin_Popup: cc.Node,//require("Result_Freespin_Popup"),
        MuaBieuTuong_Popup: require("MuaBieuTuong_Popup"),
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setPopupView(this);  
        this.spinController.setMuaBieuTuongView(this.MuaBieuTuong_Popup);

        this.FreeSpin_Popup_compomnent = this.FreeSpin_Popup.getComponent("Result_Freespin_Popup");
    },

    start () {

    },
    onEnable()
    {
        this.FreeSpin_Popup.active = false;
    },

    ShowPopup_FreespinPopup(totalReward)
    {
        this.FreeSpin_Popup.active = true;
        if(this.FreeSpin_Popup_compomnent === null || this.FreeSpin_Popup_compomnent === undefined)
            this.FreeSpin_Popup_compomnent = this.FreeSpin_Popup.getComponent("Result_Freespin_Popup");
        this.FreeSpin_Popup_compomnent.Reward_Setup(totalReward);
    },

    OffPopup_FreespinPopup(callbackFunc = null)
    {
        if(callbackFunc != null)
            callbackFunc();
    }
    
});

