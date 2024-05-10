import List from "List";

cc.Class({
    extends: cc.Component,
    ctor() {
        this.fishProperties = null;
        this.numberCreate = 0;
        this.startId = 0;
        this.listChoice = null;
        this.listKraken = null;
    },

    properties: {
        listPos: {
            default: [],
            type: cc.Vec2
        },
        listSize: {
            default: [],
            type: cc.Vec2
        },
        listAngle: {
            default: [],
            type: cc.Float,
        },
        content : cc.Node,
        listTentacles : [cc.Node],
    },

    ShowKraken(fishProperties) {
        this.listChoice = new List();
        this.listKraken = new List();
        for(let i = 0; i < 6; i++)
            this.listChoice.Add(i);
        this.fishProperties = fishProperties;
        this.startId = fishProperties.FishId;
        this.node.opacity = 0;
        var action = cc.fadeIn(1.0);
        this.node.runAction(action);
        this.scheduleOnce(()=>{
            this.CreateKraken(0,4);
    } , 2);
    },

    CreateKraken(minTime, maxTime) {
      
        let time = Global.RandomNumber(minTime,maxTime);
        this.scheduleOnce(()=>{
            let index = Global.RandomNumber(0, this.listChoice.GetCount());
            let nodeCp = this.listTentacles[this.listChoice.Get(index)].getComponent("FishKraken");
            nodeCp.node.active = true;
            nodeCp.node.opacity = 0;
            var action = cc.fadeIn(1.0);
            nodeCp.node.runAction(action);
            this.listChoice.RemoveAt(index);
            let properties = this.CloneFishProperties(this.startId + this.numberCreate, this.fishProperties.CreateTime);
            nodeCp.Init(properties);
            this.listKraken.Add(nodeCp);
            require("FishCollection").getIns().listFish[properties.FishId.toString()] = nodeCp;
            this.numberCreate += 1;
            if(this.numberCreate < 6)
                this.CreateKraken(0, 10);
        } , time);
        
    },

    RemoveKraken(fishId) {
        for(let i = 0; i < this.listKraken.listValue.length; i++) {
            if(fishId == this.listKraken.Get(i).FishProperties.FishId) {
                this.listKraken.RemoveAt(i);
                break;
            }
        }
        this.CheckEndKraken();
    },

    DeleteKraken() {
        if(this.listKraken != null && this.listKraken.listValue != null) {
            for(let i = 0; i < this.listKraken.GetCount(); i++){
                console.log(i);
                this.listKraken.Get(i).EnableAttackPoint(false);
            }
            var action1 = cc.fadeOut(1.0);
            let action2 = cc.callFunc(() => {
                for(let i = 0; i < this.listKraken.GetCount(); i++){
                    require("FishCollection").getIns().SubToTalFish();
                    require("FishCollection").getIns().RemoveFishToList(this.listKraken.Get(i).FishProperties.FishId);
                }
                this.node.destroy();
            });
            this.node.runAction(cc.sequence(action1, cc.delayTime(1), action2));
        } else {
            var action1 = cc.fadeOut(1.0);
            let action2 = cc.callFunc(() => {
                this.node.destroy();
            });
            this.node.runAction(cc.sequence(action1, cc.delayTime(1), action2));
            console.log("error delete kraken:");
            console.log(this.listKraken);
        }
    },

    CheckEndKraken() {
        if(this.listKraken.GetCount() == 0 && this.numberCreate == 6) {
            Global.ServerBot.moduleCreateFish.dataCreateFish.countTime = 0;
            Global.ServerBot.moduleCreateFish.RemoveFishByType(Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE);
            Global.ServerBot.moduleCreateFish.EndBoss();
        }
    },

    CloneFishProperties(fishId, timeCreate) {
        let newProperties = {
            FishId : fishId,
            FishSpeed : Global.RandomNumber(7,25),
            FishType : Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE,
            ItemType : 0,
            PathId : 1,
            Radius : 0,
            RewardMulti : 0,
            RewardType : 0,
            StartTimeSkipDate : "0001-01-01T00:00:00",
            TimeSkip : 0,
            UnTimeSkipDate: "0001-01-01T00:00:00",
            CreateTime : timeCreate,
            totalSkipTimeMinisecond : 0,
        };
        return newProperties
    },

});
