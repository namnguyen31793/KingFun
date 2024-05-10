/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.TaiXiuTopItem = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeBG: cc.Node,
            lbRank: cc.Label,
            //lbSID: cc.Label,
            lbNickName: cc.Label,
            lbTotalWin: cc.Label,
            rankSprite: cc.Sprite,
            rankSprite_Frame : [cc.SpriteFrame]
	
        },

        updateItem: function (item, itemID) {
            this.nodeBG.active = itemID % 2 !== 0;
            var color = cc.Color.WHITE;
            this.lbRank.string = itemID + 1;
           
            if (itemID < 6) {
                this.lbRank.node.active = false;
                this.lbNickName.font = this.fontBold;
                this.rankSprite.node.active = true;
                this.rankSprite.spriteFrame = this.rankSprite_Frame[itemID];
            } 
            //this.lbSID.string = cc.Config.getInstance().getServiceNameNoFormat(item.ServiceID);
            this.lbNickName.string = item.UserName;
            this.lbTotalWin.string = cc.Tool.getInstance().formatNumber(item.Award);

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);