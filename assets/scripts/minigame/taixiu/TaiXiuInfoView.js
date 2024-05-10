/**
 * Thong tin phien
 */
//fix by Telegram: @sharkdn Chuyên cung cấp mã nguồn sàn BO, viết game Casino, fix game, viết WEBSITE

var taiXiuConfig = require("TaiXiuConfig");
import Utils from "../../../scripts/shootFish/common/Utils";
import Tween from "../../../scripts/shootFish/common/Tween";
var helper = require("Helper");
(function () {
  cc.TaiXiuInfoView = cc.Class({
    extends: cc.Component,
    properties: {
      nodeTornado: cc.Node,
      //animationBigTimer: cc.Animation,

      nodeBGTimer: cc.Node,
      lbSessionID: cc.Label,
      lbBigTimer: cc.Label, //thoi gian to chinh giua
      lbTimer: cc.Label, //thoi gian nho khi dang o man ket qua,
      lbTotalBetTai: cc.Label, //tong tien bet Tai
      lbTotalBetXiu: cc.Label, //tong tien bet Xiu
      lbUserBetTai: cc.Label, //so user bet Tai
      lbUserBetXiu: cc.Label, //so user bet Xiu
      lblTextNotiNewGame: cc.Label,
      nodeMain: cc.Node,
      Jackpot: cc.Label,
      //nodeNewSesion: cc.Node,
      //nodeCanCua: cc.Node,
    },

    onLoad: function () {
      cc.TaiXiuController.getInstance().setTaiXiuInfoView(this);
      this.animationMess = this.lblTextNotiNewGame.node.parent.getComponent(
        cc.Animation
      );
      this.reset();
      this.animationTornado = this.nodeTornado.getComponent(cc.Animation);
      this.Jackpot.string = "0";
    },

    onEnable: function () {
      this.Jackpot.string = "0";
      if (
        cc.sys.isNative &&
        this.nodeMain !== null &&
        this.nodeMain !== undefined
      ) {
        this.nodeMain.scaleX = 1;
        this.nodeMain.scaleY = 1;
      }
    },

    onDestroy: function () {
      cc.TaiXiuController.getInstance().setTaiXiuInfoView(null);
    },

    reset: function () {
      this.isShowTornado1 = false;
      this.isShowTornado2 = false;
      this.isShowTornado3 = false;
      this.currentState = 999;
      this.lastTime = 999;
    },

    updateInfo: function (sessionInfo) {
      //check state de xu ly hien thi
      switch (sessionInfo.CurrentState) {
        //giai doan dat cuoc
        case cc.TaiXiuState.BETTING: //54
          if (this.currentState !== sessionInfo.CurrentState) {
            //goi reset thong tin betInfo
            cc.TaiXiuController.getInstance().resetBetAndResultInfo();
          }
          this.lbBigTimer.node.active = true;
          this.lbTimer.node.active = false;
          this.nodeBGTimer.active = false;
          helper.numberToEfect(this.lbTotalBetTai, sessionInfo.TotalBetTai);
          helper.numberToEfect(this.lbTotalBetXiu, sessionInfo.TotalBetXiu);
          break;
        //giai doan cho ket qua (ko cho dat cuoc)
        case cc.TaiXiuState.END_BETTING:
          let TotalTai = sessionInfo.TotalBetTai;
          let TotalXiu = sessionInfo.TotalBetXiu;
          this.lbBigTimer.node.active = true;
          this.lbTimer.node.active = false;
          this.nodeBGTimer.active = false;
          //return;
          if (TotalTai > TotalXiu) {
            let lechtai = TotalTai - TotalXiu;
            let Cancua = TotalTai - lechtai;
            this.lbTotalBetTai.string =
              cc.Tool.getInstance().formatNumber(Cancua);
            this.lbTotalBetXiu.string =
              cc.Tool.getInstance().formatNumber(Cancua);
          } else {
            let lechxiu = TotalXiu - TotalTai;
            let Cancua = TotalXiu - lechxiu;
            this.lbTotalBetTai.string =
              cc.Tool.getInstance().formatNumber(Cancua);
            this.lbTotalBetXiu.string =
              cc.Tool.getInstance().formatNumber(Cancua);
          }
          break;

        //giai doan ket qua
        case cc.TaiXiuState.RESULT: //15
          this.Jackpot.getComponent(cc.LabelIncrement).tweenValueto(
            sessionInfo.Jackpot
          );
          //dem thoi gian o local
          this.lbBigTimer.node.active = false;
          this.lbTimer.node.active = true;
          this.nodeBGTimer.active = true;
          break;

        //giai doan cho phien moi
        case cc.TaiXiuState.PREPARE_NEW_SESSION:
          //kiem tra neu chua start timer -> start
          cc.TaiXiuController.getInstance().resetBetInfo();
          this.lbBigTimer.node.active = false;
          this.lbTimer.node.active = true;
          this.nodeBGTimer.active = true;

          break;
      }

      //luu lai state hien tai
      this.currentState = sessionInfo.CurrentState;

      //set thong tin
      this.lbSessionID.string = sessionInfo.SessionID;
      this.lbUserBetTai.string = cc.Tool.getInstance().formatNumber(
        sessionInfo.TotalTai
      );
      this.lbUserBetXiu.string = cc.Tool.getInstance().formatNumber(
        sessionInfo.TotalXiu
      );
      this.Jackpot.getComponent(cc.LabelIncrement).tweenValueto(
        sessionInfo.Jackpot
      );
    },

    updateTimerInfo: function (time) {
      //console.log('updateTimer: ' +time);
      switch (this.currentState) {
        case cc.TaiXiuState.BETTING: //54
          if (time === 49) {
            this.animationMess.play("openMessage");
            this.lblTextNotiNewGame.string = "Phiên mới.";
          }

          this.lbBigTimer.string = "00:"+time;
          this.lbTimer.string = "00:"+time;
          if (time <= taiXiuConfig.TIME_FAST) {
            this.nodeTornado.active = false;
            //chua play -> play
            if (this.lastTime !== time) {
              if (!this.isShowTornado2) {
                this.animationTornado.play("iconRotateReverse2x");
                this.isShowTornado2 = false;
              }
            }
          } else if (time <= taiXiuConfig.TIME_ENABLE_TORNADO) {
            this.nodeTornado.active = false;
            //chua play -> play
            if (this.lastTime !== time) {
              if (!this.isShowTornado1) {
                this.animationTornado.play("iconRotateReverse");
                this.isShowTornado1 = false;
              }
            }
          } else {
            this.isShowTornado1 = false;
            this.isShowTornado2 = false;
            this.isShowTornado3 = false;
            //chua play -> play
            if (this.lastTime !== time) {
            }
          }

          break;
        case cc.TaiXiuState.END_BETTING: //15
          //kiem tra thoi gian de dieu chinh animation
          this.nodeTornado.active = false;
          //chua play -> play
          if (this.lastTime !== time) {
            if (!this.isShowTornado3) {
              this.animationTornado.play("iconRotateReverse3x");
              this.isShowTornado3 = false;
            }
          }
          this.lbBigTimer.string = "00:"+time;
          if (time===2){
            this.animationMess.play("openMessage");
            this.lblTextNotiNewGame.string = "Trả tiền cân cửa.";
            //this.nodeCanCua.active = true;
          }
          if (time === 1 || time <= 2) this.lbTimer.string = 15;
          else this.lbTimer.string = "00:"+time;
          break;
        case cc.TaiXiuState.RESULT: //15
          this.lbTimer.string = "00:"+time;
          this.lbBigTimer.node.color = cc.Color.WHITE;
          this.lbBigTimer.string = "00:"+time;
          this.nodeTornado.active = false;
          this.elapsedTime = 0;
          if (time === 10 || time === 5) {
            cc.LobbyController.getInstance().refreshAccountInfo();
          }

          this.isShowTornado1 = false;
          this.isShowTornado2 = false;
          this.isShowTornado3 = false;
          break;

        case cc.TaiXiuState.PREPARE_NEW_SESSION:
          this.lbTimer.string = "00:"+time;
          this.lbBigTimer.node.color = cc.Color.WHITE;
          if (time === 1) {
            this.lbBigTimer.string = "00:51";
          } else {
            this.lbBigTimer.string = "00:"+time;
          }
          this.nodeTornado.active = false;

          this.isShowTornado1 = false;
          this.isShowTornado2 = false;
          this.isShowTornado3 = false;
          break;
      }
      this.lastTime = time;
    },
  });
}.call(this));
