/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.miniXocDia_RankPopup = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            MiniBauCuaTopListView: cc.miniBauCuaTopListView,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
            this.gameController =  require("miniXocDia_Controller").getIns();
            this.gameController.SetRankPopup(this);
            cc.log("ONLOAD - RankPopup");
        },

        onEnable: function () {
            cc.log("getTopSessionWinners");
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getTopSessionWinners();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');
        },

        getTopSessionWinners: function () {
            cc.log("getTopSessionWinners");
            var MnBauCuaGetBigWinnersCommand = new cc.MiniBauCuaGetBigWinnersCommand;
            MnBauCuaGetBigWinnersCommand.execute(this);
        },

        onMiniBauCuaGetBigWinnersResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.MiniBauCuaTopListView.resetList();
                this.MiniBauCuaTopListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.MiniBauCuaTopListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                this.gameController.GetAssetManager().RemoveRankPopup();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
