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
        this.sessionID = 0;
    },

    properties: {
        lbTime: cc.Label,
        lbSessionID: cc.Label,
       
    },

    onLoad: function () {

        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetXocDiaInfo(this);

       // this.activeTimer(false);
       // this.showStatus(null);
        this.currentState = null;
        this.interval = null;
        this.time = 0;

      
      
    },
    onEnable: function () {
       
    },
    onDestroy: function () {
        try {
            if (this.interval) {
                clearInterval(this.interval);
            }
        } catch (e) {

        }
    },
   
    //Hub on notifyChangePhrase - Thong bao chuyen phien
    onNotifyChangePhrase: function (data) {
        let state = parseInt(data.Phrase);
        switch (state) {
            case cc.BauCuaPharse.None:               
               
                break;
            case cc.BauCuaPharse.Waiting://Cho phien moi           
                if (this.currentState !== state) {
                    this.gameController.ShowPopup("BẮT ĐẦU PHIÊN MỚI");
                    this.gameController.ResetEffect();
                    this.gameController.ReloadHistoryApi();
                }
                break;
            case cc.BauCuaPharse.Shaking://Xoc    
              
                break;
            case cc.BauCuaPharse.Betting://Dat Cua
                 this.activeTimer(true);
                break;
            case cc.BauCuaPharse.EndBetting://Dat Cua
                this.gameController.ShowPopup("DỪNG CƯỢC NHA!",1.5);
                break;
            case cc.BauCuaPharse.OpenPlate://Mo bat    
                this.activeTimer(false);
                this.gameController.ShowPopup("KHUI NHA !");                
                break;
            case cc.BauCuaPharse.ShowResult://Ket qua    
                this.gameController.onShowResult(data);
                this.activeTimer(false);
                break;
        }
        /*
        this.controller.setCurrentState(state);        
        */
        this.currentState = state;
        this.updateSessionId(data.SessionID);
        //Cap nhat tong tien bet
        this.gameController.updateTotalBet(data);
        this.gameController.updateJackpot(data);
        this.sessionID = data.SessionID;
    },
    getSessionID()
    {
        return this.sessionID;
    },
    //reset dem nguoc
    activeTimer: function (isActive) {
        this.lbTime.node.parent.active = isActive;
        if (this.interval && !isActive) {
            clearInterval(this.interval);
        }
    },
    //Cap nhat phien
    updateSessionId: function (sID) {
        this.lbSessionID.string = ": #" + sID;
    },
    //Cap nhat thoi gian dem nguoc
    updateTime: function (time) {
        //Clear interval
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.time = parseInt(time);
        this.startTimer();

        this.interval = setInterval(function () {
            this.startTimer();
        }.bind(this), 1000)
    },
    startTimer: function () {
        if (this.time < 0) {
            this.time = 0;
            return;
        }
        this.lbTime.string = this.time;
        console.log(this.time);
        this.time--;
    },
    updateRoomTimer: function (time) {
        if (this.lbTime) {
            var timeInt = time;
            this.timeInt = timeInt;

            
            if (timeInt > 0) {
                this.lbTime.string = timeInt;
                /*
                if (this.currentState === cc.BauCuaPharse.EndBetting) {
                    this.lbTime.node.color = cc.Color.RED;
                } else {
                    this.lbTime.node.color = cc.Color.GREEN;
                }
                if ([cc.BauCuaPharse.Waiting, cc.BauCuaPharse.None, cc.BauCuaPharse.Shaking, cc.BauCuaPharse.ShowResult, cc.BauCuaPharse.OpenPlate].includes(this.currentState)) {
                    this.lbTime.node.color = cc.Color.WHITE;
                }
                */

            }
        }
    },
  
  
});
