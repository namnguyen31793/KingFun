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

   onEnable()
   {
        this.currentAnimation.play();
   },

    onLoad () {
        this.currentAnimation = this.node.getComponent(cc.Animation);
    },

    start () {

    },

    // update (dt) {},
});
