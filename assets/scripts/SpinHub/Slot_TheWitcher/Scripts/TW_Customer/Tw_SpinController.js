var TW_ResponseCode = require('TW_ResponseCode');
var Tw_SpinController = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new Tw_SpinController();
                this.self.Setup();
            }
            return this.self;
        }
    },

    properties: {
       
    },
    Setup()
    {
        //this.betLinesText();
        this.lineIndex = 25;
        this.lineInfo = "";      
        this.roomID = 1;
        this.lastAutoTurn = false;
        this.isAutoSpin = false; 
    },

    setRoomID(roomID)
    {
        this.roomID = roomID;
    },
    setGameID(gameID)
    {
        this.gameID = gameID;
    },

    Inc_RoomID()
    {
        // Sử dụng map để lấy mảng các giá trị RoomBetId
        let roomBetIds = this.RoomConfig_Map.map(item => item.RoomBetId);

        // Sử dụng Math.min và Math.max để tìm giá trị nhỏ nhất và lớn nhất
       
        let maxRoomBetId = Math.max(...roomBetIds);
        if(this.roomID >= maxRoomBetId)
        return false;

        this.roomID++;
        if(this.roomID > maxRoomBetId)
            this.roomID = 1;
        return true;

    },
    Dec_RoomID()
    {
        // Sử dụng map để lấy mảng các giá trị RoomBetId
        let roomBetIds = this.RoomConfig_Map.map(item => item.RoomBetId);

        // Sử dụng Math.min và Math.max để tìm giá trị nhỏ nhất và lớn nhất
        let minRoomBetId = Math.min(...roomBetIds);
       
        if(this.roomID <= minRoomBetId)
            return false;
        this.roomID--; 
        return true;
    },
    
    setIconView(iconView) {
        return this.iconView = iconView;
    },

    getIconView() {
        return this.iconView;
    },

    setSpinView(spinView) {
        return this.spinView  = spinView;
    },

    setEffectView(effectView)
    {
        return this.effectView = effectView;
    },
    setPopupView(popupView)
    {
        return this.popupViewManager = popupView;
    },
    setAudioPool(audioPool)
    {
        this.audioPool = audioPool;
    },

    setBetValue(betValue)
    {
        if (this.spinView.lbiTotalBet) {
            this.spinView.updateTotalBet(betValue);
        }
        return this.betValue = betValue;
    },
    getBetValue() {
        return this.betValue;
    },

    setButtonView(buttonView)
    {
        return this.buttonView = buttonView;
    },
    setBonusGameView(bonusGameView)
    {
        return this.bonusGameView = bonusGameView;
    },
    setMainView(mainView)
    {
        return this.mainView = mainView;
    },
    setFreeGameView(freeGameView)
    {
        return this.freeGameView = freeGameView;
    },
    setLineManager(lineManager)
    {
        return this.lineManager = lineManager;
    },
    setTutorial(tutorialManager)
    {
        return this.tutorialManager = tutorialManager;
    },
    setBetConfigByBet(betValue)
    {
        this.CurrentRoomConfig =  this.RoomConfig_Map.find(obj => obj.Bet ==  betValue);
        this.setBetValue(this.CurrentRoomConfig.Bet);
    },
    activeButtonSpin(enable) {
        this.isSpin = !enable;
        if (this.buttonView === undefined)
            return;
        return this.buttonView.activeButtonSpin(enable);
    },
    activeButtonX2(enable)
    {
        this.buttonView.activeButtonX2(enable);
    },
    activeButtonAutoSpin(enable) {
        this.isAutoSpin = enable;
        return this.buttonView.activeButtonAutoSpin(enable);
    },
    checkIsSpin() {
        if (!this.isAutoSpin && !this.isSpin) {
            return false;
        } else {
            return true;
        }
    },
    stopSpinFinish() {
        return this.spinView.stopSpinFinish();
    },
    getLastSpinResponseData()
    {
        return this.spinResponseData;
    },

    getIsFastSpin()
    {
        return this.spinView.isFastSpin;
    },

    ResponseNetwork(code, packet) {
        switch (code) {
            case TW_ResponseCode.MSG_SERVER_GET_ROOM_CONFIG:
                this.ServerResponse_Handle_GetRoomConfig(packet);
                break;
            case TW_ResponseCode.MSG_SERVER_THE_WITCHER_GAME_GET_ACCOUNT_INFO:
               this.ServerResponse_Handle_GetAccountInfo(packet);
                break;
            case TW_ResponseCode.MSG_SERVER_THE_WITCHER_GAME_JACKPOT_INFO:
                this.ServerResponse_Handle_GetJackpotInfo(packet);
                break;
            case TW_ResponseCode.MSG_SERVER_THE_WITCHER_GAME_SPIN:
                this.ServerResponse_Handle_GetSpinResult(packet);
                break;
            case TW_ResponseCode.MSG_SERVER_THE_WITCHER_GAME_GET_DETAIL_HISTORY:
            case TW_ResponseCode.MSG_SERVER_SPINHUB_SLOT_GAME_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case TW_ResponseCode.MSG_SERVER_THE_WITCHER_GAME_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
                break;
            case TW_ResponseCode.MSG_SERVER_THE_WITCHER_GAME_X2_REWARD:
                this.X2GameController.Handle_X2Game_Response(packet);
                break;
            case TW_ResponseCode.MSG_SERVER_THE_WITCHER_GAME_SPIN_CHOI_THU:
                this.ServerResponse_Handle_ChoiThu(packet);
                break;
        }
    },

    GetHistory(packet) {
        require("Tw_SpinController").getIns().mainView.HistoryResponseServer(packet);
    },

    ServerResponse_Handle_GetAccountInfo(packet)
    {
        let accountBalance = packet[1];
        let betPerLine = packet[2];
        let jackpotValue = packet[3];
        let lineData = packet[4];
        let lastPrizeValue = packet[5];
        let freeSpin = packet[6];
        let isTakeFreeSpin = packet[7];
        let bonusCounter = packet[8];
        let isBonusTurn = packet[9];
        let lastMatrix = packet[10];

        // update balance 
        cc.BalanceController.getInstance().updateRealBalance(accountBalance);
        cc.BalanceController.getInstance().updateBalance(accountBalance);

        if(this.CurrentRoomConfig != null)
            this.setBetValue(this.CurrentRoomConfig.Bet);
        this.spinView.updateJackpotUI(jackpotValue);
        this.spinView.randomIcon()  
       
        
        if(bonusCounter > 0)
        {
            this.mainView.Create_BonusGameView();
            this.bonusGameView.BonusGame_SetUp(this.packet);
        }
        else if(freeSpin > 0)
        {
            this.lastAutoTurn = this.isAutoSpin;           
            this.activeButtonAutoSpin(false);
            if(this.freeGameView == null)
            {
                
                this.mainView.Create_FreeGameView(freeSpin,packet);             
            }
            else
            {
                this.freeGameView.FreeSpin_UpdateInfo(freeSpin);
            }
        }

        if(this.RoomConfig_Map != null)
            this.CurrentRoomConfig = this.RoomConfig_Map.find(obj => obj.RoomBetId ==  this.roomID );
     
    },

    ServerResponse_Handle_GetRoomConfig(packet)
    { 
       
        let roomConfigArray = packet[1].map(jsonString => JSON.parse(jsonString));           
        this.RoomConfig_Map = roomConfigArray;
        this.CurrentRoomConfig = this.RoomConfig_Map.find(obj => obj.RoomBetId ==  this.roomID );

        if(this.CurrentRoomConfig != null)
            this.setBetValue(this.CurrentRoomConfig.Bet);
      // this.spinView.updateTotalLines(this.lineIndex);
       
    },

   
    ServerResponse_Handle_GetJackpotInfo(packet)
    {
        let jackpotValue_Room1 = packet[1];
        let jackpotValue_Room2 = packet[2];
        let jackpotValue_Room3 = packet[3];

       switch(this.roomID)
       {
            case 1:
                this.spinView.updateJackpotUI(jackpotValue_Room1);
                break;
            case 2:
                this.spinView.updateJackpotUI(jackpotValue_Room2);
                break;
            case 3:
                this.spinView.updateJackpotUI(jackpotValue_Room3);
                break;
       }

    },
    ServerResponse_Handle_GetSpinResult(packet)
    {
        cc.log("---------ServerResponse_Handle_GetSpinResult----------");
        
        let spinId = packet[1];
        let matrix = packet[2];
        let listLineWinData = packet[3];
        let winNormalValue = packet[4];
        let numberBonusSpin = packet[5];
        let winBonusValue = packet[6];
        let freeSpinLeft = packet[7];
        
        let valueFreeSpin = packet[8];
        let totalWin = packet[9];
        let accountBalance = packet[11];
        let currentJackpotValue = packet[12];
        let isTakeJackpot = packet[13];
        let extandMatrix = packet[14];
       
        this.spinView.updateJackpotUI(currentJackpotValue);
        cc.BalanceController.getInstance().subtractBalanceUI(this.CurrentRoomConfig.Bet);
       
        if(this.mainView.Freespin_View)
        {
            require("Tw_Freespin_Controller").getIns().ServerResponse_Handle_GetSpinResult(packet);
        }
        else
        {
            this.spinResponseData = packet;
            let isNearWin = this.checkNearWin(matrix);
            this.spinView.startSpin(isNearWin);
        }
        
    },

    ServerResponse_Handle_ChoiThu(packet)
    {
        let spinId = packet[1];
        let matrix = packet[2];
        let listLineWinData = packet[3];
        let winNormalValue = packet[4];
        let numberBonusSpin = packet[5];
        let winBonusValue = packet[6];
        let freeSpinLeft = packet[7];
        let valueFreeSpin = packet[8];
        let totalWin = packet[9];
        let accountBalance = packet[11];
        let currentJackpotValue = packet[12];
        let isTakeJackpot = packet[13];
        let extandMatrix = packet[14];
        let totalBet = packet[15];
        
        this.spinView.updateJackpotUI(currentJackpotValue);
        cc.log(">>ServerResponse_Handle_ChoiThu : " + this.CurrentRoomConfig.Bet);
        cc.BalanceController.getInstance().subTryBalance(this.CurrentRoomConfig.Bet);
       
        this.spinResponseData = packet;
        this.spinView.startSpin(this.checkNearWin(matrix));
    },
    Handle_ShowEffect(type, rewardAmount, time)
    {
        this.effectView.node.active = true;
        this.effectView.ShowEffect(type, rewardAmount, time);
    },
    Handle_ResetEffect()
    {
        this.effectView.ResetAllEffect();

    },
    Handle_Inc_BetLine(lineIndex)
    {  
            this.lineIndex = lineIndex;      
    },

    Get_LineInfo()
    {
        return '';
    },
    DefaultMaxLineInfo()
    {
        return '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25';
    },
    Defaul_MaxRoom()
    {
        return 3;
    },

    Handle_AfterSpinAnimation()
    {
        let spinId = this.spinResponseData[1];
        let matrix = this.spinResponseData[2];
        let listLineWinData = this.spinResponseData[3];
        let winNormalValue = this.spinResponseData[4];
        let numberBonusSpin = this.spinResponseData[5];
        let winBonusValue = this.spinResponseData[6];
        let freeSpinLeft = this.spinResponseData[7];
        let valueFreeSpin = this.spinResponseData[8];
        let totalWin = this.spinResponseData[9];
        let accountBalance = this.spinResponseData[11];
        let currentJackpotValue = this.spinResponseData[12];
        let isTakeJackpot = this.spinResponseData[13];
        let extandMatrix = this.spinResponseData[14];

        this.spinView.Handle_AfterStopSpin(this.spinResponseData);  
        
        if(numberBonusSpin > 0)
        {
            this.mainView.Create_BonusGameView();
            this.bonusGameView.BonusGame_SetUp(this.spinResponseData);
        }
        else if(freeSpinLeft > 0)
        {
            this.lastAutoTurn = this.isAutoSpin;        
            this.activeButtonAutoSpin(false);

            if(this.freeGameView == null)
            {
                this.popupViewManager.ShowPopup_FreespinPopup();
                this.spinView.scheduleOnce(()=>{     
                    require("AudioController_V2").getIns().stopBackgroundMusic();
                    this.popupViewManager.OffPopup_FreespinPopup(this.mainView.Create_FreeGameView(freeSpinLeft,this.spinResponseData));
                       
                },3);
                
            }
            else
            {
                this.freeGameView.FreeSpin_UpdateInfo(freeSpinLeft);
            }
            this.Handle_AutoRespin();
        }
        else if(isTakeJackpot)
        {
            this.spinView.enableNhen_Charactor(false);
            this.mainView.Create_JackpotView();
        }
        else
        {
            let timedelay = 2;
            let hasSwortItem = this.hasSmallItem(matrix);
            if(totalWin == 0 && !hasSwortItem)
                timedelay = 0.5;
            if(!isTakeJackpot)
                this.Handle_AutoRespin(timedelay);
        }
        if(freeSpinLeft == 0)
        {
            if(this.freeGameView != null)
                this.freeGameView.node.destroy();
        }

      
    },
    Handle_AutoRespin(timedelay = 2)
    {
        if(this.isAutoSpin)
        {
           this.spinView.scheduleOnce(()=>{
               this.spinView.onClick_Spin();
           },timedelay);    
        }
    },

    FinishAnimation_JackpotAnim()
    {
        
        this.spinView.enableNhen_Charactor(true);
        this.spinView.FinishAnimation_JackpotAnim();
    },

    checkNearWin(matrixString) {
       return this.countOccurrences(matrixString, ',3,');
      },
    countOccurrences(str, target) {
        // Sử dụng biểu thức chính quy để tìm tất cả các xuất hiện của ký tự target trong chuỗi str
        const regex = new RegExp(target, 'g');
        const matches = str.match(regex);
      
        // Nếu có matches, trả về số lần xuất hiện, ngược lại trả về 0
        return matches ? matches.length : 0;
    },

    BackFromFreespinView()
    {
        if(this.spinView.tryPlay)
        {
            this.spinView.Tw_Hero_Animation.ShowAnimation_Idle_KiemGo();
        }
        else
        {
            this.spinView.Tw_Hero_Animation.ShowAnimation_Idle_KiemSat();
        }

        if(this.lastAutoTurn)
        {
          
            this.spinView.scheduleOnce(()=>{
                this.activeButtonAutoSpin(this.lastAutoTurn);
                this.Handle_AutoRespin();
            },3);
            
        }
        if(this.tutorialManager)
        {
            this.tutorialManager.ShowAnimation_AfterFromFreespinView();
        }
        this.audioPool.SetupAudioPool();
        require("AudioController_V2").getIns().playBackgroundMusic();  
    },

    GetTryPlayData()
    {   
        if(this.tutorialManager)
            return this.tutorialManager.GetTutorialData();
        return null;
    },

    PlayTutorial(tryPlayData)
    {
        this.ServerResponse_Handle_ChoiThu(tryPlayData);
    },
   
    CheckNotEnoughMoney()
    {
        if(cc.BalanceController.getInstance().getBalance() >= this.CurrentRoomConfig.Bet)
            return true;
        return false;
    },
    hasSmallItem(matrix)
    { 
      const numbers = matrix.split(",");
      
      for (const number of numbers) {
        if (number > 20) {
          return true;
        }
      }
      
      return false;
    }
    
      
     
      
      
      
      
});
