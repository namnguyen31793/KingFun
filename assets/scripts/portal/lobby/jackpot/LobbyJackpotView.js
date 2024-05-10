/**
 * Created by Nofear on 6/7/2017.
 */

var portalConfig = require('PortalConfig');

(function () {
    cc.LobbyJackpotView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbiEgypts: [cc.LabelIncrement],
            lbiThreeKingdoms: [cc.LabelIncrement],
            lbiAquariums: [cc.LabelIncrement],
            lbiDragonBalls: [cc.LabelIncrement],
            lbiBumBums: [cc.LabelIncrement],
            lbiCowboys: [cc.LabelIncrement],

            lbiMiniPokers: [cc.LabelIncrement],
            lbi777s: [cc.LabelIncrement],
            lbiBlockBusters: [cc.LabelIncrement],

            lbiShootFishs: [cc.LabelIncrement],
        },

        onLoad: function () {
            this.mount = 0;
            cc.LobbyJackpotController.getInstance().setLobbyJackpotView(this);

            this.getJackpot();
            this.isPauseUpdateJackpot = false;
            cc.director.getScheduler().schedule(this.getJackpot, this, portalConfig.TIME_GET_JACKPOT, cc.macro.REPEAT_FOREVER, 0, this.isPauseUpdateJackpot);
        },

        getJackpot: function () {
            var getJackpotInfoCommand = new cc.GetJackpotInfoCommand;
            getJackpotInfoCommand.execute(this, cc.GameId.ALL);
        },

        onGetJackpotInfoResponse: function (response) {
            if (response !== null) {
                var self = this;
                //var gameListData = lobbyJackpotData.GameList;
                var gameListData = response.GameList;
                cc.LobbyJackpotController.getInstance().setJackpotResponse(gameListData);

                if (gameListData)
                gameListData.forEach(function (game) {
                    var roomIndex = game.RoomID - 1;

                    var jackpotFund = game.JackpotFund;
                    
                switch (game.GameID.toString()) {
                    case cc.GameId.EGYPT:
                        if (roomIndex<self.lbiEgypts.length)
                        self.lbiEgypts[roomIndex].tweenValueto(jackpotFund);
                        break;

                    case cc.GameId.THREE_KINGDOM:
                        if (roomIndex<self.lbiThreeKingdoms.length)
                        self.lbiThreeKingdoms[roomIndex].tweenValueto(jackpotFund);
                        break;

                    case cc.GameId.AQUARIUM:
                        if (roomIndex<self.lbiAquariums.length)
                        self.lbiAquariums[roomIndex].tweenValueto(jackpotFund);
                        break;

                    case cc.GameId.DRAGON_BALL:
                        if (roomIndex<self.lbiDragonBalls.length)
                        self.lbiDragonBalls[roomIndex].tweenValueto(jackpotFund);
                        break;

                    case cc.GameId.COWBOY:
                        if (roomIndex<self.lbiCowboys.length)
                        self.lbiCowboys[roomIndex].tweenValueto(jackpotFund);
                        break;
                    case cc.GameId.SEVEN77:
                        if (roomIndex<self.lbi777s.length)
                            self.lbi777s[roomIndex].tweenValueto(jackpotFund);
                        break;
                
                    case cc.GameId.MINI_POKER:
                        if (roomIndex<self.lbiMiniPokers.length)
                            self.lbiMiniPokers[roomIndex].tweenValueto(jackpotFund);
                        break;
                
                    case cc.GameId.BLOCK_BUSTER:
                        if (roomIndex<self.lbiBlockBusters.length)
                            self.lbiBlockBusters[roomIndex].tweenValueto(jackpotFund);
                        break;
                    }
                });
            }
        },

        convertGameIdToIndex: function (gameId) {
            switch (gameId) {
                case cc.GameId.EGYPT:
                    return 0;
                    break;
                case cc.GameId.THREE_KINGDOM:
                    return 1;
                    break;
                case cc.GameId.MINI_POKER:
                    return 2;
                    break;
                case cc.GameId.SEVEN77:
                    return 3;
                    break;
            }
        },

        pauseUpdateJackpot: function (isPause) {
            this.isPauseUpdateJackpot = isPause;
            if (isPause) {
                this.unscheduleAllCallbacks();
            } else {
                cc.director.getScheduler().schedule(this.getJackpot, this, portalConfig.TIME_GET_JACKPOT, cc.macro.REPEAT_FOREVER, 0, this.isPauseUpdateJackpot);
            }
        }
    });
}).call(this);