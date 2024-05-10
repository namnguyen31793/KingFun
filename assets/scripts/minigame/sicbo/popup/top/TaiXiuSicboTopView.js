/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TaiXiuSicboTopView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            TaiXiuSicboTopListView: cc.TaiXiuSicboTopListView,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU_SICBO;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getTopSessionWinners();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');
        },

        getTopSessionWinners: function () {
            var txsicboGetBigWinnersCommand = new cc.TXSICBOGetBigWinnersCommand;
            txsicboGetBigWinnersCommand.execute(this);
        },

        onTXGetBigWinnersResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.TaiXiuSicboTopListView.resetList();
                this.TaiXiuSicboTopListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.TaiXiuSicboTopListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.TaiXiuSicboMainController.getInstance().destroyTopView();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);