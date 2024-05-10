
cc.Class({
    extends: cc.Component,

    properties: {
        listFish : null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.FishTimer = this;
    },

    onDestroy() {
        Global.FishTimer = null;
    },

    start () {
        this.schedule(()=>{
            this.HandleCheckListFish();
        } , 0.5);
        
    },

    HandleCheckListFish(isCheck = false) {
        let listFish = require("FishCollection").getIns().listPreCreateFish;
        
        let checkTime = 0;
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            checkTime = require("SyncTimeControl").getIns().GetCurrentTimeServer();
        } else {
            checkTime = new Date().getTime();
        }
        for(let temp in listFish){
            if(!Global.InGameManager.isIce || isCheck) {
            
                if(listFish[temp].startTimeCreated < checkTime) {
                    if(listFish[temp].FishType == null) {
                        console.log(temp);
                        console.log(listFish[temp]);
                        console.log("error create fish 2");
                    }
                    require("FishCollection").getIns().initFish(listFish[temp].FishType , listFish[temp]);
                }
            }
		}
    },
	
	getLengthObj(obj){
        let size = 0;
        for(let temp in obj){
            if(obj.hasOwnProperty(temp))size++;
        }
        return size
    },
});
