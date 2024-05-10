

cc.Class({
    extends: cc.Component,

    properties: {
        effect : cc.Node,
        gun : null,
        numb : 0,
    },

    Init(gun) {
        this.gun = gun;
        this.effect.setPosition(gun.node.getPosition());
        this.numb = 1;
        this.node.runAction(cc.sequence(cc.delayTime(1) , cc.callFunc(()=>{
            this.gun.node.setScale(cc.v2(1, 1));
            this.node.destroy();
        })))
    },

    update (dt) {
        this.numb += dt * 0.5;
        this.gun.node.setScale(cc.v2(this.numb, this.numb));
    },

});
