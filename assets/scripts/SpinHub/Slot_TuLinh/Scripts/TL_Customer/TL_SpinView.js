var slotsConfig = require('SlotsConfig');

cc.Class({
    extends: require("SpinViewBase_V2"), 
    ctor()
    {
        this.WILD_ITEM = 1;
    },

    properties: {
       HoldToSpin_Btn: require("TL_HoldToSpin"),
       Tutorial_Content : cc.Node,
       Cuoc_Lb : cc.Label,
       JackpotView:  require("TL_JackpotView"),
       Mini_MuaBieuTuong_Right:  require("TL_MiniMuaBieuTuong"),
       Mini_MuaBieuTuong_Bot:  require("TL_MiniMuaBieuTuong"),
       TL_TutorialManager:  require("TL_TutorialManager"),
    },

    onEnable()
    {
        this.updateTotalWinUI(0);
    
      this.audioController.enableMusic(true);
      this.audioController.enableSound(true);
      this.audioController.playBackgroundMusic();
    
    },
    start () {
        this.indexStopFinish = 0;  
      
       
    },
    setSpinController()
    {
        this.node.on("RUN_CONTINUE_SCRIPT", this.runContinueScript, this);

        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.Setup();
        this.spinController.setJackpotView(this.JackpotView);
        this.spinController.setMiniMuaBieuTuongView_Right(this.Mini_MuaBieuTuong_Right);
        this.spinController.setMiniMuaBieuTuongView_Bottom(this.Mini_MuaBieuTuong_Bot);
        return this.spinController;
    },
    
     //update lai totalWin UI (dung cho FS khi joinRoom de set totalWin da quay dc)
     updateTotalWinUI: function (amount) {
        if(amount <= 0)
            this.lbiTotalWin.node.active = false;
        else
            this.lbiTotalWin.node.active = true;
        this.lbiTotalWin.tweenValueto(amount);
    },
    startSpin: function (isNearWin = false) {
       
        var self = this;

        
        //dat lich SPIN lan luot cac cot
        if(!this.isFastSpin)
        { 
            this.scheduler.schedule(function () {                      
                self.spinColumn(isNearWin);
            }, this, 0, 0, 0, false);
            this.scheduler.schedule(function () {
                self.spinColumn(isNearWin);
            }, this, 0, 0, this.timeBetweenCol, false);
            this.scheduler.schedule(function () {
                self.spinColumn(isNearWin);
            }, this, 0, 0, this.timeBetweenCol * 2, false);
            this.scheduler.schedule(function () {
                self.spinColumn(isNearWin);
            }, this, 0, 0, this.timeBetweenCol * 3, false);
            this.scheduler.schedule(function () {
                self.spinColumn(isNearWin);
            }, this, 0, 0, this.timeBetweenCol * 4, false);
        }
        else
        {
            this.scheduler.schedule(function () {            
                self.fastStopColumn();
            }, this, 0, 0, 0, false);
            this.scheduler.schedule(function () {            
                self.fastStopColumn();
            }, this, 0, 0, 0, false);
            this.scheduler.schedule(function () {            
                self.fastStopColumn();
            }, this, 0, 0, 0, false);
            this.scheduler.schedule(function () {            
                self.fastStopColumn();
            }, this, 0, 0, 0, false);
            this.scheduler.schedule(function () {            
                self.fastStopColumn();
            }, this, 0, 0, 0, false);
        }
    },
    setCuocLbUI(cuocValue)
    {
      this.Cuoc_Lb.string = cuocValue;
    },
    Handle_AfterJoinRoom()
    {
        this._super();
        this.ClientRequest_GetInfoJoinRoom();
        this.ClientRequest_GetRoomConfig();  

        this.scheduleOnce(()=>{
            this.spinController.Show_Popup_MuaBieuTuong();
        },1);

        this.schedule(() => {
            this.getJackpot();
        }, 10);
    },
     //goi khi STOP SPIN xong     
     stopSpinFinish: function () {
     
        this.indexStopFinish++;
        if(this.indexStopFinish < 5)
            return;
        this.audioController.stopSound(cc.AudioTypes.SPIN);    
      this.PlayAnimItemWhenFinishSpin();
     
     },
     PlayAnimItemWhenFinishSpin()
     {
         let lastSpinData = this.spinController.getLastSpinResponseData();
         let isTakeJackpot = lastSpinData[13];
         if(!isTakeJackpot)
         {            
            this.spinColumnViews.forEach(function (columnItem) {
            columnItem.Item_FinishSpin();
            });
         }
            
         
         // cho dien het animation o trong item.
         this.scheduleOnce(()=>{
            this.indexStopFinish = 0;
            this.isSpining = false;   
            this.spinController.Handle_AfterSpinAnimation();
         },1);
         
     },
     resetSpin()
     {    
        this._super();
       
     },
     Handle_AfterStopSpin(spinData)
     {  
        this._super(spinData);
        let spinId = spinData[1];
        let matrixString = spinData[2];
        let listLineWinData = spinData[3];
        let winNormalValue = spinData[4];
        let numberBonusSpin = spinData[5];
        let winBonusValue = spinData[6];
        let freeSpinLeft = spinData[7];
        let valueFreeSpin = spinData[8];
        let totalWin = spinData[9];
        let accountBalance = spinData[11];
        let currentJackpotValue = spinData[12];
        let isTakeJackpot = spinData[13];
        let extandMatrix = spinData[14];
        let totalBet = spinData[15];
          
        this.HoldToSpin_Btn.ShowAnimation_Stop();
        
        const stringArray = matrixString.split(",");
        let matrixArray =  stringArray.map((numStr) => Math.floor(parseInt(numStr)));
         let matrix = matrixArray.join(',');
        if(this.tryPlay)
        {
            cc.BalanceController.getInstance().addTryBalance(winNormalValue);
        }
        else
        {   
            cc.BalanceController.getInstance().updateRealBalance(accountBalance);
            cc.BalanceController.getInstance().updateBalance(accountBalance);
        }    
       let posWinItems = require("AllwayLineManager").getIns().GetListPosRuleAllWay(listLineWinData,matrix,this.WILD_ITEM);
        if(posWinItems != null)
        {
        for(let i=0;i< this.spinColumnViews.length;i++)
          {
            this.spinColumnViews[i].ShowAnimation_WinItem(posWinItems);
          }
        }

       
        
     },
     onClick_Help()
     {
      this.spinController.mainView.Create_HelpView();
      this.audioController.playSound(cc.AudioTypes.CLICK);
     },
     onClick_Setting()
     {
        this.spinController.mainView.Create_SettingView();
        this.audioController.playSound(cc.AudioTypes.CLICK);
     }
     ,
     onClick_TryPlay()
     {
        // this._super();
        // this.spinController.mainView.Create_TutorialView();
        this.audioController.audioPool.playSwitchChoiThuBtn();

         this.tryPlay = !this.tryPlay;
         if(this.tryPlay)
         {
           this.onClick_SwitchToTrialMode();
         }
         else
         {
            this.spinController.mainView.Destroy_TutorialView();
            this.resetRoomInfo();
         }
         
        // this.enableTryPlay_Animation(this.tryPlay);
        
     },
     onClick_FastSpin()
     {
        this._super();
        this.onIngameEvent("TURBO_CLICK");
        this.audioController.playSound(cc.AudioTypes.CLICK);
     },
     onClick_IncSpecialID()
     {      
        this.audioController.audioPool.playBuySpecialBtn();
        if(this.spinController.Inc_SpecialID())
        {
            this.resetRoomInfo();
            this.onIngameEvent("EXTRA_BET_INCREASE");
        }
         
     },
     onClick_DecSpecialID()
     {  
        this.audioController.audioPool.playBuySpecialBtn();
        if(this.spinController.Dec_SpecialID())
         this.resetRoomInfo();
     },
     onClick_DecRoom()
     {
        this.audioController.audioPool.playChangeRoomBtn();
        this._super();
     },
     onClick_IncRoom()
     {
        this.audioController.audioPool.playChangeRoomBtn();
        this._super();
        this.onIngameEvent("BET_INCREASE");
     },
     reset_HoldToSpin()
     {
        this.HoldToSpin_Btn.cancelAutoSpin();
     },
     FinishAnimation_JackpotAnim()
    {
       this.spinColumnViews.forEach(function (columnItem) {
         columnItem.Item_FinishSpin();
         });
    },
        //#region  Button Handle
     onClick_Spin()
        {      
            this.audioController.playSound(cc.AudioTypes.CLICK);
            if(!this.tryPlay && !this.spinController.CheckNotEnoughMoney())
                return;
            this.audioController.playSound(cc.AudioTypes.SPIN);
        
            this.isSpining = true;
            var self = this;
            this.indexSpin = 0;
            this.indexStopColumn = 0
             //Set time goi STOP va time goi SPIN cot theo mode
             if (this.isFastSpin) {
                this.timeBetweenCol = slotsConfig.TIME_COLUMN_FAST;
                this.timeStop = slotsConfig.TIME_CALL_STOP_FAST;
            } else {
                this.timeBetweenCol = slotsConfig.TIME_COLUMN_NORMAL;
                this.timeStop = slotsConfig.TIME_CALL_STOP_NORMAL;
            }
            this.resetSpin();
            //Khoa Click cac button chuc nang
            //
            let dataLine = '5,11,2,8'; //156,138
            let lineId =  require("AllwayLineManager").getIns().findLineID(dataLine);
            cc.log("LineID : "+lineId);
            this.spinController.activeButtonSpin(false);
    
            
            if(!this.tryPlay)
            {
               cc.log("CLICK SPIN - MST_CLIENT_SLOT_SPIN");
                let msg = {};
                msg[1] = this.spinController.roomID;
                msg[2] = this.spinController.CurrentSpecialItem.Input;
                msg[20] = this.spinController.gameID;
                msg[40] = this.spinController.gameID;
                Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
            }
            else
            {
                cc.log("CLICK SPIN - MSG_CLIENT_SLOT_SPIN_CHOI_THU");
                let tryPlayData = this.spinController.GetTryPlayData();
    
                if(tryPlayData == null)
                {
                    let msg = {};
                    msg[1] = this.spinController.roomID;
                    msg[2] = this.spinController.CurrentSpecialItem.Input;
                    msg[20] = this.spinController.gameID;
                    msg[40] = this.spinController.gameID;
                    Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_SPIN_CHOI_THU, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
                }
                else
                {
                    this.resetColumnEffect();
                    this.spinController.PlayTutorial(tryPlayData);
                }
            }

            
            this.onIngameEvent("SPIN_CLICK");
        },
    onClick_MuaBieuTuong_Right()
    {
        this.spinController.Show_Popup_MuaBieuTuong();
        this.audioController.playSound(cc.AudioTypes.CLICK);
    },

    ShowAnimation_ChangeSpinButton()
    {

    },
    onClick_SwitchToTrialMode()
    {
      this.TL_TutorialManager.setMainController(this.spinController);
      this.spinController.SwitchToTryModel();
      let jackpotContent =  this.TL_TutorialManager.JackpotValueConfig;
      this.JackpotView.UpdateJackpotView_FromJson(this.spinController.roomID,jackpotContent);
      this.TL_TutorialManager.startTutorial();
    },
    onIngameEvent: function(trigger) {
        if(this.tryPlay && this.TL_TutorialManager)
            this.TL_TutorialManager.trigger(trigger)
    },

    chooseSymbolExtraBet: function() {
            this.onIngameEvent("SELECT_SYMBOL");
    },
    isPauseTutorialFlag: function(t) {
        if(this.tryPlay && this.TL_TutorialManager)
            return this.TL_TutorialManager.isContainFlag(t);
        return false;
    },
    SetupSelectFreeSpin(matrix)
    {
        this.audioController.audioPool.playSelectFree_Fx_Sound();

        this.onIngameEvent("ON_FINISH_SCATTER_PAYLINE");
        if(this.isPauseTutorialFlag("pauseFreeSpinOption"))
        {
            this.storeCurrentScripts = this.SetupSelectFreeSpin;
            this.storeNextScripts = {
                script:    this.SetupSelectFreeSpin,
                object: this,
                data: matrix                     
            };
        }
        else
        {
            this.spinController.SelectFreespin_Setup(matrix);
        }
    },
    PlayNormalWinSound()
    {
        this.audioController.audioPool.playNormalWin();
    },
   


   

    

      

  

});
