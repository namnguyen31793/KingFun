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
       DisplayName_Lb : cc.Label,
       Bet_Lb  : cc.Label,
       JackpotAward_Lb  : cc.Label,
       Bg : cc.Node
    },

    show(index,time,displayName,bet,jackpotAward)
    {
        if(index %2 == 0)
            this.Bg.active = false;
        this.Time_Lb.string = time;
        this.DisplayName_Lb.string = displayName;
        this.Bet_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(bet);
        this.JackpotAward_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(jackpotAward);
        this.node.active = true;
    }
});
