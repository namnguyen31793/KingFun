
cc.Class({
    extends: require("SpinViewBase_V2"), 

    properties: {
       ChoiThu_Img : cc.Node,
       HoldToSpin_Btn: require("ThanTai_HoldToSpin"),
       Nhen_Charactor : cc.Node,
       Tutorial_Content : cc.Node,
       Tw_TryPlay_Animation : sp.Skeleton,
       Tw_Hero_Animation : require("Tw_Hero_Charactor"),

       Tree_Background_Animation : [cc.Animation],
    },

    // LIFE-CYCLE CALLBACKS:

   
    onEnable()
    {
      this.ChoiThu_Img.active = false;
      this.lbiTotalWin.setValue(0);
  
      this.audioController.enableMusic(true);
      this.audioController.enableSound(true);
      this.audioController.playBackgroundMusic();
     //  this.spinController.activeButtonX2(false);
      this.enableTryPlay_Animation(this.tryPlay);

      this.Tw_Hero_Animation.ShowAnimation_Idle_KiemSat();
     // this.ShowAnimation_TreeBackgroud();
    },

    start () {
        this.indexStopFinish = 0;
     
    },

    setSpinController()
    {
      //  this.spinController = require("Tw_SpinController").getIns();
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.Setup();
        return this.spinController;
    },
    Handle_AfterJoinRoom()
    {
        this._super();
        this.ClientRequest_GetInfoJoinRoom();
        this.ClientRequest_GetRoomConfig();

       
    },
     //update lai totalWin UI (dung cho FS khi joinRoom de set totalWin da quay dc)
    updateTotalWinUI: function (amount) {
      if(amount <= 0)
         return;
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
          }, this, 0, 0, this.timeBetweenCol, false);
          this.scheduler.schedule(function () {
              self.fastStopColumn();
          }, this, 0, 0, this.timeBetweenCol, false);
          this.scheduler.schedule(function () {
              self.fastStopColumn();
          }, this, 0, 0, this.timeBetweenCol , false);
          this.scheduler.schedule(function () {
              self.fastStopColumn();
          }, this, 0, 0, this.timeBetweenCol , false);
          this.scheduler.schedule(function () {
              self.fastStopColumn();
          }, this, 0, 0, this.timeBetweenCol , false);
      }
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
         let matrix = lastSpinData[2];
         let totalWin = lastSpinData[9];
         let isTakeJackpot = lastSpinData[13];

         if(!isTakeJackpot)
         {            
            this.spinColumnViews.forEach(function (columnItem) {
            columnItem.Item_FinishSpin();
            });
          }

        let delayTime = 0;
        if(this.checkMatrixHasSwortItem(matrix))
          delayTime = 1;
       
          this.scheduleOnce(()=>{
            this.indexStopFinish = 0;
            this.isSpining = false;   
            this.spinController.Handle_AfterSpinAnimation();
          }, delayTime)
          
       

        
     },
    
       //reset lai cac tham so + tat cac hieu ung + stop cac schedule
      resetSpin: function () {
         this.unscheduleAllCallbacks();
         this.spinController.Handle_ResetEffect();
       //  this.lbiTotalWin.setValue(0);         
     },

     Handle_AfterStopSpin(spinData)
     {  
        this._super(spinData);
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

        if(this.tryPlay)
        {
            cc.BalanceController.getInstance().addTryBalance(winNormalValue);
        }
        else
        {   
            cc.BalanceController.getInstance().updateRealBalance(accountBalance);
            cc.BalanceController.getInstance().updateBalance(accountBalance);
        }    
       
      
         let tempMatrixArray =  matrix.split(',').map(numString => (Math.floor(parseInt(numString, 10))%20));
        let tempMatrix = tempMatrixArray.join();
       let posWinItems = require("AllwayLineManager").getIns().GetListPosRuleAllWay(listLineWinData,tempMatrix);
        if(posWinItems != null)
        {
        for(let i=0;i< this.spinColumnViews.length;i++)
          {
            this.spinColumnViews[i].ShowAnimation_WinItem(posWinItems);
          }
        }

        // khi chay vao man free thi k show popup
        // && this.spinController.tutorialManage
        if(this.tryPlay && freeSpinLeft == 0 && this.spinController.tutorialManager)
        {
         this.spinController.tutorialManager.ShowAnimation_TutorialPopup();
        }
        
     },

     onClick_SelectLine()
     {
       if(this.tryPlay)
         return;
        let lineCounter = this.ThanTai_LineManager.Handle_Draw_ShowLine();
        this.spinController.Handle_Inc_BetLine(lineCounter);
        this.updateTotalLines(lineCounter);
     },

     onClick_OpenX2Game()
     {
      if(this.tryPlay)
      return;
      this.spinController.activeButtonX2(false);
      this.spinController.mainView.Create_X2GameView();
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
        // this._super();
         this.spinController.mainView.Create_TutorialView();
         
         this.tryPlay = !this.tryPlay;
         if(this.tryPlay)
         {
           this.ChoiThu_Img.active = true;
            cc.BalanceController.getInstance().updateTryBalance(100000000);
           let maxRoomConfig = this.spinController.RoomConfig_Map.find(obj => obj.Bet ==  30000);
                
           let maxLine = 25;
           this.spinController.setBetConfigByBet(maxRoomConfig.Bet);
           //this.spinController.setBetValue(maxRoomConfig.Bet);
          // this.updateTotalLines(maxLine,maxRoomConfig.Bet);
          // this.updateTotalLines(maxLine);

         }
         else
         {
            this.spinController.mainView.Destroy_TutorialView();
            this.ChoiThu_Img.active = false;
            this.resetRoomInfo();
         }
         
         this.enableTryPlay_Animation(this.tryPlay);
        
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
    enableNhen_Charactor(enable)
    {
      this.Nhen_Charactor.active = enable;
    },
    enableTryPlay_Animation(enable)
    {
      this.Tw_TryPlay_Animation.node.active = true;
      if(enable)
      {
         this.Tw_TryPlay_Animation.setAnimation(0,'choi that  idle',true);
      }
      else
      {
         this.Tw_TryPlay_Animation.setAnimation(0,'choi thu idle',true);
      }
      
    },

    checkMatrixHasSwortItem(matrix)
    {
        let matrixArray = matrix.split(',').map(numString => Math.floor(parseInt(numString, 10)));
        for(let i=0;i< matrixArray.length;i++)
        {
          if(matrixArray[i] > 20)
            return true;
        }
        return false;
    },

    ShowAnimation_TreeBackgroud()
    {
        for(let i=0;i< this.Tree_Background_Animation.length;i++)
        {
          this.Tree_Background_Animation[i].play();
        }
    }

    //#region 
   
    //#endregion
 

    // update (dt) {},
});
