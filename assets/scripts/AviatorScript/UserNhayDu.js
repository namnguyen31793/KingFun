// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        sprDu : cc.Sprite,
        spfDu : [cc.SpriteFrame],
        lbMoney : cc.Label
    },

    nhayDu(t, e, i) {
        var n = this
          , o = t ? 5 : 3.5;
        this.sprDu.node.scale = .8,
        t ? (this.sprDu.spriteFrame = this.spfDu[0],
        this.sprDu.node.runAction(cc.scaleTo(.5, 1.3))) : (this.sprDu.spriteFrame = this.spfDu[1],
        this.sprDu.node.runAction(cc.scaleTo(.5, 1.3))),
        this.lbMoney.string = this.formatMoneyNumber(i);
        var s = -this.getRandomArbitrary(300, 600)
          , r = t ? -this.getRandomArbitrary(50, 175) : -this.getRandomArbitrary(200, 400);
        this.node.stopAllActions(),
        this.node.opacity = 255,
        this.node.runAction(cc.sequence(cc.spawn(cc.moveBy(o, cc.v2(s, r)), cc.sequence(cc.delayTime(o - 1.5), cc.fadeOut(.5))), cc.callFunc(function() {
            n.node.stopAllActions(),
            e.removeObject(n.node)
        })))
    },
    formatMoneyNumber(t, e) {
        void 0 === e && (e = 2);
        var i = 1
          , n = t;
        t < 0 && (i = -1,
        n *= -1);
        var o = "";
        return n >= 1e9 ? (n /= 1e9,
        o = "B") : n >= 1e6 ? (n /= 1e6,
        o = "M") : n >= 1e3 && (n /= 1e3,
        o = "K"),
        (n = Math.floor(n * Math.pow(10, e) + 1e-8) / Math.pow(10, e) * i) + o
    },
    
    getRandomArbitrary(t, e) {
        return Math.random() * (e - t) + t
    }
});
