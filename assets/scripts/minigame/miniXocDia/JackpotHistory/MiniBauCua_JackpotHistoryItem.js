// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       Time_Lb : cc.Label,
       Username_Lb : cc.Label,
       TotalBet_Lb : cc.Label,
       TotalReward_Lb : cc.Label,
    },

    updateItem: function (item, itemID) {
        cc.log("updateItem");
        this.node.active = true;
       this.Time_Lb.string = cc.Tool.getInstance().convertUTCTime(item.CreateTime);
       this.Username_Lb.string = item.DisplayName;
       this.TotalBet_Lb.string = cc.Tool.getInstance().formatNumberKTX(item.TotalBet);
       this.TotalReward_Lb.string = cc.Tool.getInstance().formatNumberKTX(item.JackpotReward);
    }
});
