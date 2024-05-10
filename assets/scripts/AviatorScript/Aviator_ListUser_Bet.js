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
        this._item = null;
        this.listUserId = [];
        this.listCurrentData = [];
        this.listRawCurrentData = [];
      
    },
    properties: {
        prefab : cc.Node,
        ScrollView_Content : cc.Node,
        item_Array : [require('Aviator_BetInfo_Item')],
        betOfMine1 : require('Aviator_BetInfo_Item'),
        betOfMine2 : require('Aviator_BetInfo_Item'),
        Total_Bet_Lb : cc.Label,
        Total_User_Lb : cc.Label,
    },
    Setup(aviatorView)
    {
        this.AviatorView = aviatorView;
        this.clear();
    },
    HideAll()
    {    
        for(let i=0;i< this.item_Array.length;i++)
        {
            this.item_Array[i].hide();
        }
    },

    AddBettingResponse(data)
    {


        let bettingArray = data[0];
        if(bettingArray.length > 0)
        {
            this.listCurrentData = [];
            this.listUserId = [];
            bettingArray.sort(function(t, e) {
                return e.b - t.b
            });
            let totalBet = 0;
            for (var e = 0; e < bettingArray.length; e++)
                        bettingArray[e].uid === cc.LoginController.getInstance().getUserId().toString() ? 1 === bettingArray[e].eid ? (this.betOfMine1.node.active = !0,
                        this.betOfMine1.initDataOfMine(bettingArray[e], !1)) : (this.betOfMine2.node.active = !0,
                        this.betOfMine2.initDataOfMine(bettingArray[e], !1)) : (this.listRawCurrentData.push(bettingArray[e]),
                        this.listCurrentData.push({
                            itemData: bettingArray[e],
                            index: e,
                            isUpdateDataUser: false,
                            isEndGame: false
                        }),
                        totalBet +=  bettingArray[e].b,
                        this.listUserId.push(bettingArray[e].uid + bettingArray[e].eid));
         
                   // this.listCurrentData.length > 0 && this.modelManager.insert(this.listCurrentData)
            this.SetBetInfo(totalBet,bettingArray.length);
        }


       this.HideAll();
        let betContent = this.listCurrentData;
        let startPostX = 0;
        let startPostY = -18;
        let spaceY = 35;
        for(let i=0;i< this.item_Array.length;i++)
        {
            if(i > betContent.length)
            {
                this.item_Array[i].hide();
                return;
            }
            this.item_Array[i].show(this.listCurrentData[i]);
            let newPos = cc.v2(startPostX,startPostY);
            this.item_Array[i].node.setPosition(startPostX,startPostY);
            startPostY -=   spaceY;
        }
    },

    UpdateBettingResponse(bettingArray)
    {


        
        if(bettingArray.length > 0)
        {
            this.listCurrentData = [];
            this.listUserId = [];
            bettingArray.sort(function(t, e) {
                return e.b - t.b
            });
            let totalBet = 0;
            for (var e = 0; e < bettingArray.length; e++)
                        bettingArray[e].uid === cc.LoginController.getInstance().getUserId().toString() ? 1 === bettingArray[e].eid ? (this.betOfMine1.node.active = !0,
                        this.betOfMine1.initDataOfMine(bettingArray[e], !1)) : (this.betOfMine2.node.active = !0,
                        this.betOfMine2.initDataOfMine(bettingArray[e], !1)) : (this.listRawCurrentData.push(bettingArray[e]),
                        this.listCurrentData.push({
                            itemData: bettingArray[e],
                            index: e,
                            isUpdateDataUser: false,
                            isEndGame: false
                        }),
                        totalBet +=  bettingArray[e].b,
                        this.listUserId.push(bettingArray[e].uid + bettingArray[e].eid));
                       
         
                   // this.listCurrentData.length > 0 && this.modelManager.insert(this.listCurrentData)
            this.SetBetInfo(totalBet,bettingArray.length);
        }


        this.HideAll();
        let betContent = this.listCurrentData;
        let startPostX = 0;
        let startPostY = -18;
        let spaceY = 35;
        for(let i=0;i< this.item_Array.length;i++)
        {
            
            if(i > betContent.length)
            {
                this.item_Array[i].hide();
                return;
            }
            
            this.item_Array[i].show(this.listCurrentData[i]);
            let newPos = cc.v2(startPostX,startPostY);
            this.item_Array[i].node.setPosition(startPostX,startPostY);         
            startPostY -=   spaceY;
        }
    },

    clear : function() {
        this.listUserId = [],
        this.listCurrentData = [],
        this.listRawCurrentData = [],       
        this.betOfMine1.node.active = false,
        this.betOfMine2.node.active = false
    },
    endGame : function() {
        this.item_Array.forEach(function(t) {
            t.EndGame(true)
        }),
        this.betOfMine1.node.active && 0 === this.betOfMine1.winMoney && this.betOfMine1.setColorFail(),
        this.betOfMine2.node.active && 0 === this.betOfMine2.winMoney && this.betOfMine2.setColorFail()
    },
    updateCashoutOfMine : function(t) {
        1 === t.eid ? this.betOfMine1.initDataOfMine(t, !0, !0) : this.betOfMine2.initDataOfMine(t, !0, !0)
    },
    updateCashoutListUserBet : function(t) {
        for (var e = 0; e < t.length; e++)
            if (0 !== t[e].uid == cc.LoginController.getInstance().getUserId().toString()) {
                var i = this.listUserId.indexOf(t[e].uid + t[e].eid);
                if (i >= 0) {
                    /*
                    var n = this.modelManager.get(i);
                    n && (n.data.itemData = t[e],
                    n.data.isUpdateDataUser = !0,
                    this.modelManager.update())
                    */
                }
            }
    },
    updateBettingListUserBet : function(bettingArray) {
        for(let i=0;i< bettingArray.length;i++)
        {
            if(bettingArray.uid == cc.LoginController.getInstance().getUserId().toString())
            {
                if(!this.betOfMine1.node.active)
                    this.betOfMine1.initDataOfMine(bettingArray[i], !1);
                if(!this.betOfMine2.node.active)
                    this.betOfMine2.initDataOfMine(bettingArray[i], !1);
            }
            else
            {
               
            }
        }

    }
    ,
    SetBetInfo(totalBet,totalUser)
    {
        this.Total_Bet_Lb.string = this.formatMoneyNumber(totalBet);
        this.Total_User_Lb.string = totalUser;
        this.AviatorView.StartBetPopup.SetTotalUser(totalUser);
        this.AviatorView.StartBetPopup.SetTotalBet(totalBet);
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




   
});
