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
        this.betRoom_Array = [1000,10000,50000,100000,500000];
        this.currentBet = this.betRoom_Array[0];
        this.isFinished = true;
        this.sessionID = -99;
        this.lastClickRule = null;
    },

    properties: {
        cardHandle : require("CaoThap_Card_Handle"),
        effect_Card_Array : [cc.Sprite],
        card_Result : cc.Sprite,
        effect_Card_Animation : cc.Animation,
        btn_StartGame : cc.Button,
        btn_Up : cc.Button,
        btn_Down : cc.Button,
        btn_Up_Sprite : cc.Sprite,
        btn_Down_Sprite : cc.Sprite,
        up_SpriteFrame : [cc.SpriteFrame],
        down_SpriteFrame : [cc.SpriteFrame],
        default_Card_SpriteFrame : cc.SpriteFrame,
        High_Price_Lb : cc.Label,
        Mid_Price_Lb : cc.Label,
        Low_Price_Lb : cc.Label,
        High_Price_Node : cc.Node,
        Mid_Price_Node : cc.Node,
        Low_Price_Node : cc.Node,
        Ace_Card_Array : [cc.Sprite],
        LuotMoi_Btn : cc.Button,
        LuotMoi_Sprite : cc.Sprite,
        LuotMoi_SpriteFrame : [cc.SpriteFrame],
        room_Toggle_Array : [cc.Toggle],
        historyCollection : require("CaoThap_HistoryCollection"),
        lbMoneyExchange : cc.Label,
        lbJackpotValue : cc.LabelIncrement,
        lbWinJackpotValue : cc.Label,
        winJackpotNode : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        //set zIndex
        this.node.zIndex = cc.Config.getInstance().getZINDEX();

        this.gameController =  require("CaoThapGameController").getIns();
        this.gameController.SetGameView(this);

        cc.log("CaoThap_View");
        var CaoThapNegotiateCommand = new cc.CaoThapNegotiateCommand;
        CaoThapNegotiateCommand.execute(this);
        this.lbMoneyExchange.node.active = false;
        this.lbWinJackpotValue.node.active = false;
        this.winJackpotNode.active = false;
    },

    onEnable: function () {
        this.animation.play('openPopup');
        cc.PopupController.getInstance().showBusy();
        this.resetAllObject();
    },

    start () {

    },

    resetAllObject()
    {
        this.Enable_UpDown_Collection(false);
        this.card_Result.spriteFrame = this.default_Card_SpriteFrame;
        this.High_Price_Lb.string = 0;
        this.Mid_Price_Lb.string = 0;
        this.Low_Price_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(this.currentBet);
        this.High_Price_Node.active = false;
        this.Low_Price_Node.active = false;

        for(let i=0;i< this.Ace_Card_Array.length;i++)
        {
            this.Ace_Card_Array[i].node.active = false;
        }        
        this.Enable_LuotMoi_Btn(false);
        this.btn_StartGame.node.active = true;
        this.historyCollection.clearAllItem();
        this.isFinished = true;
    },

    onCaoThapNegotiateResponse(response)
    {

        this.connectionToken = response.ConnectionToken;
        this.caoThapHub = new cc.Hub;
        this.caoThapHub.connect(this, cc.HubName.CaoThapHub, response.ConnectionToken);
    },
    onDestroy: function () {
       // this.sendRequestOnHub(cc.MethodHubName.EXIT_LOBBY);
       this.caoThapHub.exitLobby();
        if (this.caoThapHub)
            this.caoThapHub.disconnect();
        this.unscheduleAllCallbacks();       
    },

    reconnect: function () {
        // console.log('miniPokerHub reconnect');
        this.lastTimeReconnect = (new Date()).getTime();
        this.caoThapHub.connect(this, cc.SubdomainName.CAO_THAP, this.connectionToken, true);
    },

    onHubOpen: function () {   
        this.joinLobby();
         //this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);        
    },

    onHubClose: function () {
        //reconnect
        if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
            this.reconnect();
        } else {
            cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
        }
    },

    onHubError: function () {

    },
    onHubMessage: function (response) {
      
        if (response.M !== undefined && response.M.length > 0) {
            let res = response.M;
            this.gameController.Handle_ResponseData(response);        
        } else if (response.R && response.R.AccountID) {
            this.currAccId = response.R.AccountID;
           // this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
            //sau khi enterLobby
            cc.PopupController.getInstance().hideBusy();

        } else {
            //PING PONG
            if (response.I) {
                this.caoThapHub.pingPongResponse(response.I);
            }
        }
    },

    /*
    //#region  Network Send Request
    sendRequestOnHub: function (method, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10) {
        
        switch (method) {
            case cc.MethodHubName.ENTER_LOBBY:
                this.caoThapHub.enterLobby();
                break;
            case cc.MethodHubName.EXIT_LOBBY:
                this.caoThapHub.exitLobby();
                break;
            case cc.MethodHubName.BET:
                this.caoThapHub.bet(data1, data2);//betValue, betSide
                break;
            case cc.MethodHubName.PLAY_NOW:
                this.caoThapHub.playNow();
                break;
            case cc.MethodHubName.SEND_MESSAGE:
                this.caoThapHub.sendRoomMessage(data1);
                break;
            
        }
    },
    */
    //#region Send Request
    joinLobby(betAmount = 1000)
    {
        if(betAmount >= 0)
        {
            var data = {
                M: cc.MethodHubName.ENTER_LOBBY,
                A:[betAmount]
            };
            this.caoThapHub.send(data);
        }
    },

    Send_PlayNow()
    {
        if(this.currentBet >= 0)
        {
            var data = {
                M: cc.MethodHubName.PLAY_NOW,
                A:[this.currentBet]
            };
            this.caoThapHub.send(data);
        }
    },

    Send_PlayGame(selectType)
    {
        if(this.currentBet >= 0)
        {
            var data = {
                M: cc.MethodHubName.PLAY_GAME,
                A:[this.sessionID,this.currentBet,selectType]
            };
            this.caoThapHub.send(data);
        }
    },

    Send_AnNon()
    {
        var data = {
            M: cc.MethodHubName.AN_NON,
            A:[this.sessionID,this.currentBet]
        };
        this.caoThapHub.send(data);
    },


    //#endregion

    //#region  Handle Response 

    GetAccountInfo(responseData)
    {
        let accountData = responseData[0];
        let jackpotValue = responseData[4];
        this.ShowEffect_Jackpot(jackpotValue);
        if(accountData == null)
        {
            this.currentBet = this.betRoom_Array[0];
            this.Set_RoomBetToggle(this.currentBet);
            this.resetAllObject();

        }
        else
        {
            let clickRule = responseData[1];
            let winUp  = responseData[2];
            let winDown  = responseData[3];
            
           // this.Handle_ShowResult(accountData.Result_Card);
            if(accountData.Step == 0)
                this.card_Result.spriteFrame = this.cardHandle.Get_SpiteByID(accountData.Result_Card);
            else
                this.card_Result.spriteFrame = this.cardHandle.Get_SpiteByID(accountData.Select_Card);
            this.sessionID  = accountData.SessionID;
            this.Handle_Enable_ClickStatus(clickRule);
            this.Set_Updown_Price(winUp,winDown,accountData.Award);
            this.Set_AceStore(accountData.AceDes);
            this.btn_StartGame.node.active = false;
            this.Set_RoomBetToggle(accountData.Bet);
            this.lastClickRule = clickRule;
            this.historyCollection.show(accountData.PlayDes);
         
        }
    },

    HandleResponse_PlayNow(response)
    {
        this.lastResponse = response;
        //JSON.parse
        this.lastResponse = response;
        let sessionID = response[0];
        let roomBet = response[1];
        let SelectType = response[2];
        let AceDes = response[3];
        let playDes = response[4];
        let resultCard = response[5];
        let clickRule  = response[6];
        let award   = response[7];
        let winUp  = response[8];
        let winDown = response[9];
        let jackpotValue = response[10];
        let accountBalance = response[11];
        this.sessionID = sessionID;
        this.Handle_ShowResult(resultCard.CardValue);
        
        if(accountBalance >= 0)
            cc.BalanceController.getInstance().updateBalance(accountBalance);
        /*
        this.Handle_Enable_ClickStatus(clickResult);
        this.Set_Updown_Price(upPrice,downPrice,award);
        this.Set_AceStore(aceStore);
        */
        this.lastClickRule = clickRule;
    },

    HandleResponse_PlayGame(response)
    {
        this.lastResponse = response;
        let sessionID = response[0];      
        let AceDes = response[3];
        let playDes = response[4];
        let resultCard = response[5];
        let clickRule  = response[6];
        let award   = response[7];
        let winUp  = response[8];
        let winDown = response[9];
        let jackpotValue = response[10];
        this.sessionID = sessionID;
        this.Handle_ShowResult(resultCard.CardValue);
       
        this.lastClickRule = clickRule;
    },
    HandleResponse_AnNon(response)
    {
        let sessionID = response[0];
        let roomBet = response[1];
        let award = response[2];
        let accountBalance = response[3];
        this.resetAllObject();

        this.ShowEffect_WinMoney(award);
        if(accountBalance >= 0)
            cc.BalanceController.getInstance().updateBalance(accountBalance);
    },
    HandleResponse_TakeJackpot(response)
    {
        let sessionID = response[0];
        let roomBet = response[1];
        let jackpotAward = response[2];
        let accountBalance = response[3];
        let jackpotValue =  response[4];
        if(accountBalance >= 0)
            cc.BalanceController.getInstance().updateBalance(accountBalance);
        this.ShowEffect_Jackpot(jackpotValue);
        this.ShowEffect_WonJackpot(jackpotAward);
    },

    Handle_AfterShowResult()
    {
        let response =  this.lastResponse;
       
        let SelectType = response[2];
        let AceDes = response[3];
        let playDes = response[4];
        let resultCard = response[5];
        let clickRule  = response[6];
        let award   = response[7];
        let winUp  = response[8];
        let winDown = response[9];
        let jackpotValue = response[10];
        this.Handle_Enable_ClickStatus(clickRule);
        this.Set_Updown_Price(winUp,winDown,award);
        this.Set_AceStore(AceDes);
        this.historyCollection.show(playDes);
        this.ShowEffect_Jackpot(jackpotValue);
      
        if(clickRule.statusWin == cc.CaoThap_ResultType.THUA)
        {
            let self = this;
            this.scheduleOnce(()=>{
                self.resetAllObject();
            },2);
        }
    },

    //#endregion

    Handle_ShowResult(cardValue = 0)
    {
        this.card_Result.node.active = false;
        this.effect_Card_Animation.node.active = true;
        this.Enable_UpDown_Collection(false);
        for(let i = 0;i < this.effect_Card_Array.length;i++)
        {
            this.effect_Card_Array[i].spriteFrame = this.cardHandle.Get_Random_Blur();
        }
      
        let self = this;
        let callBack = ()=>{
            self.effect_Card_Animation.off("finished" , callBack);
            self.card_Result.node.active = true;
            self.card_Result.spriteFrame = self.cardHandle.Get_SpiteByID(cardValue);
            self.effect_Card_Animation.node.active = false;
            self.Enable_UpDown_Collection(true);
            self.Handle_AfterShowResult();
           }
           this.effect_Card_Animation.on("finished" ,callBack );
           this.effect_Card_Animation.play("SelectCard");
    },

   
    Enable_UpDown_Collection(enable)
    {
        this.btn_Up.interactable = enable;
        this.btn_Down.interactable = enable;
        if(!enable)
        {
            this.btn_Up_Sprite.spriteFrame = this.up_SpriteFrame[0];
            this.btn_Down_Sprite.spriteFrame = this.down_SpriteFrame[0];
        }
        else
        {
            this.btn_Up_Sprite.spriteFrame = this.up_SpriteFrame[1];
            this.btn_Down_Sprite.spriteFrame = this.down_SpriteFrame[1];
        }

    },
    Enable_UpBtn(enable)
    {
        this.btn_Up.interactable = enable;
        if(!enable)
        {
            this.btn_Up_Sprite.spriteFrame = this.up_SpriteFrame[0];
        }
        else
        {
            this.btn_Up_Sprite.spriteFrame = this.up_SpriteFrame[1];
        }
    },
    Enable_DownBtn(enable)
    {
        this.btn_Down.interactable = enable;
        if(!enable)
        {
            this.btn_Down_Sprite.spriteFrame = this.down_SpriteFrame[0];
        }
        else
        {
            this.btn_Down_Sprite.spriteFrame = this.down_SpriteFrame[1];
        }
    },
    Enable_LuotMoi_Btn(enable)
    {
        this.LuotMoi_Btn.interactable = enable;
        if(enable)
        {
            this.LuotMoi_Sprite.spriteFrame = this.LuotMoi_SpriteFrame[1];
        }
        else
        {
            this.LuotMoi_Sprite.spriteFrame = this.LuotMoi_SpriteFrame[0];
        }
    },

   

    Set_RoomBetToggle(roomBet)
    {
        this.Reset_RoomBetToggle();
        let index = 0;
        for(let i=0;i< this.betRoom_Array.length;i++)
        {
            if(this.betRoom_Array[i] == roomBet)
            {
                index = i;
                break;
            }
        }
        this.room_Toggle_Array[index].isChecked = true;
    },

    Reset_RoomBetToggle()
    {
        for(let i=0;i< this.room_Toggle_Array.length;i++)
        {
            this.room_Toggle_Array[i].isChecked = false;
        }
    },

   
    Handle_Enable_ClickStatus(clickStatus)
    {
        let isAnNon = clickStatus.isAnNon;
        let down = clickStatus.down;
        let up = clickStatus.up;
        let statusWin = clickStatus.statusWin;
        
        this.Enable_LuotMoi_Btn(isAnNon);
        this.Enable_UpBtn(up);
        this.Enable_DownBtn(down);
        this.isFinished = (statusWin == cc.CaoThap_ResultType.THUA);

        if(statusWin == cc.CaoThap_ResultType.THUA)
        {
            this.Enable_LuotMoi_Btn(false);
            this.Enable_UpBtn(false);
            this.Enable_DownBtn(false);
        }
    },
    Set_Updown_Price(upPrice,downPrice,award)
    {
        this.High_Price_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(upPrice);
        this.Low_Price_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(downPrice);
        this.Mid_Price_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(award);
        this.High_Price_Node.active = true;
        this.Low_Price_Node.active = true;
    },
    Set_AceStore(aceStore)
    {
       
        for(let i=0;i< this.Ace_Card_Array.length;i++)
        {
            this.Ace_Card_Array[i].node.active = false;
        }       
        if(aceStore == '')
            return; 
        let aceArray = aceStore.split(',');
        for(let i=0;i< aceArray.length;i++)
        {
            this.Ace_Card_Array[i].node.active = true;
        }
    },
    

    //#region  OnClick
    onClick_ChangeBet(e, data)
    {
        if(!this.isFinished)
        {
            this.gameController.showNotification("Không thể đổi mức cược khi ván chơi chưa kết thúc!");
            this.Set_RoomBetToggle(this.currentBet);
            return;
        }
            
        let roomBet = parseInt(data);
        this.currentBet = roomBet;
        this.Set_RoomBetToggle(roomBet);
       
    },
    onClick_StartGame()
    {
        this.isFinished = false;
        this.btn_StartGame.node.active = false;        
        this.Send_PlayNow();
    },
    onClick_Play_Up()
    {
        if(this.isFinished)
            return;
        if(this.lastClickRule != null && this.lastClickRule.up == false)
            return;
       this.Send_PlayGame(cc.CaoThap_SelectType.TREN);
       //this.Send_PlayGame(1);
    },
    onClick_Play_Down()
    {
        if(this.isFinished)
            return;
        if(this.lastClickRule != null && this.lastClickRule.down == false)
            return;
       this.Send_PlayGame(cc.CaoThap_SelectType.DUOI);
       //this.Send_PlayGame(0);
    },
    onClick_AnNon()
    {
        if(this.isFinished)
            return;
        if(this.lastClickRule != null && this.lastClickRule.isAnNon == false)
            return;
        this.Send_AnNon();
    },

    onClick_Close()
    {
        cc.log("Click Close Btn");
        this.gameController.Reset();
        //cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.CAO_THAP);
        this.node.destroy();
    },

    onClick_LuatChoi()
    {
        this.gameController.AssetManager.Create_LuatChoiPopup();
    },
    onClick_TopPlayer()
    {
        this.gameController.AssetManager.Create_TopPlayerPopup();
    },
    //#endregion

    //#region Effect
    ShowEffect_WinMoney(winMoney)
    {
        this.lbMoneyExchange.node.active = true;
        this.lbMoneyExchange.string = "+"+cc.Tool.getInstance().formatMoneyNumberWithColom(winMoney);
        var startPos = this.lbMoneyExchange.node.getPosition();
        this.lbMoneyExchange.node.setPosition(startPos.x,startPos.y - 30);
        let self = this;
        this.lbMoneyExchange.node.runAction(cc.sequence(cc.moveBy(.5, new cc.Vec2(0,30)).easing(cc.easeIn(1.5)), cc.moveBy(1, new cc.Vec2(0,20)).easing(cc.easeOut(1)), cc.delayTime(3), cc.fadeOut(1), cc.callFunc(function() {
            self.lbMoneyExchange.node.position = startPos,
            self.lbMoneyExchange.string = ""
            self.lbMoneyExchange.node.active = false;
        })))
    },

    ShowEffect_WonJackpot(jackpotAward)
    {
        this.lbWinJackpotValue.string = cc.Tool.getInstance().formatMoneyNumberWithColom(jackpotAward);
        this.lbWinJackpotValue.node.active = true;
        this.winJackpotNode.active = true;
        this.lbWinJackpotValue.node.stopAllActions(),
        this.winJackpotNode.stopAllActions();
        this.lbWinJackpotValue.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.3, 1.2), cc.scaleTo(.3, .9))));
        var self = this;
        this.winJackpotNode.runAction(cc.sequence(cc.delayTime(10), cc.callFunc(function() {
            self.closeWonJackpot()
        })));
       
    },
    closeWonJackpot() {
        this.lbWinJackpotValue.active = false,
        this.winJackpotNode.active = false,
        this.lbWinJackpotValue.node.stopAllActions(),
        this.winJackpotNode.stopAllActions();
    },

    ShowEffect_Jackpot(jackpotValue)
    {
        this.lbJackpotValue.tweenValueto(jackpotValue,3);
    }

    //#endregion

    // update (dt) {},
});
