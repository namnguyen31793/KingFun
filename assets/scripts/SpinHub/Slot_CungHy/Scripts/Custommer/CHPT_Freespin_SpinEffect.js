// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require('CHPT_SpinEffect'),

    ctor()
    {
        this.freePlus = cc.v2(570,-260);
    },
    
    properties: {
        UnlockJackpot_Vfx_Prefab : cc.Prefab,
        CoinContent : require('CHPT_Freespin_Effect_CoinContent'),

        PlusTurn_Animation : cc.Animation,
    },

   
    SetSpinController()
    {
        this.spinController = require('CHPT_Freespin_LogicManager').getIns();
        this.spinController.setEffectView(this);

        this.CoinContent.node.active = false;
        this.PlusTurn_Animation.node.active = false;
    },


    CreateEffect_UnlockJackpot(defaultMatrix)
    {
        const stringArray = defaultMatrix.split(",");
        let matrix =  stringArray.map((numStr) => Math.floor(parseInt(numStr)));
        for(let i=0;i< matrix.length;i++)
        {
            if(matrix[i] != this.ITEM_WILD_SPECIAL)
                continue;
            this.ShowEffect_UnlockJackpot(i);
        }
    },

    ShowEffect_UnlockJackpot(SpecialWildIndex)
    {
       

        let startPos = this.slotItem_Pos_Array[SpecialWildIndex];
        for(let i=0;i<2;i++)
        {
            let minilockIndex = 0;
            switch(i)
            {
                case 0: 
                    minilockIndex = 1;
                    break;
                case 1: 
                    minilockIndex = 3;
                    break;
            }

            const instance = cc.instantiate(this.UnlockJackpot_Vfx_Prefab);                
            let particleComponent = instance.getComponent(cc.ParticleSystem);
            
            this.effectContent.addChild(instance);   
            instance.setPosition(startPos);
            let endPos = this.slotMiniItem_Pos_Array[minilockIndex];

            instance.runAction(cc.sequence(cc.delayTime(.2), cc.moveTo(.5, endPos), cc.callFunc(function() {
                particleComponent.stopSystem();
            }), cc.delayTime(.2), cc.callFunc(function() {
                //instance.destroy();
            })))
        }
        this.scheduleOnce(()=>{
           this.spinController.spinView.ShowAnimation_UnLockJackpot();
        }, 1);
       
    },

    Handle_TakeFreeSpin(columnArray)
    {
        let moveTime = 0.5;
        let self = this;
       for(let i=0;i< columnArray.length;i++)
       {
            let startPos = this.slotMiniItem_Pos_Array[columnArray[i]];
            var plusParticle = cc.instantiate(this.UnlockJackpot_Vfx_Prefab);
            plusParticle.setPosition(startPos);
            this.effectContent.addChild(plusParticle);

            var moveToAction = cc.moveTo(moveTime, this.freePlus);
            var destroyAction = cc.callFunc(function () {  
                plusParticle.active = false;   
                plusParticle.destroy();   
            }, this);

            // Create a sequence of actions
            var sequence = cc.sequence(moveToAction, destroyAction);
            plusParticle.runAction(sequence);
       }

       
       this.scheduleOnce(()=>{
            self.ShowAnimation_PlusTurn();
            self.spinController.Total_Turn +=2;
            self.spinController.spinView.SetTotalTurn_Lb( self.spinController.Total_Turn);

       },moveTime/2);
    },

    ShowAnimation_PlusTurn()
    {
        this.PlusTurn_Animation.node.active = true;
        let callBack = ()=>{
            this.PlusTurn_Animation.off("finished" , callBack);
            this.PlusTurn_Animation.node.active = false;
            this.spinController.Handle_NextAutoSpin();

        }
       this.PlusTurn_Animation.on("finished" ,callBack );
       this.PlusTurn_Animation.play("CH_PlusFreeturn");
    },

    _checkPauseTutorial: function(t) {
        var spinView = this.spinController.mainController.spinView;
        return spinView && spinView.checkPauseTutorial(t)
    },

});
