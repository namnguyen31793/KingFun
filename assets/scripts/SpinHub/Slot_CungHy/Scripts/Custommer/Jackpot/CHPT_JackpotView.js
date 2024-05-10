
cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.loopSpinIndex = 0;
    },

    properties: {
       Golden_Tree_Skeleton  : sp.Skeleton,
       Row_Spin : require("CHPT_RowView"),
       ThanTai_Skeleton : sp.Skeleton,
       SpinView : cc.Node,
       Mask : cc.Node,
       Button_Spin : cc.Node,

       WinJackpot : cc.Node,
       Effect_View : cc.Node,
       VFX_Effect_Particle : [cc.ParticleSystem],

       Deco_Animation : [cc.Animation],

       TotalWin_Lb : cc.LabelIncrement,

       Coin_Particle : cc.ParticleSystem,

       TimeContent : cc.Node,
       Time_Lb : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Row_Collection_Animation = this.Row_Spin.node.getComponent(cc.Animation);
       this.Button_Spin_Component = this.Button_Spin.getComponent(cc.Button);
       this.timer = 0;
    },

    onEnable()
    {
        this.Row_Spin.node.active = false;
        this.SpinView.active = false;
        this.ThanTai_Skeleton.node.active = false;
        this.Button_Spin.active = false;
        this.Mask.opacity = 150;
        this.Mask.active = true;
        this.Button_Spin_Component.interactable = true;
        this.WinJackpot.active = false;
        this.Effect_View.active = false;
        this.Coin_Particle.node.active = true;

        this.ShowAnimation_ShowDeco("CH_JackpotView_Decor_Reset");

        this.SetTotalWinUI(0);
        this.Golden_Tree_Skeleton.setAnimation(0,'Idle_Green',false);
        this.TimeContent.active = false;
        this.resetTimer();
    },

    start () {

    },

    SetupJackpotView(mainController,jsonJackpotModel,jackpotType,rewardValue)
    {
        this.mainController = mainController;
        this.Row_Spin.RowView_Setup(jsonJackpotModel,jackpotType,rewardValue);
        this.jackpotType = jackpotType;
        this.rewardValue = rewardValue;
    
        this.Row_Spin.node.active = false;

        this.ThanTai_Skeleton.node.active = true;
        this.ShowAnimation_JackpotView();
        this.ShowAnimation_ShowDeco("CH_JackpotView_Decor_Spin",0.1);


        this.Golden_Tree_Skeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'GreentoGold') {
               
                this.Golden_Tree_Skeleton.setAnimation(0,'Idle_Gold',true);
             }
        });
            this.Golden_Tree_Skeleton.setAnimation(0,'GreentoGold',false);
       
    },

    ShowAnimation_JackpotView()
    {
        require("AudioController_V2").getIns().audioPool.play_ThanTaiAppear_Fx_Sound();

        this.ThanTai_Skeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'animation_Appear') {
                this.Row_Spin.node.opacity = 0;
                this.Row_Spin.node.active = true;
                this.Row_Spin.node.runAction(cc.fadeIn(.5));

                this.Button_Spin.opacity = 0;
                this.Button_Spin.active = true;
                this.Button_Spin.runAction(cc.fadeIn(.5));

                this.SpinView.active = true;
                this.Row_Collection_Animation.play("CH_JackpotView_RowCollection_Slow_Spin");
                this.ThanTai_Skeleton.setAnimation(0,'animation_Idle',true);

                this.TimeContent.active = true;
                this.startTimer();  
             }
        });
        this.ThanTai_Skeleton.setAnimation(0,'animation_Appear',false);
    },

    ClickSpin()
    {

        this.TimeContent.active = false;
        this.stopTimer();  

        require("AudioController_V2").getIns().audioPool.playGoingEffect_Fx_Sound();

        this.Button_Spin_Component.interactable = false;
        this.loopSpinIndex = 0;
        this.Button_Spin.runAction(cc.fadeOut(.5));
       // this.Mask.runAction(cc.fadeOut(.5));
       this.Mask.active = false;
        this.ShowAnimation_SpinRow();
        
    },

    ShowAnimation_SpinRow()
    {
        this.ShowAnimation_ShowDeco("CH_JackpotView_Decor_Spin",1);

        require("AudioController_V2").getIns().audioPool.playNearWin_Fx_Sound();
        
       let sefl = this;
       this.Row_Collection_Animation.on("finished" ,
            ()=>{

                sefl.loopSpinIndex++;
                if(sefl.loopSpinIndex < 30)
                {
                    sefl.ShowAnimation_SpinRow();
                    return;
                }
                this.Row_Collection_Animation.off("finished");

               let animation_Name = "CH_JackpotView_RowCollection_Mini_Stop";
                switch(sefl.jackpotType)
                {
                    case 1:
                        animation_Name = "CH_JackpotView_RowCollection_Mini_Stop";
                        break;
                    case 2:
                        animation_Name = "CH_JackpotView_RowCollection_Minor_Stop";
                        break;
                    case 3:
                        animation_Name = "CH_JackpotView_RowCollection_Major_Stop";
                        break;
                    case 4:
                        animation_Name = "CH_JackpotView_RowCollection_Stop";                         
                         break;
                }

                let callBack = ()=>{
          
                     sefl.Row_Collection_Animation.off("finished" , callBack);

                     require("AudioController_V2").getIns().audioPool.playTakeJackpot_Reward();

                      sefl.ShowEndPopup();
                   }

                   sefl.Row_Collection_Animation.on("finished" , callBack);
                sefl.Row_Collection_Animation.play(animation_Name);
            }
       );
       sefl.Row_Collection_Animation.play("CH_JackpotView_RowCollection_Spin");
    },

    /*
    CallBack_SpinRow_Animation()
    {  
    },
    */

    GetStopSpinName()
    {
        let defaultName = "CH_JackpotView_RowCollection_Mini_Stop";
        switch(this.jackpotType)
        {
            case 1:
                return "CH_JackpotView_RowCollection_Mini_Stop";
            case 2:
                return "CH_JackpotView_RowCollection_Minor_Stop";
            case 3:
                return "CH_JackpotView_RowCollection_Major_Stop";
            case 4:
                return "CH_JackpotView_RowCollection_Stop";
        }
        return defaultName;
    },

    ShowEndPopup()
    {
        this.ShowAnimation_ShowDeco("CH_JackpotView_Decor_Stop");
        //this.Mask.active = true;
        this.Mask.active = true;
        /*
        this.Mask.opacity = 150;
        this.Mask.runAction(cc.fadeIn(.5));
        */
        
        this.WinJackpot.active = true;
        this.Effect_View.active = true;
        //
        this.ShowParticle_EndPopupParticle();

        this.SetTotalWinUI(this.rewardValue);

        let timeEnd = 10;
        
        this.scheduleOnce(()=>{
            this.Coin_Particle.node.active = false;

            require("AudioController_V2").getIns().audioPool.play_JackpotView_EndTienRoi_Fx_Sound();
        }, timeEnd);

        this.scheduleOnce(()=>{
            this.Effect_View.active = false;
            this.SpinView.active = false;
            this.ThanTai_Skeleton.node.active = false;
        }, timeEnd+1);

        this.scheduleOnce(()=>{            
            this.mainController.mainView.Destroy_JackpotView();
        }, timeEnd+2);

    },
    ShowParticle_EndPopupParticle()
    {
        for(let i=0;i< this.VFX_Effect_Particle.length;i++)
        {
            this.VFX_Effect_Particle.resetSystem();
        }
    },
    OffParticle_EndPopupParticle()
    {
        for(let i=0;i< this.VFX_Effect_Particle.length;i++)
        {
            this.VFX_Effect_Particle.stopSystem();
        }
    },


    ShowAnimation_ShowDeco(animationName,speed = 1)
    {
        for(let i=0;i< this.Deco_Animation.length;i++)
        {
            this.Deco_Animation[i].play(animationName);
            this.Deco_Animation[i].speed = speed;
        }
    },

    SetTotalWinUI(totalWin)
    {
        if(totalWin == 0)
        {
            this.TotalWin_Lb.node.active = false;
        }            
        else
        {
            this.TotalWin_Lb.node.active = true;
            this.TotalWin_Lb.tweenValueto(totalWin,10);
        }
    },

    resetTimer: function () {
        this.timer = 0;
    },

    startTimer: function () {
        this.isTimer = true;
    },

    stopTimer: function () {
        this.isTimer = false;
    },

    update(dt)
    {
        if (this.isTimer) {
            this.timer += dt;
            let remainTime =  Math.round(15 - this.timer);
            this.Time_Lb.string = remainTime + 's';
          


            if (this.timer >= 15) {
                this.ClickSpin();
                this.stopTimer();
            }
        }
    },

   




    // update (dt) {},
});
