// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Bonus_GameView_prefab : cc.Prefab,
        Free_Type1_GameView_prefab : cc.Prefab,
        Free_Type2_GameView_prefab : cc.Prefab,
        Jackpot_GameView_prefab : cc.Prefab,
        HelpView_prefab : cc.Prefab,
        SettingView_prefab : cc.Prefab,
        Tutorial_prefab : cc.Prefab,
        RankView_prefab : cc.Prefab,
        HistoryView_prefab : cc.Prefab,
    },

     // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setMainView(this);
        this.audioController =  require("AudioController_V2").getIns();
        this.sound = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';
        this.music = cc.Tool.getInstance().getItem("@Music").toString() === 'true';
        this.audioController.enableSound(this.sound);
        this.audioController.enableMusic(this.music);
    },

    start () {

    },

    Create_BonusGameView(RewardDescription,RewardJackpotType,totalWin,jackpotValueModel)
    {
            const instance = cc.instantiate(this.Bonus_GameView_prefab);
            this.node.addChild(instance);   
            this.BonusView = instance;
            this.audioController.audioPool.playBonusMusicBg();
            let specialID = this.spinController.specialID;
            instance.getComponent("TL_Bonus_Intance").TL_Bonus_Instance_Setup(RewardDescription,RewardJackpotType,totalWin,jackpotValueModel,specialID);
    },
    Destroy_BonusGameView()
    {
        if(this.BonusView == null)
        return;
        this.BonusView.destroy();
        this.BonusView = null;
        //this.spinController.BackFromFreespinView(totalFreeReward); 
        this.spinController.spinView.onIngameEvent("GAME_RESET_SESSION");
        this.audioController.audioPool.playNormal_MusicBg();
    },

    Create_FreeGame_Type2_View(freeSpin,packet,currentMatrix)
    {
            const instance = cc.instantiate(this.Free_Type2_GameView_prefab);       
            this.node.addChild(instance);   
            this.Freespin_View_Type_2 = instance;

            let isShowTutorial =  (this.TutorialView !== undefined && this.TutorialView !== null);
           require("TL_Fs2_SpinController").getIns().FreeSpinController_Setup(this.spinController,freeSpin,packet,isShowTutorial,this.spinController.spinView.tryPlay,currentMatrix);

         
           this.audioController.audioPool.playFree8_MusicBg();
    },

    Destroy_FreeGame_Type2_View(totalFreeReward = 0)
    {
        if(this.Freespin_View_Type_2 == null)
        return;
        this.Freespin_View_Type_2.destroy();
        this.Freespin_View_Type_2 = null;
        
        if(totalFreeReward > 0)
            this.spinController.BackFromFreespinView(totalFreeReward); 

        this.audioController.audioPool.playNormal_MusicBg();
    },
    Create_FreeGame_Type1_View(freeSpin,packet,currentMatrix)
    {
            const instance = cc.instantiate(this.Free_Type1_GameView_prefab);       
            this.node.addChild(instance);   
            this.Freespin_View_Type_1 = instance;

            let isShowTutorial =  (this.TutorialView !== undefined && this.TutorialView !== null);
           require("TL_FStype1_SpinController").getIns().FreeSpinController_Setup(this.spinController,freeSpin,packet,isShowTutorial,this.spinController.spinView.tryPlay,currentMatrix);
          
        
           this.audioController.audioPool.playFreeTopup_MusicBg();

    },

    Destroy_FreeGame_Type1_View(totalFreeReward = 0)
    {
        if(this.Freespin_View_Type_1 == null)
        return;
        this.Freespin_View_Type_1.destroy();
        this.Freespin_View_Type_1 = null;
        if(totalFreeReward > 0)
            this.spinController.BackFromFreespinView(totalFreeReward); 
        this.audioController.audioPool.playNormal_MusicBg();
    },

    Create_X2GameView()
    {
            const instance = cc.instantiate(this.X2_GameView_prefab);
       // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);   
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
            this.RankView.getComponent('TL_Popup_Rank').Show(this);
            return;
        }
        const instance = cc.instantiate(this.RankView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
        this.node.addChild(instance);  
        this.RankView =   instance;
        this.RankView.getComponent('TL_Popup_Rank').Show(this);
    },
    
    Create_HistoryView()
    {
        if(this.HistoryView != null){
            this.HistoryView.getComponent('SlotHistory').Show(Global.Enum.GAME_TYPE.TU_LINH);;
            return;
        }
        const instance = cc.instantiate(this.HistoryView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
        this.node.addChild(instance);  
        this.HistoryView =   instance;
        this.HistoryView.getComponent('SlotHistory').Show(Global.Enum.GAME_TYPE.TU_LINH);;
    },
    HistoryResponseServer(packet){
        if(this.HistoryView != null){
            this.HistoryView.getComponent('SlotHistory').responseServer(packet);;
            return;
        }
    },

    Create_JackpotView()
    {
        if(this.JackpotView != null)
        return;
        const instance = cc.instantiate(this.Jackpot_GameView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);  
            this.JackpotView =   instance;

        this.audioController.stopBackgroundMusic();
        this.audioController.audioPool.playJackpot_MusicBg();
        
    },
    Destroy_JackpotView()
    {
        if(this.JackpotView == null)
        return;
        this.JackpotView.destroy();
        this.JackpotView = null;
        this.spinController.FinishAnimation_JackpotAnim();   

        this.audioController.playBackgroundMusic();     
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
        if(this.BonusView)
            this.BonusView.emit("RUN_CONTINUE_SCRIPT");
        else if(this.Freespin_View_Type_1)
            require("TL_FStype1_SpinController").getIns().spinView.runContinueScript();
        else if(this.Freespin_View_Type_2)
            require("TL_Fs2_SpinController").getIns().spinView.runContinueScript();
        else 
            this.spinController.spinView.runContinueScript();
    },
    HideTutorial()
    {
        this.Destroy_BonusGameView();
        this.Destroy_FreeGame_Type1_View();
        this.Destroy_FreeGame_Type2_View();
        
    }
});
