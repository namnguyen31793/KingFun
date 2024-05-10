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
        this.currentBetAmount = 0;
    },

    properties: {
        x2_Btn : cc.Button,
        reBet_Btn : cc.Button,
        x2_Sprite : cc.Sprite,
        x2_SpriteFrame : [cc.SpriteFrame],
        reBet_Sprite : cc.Sprite,
        reBet_SpriteFrame : [cc.SpriteFrame],

        chipBet_Collection : [cc.Sprite],
        chipBetActive_Collection : [cc.Sprite],

        rebet_Btn_Collection : [cc.Button],
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetBetManager(this);
        this.onClick_SelectChipBet(null,1000);
        this.onClick_SelectChipEffect(null,0);
        this.Enable_Rebet_Btn_Collection(false);
    },

    start () {

    },

    ResetBetEffect()
    {
        this.ResetChipCollection();
    },

    Enable_AllBetBtn(enable)
    {
        this.x2_Btn.interactable = enable;
        this.reBet_Btn.interactable = enable;

        if(enable)
        {
            this.x2_Sprite.spriteFrame = this.x2_SpriteFrame[0];
            this.reBet_Sprite.spriteFrame = this.reBet_SpriteFrame[0];
        }
        else{
            this.x2_Sprite.spriteFrame = this.x2_SpriteFrame[1];
            this.reBet_Sprite.spriteFrame = this.reBet_SpriteFrame[1];
        }
    },

    ResetChipCollection()
    {
        for(let i=0;i< this.chipBet_Collection.length;i++)
        {
            this.chipBet_Collection[i].node.setScale(cc.v2(0.8,0.8));
            this.chipBetActive_Collection[i].node.active = false;
        }
    },

    onClick_SelectChipBet(event,amount)
    {
        let betAmount = parseInt(amount)
        this.currentBetAmount = betAmount;
    },
    onClick_SelectChipEffect(event,index)
    {
        let id = parseInt(index)
        this.ResetChipCollection();
        this.chipBet_Collection[id].node.setScale(cc.v2(1,1));
        this.chipBetActive_Collection[id].node.active = true;
    },
    getCurrentBetAmount()
    {
        return this.currentBetAmount;
    },
    Enable_Rebet_Btn_Collection(enable)
    {
        for(let i=0;i< this.rebet_Btn_Collection.length;i++)
        {
            this.rebet_Btn_Collection[i].interactable = enable;
            this.rebet_Btn_Collection[i].enableAutoGrayEffect = !enable;
        }
    }
    



    // update (dt) {},
});
