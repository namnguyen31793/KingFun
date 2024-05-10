/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TaiXiuMd5GraphView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            TaiXiuMd5Graph100View: cc.TaiXiuMd5Graph100View,
            TaiXiuMd5GraphCatCauView: cc.TaiXiuMd5GraphCatCauView,
            TaiXiuMd5GraphDiceSumView: cc.TaiXiuMd5GraphDiceSumView,
            TaiXiuMd5GraphDice3View: cc.TaiXiuMd5GraphDice3View,

            pageView: cc.PageView,
            btnNext: cc.Button,
            btnBack: cc.Button,

            lbTotalTai: cc.Label,
            lbTotalXiu: cc.Label,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.timeSwitchPage = 0.3;
            this.totalPages = 2;
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            this.checkStatusButton();
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU_MD5;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getSoiCau();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');

            //set tam du lieu de demo
        },

        getSoiCau: function () {
            var txmd5GetSoiCauCommand = new cc.TXMD5GetSoiCauCommand;
            txmd5GetSoiCauCommand.execute(this)
        },

        onTXGetSoiCauResponse: function (list) {
            /*
            {
                "SessionId": 173183,
                "FirstDice": 4,
                "SecondDice": 2,
                "ThirdDice": 4,
                "DiceSum": 10,
                "BetSide": 1,
                "CreatedDate": "2019-04-04T07:10:44.94"
              }
            * */

            var countTai = this.TaiXiuMd5Graph100View.draw(list);
            this.lbTotalTai.string = countTai;
            this.lbTotalXiu.string = 100 - countTai;
            this.TaiXiuMd5GraphCatCauView.draw(list);

            this.TaiXiuMd5GraphDiceSumView.draw(list);
            this.TaiXiuMd5GraphDice3View.draw(list);
        },

        pageEvent: function () {
            this.checkStatusButton();
        },

        closeClicked: function () {
            //reset truoc khi close cho ko lag
            this.TaiXiuMd5Graph100View.resetDraw();
            this.TaiXiuMd5GraphCatCauView.resetDraw();
            this.TaiXiuMd5GraphDiceSumView.resetDraw();
            this.TaiXiuMd5GraphDice3View.resetDraw();

            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.TaiXiuMd5MainController.getInstance().destroyGraphView();
            }, this, 1, 0, delay, false);
        },

        nextPageClicked: function() {
            this.currentPageIndex++;
            this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            this.checkStatusButton();
        },

        backPageClicked: function() {
            this.currentPageIndex--;
            this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            this.checkStatusButton();
        },

        checkStatusButton: function () {
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            if (this.currentPageIndex <  this.totalPages - 1) {
                this.btnNext.interactable = true;
            } else {
                this.btnNext.interactable = false;
            }

            if (this.currentPageIndex > 0) {
                this.btnBack.interactable = true;
            } else {
                this.btnBack.interactable = false;
            }
        },
    });
}).call(this);
