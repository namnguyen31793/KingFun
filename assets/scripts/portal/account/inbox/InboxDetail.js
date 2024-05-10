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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    show (content) {
        this.content_Lb.string = content;
        this.node.active = true;
    },

    onClick_Close()
    {
        this.node.active = false;
    }

    // update (dt) {},
});
