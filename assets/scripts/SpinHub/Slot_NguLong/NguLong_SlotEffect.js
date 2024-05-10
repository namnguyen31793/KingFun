cc.Class({
    extends:  require('SlotEffect'),
    ctor(){
        this.BonusGame = null;
        this.EffectFree = null;
        this.EffectEndFree = null;
        this.EffectBigWin = null;
        this.EffectJackpot = null;
        this.countdownTime = 0; //s
        this.countdownInterval = 1;  //s
        this.onCountdownEndCallback = null;
        this.callbackFree = null;
        this.callbackEfffect = null;
        this.cacheValueEfffect = 0;
        this.nameClassFree = "NguLong_SelectFree";
        this.nameClassBonus = "NguLong_BonusGame";
        this.nameClassEndFree = "NguLong_EndFree";
    },

    properties: {
    },
    
    
    Show(){
        cc.log("show SlotEffect")
    },

    Hide(){

    },

    Clear(){
        //clear effect bigwin, jackpot, bonus, free
        if(this.EffectFree)
            this.EffectFree.active = false;
        if(this.BonusGame)
            this.BonusGame.active = false;
    },

    /* FREE */
    ShowEffectSelectFree(){
        cc.log("ShowEffectSelectFree");
        if(this.EffectFree == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectStartFree", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectFree = effect.getComponent(this.nameClassFree);
                seft.EffectFree.node.active = true;
                seft.EffectFree.Show(seft.slotController);
                this.slotController.PlayBgSelectFree();
            });  
        }else{
            this.EffectFree.node.active = true;
            this.EffectFree.Show(this.slotController);
            this.slotController.PlayBgSelectFree();
        }
    },

    //đang chơi dở vào lại
    HandleInputFreeGame(freespinType, callBack){
        if(this.EffectFree == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectStartFree", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectFree = effect.getComponent(seft.nameClassFree);
                seft.EffectFree.node.active = true;
                seft.EffectFree.HandleResponseSelectRoomFree(seft.slotController, freespinType, callBack);
                this.slotController.PlayBgFree();
            });  
        }else{
            this.EffectFree.node.active = true;
            this.EffectFree.HandleResponseSelectRoomFree(this.slotController, freespinType, callBack);
            this.slotController.PlayBgFree();
        }
    },

    ShowWinEndFree(value, callback){
        this.slotController.PlayBgNorMal();
        if(this.EffectEndFree == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectEndFree", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectEndFree = effect.getComponent(seft.nameClassEndFree);
                seft.EffectEndFree.node.active = true;
                seft.EffectEndFree.node.setPosition(cc.v2(0, 0));
                seft.EffectEndFree.show(value, seft.slotController.inputId_Free, callback);
            });  
        }else{
            this.EffectEndFree.node.active = true;
            this.EffectEndFree.show(value, this.slotController.inputId_Free, callback);
        }
    },
    /* ---------------- */

    /* EFFECT */
    ShowBigWin(winValue, time, callback){
        this.callbackEfffect = callback;
        if(this.EffectBigWin == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectBigWin", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectBigWin = effect;
                seft.EffectBigWin.active = true;
                let button = effect.getChildByName("ClickEnd").getComponent(cc.Button); 
                if (button){
                    let eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this; // Target là đối tượng Component hiện tại
                    eventHandler.component = "NguLong_SlotEffect"; // Tên của Component chứa hàm xử lý sự kiện
                    eventHandler.handler = "handlerClickEndBigWin";
                    button.clickEvents.push(eventHandler);
                }
                seft.WaitBigWin(time, winValue);
            });  
        }else{
            this.WaitBigWin(time, winValue);
        }
    },
    
    WaitBigWin(time, winValue){
        let seft = this;
        seft.EffectBigWin.active = true;
        var particle1 = this.EffectBigWin.getChildByName("coinDropper1").getComponent(cc.ParticleSystem);
        var particle2 = this.EffectBigWin.getChildByName("coinDropper2").getComponent(cc.ParticleSystem);
        particle1.resetSystem();
        particle2.resetSystem();
        this.scheduleOnce(()=>{
            seft.EndBigWin();
        } , time);
    },

    handlerClickEndBigWin : function () {
        this.EndBigWin();
    },

    EndBigWin(){
        if(this.EffectBigWin)
            if(this.EffectBigWin.active){
                this.unscheduleAllCallbacks();
                var particle1 = this.EffectBigWin.getChildByName("coinDropper1").getComponent(cc.ParticleSystem);
                var particle2 = this.EffectBigWin.getChildByName("coinDropper2").getComponent(cc.ParticleSystem);
                this.EffectBigWin.active = false;
                particle1.stopSystem();
                particle2.stopSystem();
                this.callbackEfffect();
            }
    },
    
    ShowJackpot(winValue, typeJackpot, callback){
        cc.log("ShowJackpot "+winValue);
        //show xong effect call callback
        this.callbackEfffect = callback;
        this.cacheValueEfffect = winValue
        if(this.EffectJackpot == null){
            //nếu effect chưa có thì load ra, xong rồi init event end anim
            let seft = this;
            Global.DownloadManager.LoadPrefab(this.slotController.NAME_BUNDLE_STRING,"effectJackpot", (prefab)=>{
                let effect = cc.instantiate(prefab);
                seft.node.addChild(effect);
                seft.EffectJackpot = effect;
                seft.EffectJackpot.setPosition(cc.v2(0, 300));
                seft.EffectJackpot.active = true;
                seft.EffectJackpot.getChildByName("lblCash").getComponent("LbMonneyChange").reset();
                seft.EffectJackpot.getChildByName("lblCash").getComponent("LbMonneyChange").setMoney(this.cacheValueEfffect);
                seft.PlayAnimJackpot();
                seft.ShowUIJackpotByType(typeJackpot);
            });  
        }else{
            this.EffectJackpot.setPosition(cc.v2(0, 300));
            this.EffectJackpot.active = true;
            this.ShowUIJackpotByType(typeJackpot);
            this.EffectJackpot.getChildByName("lblCash").getComponent("LbMonneyChange").reset();
            this.EffectJackpot.getChildByName("lblCash").getComponent("LbMonneyChange").setMoney(this.cacheValueEfffect);
            this.PlayAnimJackpot();
        }
    },

    ShowUIJackpotByType(typeJackpot){
        if(typeJackpot == 1){
            this.EffectJackpot.getChildByName("Frame_JPWinMajor").active = false;
            this.EffectJackpot.getChildByName("Frame_JPWinGrand").active = true;
        }else{
            this.EffectJackpot.getChildByName("Frame_JPWinMajor").active = true;
            this.EffectJackpot.getChildByName("Frame_JPWinGrand").active = false;
        }
    },

    PlayAnimJackpot(){
        cc.tween(this.EffectJackpot)
            .delay(0.15)
            .to(0.5, { position:  cc.v2(0, 0) })
            .start();
        this.scheduleOnce(()=>{
            this.EffectJackpot.active = false;
            this.callbackEfffect();
        } , 5);
    },
    /* ---------------- */

    Init_CountDown(countdownTime,countdownInterval,onCountdownEndCallback)
    {
        this.unscheduleAllCallbacks(); // Dừng tất cả các lịch trình
        this.countdownTime = countdownTime;
        this.countdownInterval = countdownInterval;
        this.onCountdownEndCallback = onCountdownEndCallback;
        this.schedule(() => {
            if (this.countdownTime > 0) {
                this.countdownTime--;
            } else {
                this.unscheduleAllCallbacks(); // Dừng tất cả các lịch trình
                this.node.emit("countdown_end"); // Kích hoạt sự kiện khi hết thời gian
                this.onCountdownEnd(); // Gọi hàm onCountdownEnd
            }
        }, this.countdownInterval);
    },

    CancelCountDown()
    {
        this.countdownLabel.node.active = false;  
        this.unscheduleAllCallbacks(); // Dừng tất cả các lịch trình
    },    
    onCountdownEnd() {
        // Xử lý khi hết thời gian
        console.log("Countdown Ended");
    
        // Kiểm tra xem có hàm được truyền vào không
        if (typeof this.onCountdownEndCallback === "function") {
            // Gọi hàm được truyền vào để xử lý sự kiện khi kết thúc đếm ngược
            this.onCountdownEndCallback();
        }    
    },
    
    onDestroy() {
        // Hủy đăng ký sự kiện khi đối tượng bị hủy
        this.node.off("custom_event_in_onCountdownEnd", this.onCustomEventInCountdownEnd, this);
    },
});
