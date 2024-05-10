cc.Class({
        extends : require('SlotController'),
        ctor(){
            this.activeButton = true;
            this.isSpin = false;
            this.isAuto = false;
            this.isSpeed = false;
            this.isgetResult = false;
            this.betValue = 0;
            this.lineData = 20;
            this.stateSpin = 0;

            this.NUMBER_COLUMN = 5;
            this.TIME_SPIN = 1;
            this.TIME_DISTANCE_COLUMN = 0.3;
            this.NUMBER_LINE = 20;
            this.stackSpin = [];
            this.NAME_BUNDLE_STRING = "Slot_NguLong";
            this.inputId = 1;
            this.inputValue = [10, 50, 200, 1000, 5000];
            this.inputId_Free = 0;
        },

        properties: {
            slotUI_Free: require('NguLong_SlotUI_Free'),
        },

        onLoad: function () {
            this.setGameId(Global.Enum.GAME_TYPE.KHO_TANG_NGU_LONG);
            this._super();
            if(this.slotUI_Free)
                this.slotUI_Free.Init(this);
        },

        //game kế thừa sửa phần này để chỉnh tùy chọn show room hay game
        Init: function () {
            this.setLineData (this.NUMBER_LINE)
            //game chọn rom thi show room
            //this.activeRoom();
            //game không có chọn room thì lần đầu vào chọn room 1
            this.JoinSlot(1);
        },
        
        JoinSelectRoom: function () {
            if(this.slotUI)
                this.slotUI.Hide();
            if(this.nodeRoom)
                this.nodeRoom.active = true;
        },

        JoinSlot: function (roomId) {
            this.SelectRoom(roomId);
            if(this.slotUI)
                this.slotUI.Show();
            if(this.slotMenu)
                this.slotMenu.Show();
            if(this.nodeRoom)
                this.nodeRoom.active = false;
        },

        SelectInput(input){
            this.inputId = input;
            this.slotMenu.UpdateInputType(this.inputValue[this.inputId-1]);
        },
        /*
        Kế thừa wallet thay đổi số dư và xử lý tiền
        */
        OnUpdateMoney(gold) {
            this.slotMenu.UpdateMoney(gold);
        },

        UpdateMoneyNormalGame(winMoney, accountBalance, isBuyFree = false) {
            cc.log("UpdateMoneyNormalGame isBuyFree "+isBuyFree+" - this.totalBetValue "+this.betValue)
            let betValue = this.betValue;
            //free và bonus sẽ k mất tiền lượt quay
            if(this.isFree || this.isBonus)
                betValue = 0;
            //buy free giá tiền khác với giá quay
            if(isBuyFree)
                betValue = this.totalBetValue*100;
            //  require("WalletController").getIns().PushBalance(this.getGameId(), betValue, winMoney, accountBalance);
            
        },

        SelectRoom(roomId) {
            if(this.tryPlay){
                this.setRoomId(roomId);
                let totalBetValue = this.GetTotalBetByRoom(roomId);
                this.slotMenu.UpdateTotalBetValue(totalBetValue);
                let jackpotModel = this.GetjackpotByRoom(roomId);
                this.slotMenu.UpdateJackpotValue(jackpotModel);
            }
            else
                this._super(roomId);
        },

        GetjackpotByRoom(roomId){
            let jackpotModel = '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
            switch(roomId){
                case 1:
                    jackpotModel = '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
                    break;
                case 2:
                    jackpotModel = '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":20000.0,"GrandJackpotMulti":200000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
                    break;
                case 3:
                    jackpotModel = '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":40000.0,"GrandJackpotMulti":400000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
                    break;
                case 4:
                    jackpotModel = '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":60000.0,"GrandJackpotMulti":600000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
                    break;
                case 5:
                    jackpotModel = '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":100000.0,"GrandJackpotMulti":1000000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
                    break;
            }
            return jackpotModel;
        },

        GetTotalBetByRoom(roomId){
            let totalBetValue = 0;
            switch(roomId){
                case 1:
                    totalBetValue = 50;
                    break;
                case 2:
                    totalBetValue = 100;
                    break;
                case 3:
                    totalBetValue = 200;
                    break;
                case 4:
                    totalBetValue = 300;
                    break;
                case 5:
                    totalBetValue = 500;
                    break;
            }
            return totalBetValue;
        },

        DeActiveButtonMenu() {
            this.activeButton = false;
            this.slotMenu.ActiveButtonMenu(false);
        },

        ActiveButtonMenu() {
            this.isSpin = false;
            this.activeButton = true;
            this.slotMenu.ActiveButtonMenu(true);
        },

        UpdateBetValue(totalBetValue) {
            this.betValue = totalBetValue;
            this.slotMenu.UpdateBetValue(totalBetValue)
        },

        GetBetValue() {
            return this.betValue;
        },

        CheckStateAuto() {
            if(this.isAuto) {
                this.ActionAutoSpin();
            }
        },

        ActionAutoSpin() {
            if((!this.isSpin && this.isAuto) || (!this.isSpin && this.isFree)) {
                this.slotEffect.Clear();
                let packet = this.GetStack();
                let isRequest = true;
                this.RequestSpin(isRequest);
                if(packet) {
                    this.ProceduGetResult(packet);
                }
            }
        },

        //ke thua them input
        CallRequestSpin() {
            let msg = {};
            msg[1] = this.getRoomId();
            msg[2] = this.inputId;
            msg[20] = this.getGameId();
            msg[40] = this.getGameId();
            this.sendRequestOnHub(cc.MethodHubName.SPIN, msg);
        },

        CallRequestSpinTry() {
            let msg = {};
            msg[1] = this.getRoomId();
            msg[2] = this.inputId;
            msg[20] = this.getGameId();
            msg[40] = this.getGameId();
            this.sendRequestOnHub(cc.MethodHubName.SPIN_TRY, msg);
        },
        
        CallSelectRooomFree(freespinType) {
            if(!this.tryPlay)
            {
                let msg = {};
                msg[1] = this.getRoomId();
                msg[2] = parseInt(freespinType);
                msg[3] = this.inputId;
                msg[20] = this.getGameId();
                msg[40] = this.getGameId();
                this.sendRequestOnHub(cc.MethodHubName.SELECT_INPUT_FREE, msg);
            }else{
                let tryPlayData = this.GetTryPlayInputFreeData();
                if(tryPlayData == null){
                    console.log("next free try")
                    let msg = {};
                    msg[1] = this.getRoomId();
                    msg[2] = parseInt(freespinType);
                    msg[3] = this.inputId;
                    msg[20] = this.getGameId();
                    msg[40] = this.getGameId();
                    this.sendRequestOnHub(cc.MethodHubName.SELECT_INPUT_FREE, msg);
                }
                else
                {
                    this.SelectInputFree(tryPlayData);  
                }
            }
        },

        RequestSpin(isRequest = true) {
            if(cc.BalanceController.getInstance().getBalance() < this.totalBetValue && !this.isFree && !this.isBonus) {
                Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NOT_ENOUGHT_MONEY_TO_PLAY"));
                if(this.isAuto) {
                    this.slotMenu.OffButtonAuto();
                    this.isAuto = false;
                }
                return;
            }
            this.onIngameEvent("SPIN_CLICK");
            
            this.ResetUINewTurn();
            this.isSpin = true;
            // this.slotSound.PlayAudioSpin();
            this.slotEffect.Clear();
            this.PlayEffectSpin();
            
            if(!this.isFree && !this.isBonus)
                this.slotMenu.ClearTotalWinFreeCache();
    
            this.DeActiveButtonMenu();
            if(isRequest) {
                if(!this.tryPlay)
                {
                    this.CallRequestSpin();  
                }else{
                    cc.log("CLICK SPIN - MSG_CLIENT_SLOT_SPIN_CHOI_THU");
                    let tryPlayData = this.GetTryPlayData();
                    if(tryPlayData == null)
                    {
                        this.CallRequestSpinTry();  
                    }
                    else
                    {
                        this.ProceduGetResult(tryPlayData);
                    }
                }
            }
        },

        PlayEffectSpin() {
            this.isgetResult = false;
            this.stateSpin = 0;
            this.stateGetResult = 0;
            let timeDistanceColumn = this.TIME_DISTANCE_COLUMN;
            if(this.GetIsSpeed())
                timeDistanceColumn = 0;
            let timeSpin = this.TIME_SPIN + timeDistanceColumn * (this.NUMBER_COLUMN-1);
            this.scheduleOnce(()=>{
                if(this.isFree){  
                    this.slotUI_Free.OnCheckSpinSuccess();
                    this.slotUI_Free.OnCheckUpdateMatrix(); 
                }
                else{
                    this.slotUI.OnCheckSpinSuccess();
                    this.slotUI.OnCheckUpdateMatrix();
                }
            } , timeSpin);
            if(this.isFree)
                this.slotUI_Free.PlaySpinColumn(timeDistanceColumn);
            else
                this.slotUI.PlaySpinColumn(timeDistanceColumn);
            //this.slotSound.PlaySpinStart();
        },

        GetIsSpeed(){
            return this.slotMenu.isSpeed;
        },

        EndAllItemPreWin() {
            if(this.isFree)
                this.slotUI_Free.EndAllItemPreWin();     
            else
                this.slotUI.EndAllItemPreWin();
            this.toDoList.DoWork();
        },
    

        UpdateLineWinData(lineWinData) {
            if(this.isFree)
                this.slotUI_Free.ShowLineWin(lineWinData);     
            else
                this.slotUI.ShowLineWin(lineWinData);     
        },

        HideLineWinData() {
            if(this.isFree)
                this.slotUI_Free.HideAllLine();
            else
                this.slotUI.HideAllLine() ;     
        },

        /*
        Kế thừa lắng nghe server
        */
        ResponseServer(code, packet) {
            cc.log("ResponseServer "+code)
            cc.log(packet)
            switch (code) {
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_ROOM_CONFIG:
                    this.GetRoomConfig(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_NGU_LONG_GAME_GET_ACCOUNT_INFO:
                    this.GetAccountInfo(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_NGU_LONG_GAME_JACKPOT_INFO:
                    this.GetJackpotInfo(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_NGU_LONG_GAME_SPIN:
                    this.ProceduGetResult(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_NGU_LONG_GAME_SPIN_CHOI_THU:
                    this.ProceduGetResultTry(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_NGU_LONG_GAME_SELECT_FREE_TYPE:
                    this.SelectInputFree(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_NGU_LONG_GAME_GET_DETAIL_HISTORY:
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_SPINHUB_SLOT_GAME_GET_DETAIL_HISTORY:
                    //this.SelectInputFree(packet);
                    break;
            }
        },

        GetRoomConfig(packet) {
            cc.log(packet)
            let config = [];
            for(let i = 0; i < packet[1].length; i++) {
                config[i] = JSON.parse(packet[1][i]);
            }
            cc.log(config);
            this.roomConfig = config;
        },

        SelectInputFree(packet) {
            cc.log(packet)
            let turn = packet[1];
            let freespinType = packet[2];
            let specialId = packet[3];
            let lastMatrix = packet[4];

            this.SelectInput(specialId);
            this.OnUpdateLastMatrix(lastMatrix);
            this.inputId_Free = freespinType;

            this.slotEffect.HandleInputFreeGame(freespinType,()=>{
                this.slotMenu.SetTextFree(turn);
                this.ShowFree(turn)
            });
        },

        GetAccountInfo(packet) {
            cc.log("GetAccountInfo")
            cc.log(packet)
            Global.UIManager.hideMiniLoading();
            this.slotController.PlayBgNorMal();
            let accountBalance = packet[1];
            let totalBetValue = packet[2];
            let jackpotModel = packet[3];
            let lineData = packet[4];
            let lastPrizeValue = packet[5];
            let freeSpin = packet[6];
            let isTakeFreeSpin = packet[7];
            let bonusCounter = packet[8];
            let isBonusTurn = packet[9];
            let lastMatrix = packet[10];
            let isNotSelectFreeTurnType = packet[12];

            //sau nay la save input tu luot truoc
            this.DeActiveButtonMenu();
            this.toDoList.CreateList();
            this.toDoList.AddWork(()=>{
                //todolist true đợi diễn effect show free nếu đang chơi dở lần trước
                this.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotModel, lastPrizeValue, lineData, isNotSelectFreeTurnType);
            }, true);
            this.toDoList.AddWork(()=>{
                // this.SelectInput(1);
                this.OnUpdateLastMatrix(lastMatrix);
                this.ActiveButtonMenu();
                this.CheckStateAuto();
                this.UpdateLineWinData(listLine);
            }, false);
            this.toDoList.Play();
        },

        GetJackpotInfo(packet) {
            let currentJackpotModel = packet[1];
            this.slotMenu.UpdateJackpotValue(currentJackpotModel);
        },

        ProceduGetResult(packet) {
            if(this.isgetResult) {
                this.AddStack(packet);
                return;
            }
            let spinId = packet[1];
            let matrix = packet[2];
            let listLineWinData = packet[3];
            let winNormalValue = packet[4];
            let numberBonusSpin = packet[5];
            let winBonusValue = packet[6];
            let freeSpinLeft = packet[7];
            let valueFreeSpin = packet[8];
            let totalWin = packet[9];
            let accountBalance = packet[11];
            let currentJackpotModel = packet[12];
            let isTakeJackpot = packet[13];
            let extendMatrixDescription = packet[14];
    
            this.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, numberBonusSpin, winBonusValue,freeSpinLeft, totalWin, accountBalance, currentJackpotModel, isTakeJackpot, extendMatrixDescription);
        },

        ProceduGetResultTry(packet) {
            if(this.isgetResult) {
                this.AddStack(packet);
                return;
            }
            let spinId = packet[1];
            let matrix = packet[2];
            let listLineWinData = packet[3];
            let winNormalValue = packet[4];
            let numberBonusSpin = packet[5];
            let winBonusValue = packet[6];
            let freeSpinLeft = packet[7];
            let valueFreeSpin = packet[8];
            let totalWin = packet[9];
            let accountBalance = 0;
            let currentJackpotValue = packet[12];
            let isTakeJackpot = packet[13];
            let extendMatrixDescription = packet[14]; 
            if(this.cacheFreeSpin == 0)
                this.cacheFreeSpin = freeSpinLeft
            else
                this.cacheFreeSpin -= 1;
            //fake chơi thử k có số dư nên tự cộng trừ tiền
            
            cc.BalanceController.getInstance().addTryBalance(- 200000 + totalWin);
            // accountBalance = require("WalletController").getIns().GetBalance() ;
            this.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, numberBonusSpin, winBonusValue, this.cacheFreeSpin, totalWin, accountBalance, currentJackpotValue, isTakeJackpot, extendMatrixDescription);
        },
        /*---------------------------------*/

        /*
        xử lý logic sau khi nhận từ server
        */
        OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotModel, lastPrizeValue, lineData, isNotSelectFreeTurnType) {
            this.lineData = lineData;
            cc.BalanceController.getInstance().updateRealBalance(accountBalance);
            cc.BalanceController.getInstance().updateBalance(accountBalance);
            //set ui các giá trị của lần chơi trước
            this.OnUpdateMoney(accountBalance);
            this.slotMenu.UpdateTotalBetValue(totalBetValue);
            this.slotMenu.UpdateJackpotValue(jackpotModel);
            this.slotMenu.SetLastPrizeValue(lastPrizeValue);
            // this.slotMenu.SetLineData(lineData); //-> server trả về sai là 50
            this.HideLineWinData();
            //turn trước khi thoát được free hay không thì hiển thị tiếp UI
            if(isNotSelectFreeTurnType){
                this.HandleFree(1);
            }else{
                if(this.CheckFreeSpin(freeSpin)){
                    //schedule show effect, change BG
                    //Nếu có schedule thì sẽ đợi xong effect mới call DoWork
                    //show UI free
                    this.isFree = true;
                    this.ShowFree(freeSpin);
                    this.slotMenu.GetTotalWinCache();
                    this.toDoList.DoWork();
                }else{
                    this.toDoList.DoWork();
                }
            }
        },
        
        OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, numberBonusSpin, winBonusValue, freeSpinLeft, totalWin, accountBalance, currentJackpotModel, isTakeJackpot, extendMatrixDescription) {
            if(isTakeJackpot)
                winNormalValue = totalWin;
            this.UpdateMatrix(this.ParseMatrix(matrix), false);
            if(!this.isFree)
                cc.BalanceController.getInstance().subtractBalanceUI(this.betValue);  
            //màn bonus chia ra tiền nhận sau khi diễn, nên cộng số dư ăn line trước
            let mAccountBalance = accountBalance;
            if(this.isBonus)
                mAccountBalance = accountBalance-winBonusValue;
            //add cache tiền thắng
            this.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
            let listLine = this.ParseLineData(listLineWinData);
            let extendMatrix = extendMatrixDescription.split("/");
            let multi = parseInt (extendMatrix[0]);
            let jackpotType = parseInt (extendMatrix[1]);

            //Khởi tạo list action chạy lần lượt
            this.toDoList.CreateList();
            this.toDoList.AddWork(()=>this.OnGetResult(),true);//-- chờ check chạy xong effect cột, các cột chạy xong sẽ call OnSpinDone() trong SlotUI
            this.toDoList.AddWork(()=>this.ShowEffectMulti(multi),true);
            if(isTakeJackpot)
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, isTakeJackpot, jackpotType),true);
            this.toDoList.AddWork(()=>this.EffectSmallGem(),false);
            if(listLine.length != 0){
                this.toDoList.AddWork(()=>{
                    this.UpdateLineWinData(listLine);
                },false);
                this.toDoList.Wait(0.5);
            }
            this.toDoList.AddWork(()=>{
                this.slotMenu.UpdateSessionID(spinId);
                this.slotMenu.UpdateJackpotValue(currentJackpotModel);
            },false);
            // check có free k show turn free, k có thì check bonus
            if(this.CheckFreeSpin(freeSpinLeft)){
                //show tiền thắng
                if(!this.isFree){
                    this.toDoList.AddWork(()=> this.slotUI.ShowLineFree(),false);
                    this.toDoList.Wait(0.5);
                }
                this.toDoList.AddWork(()=> this.HandleFree(freeSpinLeft),true);
            }
            //fake game tutorial
            if(this.tryPlay && this.tutorial.GetIndexTutorial() == 12){
                this.toDoList.AddWork(()=> this.ShowMultiGameFree(),true);
            }
            //neu win jackpot thi show truoc khi hide gem
            if(!isTakeJackpot)
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, isTakeJackpot, 1),true);
            //check end free và show total thắng trong lượt free
            if(this.isFree){
                this.toDoList.AddWork(()=>this.CheckEndFree(freeSpinLeft, totalWin),true);
                this.toDoList.Wait(0.25);
            }
            this.toDoList.AddWork(()=>{
                this.onIngameEvent("SPIN_STOPPED");
                //check end tutorial
                if(this.tutorial.GetIndexTutorial() == 20){
                    if(this.checkPauseTutorial("EndTutorial"))
                    {
                        this.onIngameEvent("END_TUTORIAL");
                    }
                }
                cc.BalanceController.getInstance().addBalanceUI(winNormalValue);
                this.ActiveButtonMenu();
                this.ActionAutoSpin();   //check auto thì send turn tiếp
            },false);
            this.toDoList.Play();
        },
        /*---------------------------------*/

        OnUpdateLastMatrix(lastMatrix) {
            if(lastMatrix.length != 0) {
                let matrix = this.ParseMatrix(lastMatrix);
                this.UpdateMatrix(matrix, true);
            }
        },

        UpdateMatrix(matrix, isSetDefaut = false) {
            this.cacheMatrix = matrix;
            if(this.isFree)
                this.slotUI_Free.OnCheckUpdateMatrix(isSetDefaut);
            else
                this.slotUI.OnCheckUpdateMatrix(isSetDefaut);
        },

        OnGetResult() {
            this.isgetResult = true;
            if(this.isFree)
                this.slotUI_Free.OnCheckSpinSuccess();
            else
                this.slotUI.OnCheckSpinSuccess();
        },

        EffectSmallGem(){
            if(this.isFree)
                this.slotUI_Free.HideGemDragon();
            else
                this.slotUI.HideGemDragon();
        },

        ShowEffectMulti(multi){
            //check tutorial
            if(multi == 1)
                this.toDoList.DoWork();
            else{
                if(this.isFree)
                    this.slotUI_Free.ShowMulti(multi, this.toDoList);
                else
                    this.slotUI.ShowMulti(multi, this.toDoList);
            }
        },

        //check lượt free của turn vừa nhận
        CheckFreeSpin(numberFree) {
            //turn cuối cùng trả về = 0
            if(this.isFree)
                return true
            return numberFree > 0;
        },
        //check xem turn này ăn bonus hay không
        CheckBonus(extendMatrixDescription){
            if(extendMatrixDescription === '[]' || extendMatrixDescription === ''){
                return false;
            }else{
                return true;
            }
        },

        //xóa các effect turn cũ khi bắt đầu quay turn mới
        ResetUINewTurn(){
            this.slotUI.ClearMulti();
            this.slotUI_Free.ClearMulti();
            this.HideLineWinData();
        },

        HandleFree(freeSpinLeft){
            
            if(this.checkPauseTutorial("pauseIntroFree"))
            {
                this.onIngameEvent("SHOWING_INTRO_FREE");
                this.storeCurrentScripts = "HandleFree";
                this.storeNextScripts = {
                    script:   this.HandleFree,
                    object :  this,
                    data: freeSpinLeft,                     
                };
                return;
            }
            cc.log(" HandleFree "+freeSpinLeft);
            // ssoo lượt free > 0 mà chưa đôi isFree -> Mới nhận được free
            if(freeSpinLeft > 0 && !this.isFree) {
                //save số lượt
                this.slotMenu.ClearTotalWinFreeCache();
                //chờ show effect start free
                this.slotEffect.ShowEffectSelectFree();
                return;
            }
            this.ShowFree(freeSpinLeft);
        },

        ShowFree(freeSpinLeft){
            cc.log(" ShowFree "+freeSpinLeft);
            //set bg free
            this.slotUI.ShowBgGameFree(true);
            this.slotMenu.ShowBoxTurnFree(true);
            this.slotMenu.SetTextFree(freeSpinLeft);
            this.isFree = true;
            this.slotUI_Free.node.active = true;
            this.toDoList.DoWork();
        },
        
        CheckEndFree(freeSpinLeft){
            if(freeSpinLeft == 0){
                if(this.tryPlay){
                    cc.log("CheckEndFree "+this.tutorial.GetIndexTutorial());
                    if(this.tutorial.GetIndexTutorial() == 14){
                        //show ui select free 2
                        this.slotEffect.ShowEffectSelectFree();
                        if(this.checkPauseTutorial("nextFreeGame")){
                            //show slect free 2
                            this.onIngameEvent("SELECT_ADD_FREE_2");
                        }
                        return;
                    }
                }
                let seft = this;
                this.isFree = false;
                this.slotUI.ShowBgGameFree(false);
                this.slotMenu.ShowBoxTurnFree(false);
                this.slotMenu.ActiveAddFree(false);
                let totalWinFree = this.slotMenu.ClearTotalWinFreeCache();
                
                this.slotEffect.ShowWinEndFree(totalWinFree, () => {
                    seft.toDoList.DoWork();
                    this.slotUI_Free.node.active = false;
                });
            }
            else
                this.toDoList.DoWork();
        },
        
        UpdateMoneyResult(winValue, isTakeJackpot, typeJackpot =1) {
            let seft = this;
            if(!isTakeJackpot) {
                if(winValue > 0) {
                    let isBigWin = this.CheckBigWin(winValue);
                    if(!isBigWin) {
                        this.slotSound.PlayAudioWinMoney();
                        this.ShowUpdateWinValueMenu(winValue);
                    } else {
                        this.slotSound.PlayAudioBigwin();
                        //run anim value
                       // this.ShowUpdateWinValueMenu(winValue, 10);
                        if(!this.isFree)
                            this.slotMenu.UpdateWinValue(winValue, 9);
                        else
                            this.slotMenu.UpdateWinFree(winValue, 9);

                        this.slotEffect.ShowBigWin(winValue, 9, () => {
                            seft.SetUpdateWinValueMenu(winValue);
                            this.slotSound.PlayStopBigWin();
                        });
                    }
                } else {
                    //không ăn giải, bỏ qua show kết quả continues
                    if(!this.isFree)
                        this.slotMenu.UpdateWinValue(0);
                    this.scheduleOnce(()=>{
                        this.toDoList.DoWork();
                    } , 0.4);
                } 
            }else{  
                this.slotSound.PlayAudioJackpot();
                this.slotEffect.ShowJackpot(winValue, typeJackpot, () => {
                    seft.ShowUpdateWinValueMenu(winValue);
                });
            }
        },
        

        SetUpdateWinValueMenu(value){
            if(!this.isFree)
                this.slotMenu.SetWinValue(value);
            else
                this.slotMenu.UpdateWinFree(value);
            this.scheduleOnce(()=>{
                this.toDoList.DoWork();
            } , 0.5);
        },
        
        ShowUpdateWinValueMenu(value, time = 0.5){
            if(!this.isFree)
                this.slotMenu.UpdateWinValue(value, time);
            else
                this.slotMenu.UpdateWinFree(value, time);
            this.scheduleOnce(()=>{
                this.toDoList.DoWork();
            } , 1.2);
        },

        /*
        Xử lý giải mã matrix và extend đặc biệt
        */
        ParseMatrix(matrixData) {
            let matrixString = matrixData.split("|");
            let matrixStr = matrixString[0].split(",");
            let matrix = [];
            this.cacheMulti = [];
            for(let i = 0; i < matrixStr.length; i++) {
                var item = matrixStr[i].split(".");
                matrix[i] = parseInt(item[0]);
                if(item[1])
                    this.cacheMulti[i] =  parseInt(item[1]);
                else
                    this.cacheMulti[i] = 1;
            }
            return matrix;
        },

        ParseExtendMatrix(matrixData) {
            let matrixString = matrixData.split("|");
            return parseInt(matrixString[1]);
        },
    
        ParseLineData(lineWinData) {
            let lineStr = lineWinData.split(",");
            let result = [];
            if(lineWinData === "")
                return result;
            for(let i = 0; i < lineStr.length; i++) {
                result[i] = parseInt(lineStr[i]);
            }
            return result;
        },
        /*-------------------------------*/

        /*
        EFFECT
        */
        CheckBigWin(winMoney, mutil = 10) {
            let isBigWin = false;
            var bet = this.GetBetValue();
            if(winMoney >= bet * mutil) 
                isBigWin = true;
            return isBigWin;
        },
        /*-------------------------------*/

        SpeedSpin(isSpeed) {
            this.isSpeed = isSpeed;
        },

        GetIsSpeed(){
            return this.isSpeed;
        },
   
        AutoSpin(isAuto) {
            this.isAuto = isAuto;
            if(!this.isAuto)
                this.countAuto = 0;
            if(this.isAuto && this.activeButton) {
                this.ActionAutoSpin();
            }
        },

        /*
        STACK CACHE RESULT SPIN
        */
        AddStack(data) {
            if(this.stackSpin[0] == null)
                this.stackSpin[0] = data;
            else if(this.stackSpin[1] == null)
            this.stackSpin[1] = data;
        },

        GetStack() {
            let pack = this.stackSpin[0];
            this.RemoveStack();
            return pack;
        },

        RemoveStack() {
            if(this.stackSpin[0] != null) {
                this.stackSpin[0] = null;
                if(this.stackSpin[1] != null) {
                    this.stackSpin[0] = this.stackSpin[1];
                    this.stackSpin[1] = null;
                }
            }
        },
    
        CountStack() {
            let count = 0;
            if(this.stackSpin[0])
                count++;
            if(this.stackSpin[1])
                count++;
            return count;
        },
        /*-------------------------------*/

        /* AUDIO */
        PlayClick(){
            this.slotSound.PlayAudioClick();
        },

        PlayReelStop(){
            this.slotSound.PlayAudioSpinStop();
        },

        PlayBgSelectFree(){
            this.slotSound.PlayBgSelectFree();
        },

        PlayBgFree(){
            this.slotSound.PlayBgFree();
        },

        PlayBgNorMal(){
            this.slotSound.PlayBgNorMal();
        },
        /*-------------------------------*/

        /* TUTORIAL */
        GetTryPlayData()
        {   
            if(this.tutorial)
                return this.tutorial.GetTutorialData();
            return null;
        },

        GetTryPlayInputFreeData()
        {   
            if(this.tutorial)
                return this.tutorial.GetTutorialFreeData();
            return null;
        },

        SetAccountInfoTry(){
            let accountBalance = 200000000;
            let totalBetValue = 500;
            let jackpotModel = '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
            let lineData = '';
            let lastPrizeValue = 0;
            let freeSpin = 0;
            cc.BalanceController.getInstance().updateTryBalance(200000000);
    
            this.DeActiveButtonMenu();
            this.toDoList.CreateList();
            this.toDoList.AddWork(()=>{
                //todolist true đợi diễn effect show free nếu đang chơi dở lần trước
                this.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotModel, lastPrizeValue, lineData, false);
            }, true);
            this.toDoList.AddWork(()=>{
                this.SelectInput(4);
                this.ActiveButtonMenu();
            }, false);
            this.toDoList.Play();
        },

        SetJackpotValueTry(model){
            let jackpotModel = '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
            this.slotMenu.UpdateJackpotValue(jackpotModel);
        },
        
        ShowMultiGameFree(){
            if(this.checkPauseTutorial("pauseAddFreeGame"))
            {
                this.onIngameEvent("ENTER_ADD_FREE");
                this.slotMenu.ShowAddFree(1);
                this.storeCurrentScripts = "ShowMultiGameFree";
                this.storeNextScripts = {  
                    script:   this.ShowMultiGameFree,
                    object :  this,
                    data: null,                  
                };
                return;
            }
            this.slotMenu.ShowAddFree(1);
            this.toDoList.DoWork();
        }
        //
    });
