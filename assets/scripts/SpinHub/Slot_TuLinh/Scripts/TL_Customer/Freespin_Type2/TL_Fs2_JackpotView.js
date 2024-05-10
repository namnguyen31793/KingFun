// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        OnlyOne_Jackpot_Lb : cc.LabelIncrement,
        OnlyOne_Jackpot_Img : cc.Sprite,
        Jackpo_Img: [cc.SpriteFrame],
    },

    onLoad()
    {
        this.spinController = require("TL_Fs2_SpinController").getIns();
        this.spinController.setJackpotView(this);
    },

    JackpotView_Setup()
    {

    },
    Freespin_Type2_JackpotView_Setup(specialType)
    {
        this.specialType = specialType;
        //minor jackpot 
        if(this.specialType.Input <= 3 )
            this.OnlyOne_Jackpot_Img.spriteFrame = this.Jackpo_Img[0];
        else
            this.OnlyOne_Jackpot_Img.spriteFrame = this.Jackpo_Img[1];
    },  
    UpdateJackpotValue(jackpotModel)
    {
        if(this.specialType.Input <= 3 )
        {
            this.OnlyOne_Jackpot_Lb.setValueText( cc.Tool.getInstance().formatNumber(jackpotModel.BetValue * jackpotModel.MinorJackpotMulti + jackpotModel.MinorJackpotValue));
        }
        else
        {
            this.OnlyOne_Jackpot_Lb.setValueText( cc.Tool.getInstance().formatNumber(jackpotModel.BetValue * jackpotModel.GrandJackpotMulti + jackpotModel.GrandJackpotValue));
        }
    },

    start () {

    },

    // update (dt) {},
});
