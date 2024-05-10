/**
 * Dat cuoc
 */

(function () {
    cc.TaiXiuBetView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbBetTai: cc.Label,
            lbBetXiu: cc.Label,
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuBetView(this);
            //this.reset();
        },

        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuBetView(null);
        },

        reset: function () {
            this.lbBetTai.string = '';
            this.lbBetXiu.string = '';
        },

        updateBetInfo: function (betInfo) {
            this.betSide = betInfo.BetSide;

            if (betInfo.BetSide === cc.TaiXiuBetSide.TAI) {
                if(betInfo.BetValue == 0)
                    this.lbBetTai.string = '';
                else
                    this.lbBetTai.string = cc.Tool.getInstance().formatNumber(betInfo.BetValue);
            } else {
                if(betInfo.BetValue == 0)   
                    this.lbBetXiu.string = '';
                else
                    this.lbBetXiu.string = cc.Tool.getInstance().formatNumber(betInfo.BetValue);
            }

        },

        getBetSide: function () {
            return this.betSide;
        },
    });
}).call(this);
