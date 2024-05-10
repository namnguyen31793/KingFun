// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("SpinButtonView_V2"), 

    properties: {
        btn_Bet_Sub: cc.Button,
        bet_Sub : cc.Sprite,
        bet_Sub_Sf: [cc.SpriteFrame],

        btn_Bet_Plus: cc.Button,
        bet_Plus : cc.Sprite,
        bet_Plus_Sf: [cc.SpriteFrame],

        btn_FastSpin : cc.Button,
        btn_FastSpin_Off_Sprite: cc.Sprite,
        fastSpin_Sf_Array: [cc.SpriteFrame],

    },

    activeButtonSpin: function (enable) {
        this._super(enable);
        this.activeAllBtn(enable);
    },

    activeAllBtn(enable) 
    {       
        this.activeBetBtn(enable);
        this.disable_FastSpin(enable);
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
    },

    disable_FastSpin(enable)
    {
        this.btn_FastSpin.interactable = enable;
        if(enable)
        {        
            this.btn_FastSpin_Off_Sprite.spriteFrame = this.fastSpin_Sf_Array[0];
            
        }
        else
        {   
            this.btn_FastSpin_Off_Sprite.spriteFrame = this.fastSpin_Sf_Array[1];             
        }
    }
});
