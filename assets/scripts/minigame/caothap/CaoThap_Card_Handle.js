// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        card_SpriteFrame : [cc.SpriteFrame],
        card_SpriteFrame_Blur : [cc.SpriteFrame],
    },

    Get_SpiteByID(cardValue)
    {
        return this.card_SpriteFrame[cardValue];
    },
    Get_SpriteByID_Blur(cardValue)
    {
        return this.card_SpriteFrame_Blur[cardValue];
    },
    Get_Random_Blur()
    {
        let randomValue = Global.RandomNumber(0,this.card_SpriteFrame_Blur.length);
        return this.card_SpriteFrame_Blur[randomValue];
    }
});
