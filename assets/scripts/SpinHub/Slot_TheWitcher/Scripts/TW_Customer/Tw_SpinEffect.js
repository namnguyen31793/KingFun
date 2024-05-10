var EffectType = require('EffectType');
cc.Class({
    extends: require("SpinEffectBase"),

    properties: {
        Bigwin_Normal_Content : require("Tw_BigwinEffect"),
        Column3_Nearwin_Effect : cc.Animation,
    },
    SpinEffect_Setup()
    {
        this._super();
        this.Bigwin_Normal_Content.node.active = false;
        this.Column3_Nearwin_Effect.node.active = false;
    },

    ShowEffect(type, rewardAmount , time)
    {
        if(type == EffectType.BIG_WIN)
        {
            this.Bigwin_Normal_Content.Tw_Bigwin_Setup(rewardAmount,false);
            require("AudioController_V2").getIns().playSound(cc.AudioTypes.BIGWIN);
            require("AudioController_V2").getIns().playSound(cc.AudioTypes.JACKPOT_BACKGROUD);
            this.scheduleOnce(()=>{
                this.node.active = false;
            },3);
        }
    },

    ResetAllEffect()
    {
        this.Bigwin_Normal_Content.node.active = false;
        this.StopEffect_NearWin();
    },

    ShowEffect_NearWin()
    {
        this.Column3_Nearwin_Effect.node.active = true;   
        this.Column3_Nearwin_Effect.play("NearWin");
    },
    StopEffect_NearWin()
    {
        this.Column3_Nearwin_Effect.node.active = false;
    },
    
});
