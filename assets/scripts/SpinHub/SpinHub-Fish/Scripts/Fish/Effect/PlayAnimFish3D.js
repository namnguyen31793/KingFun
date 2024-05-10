// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor() {
        this.countTime = 0;
        this.speed = 1;
        this.fish = null;
    },

    properties: {
        anim : cc.Animation,
        totalTime : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.fish = this.node.getComponent("Fish");
        this.anim.play();
    },

    SetSpeed(speed) {
        this.speed = speed;
        this.anim.speed = speed;  
    },

    update (dt) {
        this.countTime += dt * this.speed;
        if(this.countTime >= this.totalTime) {
            this.countTime = 0;
            this.anim.play();
        }
    },
});
