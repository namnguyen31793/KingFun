// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("CHPT_MainView"),

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    GetSlotController()
    {
        // require("CHPT_Freespin_LogicManager").getIns();
        this.spinController = require('CHPT_Freespin_LogicManager').getIns();
        this.spinController.setMainView(this);
    },

    // update (dt) {},
});
