// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetHelpPopup(this);
        this.EnablePopup(false);
    },

    start () {

    },

   onClose()
   {
        this.gameController.EnableHelpPopup(false);
   },
   EnablePopup(enable)
   {
        this.node.active = enable;
   }

});
