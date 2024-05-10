/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.TaiXiuSessionDetailItem = cc.Class({
        "extends": cc.Component,
        properties: {
            lbTime: cc.Label,
            //lbSID: cc.Label,
            lbNickName: cc.Label,
            lbBet: cc.Label,
            lbRefund: cc.Label,
            bg_1 : cc.Node,
            bg_2 : cc.Node,
        },

        updateItem: function(item, itemID) {
            this.bg_1.node.active = false;
            this.bg_2.node.active = false;
            if(item%2 == 0)
                this.bg_1.node.active = true;
            else
                this.bg_2.node.active = true;
            this.lbTime.string = cc.Tool.getInstance().convertUTCTime2(item.CreateTime);
           // this.lbSID.string = cc.Config.getInstance().getServiceNameNoFormat(item.ServiceID);
            this.lbNickName.string = item.UserName;

            this.lbBet.string = cc.Tool.getInstance().formatNumberK(item.Bet);
            this.lbRefund.string = cc.Tool.getInstance().formatNumberK(item.Refund);

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);
