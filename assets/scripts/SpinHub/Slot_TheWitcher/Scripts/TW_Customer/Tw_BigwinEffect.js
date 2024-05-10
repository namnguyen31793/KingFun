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
        this.indexValue = 0;
        this.bigwinType = 1;
    },
    
    properties: {
        MoneyLabel : cc.LabelIncrement,
        Text_Img : cc.Sprite,
        SexScene : cc.Animation,  
        Text_Img_Sprite : [cc.SpriteFrame],
       
    },
    onEnable()
    {
        this.MoneyLabel.setValue(0);
    },

    Tw_Bigwin_Setup(totalReward,isFreeturn = true)
    {
       
        this.node.active = true;
        this.isFreeturn = isFreeturn;
        this.totalReward = totalReward;
        this.MoneyLabel.tweenValueto(this.totalReward);
        if(isFreeturn)
            this.ShowAnimation_SetRandomScene();
        else
            this.ShowAnimation_BigWinScene();
    },
    ShowAnimation_SetRandomScene()
    {
        var randomNumber = Math.floor(Math.random() * 3) + 1;
        let animationName = "SexScene_"+randomNumber;
        if(this.totalReward)
        {
            this.SexScene.play(animationName);
        }
    },
    ShowAnimation_BigWinScene()
    {
        let animationName = "Wolf_Bigwin_Animation";
        if(this.totalReward)
        {
            this.SexScene.play(animationName);
        }
    },

    
});
