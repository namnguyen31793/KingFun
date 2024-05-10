// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       Dice_1 : cc.Sprite,  
       Dice_spriteFrame : [cc.SpriteFrame],
       TotalBet_Lb : cc.Label,
       TotalWin_Lb : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    updateItem(item)
    {
        this.node.active = true;
        this.Dice_1.spriteFrame = this.Dice_spriteFrame[item.GateID-1];
        this.TotalBet_Lb.string = cc.Tool.getInstance().formatNumberKTX(item.Bet);
        let totalWin = (item.Award - item.Bet);
        this.TotalWin_Lb.string =  cc.Tool.getInstance().formatNumberKTX(totalWin);
        this.TotalWin_Lb.node.color = cc.Color.RED;
        if(totalWin > 0)
        {
            this.TotalWin_Lb.node.color = cc.Color.GREEN;
            this.TotalWin_Lb.string = "+"+cc.Tool.getInstance().formatNumberKTX(totalWin);
        }
            
        
    }

    

    // update (dt) {},
});
