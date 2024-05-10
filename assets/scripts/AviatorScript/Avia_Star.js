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
        this.maxX = 540;
        this.maxY = 295;
        this.minX = -450;
        this.minY = -295;
        this.timeAppear = 0;
        this.timeDelayHide = 0;

    },

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.opacity = 0,
        this.show()
    },
    getRandomArbitrary : function(t, e) {
        return Math.random() * (e - t) + t
    },
    show:function() {
        var t = this;
        this.node.stopAllActions(),
        this.timeAppear = this.getRandomArbitrary(1, 4),
        this.timeDelayHide = this.getRandomArbitrary(1, 4),
        Math.random() > .3 ? this.node.color = cc.Color.WHITE : Math.random() > .75 ? this.node.color = cc.Color.YELLOW : Math.random() > .5 ? this.node.color = cc.Color.CYAN : Math.random() > .25 ? this.node.color = cc.Color.MAGENTA : this.node.color = cc.Color.ORANGE,
        this.node.position = new cc.Vec2(this.getRandomArbitrary(this.minX, this.maxX) + Math.abs(this.node.parent.parent.x),this.getRandomArbitrary(this.minY, this.maxY)),
        this.node.scale = this.getRandomArbitrary(.25, 1),
        this.node.runAction(cc.sequence(cc.fadeIn(.1), cc.delayTime(this.timeDelayHide), cc.fadeOut(.1), cc.delayTime(this.timeAppear), cc.callFunc(function() {
            t.show()
        })))
    }

    // update (dt) {},
});
