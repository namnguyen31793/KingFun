
window.ApiController = {
    
    RequestGetConnectInfo(agentId,encryptedData, checksum, callback, errorCallBack){
        var link= cc.NetConfigNew.getInstance().CONFIG_GAME.BASE_SPIN_HUB_LINK+"v1/ProviderGame/GetInfoConnect?agentId="+agentId+"&encryptedData="+encryptedData+"&checksum="+checksum;
        console.log(link);
        this.BaseCallGet(link, callback, errorCallBack);
    },

    RequestLoginSpinHub(agentId, token, callback, errorCallBack){
        var link= cc.NetConfigNew.getInstance().CONFIG_GAME.BASE_LOGIN_LINK+"api/CustomerGame/GetInfoConnect?agentId="+agentId+"&token="+token;
        console.log(link);
        this.BaseCallGet(link, callback, errorCallBack);
    },
    
    RequestGetVersionBundle(callback, errorCallBack){
        var link=  cc.NetConfigNew.getInstance().CONFIG_GAME.BASE_LOGIN_LINK+"api/Config/GetVersionBundle";
        console.log(link);
        Global.BaseNetwork.requestGet(link, {}, (data)=>{
            cc.log("receive: "+data);
            callback(data);
        });
    },

    RequestGetFishConfig(callback, errorCallBack){
        var link= cc.NetConfigNew.getInstance().CONFIG_GAME.BASE_SPIN_HUB_LINK+"v1/ProviderConfig/GetConfigFishTxt";
        console.log(link);
        Global.BaseNetwork.requestGet(link, {}, (data)=>{
            cc.log("receive: "+data);
            callback(data);
        });
    },

    RequestGetGameConfig(callback, errorCallBack){
        var link= cc.NetConfigNew.getInstance().CONFIG_GAME.BASE_SPIN_HUB_LINK+"v1/ProviderConfig/GetGameConfigUrl";
        console.log(link);
        Global.BaseNetwork.requestGet(link, {}, (data)=>{
            cc.log("receive: "+data);
            callback(data);
        });
    },

    RequestGetJackpotLobby(roomID, gameType, callback, errorCallBack){
        var link= cc.NetConfigNew.getInstance().CONFIG_GAME.BASE_SPIN_HUB_LINK+"v1/ProviderStaticiscal/GetJackpotLobbyByRoom?agentId=0&encryptedData="+"&checksum=&roomId="+roomID+"&gameType="+gameType;
        this.BaseCallGet(link, callback, errorCallBack);
    },

    RequestGetHistoryJackpot(gameType, callback, errorCallBack){
        var link= cc.NetConfigNew.getInstance().CONFIG_GAME.BASE_SPIN_HUB_LINK+"v1/ProviderStaticiscal/GetHistoryJackpot?agentId=0&encryptedData=&checksum=&gameId="+gameType;
        this.BaseCallGet(link, callback, errorCallBack);
    },


    BaseCall(url, message, callback, callbackFail, isCache = true) {
        let current = this;
        // console.log(url+"    "+isCache);
        if(isCache) {
            this.cacheUrl = url;
            this.cacheMessage = message;
            this.cacheCallBackSuccess = callback;
            this.cacheCallBackFail = callbackFail;
        }
        Global.BaseNetwork.request(url, message, (data)=>{
            cc.log("receive:");
            let model = JSON.parse(data);
            // console.log(model);
            if (model.Status != 0) {
                if (model.Status == 86 || model.Status == 401 || model.Status == 16)
                {
                    cc.log("token in expired");
                    ApiController.RefreshToken((data) => {
                        Global.tokenInfo = data;
                        Global.Helper.SaveCookie();
                        current.ReCall();
                    });
                }
                else if(model.Status == 85) //login noi khac
                {
                    if (callbackFail != null)
                        callbackFail(model.Status, model.Messenger);
                    Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("LOGIN_OTHER"), ()=>{
                        Global.Helper.ReloadWeb();
                    });
                }
                else if(model.Status == 82) //sai data
                {
                    if (callbackFail != null)
                        callbackFail(model.Status, model.Messenger);
                    Global.LoginView.ClickButtonLogin();
                }
                else if(model.Status == 701) //block
                {
                    if (callbackFail != null)
                        callbackFail(model.Status, model.Messenger);
                    Global.UIManager.showCommandPopup(model.Messenger, ()=>{
                        cc.sys.localStorage.setItem(CONFIG.KEY_TOKEN , "");
                        Global.Helper.ReloadWeb();
                    });
                }
                else
                {
                    // Global.UIManager.hideMiniLoading();
                    Global.UIManager.showCommandPopup(model.Messenger, ()=>{
                        if(Global.tokenInfo == null) {
                            Global.LoginView.ClickButtonLogin();
                        }
                    });
                    if (callbackFail != null)
                        callbackFail(model.Status, model.Messenger);
                }
            }
            else {
                if(isCache) {
                    this.ClearCache();
                }
                callback(model.DataResponse);
            }
        });
    },

    ClearCache() {
        this.cacheUrl = "";
        this.cacheCallBackSuccess = null;
        this.cacheCallBackFail = null;
    },

    BaseCallGet(url, callback, callbackFail, isCache = true) {
        let current = this;
        if(isCache) {
            this.cacheUrl = url;
            this.cacheCallBackSuccess = callback;
            this.cacheCallBackFail = callbackFail;
        }
        cc.log("send:");
        Global.BaseNetwork.requestGet(url, {}, (data)=>{
            cc.log("receive:");
            let model = JSON.parse(data);
            cc.log(model);
            if(model.Status == null)
            {
                if(callback!= null)
                    callback(model);
            }
            if (model.Status != 0) {
                if (model.Status == 86 || model.Status == 401 || model.Status == 16)
                {
                    cc.log("token in expired");
                    ApiController.RefreshToken((data) => {
                        Global.tokenInfo = data;
                        Global.Helper.SaveCookie();
                        current.ReCallGet();
                    });
                }
                else if(model.Status == 85) //login noi khac
                {
                    if (callbackFail != null)
                        callbackFail(model.Status, model.Messenger);
                    Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("LOGIN_OTHER"), ()=>{
                        Global.Helper.ReloadWeb();
                    });
                }
                else if(model.Status == 82) //sai data
                {
                    if (callbackFail != null)
                        callbackFail(model.Status, model.Messenger);
                    Global.LoginView.ClickButtonLogin();
                }
                else if(model.Status == 701) //block
                {
                    if (callbackFail != null)
                        callbackFail(model.Status, model.Messenger);
                    Global.UIManager.showCommandPopup(model.Messenger, ()=>{
                        Global.Helper.ReloadWeb();
                    });
                }
                else
                {
                    // Global.UIManager.hideMiniLoading();
                    cc.log(model);
                    // Global.UIManager.showCommandPopup(model.Messenger, ()=>{
                    //     if(Global.tokenInfo == null) {
                    //         Global.LoginView.ClickButtonLogin();
                    //     }
                    // });
                    if (callbackFail != null)
                        callbackFail(model.Status, model.Messenger);
                }
            }
            else {
                if(isCache) {
                    this.ClearCache();
                }
                callback(model.DataResponse);
            }
        });
    },

    ReCallGet() {
        Global.Game.scheduleOnce(()=>{
            if(this.cacheUrl.length == 0) {
                window.location.href =  window.location.href.split('#')[0];
            } else {
                this.BaseCallGet(this.cacheUrl, this.cacheCallBackSuccess, this.cacheCallBackFail, false);
            }
        } , 1);
        
    },

    ReCall() {
        Global.Game.scheduleOnce(()=>{
            if(this.cacheUrl.length == 0) {
                window.location.href = window.location.href.split('#')[0];
            } else {
                this.BaseCall(this.cacheUrl, this.cacheMessage, this.cacheCallBackSuccess, this.cacheCallBackFail, false);
            }
        } , 1);
        
    },

    //#region  XocDiaLive 
    RequestGet_XocDiaLive_SoiCau(url, callback, errorCallBack){
        Global.BaseNetwork.requestGet_NoHeader(url, {}, (data)=>{
            callback(data);
        });
    },

    RequestGet_XocDiaLive_History(page,callback, errorCallBack){
        if(page <= 0)
        return;
        var url= cc.NetConfigNew.getInstance().CONFIG_GAME.XOCDIA_BASE_URL+"GetAccountHistory?page="+page+"&recordPerPage=10&access_token="+ encodeURIComponent(cc.ServerConnector.getInstance().getToken());
        this.BaseCallGet(url, callback, errorCallBack);  
    },

    RequestGet_XocDiaLive_SessionDetailHistory(sessionID,callback, errorCallBack){
        if(sessionID <= 0)
        return;
        var url= cc.NetConfigNew.getInstance().CONFIG_GAME.XOCDIA_BASE_URL+"GetAccountHistoryDetail?gameSessionID="+sessionID+"&access_token="+ encodeURIComponent(cc.ServerConnector.getInstance().getToken());
        this.BaseCallGet(url, callback, errorCallBack);  
    },

    //#endregion

     //#region  TaiXiuLive 
     RequestGet_TaiXiuLive_SoiCau(url, callback, errorCallBack){
        Global.BaseNetwork.requestGet_NoHeader(url, {}, (data)=>{
            cc.log("receive: "+data);
            callback(data);
        });
    },

    RequestGet_TaiXiuLive_History(page,callback, errorCallBack){
        if(page <= 0)
        return;
        var url= cc.NetConfigNew.getInstance().CONFIG_GAME.TAIXIU_BASE_URL+"GetAccountHistory?page="+page+"&recordPerPage=10&access_token="+ encodeURIComponent(cc.ServerConnector.getInstance().getToken());
        this.BaseCallGet(url, callback, errorCallBack);  
    },
    //#endregion

   
}