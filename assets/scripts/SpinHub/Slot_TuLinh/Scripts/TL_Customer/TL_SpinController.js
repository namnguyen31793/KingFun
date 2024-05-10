var TL_ResponseCode = require('TL_ResponseCode');
var TL_SpinController = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new TL_SpinController();
                this.self.Setup();
            }
            return this.self;
        }
    },

    properties: {
       
    },
    Setup()
    {
        this.specialID = 1;
        //this.betLinesText();
        this.lineIndex = 25;
        this.lineInfo = "";      
        this.roomID = 1;
        this.lastAutoTurn = false;

        this.FREEGAME_8_TYPE = 1;
        this.FREEGAME_TOPUP = 2;
        this.isAutoSpin = false; 
       
    },

    reloadRoomID(roomID)
    {
        this.roomID = roomID;
        this.spinView.getRoomConfig();
    },
    reloadJackpot()
    {
        this.spinView.getJackpot();
    },
    setGameID(gameID)
    {
        this.gameID = gameID;
    },
    setRoomID(roomID)
    {
        this.roomID = roomID;
      
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
    Inc_SpecialID()
    {
        // Sử dụng map để lấy mảng các giá trị RoomBetId
        let specialIds = this.SpecialItemMap.map(item => item.Input);

        // Sử dụng Math.min và Math.max để tìm giá trị nhỏ nhất và lớn nhất

        let maxSpecialIds = Math.max(...specialIds);
        if(this.specialID >= maxSpecialIds)
        return false;

        this.specialID++;
        if(this.specialID > maxSpecialIds)
            this.specialID = 1;
        return true;
    },
    Dec_SpecialID()
    {
        // Sử dụng map để lấy mảng các giá trị RoomBetId
        let specialIds = this.SpecialItemMap.map(item => item.Input);

        // Sử dụng Math.min và Math.max để tìm giá trị nhỏ nhất và lớn nhất

        let minSpecialIds = Math.min(...specialIds);
        if(this.specialID <= minSpecialIds)
        return false;

        this.specialID--;
        return true;
    },
    setExtraBet()
    {
        this.CurrentSpecialItem = this.SpecialItemMap.find(obj => obj.Input ==  this.specialID );
        let totalBet = this.CurrentSpecialItem.Price * this.CurrentRoomConfig.Bet;
        this.totalBet = totalBet;
        this.setBetValue(totalBet);
        this.spinView.setCuocLbUI("X"+this.CurrentRoomConfig.Bet);
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
    setJackpotView(jackpotView)
    {
        this.jackpotView = jackpotView;
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
    setTutorialView(tutorialView){
        this.tutorialView = tutorialView;
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
    setMuaBieuTuongView(muaBieuTuongView)
    {
        return this.muaBieuTuongView = muaBieuTuongView;
    },
    setMiniMuaBieuTuongView_Right(miniMuaBieuTuong_Right_View)
    {   
        return this.miniMuaBieuTuong_Right_View = miniMuaBieuTuong_Right_View;
    },
    setMiniMuaBieuTuongView_Bottom(miniMuaBieuTuong_Bottom_View)
    {   
        return this.miniMuaBieuTuong_Bottom_View = miniMuaBieuTuong_Bottom_View;
    },
    setLineManager(lineManager)
    {
        return this.lineManager = lineManager;
    },
    setSelectFreespin(selectFreeSpinType)
    {
        return this.selectFreeSpinType = selectFreeSpinType;
    },
    SelectFreespin_Setup(matrix)
    {
        this.selectFreeSpinType.ChonCachChoi_Setup(matrix);
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
    activeExtraBetBtn(enable)
    {
        this.buttonView.activeExtraBetBtn(enable);
    },
    activeButtonAutoSpin(enable) {
        this.isAutoSpin = enable;
        return this.buttonView.activeButtonAutoSpin(enable);
    },
    activeBetBtn(enable)
    {
        this.buttonView.activeBetBtn(enable);
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
            case TL_ResponseCode.MSG_SERVER_SPINHUB_SLOT_GAME_GET_DETAIL_HISTORY:
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

    GetHistory(packet) {
        require("TL_SpinController").getIns().mainView.HistoryResponseServer(packet);
    },

    ServerResponse_Handle_GetAccountInfo(packet)
    {
        cc.log(">>> ServerResponse_Handle_GetAccountInfo");
        let accountBalance = packet[1];
        let betPerLine = packet[2];
        let jackpotValue = packet[3];
        let lineData = packet[4];
        let lastPrizeValue = packet[5];
        let freeSpin = packet[6];
        let isTakeFreeSpin = packet[7];
        let bonusCounter = packet[8];
        let isBonusTurn = packet[9];
        let LastTurnDescription = packet[10];
        let isNotSelectFreeTurnType= packet[12];
        let lastMatrix= packet[13];
        let freeturnType = packet[14];
  
        if(isNotSelectFreeTurnType)
        {
            this.isNotSelectFreeTurnType = isNotSelectFreeTurnType;
            this.storeCurrentScripts = this.Show_SelectFreeturn_Type_Popup;
            this.storeNextScripts = {
                script:    this.Show_SelectFreeturn_Type_Popup,
                object: this,
                data: lastMatrix                     
            };
        }
        // update balance 
        cc.BalanceController.getInstance().updateRealBalance(accountBalance);
        cc.BalanceController.getInstance().updateBalance(accountBalance);

        
       // this.spinView.updateJackpotUI(jackpotValue);
       let jackpotModel = JSON.parse(jackpotValue)
       this.jackpotView.UpdateJackpotValue_BySpecialID(jackpotModel,this.specialID);       
        this.spinView.randomIcon()  
       
        
         if(freeSpin > 0)
        {
            this.lastAutoTurn = this.isAutoSpin;           
            this.activeButtonAutoSpin(false);
            if(this.freeGameView == null)
            {
                switch (freeturnType)
                {
                    case this.FREEGAME_8_TYPE:
                        this.mainView.Create_FreeGame_Type1_View(freeSpin,packet,LastTurnDescription);    
                        break;
                    case this.FREEGAME_TOPUP:
                        this.mainView.Create_FreeGame_Type2_View(freeSpin,packet,LastTurnDescription);    
                        break;
                }
                         
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
        this.CurrentRoomConfig = this.RoomConfig_Map.find(obj => obj.RoomBetId ==  this.roomID);

        if(this.CurrentRoomConfig != null)
        {
            this.spinView.setCuocLbUI("X"+this.CurrentRoomConfig.Bet);
        }

        let specialItemArray = packet[2].map(jsonString => JSON.parse(jsonString));           
        this.SpecialItemMap = specialItemArray;
        this.setExtraBet();

        this.miniMuaBieuTuong_Right_View.Mini_MuaBieuTuong_Setup(this.specialID);
        this. Show_Mini_MuaBieuTuong_Bot();
       // this.miniMuaBieuTuong_Bottom_View.Mini_MuaBieuTuong_Setup(this.specialID);
      
    },

   
    ServerResponse_Handle_GetJackpotInfo(packet)
    {
        var jackpotModel = JSON.parse(packet[1]);
        this.jackpotView.UpdateJackpotValue_BySpecialID(jackpotModel,this.specialID);
        if(jackpotModel !== null && jackpotModel !=='undefined')
            this.jackpotModel = jackpotModel;
        this.currentJackpotModel = packet[1];
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
       
        this.currentJackpotModel = currentJackpotModel;
        let jackpotModel = JSON.parse(currentJackpotModel)
        this.jackpotView.UpdateJackpotValue_BySpecialID(jackpotModel,this.specialID);

        if(jackpotModel !== null && jackpotModel !=='undefined')
            this.jackpotModel = jackpotModel;

        cc.BalanceController.getInstance().subtractBalanceUI(this.totalBet);     
        this.spinView.resetColumnEffect();

        this.spinResponseData = packet;
        if(this.mainView.Freespin_View_Type_2)
        {
            require("TL_Fs2_SpinController").getIns().ServerResponse_Handle_GetSpinResult(packet);
        }
        else if(this.mainView.Freespin_View_Type_1)
        {
            require("TL_FStype1_SpinController").getIns().ServerResponse_Handle_GetSpinResult(packet);
        }
        else
        {
          
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
        
       // this.spinView.updateJackpotUI(currentJackpotValue);
       let jackpotModel = JSON.parse(currentJackpotValue)
       this.jackpotView.UpdateJackpotValue_BySpecialID(jackpotModel);
        cc.BalanceController.getInstance().subTryBalance(this.CurrentRoomConfig.Bet);
       
        this.spinResponseData = packet;
        this.spinView.startSpin(this.checkNearWin(matrix));
    },
    ServerResponse_Handle_SelectFreeType(packet)
    {
        this.audioPool.playSelectBonusItem_Fx_Sound();
        this.isNotSelectFreeTurnType = null;

        let _NumberFreeSpin = packet[1];
        let freespinType = packet[2];
        let specialID = packet[3];
        let matrix = packet[4];
        if(freespinType == this.FREEGAME_8_TYPE)
        {
            this.mainView.Create_FreeGame_Type1_View(_NumberFreeSpin,this.spinResponseData,matrix) ;
        }
        else
        {
            this.mainView.Create_FreeGame_Type2_View(_NumberFreeSpin,this.spinResponseData,matrix) ;
        }
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

        // chay animation 
        this.spinView.Handle_AfterStopSpin(this.spinResponseData);  
       let hasWildItem = this.effectView.ShowAnimation_FinishSpin(this.spinResponseData);

        let jackpotModel = JSON.parse(currentJackpotValue)
        
        this.jackpotView.UpdateJackpotValue_BySpecialID(jackpotModel,this.specialID);
        this.spinView.onIngameEvent("ON_UPDATE_PERCENT_JACKPOT");
        
        if(freeSpinLeft > 0)
        {
            this.lastAutoTurn = this.isAutoSpin;        
            this.activeButtonAutoSpin(false);

            if(this.freeGameView == null)
            {     
                this.spinView.SetupSelectFreeSpin(matrix);                     
            }
            else
            {
                this.freeGameView.FreeSpin_UpdateInfo(freeSpinLeft);
            }
            this.Handle_AutoRespin();
        }
        else if(isTakeJackpot > 0)
        {
       
            this.audioPool.playStartBonus_Fx_Sound();

           this.effectView.ShowAnimation_StartBonus(()=>{
            this.mainView.Create_BonusGameView(extandMatrix,isTakeJackpot,totalWin,jackpotModel);
           });
           
        }
        else
        {
            let delayTime = 2;
            if(!hasWildItem && totalWin == 0)
                delayTime = 0;
            if(!isTakeJackpot)
                this.Handle_AutoRespin(delayTime);
        }
        if(freeSpinLeft == 0)
        {
            if(this.freeGameView != null)
                this.freeGameView.node.destroy();
        }

        this.spinView.onIngameEvent("GAME_RESET_SESSION");
      
    },
    Handle_AutoRespin(delayTime = 2)
    {
        if(this.isAutoSpin)
        {
           this.spinView.scheduleOnce(()=>{
               this.spinView.onClick_Spin();
           },delayTime);    
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

    BackFromFreespinView(totalFreeReward)
    {
        if(this.lastAutoTurn)
        {     
            this.spinView.scheduleOnce(()=>{           
                this.activeButtonAutoSpin(this.lastAutoTurn);
                this.Handle_AutoRespin();
            },5);
            
        }
        if(this.tutorialView)
        {
           // this.tutorialView.ShowAnimation_AfterFromFreespinView();
        }
        this.popupViewManager.ShowPopup_FreespinPopup(totalFreeReward);
        this.audioPool.SetupAudioPool();

        this.spinView.scheduleOnce(()=>{           
            this.spinView.onIngameEvent("GAME_RESET_SESSION");
        },5);
        require("AudioController_V2").getIns().playBackgroundMusic();  
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
        if(cc.BalanceController.getInstance().getBalance() >= this.totalBet)
            return true;
        return false;
    },
    Show_Popup_MuaBieuTuong()
    {
        if(this.CurrentRoomConfig === null &&  this.jackpotModel === null)
            return;
        this.muaBieuTuongView.MuaBieuTuong_SetUp(this.jackpotModel,this.specialID,this.roomID,this);
        this.spinView.scheduleOnce(()=>{
            this.spinView.onIngameEvent("ON_SHOW_EXTRA_BET_DIALOG");
        },1);
       
    },
    Hide_Popup_MuaBieuTuong()
    {
        if(this.muaBieuTuongView)
        {
            this.muaBieuTuongView.onClick_Close();
            this.spinView.onIngameEvent("JOIN_GAME_CLICK");
        }

    },
    Show_Mini_MuaBieuTuong_Bot()
    {
        this.miniMuaBieuTuong_Bottom_View.node.active = true
        let miniMuaBieuTuong_Bottom_Animation = this.miniMuaBieuTuong_Bottom_View.getComponent(cc.Animation);
        let miniMuaBieuTuong_Bottom_CountDown = this.miniMuaBieuTuong_Bottom_View.getComponent("ActionTimer");
        if(miniMuaBieuTuong_Bottom_CountDown.isStart)
        {
            miniMuaBieuTuong_Bottom_CountDown.resetTime();
            this.miniMuaBieuTuong_Bottom_View.Mini_MuaBieuTuong_Setup(this.specialID);
        }
        else
        {
            let callBack = ()=>{      
                miniMuaBieuTuong_Bottom_Animation.off("finished" , callBack);
                this.miniMuaBieuTuong_Bottom_View.Mini_MuaBieuTuong_Setup(this.specialID);
                miniMuaBieuTuong_Bottom_CountDown.resetTime();
                miniMuaBieuTuong_Bottom_CountDown.SetupTime(4,()=>{
                    miniMuaBieuTuong_Bottom_Animation.play("Mini_MuaBieuTuong_Bottom_Disapper");
                });
            }
            miniMuaBieuTuong_Bottom_Animation.on("finished" ,callBack );
            miniMuaBieuTuong_Bottom_Animation.play("Mini_MuaBieuTuong_Bottom_Apper");
        }
   
    },
    Show_SelectFreeturn_Type_Popup(lastMatrix)
    {
        if(this.isNotSelectFreeTurnType == true && !this.mainView.tryPlay)
        {
            this.SelectFreespin_Setup(lastMatrix);
        }
    },

    SwitchToTryModel()
    {
     
        cc.BalanceController.getInstance().updateTryBalance(200000000);
      
        let specialInputMap = this.SpecialItemMap.map(item => item.Input);
        let specialMaxId = Math.max(...specialInputMap);

        let currentBetMap = this.RoomConfig_Map.map(item => item.RoomBetId);
        let betMinId = Math.min(...currentBetMap);

        this.specialID = specialMaxId;
        this.CurrentRoomConfig = this.RoomConfig_Map.find(obj => obj.RoomBetId ==  betMinId );
        this.setExtraBet();
    },
    
    runContinueScript()
    {
        this.mainView.runContinueScript();
    },

    getSoundState()
    {
        return this.audioPool.getSoundState();
    },
 
    
    runCurrentContinueScript: function() {
        if(this.storeNextScripts == null || this.storeCurrentScripts == undefined ||  this.storeCurrentScripts == "")
        return;
        var t = this.storeNextScripts
          , e = t.data
          , o = t.object
          , i = t.script;

          if(this.storeCurrentScripts)
          {
            if(t)
            {
                if(o === null && o === undefined)
                    this.storeCurrentScripts(t.data);
                else 
                {
                    const { script, object } = this.storeNextScripts;
                    if (script && object) {
                        script.call(object, e);
                    }
                }  
            }
            else
            {
                if(o === null && o === undefined)
                    this.storeCurrentScripts();
                else 
                {
                        const { script, object } = this.storeNextScripts;
                        if (script && object) {
                            script.call(object, e);
                        }
                }
            }

          }

    
        this._resetStoreScript()
    },
    _resetStoreScript: function() {
        this.storeCurrentScripts = "",
        this.storeNextScripts = {
            script: [],
            data: {}
        }
    },

    


      
     
      
      
      
      
});
