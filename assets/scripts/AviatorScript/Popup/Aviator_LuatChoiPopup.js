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
        this.animation = this.node.getComponent(cc.Animation);
        this.gameController =  require("AviatorGameController").getIns();
    },
    onEnable: function () {
        this.animation.play('openPopup');      
    },

    start () {

    },
    closeClicked: function () {
        //this.showRegister(false);
        let seft = this;
        let callBack = ()=>{    
            seft.animation.off("finished" , callBack);
            this.gameController.AssetManager.Destroy_LuatChoiPopup();        
        }
       this.animation.on("finished" ,callBack );
       this.animation.play("closePopup");
    }

    // update (dt) {},
});
