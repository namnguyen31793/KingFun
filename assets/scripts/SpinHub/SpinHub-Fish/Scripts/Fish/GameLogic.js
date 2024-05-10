const FishingSpecialManager = require("FishingSpecialManager");
var ActorCollection = require("ActorCollection").getIns();
var BulletCollection = require("BulletCollection").getIns();
var FishCollection = require("FishCollection").getIns();
var GameLogic = cc.Class({
	statics: {
        getIns() {
            if (this.self == null) this.self = new GameLogic();
            return this.self;
        }
    },
    ctor() {
        this.listItemDiamond = null;
        this.roomProperties = null;
        this.mainActor = null;
        this.unTimeSecond = 0;
        this.startTimeSecond = 0;
        this.isCheckIce = false;
        this.kraken = null;
    },

    CreateIngameNormal(mainActorProperties, listActorProperties, jackpotValue, roomPorperties) {
       
        // require("WalletController").getIns().init();
        ActorCollection.Init();
        FishCollection.Init();
        this.roomProperties = roomPorperties;
        this.mainActor = ActorCollection.CreateMainActor(mainActorProperties);
        ActorCollection.CreateListActorByActorProperties(listActorProperties, mainActorProperties);
        let msgData = {};
        msgData[1] = mainActorProperties.CurrentGunId;
        require("SendRequest").getIns().MST_Client_Get_Jackpot_Info(msgData);
        Global.InGameManager.RequestGetJackpot();
      
    },

    LeaveRoom(accountBalance) {
        if(this.mainActor == null || this.mainActor.actorPropertis == null)
            return;
        let luckyMoney = accountBalance-this.mainActor.actorPropertis.AccountBalance;
        cc.log("RESPONSE AccountBalance : "+accountBalance);
        cc.log("RESPONSE this.mainActor.actorPropertis.AccountBalance : "+this.mainActor.actorPropertis.AccountBalance);
        if(luckyMoney > 0) {
            Global.UIManager.ShowLuckyMoney(luckyMoney, accountBalance);
        } else {
            cc.BalanceController.getInstance().updateRealBalance(accountBalance);
            cc.BalanceController.getInstance().updateBalance(accountBalance);
            // require("WalletController").getIns().UpdateTotal(accountBalance);
            FishCollection.listPreCreateFish = {};
            FishCollection.listFish = {};
            require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
        }
    },

    CreateOtherJoinRoom(otherActor) {
    
        ActorCollection.CreateActorByActorProperties(otherActor, this.mainActor.actorPropertis);
    },

    OtherExitRoom(actorProperties) {
        ActorCollection.RemoveActor(actorProperties.AccountId);
    },

    StopBot(accountId) {
        let actor = ActorCollection.GetActorByPlayerId(accountId);
        if(actor === null || actor.node === null)
            return;
        let actorBot = actor.node.getComponent("ActorBot");
        if(actorBot === null)
            return; 
        actorBot.Stop();
    },

    CreateFish(listFishProperties) {
        if(listFishProperties.length == 0)
            return;
       
        for (let i = 0; i < listFishProperties.length; i++)
        {
            if (listFishProperties [i].FishType ==Global.Enum.FISH_TYPE_CONFIG.JACKPOT_TYPE) {
                FishCollection.ClearSpecialFish (CONFIG.JACKPOT_TYPE);
                Global.AudioManager.PlayStartJackpotAudio();
                Global.InGameManager.creatEffectStartJackpot();
            }
            if (listFishProperties [i].FishType ==Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE) {
                Global.InGameManager.creatEffectStartKraken(2);
            }         
            if (listFishProperties [i].FishType ==Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GOD_OF_WEALTH) {
                Global.InGameManager.creatEffectStartGodJackpot(0);
            }
        //    if(listFishProperties [i].FishType == 101)
                FishCollection.CreateFish (listFishProperties[i]);
        }
		// */
		if(!this.isCheckIce) {
			this.isCheckIce = true;
			this.CheckIce();
		}
    },

    ChangeGun(newGunId, playerId) {
        let actor = ActorCollection.GetActorByPlayerId(playerId);
        if (actor != null) {
            actor.ChangeGun(newGunId);
            if(playerId == this.mainActor.actorPropertis.AccountId) {
                let msgData = {};
                msgData[1] = newGunId;
             
                require("SendRequest").getIns().MST_Client_Get_Jackpot_Info(msgData);
            }
        }
            
    },

 
   
    KillFish(killedFishId, playerId, fishValue, heso = null,rewardDescription)
    {
        if(rewardDescription !== null)
     
        if(fishValue <= 0)
            return;
        let actor = ActorCollection.GetActorByPlayerId(playerId);
        if(actor == null)
            return;
        if(Global.ServerBot != null)
            Global.ServerBot.ServerKillFish(killedFishId);
        let killedFish = FishCollection.GetFishById(killedFishId);
            if(killedFish == null)
            {
               cc.log("KR111");
            return;
            }
        Global.AudioManager.PlayKillFish();      
        killedFish.reoveFishHaveEffect(fishValue, actor,rewardDescription,heso);    

      
    },

   

    ClearAllNormalFish() {
        FishCollection.RemoveListFishNormalRedundancy ();
        // Singleton<UIManager>.Instance.InGameView.HideMark ();
    },

    ClearSpecialFish(fishType) {
        if(fishType ==Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE && this.kraken != null) {
            this.kraken.DeleteKraken();
        } else {
            FishCollection.ClearSpecialFish (fishType);
        }
        
    },

    NotFindFish(fishId) {
        let fish = FishCollection.GetFishById(fishId);
        if (fish != null) {
            if (fish.currentFishStatus == 2) {
                FishCollection.RemoveFishReduncy(fishId);
            }
        }
    },

 
    SetFishDie(accountId, fishId, multi) {
        let killActor = ActorCollection.GetActorByPlayerId(accountId);
        let killedFish = FishCollection.GetFishById(fishId);
        let reward = multi * killActor.GetMoneyPerShotByCurrentGunId();
        if (killedFish != null) {        
            killedFish.reoveFishHaveEffect ();
            Global.InGameManager.FishPoolInstance.createScore(killedFish.node.getPosition(), reward, this.mainActor.actorPropertis.AccountId == accountId);
        }
    },

    KillBoomFish(accountId, totalReward, deathFishIds) {
     
      
        let killActor = ActorCollection.GetActorByPlayerId(accountId);
       
        this.Handle_KillMultiFish(killActor,deathFishIds)
        /*
        if (killActor != null) {
        killActor.scheduleOnce(()=>{
                killActor.UpdateBalance(totalReward, true);
            } , 1.5);
        }
        */
        
    },

    Handle_KillMultiFish(killActor,deathFishIds)
    {
        let listFish = [];
        for (let i = 0; i < deathFishIds.length; i++) {
            let killedFish = FishCollection.GetFishById(deathFishIds[i]);
            if (killedFish == null)     
            {                    
                continue;
            }
               
                killedFish.reoveFishHaveEffect (null,killActor);
                listFish[listFish.length] = killedFish;                         
        }
        return listFish;
    },

   

    Directly_UpdateBalance(playerId, accountBalance)
    {
        if (playerId != this.mainActor.actorPropertis.AccountId) {
            let actor = ActorCollection.GetActorByPlayerId (playerId);
            if (actor != null) {
                actor.Directly_SetAccountBalance(accountBalance);
            }
        } else {
            cc.log("UPDATE BALANCE this.mainActor.UpdateBalance");
            this.mainActor.Directly_SetAccountBalance(accountBalance);
            // this.mainActor.SetAccountBalance( accountBalance);
        }
    },
                
   

    UpdateBalane(playerId, accountBalance, money) {
        if (playerId != this.mainActor.actorPropertis.AccountId) {
            let actor = ActorCollection.GetActorByPlayerId (playerId);
            if (actor != null) {
                actor.SetAccountBalance(accountBalance);
            }
        } else {
            cc.log("UPDATE BALANCE this.mainActor.UpdateBalance");
            this.mainActor.UpdateBalance(money, true);
            // this.mainActor.SetAccountBalance( accountBalance);
        }
    },

    UpdateDiamond(playerId, diamond) {
        if (playerId != this.mainActor.actorPropertis.AccountId) {
            let actor = ActorCollection.GetActorByPlayerId (playerId);
            if (actor != null) {
                actor.SetDiamondBalance(diamond);
            }
        } else {
            this.mainActor.SetDiamondBalance( diamond);
        }
    },

    NotifyInGame(notifyData) {
        let description = "";
        //1-big fish, 2-boomfish, 3-jackpot
        if (notifyData.NoticationType == 3) {
            Global.InGameView.HandleShowNotify (notifyData.NickName, notifyData.Reward, 3);
        } else if (notifyData.NoticationType == 1) {
            Global.InGameView.HandleShowNotify (notifyData.NickName, notifyData.Reward, 1);
        } else if (notifyData.NoticationType == 2) {
            Global.InGameView.HandleShowNotify (notifyData.NickName, notifyData.Reward, 2);
        }
    },
    
    //item
    TakeItemInfo(itemInfo, fishId, playerId) {
        let killedFish = FishCollection.GetFishById(fishId);
        let killActor = ActorCollection.GetActorByPlayerId(playerId);
        Global.InGameManager.FishPoolInstance.createItem(itemInfo.ItemType, killedFish.node.getPosition(), killActor, itemInfo.Amount);
        require("SendRequest").getIns().MST_Client_Event_Get_Account_Info ();
    },

    UseItemIce(UnTimeSkipDate) {
        let unTimeSkipForClient = require("SyncTimeControl").getIns().convertTime(UnTimeSkipDate);
        Global.InGameManager.SetIce(unTimeSkipForClient.getTime() - new Date().getTime());// require("SyncTimeControl").getIns().GetCurrentTimeServer());
        FishCollection.StopAnimation();
    },

    CheckIce() {
        let serverTime = new Date().getTime();// require("SyncTimeControl").getIns().GetCurrentTimeServer();
        let freezeTime = 0;
        if (this.unTimeSecond > 0 && this.unTimeSecond > serverTime) {
            FishCollection.SyncIce ((serverTime - this.startTimeSecond)/1000);
            Global.InGameManager.node.getComponent("FishTimer").HandleCheckListFish (true);
            Global.InGameManager.SetIce (this.unTimeSecond - serverTime);
            FishCollection.StopAnimation();
            this.unTimeSecond = 0;
            this.startTimeSecond = 0;
        }
    },

    BuyShopSuccess(data, accountBalance, diamondBalance) {
        this.mainActor.SetDiamondBalance (diamondBalance);
        // Global.MainPlayerInfo.diamondBalance = diamondBalance;
        this.mainActor.SetAccountBalance(accountBalance);
        let info = JSON.parse(data);
       
        let msg = {};
        msg[1] = info.ItemType;
        require("SendRequest").getIns().MST_Client_Use_Item(msg);
    },

    //special game
    ShowSpecialGame(fishType, accountId, nextInfoTurnStr) {
        let killActor = ActorCollection.GetActorByPlayerId(accountId);
        let nextInfoTurn = "";
        if(fishType ==Global.Enum.FISH_TYPE_CONFIG.LUCKY_BOX_TYPE){
            nextInfoTurn = nextInfoTurnStr;
        }else{
            nextInfoTurn = JSON.parse(nextInfoTurnStr);
        }
        if(killActor != null) {
            FishingSpecialManager.getIns().ShowSpecialGame(fishType, accountId, nextInfoTurn);
        }
    },

    PlaySpecialGame(accountId, reward, result, nextInfoTurnStr, accountBalance, fishType) {
        let killActor = ActorCollection.GetActorByPlayerId(accountId);
        if(killActor != null) {
            FishingSpecialManager.getIns().PlaySpin(killActor, reward, result, nextInfoTurnStr, accountBalance, fishType);
        }
    },

    //special gun
    ShowSpecialGun(fishType, accountId, fishValue, modelInfoString) {
        let killActor = ActorCollection.GetActorByPlayerId(accountId);
        if(killActor != null) {
            FishingSpecialManager.getIns().ShowSpecialGame(fishType, accountId, modelInfoString);
            if(fishType ==Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE) {
                let msgData = {};
                msgData [1] =Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE;
                require("SendRequest").getIns().MST_Client_Special_Gun_Play_Turn (msgData);
            }
        }

    },

    PlaySpecialGun(accountId, fishType, reward, result, nextInfoTurnStr, accountBalance) {
        let killActor = ActorCollection.GetActorByPlayerId(accountId);
        if(killActor != null) {
            if(fishType ==Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE) {
                killActor.cacheReward = reward;
                killActor.cacheBalance = accountId;
            } else if(fishType ==Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE) {
                Global.ServerBot.AddSpecialValueFish(accountId, reward/killActor.GetMoneyPerShotByCurrentGunId(), 0.7);
                killActor.PlaySpecialGun();
            } else if(fishType ==Global.Enum.FISH_TYPE_CONFIG.LAZE_FISH_TYPE) {
              
                Global.ServerBot.AddSpecialValueFish(accountId, reward/killActor.GetMoneyPerShotByCurrentGunId(), 0);
                killActor.PlaySpecialGun();
            }
        }
    },

    //jackpot
    UpdateJackpotInfo(mini, minor, major, grand) {
        if(Global.InGameView == null)
            return;
        Global.InGameView.UpdateJackpotInfo(mini, minor, major, grand);
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            let fishJackpot = FishCollection.GetFishByType(CONFIG.TYPE_FISH_GOD_OF_WEALTH);
            if(fishJackpot) {
                fishJackpot.UpdateJackpotValue(grand);
            }
            Global.InGameView.jackpotValue = grand;
            if(Global.JackpotInFish)
                Global.JackpotInFish.UpdateJackpotValue(grand);
        }
    },

    //sammurai
    GetFishSammurai() {
        let sammurai = FishCollection.FindSammuraiFish();
        return sammurai;
    },

  
});
module.exports = GameLogic;