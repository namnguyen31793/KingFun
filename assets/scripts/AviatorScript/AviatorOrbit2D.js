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
       
    },
    properties: {
        pivotObject : cc.Node,
        direction1 : cc.Node,
        speed : -4,
        distance : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.distance = this.node.position.sub(this.pivotObject.position).mag()
    },

    onUpdate : function(t) {
        var e = -this.speed * t;
        this.direction1.angle += e;
        var i = Math.cos(cc.misc.degreesToRadians(this.direction1.angle)) * this.distance
          , n = Math.sin(cc.misc.degreesToRadians(this.direction1.angle)) * this.distance;
        this.node.position = this.pivotObject.position.add(new cc.Vec2(i,n))
    }

    // update (dt) {},
});
