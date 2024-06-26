/*
 * Generated by BeChicken
 * on 8/12/2019
 * version v1.0
 */
(function () {
    cc.TLMN_AssetsView = cc.Class({
        extends: cc.Component,
        properties: {
            sfAvatarDef: cc.SpriteFrame,
            spLose: [cc.SpriteFrame],//0: cong, 1: ung,
            spGameResult: [cc.SpriteFrame],//0: Cong_Thoi, 1: Cong, 2: Thoi, 3: Bet, 4: Nhat. 5:Toi Trang, 6: Bo luot
            //font
            bmfWin: cc.BitmapFont,
            bmfLose: cc.BitmapFont,
            //Color
            colorDark: cc.Color,
            colorWhite: cc.Color,
            //back
            sfBack: [cc.SpriteFrame],//0: huy roi phong, 1: dk roi phong,
            //SF Vien khi chon bai
            sfBorderCard: cc.SpriteFrame,
            /*
            *   BICH: 0,
                TEP: 13,
                RO: 26,
                CO: 39,
            */
            sfSuitCo: [cc.SpriteFrame],
            sfSuitRo: [cc.SpriteFrame],
            sfSuitTep: [cc.SpriteFrame],
            sfSuitBich: [cc.SpriteFrame],
            sfCardBack: cc.SpriteFrame,

            animationNofity: sp.Skeleton

        },
        onLoad: function () {
            cc.TLMN_Controller.getInstance().setTLMNAssetsView(this);
        },
        onDestroy: function () {
        },
        getWinFont: function () {
            return this.bmfWin;
        },

        getLoseFont: function () {
            return this.bmfLose;
        },
        getAvatarDef: function () {
            return this.sfAvatarDef;
        },
        getNotify: function (type) {
            return this.spGameNotify[type];
        },
        getLose: function (type) {
            return this.spLose[type];
        },

        getSfBack: function (type) {
            return this.sfBack[type];
        },
        //Lay SpriteFrame Ket qua game
        getSfGameResult: function (type) {
            return this.spGameResult[type];
        },
        getSfBorderCard: function () {
            return this.sfBorderCard;
        },
        //Lay SpriteFrame bai sau
        getSfCardBack: function () {
            return this.sfCardBack;
        },
        //Lay sprite bai
        getSpriteCard: function (number, suite) {
            let getSuit = null;
            switch (suite) {
                case cc.TLMNCard.CO:
                    getSuit = this.sfSuitCo;
                    break;
                case cc.TLMNCard.RO:
                    getSuit = this.sfSuitRo;
                    break;
                case cc.TLMNCard.TEP:
                    getSuit = this.sfSuitTep;
                    break;
                case cc.TLMNCard.BICH:
                    getSuit = this.sfSuitBich;
                    break;
            }
            let cardIndex = cc.TLMNCard[number];
            return getSuit[cardIndex];
        },

        //Tao gia tri bai
        getCardValue: function (cardNumber, suit) {
            // gia tri bai
            // chay tu 3 -> 2
            // (gia tri bai - 3)*4 + suit / 13
            // 8 Bich = (8-3)*4 + 0 = 20
            // 8 tep = (8-3)*4 + 13/13 = 21
            return (cardNumber - 3) * 4 + suit / 13;

        },

        getCardValueByNumber: function (value) {
            // get the card value in the suite
            const NUMBER_OF_SUITES = 4;
            const CARDS_IN_SUITE = 13;
            let numericValue = Math.floor(value / NUMBER_OF_SUITES) + 3;
            // get the card suite
            let suiteValue = (value % NUMBER_OF_SUITES) * CARDS_IN_SUITE;
            return this.getSpriteCard(numericValue, suiteValue);

        },

        getColorDark: function () {
            return this.colorDark;
        },

        getColorWhite: function () {
            return this.colorWhite;
        },

        showAllNofity: function (animationName, delayTime) {
            this.animationNofity.node.parent.active = true;
            this.animationNofity.clearTracks();
            this.animationNofity.setToSetupPose();
            this.animationNofity.setAnimation(0, animationName, true);
            if (!cc.game.isPaused()) {
                cc.director.getScheduler().schedule(function () {
                    this.hideNotify();
                }, this, 0, 0, delayTime, false);
            } else {
                this.hideNotify();
            }
        },
        hideNotify: function () {
            this.animationNofity.node.parent.active = false;
        },


    })
}).call(this);