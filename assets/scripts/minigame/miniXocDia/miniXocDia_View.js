// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        isNan_Sprite : cc.Sprite,
        isNan_FrameSprite : [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetXocDiaView(this);
       
        this.node.zIndex = cc.Config.getInstance().getZINDEX();

        var miniBauCuaNegotiateCommand = new cc.MiniBauCuaNegotiateCommand;
        miniBauCuaNegotiateCommand.execute(this);

        this.lastTimeReconnect = (new Date()).getTime();
        this.Show_NanStatusSprite();
    },

    start () {

    },

  

    onMiniBauCuaNegotiateResponse(response) {
        cc.log("onMiniBauCuaNegotiateResponse");
        this.connectionToken = response.ConnectionToken;
        this.miniBauCuaHub = new cc.Hub;
        this.miniBauCuaHub.connect(this, cc.HubName.MiniBauCuaHub, response.ConnectionToken);
    },

    onDestroy: function () {
        this.sendRequestOnHub(cc.MethodHubName.EXIT_LOBBY);
        if (this.miniBauCuaHub)
            this.miniBauCuaHub.disconnect();
        this.unscheduleAllCallbacks();       
    },

    reconnect: function () {
        // console.log('miniPokerHub reconnect');
        this.lastTimeReconnect = (new Date()).getTime();
        this.miniBauCuaHub.connect(this, cc.SubdomainName.MiniBauCuaHub, this.connectionToken, true);
    },

    onHubOpen: function () {   
         this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);        
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

    sendRequestOnHub: function (method, data1, data2) {
        
        switch (method) {
            case cc.MethodHubName.ENTER_LOBBY:
                this.miniBauCuaHub.enterLobby();
                break;
            case cc.MethodHubName.EXIT_LOBBY:
                this.miniBauCuaHub.exitLobby();
                break;
            case cc.MethodHubName.BET:
                this.miniBauCuaHub.bet(data1, data2);//betValue, betSide
                break;
            case cc.MethodHubName.PLAY_NOW:
                this.miniBauCuaHub.playNow();
                break;
            case cc.MethodHubName.SEND_MESSAGE:
                this.miniBauCuaHub.sendRoomMessage(data1);
                break;
        }
    },

    onHubMessage: function (response) {
        if (response.M !== undefined && response.M.length > 0) {
            let res = response.M;
            res.map(m => {
                switch (m.M) {
                    //Thoat game
                    case cc.MethodHubOnName.PLAYER_LEAVE:
                        this.playerLeave(m.A);
                        break;
                    //Thong tin game
                    case cc.MethodHubOnName.SESSION_INFO:
                        let info = m.A[0];
                        this.gameController.onNotifyChangePhrase(info);
                        //Cap nhat tong tien bet
                        this.gameController.updateTotalBet(info);
                        break;
                    //Thong tin game
                    case cc.MethodHubOnName.NOTIFY_CHANGE_PHRASE:
                        this.gameController.onNotifyChangePhrase(m.A[0]);
                        break;
                    case cc.MethodHubOnName.UPDATE_ROOM_TIME:
                        this.gameController.updateRoomTimer(parseInt(m.A[0]));
                        break;
                    //Danh sach nguoi choi                    
                    case cc.MethodHubOnName.SUMMARY_PLAYER:
                        break;
                        /*
                        console.log("SUMMARY_PLAYER", m.A);
                        this.gameController.updatePlayersInGame(m.A[0]);
                        break;
                        */
                    //Thong tin game
                    case cc.MethodHubOnName.JOIN_GAME:
                       //  this.controller.updatePlayerInfor(m.A[0]);
                         this.gameController.onNotifyChangePhrase(m.A[1]);
                          //Cap nhat tong tien bet cua user
                        if (m.A[3].length > 0) {
                            m.A[3].map(betData => {
                                this.gameController.updateTotalMyBetSide(betData.BetSide, betData.SummaryBet);
                            }, this);
                        }
                        /*
                        this.controller.updatePlayerInfor(m.A[0]);
                        this.controller.onNotifyChangePhrase(m.A[1]);
                        //Cap nhat tong tien bet cua user
                        if (m.A[3].length > 0) {
                            m.A[3].map(betData => {
                                this.controller.updateTotalUserBetSide(betData.BetSide, betData.SummaryBet);
                            }, this);
                        }
                        //Cap nhat chip cua phien
                        this.controller.updateChipForBetSession(m.A[4]);
                        */
                        break;
                    //Cap nhat danh sach player
                    case cc.MethodHubOnName.VIP_PLAYERS:
                        break;
                        // console.log("VIP_PLAYERS", m.A);
                        let dataPlayer = m.A[0];
                        if (dataPlayer.length > 0) {
                            this.controller.updatePlayersUI(dataPlayer);
                        }

                        break;
                    //Lich su bet
                    case cc.MethodHubOnName.GAME_HISTORY:
                        // console.log("GAME_HISTORY", m.A);
                        break;
                    //Thong tin bet cua player
                    case cc.MethodHubOnName.BET_OF_ACCOUNT:
                        cc.log("BET_OF_ACCOUNT: "+m.A);
                        this.gameController.updateBetOfAccount(m.A[0]);
                        break;
                    //Bet thanh cong
                    case cc.MethodHubOnName.BET_SUCCESS:
                        cc.log("BET_SUCCESS: "+m.A);
                        cc.BalanceController.getInstance().updateBalance(m.A[1]);
                        this.gameController.updateTotalMyBetSide(m.A[0].BetSide, m.A[0].SummaryBet);
                        this.gameController.MoveChipBet(m.A[0].BetValue, m.A[0].BetSide);
                        //Push betValue vao betLog
                        /*
                        let sessionID = this.gameController.getBetLogSession();

                        this.gameController.setBetLog({
                            sessionID: sessionID,
                            value: m.A[0].BetValue,
                            betSide: m.A[0].BetSide
                        });
                        //Cap nhat balance
                        this.controller.updateBalanceCurrPlayer(m.A[1]);
                        

                        this.controller.updateTotalUserBetSide(m.A[0].BetSide, m.A[0].SummaryBet);
                        this.controller.moveChipBet(m.A[0].BetValue, m.A[0].BetSide, cc.BacaratChipOf.PLAYER, m.A[0].AccountID);
                        */
                        break;
                    //Nguoi choi bet
                    case cc.MethodHubOnName.PLAYER_BET:
                        if (m.A[0] != cc.LoginController.getInstance().getUserId()) {
                          
                            /*
                            //Update chip player
                            this.controller.updateBalancePlayer(m.A);
                            //Move Chip
                            this.controller.moveChipBet(m.A[1], m.A[2], cc.BacaratChipOf.USERS, m.A[0]);
                            */
                        }
                        break;

                    //Ket qua
                    case cc.MethodHubOnName.WIN_RESULT:
                        // console.log("WIN_RESULT", m.A);
                        //KO hien thi luon khi co winResult
                        //this.controller.setWinResult(m.A[0]);
                        if(!this.gameController.GetNanStatus())
                        {
                            this.gameController.HandleWinResult(m.A[0]);
                            cc.BalanceController.getInstance().updateBalance(m.A[0].Balance);
                        }
                        else
                        {
                            let self = this;
                            this.scheduleOnce(()=>{
                                self.gameController.HandleWinResult(m.A[0]);
                                cc.BalanceController.getInstance().updateBalance(m.A[0].Balance);
                                self.gameController.Enable_Bowl(false);
                            },4)
                        }
                        
                        break;
                    case cc.MethodHubOnName.WIN_RESULT_VIP:
                        return;
                        // console.log("WIN_RESULT_VIP", m.A);
                        if (m.A.length > 0) {
                            this.controller.setWinVipResult(m.A[0]);
                        }
                        break;
                    case cc.MethodHubOnName.TOTAL_WIN_MONEY:
                        //console.log("TOTAL_WIN_MONEY", m.A);
                        //this.controller.setTotalWinResult(parseInt(m.A[0]));
                        break;
                    //thong bao khi dat cuoc
                    case cc.MethodHubOnName.PLAYER_MESSAGE:
                        cc.PopupController.getInstance().showMessage(m.A[0]);
                        break;
                    //thong bao
                    case cc.MethodHubOnName.MESSAGE:
                        if (!cc.game.isPaused())
                            cc.PopupController.getInstance().showMessage(m.A[0]);
                        break;
                    //nhan message chat
                    case cc.MethodHubOnName.RECEIVE_MESSAGE:
                        cc.ChatRoomController.getInstance().addChatContent(m.A);
                        this.controller.playerShowBubbleChat(m.A);
                        break;
                    case cc.MethodHubOnName.PLAYER_TAKE_JACKPOT:
                        cc.log("PLAYER_TAKE_JACKPOT: "+m.A);
                        this.gameController.PlayerTakeJackpot(m.A);

                        break;
                    case cc.MethodHubOnName.JACKPOT_ALERT:
                        cc.log("JACKPOT_ALERT: "+m.A);
                        this.gameController.ShowJackpotAlert(m.A);
                        break;

                }
            });

        } else if (response.R && response.R.AccountID) {
            this.currAccId = response.R.AccountID;
            this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
            //sau khi enterLobby
            cc.PopupController.getInstance().hideBusy();

        } else {
            //PING PONG
            if (response.I) {
                this.miniBauCuaHub.pingPongResponse(response.I);
            }
        }
    },

    onClick_HelpPopup()
    {
        this.gameController.EnableHelpPopup(true);
    },

    onClick_RankPopup()
    {
        this.gameController.GetAssetManager().CreateRankPopup();
    },
    onClick_SoiCauPopup()
    {
        this.gameController.GetAssetManager().Create_SoiCauPopup();
    },

    onClick_JackpotHistoryPopup()
    {
        this.gameController.GetAssetManager().Create_JackpotHistoryPopup();
    },

    onClick_PlayerHistoryPopup()
    {
        this.gameController.GetAssetManager().Create_playerHistoryPopup();
    },

    onClick_IsNan()
    {
        let currentNanStatus = this.gameController.GetNanStatus();
        currentNanStatus = !currentNanStatus;
        this.gameController.SetNanStatus(currentNanStatus);
        this.Show_NanStatusSprite();
        //if(currentNanStatus)
    },
    onClick_Close()
    {
        cc.log("onClick_Close");
        cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.MINI_BAUCUA);
    },
    Show_NanStatusSprite()
    {
        let currentNanStatus = this.gameController.GetNanStatus();
        if(currentNanStatus)
        {
            this.isNan_Sprite.spriteFrame = this.isNan_FrameSprite[0];
        }
        else
        {
            this.isNan_Sprite.spriteFrame = this.isNan_FrameSprite[1];
        }
    },
    


    // update (dt) {},
});
