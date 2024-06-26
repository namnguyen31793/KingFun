
var slotsConfig = require('SlotsConfig');

(function () {
    cc.GNBonusGameMultiView = cc.Class({
        "extends": cc.Component,
        properties: {
            btnPicks: [cc.Button],
            spriteDoors: [cc.Sprite],
            spriteResults: [cc.Sprite],
            spriteDoorSkeleton: [sp.Skeleton],

            sfMultipliers: [cc.SpriteFrame],
            sfDoorOpen:  sp.SkeletonData,
        },

        onEnable: function () {
            //start timer
            cc.BonusGameController.getInstance().startTimer();
        },

        pickClicked: function (event, data) {
            //reset timer
            cc.BonusGameController.getInstance().resetTimer();

            //pick 1 phat -> khoa nut pick
            cc.BonusGameController.getInstance().activeButtonQuickPlay(false);
            //Kho ca cac cho pick khac
            this.btnPicks.forEach(function (btnPick) {
                btnPick.interactable = false;
            });

            //send request Hub
            this.position = parseInt(data.toString());

            //
            // cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_BONUS, 2, this.position);

            //Lay du lieu
            var bonusResponse = cc.BonusGameController.getInstance().getData();
            var multiplier = bonusResponse.Multiplier;

            var totalWin = cc.BonusGameController.getInstance().getTotalWin();
            totalWin *= multiplier;

            //update lai tong so tien thang UI
            cc.BonusGameController.getInstance().updateTotalWin(totalWin);
            
            //gan anh tuong ung giai thuong
            var sprite = this.spriteResults[this.position - 1];
            sprite.spriteFrame = this.sfMultipliers[multiplier - 1];
            sprite.node.active = true;

            this.spriteDoorSkeleton[this.position - 1].skeletonData = this.sfDoorOpen;

            var seft = this;
            cc.director.getScheduler().schedule(function () {
                seft.spriteDoors[seft.position - 1].node.active = true;
                seft.spriteDoorSkeleton[seft.position - 1].node.active = false;
            }, this, 0, 0, 0.5, false);

            cc.director.getScheduler().schedule(function () {
                cc.BonusGameController.getInstance().changeView(cc.BonusGameState.RESULT);
            }, this, 0, 0, slotsConfig.TIME_WAIT_MULTIPLIER, false);

            //Chuyen qua man ket qua
            //cc.BonusGameController.getInstance().changeView(cc.BonusGameState.MULTI);
        },
    });
}).call(this);
