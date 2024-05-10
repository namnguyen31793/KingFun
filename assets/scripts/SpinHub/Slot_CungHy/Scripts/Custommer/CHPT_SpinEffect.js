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
        this.slotItem_Pos_Array = [];
        this.slotMiniItem_Pos_Array = [];
        this.ITEM_WILD_SPECIAL = 1;
        this.ITEM_WILD_NORMAL = 2;
    },

    properties: {
        nearWin_Array: {
            default: [],
            type:  cc.ParticleSystem
        },
        nearWin_Object : cc.Node,
        GongBurn_Vfx_Prefab: cc.Prefab,
        Block_Panel: cc.Node,
        effectContent: cc.Node,
        CoinContent : require('CHPT_Freespin_Effect_CoinContent'),
        BigWinParticle:  cc.ParticleSystem,
    },

 
    SpinEffect_Setup()
    {
       
        this.SetSpinController();

        this.audioController =  require("AudioController_V2").getIns();
        //
        this.Block_Panel.active = false;
        this.Load_SlotItem_Pos();
        this.nearWin_Object.active = false;
        this.CoinContent.node.active = false;

        this.OffParticle_BigWin();        
    },

    SetSpinController()
    {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setEffectView(this);
    },

    Load_SlotItem_Pos()
    {
        this.slotItem_Pos_Array[0] = cc.v2(-380,160);
        this.slotItem_Pos_Array[1] = cc.v2(-190,160);
        this.slotItem_Pos_Array[2] = cc.v2(0,160);
        this.slotItem_Pos_Array[3] = cc.v2(190,160);
        this.slotItem_Pos_Array[4] = cc.v2(380,160);

        this.slotItem_Pos_Array[5] = cc.v2(-380,0);
        this.slotItem_Pos_Array[6] = cc.v2(-190,0);
        this.slotItem_Pos_Array[7] = cc.v2(0,0);
        this.slotItem_Pos_Array[8] = cc.v2(190,0);
        this.slotItem_Pos_Array[9] = cc.v2(380,0);

        this.slotItem_Pos_Array[10] = cc.v2(-380,-160);
        this.slotItem_Pos_Array[11] = cc.v2(-190,-160);
        this.slotItem_Pos_Array[12] = cc.v2(0,-160);
        this.slotItem_Pos_Array[13] = cc.v2(190,-160);
        this.slotItem_Pos_Array[14] = cc.v2(380,-160);

        this.slotMiniItem_Pos_Array[0] = cc.v2(-380,288);
        this.slotMiniItem_Pos_Array[1] = cc.v2(-190,288);
        this.slotMiniItem_Pos_Array[2] = cc.v2(0,288);
        this.slotMiniItem_Pos_Array[3] = cc.v2(190,288);
        this.slotMiniItem_Pos_Array[4] = cc.v2(380,288);
    },
    ShowAnimation_FinishSpin(spinResponseData)
    {
        //this.Block_Panel.active = true;
        this.spinResponseData = spinResponseData;
      

        this.ShowEffect_CreateGongBurn();
    },

    ShowEffect_CreateGongBurn()
    {
        let matrixString = this.spinResponseData[2];
        let extandMatrix = this.spinResponseData[14];

        const stringArray = matrixString.split(",");
        let matrix =  stringArray.map((numStr) => Math.floor(parseInt(numStr)));
        let wildArray = [];
        let columnArray = [];
        for(let i=0;i< matrix.length;i++)
        {
            if(matrix[i] != this.ITEM_WILD_SPECIAL)
                continue;

            wildArray.push(i);        
            columnArray.push((i%5));
        }
        if(wildArray.length == 0)
        {
            this.spinController.Handle_NextAutoSpin();
            return false;
        }
            

        for(let j=0;j< wildArray.length;j++)
        {
            this.ShowEffect_GongBurn(wildArray[j],columnArray[j]);
        }

        this.Handle_BeforeGongEffect(wildArray,columnArray);
    },

    Handle_BeforeGongEffect(wildArray,columnArray)
    {
        if(this._checkPauseTutorial("pauseIntroGong"))
        {
            this.spinController.spinView.onIngameEvent("SHOWING_GONG");
            this.spinController.spinView.storeCurrentScripts = "Handle_BeforeGongEffect";
            this.spinController.spinView.storeNextScripts = {
                script:   this.Handle_BeforeGongEffect,
                object :  this,
                data: [wildArray,columnArray],                     
            };
            return;
        }

        require("AudioController_V2").getIns().audioPool.playGoingEffect_Fx_Sound();

        let extandMatrix = this.spinResponseData[14];
        let extraMatrix_Response_Array  = extandMatrix.split('|');
        let miniReelMatrix = extraMatrix_Response_Array[0];

        let hasFreeSpin = this.DetectSpecialTurn(miniReelMatrix,wildArray);
        

        let isTakeJackpot = this.spinResponseData[13];
        let freeSpinLeft = this.spinResponseData[7];

        let totalWin = this.spinResponseData[9];
        let baseBet = this.spinController.CurrentRoomConfig.Bet;
        if(baseBet != null && baseBet !== undefined && baseBet > 0)
        {
            let baseMulti = totalWin/baseBet;
            if(baseMulti >= 8)
            {
                this.ShowParticle_BigWin();
                this.scheduleOnce(()=>{
                    this.OffParticle_BigWin();
                }, 2.5)
            }
                
        }
        cc.BalanceController.getInstance().refeshBalanceView();
        

        this.spinController.BeforeNextSpin(columnArray,hasFreeSpin,isTakeJackpot);
        
    },

    ShowEffect_GongBurn(startIndex,endColumnIndex)
    {
        const instance = cc.instantiate(this.GongBurn_Vfx_Prefab);    
        this.effectContent.addChild(instance);
        let startPos = this.slotItem_Pos_Array[startIndex];
        let endPos = this.slotMiniItem_Pos_Array[endColumnIndex];
        endPos.y +=100;

        instance.setPosition(startPos);

        instance.stopAllActions();
        instance.runAction(cc.sequence(cc.spawn(cc.moveTo(1,endPos), cc.fadeOut(1)), cc.callFunc(function() {
            instance.destroy();


        })))
    },

    ShowEffect_MultiValue(extandMatrix)
    {
        let extandMatrix_Array  = extandMatrix.split('|');
        let multiValue = parseInt(extandMatrix_Array[1]);

        if(multiValue > 1)
        {
            this.audioController.audioPool.play_StartMultiCoin_Fx_Sound();
            
            this.CoinContent.node.active = true;
            this.CoinContent.ShowParticle_Coin_Mutli();
            let seft = this;
            this.CoinContent.ShowAnimation_Coin_Multi_Fly(multiValue,()=>{
                seft.spinController.spinView.MiniColumn_ShowResultInfo();
            });
        }
    },

    DetectSpecialTurn(miniReelMatrix,wildArray)
    {
        var miniReel_ItemArray = miniReelMatrix.split(',');
        let item_FR = "FR";
        let itemFR_Index_Array = [];
        for(let a=0;a< miniReel_ItemArray.length;a++)
        {
            if(miniReel_ItemArray[a] == item_FR)
            {
                let columnID = 0;
                switch(a)
                {
                    case 0:
                        columnID = 0;
                        break;
                    case 1:
                        columnID = 2;
                        break;
                    case 2:
                        columnID = 4;
                        break;
                }

                itemFR_Index_Array.push(columnID);
            }
        }

        let hasFreeSpin = false;
        for(let m=0;m< itemFR_Index_Array.length;m++)
        {
            for(let n=0;n< wildArray.length;n++)
            {
                if(itemFR_Index_Array[m] == (wildArray[n]%5))
                {
                    hasFreeSpin = true;
                    return hasFreeSpin;
                }                    
            }
        }
        return false;
    },


    Handle_TakeFreeSpin(columnArray)
    {
        this.spinController.Handle_CreateFreeSpinView();
    },

    _checkPauseTutorial: function(t) {
        var spinView = this.spinController.spinView;
        return spinView && spinView.checkPauseTutorial(t)
    },

    ShowParticle_BigWin()
    {
        this.BigWinParticle.resetSystem();
        this.BigWinParticle.node.active = true;
    },

    OffParticle_BigWin()
    {
        this.BigWinParticle.stopSystem();
        this.BigWinParticle.node.active = false;
    }


    

 
    // update (dt) {},
});

