
cc.Class({
    extends: cc.Component,
    ctor() {
        this.notifyGame = null;
        this.listItemDiamond = null;
        this.rateJackpot = 0;
        this.jackpotValue = 0;
        this.dataTournament = {};
        this.state = 0;
        this.indexBg = 0;
        this.grandJackpotValue = 0;
        this.showSetting = false;
    },

    properties: {
        btnAuto:cc.Toggle,
        btnChangeGunVip : cc.Toggle,
        ice : cc.Node,
        listActorView:[],
        listGunView:[],
    
        listImgGunSpecial:[cc.SpriteFrame],
        notifySpecial : cc.Node,
        contentItem : cc.Node,
      //  notifyObj : cc.Node,
        background : cc.Sprite,
        btnShowSetting : cc.Node,
        contentSetting : cc.Animation,
        notifySpecialGun : cc.Node,
        btnMusicOn : cc.Node,
        btnMusicOff : cc.Node,
        btnSoundOn : cc.Node,
        btnSoundOff : cc.Node,
        btnPerformentOn : cc.Node,
        btnPerformentOff : cc.Node,
        lbGrand:require("TextJackpot"),
        jackpotContent : cc.Node,
        objGacha : cc.Node,
        blockClickPanel : cc.Node,
        roomId : cc.Label,
        nodeDemo: cc.Node,
        VipGunPopup: cc.Node,
		tabRank : require("RankView"),
    },
    
    start () {
        Global.InGameManager.FishPoolInstance.OtherContainer.width = cc.winSize.width;
        Global.InGameManager.FishPoolInstance.OtherContainer.height = cc.winSize.height;
	
        if(Global.agent == 0){
            this.nodeDemo.active = true;
        }
        this.blockClickPanel.active = false;
        this.VipGunPopup.active = false;
        /*
        Global.Bundle.load("GamePrefabs/Notify", cc.Prefab, (err, prefab) => {
            let node = cc.instantiate(prefab);
            Global.InGameManager.FishPoolInstance.OtherContainer.addChild(node);
            node.setPosition(cc.v2(0,230));
            let notifyLobby = node.getComponent(require("NotifyLobbyView"));
            notifyLobby.Init();
            notifyLobby.mask.opacity = 150;
        })
        */
        this.listActorView = cc.find("Container/ActorInfoContainer", this.node).getComponentsInChildren("Actor");
        this.listGunView = cc.find("Container/GunContainer", this.node).getComponentsInChildren("Gun");
        // 
        /*
        if(CONFIG.MERCHANT != 3)
            Global.AudioManager.PlayMusicInGame();
        else 
            Global.AudioManager.PlayMusicInGame3();
        */
            Global.AudioManager.PlayMusicInGame3();
        
        if(!Global.isOffline) {
          //  this.notifyGame = this.notifyObj.getComponent("NotifyUI");      
            this.dataTournament.listUser = [];
            this.dataTournament.currentFund = 0;
            let roomConfig = require ("PathStore").getIns().getRoomFishSpecialConfig(require("ScreenManager").getIns().roomType.toString());
            if(roomConfig == null || roomConfig.percentCreateJackpot == 0) {
                this.jackpotContent.active = false;
               
            }
            let isMusic = cc.sys.localStorage.getItem("MUSIC_AllWin123465") || 1;
            this.ChangeStatusMuic(isMusic);
            this.ChangeStatusSound(isMusic);
        }
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            cc.resources.load('SpinHub-Fish/Prefabs/Fish3/JackpotInGame', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish3","JackpotInGame", (prefab)=>{
                try{
                let node = cc.instantiate(prefab);
                node.parent = Global.InGameManager.luckyBoxWheelContainer;
                node.setPosition(cc.v2(0,322));    
                node.active = true;
                let jackpotView = node.getComponent("JackpotInGame");
                jackpotView.UpdateJackpotValue(Global.InGameView.jackpotValue);
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        }
        this.eventConfig = require ("PathStore").getIns().getEventConfig(require("ScreenManager").getIns().roomType.toString());
        console.log(this.eventConfig);
        if(this.eventConfig.active && this.eventConfig.active == "1") {
            let show =  cc.sys.localStorage.getItem("KEY_SHOW_EVENT_TET") || "1";
            if(show == "1") {
                Global.UIManager.showGachaEvent();
            } else {
                require("SendRequest").getIns().MST_Client_Event_Get_Account_Info ();
            }
        }

       
        
        
    },

    ClickBtnBack() {       
        this.onClickShowSetting(null,1);
        Global.InGameManager.isAutoAtack = false;
        Global.InGameManager.attackTarget = false;
        Global.InGameManager.isAtack = false;
        this.btnAuto.isChecked = false;
        Global.UIManager.showConfirmPopup("Bạn có muốn thoát phòng chơi không?", ()=>{
            if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
                require("SendRequest").getIns().MST_Client_LeaveRoom();
            } else {
                cc.log("CLICK BACK GAME");
                require("SendRequest").getIns().MST_Client_Get_Account_Balance();
            }
            require("ActorCollection").getIns().Dispose();
            Global.NetworkManager.disconnect();
            setTimeout(() => {
                cc.LobbyController.getInstance().destroyDynamicView(null);
                cc.LobbyController.getInstance().offuserguest(true);
            }, 0)
        });
    },

    PlayEffectTakeItem(itemType) {
        this.contentItem.getComponent(cc.Animation).play("TakeItem"+itemType);
    },

    ClickButtonHelp() {
       // this.contentSetting.node.active = false;
        Global.UIManager.showHelpPopup();
    },

    OffAuto(){
        this.cacheAutoAttack = Global.InGameManager.isTouch;;
        Global.InGameManager.isTouch = false;
        this.btnAuto.isChecked = false;
    },

    OnAuto() {
        if(this.cacheAutoAttack) {
            /*
            Global.InGameManager.isAutoAtack = true;
            Global.InGameManager.isAtack = true;
            */
           Global.InGameManager.isTouch = true;
            this.btnAuto.isChecked = true;
            Global.InGameManager.offEvent();
        }
    },

    onClickChangeGunVip(event, data) {
        if(this.btnChangeGunVip.isChecked) {
            Global.GameLogic.mainActor.UseVipGun();
        } else {
            Global.GameLogic.mainActor.UseNormalGun();
        }
    },

    onClickAutoAtack(event , data){
        //Global.InGameManager.isAutoAtack = this.btnAuto.isChecked;
        Global.InGameManager.isTouch = this.btnAuto.isChecked;
        if(!Global.GameLogic.mainActor.CheckVipGun()) {
            if(Global.InGameManager.isAutoAtack){
                Global.InGameManager.offEvent();
            }else{
                Global.InGameManager.onEvent();
            }
           
            /*
            if(Global.InGameManager.attackTarget) {
                Global.InGameManager.isAtack = true;
            } else {
                Global.InGameManager.isAtack = Global.InGameManager.isAutoAtack;
            }
            */
        } else {
            Global.InGameManager.attackTarget = !Global.InGameManager.isAutoAtack;
        }
        
    },

    onClickShowSetting(event, data) {
        // cc.log(Global.InGameManager.numberFishInScene);
        // Global.UIManager.showLevelPopup(100000,6);
        this.showSetting =  !this.showSetting;
        if(this.showSetting) {
           // this.contentSetting.node.active = true;
            this.contentSetting.play("ShowSetting");
        } else {
            this.contentSetting.play("HideSetting");
            
        }
    },

    onClickShowGunVipPopup(event, data) {
        this.VipGunPopup.active = true;
    },
    OnBlockClick()
    {
        this.blockClickPanel.active = true;
    },
    OffBlockClick()
    {
        this.blockClickPanel.active = false;
    },

    ChangeStatusMuic(value) {
        let active = value == 1 ? true : false;
        this.btnMusicOn.active = active;
        this.btnMusicOff.active = !active;
        Global.AudioManager.ChangeValueMusic(value);
    },

    ChangeStatusSound(value) {
        let active = value == 1 ? true : false;
        this.btnSoundOn.active = active;
        this.btnSoundOff.active = !active;
        Global.AudioManager.ChangeValueMusic(value);
        Global.AudioManager.ChangeValueSound(value);
    },

    onClickButtonMusic(event, data) {
        if(data == 1) {
            this.ChangeStatusMuic(1);
        } else {
            this.ChangeStatusMuic(0);
        }
    },

    onClickButtonSound(event, data) {
        if(data == 1) {
            this.ChangeStatusSound(1);
        } else {
            this.ChangeStatusSound(0);
        }
    },

    onClickDiamondGun(event, data) {
        if(Global.GameLogic.mainActor.actorPropertis.CurrentGunId > 100) {
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("CANNOT_USE_SPECIAL_GUN"));
            return;
        }
        let listItemDiamond = this.listItemDiamond;
        let cost = 0;
        for(let i = 0; i < listItemDiamond.length; i++) {
            let info = JSON.parse(listItemDiamond[i].Package);
            if(data == info[0].ItemType.toString()) {
                cost = listItemDiamond[i].DiamondPrice;
                break;
            }
        }

        Global.UIManager.showConfirmPopup("Bạn có muốn sử dụng "+cost+" Kim Cương để mua vật phẩm này không?", ()=>{
            let msgData = {};
            let id = 0;
            for(let i = 0; i < listItemDiamond.length; i++) {
                let info = JSON.parse(listItemDiamond[i].Package);
                if(data == info[0].ItemType.toString()) {
                    id = listItemDiamond[i].Id;
                    break;
                }
            }
            msgData[1] = id
            msgData[2] = 1;
            require("SendRequest").getIns().MST_Client_Buy_Shop_Package(msgData);
        } );
        
    },
 
    HandleShowNotify(userName, reward, notifyType) {
        this.notifyGame.AddNotify (this.GetTextNotify(userName, reward, "", notifyType), 1, 1);
    },

    GetTextNotify(userName, reward, content, notifyType) {
        let text = "";
        //1-big fish, 2-boomfish, 3-jackpot
        if (notifyType == 1) {
            text = Global.Helper.formatString(Global.MyLocalization.GetText("FP_WIN_BIG_FISH"),[userName, Global.Helper.formatNumber(reward)]);
        } else if (notifyType == 3) {
            text = Global.Helper.formatString(Global.MyLocalization.GetText("FP_TAKE_JACKPOT"),[userName, Global.Helper.formatNumber(reward)]);
        } 
        return text;
    },

    ChangeBackground(isActive = true, indexBackground = -1) {
     
        if(indexBackground == -1) {
            let check = false;
            while(!check) {
                let index = 1;
               
                index = Global.RandomNumber(1, 9);
                if(index != this.indexBg) {
                    check = true;
                    this.indexBg = index;
                }
            }
        } else {
            this.indexBg = indexBackground;
        }      
        cc.resources.load('SpinHub-Fish/Prefabs/BackgroudPrefabs/InGameBg'+this.indexBg, cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadLocalPrefab("Prefabs/BackgroudPrefabs/InGameBg"+this.indexBg,(prefab)=>{
            if(Global.InGameView == null)
                return;
            let bg = cc.instantiate(prefab);
            bg.parent = Global.InGameView.background.node;
            if(!isActive) {
                bg.setSiblingIndex(0);
               
                    if(Global.InGameView.background.node.children[1]) {
                        Global.InGameView.background.node.children[1].runAction(cc.fadeOut(0.5));
                        Global.InGameView.scheduleOnce(()=>{
                            Global.InGameView.background.node.children[1].destroy();
                        }, 0.5);
                    }
                
            }
        });
       





    },

    UpdateListItemDiamond(listData) {
        this.listItemDiamond = listData;
        let child = cc.find("UI/ContentButton/ContentSpecialGun/ContentGun/Item" , this.node).children;
        for(let i = 0; i < listData.length; i++) {
            let info = JSON.parse(listData[i].Package);
            if(info[0].ItemType > 100 && info[0].ItemType < 200) {
                for(let j = 0; j < child.length; j++) {
                    if(child[j].getComponent(cc.Button).clickEvents[0].customEventData == info[0].ItemType.toString()) {
                        cc.find("Cost" , child[j]).getComponent(cc.Label).string = listData[i].DiamondPrice;
                    }
                }
            }
        }
    },

    UpdateJackpotInfo(mini, minor, major, grand) {
        this.lbGrand.StartIncreaseTo(grand);
        this.grandJackpotValue = grand;
        
    },

    ClickShowItem() {
        this.contentItem.active = !this.contentItem.active;
    },

    ClickBtnMinipoker() {
		// if (!Global.isLogin) {
		//   Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
		//   return;
		// }
		Global.UIManager.showMiniPoker();
		// Global.BtnMiniGame.clickMiniPoker();
	},

    //tournament
    SetDataTournament(tourData, rank, userInfo, currentFund) {
        this.dataTournament.tourId = tourData.TournamentId;
        this.dataTournament.startTime = new Date(tourData.StartTime);
        this.dataTournament.endTime = new Date(tourData.EndTime);
        this.dataTournament.userInfo = userInfo;
        this.dataTournament.userInfo.RankId = rank;
        this.dataTournament.userInfo.NickName = cc.LoginController.getInstance().getNickname();
        this.dataTournament.currentFund = currentFund;
    },

    SetTopTournament(list) {
        for(let i = 0; i < list.length; i++) {
            list[i].RankId = i+1;
        }
        if(this.dataTournament.endTime != null) {
            this.tournamentView.SetInfo(list, this.dataTournament.userInfo, this.dataTournament.currentFund, this.dataTournament.startTime, this.dataTournament.endTime);
        }
    },

    ClickTest() {
        // let msgData = {};
        // Global.InGameManager.onEventUsingTarget();
        //     Global.InGameManager.offEvent();
        // msgData [1] = 53;
        // require("SendRequest").getIns().MST_Client_Get_Fish_Reward_Mission_Info ();
        // if(this.state == 0)
        // Global.GameLogic.mainActor.ChangeGun(101);
        // else {
        //     Global.ServerBot.AddSpecialValueFish(MainPlayerInfo.accountId, 30, 0);
        //     Global.ServerBot.modulePlayEffect.PlayEffectLaze(Global.GameLogic.mainActor, 30);
        // }
            
        //     this.state += 1;
        // Global.GameLogic.KillFish(1, MainPlayerInfo.accountId, 100000, 100);
        // this.(false);
        // let fishAffect = require("FishCollection").getIns().GetListFishIdInScene (700, 350);
        //     let data = Global.ServerBot.GetListFishDieByMultiElectric(50, fishAffect);
        // Global.FishingSpecialView.anim.play("StartWheel1");
        Global.GameLogic.TestDrill();
    },

  
    onLoad() { 
        Global.InGameView = this;
    },
    onEnable()
    {
        if(Global.agent == 0) {
            this.roomId.string =  "RoomID;"+Global.RandomNumber(10,82342);;}
        else{
            this.roomId.string =  "RoomID:"+Global.RandomNumber(10,82342);;
        }
    },

    onDestroy() {
        Global.InGameView = null;
        // require("WalletController").getIns().RemoveListener();
    },
   
    TestSpinLuckyBox(){
        Global.GameLogic.PlaySpecialGame(36, 10000, "10", "100.50,1.2,1.25,1.8,0.0,1.10,1.8,1.20,100.75,1.10,1.5,1.8,100.100,1.2,1.5,1.15,0.0,1.8,1.2,1.25,100.200,1.5,1.15,1.2", 6159975);
    },

	ClickShowGacha() {
        // Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("LOCK_FUNTION"));
        if(this.eventConfig.active && this.eventConfig.active == "1") {
            Global.UIManager.showGachaEvent();
        } else {
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("EVENT_END"));
        }	
	},

	ClickShowBag() {
		Global.UIManager.showBag();
	},

	ShowTabRank(){
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.InGameView.tabRank.ShowRank();
	},

	SetInfoTopScore(listData){
		cc.log(listData);
		Global.InGameView.tabRank.SetData(listData);
	},

 
});
