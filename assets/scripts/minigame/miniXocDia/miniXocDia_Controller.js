
var miniXocDia_Controller = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new miniXocDia_Controller();
                this.self.Setup();
            }
            return this.self;
        }
    },

    Setup()
    {
        this.isNan = false;
    },

    SetGateManager(gateManager)
    {
        this.GateManager = gateManager;
    },

    SetXocDiaView(xocDiaView)
    {
        this.XocDiaView = xocDiaView;
    },

    SetXocDiaInfo(xocDiaInfo)
    {
        this.XocDiaInfo = xocDiaInfo;
    },

    SetResultManager(resultManager)
    {
        this.ResultManager = resultManager;
    },
    SetPopupManager(popupManager)
    {
        this.PopupManager = popupManager;
    },
    SetBetManager(betManager)
    {
        this.BetManager = betManager;
    },
    SetChipManager(chipManager)
    {
        this.ChipManager = chipManager;
    },
    SetJackpotView(jackpotview)
    {
        this.Jackpotview = jackpotview;
    },
    SetJackpotValue(jackpotValue)
    {
        this.Jackpotview.setJackpotValue(jackpotValue);
    },
    SetHelpPopup(helpPopup)
    {
        this.HelpPopup = helpPopup
    },
    SetRankPopup(rankPopup)
    {
        this.RankPopup = rankPopup;
    },
    SetAssetManager(assetManager)
    {
        this.AssetManager = assetManager;
    },
    GetAssetManager()
    {
        return this.AssetManager;
    },
    SetSoiCauPopup(soiCauPopup)
    {
        this.SoiCauPopup = soiCauPopup;
    },
    SetPlayerHistory(playerHistoryPopup)
    {
        this.PlayerHistoryPopup = playerHistoryPopup;
    },
   
  

    onNotifyChangePhrase(data)
    {
        this.XocDiaInfo.onNotifyChangePhrase(data);
    },
    updateRoomTimer(time)
    {
        this.XocDiaInfo.updateRoomTimer(time);
    },
    updateTotalBet(data) {
        return this.GateManager.updateTotalBet(data);
    },
    onShowResult(data)
    {
        this.ResultManager.ShowResult(data);
        this.GateManager.ShowGateWin(data);
        
    },
    ResetEffect()
    {
        this.ResultManager.ResetEffect();
        this.GateManager.ResetInfo();
        this.PopupManager.ResetAllPopup();
        this.ChipManager.ResetChip();
        this.Jackpotview.ResetEffect();
    },
    GetCurrentState()
    {
        return this.XocDiaInfo.currentState;
    },
    ShowPopup(content,showtime = 1.5)
    {
        this.PopupManager.showPopup(content,showtime);
    },
    updateTotalMyBetSide(betSide, total)
    {
        this.GateManager.updateTotalMyBetSide(betSide, total);
    },
    GetCurrentBet()
    {
        return  this.BetManager.getCurrentBetAmount();
    },
    SendRequestOnHub(method, data1, data2)
    {
        if (this.XocDiaView)
        return this.XocDiaView.sendRequestOnHub(method, data1, data2);
    },
    HandleWinResult(data)
    {
        let totalWin = parseInt(data.Award);
        this.GateManager.ShowGateMyWin();
        this.PopupManager.showWinPopup(totalWin);
    },
    PutChipToPool(nodeChip, betValue) {
        return this.ChipManager.putChipToPool(nodeChip, betValue);
    },
    CreateChip(type)
    {
        return this.ChipManager.createChip(type);
    },
    Enable_Rebet_Btn_Collection(enable)
    {
        this.BetManager.Enable_Rebet_Btn_Collection(enable);
    },
    MoveChipBet(betValue, betSide)
    {
        return this.ChipManager.MoveChipBet(betValue, betSide)
    },
    updateJackpot(data)
    {
        this.Jackpotview.setJackpotValue(data.JackpotValue);
    },
    ShowJackpotAlert(data)
    {
        this.Jackpotview.showJackpotAlert(data);
    },
    PlayerTakeJackpot(data)
    {
        let currentAccountBalance = parseInt(data[1]);
        cc.BalanceController.getInstance().updateBalance(currentAccountBalance);
    },
    EnableHelpPopup(enable)
    {
        this.HelpPopup.EnablePopup(enable);
    },
    GetCurrentSessionID()
    {
        return this.XocDiaInfo.getSessionID();
    },
    ReloadHistoryApi()
    {
        if(this.PlayerHistoryPopup)
        this.PlayerHistoryPopup.ReloadHistoryApi();
    },

    Enable_Bowl(enable)
    {
        if(this.isNan)
            this.ResultManager.Enable_Bowl(enable);
    },
    GetNanStatus()
    {
        return  this.isNan;
    },
    SetNanStatus(Enable)
    {
        this.isNan = Enable;
    }

    


  

});
