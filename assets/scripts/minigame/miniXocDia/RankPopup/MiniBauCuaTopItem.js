// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       lb_Rank : cc.Label,
       Rank_Sprite : sp.Skeleton,
       nickname_lb : cc.Label,
       totalWin: cc.Label
    },

    updateItem: function (item, itemID) {
        cc.log("Update Item");
        this.node.active = true;
        this.lb_Rank.string = itemID + 1;
        this.nickname_lb.string = item.DisplayName;
        this.totalWin.string = cc.Tool.getInstance().formatNumber(item.Award);
        this.Rank_Sprite.node.active = false;
        switch(itemID)
        {
            case 0:
                this.Rank_Sprite.node.active = true;
                this.Rank_Sprite.setSkin('rank1');
                this.Rank_Sprite.setAnimation(0,'animation',true);
                break;
            case 1:
                this.Rank_Sprite.node.active = true;
                this.Rank_Sprite.setSkin('rank2');
                
                break;
            case 2:
                this.Rank_Sprite.node.active = true;
                this.Rank_Sprite.setSkin('rank3');
                this.Rank_Sprite.setAnimation(0,'animation',true);
                break;
            default:
                break;
        }
    }
});
