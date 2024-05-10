// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        anims : [cc.Animation],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    MonsterView_Init() {
        for(let i = 0; i < this.anims.length; i++)
            this.anims[i].play();
    }

    // update (dt) {},
});
