

cc.Class({
    extends: cc.Component,

    properties: {
        imgKey : cc.SpriteFrame,
        imgSpecialGun101 : cc.SpriteFrame,
        imgSpecialGun102 : cc.SpriteFrame,
        imgSpecialGun103 : cc.SpriteFrame,
        
        imgCoin : cc.SpriteFrame,
        imgDiamond : cc.SpriteFrame,
        imgItemIce : cc.SpriteFrame,
        imgItemTarget : cc.SpriteFrame,
        imgItemSpeed : cc.SpriteFrame,
        img1 : cc.Sprite,
        img2 : cc.Sprite,
    },

    ItemRewardView_Init(reward, actor) {
        if(reward.RewardType == Global.Enum.REWARD_TYPE.LIXI) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.imgKey;
            
        }
        else if(reward.RewardType == Global.Enum.REWARD_TYPE.SPECIAL_BULLET) {
            let str = "imgSpecialGun" + (reward.ItemType);
            this.node.getComponent(cc.Sprite).spriteFrame = this[str];
            Global.GameLogic.UseSpecialGun (reward.ItemType, actor.actorPropertis.AccountId);
            this.node.scale = 1;
        }
    },

    ItemRewardView_SetSpinImage(rewardType, itemType) {
        switch(rewardType) {
            case Global.Enum.REWARD_TYPE.INGAME_BALANCE:
                this.node.getComponent(cc.Sprite).spriteFrame = this.imgKey;
                return;
            case Global.Enum.REWARD_TYPE.LIXI:
                this.node.getComponent(cc.Sprite).spriteFrame = this.imgKey;
                return;
            case Global.Enum.REWARD_TYPE.ITEM_INGAME:
                if (itemType == Global.Enum.ITEM_TYPE.ICE) {
                    this.node.getComponent(cc.Sprite).spriteFrame = this.imgItemIce;
                } else if (itemType == Global.Enum.ITEM_TYPE.TARGET) {
                    this.node.getComponent(cc.Sprite).spriteFrame = this.imgItemTarget;
                } else if (itemType == Global.Enum.ITEM_TYPE.SPEED) {
                    this.node.getComponent(cc.Sprite).spriteFrame = this.imgItemSpeed;
                }
                return;
            default:
                return;
        }
    },

    ItemRewardView_SetImage(rewardType, itemType) {
        switch(rewardType) {
            case Global.Enum.REWARD_TYPE.INGAME_BALANCE:
                this.img1.node.active = false;
                this.img2.node.active = true;
                return;
            case Global.Enum.REWARD_TYPE.LIXI:
                this.img1.node.active = true;
                this.img2.node.active = false;
                this.img1.spriteFrame = this.imgKey;
                return;
            case Global.Enum.REWARD_TYPE.ITEM_INGAME:
                this.img1.node.active = true;
                this.img2.node.active = false;
                if (itemType == Global.Enum.ITEM_TYPE.ICE) {
                    this.img1.spriteFrame = this.imgItemIce;
                } else if (itemType == Global.Enum.ITEM_TYPE.TARGET) {
                    this.img1.spriteFrame = this.imgItemTarget;
                } else if (itemType == Global.Enum.ITEM_TYPE.SPEED) {
                    this.img1.spriteFrame = this.imgItemSpeed;
                }
                return;
            default:
                return;
        }
    },
});
