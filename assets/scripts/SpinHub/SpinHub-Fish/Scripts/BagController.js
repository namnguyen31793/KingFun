var BagController = cc.Class({
	statics: {
        getIns() {
            if (this.self == null) this.self = new BagController();
            return this.self;
        }
    },

    ctor() {
        this.listDataItem = null;//ItemId     Amount
        this.listDataFree = null;
    },

    UpdateBagInfo(listDataItem, listDataFree) {
        this.listDataItem = listDataItem;
        if(listDataFree != null) {
            this.listDataFree = listDataFree;
        }
        let currentScreen = require("ScreenManager").getIns().currentScreen;
        if(currentScreen != 0) 
            if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY){
                Global.LobbyView.OnUpdateDiamonView();
            // } else if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY_FISH) {
            } else if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
                Global.LobbyFish.OnUpdateDiamonView();
            } 
    },

    UpdateFreeItem(gameId, amount) {
        let index = -1;
        for(let i = 0; i < this.listDataFree.length; i++) {
            if(this.listDataFree[i].GameID == gameId) {
                index = i;
                break;
            }
        }
        if(index != -1) {
            if(amount == 0) {
                this.listDataFree.splice(index, 1);
            } else {
                this.listDataFree[index].Amount = amount;
            }
        }
    },

    UpdateKey(numb) {
        for(let i = 0; i < this.listDataItem.length; i++) {
            if(this.listDataItem[i].ItemId == Global.Enum.ITEM_TYPE.KEY_PIGBANK) {
                this.listDataItem[i].Amount = numb;
            }
        }
    },

    UseItem(itemId, listDataItem) {
        this.listDataItem = listDataItem;
        Global.GameLogic.mainActor.UseItem(itemId, true);
    },

    TakeItem(itemId, amount) {
        let check = false;
        for(let i = 0; i < this.listDataItem.length; i++) {
            if(this.listDataItem[i].ItemId == itemId) {
                this.listDataItem[i].Amount += amount;
                check = true;
            }
        }
        if(!check) {
            let data = {
                ItemId : itemId,
                Amount : amount,
            }
            this.listDataItem.push(data);
        }
    },

});
module.exports = BagController;
