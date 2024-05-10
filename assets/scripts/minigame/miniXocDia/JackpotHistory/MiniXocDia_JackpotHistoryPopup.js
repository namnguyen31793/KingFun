/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.MiniXocDia_JackpotHistoryPopup = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            MiniBauCuaJackpotHistoryListView: cc.MiniBauCuaJackpotHistoryListView,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
            this.gameController =  require("miniXocDia_Controller").getIns();
            this.gameController.SetRankPopup(this);
        
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
            cc.log("MiniBauCuaGetJackpotHistoryCommand");
            var MiniBauCuaGetJackpotHistoryCommand = new cc.MiniBauCuaGetJackpotHistoryCommand;
            MiniBauCuaGetJackpotHistoryCommand.execute(this);
        },

        onMiniBauCuaGetJackpotHistoryResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.MiniBauCuaJackpotHistoryListView.resetList();
                this.MiniBauCuaJackpotHistoryListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.MiniBauCuaJackpotHistoryListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                this.gameController.GetAssetManager().Remove_JackpotHistoryPopup();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
