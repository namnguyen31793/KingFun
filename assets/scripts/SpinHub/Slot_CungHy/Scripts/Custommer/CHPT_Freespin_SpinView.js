
cc.Class({
    extends: require("SpinViewBase_V2"), 

    ctor()
    {
      this.columnFinishSpinAnimation = 0;
      this.indexMiniRellStopFinish = 0;
    },

    properties: {
       CHPT_LineManager: require("CHPT_Freespin_Line_Manager"),
       ChoiThu_Img : cc.Node,
       HoldToSpin_Btn: require("CHPT_HoldToSpin"),

       miniSpinColumnViews: {
         default: [],
         type:  require("CHPT_Freespin_MiniColumnView")
      },

      miniLockColumnViews: {
         default: [],
         type:  cc.Animation
      },

      Backgroud_Animation : cc.Animation,


      VFX_GongItem : cc.Prefab,
      VFX_Parent: cc.Node,

      Gold_Tree_Skeleton: sp.Skeleton,
      JackpotView:  require("JackpotView_V2"),

      CurrentTurn : cc.Label,
      TotalTurn : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

   
    onEnable()
    {
      
      this.Gold_Tree_Skeleton.setAnimation(0,'Idle_Green',false);
      this.Backgroud_Animation.play('CH_Backgroud_Normal');
      this.updateTotalWinUI(0);
    },

    start () {
        this.indexStopFinish = 0;
        /*
        let currentLine = this.ThanTai_LineManager.Get_CurrentLineAmount();
        cc.log("CURRENT LINE: "+currentLine);
        this.updateTotalLines(currentLine);
        */
    },
    Handle_AfterJoinRoom()
    {
      /*
        this._super();
        this.ClientRequest_GetInfoJoinRoom();
        this.ClientRequest_GetRoomConfig();
        */
    },

    setSpinController()
    {
        this.spinController = require('CHPT_Freespin_LogicManager').getIns();
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

    SetupFreespin_View(normalMatrix)
    {
      this.node.on("RUN_CONTINUE_SCRIPT", this.runContinueScript, this),
      this.Setup_DefaultMatrix(normalMatrix);
    
    },

    Setup_DefaultMatrix(normalMatrix)
    {
      this.spinColumnViews.forEach(function (columnItem) {
         columnItem.SetupDefaultData(normalMatrix);
         });
    },

    ShowAnimation_StartFree()
    {
      this.Gold_Tree_Skeleton.setCompleteListener((trackEntry) => {
         if (trackEntry.animation.name === 'GreentoGold') {
            
             this.Gold_Tree_Skeleton.setAnimation(0,'Idle_Gold',true);
          }
     });
         this.Gold_Tree_Skeleton.setAnimation(0,'GreentoGold',false);

         this.Backgroud_Animation.play('CH_Backgroud_Normal2Free');
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
       
      this.HoldToSpin_Btn.ShowAnimation_Disable();
      this._super();
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

     resetSpin()
     {
        this.CHPT_LineManager.ResetVfxGong();
        this.unscheduleAllCallbacks();
        this.spinController.Handle_ResetEffect();   
     },

     Handle_AfterStopSpin(spinData)
     {  
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

        this.resetSpinIndex();
        this.detectEffectType(spinData);
        this.spinController.activeButtonSpin(true);
       
        if(isTakeJackpot == 0 && winNormalValue > 0)
            this.updateTotalWinUI( this.spinController.totalFreeturnReward);


        this.HoldToSpin_Btn.ShowAnimation_Spining();
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
            this.CHPT_LineManager.ShowItemWinAnimation(listLineWinData);

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
         this._super();
         
         if(this.tryPlay)
         {
            this.ChoiThu_Img.active = true;
            cc.BalanceController.getInstance().updateTryBalance(7979797979);
           let maxRoomConfig = this.spinController.RoomConfig_Map.find(obj => obj.RoomBetId ==  this.spinController.Defaul_MaxRoom());
                 
           let maxLine = 25;
           this.updateBetUI(maxRoomConfig.Bet);
           this.updateTotalLines(maxLine,maxRoomConfig.Bet);
          // this.updateTotalLines(maxLine);

         }
         else
         {
            this.ChoiThu_Img.active = false;
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

    ShowAnimation_ResetLockJackpot()
    {
      for(let i=0;i< this.miniLockColumnViews.length;i++)
      {
         this.miniLockColumnViews[i].play("UnlockJackpot_Reset");
      }
    },

    ShowAnimation_UnLockJackpot()
    {
      for(let i=0;i< this.miniLockColumnViews.length;i++)
      {
         this.miniLockColumnViews[i].play("UnlockJackpot");
      }
    },   
  
    SetCurrentTurn_Lb(remailTurn)
    {    
       if(this.CurrentTurn)
         this.CurrentTurn.string = remailTurn;
    },

    SetTotalTurn_Lb(totalTurn)
    {
       if(this.TotalTurn)
         this.TotalTurn.string = totalTurn;
    },

    MiniColumn_ShowResultInfo()
    {
      for(let i=0;i< this.miniSpinColumnViews.length;i++)
      {
          this.miniSpinColumnViews[i].setResultData();
      }
    },

    FinishAnimation_JackpotAnim()
    {
         let packet = this.spinController.spinResponseData;
         let totalWin = packet[9];
         this.updateTotalWinUI(totalWin);
         this.spinController.Handle_NextAutoSpin();
    },

    onDestroy()
    {       
    },

 
    

    // update (dt) {},
});
