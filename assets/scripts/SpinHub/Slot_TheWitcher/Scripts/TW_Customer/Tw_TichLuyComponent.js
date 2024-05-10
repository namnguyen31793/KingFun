// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor()
    {
        this.stakeIndex = 0;
    },
    properties: {
        tichLuy_Array : [cc.Node],
        Multi_Object : cc.Node,
        RedBar_Full : sp.Skeleton,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Stake_Animation = this.node.getComponent("cc.Animation");
    },
    onEnable()
    {
        this.RedBar_Full.node.active = false;
    },

    start () {

    },

    // update (dt) {},
});
