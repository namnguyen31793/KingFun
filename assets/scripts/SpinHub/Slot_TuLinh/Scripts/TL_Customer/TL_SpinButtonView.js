// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("SpinButtonView_V2"), 

    properties: {
        btn_BuyItem_Sub: cc.Button,
        buyItem_Sub : cc.Sprite,
        buyItem_Sub_Sf: [cc.SpriteFrame],

        btn_BuyItem_Plus: cc.Button,
        buyItem_Plus : cc.Sprite,
        buyItem_Plus_Sf: [cc.SpriteFrame],

        btn_Bet_Sub: cc.Button,
        bet_Sub : cc.Sprite,
        bet_Sub_Sf: [cc.SpriteFrame],

        btn_Bet_Plus: cc.Button,
        bet_Plus : cc.Sprite,
        bet_Plus_Sf: [cc.SpriteFrame],
    },

    activeButtonSpin: function (enable) {
        this._super(enable);
        this.activeAllBtn(enable);
    },

    activeAllBtn(enable) 
    {
        this.activeExtraBetBtn(enable);
        this.activeBetBtn(enable);
    },
    activeExtraBetBtn(enable)
    {
        this.btn_BuyItem_Sub.interactable = enable;
        this.btn_BuyItem_Plus.interactable = enable;
        if(enable)
        {
            this.buyItem_Sub.spriteFrame = this.buyItem_Sub_Sf[1];
            this.buyItem_Plus.spriteFrame = this.buyItem_Plus_Sf[1];
        }
        else
        {
            this.buyItem_Sub.spriteFrame = this.buyItem_Sub_Sf[0];
            this.buyItem_Plus.spriteFrame = this.buyItem_Plus_Sf[0];
        }
    },
    activeBetBtn(enable)
    {
        this.btn_Bet_Sub.interactable = enable;
        this.btn_Bet_Plus.interactable = enable;
        if(enable)
        {
            this.bet_Sub.spriteFrame = this.bet_Sub_Sf[1];
            this.bet_Plus.spriteFrame = this.bet_Plus_Sf[1];
        }
        else
        {
            this.bet_Sub.spriteFrame = this.bet_Sub_Sf[0];
            this.bet_Plus.spriteFrame = this.bet_Plus_Sf[0];
        }
    }



});
