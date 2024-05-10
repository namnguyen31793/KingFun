var slotsConfig = require('SlotsConfig');

cc.Class({
    extends: require("SpinViewBase_V2"), 

    ctor(){
      this.WILD_ID = 4;
    },
    properties: {
       Freespin_Turn_Lb : cc.Label,
       HoldToSpin_Btn: require("ThanTai_HoldToSpin"),
       Tutorial_Content : cc.Node,
       ProcessJackpot_Lb : cc.Label,
       StartFree_Animation : cc.Animation,
       TichLuy_Green_Lb  : cc.Label,
       TichLuy_Yellow_Lb  : cc.Label,
    },

    onEnable()
    {
      
      this.lbiTotalWin.setValue(0);
  
      this.audioController.enableMusic(true);
      this.audioController.enableSound(true);
      this.audioController.playBackgroundMusic();

     
    },
    start () {
        this.indexStopFinish = 0;  
       
    },
    setSpinController()
    {
        this.spinController = require("TL_Fs2_SpinController").getIns();
        return this.spinController;  

    },

    SetupFreespin_Type2_View(normalMatrix)
    {
      this.node.on("RUN_CONTINUE_SCRIPT", this.runContinueScript, this),
      
      this.spinColumnViews.forEach(function (columnItem) {
        columnItem.SetupDefaultData(normalMatrix);
        });
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
         },1.5);
     },
     resetSpin()
     {
        this.unscheduleAllCallbacks();
        this.spinController.Handle_ResetEffect();
        //khong update lai tien thang 
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
            cc.BalanceController.getInstance().addBalanceUI(winNormalValue);
            cc.BalanceController.getInstance().updateRealBalance(accountBalance);
        }    
        
          if(totalWin > 0)
            this.updateTotalWinUI(this.spinController.totalFreeturnReward);
          this.setFreeturnNumber_UI(freeSpinLeft);
          
     },

     Handle_ShowRewardLine(spinData)
     {
        let matrixString = spinData[2];
        let listLineWinData = spinData[3];
        const stringArray = matrixString.split(",");
        let matrixArray =  stringArray.map((numStr) => Math.floor(parseInt(numStr)));
        let matrix = matrixArray.join(',');
        let posWinItems = require("AllwayLineManager").getIns().GetListPosRuleAllWay(listLineWinData,matrix,this.WILD_ID);
        if(posWinItems != null)
        {
        for(let i=0;i< this.spinColumnViews.length;i++)
          {
            this.spinColumnViews[i].ShowAnimation_WinItem(posWinItems);
          }
        }
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
   
    Create_TutorialContent()
    {
      if(this.TutorialView != null)
      return;
        const instance = cc.instantiate(this.FreeTutorial_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
            this.TutorialContent.addChild(instance);  
          this.TutorialView =  instance;
    },
    setFreeturnNumber_UI(freeturnCounter)
    {
      this.freeturnRemainUI = freeturnCounter;
      this.Freespin_Turn_Lb.string = freeturnCounter;
    },  
    setProcessJackpot_UI(processJackpotCounter)
    {
      this.ProcessJackpot_Lb.string = processJackpotCounter+"/15";

    },

    Destroy_TutorialContent()
    {

    },

 
    onDestroy()
    {
        // khong chay ham destroy cha
    },
     //#region  Button Handle
     onClick_Spin()
     {      
         this.audioController.playSound(cc.AudioTypes.CLICK);
         if(!this.spinController.CheckNotEnoughMoney())
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
                 msg[1] = this.spinController.Defaul_MaxRoom();
                 msg[2] = this.spinController.DefaultMaxLineInfo();
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
         
     },
     setupTryPlay(isTryPlay)
     {
       this.tryPlay = isTryPlay
     },
     ShowAnimation_StartFree()
     {
      let callBack = ()=>{
          
        this.StartFree_Animation.off("finished" , callBack);

       }
       this.StartFree_Animation.on("finished" ,callBack );
       this.StartFree_Animation.play("Freespin_T2_StartEffect");
     },
     setTichLuyLb(greenCounter,yellowCounter)
     {
        this.TichLuy_Green_Lb.string = greenCounter;
        this.TichLuy_Yellow_Lb.string = yellowCounter;
     },
     runContinueScript: function() {
      if(!this.storeNextScripts)
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
  