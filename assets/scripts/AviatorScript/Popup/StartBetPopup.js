// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.defaultTimeCounter = 5;
        this.timeCountDown = 5;
    },
    properties: {
        Counter_Lb : cc.Label,
        Total_User_Lb : cc.Label,
        Total_Bet_Lb : cc.Label,
    },
    Setup()
    {
        this.Counter_Lb.string =  this.timeCountDown;
        this.node.active = true;
        this.timeCountDown = this.defaultTimeCounter;
    },

    SetTotalUser(totalUser)
    {
        this.Total_User_Lb.string = totalUser;
    },

    SetTotalBet(totalBet)
    {
        this.Total_Bet_Lb.string =  cc.Tool.getInstance().formatMoneyNumberWithColom(totalBet); 
    },
    update(dt)
    {
        var e = this;
        this.timeCountDown -= dt;
        if(this.timeCountDown < 0)
        {
            this.timeCountDown = 0;
            this.node.active = false;
        }
        this.Counter_Lb.string = Math.round(this.timeCountDown).toString();
    }


    
});
