// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       content_Lb : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

     showMessage(content)
     {
        this.content_Lb.string = content;
    
     }
    // update (dt) {},
});
