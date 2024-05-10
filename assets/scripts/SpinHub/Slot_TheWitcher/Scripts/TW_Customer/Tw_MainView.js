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
        Free_GameView_prefab : cc.Prefab,
        Jackpot_GameView_prefab : cc.Prefab,
        HelpView_prefab : cc.Prefab,
        SettingView_prefab : cc.Prefab,
        Tutorial_prefab : cc.Prefab,

        //Sound
        Horse_Go_Sound : cc.AudioSource,
        RankView_prefab : cc.Prefab,
        HistoryView_prefab : cc.Prefab,
    },

     // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setMainView(this);
        this.Tw_MainView_Animation = this.node.getComponent("cc.Animation");
        this.Tw_Effect_StartFreeSpin_Component = this.node.getComponent("Tw_Effect_StartFreeSpin");
    },

    start () {

    },

    Create_BonusGameView()
    {
            const instance = cc.instantiate(this.Bonus_GameView_prefab);
       // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);   
            require("AudioController_V2").getIns().playBonusBackgroundMusic();
    },

    Create_FreeGameView(freeSpin,packet)
    {
        let callBack = ()=>{
          
            this.Tw_MainView_Animation.off("finished" , callBack);

            const instance = cc.instantiate(this.Free_GameView_prefab);       
            this.node.addChild(instance);   
            this.Freespin_View = instance;

            let isShowTutorial =  (this.TutorialView !== undefined && this.TutorialView !== null);
            require("Tw_Freespin_Controller").getIns().FreeSpinController_Setup(this.spinController.roomID,this.spinController.gameID,this.spinController.CurrentRoomConfig,freeSpin,packet,isShowTutorial,this.spinController.spinView.tryPlay);
          
           }
           this.Tw_MainView_Animation.on("finished" ,callBack );
           this.Tw_MainView_Animation.play("SlotView_StartFreespin");
        
           this.scheduleOnce(()=>{
                require("AudioController_V2").getIns().playSound_Direct(this.Horse_Go_Sound);
            }, 1)
           
    },

    Destroy_FreeGameView()
    {
        if(this.Freespin_View == null)
        return;
        this.Freespin_View.destroy();
        this.Freespin_View = null;

        let callBack = ()=>{
            this.Tw_MainView_Animation.off("finished" , callBack);
            this.spinController.BackFromFreespinView();
        }
        this.Tw_MainView_Animation.on("finished" ,callBack );
        this.Tw_MainView_Animation.play("SlotView_ReturnMainView");
        this.Tw_Effect_StartFreeSpin_Component.ShowAnimation_HorseStartGo();
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
            this.RankView.getComponent('Tw_Popup_Rank').Show(this);
            return;
        }
        const instance = cc.instantiate(this.RankView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
        this.node.addChild(instance);  
        this.RankView =   instance;
        this.RankView.getComponent('Tw_Popup_Rank').Show(this);
    },
    
    Create_HistoryView()
    {
        if(this.HistoryView != null){
            this.HistoryView.getComponent('SlotHistory').Show(Global.Enum.GAME_TYPE.THE_WITCHER);;
            return;
        }
        const instance = cc.instantiate(this.HistoryView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
        this.node.addChild(instance);  
        this.HistoryView =   instance;
        this.HistoryView.getComponent('SlotHistory').Show(Global.Enum.GAME_TYPE.THE_WITCHER);;
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
    },
    Destroy_JackpotView()
    {
        if(this.JackpotView == null)
        return;
        this.JackpotView.destroy();
        this.JackpotView = null;
        this.spinController.FinishAnimation_JackpotAnim();
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

});
