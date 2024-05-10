

cc.Class({
    extends: cc.Component,
    ctor()
    {

    },

    properties: {
       
    },

    SendData()
    {

    },
    Betting(betAmount,sesionID,autoCashout = 1)
    {
        if (void 0 === i && (i = 1),
        !(t <= 0)) {
            var n = ["6", "MiniGame", "aviatorPlugin", {
                cmd: o.default.BETTING,
                b: betAmount,
                sid: sesionID,
                aid: 1,
                eid: autoCashout
            }];
            this.sendData(JSON.stringify(n));
        }
    },
    AutoCashout()
    {

    },
    CashOut()
    {

    },

});
