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
        this.betAmount = 0;
        this.multiReward = 0;
        this.lastBetAmount = 0;
    },

    properties: {
        lb_totalUser : cc.Label,
        lb_totalBetAmount : cc.Label,
        lb_totalMyBet : cc.Label,
        top_Content : cc.Node,
        bottom_Content : cc.Node,
        multi_Sprite : cc.Sprite,
        multi_FrameSprite : [cc.SpriteFrame],
        WinEffect : cc.Node,
        winMoneyLb : cc.Label,
        light_Effect : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.winMoneyLb_Animation = this.winMoneyLb.getComponent("cc.Animation");
        this.winMoneyLb.node.active = false;
    },

    start () {

    },

    onEnable()
    {
        this.ResetGate();
    },

    ResetGate()
    {
        this.lb_totalUser.string = '0';
        this.lb_totalBetAmount.string = '0';
        this.lb_totalMyBet.string = '0';
        this.top_Content.active = false;
        this.bottom_Content.active = false;
        this.winMoneyLb_Animation.node.active = false;
        this.lastBetAmount = this.betAmount;
        this.betAmount = 0;
        this.multiReward = 0;
        this.ResetEffect();
    },

    ResetEffect()
    {   
        this.multi_Sprite.node.active = false;
        this.WinEffect.active = false;
        this.light_Effect.active = false;
        this.node.opacity = 255;
    },

    SetMyBetInfo(Amount)
    {
        if(Amount <= 0)
        {
            this.bottom_Content.active = false;
            return;
        }
        this.bottom_Content.active = true;
        this.lb_totalMyBet.string = cc.Tool.getInstance().formatMoney(Amount);
        this.betAmount = Amount;
    },

    SetTotalBet(Amount,totalUser)
    {
        if(Amount <= 0)
        {
            this.lb_totalBetAmount.node.active = false;
            return;
        }
        this.top_Content.active = true;
        this.lb_totalBetAmount.node.active = true;
        this.lb_totalBetAmount.string = cc.Tool.getInstance().formatMoney(Amount);

        if(totalUser > 0)
        {
            this.lb_totalUser.node.active = true;
            this.lb_totalUser.string  = cc.Tool.getInstance().formatMoney(totalUser);
        }

    },

    SetGateInfo()
    {
        this.top_Content.active = true;
    },
    ShowWinEffect(mutli)
    {
        this.WinEffect.active = true;
        this.multiReward = 1;
       switch(mutli)
       {
            case 2:
                this.multi_Sprite.spriteFrame = this.multi_FrameSprite[0];
                this.multi_Sprite.node.active = true;
                this.multiReward = 2;
                break;
            case 3:
                this.multi_Sprite.spriteFrame = this.multi_FrameSprite[1];
                this.multi_Sprite.node.active = true;
                this.multiReward = 3;
                break;
       } 
    },
    ShowMyWin()
    {
        
        if(this.multiReward == 0 || this.betAmount == 0)
        {
            this.node.opacity = 100;
            return;
        }
            
        this.lb_totalMyBet.string = '';
        let winAmount = (this.multiReward+1) * this.betAmount;
        this.winMoneyLb.string = cc.Tool.getInstance().formatMoney(winAmount);
        this.winMoneyLb_Animation.node.active = true;
        this.winMoneyLb_Animation.play("miniXocDia_WinMoney");
        this.light_Effect.active = true;
    },
    GetLastBet()
    {
        return this.lastBetAmount;
    }

    // update (dt) {},
});
