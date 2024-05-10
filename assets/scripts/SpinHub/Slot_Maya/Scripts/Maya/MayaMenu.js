cc.Class({
    extends: require("CaChepMenu"),

    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
    },


    QuitGame(){
        this.slotView.RequestLeaveRoom();
        // require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
        Global.NetworkManager.disconnect();
        setTimeout(() => {
            cc.LobbyController.getInstance().destroyDynamicView(null);
            cc.LobbyController.getInstance().offuserguest(true);
        }, 0)
    },
    
    ClickHelp() {
        this.slotView.PlayClick();
        if(this.slotView.helpView) {
            this.slotView.helpView.node.active = true;
        } else {
            // Global.UIManager.showMiniLoading();
            let menu = this;
            //cc.resources.load('Slot_Maya/Prefabs/HuongDanChoi', cc.Prefab, function (err, prefab) {      
            Global.DownloadManager.LoadPrefab("Slot_Maya",this.linkHelpView, (prefab)=>{
                let help = cc.instantiate(prefab);
                menu.slotView.node.addChild(help, 10000);
                menu.slotView.helpView = help.getComponent("SlotHelpView");
                menu.slotView.helpView.Init(menu.slotView);
            });
        }
    },
});
