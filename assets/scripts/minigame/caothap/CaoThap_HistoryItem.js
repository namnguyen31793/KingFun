// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.cardValue = 0;
        this.card = 0;
        this.type = 0;
    },

    properties: {
        card_Sprite :  cc.Sprite,
        type_Sprite :  cc.Sprite,
        card_SpriteFrame : [cc.SpriteFrame],
        type_Up_SpriteFrame : [cc.SpriteFrame],
        type_Down_SpriteFrame : [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    show(cardValue,inputType)
    {
        if(cardValue <= 0)
            return;
        this.cardValue = cardValue;
        this.type = cardValue % 4;
        this.card = Math.floor((cardValue - this.type) / 4); 
        this.card_Sprite.spriteFrame = this.card_SpriteFrame[this.card];
        if(inputType == cc.CaoThap_SelectType.DUOI)
            this.type_Sprite.spriteFrame = this.type_Down_SpriteFrame[this.type];
        else
            this.type_Sprite.spriteFrame = this.type_Up_SpriteFrame[this.type];
        this.node.active = true;
    },

    start () {

    },

    // update (dt) {},
});
