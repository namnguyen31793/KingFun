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
        this.mapLSP = new cc.MapString();
        this.initPosX = 0;
        this.initPosY = 0;
    },
    properties: {
        parentImage : cc.Node,
        parentHeSo : cc.Node,
        nodeImage : cc.Node,
        nodeHeSo : cc.Node,
        lspAviator : require('LSPAviator'),
        popup : cc.Node,
        btnClose : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.mapLSP.set("0", this.nodeImage);
                for (var t = 1; t < 49; t++) {
                    var e = cc.instantiate(this.nodeImage);
                    e.parent = this.parentImage,
                    Math.floor(t / 10) % 2 == 0 ? (e.x = this.nodeImage.x + t % 10 * 127,
                    e.y = this.nodeImage.y - 65 * Math.floor(t / 10)) : (e.x = this.nodeImage.x + 127 * (9 - t % 10),
                    e.y = this.nodeImage.y - 65 * Math.floor(t / 10));
                    var i = cc.instantiate(this.nodeHeSo);
                    i.parent = this.parentHeSo,
                    i.x = e.x,
                    i.y = e.y,
                    this.mapLSP.set(t.toString(), e)
                }
    },
    onClickOnLSP : function() {
        this.node.active = !0,
        this.popup.scaleX = 1,
        this.popup.scaleY = 0,
        this.popup.stopAllActions(),
        this.popup.runAction(cc.scaleTo(.4, 1, 1).easing(cc.easeExponentialOut())),
        this.initData(this.lspAviator.historyHeSo),
        this.btnClose.active = !0
        /*
        s.default.getInstance().playEffect("Sounds/Aviator/SFX/Click_Button"),
        c.default.getInstance().hide()
        */
    },
    initData : function(t) {
        for (var e = 0; e < this.parentHeSo.childrenCount; e++) {
            var i = this.mapLSP.get(e.toString());
            e < t.length ? (i.opacity = 255,
            this.parentHeSo.children[e].getComponent(cc.Label).string = t[t.length - e - 1] + "x",
            this.setColorLSP(i, parseFloat(t[t.length - e - 1]))) : i.opacity = 0
        }
    },
    onClickOffLSP : function() {
        var t = this;
        !this.popup.active || this.popup.getNumberOfRunningActions() > 0 || (
            //s.default.getInstance().playEffect("Sounds/Aviator/SFX/Click_Button_Close"),
        this.popup.stopAllActions(),
        this.popup.runAction(cc.sequence(cc.scaleTo(.3, 1, 0).easing(cc.easeExponentialIn()), cc.callFunc(function() {
            t.node.active = !1,
            t.btnClose.active = !1
        }))))
    },
    setColorLSP : function(t, e) {
        var i = 0;
        i = e < 1.5 ? 0 : e < 3 ? 1 : e < 5 ? 2 : e < 8 ? 3 : e < 15 ? 4 : e < 50 ? 5 : 6,
        t.getComponent(cc.Sprite).spriteFrame = this.lspAviator.listColor[i]
    },


    start () {

    },

    // update (dt) {},
});
