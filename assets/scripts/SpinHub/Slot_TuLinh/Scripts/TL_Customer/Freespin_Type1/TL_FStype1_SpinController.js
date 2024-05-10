var TL_ResponseCode = require('TL_ResponseCode');
var TL_FStype1_SpinController = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new TL_FStype1_SpinController();
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
        this.lastAutoTurn = false;

        this.totalFreeturnReward = 0;
    },
    FreeSpinController_Setup(mainController,FreespinRemain,packet,isShowTutorial,isTryPlay,currentMatrix)
    {
        this.mainController = mainController;
        this.spinView.ShowAnimation_StartFree();
        this.Setup();

        this.roomID = mainController.roomID;
        this.gameID = mainController.gameID;
        this.CurrentRoomConfig = mainController.CurrentRoomConfig;
        this.CurrentSpecialItem = mainController.CurrentSpecialItem;
       
        this.freespinRemain = FreespinRemain;
        
        this.lastMatrix = currentMatrix;
      
        this.setTutorialView(mainController.tutorialView);
        this.spinView.setFreeturnNumber_UI(this.freespinRemain);
        this.effectView.SpinEffect_RemainSetup(packet);
        this.spinView.setupTryPlay(isTryPlay);
        this.jackpotView.Freespin_Type1_JackpotView_Setup(this.CurrentSpecialItem);

        let currentJackpotModel = mainController.currentJackpotModel;
        let jackpotModel = JSON.parse(currentJackpotModel)
        this.jackpotView.UpdateJackpotValue(jackpotModel);

        let totalBet = this.CurrentSpecialItem.Price * this.CurrentRoomConfig.Bet;
        this.setBetValue(totalBet);
        this.spinView.setCuocLbUI("X"+this.CurrentRoomConfig.Bet);

        if(currentMatrix !== ''&& currentMatrix !== null && currentMatrix !== 'undefined')
        this.SetDefaultMatrix(currentMatrix);

        if(this.mainController.spinView.isPauseTutorialFlag("pauseFreeGame"))
        {
            this.mainController.spinView.onIngameEvent("ENTER_GAME_MODE");

            this.spinView.storeCurrentScripts = this.spinView.onClick_Spin;
            this.spinView.storeNextScripts = {
                script:   this.spinView.onClick_Spin,
                object :  this.spinView,
                data: '',                     
            };
        }
        else
        {
            this.spinView.scheduleOnce(()=>{
                
                this.Handle_AutoRespin();
            },2);
        }


    },
    setRoomID(roomID)
    {
        this.roomID = roomID;
    },
    setGameID(gameID)
    {
        this.gameID = gameID;
    },
    setTutorialView(tutorialView){
        this.tutorialView = tutorialView;
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
    setJackpotView(jackpotView)
    {
        this.jackpotView = jackpotView;
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
    SetDefaultMatrix(defaultMatrix)
    {
        this.defaultMatrix = defaultMatrix;
        this.spinView.SetupFreespin_View(defaultMatrix);
        this.SetTichLuyUI(defaultMatrix);
        /*
        this.effectView.SetLastMatrix(defaultMatrix);
        this.SetProcessJackpotUI(defaultMatrix);
       
        */
    },

    ResponseNetwork(code, packet) {
        switch (code) {
            case TL_ResponseCode.MSG_SERVER_GET_ROOM_CONFIG:
                this.ServerResponse_Handle_GetRoomConfig(packet);
                break;
            case TL_ResponseCode.MSG_SERVER_TU_LINH_GAME_GET_ACCOUNT_INFO:
               this.ServerResponse_Handle_GetAccountInfo(packet);
                break;
            case TL_ResponseCode.MSG_SERVER_TU_LINH_GAME_JACKPOT_INFO:
                this.ServerResponse_Handle_GetJackpotInfo(packet);
                break;
            case TL_ResponseCode.MSG_SERVER_TU_LINH_GAME_SPIN:
                this.ServerResponse_Handle_GetSpinResult(packet);
                break;
            case TL_ResponseCode.MSG_SERVER_TU_LINH_GAME_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case TL_ResponseCode.MSG_SERVER_TU_LINH_GAME_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
                break;
            case TL_ResponseCode.MSG_SERVER_TU_LINH_GAME_X2_REWARD:
                this.X2GameController.Handle_X2Game_Response(packet);
                break;
            case TL_ResponseCode.MSG_SERVER_TU_LINH_GAME_SPIN_CHOI_THU:
                this.ServerResponse_Handle_ChoiThu(packet);
                break;
            case TL_ResponseCode.MSG_SERVER_TU_LINH_GAME_SELECT_FREE_TYPE:
                this.ServerResponse_Handle_SelectFreeType(packet);
                break;
        }
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
       
        let jackpotModel = JSON.parse(currentJackpotValue)
        this.jackpotView.UpdateJackpotValue(jackpotModel);

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
        {
            this.spinView.setCuocLbUI("X"+this.CurrentRoomConfig.Bet);
        }
            //this.setBetValue(this.CurrentRoomConfig.Bet);

        let specialItemArray = packet[2].map(jsonString => JSON.parse(jsonString));           
        this.SpecialItemMap = specialItemArray;
        this.CurrentSpecialItem = this.SpecialItemMap.find(obj => obj.Input ==  this.specialID );
        let totalBet = this.CurrentSpecialItem.Price * this.CurrentRoomConfig.Bet;
        this.setBetValue(totalBet);

      
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
        let currentJackpotValue = packet[12];
        let isTakeJackpot = packet[13];
        let extandMatrix = packet[14];
 
        this.spinResponseData = packet;
        let isNearWin = false;
         this.spinView.startSpin(isNearWin);
       
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
        let currentJackpotModel = this.spinResponseData[12];
        let isTakeJackpot = this.spinResponseData[13];
        let extandMatrix = this.spinResponseData[14];

        this.totalFreeturnReward += totalWin;
        // chay animation 
        this.spinView.Handle_AfterStopSpin(this.spinResponseData);  
        this.effectView.ShowAnimation_FinishSpin(this.spinResponseData);
        if(numberBonusSpin > 0)
        {
            this.mainView.Create_BonusGameView();
            this.bonusGameView.BonusGame_SetUp(this.spinResponseData);
        }
        else if(freeSpinLeft > 0)
        {
            this.lastAutoTurn = this.isAutoSpin;        
            this.spinView.setFreeturnNumber_UI(freeSpinLeft);
           
        }
        else if(isTakeJackpot)
        {
           // this.spinView.enableNhen_Charactor(false);
           // this.mainView.Create_JackpotView();
        }
     
        if(freeSpinLeft > 0)
        {
            if(!isTakeJackpot)
                this.Handle_AutoRespin();
            else
                this.Handle_AutoRespin(12);
        }

        let jackpotModel = JSON.parse(currentJackpotModel)
        this.jackpotView.UpdateJackpotValue(jackpotModel);
       

      
    },
    Handle_AutoRespin(timeSchedule = 3)
    {
        this.spinView.scheduleOnce(()=>{
            this.spinView.onClick_Spin();
        },timeSchedule);    
        
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
    SetTichLuyUI(matrix)
    {
        let totalGreen = 0;
        let totalYellow = 0;
        const stringArray = matrix.split(",");  
       for(let i=0;i< stringArray.length;i++)
       {
        if (stringArray[i].includes('.'))
        {
            let [integerPart, decimalPart] = stringArray[i].split('.');
            integerPart = parseInt(integerPart);
            decimalPart = parseInt(decimalPart);
            if (integerPart === 3) 
            {
                totalGreen += decimalPart;                   
            }
          
        }
       }
       this.spinView.setTichLuyLb(totalGreen);
    }
      

    
     
      
      
      
      
});
