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
        this.gameState = 0;
        this.timeNoNetWork = 0;
        this.timeWaitMoveNextHeSo = 1;
        this.timeFly = 0;
        this.allowCreateNhayDu = true;
        this.isNoMovePlane = false;
        this.countSession = 0;
        this.currentTotalMineBet = 0;
        this.showSettingPopup = false;
    },
    properties: {
        lbHeSoCashOut : cc.Label,
        planeContrl : require('PlaneControll'),
        nhayDuItemNode : cc.Node,
        pool : require('DynamicPoolManager'),
        nhayDuMineContainer : cc.Node,
        nhayDuContainer : cc.Node,
        StartBetPopup : require('StartBetPopup'),
        boxBet1 : require('Aviator_BoxBet'),
        Aviator_ListUser: require('Aviator_ListUser_Bet'),
        DisplayName_Lb : cc.Label,
        lspHistory : require('LSPAviator'),
        AccountMoney_Lb : cc.Label,
        Loading_Aviator : cc.Node,
        Setting_Popup_Animation : cc.Animation
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var CrashGameNegotiateCommand = new cc.CrashGameNegotiateCommand;
        CrashGameNegotiateCommand.execute(this);
        this.lastTimeReconnect = (new Date()).getTime();
        this.multiX = 0;

        this.gameController =  require("AviatorGameController").getIns();
        this.gameController.SetGameView(this);
        this.initNhayDuItem();
        this.StartBetPopup.node.active = false;
        this.boxBet1.setup(this);
        this.Aviator_ListUser.Setup(this);
        this.DisplayName_Lb.string = cc.LoginController.getInstance().getNickname();
        this.AccountMoney_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(cc.BalanceController.getInstance().getBalance()); 
        this.Loading_Aviator.active = true;
        this.audioController =  require("AudioController_V2").getIns();
        
        
    },
    onEnable()
    {
        if(this.audioController)
        {
            this.audioController.enableMusic(true);
            this.audioController.enableSound(true);
            this.audioController.playBackgroundMusic();  
        }
        
    },

    start () {
       
       
    },

    initNhayDuItem()
    {
        this.pool.addNewPool("NhayDuItem", this.nhayDuItemNode);
        let nhayduArray = [];
        for (var e = 0; e < 30; e++)
            nhayduArray.push(this.pool.getObject("NhayDuItem"));
        
        for (e = 0; e < nhayduArray.length; e++)
            this.pool.removeObject(nhayduArray[e]);
        
        
    },



    updateCashOutResponse(data)
    {
        this.timeNoNetWork = 0;
        let odd = data[1];
        let cashoutList = data[0];
        let gamePhrase = data[3];
        let ps = data[4];
        this.gameState = gamePhrase;
        
        if(this.multiX >= odd)
        {
            return;
        }
        
        var timeFly = this.calTimeFly(odd);      
        this.setStringHeSo(timeFly);
        if(this.gameState !== cc.AviatorPhase.END_GAME && this.gameState !==  cc.AviatorPhase.BETTING)
        {
            for(let i=0;i< cashoutList.length;i++)
            {
                var n = cashoutList[i].uid == cc.LoginController.getInstance().getUserId();
                if (this.allowCreateNhayDu) 
                {
                    if (!(o = this.pool.getObject("NhayDuItem")))
                                continue;
                    o.parent = n ? this.nhayDuMineContainer : this.nhayDuContainer;                    
                    let pos = this.planeContrl.nodePlane.getPosition();
                    o.setPosition(pos);
                    o.active = true;
                    o.getComponent('UserNhayDu').nhayDu(n, this.pool, cashoutList[i].wm)
                }
            }
        }
        if(ps.length > 0)
        {
            this.Aviator_ListUser.UpdateBettingResponse(ps);
        }
       
    },

    setStringHeSo(t)
    {
        var e = this;
                //if (this.gameState !== a.END_GAME) {

                    if (this.gameState !== 1) {
                    var i = t;
                    let index = 0;
                    this.lbHeSoCashOut.node.active = !0,
                    this.lbHeSoCashOut.node.stopAllActions(),
                    this.lbHeSoCashOut.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(.05), cc.callFunc(function() {
                        if (e.timeNoNetWork < e.timeWaitMoveNextHeSo) {
                            if ((i += 50) > 0) {
                                var t = e.calHeSo(i);
                                this.multiX = t;
                                e.lbHeSoCashOut.string = parseFloat(t.toString()).toFixed(2);
                               
                            }
                        } else
                            e.timeNoNetWork > 3 && e.timeNoNetWork > 60 && !b.default.getInstance().isSocketOpen && d.default.getInstance().showPopupMessageUtil("Vui l\xf2ng th\u1eed l\u1ea1i");
                        e.timeNoNetWork += .05
                    }))))
                }
    },

    convertHeSo0(t)
    {
        return t <= 0 ? 1 : t
    },
    calHeSo(t) {
        return Math.pow(Math.E, 6e-5 * t)
    },
    calTimeFly(t) {
        return Math.round(Math.log(t) / 6e-5)
    },
    onCrashGameNegotiateResponse(response)
    {
        this.connectionToken = response.ConnectionToken;
        this.crashGameHub = new cc.Hub;
        this.crashGameHub.connect(this, cc.HubName.CrashGameHub, response.ConnectionToken);
    },
    onDestroy: function () {
        this.sendRequestOnHub(cc.MethodHubName.EXIT_LOBBY);
        if (this.crashGameHub)
            this.crashGameHub.disconnect();
        this.unscheduleAllCallbacks();       
    },

    reconnect: function () {
        // console.log('miniPokerHub reconnect');
        this.lastTimeReconnect = (new Date()).getTime();
        this.crashGameHub.connect(this, cc.SubdomainName.CRASH_GAME, this.connectionToken, true);
    },

    onHubOpen: function () {   
         this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);        
    },

    onHubClose: function () {
        //reconnect
        if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
            this.reconnect();
        } else {
            cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
        }
    },

    onHubError: function () {

    },
    onHubMessage: function (response) {
      
        if (response.M !== undefined && response.M.length > 0) {
            let res = response.M;
            this.gameController.Handle_ResponseData(response);        
        } else if (response.R && response.R.AccountID) {
            this.currAccId = response.R.AccountID;
            this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
            //sau khi enterLobby
            cc.PopupController.getInstance().hideBusy();

        } else {
            //PING PONG
            if (response.I) {
                this.crashGameHub.pingPongResponse(response.I);
            }
        }
    },

    //#region  Network Send Request
    sendRequestOnHub: function (method, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10) {
        
        switch (method) {
            case cc.MethodHubName.ENTER_LOBBY:
                this.crashGameHub.enterLobby();
                break;
            case cc.MethodHubName.EXIT_LOBBY:
                this.crashGameHub.exitLobby();
                break;
            case cc.MethodHubName.BET:
                this.crashGameHub.bet(data1, data2);//betValue, betSide
                break;
            case cc.MethodHubName.PLAY_NOW:
                this.crashGameHub.playNow();
                break;
            case cc.MethodHubName.SEND_MESSAGE:
                this.crashGameHub.sendRoomMessage(data1);
                break;
            
        }
    },

    sendBetting(amount,autoCashout)
    {
       
    },

    startGame(data)
    {
        
        let timeFly = 0;
        if(data)
            timeFly = parseInt(data[2]);
        this.setStringHeSo(timeFly);
        this.planeContrl.startGame((timeFly > 0),this.setNoMove.bind(this));
        this.boxBet1.initData(this.gameController.GetGamePhase(),this.gameController.GetSessionID());
        this.boxBet1.startGame();
        this.audioController.audioPool.playKhoiHanh(); 
        this.audioController.audioPool.playTauChinh_DangBay();
        
    },

    Handle_Subcriber(data)
    { 
        this.audioController.enableMusic(true);
        this.audioController.enableSound(true);
        this.audioController.playBackgroundMusic();  
        
        this.boxBet1.betState = cc.BetState.NONE_BET;
        let historyData = data[5];
        this.lspHistory.setHistoryHeSo(historyData);
        let gamePhase= this.gameController.GetGamePhase();
        switch(gamePhase)
        {
            case cc.AviatorPhase.BETTING:
                this.planeContrl.setPlaneStatus(cc.PlaneState.IDLE);               
                break;
            case cc.AviatorPhase.PLAYING:
                this.startGame(data);
                break;
            case cc.AviatorPhase.CASHOUTED:
                this.startGame(data);
                break;
            case cc.AviatorPhase.END_GAME:
                break;
        }
        this.Loading_Aviator.active = false;
        
       
    },
    setNoMove : function() {
        this.isNoMovePlane = true
    },
    SetGameState(gameState)
    {
        this.gameState =gameState;
    },
    GetGameState()
    {
        return this.gameState;
    },
    Handle_EndGame(responseData)
    {
      
        let endOdd = responseData[0];
        this.lbHeSoCashOut.node.stopAllActions();
        this.lbHeSoCashOut.string = parseFloat(endOdd.toString()).toFixed(2);
        this.planeContrl.endGame();
        this.Aviator_ListUser.endGame();
        this.lspHistory.updateHistoryHeSo(endOdd);      
        this.audioController.audioPool.stopTauChinh_DangBay(); 
    },
    Handle_StartBetting(responseData)
    {
      
        this.Aviator_ListUser.clear();

        this.planeContrl.setPlaneStatus(cc.PlaneState.IDLE);
        this.planeContrl.resetAllObject();
        this.StartBetPopup.Setup();
        //this.boxBet1.betState = cc.BetState.NONE_BET;
        this.boxBet1.gameState = cc.AviatorPhase.BETTING;
        this.lbHeSoCashOut.node.stopAllActions(),
        this.lbHeSoCashOut.node.active = false,
        this.lbHeSoCashOut.string = "1.00x",
        this.lbHeSoCashOut.node.scale = 1;
        this.boxBet1.initData(this.gameController.GetGamePhase(), this.gameController.GetSessionID());
        this.boxBet1.startBettingResponse();
      
    },
    //#endregion

    //#region  Request Content
    betting(betAmount,sessionID,eid)
    {
        if(betAmount >= 0)
        {     
            if(this.gameController.GetGamePhase() != cc.AviatorPhase.BETTING)
            return;

            let currentSessionID = this.gameController.GetSessionID();
            
            var data = {
                M: cc.MethodHubName.BETTING,
                A:[betAmount,currentSessionID,eid]
            };
            this.crashGameHub.send(data);
            this.audioController.audioPool.playClickBtn();
        }
    },

    autoCashout(betAmount,sessionID,heSo_AutoCashout,eid)
    {
        let currentSessionID = this.gameController.GetSessionID();
            
        var data = {
            M: cc.MethodHubName.BETTING,
            A:[betAmount,currentSessionID,eid,aid,heSo_AutoCashout]
        };
        this.crashGameHub.send(data);
    },
    cashout(sessionID,eid)
    {
        cc.log("SEND CASHOUT")
        var data = {
            M: cc.MethodHubName.CASHOUT,
            A:[sessionID,eid]
        };
        this.crashGameHub.send(data);
    },
    //#endregion
    Handle_BettingResponse(data)
    {
        let betModel = data[0];
        let accountBalance = parseInt(data[1]);
        if(betModel.eid === 1)
        {
            this.boxBet1.betState = cc.BetState.BETTED;
            this.boxBet1.addBettingResponse();
            this.boxBet1.initData(this.gameController.GetGamePhase(), this.gameController.GetSessionID());
        }
        else if(betModel.eid === 2)
        {

        }
        this.countSession = 0;
        if(accountBalance >= 0)
            cc.BalanceController.getInstance().updateBalance(accountBalance);

       
    },
    Handle_CashoutResponse(data)
    {
        let betModel = data[0];
        this.boxBet1.betState = cc.BetState.NONE_BET;
        this.boxBet1.cashOutResponse();
        this.Aviator_ListUser.updateCashoutOfMine(betModel);
    },
    Handle_UpdateBettingResponse(data)
    {
        let bettingArray = data[0];
        if(bettingArray.length > 0)
        {
            this.Aviator_ListUser.updateBettingListUserBet(bettingArray);
            this.Aviator_ListUser.UpdateBettingResponse(bettingArray);
        }

    },
    Handle_AddBettingResponse(data)
    {
        this.Aviator_ListUser.AddBettingResponse(data);    
    },
   

    //#region Config Popup
    onClick_SettingBtn()
    {
        this.audioController.audioPool.playClickBtn();
        this.showSettingPopup = !this.showSettingPopup;
        if(this.showSettingPopup)
        {
            this.Setting_Popup_Animation.play("ConfigPopupIn");
        }
        else
        {
            this.Setting_Popup_Animation.play("ConfigPopupOut");
        }
    },

    onClick_LuatchoiBtn()
    {
        this.audioController.audioPool.playClickBtn();
        this.gameController.AssetManager.Create_LuatChoiPopup();
    },

    onClick_TopPlayerBtn()
    {
        this.audioController.audioPool.playClickBtn();
        this.gameController.AssetManager.Create_TopPlayerPopup();
    },
    onClick_HistoryPopup()
    {
        this.audioController.audioPool.playClickBtn();
        this.gameController.AssetManager.Create_HistoryPopup();
    },
    onClick_SettingPopup()
    {
        this.audioController.audioPool.playClickBtn();
        this.gameController.AssetManager.Create_SettingPopup();
    }
    //#endregion


});
