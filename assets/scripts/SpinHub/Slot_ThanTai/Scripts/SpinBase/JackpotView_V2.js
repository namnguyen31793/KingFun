// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Grand_Jackpot_Lb : cc.LabelIncrement_V2,
        MajorJackpot_Lb : cc.LabelIncrement_V2,
        MinorJackpot_Lb : cc.LabelIncrement_V2,
        MiniJackpot_Lb : cc.LabelIncrement_V2,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {  
        this.ResetValue();
        this.JackpotView_Setup();
    },
    JackpotView_Setup()
    {

    },
   
    UpdateJackpotValue(jackpotModel)
    {
        if(this.MiniJackpot_Lb)
            this.MiniJackpot_Lb.tweenValueto(jackpotModel.BetValue * jackpotModel.MiniJackpotMulti + jackpotModel.MiniJackpotValue); 
        if(this.MinorJackpot_Lb)
            this.MinorJackpot_Lb.tweenValueto(jackpotModel.BetValue * jackpotModel.MinorJackpotMulti + jackpotModel.MinorJackpotValue);
        if(this.MajorJackpot_Lb)
            this.MajorJackpot_Lb.tweenValueto(jackpotModel.BetValue * jackpotModel.MajorJackpotMulti + jackpotModel.MajorJackpotValue);
        if(this.Grand_Jackpot_Lb)
            this.Grand_Jackpot_Lb.tweenValueto(jackpotModel.BetValue * jackpotModel.GrandJackpotMulti + jackpotModel.GrandJackpotValue);
    },

    ResetValue()
    {
        if(this.Grand_Jackpot_Lb)
            this.Grand_Jackpot_Lb.setValue(0);
        if(this.MajorJackpot_Lb)
            this.MajorJackpot_Lb.setValue(0);
        if(this.MinorJackpot_Lb)
            this.MinorJackpot_Lb.setValue(0);
        if(this.MinorJackpot_Lb)
            this.MiniJackpot_Lb.setValue(0);
    },

    UpdateJackpotView_FromJson(roomId,defaultJson)
    {
        let jsonObject = defaultJson.json;
        //const jsonObject = JSON.parse(jsonContent);
        const MiniJackpotName= `${roomId}_MINI`;
        const MinorJackpotName= `${roomId}_MINOR`;
        const MajorJackpotName= `${roomId}_MAJOR`;
        const GrandJackpotName= `${roomId}_GRAND`;

        const miniJackpotValue = jsonObject[MiniJackpotName];
        const minorJackpotValue = jsonObject[MinorJackpotName];
        const majorJackpotValue = jsonObject[MajorJackpotName];
        const grandJackpotValue = jsonObject[GrandJackpotName];

        if(this.MiniJackpot_Lb)
            this.MiniJackpot_Lb.tweenValueto(miniJackpotValue); 
        if(this.MinorJackpot_Lb)
            this.MinorJackpot_Lb.tweenValueto(minorJackpotValue);
        if(this.MajorJackpot_Lb)
            this.MajorJackpot_Lb.tweenValueto(majorJackpotValue);
        if(this.Grand_Jackpot_Lb)
            this.Grand_Jackpot_Lb.tweenValueto(grandJackpotValue);
    }


   

    // update (dt) {},
});
