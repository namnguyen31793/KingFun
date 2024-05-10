// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Tick_Lb : cc.Label,
        Time_Lb : cc.Label,
        Total_Bet_Lb  : cc.Label,
        Total_Reward_Lb  : cc.Label,
        Balance_Lb  : cc.Label,
        Odd_Lb : cc.Label,
        SessionId_Lb : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    show(SessionID,Bet,Award,Odd,Balance,CreateTime)
    {
        cc.log("SHOW ----------------->");
        Award = Award - Bet;
        this.Tick_Lb.string = Global.RandomNumber(1000000,10000000);
        this.Time_Lb.string = CreateTime;
        this.Total_Bet_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(Bet);
        this.Total_Reward_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(Award);
        this.SessionId_Lb.string =  "#"+SessionID;
        this.Odd_Lb.string =  Odd;
        this.Balance_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(Balance);
        if(Award <= 0)
        {
            this.Odd_Lb.string  = '-';
            this.Odd_Lb.node.color = cc.Color.RED;
            this.Total_Reward_Lb.node.color = cc.Color.RED;
        }
        else
        {
            this.Odd_Lb.node.color = cc.Color.GREEN;
            this.Total_Reward_Lb.node.color = cc.Color.GREEN;
        }
        this.node.active = true;
    }

    // update (dt) {},
});
