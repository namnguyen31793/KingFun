
var CHPT_Freespin_LogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new CHPT_Freespin_LogicManager();
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
        this.Total_Turn = 10;
        this.counterTurn = 0;
        this.CurrentRoomConfig = {
            "RoomBetId": 1,
            "Bet": 1000,
            "VipId": 0
        }
        this.totalFreeturnReward = 0;
    },
    FreeSpinController_Setup(mainController,FreespinRemain,packet,isShowTutorial,isTryPlay,currentMatrix,currentExtraMatrix)
    {

       
        this.spinView.ShowAnimation_StartFree();
        this.Setup();
        this.mainController = mainController;
        this.roomID = mainController.roomID;
        this.gameID = mainController.gameID;
        this.CurrentRoomConfig = mainController.CurrentRoomConfig;
        this.CurrentSpecialItem = mainController.CurrentSpecialItem;
       
        this.freespinRemain = FreespinRemain;
        //this.Total_Turn = this.freespinRemain;
        this.lastMatrix = currentMatrix;
        this.counterTurn = this.Total_Turn - this.freespinRemain;
        this.spinView.SetCurrentTurn_Lb(this.counterTurn);
        this.spinView.SetTotalTurn_Lb(this.Total_Turn);
        this.spinView.setupTryPlay(isTryPlay);
        this.setTutorialView(mainController.tutorialView);
       
        
        let currentJackpotModel = mainController.currentJackpotModel;
        let jackpotModel = JSON.parse(currentJackpotModel)
        this.jackpotView.UpdateJackpotValue(jackpotModel);
        
     
        if(currentMatrix !== ''&& currentMatrix !== null && currentMatrix !== 'undefined')
            this.SetDefaultMatrix(currentMatrix);

        
        for(let i=0;i< this.spinView.miniSpinColumnViews.length;i++)
        {
            this.spinView.miniSpinColumnViews[i].setDefaultResultData(currentExtraMatrix);
        }

        this.ShowAnimation_UnlockJackpot(currentMatrix);
    },
   
    setRoomID(roomID)
    {
        this.roomID = roomID;
    },
    setGameID(gameID)
    {
        this.gameID = gameID;
    },
    setJackpotView(jackpotView)
    {
        this.jackpotView = jackpotView;
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
    setFreeturnNumber(freeturnCounter)
    {
        this.spinView.setFreeturnNumber_UI(freeturnCounter);
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
    setTutorialView(tutorialView){
        this.tutorialView = tutorialView;
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
    stopMiniReelSpinFinish() {
        return this.spinView.stopMiniSpinFinish();
    },
    getLastSpinResponseData()
    {
        return this.spinResponseData;
    },

    getIsFastSpin()
    {
        return this.spinView.isFastSpin;
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
          //  this.activeButtonAutoSpin(false);
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
       

    },
    ServerResponse_Handle_GetSpinResult(packet)
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
        let currentJackpotModel = packet[12];
        let isTakeJackpot = packet[13];
        let extandMatrix = packet[14];
       
            this.spinResponseData = packet;
            let isNearWin = false;
            this.spinView.startSpin(isNearWin);

        this.counterTurn ++;
        this.spinView.SetCurrentTurn_Lb(this.counterTurn);
        this.spinView.resetColumnEffect();
        this.freespinRemain = freeSpinLeft;
       
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
        
        let jackpotModel = JSON.parse(currentJackpotValue)
        this.jackpotView.UpdateJackpotValue(jackpotModel);

        cc.BalanceController.getInstance().subTryBalance(this.CurrentRoomConfig.Bet);
       
        this.spinResponseData = packet;
        this.spinView.startSpin(this.checkNearWin(matrix));

                    
        this.counterTurn ++;
        this.spinView.SetCurrentTurn_Lb(this.counterTurn);
        this.spinView.resetColumnEffect();
        this.freespinRemain = freeSpinLeft;

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

    BackFromJackpotView()
    {
        cc.BalanceController.getInstance().refeshBalanceView();
    },

    BeforeNextSpin(columnArray,hasFreeSpin,isTakeJackpot)
    {
        this.Handle_UpdateTotalReward();
        this.spinView.scheduleOnce(()=>{
            if(hasFreeSpin)
            {
                this.effectView.Handle_TakeFreeSpin(columnArray);
              
            }
            else if(isTakeJackpot > 0)
            {
                
                this.Handle_CreateJackpotView();
            }
            else
            {
                
                this.Handle_NextAutoSpin();
            }
            
        }, 1.5)       
    },
    Handle_UpdateTotalReward()
    {
        let packet = this.spinResponseData;

        let freeSpinLeft = packet[7];
        let isTakeJackpot = packet[13];
        let winNormalValue = packet[4];     
        let totalWin = packet[9];
       
        if(totalWin >  winNormalValue)
        {
            if(isTakeJackpot == 0)
            {
                this.spinView.updateTotalWinUI(totalWin);
            }
        }
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

        let jackpotModel = JSON.parse(currentJackpotValue)
        this.jackpotView.UpdateJackpotValue(jackpotModel);
      

        this.totalFreeturnReward += totalWin;
       
        // chay animation 
        this.spinView.Handle_AfterStopSpin(this.spinResponseData);  
        this.effectView.ShowAnimation_FinishSpin(this.spinResponseData);
        if(freeSpinLeft > 0)
        {
            this.lastAutoTurn = this.isAutoSpin;        
          //  this.spinView.setFreeturnNumber_UI(freeSpinLeft);
          
        }
        
        
  
    },
    Handle_AutoRespin(timeDelay = 2)
    {
           this.spinView.scheduleOnce(()=>{
               this.spinView.onClick_Spin();
           },timeDelay);    
       
    },
    Handle_NextAutoSpin()
    {
        let freeSpinLeft = this.spinResponseData[7];
        if(freeSpinLeft > 0)
            this.Handle_AutoRespin();
        else
        {
            this.spinView.scheduleOnce(()=>{
                require("CHPT_SpinController").getIns().mainView.Destroy_FreeGame_View(this.totalFreeturnReward);
            },2);    
        }
        
          
    },

    FinishAnimation_JackpotAnim()
    {
   
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

   

    GetTryPlayData()
    {   
        if(this.tutorialView)
            return this.tutorialView.GetTutorialData();
        return null;
    },

    PlayTutorial(tryPlayData)
    {
        this.ServerResponse_Handle_ChoiThu(tryPlayData);
    },
   
    CheckNotEnoughMoney()
    {
        return true;

        if(cc.BalanceController.getInstance().getBalance() >= this.CurrentRoomConfig.Bet)
            return true;
        return false;
    },
      
    SetDefaultMatrix(defaultMatrix)
    {
        this.defaultMatrix = defaultMatrix;
        this.spinView.SetupFreespin_View(defaultMatrix);   
    },

    ShowAnimation_UnlockJackpot(defaultMatrix)
    {
        if(this.mainController.spinView.isPauseTutorialFlag("pauseFreeGame"))
        {
            this.mainController.spinView.onIngameEvent("ENTER_GAME_MODE");
            this.mainController.spinView.storeCurrentScripts = "ShowAnimation_UnlockJackpot";
            this.mainController.spinView.storeNextScripts = {
                script:   this.ShowAnimation_UnlockJackpot,
                object :  this,
                data: defaultMatrix,                     
            };

        }
        else
        {
            this.lineManager.CreateVfxGongItem();
            this.effectView.CreateEffect_UnlockJackpot(defaultMatrix);

            this.Handle_AutoRespin();
            
        }
        
    },
 
    Handle_CreateJackpotView()
    {
        let packet = this.spinResponseData;
        let jackpotType = packet[13];
        let totalWin = packet[9];
        let currentJackpotValue = packet[12];
        this.mainView.Create_JackpotView(currentJackpotValue,jackpotType,totalWin);   
    },
  

    
});
