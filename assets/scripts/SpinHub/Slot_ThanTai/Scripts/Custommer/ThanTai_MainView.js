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
        X2_GameView_prefab : cc.Prefab,
        HelpView_prefab : cc.Prefab,
        SettingView_prefab : cc.Prefab,
        RankView_prefab : cc.Prefab,
        HistoryView_prefab : cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinController = require("ThanTaiSpinController").getIns();
        this.spinController.setMainView(this);
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

    Create_FreeGameView()
    {
            const instance = cc.instantiate(this.Free_GameView_prefab);
       // Ví dụ: Thêm instance vào một node trong trò chơi
            this.node.addChild(instance);   
            require("AudioController_V2").getIns().playSound(cc.AudioTypes.FREESPIN);
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
            this.RankView.getComponent('ThanTai_Popup_Rank').Show(this);
            return;
        }
        const instance = cc.instantiate(this.RankView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
        this.node.addChild(instance);  
        this.RankView =   instance;
        this.RankView.getComponent('ThanTai_Popup_Rank').Show(this);
    },
    
    Create_HistoryView()
    {
        if(this.HistoryView != null){
            this.HistoryView.getComponent('SlotHistory').Show(Global.Enum.GAME_TYPE.THAN_TAI);;
            return;
        }
        const instance = cc.instantiate(this.HistoryView_prefab);        
        // Ví dụ: Thêm instance vào một node trong trò chơi
        this.node.addChild(instance);  
        this.HistoryView =   instance;
        this.HistoryView.getComponent('SlotHistory').Show(Global.Enum.GAME_TYPE.THAN_TAI);;
    },
    HistoryResponseServer(packet){
        if(this.HistoryView != null){
            this.HistoryView.getComponent('SlotHistory').responseServer(packet);;
            return;
        }
    },



    // update (dt) {},
});
