

cc.Class({
    extends: cc.Component,

    properties: {
        listMark : [cc.Sprite],
        listNumberItemText : [cc.Label],
        listNumberItem : [],
        usingTimeList : [],
        stateItemList : [], //0-NONE, 1-USED, 2-COOL_DOWN
        TIME_USE : [],
        TIME_COOL_DOWN : [],
        mainActor : null,
    },

    Init(actor) {
        this.mainActor = actor;
        this.usingTimeList = [0, 0, 0];
        this.stateItemList = [0, 0, 0];
        this.listNumberItem = [0, 0, 0];
        for(let i = 0; i < 3; i++) {
            this.TIME_USE[i] = Global.GameConfig.ListItemConfig[i].TimeEffect;
            this.TIME_COOL_DOWN[i] = Global.GameConfig.ListItemConfig[i].TimeCooldown;
            this.HandleEndTurnItem(i);
        }
        this.UpdateInfo();
    },

    UpdateInfo() {
      
        let listItemData = require("BagController").getIns().listDataItem;
        if(listItemData != null) {
            for(let i = 0; i < listItemData.length; i++) {
                if(listItemData[i].ItemId < 4 && listItemData[i].ItemId > 0) {
                    this.listNumberItem[listItemData[i].ItemId-1] = listItemData[i].Amount;
                    this.listNumberItemText[listItemData[i].ItemId-1].string = listItemData[i].Amount.toString();
                }
                if(listItemData[i].ItemId == Global.Enum.ITEM_TYPE.DIAMOND) {
                    if(this.mainActor != null)
                        this.mainActor.SetDiamondBalance(listItemData[i].Amount);
                }
            }
        }else{
            require("SendRequest").getIns().MST_Client_Account_Bag_Get_Account_Info();
        }
    },

    GetInfo(itemModel) {
        
    },

    ClickUseItem(event, index) {
        let id = parseInt(index);
        if(this.listNumberItem[id-1] < 0)
            return;
        if(Global.GameLogic.mainActor.actorPropertis.CurrentGunId ==Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID || Global.GameLogic.mainActor.actorPropertis.CurrentGunId ==Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID)
             {
                Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("CANNOT_USE_SPECIAL_GUN"));
                return;
            }
        if(this.listNumberItem[id-1] <= 0) {
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NOT_ENOUGHT_ITEM"));
            return;
        }
        let msgData = {};
        msgData [1] = id;
        require("SendRequest").getIns().MST_Client_Account_Bag_Sell_Item (msgData);
    },

    HandleUseItem(id) {
        if (id < 100) {
            this.stateItemList[id-1] = 1;
            this.listMark[id-1].node.active = true;
            this.listMark [id-1].fillRange = 1; 
            this.usingTimeList[id-1] = this.GetRealTimeStartUp();
            this.UpdateInfo();
        }
    },

    HandleEndTurnItem(id) {
        this.mainActor.EndItem(id + 1);
    },

    GetRealTimeStartUp() {
        let currentDateTime = new Date();
        let realtimeSinceStartup = (currentDateTime.getTime() - Global.startAppTime.getTime())/1000;
        return realtimeSinceStartup;
    },

    update (dt) {
        if(!this.stateItemList)
            return;
        for (let i = 0; i < this.stateItemList.length; i++) {
            if (this.stateItemList [i] == 1) {
                let time = (this.GetRealTimeStartUp() - this.usingTimeList [i]);
                this.listMark [i].fillRange = time / this.TIME_COOL_DOWN[i];
                if (time >= this.TIME_USE[i]) {
                    this.stateItemList [i] = 2;
                    this.HandleEndTurnItem(i);
                }
            } else if (this.stateItemList [i] == 2) {
    
                let time = (this.GetRealTimeStartUp() - this.usingTimeList [i]);
                this.listMark [i].fillRange = time / this.TIME_COOL_DOWN[i];
                if (time >= this.TIME_COOL_DOWN[i]) {
                    this.stateItemList [i] = 0;
                    this.listMark [i].node.active = false;
                }
            }
        }
    },
});
