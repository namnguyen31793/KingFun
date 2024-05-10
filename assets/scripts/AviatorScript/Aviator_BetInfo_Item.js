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
        this._holder = null;
        this.isCashout = false;
    },

    properties: {
        bg : cc.Node,
       lbName : cc.Label,
       lbCuoc : cc.Label,
       lbTongThang : cc.Label,
       lbHeSo : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    show : function(t) {
        this._holder = t;
        this.isCashout = false;
        if(this._holder == undefined ||this._holder == null || this._holder.itemData == null)
        {
            this.hide();
            return;
        }
      
        this.initData(this._holder.itemData);
        this.bg.color = this._holder.index % 2 == 0 ? cc.Color.WHITE : cc.Color.BLACK;
        this.node.active = true;
    },
    hide()
    {
        this.node.active = false;
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
    initData : function(t) {
        this._holder.isUpdateDataUser || (this.lbHeSo.string = "-",
        this.lbTongThang.string = "-",
        this.winMoney = 0),
        cc.SbStringUtil.getInstance().isNullOrEmpty(t.dn) || (t.dn.length > 8 ? this.lbName.string = t.dn.slice(0, 6) + "..." : this.lbName.string = t.dn),
        this.lbCuoc.string = this.formatMoneyNumber(t.b),
        cc.SbStringUtil.getInstance().isNullOrEmpty(t.odd) || t.odd > 0 && (this.lbHeSo.string = t.odd.toFixed(2) + "x"),
        this._holder.isEndGame || (this.lbName.node.color = cc.Color.WHITE,
        this.lbCuoc.node.color = cc.Color.WHITE,
        this.lbHeSo.node.color = cc.Color.WHITE,
        this.lbTongThang.node.color = cc.Color.WHITE),
        !cc.SbStringUtil.getInstance().isNullOrEmpty(t.wm) && t.wm > 0 && (this.lbTongThang.string = this.formatMoneyNumber(t.wm),
        this.winMoney = t.wm,
        this.setColorWin(0 === t.uid == cc.LoginController.getInstance().getUserId())),
        this._holder.isEndGame && (cc.SbStringUtil.getInstance().isNullOrEmpty(t.wm) ? this.setColorFail() : t.wm <= 0 && this.setColorFail())
    }
    ,
    initDataOfMine : function(t, e, i) {
        void 0 === i && (i = !1),
        e || (this.lbHeSo.string = "-",
        this.lbTongThang.string = "-",
        this.winMoney = 0),
        cc.SbStringUtil.getInstance().isNullOrEmpty(t.dn) || (t.dn.length > 8 ? this.lbName.string = t.dn.slice(0, 6) + "..." : this.lbName.string = t.dn),
        this.lbCuoc.string = this.formatMoneyNumber(t.b),
        cc.SbStringUtil.getInstance().isNullOrEmpty(t.odd) || t.odd > 0 && (this.lbHeSo.string = t.odd.toFixed(2) + "x"),
        !cc.SbStringUtil.getInstance().isNullOrEmpty(t.wm) && t.wm > 0 ? (this.lbTongThang.string = this.formatMoneyNumber(t.wm),
        this.winMoney = t.wm,
        t.uid ? this.setColorWin(t.uid === cc.LoginController.getInstance().getUserId()) : this.setColorWin(i)) : (this.lbName.node.color = cc.Color.WHITE,
        this.lbCuoc.node.color = cc.Color.WHITE,
        this.lbHeSo.node.color = cc.Color.WHITE,
        this.lbTongThang.node.color = cc.Color.WHITE)
    }
    ,
    setColorFail : function() {
        this.lbName.node.color = cc.Color.RED,
        this.lbCuoc.node.color = cc.Color.RED,
        this.lbHeSo.node.color = cc.Color.RED,
        this.lbTongThang.node.color = cc.Color.RED,
        this.lbTongThang.string = "0"
    }
    ,
    setColorWin : function(t) {
        t ? (this.lbName.node.color = cc.Color.YELLOW,
        this.lbCuoc.node.color = cc.Color.YELLOW,
        this.lbHeSo.node.color = cc.Color.YELLOW,
        this.lbTongThang.node.color = cc.Color.YELLOW) : (this.lbName.node.color = cc.Color.GREEN,
        this.lbCuoc.node.color = cc.Color.GREEN,
        this.lbHeSo.node.color = cc.Color.GREEN,
        this.lbTongThang.node.color = cc.Color.GREEN);
        this.isCashout = true;
    }
    ,
    EndGame()
    {
        if(!this.isCashout)
            this.setColorFail();
        this._holder = null;
    }
    
});
