
var CaoThapGameController = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new CaoThapGameController();
                this.self.Setup();
            }
            return this.self;
        }
    },

    Setup()
    {
       
    },
    Reset()
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
    setPopupManager(popupManager)
    {
        this.PopupManager = popupManager;
    },
    showNotification(content)
    {
        this.PopupManager.showNotification(content);
    },
    Handle_ResponseData(response)
    {
        cc.log("Handle_ResponseData: ");
       
        if (response.M !== undefined && response.M.length > 0) {
            let res = response.M;
            res.map(m => {
                switch (m.M) {
                    case cc.MethodHubOnName.GET_ACCOUNT_INFO:
                        cc.log("GET_ACCOUNT_INFO");
                        cc.log(response);
                        this.GameView.GetAccountInfo(m.A);
                        break;
                    case cc.MethodHubOnName.PLAY_NOW:
                        cc.log("PLAY_NOW");
                        cc.log(response);
                        this.GameView.HandleResponse_PlayNow(m.A);
                        break;
                    case cc.MethodHubOnName.PLAY_GAME:
                        cc.log("PLAY_GAME");
                        cc.log(response);
                        this.GameView.HandleResponse_PlayGame(m.A);
                        break;
                    case cc.MethodHubOnName.AN_NON:
                        cc.log("AN_NON");
                        cc.log(response);
                        this.GameView.HandleResponse_AnNon(m.A);
                        break;
                    case cc.MethodHubOnName.TAKE_JACKPOT:
                        cc.log("TAKE_JACKPOT");
                        cc.log(response);
                        this.GameView.HandleResponse_TakeJackpot(m.A);
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
    Get_SessionID()
    {
        return this.GameView.sessionID;
    },
    
   


});
