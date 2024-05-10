// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       session_Lb : cc.Label,
       luckyNumber_Lb : cc.Label,
       Dice_1 : cc.Sprite,
       Dice_2 : cc.Sprite,
       Dice_3 : cc.Sprite,
       Dice_spriteFrame : [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    updateItem(item,itemID)
    {
        this.session_Lb.string = "#"+item.SessionID;
        this.luckyNumber_Lb.string = cc.Tool.getInstance().formatJackpotNumber(item.LuckyNumber);
        this.Dice_1.spriteFrame = this.Dice_spriteFrame[item.FirstDice-1];
        this.Dice_2.spriteFrame = this.Dice_spriteFrame[item.SecondDice-1];
        this.Dice_3.spriteFrame = this.Dice_spriteFrame[item.ThirdDice-1];
    }
});
