// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       Help_Popup : cc.Node,
       rankPopup_Prefab : cc.Prefab,
       soiCauPopup_Prefab : cc.Prefab,
       jackpotHistoryPopup_Prefab : cc.Prefab,
       playerHistoryPopup_Prefab : cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetAssetManager(this);
        this.Help_Popup.active = true;
    },

    start () {

    },

    CreateRankPopup()
    {
        if(this.RankPopup != null)
            return;    
        var nodeView = cc.instantiate(this.rankPopup_Prefab);
        nodeView.parent = this.node;
        nodeView.setPosition(0,0);

        this.RankPopup = nodeView;
    },
    RemoveRankPopup()
    {
        if(!this.RankPopup)
        return;
        this.RankPopup.destroy();
        this.RankPopup = null;
    },

    Create_SoiCauPopup()
    {
        if(this.SoiCauPopup != null)
        return;    
        var nodeView = cc.instantiate(this.soiCauPopup_Prefab);
        nodeView.parent = this.node;
        nodeView.setPosition(615,0);
        this.SoiCauPopup = nodeView;
    },
    Remove_SoiCauPopup()
    {
        if(!this.SoiCauPopup)
        return;
        this.SoiCauPopup.destroy();
        this.SoiCauPopup = null;
    },

    Create_JackpotHistoryPopup()
    {
        if(this.JackpotHistoryPopup != null)
        return;    
        var nodeView = cc.instantiate(this.jackpotHistoryPopup_Prefab);
        nodeView.parent = this.node;
        nodeView.setPosition(0,0);
        this.JackpotHistoryPopup = nodeView;
    },
    Remove_JackpotHistoryPopup()
    {
        if(!this.JackpotHistoryPopup)
        return;
        this.JackpotHistoryPopup.destroy();
        this.JackpotHistoryPopup = null;
    },

    Create_playerHistoryPopup()
    {
        if(this.PlayerHistoryPopup != null)
        return;    
        var nodeView = cc.instantiate(this.playerHistoryPopup_Prefab);
        nodeView.parent = this.node;
        nodeView.setPosition(0,0);
        this.PlayerHistoryPopup = nodeView;
    },
    Remove_playerHistoryPopup()
    {
        if(!this.PlayerHistoryPopup)
        return;
        this.PlayerHistoryPopup.destroy();
        this.PlayerHistoryPopup = null;
    },

    // update (dt) {},
});
