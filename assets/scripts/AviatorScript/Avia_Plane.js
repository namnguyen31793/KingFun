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
        this.minDirection = cc.v2(0.125, 0.125),
        this.maxDirection = cc.v2(0.25, 0.25);
        this.rotationSpeed = 2.5;
        this.direction = cc.v2(0, 0);
        this.scale = 1;
    },

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.direction = cc.v2(this.getRandomInRange(this.minDirection.x, this.maxDirection.x), this.getRandomInRange(this.minDirection.y, this.maxDirection.y))
    },
    onUpdate :function(t) {
        this.node.position.x += this.direction.mul(t * this.scale).x,
        this.node.position.y += this.direction.mul(t * this.scale).y,
        this.node.angle += this.rotationSpeed * t
    },
    getRandomInRange :function(t, e) {
        return Math.random() * (e - t) + t
    },


    // update (dt) {},
});
