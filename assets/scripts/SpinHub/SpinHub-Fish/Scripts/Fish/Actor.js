import List from "List";
cc.Class({
    extends: cc.Component,
    ctor() {
        this.actorPropertis = null;
        this.gun = null;
        this.itemControl = null;
        this.itemLockFish = null;
        this.totalWinFree = 0;
        this.listBigWin = [null, null, null];
        this.countTimeShowMoney = 0;
        this.isShowMoney = false;
        this.listMoneyShow = new List();
        this.isPlayBigFishDeath = false;
        this.cacheReward = 0;
        this.cacheBalance = 0;
        this.listFishDeath = null;
        this.lazeCollider = null;
        this.posMoney = null;
        this.levelUnlock = [0,3,5,8,10,12,15];
        this.maxGun = 1;
        this.winSpecial = null;
        this.maxBalance = 0;
        this.isMain = false;
        this.TargetFish = null;
        this.isAttack = true;
        this.randomPoint = null;
    },

    properties: {
        itemControlObj : cc.Node,
        txtName : cc.Label,
        txtMoney : cc.Label,
        txtDiamond : cc.Label,
        txtGunValue : cc.Label,
        iconVip : cc.Sprite,
        imgEffectTarget : cc.Node,
        btnSub : cc.Node,
        btnSum : cc.Node,
        effectChangeGun : cc.Animation,
        khung : cc.Node,
        btnShotSpecial : cc.Node,
        animDe : cc.Animation,
        lock : cc.Node,
        ava : cc.Sprite,
        MyGun : require("Gun"),
        playing_Icon : cc.Node,
        beSung : cc.Node,
        ChangeBetContent : cc.Node,
    },

    Actor_Init(properties, indexActor) {
        if(Global.InGameManager == null || Global.InGameManager.inBackGround)
        return;
        
        this.node.active = true;
      //  this.playing_Icon = false;
        this.isPlayBigFishDeath = false;
        this.listMoneyShow.Clear();
        this.SetPosMoney();
        this.actorPropertis = properties;
        if (Global.GameLogic.roomProperties.RoomType == 1) {
            this.actorPropertis.CacheGun = Global.gunConfigModelRoom1 [0].GunId;
        } else if (Global.GameLogic.roomProperties.RoomType == 2) {
            this.actorPropertis.CacheGun = Global.gunConfigModelRoom2 [0].GunId;
        }
        this.gun = Global.InGameView.listGunView[indexActor];
        this.TIME_USE_TARGET = Global.GameConfig.ListItemConfig[2].TimeEffect;
        this.CreateItem();
        if(require("ScreenManager").getIns().roomType == 1) {
            if(this.actorPropertis.CurrentGunId > cc.NetConfigNew.getInstance().CONFIG_GAME.MAX_GUN_ROOM_1) {
                this.actorPropertis.CurrentGunId = cc.NetConfigNew.getInstance().CONFIG_GAME.MAX_GUN_ROOM_1;
            }
        }
        this.UpdateInfo();
        this.effectChangeGun.node.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
        this.effectChangeGun.node.setPosition(this.gun.node.getPosition());
      
        if(this.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) {
            this.maxBalance = this.actorPropertis.AccountBalance;
           
            this.isMain = true;
            
            if (this.actorPropertis.CurrentGunId == Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID || this.actorPropertis.CurrentGunId == Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID ) {           
                this.btnSub.active = false;
                this.btnSum.active = false;
            }
            cc.BalanceController.getInstance().addBalanceView(this);
            // require("WalletController").getIns().init();
            // require("WalletController").getIns().AddListener(this);
        } else {
            this.isMain = false;
            if(Global.agent > 0)
                this.txtName.string =  Global.Helper.HideString(this.actorPropertis.NickName);
        }
        if(this.btnShotSpecial) {
            this.btnShotSpecial.children[0].on(cc.Node.EventType.TOUCH_START , this.onTouchStart , this );
        } 
        Global.InGameManager.Handle_ShowBesungAnimation(indexActor);
    },

    updateBalance: function (balance) {
        this.actorPropertis.AccountBalance = balance;
        this.OnUpdateMoney(this.actorPropertis.AccountBalance);
    },
  
    OnUpdateMoney(money) {
        this.actorPropertis.AccountBalance = money;//--them moi fix sai tien
		this.txtMoney.string = Global.Helper.formatNumber(money);
	},

    Remove() {
        this.node.active = false;
        this.actorPropertis = null;
        this.effectChangeGun.node.parent = this.node;
        this.gun.Remove();
        this.gun = null;
    //    this.khung.parent = this.node;
        if(this.winSpecial != null)
            this.winSpecial.destroy();
        this.winSpecial = null;
    },
    
    Dispose() {
        if(this.actorPropertis)
            if(this.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) {
                cc.BalanceController.getInstance().removeBalanceView(this);
            }
    },

    SetAccountBalance(accountBalance, useAnim = false) {
       
           
        this.actorPropertis.AccountBalance = accountBalance;
        if(this.isMain)
        {
            cc.BalanceController.getInstance().updateRealBalance(accountBalance);
            cc.BalanceController.getInstance().updateBalance(accountBalance);
            // require("WalletController").getIns().UpdateWallet(this.actorPropertis.AccountBalance);
        }
        else this.txtMoney.string = Global.Helper.formatNumber(this.actorPropertis.AccountBalance);
        if(useAnim) {
            this.txtMoney.node.getComponent(cc.Animation).play();
        }
    },  
    Directly_SetAccountBalance(accountBalance)
    {
        this.actorPropertis.AccountBalance = accountBalance;
        if(this.isMain)
        {
            cc.BalanceController.getInstance().updateRealBalance(accountBalance);
            cc.BalanceController.getInstance().updateBalance(accountBalance);
            // require("WalletController").getIns().UpdateWallet(this.actorPropertis.AccountBalance);
        }
        else this.txtMoney.string = Global.Helper.formatNumber(this.actorPropertis.AccountBalance);
    },

    SetDiamondBalance (diamondBalance) {
        this.actorPropertis.Diamond = diamondBalance;
        // if(this.txtDiamond)
        //     this.txtDiamond.string = Global.Helper.formatNumber(this.actorPropertis.Diamond);
    },

    UpdateInfo() {
        this.gun.Init(this);
        this.txtName.string = this.actorPropertis.NickName;
        //console.log(this.actorPropertis);
        this.txtMoney.string = Global.Helper.formatNumber(this.actorPropertis.AccountBalance);
        this.gunValue = this.GetMoneyPerShotByCurrentGunId();
        this.txtGunValue.string = Global.Helper.formatNumber(this.gunValue);
       // this.txtLevel.string = "Lv "+this.actorPropertis.VipLevel;
        Global.Helper.GetVipIcon(this.actorPropertis.VipId, this.iconVip);
        if(this.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) {
            Global.Helper.GetAvata(this.ava);
        } else {
            Global.Helper.GetAvataOther(this.ava, this.actorPropertis.NickName);
        }
        
        this.SetMaxGun();
    },   

    SetLevel(level) {
        if(this.actorPropertis == null)
            return;
        this.actorPropertis.VipLevel = level;     
        this.SetMaxGun();
    },

    SetMaxGun() {
        this.maxGun = this.levelUnlock.length;       
    },
    
    checkShooting() {
        return this.actorPropertis.AccountBalance >= this.GetMoneyPerShotByCurrentGunId();
    },
    

    UpdateBalance(money, useAnim = false) {
        if(useAnim) {
            this.listMoneyShow.Add(money);
        } else {
            this.AddBalance(money);
        }
    },

    AddBalance(money) {
        if(this.actorPropertis.AccountBalance + money >= 0) {
            this.actorPropertis.AccountBalance += money;
            if(this.actorPropertis.AccountBalance > this.maxBalance && this.isMain) {
                this.actorPropertis.AccountBalance = this.maxBalance;
             
            }
            if(this.isMain){
                if(money > 0){
                    cc.BalanceController.getInstance().updateRealBalance(this.actorPropertis.AccountBalance);
                    cc.BalanceController.getInstance().updateBalance(this.actorPropertis.AccountBalance);
                    // require("WalletController").getIns().UpdateWallet(this.actorPropertis.AccountBalance);
                }else{
                    cc.BalanceController.getInstance().subtractBalanceUI(-1 * money);  
                }
            }
            else this.txtMoney.string = Global.Helper.formatNumber(this.actorPropertis.AccountBalance);
        }
    },

    ShootBalance() {
        this.UpdateBalance(-this.GetMoneyPerShotByCurrentGunId());
    },

    CreateItem() {
        if(this.itemControlObj) {
            this.itemControl = this.itemControlObj.getComponent("ItemControl");
            this.itemControl.Init(this);
        }
        if(this.actorPropertis.AccountId != cc.LoginController.getInstance().getUserId()) {
            this.SetDiamondBalance(this.actorPropertis.Diamond);
        }
    },

    EndItem(typeItem) {
        if(typeItem == Global.Enum.ITEM_TYPE.TARGET) {
            this.ChangeTurnTartget(false);
        } else if (typeItem == Global.Enum.ITEM_TYPE.ICE) {

        } else if (typeItem == Global.Enum.ITEM_TYPE.SPEED) {
            this.ChangeTurnSpeed(false);
        }
        this.EndTurnItemUI(typeItem);
    },

    EndTurnItemUI(typeItem) {
        if(typeItem == Global.Enum.ITEM_TYPE.TARGET) {
            this.imgEffectTarget.active = false;
         
            this.HideItemLockFish ();
        }
    },

    effectAtack(){
        this.gun.getComponent(cc.Animation).play();
    },

    GetMoneyPerShotByCurrentGunId() {
        let value = 0;
        if(this.actorPropertis == null)
            return 0;
        try {
            let gunId = this.actorPropertis.CurrentGunId;
            if(gunId > 100)
                gunId = this.actorPropertis.CacheGun;
            if (Global.GameLogic.roomProperties.RoomType == 1) {
                for (let i = 0; i < Global.gunConfigModelRoom1.length; i++) {
                    if (gunId == Global.gunConfigModelRoom1 [i].GunId) {
                        value = Global.gunConfigModelRoom1 [i].BulletPrice;
                    }
                }
            } else if (Global.GameLogic.roomProperties.RoomType == 2) {
                for (let i = 0; i < Global.gunConfigModelRoom2.length; i++) {
                    if (gunId == Global.gunConfigModelRoom2 [i].GunId) {
                        value = Global.gunConfigModelRoom2 [i].BulletPrice;
                    }
                }
            } else {
                for (let i = 0; i < Global.gunConfigModelRoom1.length; i++) {
                    if (gunId == Global.gunConfigModelRoom1 [i].GunId) {
                        value = Global.gunConfigModelRoom1 [i].BulletPrice;
                    }
                }
            }
        } catch {
            value = 0;
        }
        return value;
    },

    ShowEffectBigWin(money, multi, fish) {
        if(fish.FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE) {
            let index = this.GetIndexBigWin();
            let node = Global.InGameManager.FishPoolInstance.creatEffectBigWin(this.GetPosBigWin(index), money, index, this, multi);
            this.listBigWin[index] = node;
            this.scheduleOnce(()=>{
                this.UpdateBalance(money, true);
            } , 2.5);
        } else {
            fish.SetPreDieBigWin();
            let pos = this.GetPosFishBigWin(cc.v2(-325, -68));
            fish.node.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
            fish.node.setSiblingIndex(0);
            fish.node.runAction(cc.sequence(cc.delayTime(0.2), cc.moveTo(0.3, pos), cc.delayTime(0.3),cc.callFunc(() => {
                fish.EndPreDie();
                let index = this.GetIndexBigWin();
                let node = Global.InGameManager.FishPoolInstance.creatEffectBigWin(this.GetPosBigWin(index), money, index, this, multi);
                this.listBigWin[index] = node;
                this.scheduleOnce(()=>{
                    this.UpdateBalance(money, true);
                } , 2.5);
            })));
        }
    },

    GetInfoItem(itemModel) {
        this.itemControl.GetInfo(itemModel);
    },

    UseItem(typeItem, isMainPlayer) {
        if (isMainPlayer) {
            this.itemControl.HandleUseItem(typeItem);
            if (typeItem == Global.Enum.ITEM_TYPE.TARGET) {
                this.ChangeTurnTartget (true);
                this.imgEffectTarget.active = true;
                this.timeUseItemTarget = 0;
            } else if (typeItem == Global.Enum.ITEM_TYPE.ICE) {
                Global.InGameManager.SetIce(12000);
                require("FishCollection").getIns().StopAnimation();
            } else if (typeItem == Global.Enum.ITEM_TYPE.SPEED) {
                this.ChangeTurnSpeed (true);
            } 
        }
    },

    SumGun() {
        // Global.SammuraiController.CreateResultSammurai(1, 50000,3);
        // return;
        let listGun = Global.gunConfigModelRoom1;
        
        if (Global.GameLogic.roomProperties.RoomType == 2) {
            listGun = Global.gunConfigModelRoom2;
        }

       
        let index = 0;
        let numb = this.maxGun;
     
        if(Global.isOffline)
            numb = Global.numbGunOpen;
        if(numb == 1)
            return;
        // if(CONFIG.MERCHANT == 3)
        //  {
        //         listGun = Global.gunConfigByVip;
        //         numb = listGun.length
        //  }     
       
        
        for (let i = 0; i < numb; i++) {
            if (listGun [i].GunId == this.actorPropertis.CurrentGunId) {
                index = i;
                if (index == numb - 1) {
                    this.SendRequestChangeGun (listGun [0].GunId);
                } else {
                    this.SendRequestChangeGun (listGun [index + 1].GunId);
                }
                break;
            }
        }
        
       
    },

    SubGun() {
        let listGun = Global.gunConfigModelRoom1;
        if (Global.GameLogic.roomProperties.RoomType == 2) {
            listGun = Global.gunConfigModelRoom2;
        }
        
        let index = 0;
        let numb = this.maxGun;
        if(Global.isOffline)
            numb = Global.numbGunOpen;
        if(numb == 1)
            return;
        // if(CONFIG.MERCHANT == 3)
        // {
        //     listGun = Global.gunConfigByVip;
        //     numb = listGun.length
        //  }     
          
        for (let i = 0; i < numb; i++) {
            if (listGun [i].GunId == this.actorPropertis.CurrentGunId) {
                index = i;
                if (index == 0) {
                    this.SendRequestChangeGun (listGun [numb- 1].GunId);
                } else {
                    this.SendRequestChangeGun (listGun [index - 1].GunId);
                }
                break;
            }
        }
    },

    SendRequestChangeGun(gunId) {
        if(gunId < 1 || gunId > 10)
            return;
        let msgData = {};
        msgData [1] = gunId;
        require("SendRequest").getIns().MST_Client_Change_Gun (msgData);
    },

    ChangeGun(newGunId) {     
        let isCheckJackpot = false;
       
            if(this.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) {
                this.btnSub.active = true;
                this.btnSum.active = true;
                this.btnShotSpecial.active = false;
                this.ChangeBetContent.active = true;
                Global.InGameManager.onEvent();
                isCheckJackpot = true;
            } 
 
        this.actorPropertis.CurrentGunId = newGunId;
        //this.gun.ChangeGunUi(newGunId);
        this.gunValue = this.GetMoneyPerShotByCurrentGunId();
        this.txtGunValue.string = Global.Helper.formatNumber(this.gunValue);
        /*
        if(isCheckJackpot) {
            let fishJackpot = require("FishCollection").getIns().FindJackpotFish();
            if(fishJackpot != null) {
                fishJackpot.SetHide();
            }
        }
        */
    },
    ChangeGun_SpecialGun(newGunId,fishValue)
    {
       
        if (newGunId != Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID && newGunId != Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID) 
            return;     
      
        this.gunValue = this.GetMoneyPerShotByCurrentGunId();
        this.actorPropertis.CacheGun = this.actorPropertis.CurrentGunId;

        if(newGunId == Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID)
        {
            Global.ServerBot.modulePlayEffect.SetupEffectLazes(this,fishValue);
        }

        if(this.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId()) {
                this.btnSub.active = false;
                this.btnSum.active = false;
                this.btnShotSpecial.active = true;
                this.ChangeBetContent.active = false;
                this.scheduleOnce(()=>{
                    if(this.btnShotSpecial.active) {
                        this.ClickShotSpecial();
                    }
                } , 10);               
                Global.InGameManager.offEvent();
        }
        else
        { 
            let changeTime = Global.RandomNumber(1,3);
            let changeIndex = 0;

            let updateLoop = () => { // Tạo hàm vô danh và lưu vào biến updateLoop
                this.ChangeRotateGun();
                changeIndex++;
                if (changeIndex >= changeTime) {
                    this.unschedule(updateLoop); // Dừng lịch trình bằng cách sử dụng biến updateLoop
                }
            };
            this.schedule(updateLoop, 4 / changeTime);
            /*
            this.scheduleOnce(()=>{                       
                this.ChangeRotateGun();  
            } , Global.RandomNumber(1,4));
            */
                 
            this.scheduleOnce(()=>{                       
                this.ClickShotSpecial();
            } , Global.RandomNumber(5,9));
        }
            
        this.gun.ChangeGun_SpecialGunUI(newGunId,fishValue);
        this.actorPropertis.CurrentGunId = newGunId;
      
        this.txtGunValue.string = Global.Helper.formatNumber(this.gunValue);
        
    },

    GetNormalGunId() {
        if(this.actorPropertis.CurrentGunId >= 1 && this.actorPropertis.CurrentGunId <= 10) {
            return this.actorPropertis.CurrentGunId;
        } else if(this.actorPropertis.CacheGun >= 1 && this.actorPropertis.CacheGun <= 10) {
            return this.actorPropertis.CacheGun;
        } else return 1;
    },

    ChangeTurnTartget(isTurnTarget) {
        if(!isTurnTarget) {          
           
            Global.InGameManager.fishTarget = null;
            Global.InGameManager.offEventUsingTarget();
            Global.InGameManager.onEvent();
            Global.InGameManager.isAutoAtack = Global.InGameView.btnAuto.isChecked;
            Global.InGameManager.isAtack = Global.InGameManager.isAutoAtack;
        } else {
            Global.InGameManager.onEventUsingTarget();
            Global.InGameManager.offEvent();
            Global.InGameManager.isAutoAtack = true;
            Global.InGameManager.isAtack = Global.InGameManager.isAutoAtack;
        }
    },

    ChangeTurnSpeed(isSpeed) {
        Global.InGameManager.ChangeTurnSpeed(isSpeed);
    },

    HideItemLockFish() {
        Global.InGameManager.fishTarget = null;             
      
        if (this.itemLockFish == null) {
            
        } else {
            this.itemLockFish.active = false;
            this.itemLockFish.parent = this.node;
        }
        
    },

    LockFishTargetUI(lockFish) {
        if (this.itemLockFish == null) {
            Global.cacheActor = this;
            
			cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectTarget', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectTarget", (prefab)=>{
                try
                {
                    if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                Global.cacheActor.itemLockFish = cc.instantiate(prefab);
                Global.cacheActor.itemLockFish.active = true;
                if(lockFish.FishProperties.FishType != Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE) {
                    Global.cacheActor.itemLockFish.parent = lockFish.node;
                } else {
                    Global.cacheActor.itemLockFish.parent = lockFish.attackPoint;
                }
                
                Global.cacheActor.itemLockFish.setPosition(cc.v2(0,0));
                }
                catch(e){
                    cc.log("ERROR: "+e);
                }
            });
        } else {
            this.itemLockFish.active = true;
            if(lockFish.FishProperties.FishType != Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE) {
                this.itemLockFish.parent = lockFish.node;
            } else {
                this.itemLockFish.parent = lockFish.attackPoint;
            }
            this.itemLockFish.setPosition(cc.v2(0,0));
        }
    },

    EffectStartSpecialGun(gunId) {
       
        Global.cacheActor = this;
        cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectStartSpecialGun', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectStartSpecialGun", (prefab)=>{
            if(Global.InGameManager == null || Global.InGameManager.inBackGround)
            return;
            try
            {
            let node = cc.instantiate(prefab);
            Global.InGameManager.FishPoolInstance.OtherContainer.addChild(node);
            node.getComponent("EffectStartSpecialGunView").Init(Global.cacheActor.gun);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
    },

    CreateScore(score) {
        Global.InGameManager.FishPoolInstance.createScore2(this.GetPosScore(), score, this.actorPropertis.SittingId);
    },

    PlaySoundShot() {
        if (this.actorPropertis.CurrentGunId < 4) {
            Global.AudioManager.PlaySoundGun123 ();
        } else if (this.actorPropertis.CurrentGunId < 7) {
            Global.AudioManager.PlaySoundGun456 ();
        } else if (this.actorPropertis.CurrentGunId < 8) {
           // Global.AudioManager.PlaySoundGun7 ();
           Global.AudioManager.PlaySoundGun456 ();
        } else {
            Global.AudioManager.PlaySoundGun8 ();
        }
    },

    GetPosFishBigWin(pos) {
        return Global.Helper.GetPositionSliceBySittingIdAndMainSitting(this.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(pos));
    },

    GetPosScore() {
        if(this.actorPropertis != null && Global.GameLogic.mainActor.actorPropertis != null) {
            return Global.Helper.GetPositionSliceBySittingIdAndMainSitting(this.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-488,-218));
        } else {
            return cc.v2(-9999,-9999);
        }
    },

    GetPosBigWin(index) {
        if(this.actorPropertis != null && Global.GameLogic.mainActor.actorPropertis != null) {
            return Global.Helper.GetPositionSliceBySittingIdAndMainSitting(this.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-325,this.GetPosBigWinByIndex(index)));
        } else {
            return cc.v2(-9999,-9999);
        }
    },

    GetIndexBigWin() {
        for(let i = 0; i < this.listBigWin.length; i++) {
            if(this.listBigWin[i] == null) {
                return i;
            }
        }
        return 0;
    },

    GetPosBigWinByIndex(index) {
        if(index == 0) return -160;
        if(index == 1) return -100;
        if(index == 2) return -40;
        return -158;
    },

    //gun vip
    CheckVipGun() {
        if(this.gun == null)
            return false;
        return this.gun.isGunVip;
    },

    UseVipGun() {
        Global.InGameManager.ChangeSpeedVipGun(true);
        this.gun.ChangeGunVip();
        Global.InGameManager.onEventUsingTarget();
        Global.InGameManager.offEvent();
        Global.InGameManager.isAtack = true;
        this.gun.hitVip.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
    },

    UseNormalGun() {
        this.gun.bulletVip.active = false;
        this.gun.fireVip.active = false;
        this.gun.hitVip.active = false;
        Global.InGameManager.ChangeSpeedVipGun(false);
        this.gun.ChangeGunNormal();
        Global.InGameManager.offEventUsingTarget();
        Global.InGameManager.onEvent();
        Global.InGameManager.fishTarget = null;
    
        Global.InGameManager.isAutoAtack = false;
        Global.InGameManager.isAtack = Global.InGameManager.isAutoAtack;
    },

    SetFishTargetByGunVip(lockFish) {
        Global.InGameManager.isAutoAtack = true;
        Global.InGameManager.isAtack = Global.InGameManager.isAutoAtack;
    },

    CheckFish(fish) {
        if (!fish.isDie && !fish.isPreDie && 
            fish.node.x < 650 &&  fish.node.x > -650 && fish.node.y < 320 && fish.node.y > -320) {
                return true;
        }
        return false;
    },

    onTouchStart(touch){
        try {
            let offsetX = cc.winSize.width/2;
            let offsetY = cc.winSize.height/2;
            let v2Touch = cc.v2(touch.getLocation()).subSelf(cc.v2(offsetX  , offsetY ));
            var diff =   v2Touch.subSelf(this.gun.node.getPosition());
            var angle = Math.atan2( diff.x , diff.y) * 180 /   Math.PI;
            this.gun.node.angle =  -angle;
        } catch {
            
        }
        
    },

    ChangeParentForDrillBullet() {
        if(this.gun.cacheBullet) {
            this.gun.cacheBullet.node.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
            this.gun.cacheBullet.node.setPosition(this.gun.getPosCreateBullet());
            this.gun.cacheBullet.node.angle = this.gun.node.angle;
            // Global.changeParent(this.gun.cacheBullet.node, Global.InGameManager.FishPoolInstance.OtherContainer);
            this.gun.cacheBullet.ReCalculatorVelocity();
        }
    },

    ClickShotSpecial() {
      
        this.ChangeParentForDrillBullet();  
        if(this.actorPropertis.CurrentGunId == Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID)
        {        
          Global.ServerBot.modulePlayEffect.PlayEffectLaze();
          
          this.scheduleOnce(()=>{
            Global.InGameManager.InGameSoundManager.PlayLazelSound();
            } , 0.8);
         
         }
         if(this.actorPropertis.CurrentGunId == Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID)
        {
          this.PlaySpecialGun();
         }
       
         if(this.actorPropertis.AccountId == cc.LoginController.getInstance().getUserId())
         {
            this.btnShotSpecial.active = false;        
            this.ChangeBetContent.active = true;
         }
    },

    ChangeRotateGun() {
        if(this.actorPropertis.SittingId == 3) {
           // this.MyGun.node.angle = Global.RandomNumber(15,61);        
           this.MyGun.node.angle = Global.RandomNumber(15,165);        
        } else if(this.actorPropertis.SittingId == 5) {
            cc.log("ChangeRotateGun : 5 ");
            this.MyGun.node.angle = Global.RandomNumber(105,251);
        } else if(this.actorPropertis.SittingId == 7) {
            cc.log("ChangeRotateGun : 7 ");
            this.MyGun.node.angle = Global.RandomNumber(105,251);
        }
    },

    PlaySpecialGun(isMove = true) {
        // this.listFishDeath = new List();
        // this.listFishDeath.Import(deathFishIds);
        if(this.gun.cacheBullet != null) {
            this.gun.cacheBullet.isMove = isMove;
            this.gun.cacheBullet.isCollision = true;
            this.gun.cacheBullet.SetInfoBullet(this.actorPropertis.AccountId, 2.5, 0);
            this.gun.getComponent(cc.Animation).play();
        }
    },

    SetPosMoney() {
        let posWorld = this.txtMoney.node.parent.convertToWorldSpaceAR(this.txtMoney.node);
        this.posMoney = Global.InGameManager.FishPoolInstance.OtherContainer.convertToNodeSpaceAR(posWorld);
    },

    GetPosMoney() {
        return this.posMoney;
    },

    ClickLock() {
        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("LOCK_GUN"));
    },

    update (dt) {
        if(!this.isShowMoney && this.listMoneyShow.GetCount() > 0) {
            this.isShowMoney = true;
            this.txtMoney.node.getComponent(cc.Animation).play();
            this.AddBalance(this.listMoneyShow.Get(0));
            this.CreateScore(this.listMoneyShow.Get(0));
            this.listMoneyShow.RemoveAt(0);
        }
        else if(this.isShowMoney) {
            this.countTimeShowMoney += dt;
            if(this.countTimeShowMoney >= 0.2) {
                this.countTimeShowMoney = 0;
                this.isShowMoney = false;
            }
        }
        
        if (this.imgEffectTarget.active) {
            this.timeUseItemTarget += dt;
            if(this.timeUseItemTarget >= this.TIME_USE_TARGET)
            {
             
                this.HideItemLockFish ();
                this.imgEffectTarget.active = false;
            }
        }
        this.Handle_UpdateLogic(dt);
     },

     Handle_UpdateLogic(dt)
     {

     },
     On_Attack()
     {
        if(this.actorPropertis.AccountId != cc.LoginController.getInstance().getUserId())
        {
           let waitingTime =  Global.RandomNumber(1,20);     
           this.scheduleOnce(()=>{
            this.isAttack = true;
        } , waitingTime);
        }
        else
        {
            this.isAttack = true;
        }
        cc.log(">> On_Attack");
     },
     Off_Attack()
     {
        this.isAttack = false;
        cc.log(">> Off_Attack");
     },
     Handle_Shooting()
     {
        if(!this.isAttack)
            return;
        if(this.MyGun == null)
            return;
        if(this.actorPropertis.AccountBalance < this.GetMoneyPerShotByCurrentGunId())
        {
           // Global.UIManager.showMiniLoading();
           if(this.isMain)
                Global.UIManager.showCommandPopup("Bạn không đủ tiền để chơi tiếp");
            return;
        }
        //this.HideItemLockFish();
        this.ShootBalance();
        let bulletId = "" + this.actorPropertis.SittingId + Date.now();
        let targetId = -1;
        if(Global.InGameManager.fishTarget)
            targetId = Global.InGameManager.fishTarget.FishProperties.FishId;
        let gunType =  this.actorPropertis.CurrentGunId;
        this.MyGun.Handle_ShowAnimationGun();
        this.PlaySoundShot();
        let cpBullet = Global.InGameManager.FishPoolInstance.creatBullet(this.gunValue, this.MyGun.getPosCreateBullet() , -this.MyGun.node.angle , gunType, this.actorPropertis.VipId, bulletId , true, targetId, this.actorPropertis.AccountId);          
  
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER)
        {
       
             this.MultiPlayer_HandleShooting(cpBullet,bulletId);
        }
     },

     Handle_OtherPlayerShooting(bulletInfo)  
     {
        let shotInfo = bulletInfo.split(","[0]);
        if(Global.InGameManager.inBackGround)
        return;
        this.MyGun.Handle_ShowAnimationGun();
        let vecDir = Global.Helper.GetPositionSliceBySittingId(Global.GameLogic.mainActor.actorPropertis.SittingId , cc.v2(shotInfo[1] , shotInfo[2])) ;

        let goc = Math.atan2(vecDir.x , vecDir.y) * 180/Math.PI ;
        this.gun.node.angle = -goc;
        let bullet = null; 
            bullet = Global.InGameManager.FishPoolInstance.creatBullet(this.gunValue,this.gun.node.getPosition(),goc ,shotInfo[3],this.actorPropertis.VipId,shotInfo[4],false, shotInfo[6]);
        
        this.ShootBalance();

        return bullet;
     },

     Handle_AutoShooting()
     {        
        
       if(this.TargetFish == null)
       {
         this.TargetFish = this.Handle_FindFishInScreen();
       }
       else
       {
            if(!this.TargetFish.CheckPositionInScreen())
            {
             
                this.TargetFish = this.Handle_FindFishInScreen();
            }
            
            // het goc ban 
            if(!this.MyGun.Handle_AutoForcus_TargetFish(this.TargetFish))
            {           
                this.TargetFish = this.Handle_FindFishInScreen();
            }
            else
            {           
                let rand = Global.RandomNumber(0,100);                  
                if(rand < 5)
                {
                    this.TargetFish = this.Handle_FindFishInScreen();
                }
                else  if(rand < 45)
                {
                  
                    return;
                }
                this.Handle_Shooting();        
            }
           
       }
       
      
    },

     Handle_RandomPointScreen()
     {
        let randX = Global.RandomNumber(-500,500);
        let randY = Global.RandomNumber(-250,250);
        return cc.v2(randX,randY);
     },

     Handle_FindFishInScreen()
     {
      
        let randomFishList =  require("FishCollection").getIns().GetRandomFishInScreenView(cc.winSize.width/2, cc.winSize.height/2);
       
        return randomFishList;
     },  

     MultiPlayer_HandleShooting(cpBullet,bulletId)
     {
        let gunType =  this.actorPropertis.CurrentGunId;
        let createTimeString = require("SyncTimeControl").getIns().convertTimeToString(require("SyncTimeControl").getIns().GetCurrentTimeServer());
                let velocityMain = Global.Helper.GetPositionSliceBySittingId(this.actorPropertis.SittingId , cc.v2(1,1));
                let velocity =  cc.v2(cpBullet.vx * velocityMain.x  , cpBullet.vy * velocityMain.y  );
                let infoJson = null;
                if(gunType != Global.Enum.FISH_TYPE_CONFIG.FREE_BULLET_ID)
                    infoJson = Global.GameLogic.mainActor.actorPropertis.SittingId + "," + velocity.x + "," + velocity.y + "," +  gunType  + "," + bulletId + ","+ createTimeString + "," +  cpBullet.fishIdTarget;
                else infoJson = Global.GameLogic.mainActor.actorPropertis.SittingId + "," + velocity.x + "," + velocity.y + "," +  gunType  + "," + bulletId + ","+ createTimeString + "," +  cpBullet.fishIdTarget + "," + gunType;
                let msg = {};
                msg[1] = infoJson;
                require("SendRequest").getIns().MST_Client_Shot_Ingame(msg);
         
     },
     Handle_ExitsRoom()
     { 
        Global.InGameManager.Handle_ShowBesungWaitingAnimation(this.actorPropertis.SittingId);
        this.MyGun.Handle_DestroyGun();   

     }
       
});  
