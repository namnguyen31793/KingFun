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
        this.callbackFunc = null;
    },

    properties: {
        JackpotReward_Lb : cc.LabelIncrement,
        Coin_Content : cc.Node,
        Jackpot_Type_Skeleton: sp.Skeleton,
        Jackpot_Type_SkeCollection: [sp.SkeletonData],
        Jackpot_Type_Text_Img :  cc.Sprite,
        Jackpot_Type_SpriteFrame: [cc.SpriteFrame],
        Blur_Backgroud : cc.Node,
        Win_Text_Img:   cc.Sprite,
        ThangLon_Type_SpriteFrame: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable()
    {
       // this.Coin_Content.active = false;
    },
    // onLoad () {},

    start () {

    },

    EndPopup_Setup(jackpotType,jacpotReward,callbackFunc)
    {
        let color = new cc.Color(0, 0, 0);
        switch(jackpotType)
        {
            case 1:
                color = new cc.Color(27,163, 0);
               
                break;
            case 2:
                color = new cc.Color(255, 173, 0);
                break;
            case 3:
                color = new cc.Color(255, 0, 0);
                break;
            case 4:
                color = new cc.Color(11, 0, 255);
                break;
        }
        this.Blur_Backgroud.color = color;
        this.Jackpot_Type_Text_Img.spriteFrame = this.Jackpot_Type_SpriteFrame[jackpotType - 1];   
        this.Jackpot_Type_Skeleton.skeletonData =  this.Jackpot_Type_SkeCollection[jackpotType - 1];
        this.Jackpot_Type_Skeleton.setAnimation(0,'without_frame',true);


        this.JackpotReward_Lb.tweenValueto(jacpotReward);
        this.callbackFunc = callbackFunc;
        this.scheduleOnce(()=>{
            this.node.active = false;
            if(this.callbackFunc != null)
                this.callbackFunc();
        },9);
    },

  
});
