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
        this.eid = 1,
        this.gameState = 0,
        this.poxOriginalX = 0,
        this.pox2BoxBetX = 0,
        this.betState = 0,
        this.bet = 0,
        this.sessionID = 0,
        this.isAuto_OnOff = !1,
        this.isAuto_Bet = !1,
        this.isAuTo_Cashout = !1,
        this.heSo_AutoCashout = 1.01,
        this.betAdd = 1e4,
        this.moneyStartCashOut = 0,
        this.isAlreadyCashout = !1;
    },

    properties: {
        nodeDatCuoc : cc.Node,
        sprCuoc : cc.SpriteFrame,
        sprDung : cc.SpriteFrame,
        sprCuocPhienSau : cc.SpriteFrame,
        sprHuyCuoc : cc.SpriteFrame,
        groupBtnBet : cc.Node,
        dangBatTuDungNode : cc.Node,
        lbMoneyBet : cc.Label,
        lbHeSo_AuToCashOut : cc.Label,
        btnAuto_OnOff : cc.Node,
        toggleAutoBet : cc.Node,
        toggleAutoCashout : cc.Node,
        nodePanelAutoBet : cc.Node,
        btnChonHeSo : cc.Button,
        btnAutoCashout : cc.Button,
        autoCashoutOnSprite : cc.Sprite,
        autoCashoutOffSprite : cc.Sprite,
        autoCashoutOnActiveSpriteFrame : cc.SpriteFrame,
        autoCashoutOnDisableSpriteFrame : cc.SpriteFrame,
        autoCashoutOffActiveSpriteFrame : cc.SpriteFrame,
        autoCashoutOffDisableSpriteFrame : cc.SpriteFrame,
    },

    setup : function(t) {
        this.controller = t,
       // this.setStatusWhenHideOtherBoxBet();
        this.gameController =  require("AviatorGameController").getIns();
    }
    ,
    onClickedCreateOntherBoxBetBtn : function() {
       // r.default.getInstance().playEffect("Sounds/Aviator/SFX/Click_Button"),
        this.setStatusWhenCreateOtherBoxBet()
    }
    ,
    onClickedHideOntherBoxBetBtn : function() {
       // r.default.getInstance().playEffect("Sounds/Aviator/SFX/Click_Button_Close"),
        this.betState !== cc.BetState.BETTED ? (this.setStatusWhenHideOtherBoxBet(),
        this.otherBoxBet.setStatusWhenHideOtherBoxBet()) : cc.PopupController.getInstance().showMessage("V\xed \u0111ang \u0111\u1eb7t c\u01b0\u1ee3c")
    }
    ,
    setStatusWhenCreateOtherBoxBet : function() {
        1 === this.eid && (this.node.setPosition(this.pox2BoxBetX, this.node.getPosition().y),
        this.nodeCreateOtherBoxBet.active = !1,
        this.otherBoxBet && (this.otherBoxBet.node.active = !0))
    }
    ,
    setStatusWhenHideOtherBoxBet : function() {
        2 === this.eid && (this.resetBoxBet(),
        this.nodePanelAutoBet.active = !1,
        this.node.active = !1),
        1 === this.eid && (this.node.setPosition(this.poxOriginalX, this.node.getPosition().y),
        this.nodeCreateOtherBoxBet.active = !0)
    }
    ,
    onLoad : function() {
        Number.isInteger(this.heSo_AutoCashout) ? this.lbHeSo_AuToCashOut.string = this.heSo_AutoCashout + ".00x" : this.lbHeSo_AuToCashOut.string = this.heSo_AutoCashout.toFixed(2) + "x"
    }
    ,
    setupCashOutCallback : function(t) {
        this.heSo_AutoCashout = t,
        Number.isInteger(this.heSo_AutoCashout) ? this.lbHeSo_AuToCashOut.string = this.heSo_AutoCashout + ".00x" : this.lbHeSo_AuToCashOut.string = this.heSo_AutoCashout.toFixed(2) + "x",
        this.isAuTo_Cashout = !1,
        this.onClickAuTo_Cashout()
    }
    ,
    closePopupAutoCashout : function() {}
    ,
    statusOnOfff_Button : function(t, e) {
        null !== t.children[0] && void 0 !== t.children[0] && (t.children[0].active = e),
        null !== t.children[1] && void 0 !== t.children[1] && (t.children[1].active = !e)
    }
    ,
    onClickAuto_OnOff : function(t) {
        void 0 === t && (t = null),
        null !== t,
        this.nodePanelAutoBet.active ? (this.isAuto_Bet && this.onClickAuto_Bet(),
        this.nodePanelAutoBet.active = !1) : this.isAuto_Bet ? this.onClickAuto_Bet() : this.nodePanelAutoBet.active = !0,
        this.statusOnOfff_Button(this.btnAuto_OnOff, this.isAuto_OnOff)
    }
    ,
    onClickAuto_Bet : function(t) {
        if (void 0 === t && (t = null),
        this.isAuto_Bet = !this.isAuto_Bet,
        this.isAuto_Bet && this.bet <= 0)
            return cc.PopupController.getInstance().showMessage("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n \u0111\u1eb7t c\u01b0\u1ee3c, xin vui l\xf2ng n\u1ea1p th\xeam"),
            null !== t ,
            void (this.isAuto_Bet = !1);
        this.statusOnOfff_Button(this.toggleAutoBet, this.isAuto_Bet),
        this.statusOnOfff_Button(this.btnAuto_OnOff, this.isAuto_Bet),
        null !== t,
        this.isAuto_Bet ? (this.onClickDatCuoc(),
        this.betState !== cc.BetState.BETTED && this.betState !== cc.BetState.NONE_BET && (this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuoc,
        this.setStateGroupBtnBet(!1))) : (this.betState === cc.BetState.WAITING_BET_NEXTSS && (this.betState = cc.BetState.NONE_BET,
        this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuocPhienSau,
        this.setStateGroupBtnBet(!0)),
        0 !== this.gameState && this.betState !== cc.BetState.BETTED && (this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuocPhienSau),
        this.betState !== cc.BetState.BETTED && this.setStateGroupBtnBet(!0, !0))
    }
    ,
    onClickAuTo_Cashout : function(t) {
        void 0 === t && (t = null),
        null !== t ,
        this.isAuTo_Cashout = !this.isAuTo_Cashout,
        this.statusOnOfff_Button(this.toggleAutoCashout, this.isAuTo_Cashout),
        this.dangBatTuDungNode.active = this.isAuTo_Cashout,
        Number.isInteger(this.heSo_AutoCashout) ? this.lbHeSo_AuToCashOut.string = this.heSo_AutoCashout + ".00x" : this.lbHeSo_AuToCashOut.string = this.heSo_AutoCashout.toFixed(2) + "x"
    }
    ,
    disableAutoCashout : function(t) {
        /*
        this.btnChonHeSo.interactable = t,
        this.btnChonHeSo.enableAutoGrayEffect = !t,
        this.btnAutoCashout.interactable = t,
        
        t ? (this.autoCashoutOffSprite.spriteFrame = this.autoCashoutOffActiveSpriteFrame,
        this.autoCashoutOnSprite.spriteFrame = this.autoCashoutOnActiveSpriteFrame) : (this.autoCashoutOffSprite.spriteFrame = this.autoCashoutOffDisableSpriteFrame,
        this.autoCashoutOnSprite.spriteFrame = this.autoCashoutOnDisableSpriteFrame)
        */
    }
    ,
    onClickShowPopup_AutoCashout : function() {
      
    }
    ,
    reconnectGame : function(t, e, i, n) {
        this.bet = e,
        this.udpateBetLabel(),
        this.betState = t,
        this.betState === cc.BetState.BETTED && (2 == this.eid && this.otherBoxBet.setStatusWhenCreateOtherBoxBet(),
        this.addBettingResponse(),
        this.setStateGroupBtnBet(!1),
        this.moneyStartCashOut = e,
        this.isAlreadyCashout = i > 0,
        null != n && void 0 != n && !isNaN(n) && n > 0 && (this.heSo_AutoCashout = n,
        this.disableAutoCashout(i > 0),
        this.isAuTo_Cashout = !1,
        this.onClickAuTo_Cashout(!1)),
        i > 0 && (this.betState = cc.BetState.NONE_BET,
        this.cashOutResponse()))
    }
    ,
    initData : function(t, e) {
        this.gameState = t,
        this.sessionID = e
    }
    ,
    refreshMoney : function() {
        this.betState !== cc.BetState.BETTED && (cc.BalanceController.getInstance().getBalance() < this.bet && cc.BalanceController.getInstance().getBalance() > 1e3 ? (this.betState = cc.BetState.NONE_BET,
        this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuocPhienSau,
        this.setStateGroupBtnBet(!0)) : cc.BalanceController.getInstance().getBalance() < 1e3 && 0 !== this.gameState && (this.betState = cc.BetState.NONE_BET,
        this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuocPhienSau,
        this.setStateGroupBtnBet(!0)))
    }
    ,
    startBettingResponse: function() {
        // Check if not waiting for next bets or auto-betting is enabled
        if (this.betState !== cc.BetState.WAITING_BET_NEXTSS) {
            this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuoc;
        }
    
        // Check if waiting for next bets or auto-betting is enabled and bet is greater than 0
        if ((this.betState === cc.BetState.WAITING_BET_NEXTSS || this.isAuto_Bet) && this.bet > 0) {
            // Check if bet is less than or equal to balance
            if (this.bet <= cc.BalanceController.getInstance().getBalance()) {
                // Check if auto cashout is enabled
                if (this.isAuTo_Cashout) {
                    this.controller.autoCashout(this.bet, this.sessionID, this.heSo_AutoCashout, this.eid);
                } else {
                    this.controller.betting(this.bet, this.sessionID, this.eid);
                }
            } else {
                // Show message if not enough balance
                cc.PopupController.getInstance().showMessage("Bạn không đủ tiền đặt cược, xin vui lòng nạp thêm");
                this.betState = cc.BetState.NONE_BET;
                this.resetBoxBet();
            }
        } else if ((this.betState === cc.BetState.WAITING_BET_NEXTSS || this.isAuto_Bet) && this.bet <= 0) {
            // Show message if bet is less than or equal to 0
            this.betState = cc.BetState.NONE_BET;
            cc.PopupController.getInstance().showMessage("Bạn không đủ tiền đặt cược, xin vui lòng nạp thêm");
        }
    }
    
    ,
    addBettingResponse : function() {
        this.moneyStartCashOut = this.bet,
        this.disableAutoCashout(!1),
        this.betState = cc.BetState.BETTED,
        this.setStateGroupBtnBet(!1),
        this.isAlreadyCashout = !1
    }
    ,
    startGame : function() {
        this.betState != cc.BetState.BETTED ? this.isAuto_Bet || (this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuocPhienSau,
        0 === this.moneyStartCashOut && this.setStateGroupBtnBet(!0, !0)) : this.isAlreadyCashout || (this.nodeDatCuoc.getComponent(cc.Button).interactable = !0,
        this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprDung)
    }
    ,
    cashOutResponse : function() {
        this.setStateGroupBtnBet(!0),
        this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuocPhienSau,
        this.isAuto_Bet && (this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuoc,
        this.setStateGroupBtnBet(!1)),
        this.disableAutoCashout(!0)
    }
    ,
    endGame : function() {
        this.moneyStartCashOut = 0,
        this.isAlreadyCashout = !1,
        this.betState !== cc.BetState.WAITING_BET_NEXTSS && (this.setStateGroupBtnBet(!0),
        this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuocPhienSau),
        this.isAuto_Bet && (this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuoc,
        this.setStateGroupBtnBet(!1)),
        this.disableAutoCashout(!0)
    }
    ,
    onClickDatCuoc: function (t) {
        // Log thông báo
        cc.log("onClickDatCuoc");
    
        // Kiểm tra tham số t
        if (void 0 === t && (t = null), 
            // Kiểm tra trạng thái trò chơi và trạng thái cược
            0 !== this.gameState || this.betState !== cc.BetState.BETTED) {
            // Kiểm tra số dư
            if (cc.BalanceController.getInstance().getBalance() < this.bet && this.betState !== cc.BetState.BETTED) {
                // Hiển thị thông báo nếu số dư không đủ
                if (null !== t || cc.BalanceController.getInstance().getBalance() < 1e3) {
                    if (this.isAuto_Bet || cc.BalanceController.getInstance().getBalance() < 1e3) {
                        if (this.betState !== cc.BetState.WAITING_BET_NEXTSS) {
                            cc.PopupController.getInstance().showMessage("Bạn không đủ tiền đặt cược, xin vui lòng nạp thêm");
                            this.resetBoxBet();
                            return;
                        }
                    }
                }
                this.bet = cc.BalanceController.getInstance().getBalance();
                this.lbMoneyBet.string = cc.Tool.getInstance().formatMoneyNumberWithColom(this.bet);
            }
    
            // Hiển thị thông báo nếu đã đặt tất cả cược
            if (this.bet === cc.BalanceController.getInstance().getBalance() && this.betState === cc.BetState.NONE_BET && this.bet > 0) {
                cc.PopupController.getInstance().showMessage("Bạn đã đặt tất tay");
            }
    
            // Kiểm tra nếu số tiền cược là âm hoặc bằng 0
            if (this.bet <= 0) {
                if (null !== t) {
                    if (cc.BalanceController.getInstance().getBalance() < 1e3) {
                        cc.PopupController.getInstance().showMessage("Bạn không đủ tiền đặt cược, xin vui lòng nạp thêm");
                    } else {
                        cc.PopupController.getInstance().showMessage("Số tiền cược không hợp lệ");
                    }
                }
            } else if (0 !== this.gameState) {
                // Kiểm tra trạng thái cược và thực hiện các hành động tương ứng
                if (this.betState === cc.BetState.BETTED && null !== t) {
                    this.controller.cashout(this.sessionID, this.eid);
                } else if (this.betState === cc.BetState.NONE_BET) {
                    if (null !== t) {
                        this.betState = cc.BetState.WAITING_BET_NEXTSS;
                        this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprHuyCuoc;
                        this.setStateGroupBtnBet(!1, !0);
                    }
                } else if (this.betState === cc.BetState.WAITING_BET_NEXTSS && null !== t) {
                    this.betState = cc.BetState.NONE_BET;
                    this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuocPhienSau;
                    this.setStateGroupBtnBet(!0);
                }
            } else {
                // Thực hiện cược hoặc rút tiền tự động
                if (this.isAuTo_Cashout) {
                    this.controller.autoCashout(this.bet, this.sessionID, this.heSo_AutoCashout, this.eid);
                } else {
                    this.controller.betting(this.bet, this.sessionID, this.eid);
                }
                this.setStateGroupBtnBet(!1);
            }
        }
    }
    
    ,
    setStateGroupBtnBet : function(t, e) {
        void 0 === e && (e = !1);
        for (var i = 0; i < this.groupBtnBet.children.length; i++)
            this.groupBtnBet.children[i].getComponent(cc.Button).interactable = t,
            this.groupBtnBet.children[i].getComponent(cc.Button).enableAutoGrayEffect = !t;
        t ? (this.nodeDatCuoc.getComponent(cc.Button).interactable = !0,
        this.nodeDatCuoc.getComponent(cc.Button).enableAutoGrayEffect = !1) : (this.nodeDatCuoc.getComponent(cc.Button).interactable = e,
        this.nodeDatCuoc.getComponent(cc.Button).enableAutoGrayEffect = !e)
    }
    ,
    udpateBetLabel : function() {
        this.lbMoneyBet.string = cc.Tool.getInstance().formatMoneyNumberWithColom(this.bet)
        
    }
    ,
    onClickBtnBet : function(t, e) {
        if (null !== e) {
            var i = Number(e);
            cc.BalanceController.getInstance().getBalance() < 1e3 ? cc.PopupController.getInstance().showMessage("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n \u0111\u1eb7t c\u01b0\u1ee3c, xin vui l\xf2ng n\u1ea1p th\xeam") : (this.bet <= cc.BalanceController.getInstance().getBalance() && (this.betAdd === i ? this.bet += i : (this.bet = i,
            this.betAdd = i)),
            this.bet >= cc.BalanceController.getInstance().getBalance() && (this.bet = cc.BalanceController.getInstance().getBalance(),
            cc.PopupController.getInstance().showMessage("B\u1ea1n \u0111\xe3 \u0111\u1eb7t t\u1ea5t tay")),
            this.lbMoneyBet.string = cc.Tool.getInstance().formatMoneyNumberWithColom(this.bet),
            this.scaleNode(this.lbMoneyBet.node))
            this.gameController.Handle_SetBetValue(this.bet);
        }
    }
    ,
    scaleNode : function(t) {
        t.stopAllActions(),
        t.runAction(cc.sequence(cc.scaleTo(.08, 1.1), cc.scaleTo(.08, 1)))
    }
    ,
    onClickedShowHidePopupDieuChinhCashout : function() {
       // r.default.getInstance().playEffect("Sounds/Aviator/SFX/Click_Button"),
        this.nodePanelAutoBet.active = !this.nodePanelAutoBet.active
    }
    ,
    onClickedCloseAutoBetPanelBtn : function() {
      //  r.default.getInstance().playEffect("Sounds/Aviator/SFX/Click_Button"),
        this.nodePanelAutoBet.active = !1
    }
    ,
    resetBoxBet : function() {
        this.isAuto_Bet = !1,
        this.isAuto_OnOff = !1,
        this.statusOnOfff_Button(this.toggleAutoBet, this.isAuto_Bet),
        this.statusOnOfff_Button(this.btnAuto_OnOff, this.isAuto_Bet),
        this.betState = cc.BetState.NONE_BET,
        this.nodeDatCuoc.getComponent(cc.Sprite).spriteFrame = this.sprCuocPhienSau,
        this.setStateGroupBtnBet(!0),
        this.disableAutoCashout(!0)
    }
    ,
    onClickedResetClockBtn : function() {
      //  r.default.getInstance().playEffect("Sounds/Aviator/SFX/Click_Button"),
        this.clockRight.scrollTo(.2, 1),
        this.clockLeft.scrollTo(.2, 1)
    }
    ,
    onClickedOKClockBtn : function() {
      //  r.default.getInstance().playEffect("Sounds/Aviator/SFX/Click_Button"),
        this.getCurrentClockValue()
    }
    ,
    getCurrentClockValue : function() {
        var t = this;
        this.stopScrollClock(),
        this.scheduleOnce(function() {
            var e = t.getCenterTimeItem(t.clockLeft.scrollManager.content.getComponentsInChildren(d.default))
              , i = t.getCenterTimeItem(t.clockRight.scrollManager.content.getComponentsInChildren(d.default))
              , n = e.getValue()
              , o = i.getValue()
              , a = n.toString()
              , s = o.toString();
            n < 10 && (a = "0" + n.toString()),
            o < 10 && (s = "0" + o.toString()),
            t.heSo_AutoCashout = parseFloat(a + "." + s),
            isNaN(t.heSo_AutoCashout) && (t.heSo_AutoCashout = 1.01),
            t.lbHeSo_AuToCashOut.string = t.heSo_AutoCashout.toFixed(2) + "x",
            t.nodePanelAutoBet.active = !1
        }, .1)
    }
    ,
    getCenterTimeItem : function(t) {
        return (t = t.filter(function(t) {
            return t.node.active
        })).sort(function(t, e) {
            return t.node.y - e.node.y
        }),
        t[Math.floor(t.length / 2)]
    }
    ,
    stopScrollClock : function() {
        this.clockLeft.stopScroll(),
        this.clockRight.stopScroll()
    }
});
