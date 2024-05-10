/**
 * Created by Nofear on 3/14/2019.
 */


(function () {
    cc.Seven77PayLinesView = cc.Class({
        "extends": cc.PayLinesViewBase,
        properties: {

        },

        onLoad: function () {
            cc.Seven77PayLinesController.getInstance().setSeven77PayLinesView(this);
        },

        stopGameEffect: function () {
            cc.Seven77EffectController.getInstance().stopEffect();
        },

        showLine: function () {
            var self = this;
            var prize = this.prizeLines[this.index];
            var items = prize.Items;
            this.showLineID(prize.LineID);
            this.stopHighlight();

            // if (self.iconSkeletons.length > 0) {
            //     items.forEach(function (iconId) {
            //         //self.animationIcons[iconId - 1].play('slotHighlight');
            //         self.iconSkeletons[iconId - 1].setAnimation(0, 'animation', true);
            //     });
            // }

            this.index++;
            if (this.index === this.totalPrizes) {
                this.index = 0;
            }
        },
    });
}).call(this);
