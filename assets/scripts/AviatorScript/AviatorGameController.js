
var AviatorGameController = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new AviatorGameController();
                this.self.Setup();
            }
            return this.self;
        }
    },

    Setup()
    {
       
    },

    SetGameView(gameView)
    {
        this.GameView = gameView;
    },
    SetAssetManager(assetManager)
    {
        this.AssetManager = assetManager;
    },
    setAudioPool(audioPool)
    {
        this.audioPool = audioPool;
    },
    SetAviatorGameInfo(gameInfo)
    {
        this.GameInfo = gameInfo;
    },

    GetSessionID()
    {
        return this.GameInfo.getSessionID();
    },

    GetGamePhase()
    {
        return this.GameView.GetGameState();
    },
    SetGamePhase(gamePhase)
    {
        this.GameView.SetGameState(gamePhase);
    },

    Handle_ResponseData(response)
    {
        if (response.M !== undefined && response.M.length > 0) {
            let res = response.M;
            res.map(m => {
                switch (m.M) {
                    case cc.MethodHubOnName.UPDATE_CASHOUT:                                    
                        this.GameView.updateCashOutResponse(m.A);
                        break;
                    case cc.MethodHubOnName.SUBSCRIBLE:   
                        cc.log("SUBSCRIBLE");
                        cc.log(m.A);
                        let gamePhase = m.A[4];
                        this.SetGamePhase(gamePhase);
                        this.GameInfo.onUpdateInfo(m.A);
                        this.GameView.Handle_Subcriber(m.A);
                        break;
                    case cc.MethodHubOnName.END_GAME:
                        this.SetGamePhase(cc.AviatorPhase.END_GAME);
                        cc.log("END_GAME");
                        cc.log(m.A);
                        this.Handle_EndGame(m.A);
                        break;
                    case cc.MethodHubOnName.START_BETTING:
                        this.SetGamePhase(cc.AviatorPhase.BETTING);
                        cc.log("START_BETTING");
                        cc.log(m.A);
                        this.Handle_StartBetting(m.A);
                        break;
                    case cc.MethodHubOnName.START_CASHOUT: 
                        this.SetGamePhase(cc.AviatorPhase.CASHOUTED);
                        cc.log("START_CASHOUT");
                        cc.log(m.A);
                        this.Handle_StartCashout(m.A);
                        break;
                    case cc.MethodHubOnName.BETTING: 
                        cc.log("BETTING");
                        cc.log(m.A);
                        this.Handle_BettingResponse(m.A)
                        break;
                    case cc.MethodHubOnName.CASHOUT:
                        cc.log("CASHOUT");
                        cc.log(m.A);
                        this.Handle_CashoutResponse(m.A)
                        break;
                    case cc.MethodHubOnName.UPDATE_BETTING:
                        cc.log("UPDATE_BETTING");
                        cc.log(m.A);
                        this.Handle_UpdateBettingResponse(m.A)
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
                this.crashGameHub.pingPongResponse(response.I);
            }
        }
    },

    Handle_EndGame(responseData)
    {
        this.GameView.Handle_EndGame(responseData);
    },
    Handle_StartBetting(responseData)
    {
        let sessionID = responseData[0];
        this.GameInfo.setSessionID(sessionID);
        this.GameView.Handle_StartBetting(responseData);
    },
    Handle_StartCashout(responseData)
    {
        this.GameView.startGame();
    },
    Handle_SetBetValue(betValue)
    {
        this.currentBet = betValue;
    },
    Handle_GetBetValue()
    {
        return  this.currentBet;
    },
    Handle_BettingResponse(data)
    {
        this.GameView.Handle_BettingResponse(data);
    },
    Handle_CashoutResponse(data)
    {
        this.GameView.Handle_CashoutResponse(data);
        
    },
    Handle_UpdateBettingResponse(data)
    {
        this.GameView.Handle_UpdateBettingResponse(data);
    }





});
