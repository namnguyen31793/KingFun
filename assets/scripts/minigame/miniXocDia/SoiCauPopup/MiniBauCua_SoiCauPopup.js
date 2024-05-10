/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.MiniBauCua_SoiCauPopup = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            MiniBauCuaSoiCauListView: cc.MiniBauCuaSoiCauListView,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
            this.gameController =  require("miniXocDia_Controller").getIns();
            this.gameController.SetSoiCauPopup(this);
         
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
            cc.log("MiniBauCuaGetSoiCauCommand");
            var MiniBauCuaGetSoiCauCommand = new cc.MiniBauCuaGetSoiCauCommand;
            MiniBauCuaGetSoiCauCommand.execute(this);
        },

        onMiniBauCuaGetSoiCauResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.MiniBauCuaSoiCauListView.resetList();
                this.MiniBauCuaSoiCauListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.MiniBauCuaSoiCauListView.resetList();
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
