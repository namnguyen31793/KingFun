// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        GateCollection : [require('miniXocDia_GateInfo')],
       
    },
    onLoad()
    {
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetGateManager(this);
       
    },

   

    start () {

    },  

    ResetInfo()
    {
        for(let i=0;i< this.GateCollection.length;i++)
        {
            this.GateCollection[i].ResetGate();
        }
        let totalLastBet = this.GetTotalLastBet();
        if(totalLastBet > 0)
            this.Enable_Rebet_Btn_Collection(true);
        else
            this.Enable_Rebet_Btn_Collection(false);

       
    },

    onClick_BetSideClick(event,betside)
    {
        cc.log("onClick_BetSideClick");
        let betSide = parseInt(betside);
        let betValue = this.gameController.GetCurrentBet();
        this.gameController.SendRequestOnHub(cc.MethodHubName.BET, betValue, betSide);
        this.Enable_Rebet_Btn_Collection(false);
    },

    onClick_ReBet()
    {
        if(this.gameController.GetCurrentState() != cc.BauCuaPharse.Betting)
        return;

        cc.log("onClick_ReBet");
        let self = this;
        this.GateCollection.forEach((element, index) => {
            setTimeout(() => {
                let betAmount =  element.GetLastBet();
                if(betAmount > 0 && self.gameController.GetCurrentState() === cc.BauCuaPharse.Betting )
                self.gameController.SendRequestOnHub(cc.MethodHubName.BET, betAmount, (index+1)); 
            }, index * 100); // Thời gian chờ: chỉ số vòng lặp nhân với 200 (ms)
        });


        this.Enable_Rebet_Btn_Collection(false);
    },

    onClick_x2ReBet()
    {
        if(this.gameController.GetCurrentState() != cc.BauCuaPharse.Betting)
        return;
        cc.log("onClick_x2ReBet");
        let self = this;
        let index = 100;
        let timePlay = 100;
        for(let i=0;i < 2;i++)
        {
            this.GateCollection.forEach((element, index) => {
                
                timePlay += 100;
                setTimeout(() => {
                    let betAmount =  element.GetLastBet();
                    if(betAmount > 0 && self.gameController.GetCurrentState() === cc.BauCuaPharse.Betting)
                    self.gameController.SendRequestOnHub(cc.MethodHubName.BET, betAmount, (index+1)); 
                },timePlay); // Thời gian chờ: chỉ số vòng lặp nhân với 200 (ms)
            });
        }
        this.Enable_Rebet_Btn_Collection(false);
    },

    updateTotalBet(data)
    {

        let TotalBetGourd = data.TotalBetGourd;
        let Total_User_BetGourd = data.Total_User_BetGourd;
        this.GateCollection[0].SetTotalBet(TotalBetGourd,Total_User_BetGourd);
        

        let TotalBetCrab = data.TotalBetCrab;
        let Total_User_BetCrab = data.Total_User_BetCrab;
        this.GateCollection[1].SetTotalBet(TotalBetCrab,Total_User_BetCrab);

        let TotalBetFish = data.TotalBetFish;
        let Total_User_BetFish = data.Total_User_BetFish;
        this.GateCollection[2].SetTotalBet(TotalBetFish,Total_User_BetFish);

        let TotalBetChicken = data.TotalBetChicken;
        let Total_User_BetChicken = data.Total_User_BetChicken;
        this.GateCollection[3].SetTotalBet(TotalBetChicken,Total_User_BetChicken);

        let TotalBetShrimp = data.TotalBetShrimp;
        let Total_User_BetShrimp = data.Total_User_BetShrimp;
        this.GateCollection[4].SetTotalBet(TotalBetShrimp,Total_User_BetShrimp);

        let TotalBetDeer = data.TotalBetDeer;
        let Total_User_BetDeer = data.Total_User_BetDeer;
        this.GateCollection[5].SetTotalBet(TotalBetDeer,Total_User_BetDeer);


    },
    ShowGateWin(data)
    {
        let isNan = this.gameController.GetNanStatus();
        if(isNan)
        {
            let self = this;
            this.scheduleOnce(()=>{
                self.ShowWinEffect(data);
            },4);
        }
        else
        {
            this.ShowWinEffect(data);
        }
    },
    ShowWinEffect(data)
    {
        let result = data.Result;
        let resDice1 = parseInt(result.Dice1);
        let resDice2 = parseInt(result.Dice2);
        let resDice3 = parseInt(result.Dice3);
        let intArray = [];
        intArray.push(resDice1);
        intArray.push(resDice2);
        intArray.push(resDice3);
        let resultString = this.parseListToIntTime(intArray);
      
        let winDescriptionArray = [];
        winDescriptionArray = resultString.split(',')
        for(let i=0;i< winDescriptionArray.length;i++)
        {
            let multiArray = [];
            multiArray = winDescriptionArray[i].split('-');
            let gate = parseInt(multiArray[0]);
            let multi = parseInt(multiArray[1]);
            this.GateCollection[gate-1].ShowWinEffect(multi);
        }
    },
    ShowGateMyWin()
    {
        for(let i=0;i< this.GateCollection.length;i++)
        {
            this.GateCollection[i].ShowMyWin();
        }
    },

    parseListToIntTime(list) {
        let counts = {};
        list.forEach(num => {
            counts[num] = (counts[num] || 0) + 1;
        });
        return Object.entries(counts).map(([num, count]) => `${num}-${count}`).join(',');
    },
    updateTotalMyBetSide(betSide, total)
    {
        this.GateCollection[betSide-1].SetMyBetInfo(total);
    },
    updateBetOfAccount: function (data) {
        data.map(betSide => {
            let side = parseInt(betSide.BetSide);
            this.GateCollection[betSide-1].SetMyBetInfo(betSide.BetValue);
        });
    },
    Enable_Rebet_Btn_Collection(enable)
    {
        this.gameController.Enable_Rebet_Btn_Collection(enable);
    },
    GetTotalLastBet()
    {
        let totalBet = 0;
        this.GateCollection.map(gate => {
            totalBet += gate.GetLastBet();
        });
        return totalBet;
    }






    // update (dt) {},
});
