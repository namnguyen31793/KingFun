// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        FreeSpin_GameView_prefab : cc.Prefab,
        Jackpot_GameView_prefab : cc.Prefab,
        HelpView_prefab : cc.Prefab,
        SettingView_prefab : cc.Prefab,
        Tutorial_prefab : cc.Prefab,
        RankView_prefab : cc.Prefab,
        HistoryView_prefab : cc.Prefab,
    },

     // LIFE-CYCLE CALLBACKS:

     onLoad () {
      this.GetSlotController();
        this.audioController =  require("AudioController_V2").getIns();
    },

    GetSlotController()
    {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setMainView(this);
    },

    start () {

    },

   
    Create_FreeGame_View(freeSpin,packet,currentMatrix,currentExtraMatrix)
    {
            const instance = cc.instantiate(this.FreeSpin_GameView_prefab);       
            this.node.addChild(instance);   
            this.Freespin_View = instance;

            let isShowTutorial =  (this.TutorialView !== undefined && this.TutorialView !== null);
            let FreespinController =  require('CHPT_Freespin_LogicManager').getIns();
            FreespinController.FreeSpinController_Setup(this.spinController,freeSpin,packet,isShowTutorial,this.spinController.spinView.tryPlay,currentMatrix,currentExtraMatrix);
           
            this.audioController.audioPool.playFreeMusicBg();
    },

    Destroy_FreeGame_View(totalFreeReward = 0)
    {
        if(this.Freespin_View == null)
        return;
        this.Freespin_View.destroy();
        this.Freespin_View = null;
        
        
        if(totalFreeReward > 0)
            this.spinController.BackFromFreespinView(totalFreeReward); 
        
        this.spinController.spinView.onIngameEvent("GAME_RESET_SESSION");
     //   this.audioController.audioPool.playNormal_MusicBg();
    },
   
    Create_HelpView()
    {
        if(this.HelpView != null)
            return;
        const instance = cc.instantiate(this.HelpView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
             this.node.addChild(instance);  
             
            this.HelpView =   instance;
    },
    Destroy_HelpView()
    {
        this.HelpView.destroy();
        this.HelpView = null;
    },
    Create_SettingView()
    {
        if(this.SettingView != null)
        return;
        const instance = cc.instantiate(this.SettingView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);  
            this.SettingView =   instance;
    },
    Destroy_SettingView()
    {
        if(this.SettingView == null)
        return;
        this.SettingView.destroy();
        this.SettingView = null;
    },
    
    Create_RankView()
    {
        if(this.RankView != null){
            this.RankView.getComponent('CHPT_Popup_Rank').Show(this);
            return;
        }
        const instance = cc.instantiate(this.RankView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
        this.node.addChild(instance);  
        this.RankView =   instance;
        this.RankView.getComponent('CHPT_Popup_Rank').Show(this);
    },
    
    Create_HistoryView()
    {
        if(this.HistoryView != null){
            this.HistoryView.getComponent('SlotHistory').Show(Global.Enum.GAME_TYPE.CUNG_HY_PHAT_TAI);;
            return;
        }
        const instance = cc.instantiate(this.HistoryView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
        this.node.addChild(instance);  
        this.HistoryView =   instance;
        this.HistoryView.getComponent('SlotHistory').Show(Global.Enum.GAME_TYPE.CUNG_HY_PHAT_TAI);;
    },
    HistoryResponseServer(packet){
        if(this.HistoryView != null){
            this.HistoryView.getComponent('SlotHistory').responseServer(packet);;
            return;
        }
    },

    Create_JackpotView(jsonJackpotModel,jackpotType,rewardValue)
    {
        if(this.JackpotView != null)
        return;

        this.audioController.audioPool.playJackpot_MusicBg();

        const instance = cc.instantiate(this.Jackpot_GameView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);  
            this.JackpotView =   instance;

        let jackpotView_Component = instance.getComponent("CHPT_JackpotView");
        jackpotView_Component.SetupJackpotView(this.spinController,jsonJackpotModel,jackpotType,rewardValue)
    
        /*
        this.audioController.stopBackgroundMusic();
        this.audioController.audioPool.playJackpot_MusicBg();
        */
        
    },
    Destroy_JackpotView()
    {
        if(this.JackpotView == null)
        return;
        this.JackpotView.destroy();
        this.JackpotView = null;
        
        this.spinController.FinishAnimation_JackpotAnim();           

        this.audioController.audioPool.playLastBackgroud_Music();

        this.spinController.BackFromJackpotView();
        //this.audioController.audioPool.playNormal_MusicBg();
    },
    Create_TutorialView()
    {
        if(this.TutorialView != null)
        return;
        
        const instance = cc.instantiate(this.Tutorial_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
            this.spinController.spinView.Tutorial_Content.addChild(instance);  
            this.TutorialView =  instance;
    },
    Destroy_TutorialView()
    {
        if(this.TutorialView == null)
        return;
        this.TutorialView.destroy();
        this.TutorialView = null;       
    },
    runContinueScript()
    {
         if(this.Freespin_View)
            require("CHPT_SpinController").getIns().spinView.runContinueScript();  
        else 
            this.spinController.spinView.runContinueScript();
    },
    HideTutorial()
    {
        this.Destroy_FreeGame_View();
     
    }
});
