// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("SpinEffectBase"),

    ctor()
    {
        this.itemPos_Array = [];
        this.ngocXanh_Pos = null;
        this.ITEM_GREEN_WILD = 4;
        this.freeturn_Pos = null;
        this.TIME_MOVE = 0.5;
        this.wildParticle_Array = [];
    },
    properties: {
        Wild_Green_Efect_Prefab : cc.Prefab,
        EffectNode : cc.Node,
        NgocXanh : cc.Node,
        Extent_Lb : cc.Label,
        Jackpot_Content_Prefab: cc.Prefab,
        FinishContent_Animation : cc.Animation,
        Block_Panel: cc.Node,
     },

     SpinEffect_Setup()
     {
        
         this.spinController = require("TL_FStype1_SpinController").getIns();
         this.spinController.setEffectView(this);
 
         this.SetupPosArray(); 
       
         this.NgocXanh_Skeleton =  this.NgocXanh.getComponent(sp.Skeleton);
         this.Extent_Lb.node.active = false;
         this.FinishContent_Animation.node.active = false;
         this.Block_Panel.active = false;
     },

    start () {

    },
    SetupPosArray()
    {
    
        this.itemPos_Array[0] = cc.v2(-400,160);
        this.itemPos_Array[1] = cc.v2(-200,160);
        this.itemPos_Array[2] = cc.v2(0,160);
        this.itemPos_Array[3] = cc.v2(200,160);
        this.itemPos_Array[4] = cc.v2(400,160);
    
    
        this.itemPos_Array[5] = cc.v2(-400,0);
        this.itemPos_Array[6] = cc.v2(-200,0);
        this.itemPos_Array[7] = cc.v2(0,0);
        this.itemPos_Array[8] = cc.v2(200,0);
        this.itemPos_Array[9] = cc.v2(400,0);
    
    
        this.itemPos_Array[10] = cc.v2(-400,-160);
        this.itemPos_Array[11] = cc.v2(-200,-160);
        this.itemPos_Array[12] = cc.v2(0,-160);
        this.itemPos_Array[13] = cc.v2(200,-160);
        this.itemPos_Array[14] = cc.v2(400,-160);  
  
        this.ngocXanh_Pos = cc.v2(0,275);  
        this.freeturn_Pos = cc.v2(620,-170);  
    },

    ShowAnimation_FinishSpin(spinResponseData)
    {
        this.spinResponseData = spinResponseData;

        let isTakeJackpot = this.spinResponseData[13];
        if(isTakeJackpot)
        {
            this.ShowAnimation_ResultJackpot();
        }
        else
        {
            this.ShowAnimation_WildEffect();
        }
        
    },
 

    ShowAnimation_WildEffect()
    {
        this.Block_Panel.active = true;

        let matrixString = this.spinResponseData[2];
        let isTakeJackpot  = this.spinResponseData[13];
        const stringArray = matrixString.split(",");
        let matrix =  stringArray.map((numStr) => Math.floor(parseInt(numStr)));
        let wildArray = [];
        for(let i=0;i< matrix.length;i++)
        {
            if(matrix[i] != this.ITEM_GREEN_WILD)
                continue;
            wildArray.push(i);        
        }
        if(wildArray.length == 0)
        {
            this.FinishAllEffect();
            return;
        }
        // chay hieu ung tang free
        let delayPlusEffect = 0;
       
        if(wildArray.length >= 3)
        {
            delayPlusEffect = (2 * this.TIME_MOVE);   
            this.ShowAnimation_Inc_FreeTurn(wildArray,matrix);  
        }

        if(delayPlusEffect == 0)
        {

            for(let i=0;i< wildArray.length;i++)
            {
                this.Animation_WildItem(wildArray[i],this.ngocXanh_Pos);    
            }
        }
        else
        {
            this.scheduleOnce(()=>{
                for(let i=0;i< wildArray.length;i++)
                {
                    this.Animation_WildItem(wildArray[i],this.ngocXanh_Pos);    
                 }
            },delayPlusEffect);
        }

        this.scheduleOnce(()=>{
            this.NgocXanh_Lac_Animation(isTakeJackpot);
         },1+delayPlusEffect);
       

    },
    SpinEffect_RemainSetup(packet)
    {
    },

    Animation_WildItem(matrixIndex,endPos)
    {
        var startPosition = this.itemPos_Array[matrixIndex];

        var wildParticle = cc.instantiate(this.Wild_Green_Efect_Prefab);
        wildParticle.setPosition(startPosition);
        this.EffectNode.addChild(wildParticle);
        this.wildParticle_Array.push(wildParticle);
         // Move the particle to the stake position along a straight line
        var moveToAction = cc.moveTo(0.5, endPos);

        // Create an action to destroy the particle
        var destroyAction = cc.callFunc(function () {  
            wildParticle.active = false;      
        }, this);

        // Create a sequence of actions
        var sequence = cc.sequence(moveToAction, destroyAction);
         // Run the sequence on the particle
         wildParticle.runAction(sequence);
    },

    NgocXanh_Lac_Animation(isTakeJackpot = false)
    {
       // this.NgocXanh_Skeleton.setAnimation(0,"animation_rung",false);
        this.NgocXanh_Skeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'animation_rung') {   
                this.UpdateExtendUI();      
                this.NgocXanh_Skeleton.setAnimation(0,"animation_idle",true);    
                this.FinishAllEffect();
             }
        });
        this.NgocXanh_Skeleton.setAnimation(0,'animation_rung',false);
    },

    FinishAllEffect()
    {   
        this.spinController.spinView.Handle_ShowRewardLine(this.spinResponseData);        
        let freeSpinLeft = this.spinResponseData[7];
        this.Remove_AllWildParticle();
        if(freeSpinLeft == 0)
        {
            this.scheduleOnce(()=>{
                this.ShowAnimation_ClosePopup();
            },3);
        }
        this.scheduleOnce(()=>{
            this.Block_Panel.active = false;
        },1);
       
    },

    ShowAnimation_ClosePopup()
    {
        this.FinishContent_Animation.node.active = true;
        let callBack = ()=>{         
            this.FinishContent_Animation.off("finished" , callBack);  
            let totalWin =  this.spinController.totalFreeturnReward;
            
            require("TL_SpinController").getIns().mainView.Destroy_FreeGame_Type1_View(totalWin);
           }
           this.FinishContent_Animation.on("finished" ,callBack );
           this.FinishContent_Animation.play("Freespin_Type2_Close");
    },

    UpdateExtendUI()
    {
        let extendString = this.spinResponseData[14];
        let extendStringArray = extendString.split("|");
        let counterExtend = parseInt(extendStringArray[0]);
        let baseValue = parseInt(extendStringArray[1]);
       
        this.Extent_Lb.string = (counterExtend * baseValue);
        this.Extent_Lb.node.active = true;
    },

    ShowAnimation_ResultJackpot()
    {
        
        let matrixString = this.spinResponseData[2];
        let isTakeJackpot  = this.spinResponseData[13];
        let totalWin = this.spinResponseData[9];
        const stringArray = matrixString.split(",");  
        let matrix =  stringArray.map((numStr) => Math.floor(parseInt(numStr)));
        let theFirstId = -1;
        for(let i=0;i< matrix.length;i++)
        {
            if(matrix[i] != this.ITEM_GREEN_WILD)
                continue;
            theFirstId  = i;
            break;
        }
        if( theFirstId == -1)
            return;
        this.Animation_WildItem(theFirstId,cc.v2(0,0)); 
        var jackpotContent = null;
        this.scheduleOnce(()=>{
             jackpotContent = cc.instantiate(this.Jackpot_Content_Prefab);
            this.EffectNode.addChild(jackpotContent);
            let jackpotContent_Component = jackpotContent.getComponent("TL_Bonus_EndPopup");
            jackpotContent_Component.EndPopup_Setup(isTakeJackpot,totalWin)
        },1);

        this.scheduleOnce(()=>{
            jackpotContent.destroy();
            this.ShowAnimation_WildEffect();
        },10);
  
    },
    ShowAnimation_Inc_FreeTurn(freeturnPos,currentArrayData)
    {
        let self = this;
        this.index = 0;
        for(let i=0;i< freeturnPos.length;i++)
        {
          
                let itemData = currentArrayData[freeturnPos[i]];
                var startPosition = self.itemPos_Array[freeturnPos[i]];
                var wildParticle = cc.instantiate(self.Wild_Green_Efect_Prefab);
                this.EffectNode.addChild(wildParticle);
                this.wildParticle_Array.push(wildParticle);
                var endPos = this.freeturn_Pos;
                wildParticle.setPosition(startPosition);

                // Move the particle to the stake position along a straight line
                var moveToAction = cc.moveTo(this.TIME_MOVE, endPos);
                // Create an action to destroy the particle
                var destroyAction = cc.callFunc(function () {  
                    wildParticle.active = false;  
                  //  this.ShowAnimation_CreateSumTichLuy(greenItemPos,currentArrayData[blue_specialArray[i]],endPos);   
                }, self);
                var sequence = cc.sequence(moveToAction, destroyAction);
                wildParticle.runAction(sequence);
            ;
        }
    },
    Remove_AllWildParticle()
    {
        let arrayLength =  this.wildParticle_Array.length;
        for(let i = 0;i < arrayLength;i++)
        {
            this.wildParticle_Array[i].destroy();
        }
        this.wildParticle_Array = [];
    },

});
