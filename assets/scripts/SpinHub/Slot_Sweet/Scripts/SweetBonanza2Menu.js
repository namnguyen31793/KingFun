

cc.Class({
    extends: require("SlotMenuView"),

    properties: {
        nodeBuyFree : cc.Node,
        lbCostBuyFree : cc.Label,
    },
    Init(slotView) {
        this._super(slotView);
        this.linkHelpView = "HuongDanChoi";
    },

    SetLastPrizeDrop(value) {
        cc.log("SetLastPrizeDrop "+value)
        this.UpdateWinValue(value);
    },

    SendBuyFree(){
        Global.Helper.LogAction("click buy free:"+this.slotView.slotType);
        this.HideNodeBuyFree();
        this.slotView.PlayClick();
        this.slotView.RequestBuyFree() ;
    },

    ShowNodeBuyFree(){
        this.nodeBuyFree.active = true;
        this.lbCostBuyFree.string = Global.Helper.formatNumber(this.slotView.totalBetValue* 100);//CONFIG.MULTI_BET_BONANZA);
    },

    HideNodeBuyFree(){
        this.nodeBuyFree.active = false;
        this.lbCostBuyFree.string = "";
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
            //cc.resources.load('Slot_Sweet/Prefabs/HuongDanChoi', cc.Prefab, function (err, prefab) {      
            Global.DownloadManager.LoadPrefab("Slot_Sweet",this.linkHelpView, (prefab)=>{
                let help = cc.instantiate(prefab);
                menu.slotView.node.addChild(help, 10000);
                menu.slotView.helpView = help.getComponent("SlotHelpView");
                menu.slotView.helpView.Init(menu.slotView);
            });
        }
    },

});
