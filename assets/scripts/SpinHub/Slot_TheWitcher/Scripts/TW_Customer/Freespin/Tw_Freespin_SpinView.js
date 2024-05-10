// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("SpinViewBase_V2"), 
    ctor()
    {
      this.WILD_ID = 1;
    },

    properties: {
       Freespin_Turn_Lb : cc.Label,
       TutorialContent : cc.Node,
       FreeTutorial_prefab : cc.Prefab,
    },

    onEnable()
    {
     // this.ChoiThu_Img.active = false;
      this.lbiTotalWin.setValue(0);
  
      this.audioController.enableMusic(true);
      this.audioController.enableSound(true);
      this.audioController.playBackgroundMusic();
     //  this.spinController.activeButtonX2(false);
     

    },

    start () {
        this.indexStopFinish = 0;

    },
    setupTryPlay(isShowTutorial,isTryPlay)
    {
      this.tryPlay = isTryPlay;
      if(isShowTutorial)
      {
          this.Create_TutorialContent();
      }
      else
      {
        this.spinController.Handle_AutoRespin();
      }
    },

    setSpinController()
    {
      this.spinController = require("Tw_Freespin_Controller").getIns();
      return this.spinController;
    },
    setFreeturnNumber_UI(freeturnCounter)
    {
      this.Freespin_Turn_Lb.string = freeturnCounter;
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
         },1.5);
     },
     resetSpin()
     {
        this.unscheduleAllCallbacks();
        this.spinController.Handle_ResetEffect();
        //khong update lai tien thang 
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
          {
              this.updateTotalWinUI(this.spinController.totalFreeturnReward);
              let tempMatrixArray =  matrix.split(',').map(numString => (Math.floor(parseInt(numString, 10))%20));
              let tempMatrix = tempMatrixArray.join();
            let posWinItems = require("AllwayLineManager").getIns().GetListPosRuleAllWay(listLineWinData,tempMatrix,this.WILD_ID);
              if(posWinItems != null)
              {
              for(let i=0;i< this.spinColumnViews.length;i++)
                {
                  this.spinColumnViews[i].ShowAnimation_WinItem(posWinItems);
                }
              }
          }
          this.setFreeturnNumber_UI(freeSpinLeft);
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

    Create_TutorialContent()
    {
      if(this.TutorialView != null)
      return;
        const instance = cc.instantiate(this.FreeTutorial_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
            this.TutorialContent.addChild(instance);  
          this.TutorialView =  instance;
    },

    Destroy_TutorialContent()
    {

    },

 
    onDestroy()
    {
        // khong chay ham destroy cha
    },
});
