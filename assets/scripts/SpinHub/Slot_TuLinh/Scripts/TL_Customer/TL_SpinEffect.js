var EffectType = require('EffectType');

cc.Class({
    extends: require("SpinEffectBase"),


    ctor()
    {
        this.itemPos_Array = [];
        this.huWild_Pos = null;
        this.ITEM_WILD = 1;
    },
    properties: {
       Wild_Fire_Efect_Prefab : cc.Prefab,
       EffectNode : cc.Node,
       HuVang : cc.Node,
       Cloud_Animation : cc.Animation,
       StartBonus_Effect_Prefab : cc.Prefab,
       Block_Panel: cc.Node,
    },

    SpinEffect_Setup()
    {
       
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setEffectView(this);

        this.audioController =  require("AudioController_V2").getIns();
        //

        this.SetupPosArray(); 
        this.HuVang_Animation = this.HuVang.getComponent(cc.Animation);
        this.HuVang_Skeleton =  this.HuVang.getComponent(sp.Skeleton);
        this.Cloud_Animation.node.active = false;
        this.Block_Panel.active = false;
    },

    SetupPosArray()
    {
       

    this.itemPos_Array[0] = cc.v2(-325,210);
    this.itemPos_Array[1] = cc.v2(-135,210);
    this.itemPos_Array[2] = cc.v2(50,210);
    this.itemPos_Array[3] = cc.v2(240,210);
    this.itemPos_Array[4] = cc.v2(430,210);


    this.itemPos_Array[5] = cc.v2(-325,30);
    this.itemPos_Array[6] = cc.v2(-135,30);
    this.itemPos_Array[7] = cc.v2(50,30);
    this.itemPos_Array[8] = cc.v2(240,30);
    this.itemPos_Array[9] = cc.v2(430,30);


    this.itemPos_Array[10] = cc.v2(-325,-150);
    this.itemPos_Array[11] = cc.v2(-135,-150);
    this.itemPos_Array[12] = cc.v2(50,-150);
    this.itemPos_Array[13] = cc.v2(240,-150);
    this.itemPos_Array[14] = cc.v2(430,-150);  
  
    this.huWild_Pos = cc.v2(0,275);  
    },
    ShowAnimation_FinishSpin(spinResponseData)
    {
        this.Block_Panel.active = true;
        this.spinResponseData = spinResponseData;
        return this.ShowAnimation_WildEffect();
    },
 

    ShowAnimation_WildEffect()
    {
        let matrixString = this.spinResponseData[2];
        let isTakeJackpot  = this.spinResponseData[13];
        const stringArray = matrixString.split(",");
        let matrix =  stringArray.map((numStr) => Math.floor(parseInt(numStr)));
        let wildArray = [];
        for(let i=0;i< matrix.length;i++)
        {
            if(matrix[i] != this.ITEM_WILD)
                continue;
            wildArray.push(i);        
        }
        if(wildArray.length == 0)
        {
            this.FinishAllEffect();
            return false;
        }

        this.audioController.audioPool.playFireFly_Fx_Sound();

        for(let i=0;i< wildArray.length;i++)
        {
            this.Animation_WildItem(wildArray[i]);    
        } 

        this.scheduleOnce(()=>{
            this.HuVang_Lac_Animation(isTakeJackpot);
         },1*wildArray.length);
         
         return true;

    },

    Animation_WildItem(matrixIndex)
    {
        var startPosition = this.itemPos_Array[matrixIndex];

        var wildParticle = cc.instantiate(this.Wild_Fire_Efect_Prefab);
        wildParticle.setPosition(startPosition);
        this.EffectNode.addChild(wildParticle);

         // Move the particle to the stake position along a straight line
        var moveToAction = cc.moveTo(1, this.huWild_Pos);

        // Create an action to destroy the particle
        var destroyAction = cc.callFunc(function () {  
            wildParticle.destroy();      
        }, this);

        // Create a sequence of actions
        var sequence = cc.sequence(moveToAction, destroyAction);
         // Run the sequence on the particle
         wildParticle.runAction(sequence);
    },

    HuVang_Lac_Animation(isTakeJackpot = false)
    {
        this.HuVang_Skeleton.setAnimation(0,"",false);
        let callBack = ()=>{
          
            this.HuVang_Animation.off("finished" , callBack);
            if(!isTakeJackpot)
            {
                this.HuVang_Skeleton.setAnimation(0,'animation100',false);
            }
            this.FinishAllEffect();
        }
        this.HuVang_Animation.on("finished" ,callBack );
        this.HuVang_Animation.play("ChumVang_Lac");
    },

    ShowAnimation_ShowCloud(callbackFunc)
    {
        this.Cloud_Animation.node.active = true;
        let callBack = ()=>{        
            this.Cloud_Animation.off("finished" , callBack);
            this.Cloud_Animation.node.active = false;
            if(callbackFunc != null)
                callbackFunc();
        }
        this.Cloud_Animation.on("finished" ,callBack );
        this.Cloud_Animation.play("Freespin_Type2_Close");
    },

    ShowAnimation_StartBonus(callbackFunc)
    {
        var effectInstance = cc.instantiate(this.StartBonus_Effect_Prefab);
        effectInstance.setPosition(cc.v2(0,0));
        this.EffectNode.addChild(effectInstance);
        let effectInstance_Animation = effectInstance.getComponent(cc.Animation);

        let callBack = ()=>{        
            effectInstance_Animation.off("finished" , callBack);
            effectInstance.destroy();  
            if(callbackFunc != null)
                callbackFunc();        
        }
        effectInstance_Animation.on("finished" ,callBack );
        effectInstance_Animation.play("Bonus_StartEffect");
    },

    FinishAllEffect()
    {
         this.Block_Panel.active = false;
    }
   
});
