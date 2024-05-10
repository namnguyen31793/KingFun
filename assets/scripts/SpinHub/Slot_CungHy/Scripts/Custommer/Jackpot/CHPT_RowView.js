// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        jackpotSpriteFrame: [cc.SpriteFrame],
        jackpotValue_Array : [cc.Label],
        jackpotSprite_Array : [cc.Sprite],

        WinJackpot : cc.Node,
        Current_Jackpot_Win_Value : cc.Label,
        Current_Jackpot_Win_Sprite : cc.Sprite,
        VFX_Win_Particle : [cc.ParticleSystem],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       // this.CHPT_RowView_Animation = this.getComponent(cc.Animation);
    },
    onEnable()
    {
        this.WinJackpot.active = false;
    },

    start () {

    },

    RowView_Setup(JackpotModelJson,currentJackpotType,currentJackpotValue)
    {
        let jackpotModel = JSON.parse(JackpotModelJson);
        this.SetupJackpot(jackpotModel,currentJackpotType,currentJackpotValue);
        
        //this.CHPT_RowView_Animation.play("CH_JackpotView_RowCollection_Slow_Spin");
    },
    
    SetupJackpot(jackpotModel,currentJackpotType,currentJackpotValue)
    {
        let grandValue =  jackpotModel.BetValue * jackpotModel.GrandJackpotMulti +  jackpotModel.GrandJackpotValue;
        let majorValue = jackpotModel.BetValue * jackpotModel.MajorJackpotMulti + jackpotModel.MajorJackpotValue;
        let minorValue = jackpotModel.BetValue * jackpotModel.MinorJackpotMulti + jackpotModel.MinorJackpotValue;
        let miniValue =  jackpotModel.BetValue * jackpotModel.MiniJackpotMulti + jackpotModel.MiniJackpotValue;

        switch(currentJackpotType)
        {
            case 1: 
                miniValue = currentJackpotValue;
                break;
            case 2: 
                minorValue = currentJackpotValue;
                break;
            case 3: 
                majorValue = currentJackpotValue;
                break;
            case 4: 
                grandValue = currentJackpotValue;
                break;
        }

        //Setup grandJackpot
        this.jackpotSprite_Array[1].spriteFrame = this.jackpotSpriteFrame[3];
        this.jackpotSprite_Array[3].spriteFrame = this.jackpotSpriteFrame[3];
        this.jackpotValue_Array[1].string = cc.Tool.getInstance().formatNumber(grandValue);
        this.jackpotValue_Array[3].string = cc.Tool.getInstance().formatNumber(grandValue);

        //Setup MajorJackpot
        this.jackpotSprite_Array[0].spriteFrame = this.jackpotSpriteFrame[2];
        this.jackpotSprite_Array[5].spriteFrame = this.jackpotSpriteFrame[2];
        this.jackpotValue_Array[0].string = cc.Tool.getInstance().formatNumber(majorValue); 
        this.jackpotValue_Array[5].string = cc.Tool.getInstance().formatNumber(majorValue); 

         //Setup MinorJackpot
         this.jackpotSprite_Array[4].spriteFrame = this.jackpotSpriteFrame[1];
         this.jackpotValue_Array[4].string = cc.Tool.getInstance().formatNumber(minorValue); 

          //Setup MiniJackpot
          this.jackpotSprite_Array[2].spriteFrame = this.jackpotSpriteFrame[0];
          this.jackpotSprite_Array[6].spriteFrame = this.jackpotSpriteFrame[0];
          this.jackpotValue_Array[2].string = cc.Tool.getInstance().formatNumber(miniValue); 
          this.jackpotValue_Array[6].string = cc.Tool.getInstance().formatNumber(miniValue); 

        this.Current_Jackpot_Win_Value.string = cc.Tool.getInstance().formatNumber(currentJackpotValue); 
        this.Current_Jackpot_Win_Sprite.spriteFrame = this.jackpotSpriteFrame[currentJackpotType-1];
        let partcileColor = null;
        switch(currentJackpotType)
        {
            case 1:
                partcileColor = new cc.Color(0,120,255);
                break;
            case 2:
                partcileColor = new cc.Color(0,255,50);
                break;
            case 3:
                partcileColor = new cc.Color(120,0,135);
                break;
            case 4:
                partcileColor = new cc.Color(255,0,0);
                break;
        }

        for(let i=0;i< this.VFX_Win_Particle.length;i++)
        {
            this.VFX_Win_Particle[i].startColor = partcileColor;
            this.VFX_Win_Particle[i].startColorVar = partcileColor;
            this.VFX_Win_Particle[i].endColor = partcileColor;
            this.VFX_Win_Particle[i].endColorVar = partcileColor;
        }
    }

    // update (dt) {},
});

