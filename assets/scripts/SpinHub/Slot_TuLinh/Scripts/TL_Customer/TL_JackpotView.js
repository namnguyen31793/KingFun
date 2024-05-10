// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("JackpotView_V2"), 

    ctor()
    {
        this.lastSpecialID = 0;
        this.MINI = "MINI";
        this.MINOR = "MINOR";
        this.MAJOR = "MAJOR";
        this.GRAND = "GRAND";
    },
    properties: {
        Grand_Disable_Img : cc.Node,
        Major_Disable_Img : cc.Node,
        Unlock_Grand_Fx : sp.Skeleton,
        Unlock_Major_Fx : sp.Skeleton,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    JackpotView_Setup()
    {

    },
   
    UpdateJackpotValue_BySpecialID(jackpotModel,specialID = 0)
    {
     
        this.UpdateJackpotValue(jackpotModel);
        if(specialID <= 3)
        {
            this.Grand_Disable_Img.active = true;
            this.Major_Disable_Img.active = true;
        }else
        {
            this.Grand_Disable_Img.active = false;
            this.Major_Disable_Img.active = false;
            if(specialID == 4 && this.lastSpecialID == 3)
            {
                if(this.Unlock_Grand_Fx!= null)
                    this.Unlock_Grand_Fx.setAnimation(0,'animation',false);
                if(this.Unlock_Major_Fx!= null)
                    this.Unlock_Major_Fx.setAnimation(0,'animation',false);
            }
        }
        this.lastSpecialID = specialID;

        this.UpdateJackpotValue(jackpotModel);
        
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
   
   
});
