/**
 * Created by Nofear on 6/7/2017.
 */
import Utils from "../../../scripts/shootFish/common/Utils";
import Tween from "../../../scripts/shootFish/common/Tween";
var netConfig = require("NetConfig");

(function () {
  cc.LobbyView = cc.Class({
    extends: cc.Component,
    properties: {
      //prefab portal

      prefabLoginView: cc.Prefab,
      prefabAccountView: cc.Prefab,

      prefabShopTopupViewBank: cc.Prefab,

      prefabShopCastOutView: cc.Prefab,

      prefabHistoryView: cc.Prefab,

      prefab_SuKienView: cc.Prefab,
      // prefabHistoryViewBank: cc.Prefab,

      setingview: cc.Node,
      showhotrophone: cc.Node,
      showhopthu: cc.Node,
      hotrosdtvn: cc.Node,
      //hotrolivechat: cc.Node,

      prefabEvent: cc.Prefab,
      prefabVQMM: cc.Prefab,

      //event - x2 Nap
      prefabX2Popup: cc.Prefab,
      prefabX2Reward: cc.Prefab,

      //prefab FX summon Dragon
      prefabFxSummonDragon: cc.Prefab,

      //slots chinh
      //prefabShowPercentLoadGame:cc.Prefab,
      lbLoadingEgypt: cc.Label,
      progressBarAquarium: cc.ProgressBar,
      progressBanCa: cc.ProgressBar,
      progressEgypt: cc.ProgressBar,
      progressTK: cc.ProgressBar,
      progressDragonBall: cc.ProgressBar,
      progressCowboy: cc.ProgressBar,
      progressDragonTiger: cc.ProgressBar,
      progressXocXoc: cc.ProgressBar,
      progressTaiXiu: cc.ProgressBar,
      progressTaiXiuMd5: cc.ProgressBar,
      progressTaiXiuSieuToc: cc.ProgressBar,
      progressMiniPoker: cc.ProgressBar,
      progress777: cc.ProgressBar,
      progressTQ: cc.ProgressBar,
      progressPoker: cc.ProgressBar,
      progressThreeCards: cc.ProgressBar,
      progressTLMN: cc.ProgressBar,
      progressTLMNSolo: cc.ProgressBar,
      progressMB: cc.ProgressBar,
      progressBaccarat: cc.ProgressBar,
      progressBauCua: cc.ProgressBar,
      progressLoDe: cc.ProgressBar,
      lbLoadingTK: cc.Label,
      lbLoadingAquarium: cc.Label,
      lbLoadingDragonBall: cc.Label,

      lbLoadingCowboy: cc.Label,

      lbLoadingDragonTiger: cc.Label,
      lbLoadingXocXoc: cc.Label,
      lbLoadingBauCua: cc.Label,
      lbLoadingLoDe: cc.Label,

      //loading new
      lbLoadingMonkey: cc.Label,
      lbLoadingThanTai: cc.Label,
      lbLoadingSonTinh: cc.Label,
      lbLoadingTheWitcher: cc.Label,
      lbLoadingAnKhe: cc.Label,
      lbLoadingTuLinh: cc.Label,
      lbLoadingNguLong: cc.Label,
      lbLoadingCungHy: cc.Label,
      lbLoadingFishSpinHub1: cc.Label,

      //minigame
      lbLoadingTaiXiu: cc.Label,
      lbLoadingTaiXiuMd5: cc.Label,
      lbLoadingTaiXiuSieuToc: cc.Label,
      lbLoadingSicbo: cc.Label,
      lbLoadingMiniPoker: cc.Label,
      lbLoading777: cc.Label,
      lbLoadingTQ: cc.Label,

      //card game
      lbLoadingPoker: cc.Label,
      lbLoadingThreeCards: cc.Label,
      lbLoadingTLMN: cc.Label,
      lbLoadingTLMNSolo: cc.Label,
      lbLoadingMB: cc.Label,
      lbLoadingBaccarat: cc.Label,

      //ban ca
      lbLoadingShootFish: cc.Label,

      nodemanutab: cc.Node,
      nodeLobbys: [cc.Node],
      nodeTopBar: cc.Node,
      nodeSetting: cc.Node,

      //audio
      audioBg: cc.AudioSource,
      toggleAudio: cc.Toggle,
      lbTopVp: cc.Label,
	  
      wvThinhvip: cc.Node,

      nodeEventTop: cc.Node,
      nodeguest: cc.Node,
      //Esports
      lbJpbaucua: cc.Label,
      lbJpxocdia: cc.Label,
      lbLoadingEsport: cc.Label,
      lbLoadingCasino1: cc.Label,
      lbLoadingCasino2: cc.Label,
      lbLoadingCasino3: cc.Label,
      lbLoadingCasino4: cc.Label,
    },
    start() {
      let scale = 100000;
      this.jackpot0 = Utils.randomRangeInt(2000 * scale, 700 * scale);
      this.jackpotMax0 =
        this.jackpot0 + Utils.randomRangeInt(2000 * scale, 400 * scale);
      this.jackpot1 = Utils.randomRangeInt(2000 * scale, 700 * scale);
      Tween.numberTo(this.lbJpbaucua, this.jackpot1, 1);
      Tween.numberTo(this.lbJpxocdia, this.jackpot0, 1);
      // this.updateNext0 = Utils.randomRangeInt(3, 5);
        },
        actWebView: function(){
            this.wvThinhvip.active = !this.wvThinhvip.active;
        },
    // use this for initialization
    onLoad: function () {
      if (cc.sys.isNative && cc.sys.isMobile) {
        jsb.device &&
          jsb.device.setKeepScreenOn &&
          jsb.device.setKeepScreenOn(true);
      }
      this.nodeguest.active = true;
      this.nodemanutab.active = false;
      cc.LobbyController.getInstance().setLobbyView(this);
      this.nodeTaiXiu = null;
      this.nodeTaiXiuMd5 = null;
      this.nodeTaiXiuSieuToc = null;
      this.nodeSicbo = null;
      this.nodeEsport = null;
      this.nodeMiniPoker = null;
      this.node777 = null;
      this.nodeTQ = null;
      this.nodeMiniBauCua = null;
      this.nodeCaoThap = null;
      this.nodeLW = null;
      this.nodeSlotsView = null;
      this.nodeVQMMView = null;
      var tool = cc.Tool.getInstance();
      if (tool.getItem("@onAudioBg") !== null) {
        if (tool.getItem("@onAudioBg") === "true") {
          this.IsOnAudioBg = true;
        } else {
          this.IsOnAudioBg = false;
        }
      } else {
        this.IsOnAudioBg = true;
      }
      this.toggleAudio.isChecked = this.IsOnAudioBg;
    },

    onEnable: function () {
      if (this.IsOnAudioBg) {
        this.audioBg.play();
      } else {
        this.audioBg.stop();
      }
      this.lbTopVp.string = cc.Tool.getInstance().formatNumber(
        cc.LoginController.getInstance().getTopVPResponse()
      );
      if (!cc.LoginController.getInstance().getLoginState()) {
        var tool = cc.Tool.getInstance();
        if (tool.getItem("@isLanding") !== null) {
          if (tool.getItem("@isLanding") === "true") {
            cc.LobbyController.getInstance().showRegisterView();
          }
        }
      }
    },
    livechat: function () {
      cc.sys.openURL(cc.Config.getInstance().liveChat());
    },
    fanpage: function () {
      cc.sys.openURL(cc.Config.getInstance().fanPageFB());
    },
    actsodienthoai() {
      this.showhotrophone.active = !this.showhotrophone.active;
      return;
    },
    actshowhopthu() {
      this.showhopthu.active = !this.showhopthu.active;
      return;
    },

    actsetingview() {
      this.setingview.active = !this.setingview.active;
      return;
    },
    acthotro() {
      this.hotrosdtvn.active = !this.hotrosdtvn.active;
      return;
    },
    acthotrolivechat() {
      this.hotrolivechat.active = !this.hotrolivechat.active;
      return;
    },

    //event X2
    createX2PopupView: function () {
      this.nodeX2Popup = this.createView(this.prefabX2Popup);
    },

    destroyX2PopupView: function () {
      if (this.nodeX2Popup) this.nodeX2Popup.destroy();
    },

    createX2RewardView: function () {
      this.nodeX2Reward = this.createView(this.prefabX2Reward);
    },

    destroyX2RewardView: function () {
      if (this.nodeX2Reward) this.nodeX2Reward.destroy();
    },

    //event san KHO BAU
    createEventPopupView: function () {
      if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
        this.nodeEventPopup = this.createView(this.prefabEventPopup);
      } else {
        this.nodeEventPopup = this.createView(this.prefabEventVNPopup);
      }
    },

    destroyEventPopupView: function () {
      if (this.nodeEventPopup) this.nodeEventPopup.destroy();
    },

    //event san KHO BAU
    createTreasureView: function () {
      this.nodeTreasureView = this.createView(this.prefabTreasure);
    },

    destroyTreasureView: function () {
      if (this.nodeTreasureView) this.nodeTreasureView.destroy();
    },

    //buy carrot
    createBuyCarrotView: function () {
      this.nodeBuyCarrotView = this.createView(this.prefabBuyCarrot);
    },

    destroyBuyCarrotView: function () {
      if (this.nodeBuyCarrotView) this.nodeBuyCarrotView.destroy();
    },

    //chon qua vat ly
    createTreasureGiftView: function () {
      this.nodeTreasureGiftView = this.createView(this.prefabTreasureGift);
    },

    destroyTreasureGiftView: function () {
      if (this.nodeTreasureGiftView) this.nodeTreasureGiftView.destroy();
    },

    //carrot daily bonus popup
    createCarrotDailyBonusView: function () {
      this.nodeCarrotDailyBonusView = this.createView(
        this.prefabCarrotDailyBonus
      );
    },

    destroyCarrotDailyBonusView: function () {
      if (this.nodeCarrotDailyBonusView)
        this.nodeCarrotDailyBonusView.destroy();
    },

    //treasure rule popup
    createTreasureRuleView: function () {
      this.nodeTreasureRuleView = this.createView(this.prefabTreasureRule);
    },

    destroyTreasureRuleView: function () {
      if (this.nodeTreasureRuleView) this.nodeTreasureRuleView.destroy();
    },

    //treasure top popup
    createTreasureTopView: function () {
      this.nodeTreasureTopView = this.createView(this.prefabTreasureTop);
    },

    destroyTreasureTopView: function () {
      if (this.nodeTreasureTopView) this.nodeTreasureTopView.destroy();
    },

    //Fx
    createFxSummonDragon: function () {
      this.nodeFxSummonDragon = this.createView(this.prefabFxSummonDragon);
    },

    destroyFxSummonDragon: function () {
      if (this.nodeFxSummonDragon) this.nodeFxSummonDragon.destroy();
    },
    //end fx

    //Portal Portal Portal
    createLoginView: function () {
      if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
        this.nodeLoginView = this.createView(this.prefabLoginView);
      } else {
        this.nodeLoginView = this.createView(this.prefabLoginView);
      }
    },

    destroyLoginView: function () {
      if (this.nodeLoginView) this.nodeLoginView.destroy();
    },

    //createVQMMView: function () {
    //  if (this.nodeVQMMView === null) {
    //      this.nodeVQMMView = this.createView(this.prefabVQMM);
    //  }
    // },

    // destroyVQMMView: function () {
    //  if (this.nodeVQMMView) {
    //   this.nodeVQMMView.destroy();
    //   this.nodeVQMMView = null;
    // }
    //   },

    createHistoryView: function () {
      // if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3
      //     || cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_2) {
      //     this.nodeHistoryView = this.createView(this.prefabHistoryViewBank);
      // } else {
      //     this.nodeHistoryView = this.createView(this.prefabHistoryView);
      // }

      if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
        //this.nodeHistoryView = this.createView(this.prefabHistoryViewBank);
        this.nodeHistoryView = this.createView(this.prefabHistoryView);
      }

      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },
    createSuKienView: function () {
      cc.log("CREATE SU KIEN VIEW");
      this.nodeSuKienView = this.createView(this.prefab_SuKienView);
    },

    destroyHistoryView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      if (this.nodeHistoryView) this.nodeHistoryView.destroy();
    },

    createAccountView: function () {
      this.nodeAccountView = this.createView(this.prefabAccountView);
      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },

    destroyAccountView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeAccountView) this.nodeAccountView.destroy();
    },

    createSecurityView: function () {
      this.nodeSecurityView = this.createView(this.prefabSecurityView);
      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },

    destroySecurityView: function () {
      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeSecurityView) this.nodeSecurityView.destroy();
    },

    createPopupUpdateUserPassView: function () {
      this.nodePopupUpdateUserPass = this.createView(
        this.prefabPopupUpdateUserPass
      );
    },

    destroyPopupUpdateUserPassView: function () {
      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodePopupUpdateUserPass) this.nodePopupUpdateUserPass.destroy();
    },

    createShopTopupView: function () {
      // if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3) {
      //     this.nodeShopTopupView = this.createView(this.prefabShopTopupViewBank);
      // } else {
      //     this.nodeShopTopupView = this.createView(this.prefabShopTopupView);
      // }

      this.nodeShopTopupView = this.createView(this.prefabShopTopupViewBank);

      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },

    destroyShopTopupView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeShopTopupView) this.nodeShopTopupView.destroy();
      //hide cac node o lobby
    },

    createShopCastOutView: function () {
      // if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3) {
      //     this.nodeShopTopupView = this.createView(this.prefabShopTopupViewBank);
      // } else {
      //     this.nodeShopTopupView = this.createView(this.prefabShopTopupView);
      // }
      console.log("createShopCastOutView:" + 1);
      this.nodeShopCastOutView = this.createView(this.prefabShopCastOutView);

      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },
    offuserguest: function () {
      this.nodeguest.active = false;
    },

    destroyShopCastOutView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeShopCastOutView) this.nodeShopCastOutView.destroy();
      //hide cac node o lobby
    },

    createShopView: function () {
      if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
        // this.nodeShopView = this.createView(this.prefabShopView);
        // this.nodeShopView = this.createView(this.prefabShopViewBank);

        if (
          cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3
        ) {
          this.nodeShopView = this.createView(this.prefabShopViewBank);
        } else {
          this.nodeShopView = this.createView(this.prefabShopView);
        }
      }

      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },

    destroyShopView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeShopView) this.nodeShopView.destroy();
      //hide cac node o lobby
    },

    createEventView: function () {
      this.nodeEventView = this.createView(this.prefabEvent);
    },

    createAppSafeHelpView: function () {
      this.createView(this.prefabAppSafeHelp);
    },

    createDNSHelpView: function () {
      this.createView(this.prefabDNSHelp);
    },

    createUpdateAccountView: function () {
      this.createView(this.prefabUpdateAccount);
    },

    createMoveBBView: function () {
      this.createView(this.prefabMoveBB);
    },
    destroyMoveBBView: function () {
      if (this.prefabMoveBB) this.prefabMoveBB.destroy();
    },

    createBlockBBView: function () {
      this.createView(this.prefabBlockBB);
    },
    
    loadDynamicEsportGame(isBundle, lbLoading, linkLoad, bundle){
      if(this.isLoading)
        return;
      this.isLoading = true;
      var self = this;
      if(lbLoading)
        lbLoading.node.parent.active = true;
      var percent = 0;
      if(!isBundle){
        cc.loader.loadRes( linkLoad,
          function (a, b, c) {
            var tempPercent = Math.round((100 * a) / b);
            //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            if(lbLoading)
              lbLoading.string = `${parseInt((a / b) * 100)}%`;
          },
          function (err, prefab) {
            self.isLoading = false;
            if(lbLoading)
              lbLoading.node.parent.active = false;

            self.nodeEsport = self.createView(prefab);
            //hide cac node o lobby
            self.activeNodeLobby(false);
          }
        );
      }else{
          Global.DownloadManager.LoadPrefab(bundle, linkLoad, (prefab)=>{
            self.isLoading = false;
            lbLoading.node.parent.active = false;
            self.nodeEsport = self.createView(prefab);
            self.activeNodeLobby(false);
          }, 1, function (percent) {
              lbLoading.string = parseInt(percent*100)  + '%';
          }); 
      }
    },

    loadDynamicSlotGame(isBundle, lbLoading, linkLoad, bundle, gameId = 0){
      if(this.isLoading)
        return;
      this.isLoading = true;
      var self = this;
      if(lbLoading)
        lbLoading.node.parent.active = true;
      var percent = 0;
      if(!isBundle){
        cc.loader.loadRes( linkLoad,
          function (a, b, c) {
            var tempPercent = Math.round((100 * a) / b);
            //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            if(lbLoading)
              lbLoading.string = `${parseInt((a / b) * 100)}%`;
          },
          function (err, prefab) {
            self.isLoading = false;
            if(lbLoading)
              lbLoading.node.parent.active = false;

            self.nodeSlotsView = self.createView(prefab);
            //hide cac node o lobby
            self.activeNodeLobby(false);
          }
        );
      }else{
          Global.DownloadManager.LoadPrefab(bundle, linkLoad, (prefab)=>{
            self.isLoading = false;
            if(lbLoading)
              lbLoading.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          }, 1, function (percent) {
              lbLoading.string = parseInt(percent*100)  + '%';
          }); 
      }
    },

    loadDynamicMiniGameGame(isBundle, lbLoading, nodeObj, linkLoad, bundle){
      if(this.isLoading)
        return;
      this.isLoading = true;
      var self = this;
      if(lbLoading)
        lbLoading.node.parent.active = true;
      var percent = 0;
      if(!isBundle){
        cc.loader.loadRes( linkLoad,
          function (a, b, c) {
            var tempPercent = Math.round((100 * a) / b);
            //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            if(lbLoading)
              lbLoading.string = `${parseInt((a / b) * 100)}%`;
          },
          function (err, prefab) {
            self.isLoading = false;
            if(lbLoading)
              lbLoading.node.parent.active = false;
            nodeObj = self.createView(prefab);
          }
        );
      }else{
          Global.DownloadManager.LoadPrefab(bundle, linkLoad, (prefab)=>{
            self.isLoading = false;
            lbLoading.node.parent.active = false;
            nodeObj = self.createView(prefab);
          }, 1, function (percent) {
              lbLoading.string = parseInt(percent*100)  + '%';
          }); 
      }
    },

    loadDynamicCardGame(isBundle, lbLoading, linkLoad, bundle){
      if(this.isLoading)
        return;
      this.isLoading = true;
      var self = this;
      if(lbLoading)
        lbLoading.node.parent.active = true;
      var percent = 0;
      if(!isBundle){
        cc.loader.loadRes( linkLoad,
          function (a, b, c) {
            var tempPercent = Math.round((100 * a) / b);
            //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            if(lbLoading)
              lbLoading.string = `${parseInt((a / b) * 100)}%`;
          },
          function (err, prefab) {
            self.isLoading = false;
            if(lbLoading)
              lbLoading.node.parent.active = false;

            self.nodeSlotsView = self.createView(prefab);
            //hide cac node o lobby
            self.activeNodeLobby(false);
            self.activeNodeTopBar(true);
          }
        );
      }else{
          Global.DownloadManager.LoadPrefab(bundle, linkLoad, (prefab)=>{
            self.isLoading = false;
            lbLoading.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
            self.activeNodeTopBar(true);
            
          }, 1, function (percent) {
              lbLoading.string = parseInt(percent*100)  + '%';
          }); 
      }
    },

    //Tao cac game (prefab load dynamic)
    createDynamicView: function (gameId) {
      switch (gameId) {
        case cc.GameId.SHOOT_FISH:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingShootFish, "shootFish/prefabs/ShootFish", "");
          break;

        case cc.GameId.EGYPT:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingEgypt, "egypt/prefabs/egyptView", "");
          break;

        case cc.GameId.THREE_KINGDOM:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingTK, "tk/prefabs/tkView", "");
          break;

        case cc.GameId.ESPORTS:
          if (this.nodeEsport !== null) return;
          cc.TCGAMINGID = 174;
          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicEsportGame(false, this.lbLoadingEsport, "eports/prefabs/EsportView", "");
          break;
                    
        case cc.GameId.LIVECASINO1:
          if (this.nodeEsport !== null) return;
          cc.TCGAMINGID = 112;
          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicEsportGame(false, null, "eports/prefabs/EsportView", "");
          break;

        case cc.GameId.LIVECASINO2:
          if (this.nodeEsport !== null) return;
          cc.TCGAMINGID = 4;
          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicEsportGame(false, this.lbLoadingCasino2, "eports/prefabs/EsportView", "");
          break;

        case cc.GameId.LIVECASINO3:
          if (this.nodeEsport !== null) return;
          cc.TCGAMINGID = 27;
          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicEsportGame(false, null, "eports/prefabs/EsportView", "");
          break;

        case cc.GameId.LIVECASINO4:
          if (this.nodeEsport !== null) return;
          cc.TCGAMINGID = 27;
          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicEsportGame(false, this.lbLoadingEsport, "eports/prefabs/EsportView", "");
          break;


        case cc.GameId.AQUARIUM:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingAquarium, "aquarium/prefabs/aquariumView", "");
          break;

        case cc.GameId.DRAGON_BALL:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingDragonBall, "dragonball/prefabs/dbView", "");
          break;
        case cc.GameId.AVIATOR:
          cc.log("CREATE AVIATOR GAME");
            if (this.nodeSlotsView !== null) return;
  
            cc.RoomController.getInstance().setGameId(gameId);
            this.loadDynamicSlotGame(false, this.lbLoadingShootFish, "aviator/prefabs/AviatorGame", "");
            break;
        case cc.GameId.COWBOY:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingCowboy, "cowboy/prefabs/cbView", "");
          break;

        case cc.GameId.DRAGON_TIGER:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingDragonTiger, "dragontiger/prefabs/dragonTigerView", "");
          break;

        case cc.GameId.XOC_XOC:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingXocXoc, "xocxoc/prefabs/xocxocView", "");
          break;

        case cc.GameId.TAI_XIU:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeTaiXiu !== null) return;
          
          this.loadDynamicMiniGameGame(false, this.lbLoadingTaiXiu, this.nodeTaiXiu, "taixiu/prefabs/taixiuView", "");
          break;
        case cc.GameId.TAI_XIU_MD5:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeTaiXiuMd5 !== null) return;

          this.loadDynamicMiniGameGame(false, this.lbLoadingTaiXiuMd5, this.nodeTaiXiuMd5, "taixiumd5/prefabs/taixiuMd5View", "");
          break;
        case cc.GameId.TAI_XIU_SIEU_TOC:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeTaiXiuSieuToc !== null) return;

          this.loadDynamicMiniGameGame(false, this.lbLoadingTaiXiuSieuToc, this.nodeTaiXiuSieuToc, "taixiusieutoc/prefabs/taiXiuSieuTocView", "");
          break;
        case cc.GameId.SICBO:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeSicbo !== null) return;

          this.loadDynamicMiniGameGame(false, this.lbLoadingSicbo, this.nodeSicbo, "sicbo/prefabs/SicboView", "");
          break;

        case cc.GameId.MINI_POKER:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeMiniPoker !== null) return;

          this.loadDynamicMiniGameGame(false, this.lbLoadingMiniPoker, this.nodeMiniPoker, "minipoker/prefabs/minipokerView", "");
          break;
        case cc.GameId.SEVEN77:
          //kiem tra da tao roi -> ko tao them
          if (this.node777 !== null) return;

          this.loadDynamicMiniGameGame(false, this.lbLoading777, this.node777, "777/prefabs/777View", "");
          break;

        case cc.GameId.BLOCK_BUSTER:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeTQ !== null) return;

          this.loadDynamicMiniGameGame(false, this.lbLoadingTQ, this.nodeTQ, "tq/prefabs/tqView", "");
          break;
        case cc.GameId.MINI_BAUCUA:
          cc.log("CREATE MINI BAU CUA");
          //kiem tra da tao roi -> ko tao them
          if (this.nodeMiniBauCua !== null) return;
            this.loadDynamicMiniGameGame(false, this.lbLoadingTQ, this.nodeMiniBauCua, "miniXocDia/prefabs/miniXocDiaView", "");
            break;

        //CARD GAME
        case cc.GameId.POKER_TEXAS:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicCardGame(false, this.lbLoadingPoker, "poker/prefabs/pokerView", "");
          break;

        case cc.GameId.BA_CAY:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicCardGame(false, this.lbLoadingThreeCards, "3cay/prefabs/3CLobby", "");
          break;

        case cc.GameId.TIEN_LEN_MN:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicCardGame(false, this.lbLoadingTLMN, "tienlenMN/prefabs/TLMNLobby", "");
          break;

        case cc.GameId.TIEN_LEN_MN_SOLO:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicCardGame(false, this.lbLoadingTLMNSolo, "tienlenMNSoLo/prefabs/TLMNSoLoLobby", "");
          break;

        case cc.GameId.MAU_BINH:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicCardGame(false, this.lbLoadingMB, "maubinh/prefabs/MBLobby", "");
          break;

        case cc.GameId.BACCARAT:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicCardGame(false, this.lbLoadingBaccarat, "bacarat/prefabs/BaCaratView", "");
          break;
        case cc.GameId.BAUCUA:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingBauCua, "baucua/prefabs/BauCuaView", "");
          break;
        case cc.GameId.CAO_THAP:
          cc.log("CREATE CAO_THAP");
          //kiem tra da tao roi -> ko tao them
          if (this.nodeCaoThap !== null) return;
            this.loadDynamicMiniGameGame(false, this.lbLoadingTaiXiu, this.nodeCaoThap, "caothap/prefabs/CaoThapGame", "");
            break;
        case cc.GameId.LODE:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.loadDynamicSlotGame(false, this.lbLoadingLoDe, "lode/prefabs/LoDeLobby", "");
          break;
          
        case cc.GameId.TAY_DU_KY:
            if (this.nodeSlotsView !== null) return;
            //Bat loading
            this.lbLoadingMonkey.node.parent.active = true;
            //truyen game id ben spinhub
            this.loadSlotSpinHub(parseInt(gameId));
            break;
        case cc.GameId.THAN_TAI:
            if (this.nodeSlotsView !== null) return;
            //Bat loading
            this.lbLoadingThanTai.node.parent.active = true;
            //truyen game id ben spinhub
            this.loadSlotSpinHub(parseInt(gameId));
            break;
        case cc.GameId.SON_TINH:
            if (this.nodeSlotsView !== null) return;
            //Bat loading
            this.lbLoadingSonTinh.node.parent.active = true;
            //truyen game id ben spinhub
            this.loadSlotSpinHub(parseInt(gameId));
            break;
        case cc.GameId.THE_WITCHER:
            if (this.nodeSlotsView !== null) return;
            //Bat loading
            this.lbLoadingTheWitcher.node.parent.active = true;
            //truyen game id ben spinhub
            this.loadSlotSpinHub(parseInt(gameId));
            break;
        case cc.GameId.AN_KHE:
            if (this.nodeSlotsView !== null) return;
            //Bat loading
            this.lbLoadingAnKhe.node.parent.active = true;
            //truyen game id ben spinhub
            this.loadSlotSpinHub(parseInt(gameId));
            break;
        case cc.GameId.TU_LINH_SLOT:
            if (this.nodeSlotsView !== null) return;
            //Bat loading
            this.lbLoadingTuLinh.node.parent.active = true;
            //truyen game id ben spinhub
            this.loadSlotSpinHub(parseInt(gameId));
            break;
        case cc.GameId.NGU_LONG:
            if (this.nodeSlotsView !== null) return;
            //Bat loading
            this.lbLoadingNguLong.node.parent.active = true;
            //truyen game id ben spinhub
            this.loadSlotSpinHub(parseInt(gameId));
            break;
        case cc.GameId.CUNG_HY_PHAT_TAI:
            if (this.nodeSlotsView !== null) return;
            //Bat loading
            this.lbLoadingCungHy.node.parent.active = true;
            //truyen game id ben spinhub
            this.loadSlotSpinHub(parseInt(gameId));
            break;
        case cc.GameId.FISH_SPINHUB:
            let FishId = 1;
            var GameId = parseInt(gameId);
            if(GameId == 101)
                FishId = 1;
            else if(GameId == 102){
                FishId = 2;
            }
            this.isLoading = true;
            this.lbLoadingFishSpinHub1.node.parent.active = true;
            Global.startAppTime = new Date();
            require("ScreenManager").getIns().roomType = FishId;
            if (this.nodeSlotsView !== null) return;
            //truyen game id ben spinhub
            this.loadSlotSpinHub(GameId);
            break;
      }
    },

    destroyDynamicView: function (gameId) {
      switch (gameId) {
        case cc.GameId.EVENT_TREASURE:
          if (this.nodeTreasureView) {
            this.nodeTreasureView.destroy();
            this.nodeTreasureView = null;
          }

          if (this.nodeTreasureGiftView) {
            this.nodeTreasureGiftView.destroy();
            this.nodeTreasureGiftView = null;
          }

          if (this.nodeBuyCarrotView) {
            this.nodeBuyCarrotView.destroy();
            this.nodeBuyCarrotView = null;
          }
          break;
        case cc.GameId.TAI_XIU:
          if (this.nodeTaiXiu) {
            this.nodeTaiXiu.destroy();
            this.nodeTaiXiu = null;
          }
          break;
        case cc.GameId.TAI_XIU_MD5:
          if (this.nodeTaiXiuMd5) {
            this.nodeTaiXiuMd5.destroy();
            this.nodeTaiXiuMd5 = null;
          }
          break;
        case cc.GameId.TAI_XIU_SIEU_TOC:
          if (this.nodeTaiXiuSieuToc) {
            this.nodeTaiXiuSieuToc.destroy();
            this.nodeTaiXiuSieuToc = null;
          }
          break;
        case cc.GameId.SICBO:
          if (this.nodeSicbo) {
            this.nodeSicbo.destroy();
            this.nodeSicbo = null;
          }
          break;
        case cc.GameId.MINI_POKER:
          if (this.nodeMiniPoker) {
            this.nodeMiniPoker.destroy();
            this.nodeMiniPoker = null;
          }
          break;
        case cc.GameId.SEVEN77:
          if (this.node777) {
            this.node777.destroy();
            this.node777 = null;
          }
          break;
        case cc.GameId.BLOCK_BUSTER:
          if (this.nodeTQ) {
            this.nodeTQ.destroy();
            this.nodeTQ = null;
          }
          break;
        case cc.GameId.LUCKY_WILD:
          if (this.nodeLW) {
            this.nodeLW.destroy();
            this.nodeLW = null;
          }
          break;
        case cc.GameId.MINI_BAUCUA:
          if (this.nodeMiniBauCua) {
            this.nodeMiniBauCua.destroy();
            this.nodeMiniBauCua = null;
          }
          break;
        case cc.GameId.CAO_THAP:
          if (this.nodeCaoThap) {
            this.nodeCaoThap.destroy();
            this.nodeCaoThap = null;
          }
          break;
        case cc.GameId.ESPORTS:
        case cc.GameId.LIVECASINO1:
        case cc.GameId.LIVECASINO2:
        case cc.GameId.LIVECASINO3:
        case cc.GameId.LIVECASINO4:
            if (this.nodeEsport) {
                this.nodeEsport.destroy();
                this.nodeEsport = null;
            }
            break; 

        default:
          this.activeNodeTopBar(false);
          //bat lai cac node o lobby
          this.activeNodeLobby(true);

          //cc.BannerController.getInstance().switchPage();

          //mac dinh se là cac game slots
          if (this.nodeSlotsView) {
            this.nodeSlotsView.destroy();
            this.nodeSlotsView = null;
          }

          if (this.nodeEventView) {
            this.nodeEventView.destroy();
            this.nodeEventView = null;
          }

          if (this.nodeEventViewTopVP) {
            this.nodeEventViewTopVP.destroy();
            this.nodeEventViewTopVP = null;
          }

          break;
      }
      cc.LobbyController.getInstance().refreshAccountInfo();
    },
    

    loadSlotSpinHub: function (gameId) {
      Global.agent = cc.NetConfigNew.getInstance().CONFIG_GAME.AgentId;
      Global.GameId = gameId;
      Global.uitype = 2;
      cc.RoomController.getInstance().setGameId(gameId);
      cc.log("---show loading connect theo gameid "+Global.GameId)
      //sau nay se call server api lay token
      ApiController.RequestLoginSpinHub(Global.agent, encodeURIComponent(cc.ServerConnector.getInstance().getToken()), (data) => {
          this.HandlelGetConnectInfo(data);
      }, this.ErrorCallBack);
  },
  
  HandlelGetConnectInfo(data){
      //success call LoginSuccess
      if(data == "null" || data == ""){
          cc.log("load error");
      }else{
          // console.log("HandlelGetConnectInfo "+data);
          Global.GetServerLogicAddress = data[0];
          Global.encryptedData = data[1];
          Global.checksum = data[2];
          Global.CookieValue = encodeURIComponent(cc.ServerConnector.getInstance().getToken());

          Global.NetworkManager.init("");
          Global.NetworkManager.connect_sv();
      }
  },
  
  //phan hoi tu cho login photon thanh cong se call vao day
  openSlotSpinHub: function(gameId){
      //off audio lobby
      this.OffAudioBg();
      let msgData = {};
      msgData[1] = Global.GameId;
      switch (gameId.toString()) {
          case cc.GameId.TAY_DU_KY:
            this.loadDynamicSlotGame(true, this.lbLoadingMonkey, "prefabs/SlotTayDuKy", "Slot_TayDuKy");
              break;
          case cc.GameId.SON_TINH:
            this.loadDynamicSlotGame(true, this.lbLoadingSonTinh, "SlotSTTT", "Slot_SonTinh", cc.GameId.SON_TINH);
              break;
          case cc.GameId.AN_KHE:
            this.loadDynamicSlotGame(true, this.lbLoadingAnKhe, "SlotAnKhe", "Slot_AnKhe", cc.GameId.AN_KHE);
              break;
          case cc.GameId.THAN_TAI:
            this.loadDynamicSlotGame(true, this.lbLoadingThanTai, "prefabs/ThanTaiView", "Slot_ThanTai");
              break;
          case cc.GameId.CUNG_HY_PHAT_TAI:
            this.loadDynamicSlotGame(true, this.lbLoadingCungHy, "prefabs/CungHyView", "Slot_CungHy");
              break;
          case cc.GameId.THE_WITCHER:
            this.loadDynamicSlotGame(true, this.lbLoadingTheWitcher, "prefabs/TheWitcherView", "Slot_TheWitcher");
              break;
          case cc.GameId.TU_LINH_SLOT:
            this.loadDynamicSlotGame(true, this.lbLoadingTuLinh, "prefabs/TuLinh_View", "Slot_TuLinh");
            break;
          case cc.GameId.NGU_LONG:
            this.loadDynamicSlotGame(true, this.lbLoadingTuLinh, "SlotNguLong", "Slot_NguLong");
            break;
          case cc.GameId.FISH_SPINHUB:
              var self = this;
              cc.resources.load('SpinHub-Fish/Path/PathFish', cc.TextAsset, (err, textAsset) => {
                  if (err) {
                      console.error("Failed to load TextAsset:", err);
                      return;
                  }
                  require("PathStore").getIns().setInfoData(textAsset.text);
                  require("PathStore").getIns().setInfoConfigFish(textAsset.text);
              });
              this.loadDynamicSlotGame(false, this.lbLoadingFishSpinHub1, "SpinHub-Fish/Prefabs/FishGame", "");
              break;
              //Slot_CungHy/prefabs/CungHyView
      }
      require("SendRequest").getIns().MST_Client_Slot_Get_Game_Config_Info(msgData);
  },

    destroyAllMiniGameView: function () {
      this.destroyDynamicView(cc.GameId.TAI_XIU);
      this.destroyDynamicView(cc.GameId.TAI_XIU_MD5);
      this.destroyDynamicView(cc.GameId.TAI_XIU_SIEU_TOC);
      this.destroyDynamicView(cc.GameId.SICBO);
      this.destroyDynamicView(cc.GameId.MINI_POKER);
      this.destroyDynamicView(cc.GameId.SEVEN77);
      this.destroyDynamicView(cc.GameId.BLOCK_BUSTER);
      this.destroyDynamicView(cc.GameId.LUCKY_WILD);
      this.destroyDynamicView(cc.GameId.ESPORTS);
      this.destroyDynamicView(cc.GameId.LIVECASINO1);
      this.destroyDynamicView(cc.GameId.LIVECASINO2);
      this.destroyDynamicView(cc.GameId.LIVECASINO3);
      this.destroyDynamicView(cc.GameId.LIVECASINO4);
      this.destroyAccountView(cc.GameId.MINI_BAUCUA);
      this.destroyAccountView(cc.GameId.CAO_THAP);
      this.destroyDynamicView(null);
    },

    createView: function (prefab, posY) {
      var nodeView = cc.instantiate(prefab);
      nodeView.parent = this.node;
      if (posY) {
        nodeView.setPosition(0, posY);
      } else {
        nodeView.setPosition(0, 0);
      }

      return nodeView;
    },

     loginSuccess: function () {
			this.nodeguest.active = false;
			this.nodemanutab.active = true;
            // cc.OneSignalController.getInstance().sendTag('AccountID', cc.LoginController.getInstance().getUserId());
            // cc.OneSignalController.getInstance().sendTag('AccountName', cc.LoginController.getInstance().getNickname());

            //cap nhat lai trang thai
            cc.LoginController.getInstance().setLoginState(true);
            //hien UI NickName + avatar
            cc.LobbyController.getInstance().updateUILogin(false);
            //open hub portal
            cc.GameController.getInstance().portalNegotiate();

            cc.LobbyController.getInstance().topBarUpdateInfo();

            //Kiem tra thu chua doc
            cc.LobbyController.getInstance().getMailUnRead();

            //Bat huong dan appSafe sau khi Login + chua tich hopj AppSafe
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();

            if (!cc.DomainController.getInstance().checkErrorDomain()) {
                

                cc.DDNA.getInstance().clientDevice();
                cc.DDNA.getInstance().gameStarted();

                var getChargeDefaultCommand = new cc.GetChargeDefaultCommand;
                getChargeDefaultCommand.execute(this);
            }

           
        },

    //EVENT SAN KHO BAU
    checkHaveDailyBonus: function () {
      var treasureGetCarrotNameKnownCommand =
        new cc.TreasureGetCarrotNameKnownCommand();
      treasureGetCarrotNameKnownCommand.execute(this);
    },

    onTreasureGetCarrotNameKnownResponse: function (response) {
      if (response !== null)
        cc.TreasureController.getInstance().setIsDailyBonus(response.IsInDay); //= true la nhan roi

      //chua nhan thi moi hien
      if (response !== null && !response.IsInDay) {
        cc.LobbyController.getInstance().createCarrotDailyBonusView();
      }
    },

    joinGame: function (gameId) {
      if (cc.LoginController.getInstance().checkLogin()) {
        if (this.isLoading) return;

        if (gameId === undefined) {
          // || gameId === cc.GameId.BLOCK_BUSTER
          //cc.PopupController.getInstance().showMessage('Sắp ra mắt!');
          cc.PopupController.getInstance().showMessage("Sắp ra mắt!");
          return;
        }

        switch (gameId.toString()) {
          case cc.GameId.SHOOT_FISH:
            this.createDynamicView(cc.GameId.SHOOT_FISH);
            break;
        case cc.GameId.ESPORTS:
                        this.createDynamicView(cc.GameId.ESPORTS);
                        break;
        case cc.GameId.LIVECASINO1:
                        this.createDynamicView(cc.GameId.LIVECASINO1);
                        break;
        case cc.GameId.LIVECASINO2:
                        this.createDynamicView(cc.GameId.LIVECASINO2);
                        break;
        case cc.GameId.LIVECASINO3:
                        this.createDynamicView(cc.GameId.LIVECASINO3);
                        break;
        case cc.GameId.LIVECASINO4:
                        this.createDynamicView(cc.GameId.LIVECASINO4);
                        break;            
          //Game slots chinh
          case cc.GameId.EGYPT:
            this.createDynamicView(cc.GameId.EGYPT);
            break;
          case cc.GameId.THREE_KINGDOM:
            this.createDynamicView(cc.GameId.THREE_KINGDOM);
            break;
          case cc.GameId.AQUARIUM:
            this.createDynamicView(cc.GameId.AQUARIUM);
            break;
          case cc.GameId.DRAGON_BALL:
            this.createDynamicView(cc.GameId.DRAGON_BALL);
            break;
          case cc.GameId.BUM_BUM:
            this.createDynamicView(cc.GameId.BUM_BUM);
            break;
          case cc.GameId.COWBOY:
            this.createDynamicView(cc.GameId.COWBOY);
            break;
          case cc.GameId.THUONG_HAI:
            this.createDynamicView(cc.GameId.THUONG_HAI);
            break;
          case cc.GameId.GAINHAY:
            this.createDynamicView(cc.GameId.GAINHAY);
            break;
          //Game mini full màn hình
          case cc.GameId.BACCARAT:
            this.createDynamicView(cc.GameId.BACCARAT);
            break;
          case cc.GameId.MONKEY:
            this.createDynamicView(cc.GameId.MONKEY);
            break;
          case cc.GameId.DRAGON_TIGER:
            this.createDynamicView(cc.GameId.DRAGON_TIGER);
            break;
          case cc.GameId.BAUCUA:
            this.createDynamicView(cc.GameId.BAUCUA);
            break;
          //CARD GAME
          case cc.GameId.XOC_XOC:
            this.createDynamicView(cc.GameId.XOC_XOC);
            break;
          case cc.GameId.POKER_TEXAS:
          case cc.GameId.BA_CAY:
          case cc.GameId.TIEN_LEN_MN:
          case cc.GameId.TIEN_LEN_MN_SOLO:
            if (cc.BalanceController.getInstance().getBalance() < 20000) {
              cc.PopupController.getInstance().showMessage(
                "Bạn không đủ tiền để vào phòng. Tối thiểu cần 10.000"
              );
              return;
            } else {
              this.createDynamicView(gameId.toString());
            }
            break;
          case cc.GameId.MAU_BINH:
		  case cc.GameId.SICBO:        
              this.createDynamicView(gameId.toString());
            break;
          //MINI game
          case cc.GameId.TAI_XIU:
            this.createDynamicView(cc.GameId.TAI_XIU);
            break;
          case cc.GameId.TAI_XIU_MD5:
            this.createDynamicView(cc.GameId.TAI_XIU_MD5);
            break;
          case cc.GameId.TAI_XIU_SIEU_TOC:
            this.createDynamicView(cc.GameId.TAI_XIU_SIEU_TOC);
            break;
          case cc.GameId.SICBO:
            this.createDynamicView(cc.GameId.SICBO);
            break;
          case cc.GameId.MINI_POKER:
            this.createDynamicView(cc.GameId.MINI_POKER);
            break;
          case cc.GameId.MINI_BAUCUA:
            this.createDynamicView(cc.GameId.MINI_BAUCUA);
            break;
          case cc.GameId.SEVEN77:
            this.createDynamicView(cc.GameId.SEVEN77);
            break;
          case cc.GameId.BLOCK_BUSTER:
            this.createDynamicView(cc.GameId.BLOCK_BUSTER);
            break;
          case cc.GameId.LUCKY_WILD:
            this.createDynamicView(cc.GameId.LUCKY_WILD);
            break;

          case cc.GameId.LODE:
            this.createDynamicView(cc.GameId.LODE);
            break;
          case cc.GameId.VIETLOT:
            this.createDynamicView(cc.GameId.VIETLOT);
            break;
          case cc.GameId.MINI_BAUCUA:
            this.createDynamicView(cc.GameId.MINI_BAUCUA);
            break;
          case cc.GameId.AVIATOR:
            this.createDynamicView(cc.GameId.AVIATOR);
            break;
          case cc.GameId.CAO_THAP:
            this.createDynamicView(cc.GameId.CAO_THAP);
            break;
          case "100":
            cc.PopupController.getInstance().showMessage("Sắp ra mắt");
            break;
            
          case cc.GameId.TAY_DU_KY:
          case cc.GameId.SON_TINH:
          case cc.GameId.AN_KHE:
          case cc.GameId.NGU_LONG:
          case cc.GameId.TU_LINH_SLOT:
          case cc.GameId.THAN_TAI:
          case cc.GameId.CUNG_HY_PHAT_TAI:
          case cc.GameId.THE_WITCHER:
          case cc.GameId.FISH_SPINHUB:
              this.createDynamicView(gameId);
              break;
        }
      }
    },

    gamebaitri: function () {
      cc.PopupController.getInstance().showMessage("Sắp ra mắt!");
    },

    gamebaotri: function () {
      cc.PopupController.getInstance().showMessage("Game bảo trì!");
    },

    refreshAccountInfo: function () {
      var getAccountInfoCommand = new cc.GetAccountInfoCommand();
      getAccountInfoCommand.execute(this);
    },

    activeNodeLobby: function (enable) {
      if (enable) {
        this.nodeguest.active = true;
        this.nodemanutab.active = false;
        this.activeNodeTopBar(false);
        this.playAudioBg();
      } else {
        this.nodeguest.active = false;
        this.nodemanutab.active = false;
        this.audioBg.stop();
      }
      this.nodeEventTop.active = enable;
      this.nodemanutab.active = enable;
      this.nodeLobbys.forEach(function (nodeLobby) {
        nodeLobby.active = enable;
      });

      cc.LobbyController.getInstance().setLobbyActive(enable);
    },

    activeNodeTopBar: function (enable) {
      this.nodeTopBar.active = enable;
      this.nodeSetting.active = enable;
      this.nodeTopBar.getComponent(cc.TopBarView).isCardGame = enable;
      if (enable) {
        this.nodeTopBar.zIndex = cc.NoteDepth.TOP_BAR_CARD_GAME;
        this.refreshAccountInfo();
      } else {
        this.nodeTopBar.zIndex = cc.NoteDepth.TOP_BAR;
      }
    },

    //response
    onGetAccountInfoResponse: function (response) {
      if (response !== null) {
        cc.LoginController.getInstance().setLoginResponse(response.AccountInfo);
        cc.LoginController.getInstance().setNextVPResponse(response.NextVIP);
        cc.LoginController.getInstance().setTopVPResponse(response.TopVP);
      }
      cc.LobbyController.getInstance().topBarUpdateInfo();
      this.lbTopVp.string = cc.Tool.getInstance().formatNumber(
        cc.LoginController.getInstance().getTopVPResponse()
      );
    },

     checkVQMMInfo: function () {
          var vqmmGetInfoCommand = new cc.VQMMGetInfoCommand;
      vqmmGetInfoCommand.execute(this);
      },

     onVQMMGetInfoResponse: function (response) {
    //Quantity":1,"IsOpen":false,"Response":0}
       if (response !== null && response.Quantity > 0 && response.IsOpen) {
         this.createVQMMView();
      }
      },

    joinGameClicked: function (event, data) {
      if (cc.LoginController.getInstance().checkLogin()) {
        this.joinGame(data);
        cc.DDNA.getInstance().uiInteraction(
          cc.DDNAUILocation.PORTAL,
          cc.DDNA.getInstance().getGameById(data.toString()),
          cc.DDNAUIType.BUTTON
        );
      }
    },

    setIsAudioBg: function () {
      this.IsOnAudioBg = !this.IsOnAudioBg;
      cc.Tool.getInstance().setItem("@onAudioBg", this.IsOnAudioBg);
      if (this.IsOnAudioBg) this.audioBg.play();
      else this.audioBg.stop();
      this.toggleAudio.isChecked = this.IsOnAudioBg;
    },

    playAudioBg: function () {
      if (this.IsOnAudioBg) {
        this.audioBg.play();
      } else {
        this.audioBg.stop();
      }
    },

    //#region SPINHUB
    HideBtnMiniGame(){
      if(this.btnMiniGame)
          this.btnMiniGame.active = false;  
    },

    ShowBtnMiniGame(){
        if(this.btnMiniGame)
            this.btnMiniGame.active = true;  
    },

    CheckTimeLive: function(startTimeString, endTimeString){
        let currentDate = new Date();
        let currentDateString = currentDate.toISOString().slice(0, 10);
        // Tạo chuỗi thời gian bắt đầu và kết thúc
        let startTime = new Date(currentDateString + "T" + startTimeString);
        let endTime = new Date(currentDateString + "T" + endTimeString);
        // Kiểm tra nếu thời gian bắt đầu lớn hơn thời gian kết thúc (đã qua đêm)
        if (startTime > endTime) {
            // Thêm 1 ngày vào thời gian kết thúc
            endTime.setDate(endTime.getDate() + 1);
        } 
        // Lấy giờ hiện tại
        let now = new Date();
        // Kiểm tra nếu giờ hiện tại nằm trong khoảng giờ từ A đến B
        return now >= startTime && now <= endTime;
    },

    OffAudioBg:function () {     
        this.audioBg.stop();
    },



    playAudioBg: function () {
        if (this.IsOnAudioBg) {
            this.audioBg.play();
        } else {
            this.audioBg.stop();
        }
    },
    //#endregion
  });
}.call(this));
