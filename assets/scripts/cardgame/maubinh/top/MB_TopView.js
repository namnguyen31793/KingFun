/*
 * Generated by BeChicken
 * on 9/11/2019
 * version v1.0
 */
(function () {
    cc.MB_TopView = cc.Class({
        "extends": cc.Component,
        properties: {
            MB_TopListView: cc.MB_TopListView,
        },

        onEnable: function () {
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                this.getTopSessionWinners();
            }.bind(this), this, 1, 0, delay, false);
        },

        getTopSessionWinners: function () {
            var getWinnersCommand = new cc.MB_WinnerCommand;
            getWinnersCommand.execute(this);
        },

        onMB_GetBigWinnerResponse: function (response) {
            let list = response;
            if(list != null && list.length > 0) {
                // var list = this.exData;
                this.MB_TopListView.resetList();
                this.MB_TopListView.initialize(response);
            }

        },
    });
}).call(this);