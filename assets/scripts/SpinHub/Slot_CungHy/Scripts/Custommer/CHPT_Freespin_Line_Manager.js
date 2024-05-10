// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("CHPT_Line_Manager"), 

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    GetSpinController()
    {
        let spinController = require("CHPT_Freespin_LogicManager").getIns();
        spinController.setLineManager(this);
        return  spinController;
    },

    // update (dt) {},
});
