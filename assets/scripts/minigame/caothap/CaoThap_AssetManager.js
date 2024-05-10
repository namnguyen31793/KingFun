// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        CaoThap_LuatChoiPopup : cc.Prefab,
        CaoThap_TopPlayerPopup : cc.Prefab,
        CaoThap_HistoryPopup : cc.Prefab,
        PopupManager : cc.Node,
    },

    onLoad () {
        this.gameController =  require("CaoThapGameController").getIns();
        this.gameController.SetAssetManager(this);
    },

    start () {

    },

    Create_LuatChoiPopup()
    {
        if(this.luatChoiPopup == null)
        {
            this.luatChoiPopup = cc.instantiate(this.CaoThap_LuatChoiPopup);
            this.luatChoiPopup.setPosition(0,0);
            this.luatChoiPopup.parent = this.PopupManager;
        }
    },

    Destroy_LuatChoiPopup()
    {
        if(this.luatChoiPopup != null)
        {
            this.luatChoiPopup.destroy();
            this.luatChoiPopup = null;
        }
    },
    Create_TopPlayerPopup()
    {
        if(this.topPlayerPopup == null)
        {
            this.topPlayerPopup = cc.instantiate(this.CaoThap_TopPlayerPopup);
            this.topPlayerPopup.setPosition(0,0);
            this.topPlayerPopup.parent = this.PopupManager;
        }
    },

    Destroy_TopPlayerPopup()
    {
        if(this.topPlayerPopup != null)
        {
           this.topPlayerPopup.destroy();
            this.topPlayerPopup = null;
        }
    },

    Create_HistoryPopup()
    {
        if(this.HistoryPopup == null)
        {
            this.HistoryPopup = cc.instantiate(this.CaoThap_HistoryPopup);
            this.HistoryPopup.setPosition(0,0);
            this.HistoryPopup.parent = this.PopupManager;
        }
    },
    Destroy_HistoryPopup()
    {
        if(this.HistoryPopup != null)
        {
           this.HistoryPopup.destroy();
            this.HistoryPopup = null;
        }
    },

    Create_SettingPopup()
    {
        if(this.SettingPopup == null)
        {
            this.SettingPopup = cc.instantiate(this.CaoThap_SettingPopup);
            this.SettingPopup.setPosition(0,0);
            this.SettingPopup.parent = this.PopupManager;
        }
    },
    Destroy_SettingPopup()
    {
        cc.log("Destroy_SettingPopup");
        if(this.SettingPopup != null)
        {
           this.SettingPopup.destroy();
            this.SettingPopup = null;
        }
    }


});
