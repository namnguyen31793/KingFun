
cc.Class({
    extends: require("SpinViewBase_V2"), 

    ctor()
    {
      this.columnFinishSpinAnimation = 0;
      this.indexMiniRellStopFinish = 0;
      this.BEAUTY_MATRIX = ["3,3,4,5,4,6,2,2,2,6,3,2,2,2,8"];
    },

    properties: {
       CHPT_LineManager: require("CHPT_Line_Manager"),
       ChoiThu_Img : cc.Node,
       HoldToSpin_Btn: require("CHPT_HoldToSpin"),

       miniSpinColumnViews: {
         default: [],
         type:  require("CHPT_MiniColumnView")
      },

   
      VFX_GongItem : cc.Prefab,
      VFX_Parent: cc.Node,
      JackpotView:  require("JackpotView_V2"),
      EndFreePopup:  require("CHPT_Result_Freespin_Popup"),

      CHPT_TutorialManager:  require("CHPT_TutorialManager"),
    },

    // LIFE-CYCLE CALLBACKS:

   
    onEnable()
    {
      this.ChoiThu_Img.active = false;
      this.lbiTotalWin.setValue(0);
  

      this.audioController.enableMusic(true);
      this.audioController.enableSound(true);
      this.audioController.playBackgroundMusic();
      this.EndFreePopup.node.active = false;
    },

    start () {
        this.indexStopFinish = 0;
        /*
        let currentLine = this.ThanTai_LineManager.Get_CurrentLineAmount();
        cc.log("CURRENT LINE: "+currentLine);
        this.updateTotalLines(currentLine);
        */
    },
    onClick_IncRoom()
    {
      this._super();
      this.audioController.audioPool.playClickChangeRoom();
      this.onIngameEvent("BET_INCREASE");
    
    },

    onClick_DecRoom()
    {
        this._super();
        this.audioController.audioPool.playClickChangeRoom();
    },
    onClick_FastSpin()
    {
      this._super();
      this.onIngameEvent("TURBO_CLICK");
      this.audioController.playSound(cc.AudioTypes.CLICK);
    },
    Handle_AfterJoinRoom()
    {
        this._super();
        this.ClientRequest_GetInfoJoinRoom();
        this.ClientRequest_GetRoomConfig();

        this.schedule(() => {
            this.getJackpot();
        }, 10);

    },

    setSpinController()
    {
        this.spinController = require("CHPT_SpinController").getIns();
        this.spinController.Setup();
        this.spinController.setJackpotView(this.JackpotView);
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
  updateBetUI(betPerLine)
  {
      if(this.lbBetPerLine)
      this.lbBetPerLine.string =  cc.Tool.getInstance().formatNumberK(betPerLine);;
  },

     //goi khi STOP SPIN xong     
     stopSpinFinish: function () {
        this.indexStopFinish++;
        if(this.indexStopFinish < 5)
            return;
        this.audioController.stopSound(cc.AudioTypes.SPIN);

        this.indexStopFinish = 0;
        this.isSpining = false;
      
        this.PlayAnimItemWhenFinishSpin();
       
     },

     stopMiniSpinFinish: function () {
      this.indexMiniRellStopFinish++;
      if(this.indexMiniRellStopFinish < 3)
          return;
   
      this.indexMiniRellStopFinish = 0;
      let lastSpinData = this.spinController.getLastSpinResponseData();
      let extandMatrix = lastSpinData[14];
      this.spinController.effectView.ShowEffect_MultiValue(extandMatrix);
     
   },
     randomIcon: function () {
      this._super();
      this.miniSpinColumnViews.forEach(function (miniSpinColumnView) {
         miniSpinColumnView.randomIcon();
      });
  },

     spinMiniColumn: function (isNearWin = false) {
      for(let i=0;i < this.miniSpinColumnViews.length;i++)
      {
         this.miniSpinColumnViews[i].spin();
         this.indexMiniSpin++;
      }
    
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
            self.spinColumn(isNearWin);
        }, this, 0, 0, 0, false);
        this.scheduler.schedule(function () {
            self.spinColumn(isNearWin);
        }, this, 0, 0, 0, false);
        this.scheduler.schedule(function () {
            self.spinColumn(isNearWin);
        }, this, 0, 0, 0, false);
        this.scheduler.schedule(function () {
            self.spinColumn(isNearWin);
        }, this, 0, 0, 0, false);
        this.scheduler.schedule(function () {
            self.spinColumn(isNearWin);
        }, this, 0, 0, 0, false);
      }
      this.spinMiniColumn();
   },
 
    stopMiniColumn()
   {    
      this.miniSpinColumnViews[this.indexStopMiniColumn].stop();
      ++this.indexStopMiniColumn; 
    },
    resetSpinIndex()
    {
      this._super();
      this.indexMiniSpin = 0;
      this.indexStopMiniColumn = 0;
    },

     PlayAnimItemWhenFinishSpin()
     {
        let lastSpinData = this.spinController.getLastSpinResponseData();
        let isTakeJackpot = lastSpinData[13];
        let isOffset = false;
        
           this.spinColumnViews.forEach(function (columnItem) {
                columnItem.Item_FinishSpin();
                if(columnItem.numberOffSet != 0)
                    isOffset = true;
           });
     },
     FinishAnimation_ItemBeforeSpin()
     {
      this.columnFinishSpinAnimation++;
      if(this.columnFinishSpinAnimation < 5)
         return;
      this.columnFinishSpinAnimation = 0;

      this.indexStopFinish = 0;
      this.isSpining = false;   
      this.spinController.Handle_AfterSpinAnimation();
     },
     onClick_Spin()
     {
         this.onIngameEvent("SPIN_CLICK");
         this._super();
     },

     resetSpin()
     {
        this.CHPT_LineManager.ResetVfxGong();
        this._super();
     },

     Handle_AfterStopSpin(spinData)
     {  
        this.onIngameEvent("SPIN_STOPPED");
        let spinId = spinData[1];
        let matrix = spinData[2];
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

        this._super(spinData);
        this.HoldToSpin_Btn.ShowAnimation_Stop();

        if(this.tryPlay)
        {
            cc.BalanceController.getInstance().addTryBalance(winNormalValue);
        }
        else
        {
            cc.BalanceController.getInstance().addBalanceUI(winNormalValue);
            cc.BalanceController.getInstance().updateRealBalance(accountBalance);
        }    
        if(winNormalValue > 0)
        {
            this.audioController.playSound(cc.AudioTypes.NORMAL_WIN);
            this.CHPT_LineManager.ShowItemWinAnimation(listLineWinData);
            this.onIngameEvent("SHOW_NORMAL_PAYLINE");
        }
       
       
        

     },

     onClick_SelectLine()
     {
       if(this.tryPlay)
         return;
        let lineCounter = this.CHPT_LineManager.Handle_Draw_ShowLine();
        this.spinController.Handle_Inc_BetLine(lineCounter);
        this.updateTotalLines(lineCounter);
     },

    
     onClick_Help()
     {
      this.spinController.mainView.Create_HelpView();
     },
     onClick_Setting()
     {
        this.spinController.mainView.Create_SettingView();
     }
     ,
     onClick_TryPlay()
     {
         require("AudioController_V2").getIns().playSound(cc.AudioTypes.CLICK);
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
      
     },
     reset_HoldToSpin()
     {
        this.HoldToSpin_Btn.cancelAutoSpin();
     },
     onIngameEvent: function(trigger) {
        if(this.tryPlay && this.CHPT_TutorialManager)
            this.CHPT_TutorialManager.trigger(trigger)
    },

    MiniColumn_ShowResultInfo()
    {
      for(let i=0;i< this.miniSpinColumnViews.length;i++)
      {
          this.miniSpinColumnViews[i].setResultData();
      }
    },
    Setup_DefaultMatrix(normalMatrix = null)
    {
      if(normalMatrix == null || normalMatrix == "")
      {
         normalMatrix = this.BEAUTY_MATRIX[0];
      }

      this.spinColumnViews.forEach(function (columnItem) {
         columnItem.SetupDefaultData(normalMatrix);
         });
    },

    Setup_EndFreePopup(totalReward)
    {
      this.EndFreePopup.Reward_Setup(totalReward);
    },

    onClick_SwitchToTrialMode()
    {
      this.CHPT_TutorialManager.setMainController(this.spinController);
      this.spinController.SwitchToTryModel();
      let jackpotContent =  this.CHPT_TutorialManager.JackpotValueConfig;
      this.JackpotView.UpdateJackpotView_FromJson(this.spinController.roomID,jackpotContent);
      this.CHPT_TutorialManager.startTutorial();
    },
    isPauseTutorialFlag: function(t) {
      if(this.tryPlay && this.CHPT_TutorialManager)
          return this.CHPT_TutorialManager.isContainFlag(t);
      return false;
   },
  checkPauseTutorial: function(t) {
   return this.isPauseTutorialFlag(t) && this.tryPlay
   },

   /*
   onDestroy()
   {
    if(this.node)
    this.node.unscheduleAllCallbacks();
    this._super();    
   }
   */
 
    

    // update (dt) {},
});
