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
      //  this.nodeHistoryHeSo = null,
        this.lbHistoryHeSo = [],
      //  this.nodeHistoryCloud = null,
        this.sprHistoryCloud = [],
        this.listColor = [],
        //e.btnLSP_Down = null,
        this.historyHeSo = [],
        this.posXlast = -700,
        this.indexMove = 10,
        this.indexSet = 0,
        this.mapLSP = new cc.MapString(),
        this.listPos = [];
    },
  
    properties: {
        nodeHistoryCloud : cc.Node,
        nodeHistoryHeSo :  cc.Node,
        listColor : [cc.SpriteFrame],
        btnLSP_Down : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
            for (var t = 0; t < this.nodeHistoryHeSo.childrenCount; t++)
            this.listPos.push(this.nodeHistoryHeSo.children[t].position);
        for (t = 0; t < this.nodeHistoryHeSo.childrenCount; t++)
            this.lbHistoryHeSo.push(this.nodeHistoryHeSo.children[t].getComponent(cc.Label));
        for (t = 0; t < this.nodeHistoryCloud.childrenCount; t++)
            this.sprHistoryCloud.push(this.nodeHistoryCloud.children[t].getComponent(cc.Sprite))
    },
    setHistoryHeSo(t) {
        if (0 != this.lbHistoryHeSo.length && 0 != this.sprHistoryCloud.length) {
            this.historyHeSo = [];
            for (var e = 0; e < t.length; e++) {
                var i = Number(t[e].Odd);
                0 === i && (i = 1),
                this.historyHeSo.push(i.toFixed(2))
            }
            this.stopAllActions(),
            this.indexMove = 10,
            this.indexSet = 0;
            for (e = 0; e < this.lbHistoryHeSo.length; e++) {
                this.lbHistoryHeSo[e].string = this.historyHeSo[this.historyHeSo.length - e] + "x",
                this.setColorLSP(e, parseFloat(this.historyHeSo[this.historyHeSo.length - e])),
                this.sprHistoryCloud[e].node.scale = 1,
                this.sprHistoryCloud[e].node.position = this.listPos[e],
                this.lbHistoryHeSo[e].node.position = this.listPos[e],
                this.lbHistoryHeSo[e].node.scale = 1
            }
            this.lbHistoryHeSo[1].node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.25, .9), cc.scaleTo(.25, 1.1)))),
            this.sprHistoryCloud[1].node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.25, .9), cc.scaleTo(.25, 1.1))))
        }
    }
    ,
    updateHistoryHeSo(t) {
        var e = this;
        if (0 != this.lbHistoryHeSo.length && 0 != this.sprHistoryCloud.length) {
            0 === t && (t = 1),
            this.stopAllActions(),
            this.historyHeSo.push(t.toFixed(2)),
            this.historyHeSo.length > 50 && this.historyHeSo.splice(0, 1);
            for (var i = function(t) {
                n.lbHistoryHeSo[t].node.scale = 1,
                n.lbHistoryHeSo[t].node.runAction(cc.sequence(cc.moveBy(.4, cc.v2(130, 0)), cc.callFunc(function() {
                    t === e.indexMove && (e.lbHistoryHeSo[e.indexMove].node.x = e.posXlast,
                    e.lbHistoryHeSo[e.indexMove].string = "")
                }))),
                n.sprHistoryCloud[t].node.scale = 1,
                n.sprHistoryCloud[t].node.runAction(cc.sequence(cc.moveBy(.4, cc.v2(130, 0)), cc.callFunc(function() {
                    t === e.indexMove && (e.sprHistoryCloud[e.indexMove].node.x = e.posXlast),
                    t === e.sprHistoryCloud.length - 1 && (e.indexMove--,
                    e.indexMove < 0 && (e.indexMove = 10))
                })))
            }, n = this, o = 0; o < this.lbHistoryHeSo.length; o++)
                i(o);
            this.setColorLSP(this.indexSet, parseFloat(this.historyHeSo[this.historyHeSo.length - 1])),
            this.lbHistoryHeSo[this.indexSet].string = this.historyHeSo[this.historyHeSo.length - 1] + "x",
            this.sprHistoryCloud[this.indexSet].node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.25, .9), cc.scaleTo(.25, 1.1)))),
            this.lbHistoryHeSo[this.indexSet].node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.25, .9), cc.scaleTo(.25, 1.1)))),
            this.indexSet--,
            this.indexSet < 0 && (this.indexSet = 10)
        }
    }
    ,
    stopAllActions() {
        this.lbHistoryHeSo.forEach(function(t) {
            t.node.stopAllActions()
        }),
        this.sprHistoryCloud.forEach(function(t) {
            t.node.stopAllActions()
        })
    }
    ,
    setColorLSP(t, e) {
        var i = 0;
        i = e < 1.5 ? 0 : e < 3 ? 1 : e < 5 ? 2 : e < 8 ? 3 : e < 15 ? 4 : e < 50 ? 5 : 6,
        this.sprHistoryCloud[t].spriteFrame = this.listColor[i]
    }
    ,

    start () {

    },

    // update (dt) {},
});
