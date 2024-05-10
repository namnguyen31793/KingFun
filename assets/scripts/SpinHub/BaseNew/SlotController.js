/**
 * Created on 25/10/2023.
 * khi khởi tạo ở InfullGame, add refrence vào lắng nghe server theo gameId
 * khi destroy xóa lăng nghe
 */
cc.Class({
    "extends": cc.Component,
    ctor(){
        this.gameId = 0;
        this.balance = 0;
        this.toDoList = null;
        this.tryPlay = false;
        this.storeCurrentScripts = "";
    },
    properties: {
        slotUI: require('SlotUI'),
        slotMenu: require('SlotMenu'),
        slotEffect: require('SlotEffect'),
        slotSound: require('SlotSound'),
        tutorial: require('TutorialManager2'),
    },

    onLoad: function () {
        require("SlotNetworkManager").getIns().Set_NetworkInstance(cc.RoomController.getInstance().getGameId(), this);
        //bien check active button room chua
        this.isActiveButtonRoom = false;
        this.toDoList = this.node.addComponent("ToDoList");
        
        cc.BalanceController.getInstance().addBalanceView(this);
        cc.BalanceController.getInstance().setBalanceTryView(this);
        //add lang nghe vi tien
        // require("WalletController").getIns().init(true);
        // require("WalletController").getIns().AddListener(this);

        //Init cac thanh phan
        if(this.slotUI)
            this.slotUI.Init(this);
        if(this.slotMenu)
            this.slotMenu.Init(this);
        if(this.slotEffect)
            this.slotEffect.Init(this);
        if(this.slotSound)
            this.slotSound.Init();
        if(this.tutorial)
            this.tutorial.setMainController(this);
        //get config room vaf lenh open game
        let msg = {};
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.GET_ROOM_INFO, msg);
        
        this.Init();
    },

    onDestroy: function () {
        cc.BalanceController.getInstance().removeBalanceView(this);
        cc.BalanceController.getInstance().setBalanceTryView(null);
    },

    updateBalance: function (balance) {
        this.balance = balance;
        this.OnUpdateMoney(balance);
    },
    
    updateTryBalance: function (balance) {
        this.balance = balance;
        this.OnUpdateMoney(balance);
    },

    subTryBalance: function (amount) {
        this.balance -= amount;
        this.OnUpdateMoney(this.balance);
    },

    refreshBalance: function () {
        this.lbiBalance.tweenValueto(this.balance);
        this.OnUpdateMoney(balance);
    },

    ChangeStateMusic(state) {
        this.slotSound.ChangeStateMusic(state);
    },

    ChangeStateSound(state) {
        this.slotSound.ChangeStateSound(state);
    },

    //#region turorial
    setTutorialView(tutorialView){
        
    },

    onClick_TryPlay()
    {
       //this.slotSound.playSwitchChoiThuBtn();

        this.tryPlay = !this.tryPlay;
        if(this.tryPlay)
        {
          this.onClick_SwitchToTrialMode();
        }
        else
        {
            this.tutorial.node.active = true;
            this.resetRoomInfo();
        }
    },
    
    resetRoomInfo(){
        this.SelectRoom(1);
        this.tutorial.reset();
        this.tutorial.node.active = false;
    },

    onClick_SwitchToTrialMode()
    {
        this.slotMenu.ResetMenuTutorial();
        this.SetAccountInfoTry();
        this.SetJackpotValueTry(this.tutorial.JackpotValueConfig);
        this.tutorial.node.active = true;
        this.tutorial.startTutorial();
    },

    SetAccountInfoTry(){
        //ke thua o cac slot control
    },

    SetJackpotValueTry(model){
        //ke thua o cac slot control
    },

    resetRoomInfo(){
        //ke thua reset khi thoat tutorial
    },

    onIngameEvent: function(trigger) {
        if(this.tryPlay && this.tutorial)
            this.tutorial.trigger(trigger)
    },

    chooseSymbolExtraBet: function() {
        this.onIngameEvent("SELECT_SYMBOL");
    },

    isPauseTutorialFlag: function(t) {
        if(this.tryPlay && this.tutorial)
            return this.tutorial.isContainFlag(t);
        return false;
    },
    checkPauseTutorial: function(t) {
        return this.isPauseTutorialFlag(t) && this.tryPlay
    },

    activeBetBtn: function(t) {
        if(this.tryPlay && this.tutorial)
            this.slotMenu.activeBetBtn(t);
    },

    runContinueScript: function() {
        if(!this.storeNextScripts)
        return;

        var t = this.storeNextScripts
          , e = t.data
          , o = t.object
          , i = t.script;

          if(this.storeCurrentScripts)
          {
            if(t)
            {
                if(o === null && o === undefined)
                    this.storeCurrentScripts(t.data);
                else 
                {
                    const { script, object } = this.storeNextScripts;
                    if (script && object) {
                        script.call(object, e);
                    }
                }  
            }
            else
            {
                if(o === null && o === undefined)
                    this.storeCurrentScripts();
                else 
                {
                        const { script, object } = this.storeNextScripts;
                        if (script && object) {
                            script.call(object, e);
                        }
                }
            }

          }

    
        this._resetStoreScript()
    },
    _resetStoreScript: function() {
        this.storeCurrentScripts = "",
        this.storeNextScripts = {
            script: [],
            data: {}
        }
    },
    //#endregion

    //callserver bao open game và lấy thông tin cược lần trước
    CallRequestGetInfo() {
        //Global.UIManager.showMiniLoading();
        let msg = {};
        msg[1] = this.getRoomId();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.GET_ACCOUNT_INFO, msg);
    },

    //job call get jackpot
    CallRequestGetJackpotInfo() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.unscheduleAllCallbacks();
        this.sendRequestOnHub(cc.MethodHubName.GET_JACKPOT, msg);
        this.schedule(() => {
            this.sendRequestOnHub(cc.MethodHubName.GET_JACKPOT, msg);
        }, 15);
    },

    //callserver bao open game và lấy thông tin cược lần trước
    CallRequestBuyFree() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[2] = this.getLineData ();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.BUY_FREE, msg);
    },
    
    CallRequestSpin() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[2] = this.getLineData ();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.SPIN, msg);
    },
    
    CallRequestSpinTry() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[2] = this.getLineData ();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.SPIN_TRY, msg);
    },
    
    CallSelectRooomFree(freespinType) {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[2] = freespinType;
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.SELECT_INPUT_FREE, msg);
    },

    CallLeaveGame() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.LEAVE, msg);
    },

    sendRequestOnHub: function (method, data) {
        cc.log("sendRequestOnHub "+method);
        cc.log(data);
        switch (method) {
            case cc.MethodHubName.GET_ROOM_INFO:
                //fake join same tay du
                require("SendRequest").getIns().MST_Client_Slot_Get_Room_Config(data);
                break;
            case cc.MethodHubName.SPIN:
                require("SendRequest").getIns().MST_Client_Slot_Spin(data);
                break;
            case cc.MethodHubName.SPIN_TRY:
                require("SendRequest").getIns().MST_Client_Slot_Spin_Try(data);
                break;
            case cc.MethodHubName.BUY_FREE:
                require("SendRequest").getIns().MST_Client_Slot_Buy_Free(data);
                break;
            case cc.MethodHubName.GET_ACCOUNT_INFO:
                //send get accountInfo
                require("SendRequest").getIns().MST_Client_Slot_Open_Game(data);
                require("SendRequest").getIns().MST_Client_Slot_Get_Account_Info(data);
                break;
            case cc.MethodHubName.GET_JACKPOT:
                require("SendRequest").getIns().MST_Client_Slot_Get_Jackpot_Info(data);
                break;
            case cc.MethodHubName.LEAVE:
                require("SendRequest").getIns().MST_Client_Slot_Leave_Room(data);
                break;
            case cc.MethodHubName.SELECT_INPUT_FREE:
                require("SendRequest").getIns().MST_Client_Slot_Select_Type_Free(data);
                break;
        }
    },

    //khai báo lắng nghe phản hồi từ server
    ResponseServer(code, packet){

    },

    //lắng nghe call dổi room hoặc mới vào game
    SelectRoom(roomId) {
      
        this.setRoomId(roomId);
        if (roomId == 0) {
            //this.sendRequestOnHub(cc.MethodHubName.JOIN_TRY);
        } else {
            this.setRoomId(roomId);
            this.CallRequestGetJackpotInfo();
            this.CallRequestGetInfo();
        }
    },

    LeaveRoom(){
        this.unscheduleAllCallbacks();
    },

    //lang nghe wallet thay đổi số dư
    OnUpdateMoney(gold) {
        //this.menuView.UpdateMoney(gold);
    },
    
    setRoomId (roomId) {
        return this.roomId = roomId;
    },
    //set khi load game trong infullgame
    setGameId (gameId) {
      
        this.gameId = gameId;
        // Global.MainPlayerInfo.SetCurrentGameID(this.gameId);
        return this.gameId;
    },

    setLineData (lineData) {
        return this.linedata = lineData;
    },

    getRoomId () {
        return this.roomId;
    },

    getGameId () {
        return this.gameId;
    },

    getLineData () {
        return this.linedata;
    },

    OffSound(){
        this.slotSound.StopAll();
    },

    onDestroy() {
        // Global.MainPlayerInfo.SetCurrentGameID(0);
    },
});
