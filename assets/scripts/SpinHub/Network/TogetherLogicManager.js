var OutGameLogicManager = require("OutGameLogicManager");
var InGameLogicManager = require("InGameLogicManager");
var ScreenManager = require("ScreenManager");
var TogetherLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new TogetherLogicManager();
            return this.self;
        }
    },

    TogetherHandleResponse(operationResponse) {
        var data = operationResponse;
        
        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        cc.log("lobby:"+responseCode);
        if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_LOGIN) {
            this.HandleLoginResponse(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            this.HandleConfirmResponse(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_UPDATE_PLAYER_BALANCE) {
            this.HandleUpdateBalance(operationResponse);
        }         
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_NORMAL_NOTIFICATION) {
            this.HandleNotify(packet);
        }    
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GUN_INFO) {
            this.HandleGunInfo(packet);
        }   
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_TAKE_REWARD) {
            this.HandleTakeReward(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_RECEIVED_REWARD) {
            this.HandleRecediveReward(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_GET_DETAIL_HISTORY) {
            this.HandleHistoryGameSlot(operationResponse);
        }        
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_MISSION_INFO_RESPONSE) {
            this.HandleGetMissionInfo(operationResponse);
        }       
        else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PING) {
            this.HandlePingTime(operationResponse);
        }     
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_DAILY_GET_LIST_REWARD_ACCOUNT){
            this.HandleEventMissionDailyGetListRewardAccount(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_DAILY_GET_TAKE_ACCOUNT_REWARD){
            this.HandleEventMissionDailyGetTakeAccountReward(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_MISSION_DAILY_GET_MISSION_CONFIG){
            this.HandleEventMissionDailyGetMissionConfig(packet);
        }

        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_GET_ACCOUNT_REWARD){
            this.HandleGetTournamentReward(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_EVENT_TOURNAMENT_TAKE_ACCOUNT_REWARD){
            this.HandleTakeTournamentReward(packet);
        }        
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_RETURN_REQUEST){
            this.HandleCheckReturnRequest(packet);
        }     
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_VIP_INFO){
            this.HandleGetVipInfo(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_SET_NICKNAME){
            this.HandleChangeDisplayName(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_GAME_CONFIG){
            this.HandleGetGameCOnfig(packet);
        }
        else if (responseCode == Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_TOP_SCORE){
            this.HandleGetTopScore(packet);
        }
    },

    HandleLoginResponse(packet) {
        let infoUser = JSON.parse(packet[1]);
        Global.RegisterDate = new Date(infoUser.RegisterDate);
       
        cc.BalanceController.getInstance().updateRealBalance(infoUser.IngameBalance);
        cc.BalanceController.getInstance().updateBalance(infoUser.IngameBalance);

        console.log(Global.GameId);
        if(Global.GameId != parseInt(cc.GameId.FISH_SPINHUB)){
            cc.LobbyController.getInstance().openSlotSpinHub(Global.GameId)
        }else{
            require("SyncTimeControl").getIns().SendPing();
            require("SendRequest").getIns().MST_Client_Get_Vip_Config_Info();
            require("SendRequest").getIns().MST_Client_Account_Bag_Get_Account_Info();
            if(Global.GameConfig == null || Global.GameConfig == undefined){
                //load fish config
                ApiController.RequestGetFishConfig((data) => {
                    // cc.log(data)
                    if(data == "null" || data == ""){
                        cc.log("load error");
                    }else{
                        Global.FishConfig = JSON.parse(data);
                    }
                }, this.ErrorCallBack);
                //load xong data thi connect
                ApiController.RequestGetGameConfig((data) => {
                    // cc.log(data)
                    let dataJson = JSON.parse(data);
                    Global.GameConfig = dataJson.DataResponse;

                    cc.LobbyController.getInstance().openSlotSpinHub(Global.GameId)
                }, this.ErrorCallBack);
            }else{
                cc.LobbyController.getInstance().openSlotSpinHub(Global.GameId)
            }
        }
    },



    HandleUpdateBalance(operationResponse) {
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY || ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.CITY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

    HandlePingTime(operationResponse) {
        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

 
    HandleConfirmResponse (packet) {
        cc.log(packet);
        // Global.UIManager.hideMiniLoading();
        let multiLanguageConfiges = packet[1];
        let confirmCode = packet[2];
        //Global.UIManager.ShowTogetherConfirmMessenge (multiLanguageConfiges, confirmCode);
        console.log(multiLanguageConfiges+" - "+confirmCode);
    },

    HandleGunInfo(packet) {
        cc.log(packet);
        let gunRoom1 = packet[1];
        let gunRoom2 = packet[2];
        let gunConfigByVip;
        let listGunByVip = [];

        let listGunModelRoom1 = [];
        for (let i = 0; i < gunRoom1.length; i++) {
            listGunModelRoom1[i] = JSON.parse(gunRoom1[i]);
        }
        let listGunModelRoom2 = [];
        for (let i = 0; i < gunRoom2.length; i++) {
            listGunModelRoom2[i] = JSON.parse(gunRoom2[i]);
        }
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MERCHANT == 3)
        {
            gunConfigByVip = packet[4];
            for (let i = 0; i < gunConfigByVip.length; i++) {
                listGunByVip[i] = JSON.parse(gunConfigByVip[i]);
            }
            Global.gunConfigByVip = listGunByVip;
        }
        Global.gunConfigModelRoom1 = listGunModelRoom1;
        Global.gunConfigModelRoom2 = listGunModelRoom2;
    },

    HandleRecediveReward(packet) {
        let rewardSpinString = packet[1];
        let listReward = [];
        for (let i = 0; i < rewardSpinString.length; i++) {
            listReward [i] = JSON.parse (rewardSpinString[i]);
        }
        Global.listReward[Global.listReward.length] = listReward;
        let content = packet[2];
        let accountBalance = packet[3];
        cc.BalanceController.getInstance().updateBalance(accountBalance)
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            Global.LobbyView.UpdateInfoView ();
        }
        Global.UIManager.showRewardPopup (Global.Enum.STATUS_GIFT_POPUP.REWARD, content);
    },


    HandleTakeReward(packet) {
        let content = packet[1];
        let rewardBalance = packet[2];
        let rewardSpin = packet[3];
        let currentAccountBalance = packet[4];
        let currentSpin = packet[5];

        Global.currentSpin = currentSpin;
        Global.MainPlayerInfo.SetupMoney (currentAccountBalance);
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            Global.LobbyView.UpdateInfoView ();
        }
        Global.UIManager.showServerRewardPopup (content, rewardSpin, rewardBalance);
    },


    //notify
    HandleNotify(packet) {
        let content = packet[1];
        let speed = packet[2];
        let repeat = packet[3];
        let type = packet[4];
        if(type == 5) {
            if(Global.NotifyVertically) {
                Global.NotifyVertically.AddNotify(content);
            }
        }
        
    },

  

    

    //top
    HandleGetTopPlayerWorld(packet) {
        let data = [];
        for(let i = 0; i < packet[1].length; i++) {
            data[i] = JSON.parse(packet[1][i]);
        }
        
        if(Global.RankPopup) {
            Global.RankPopup.GetTopPlayerWorld(data);
        }
        
    },

    HandleGetTopPlayerGame(packet) {
        cc.log(packet);
        let gameType = packet[1];
        let data = [];
        for(let i = 0; i < packet[2].length; i++) {
            data[i] = JSON.parse(packet[2][i]);
        }
        if(Global.RankPopup) {
            Global.RankPopup.GetTopPlayerGame(gameType, data);
        }
        
    },

    //tournament
    HandleGetTournamentReward(packet) {
        cc.log(packet);
        let tournamentId = packet[1];
        let rankId = packet[2];
        let reward = packet[3];
        Global.UIManager.showRewardTournamentPopup(tournamentId, rankId, reward, 20);
    },

    HandleTakeTournamentReward(packet) {
        let accountBalance = packet[1];
        Global.RewardTourPopup.ShowEffect(accountBalance);
    },

   
   
    //check
    HandleCheckReturnRequest(packet) {
        cc.log("check return request");
        cc.log(packet);
        let code = packet[1];
        if(code == Global.Enum.REQUEST_CODE.MSG_CLIENT_CHECK_LOGIN_REWARD || code == Global.Enum.REQUEST_CODE.MSG_CLIENT_EVENT_MISSION_MISSION_GET_CONFIG) {
            Global.LobbyView.showStartGame.Action();
        }
    },
   

   

    //vip
    HandleGetVipInfo(packet) {
        let currentVipId = packet[1];
        let currentVipPoint = packet[2];
        Global.MainPlayerInfo.vip = currentVipId;
        cc.log("vip:"+currentVipId);
        Global.LobbyView.txtVip.string = "VIP" + currentVipId;
        Global.DownloadManager.LoadAssest("Image",cc.SpriteFrame,"Vip/Vip"+currentVipId, (pre)=>{
            if(Global.LobbyView.iconVip != null&& Global.LobbyView.iconVip.materials != null)
                Global.LobbyView.iconVip.spriteFrame = pre;
        });
        if(Global.ProfilePopup) {
            Global.ProfilePopup.SetInfoProfile();
        }
    },

    //nickname
    HandleChangeDisplayName(packet) {
        cc.log("------------------");
        cc.log(packet);
        let defaultDisplayName = packet[1];
        let messageError = packet[2];
        let isResult = packet[3];
        if(Global.SetNamePopup) {
            Global.SetNamePopup.GetResult(defaultDisplayName, messageError, isResult);
        }
    },
    HandleGetGameCOnfig(packet) {
        cc.log("------------------HandleGetGameCOnfig");
        cc.log(packet);
        let gameConfigList = packet[1];
        let listgameConfigList = [];
        for (let i = 0; i < gameConfigList.length; i++) {
            listgameConfigList[i] = JSON.parse(gameConfigList[i]);
        }

        let data = {
            GameId : Global.GameId,
            RoomMultiInfo : JSON.stringify(listgameConfigList),
        }
        Global.SlotRoomMuitlConfig = [];
        Global.SlotRoomMuitlConfig[0] = data;

    },

    HandleGetTopScore(packet) {
        cc.log("HandleGetTopScore: "+packet);
        cc.log(packet);
        let listDataString = packet[1];
        let listData = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] =  JSON.parse(listDataString[i]);
        }
        if(Global.LobbyView != null && Global.LobbyView.node.active == true)
            Global.LobbyView.SetInfoTopScore (listData);
        if(Global.InGameView != null && Global.InGameView.node.active == true)
            Global.InGameView.SetInfoTopScore (listData);
    },
});
module.exports = TogetherLogicManager;