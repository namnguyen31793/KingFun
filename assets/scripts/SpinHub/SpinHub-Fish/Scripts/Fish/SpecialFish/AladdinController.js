// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor(){
        this.toDoList = null;
    },
    properties: {
        Anim_Panel : cc.Node,
        MultiReward_Panel : cc.Node,
        BetMulti_Panel: cc.Node,
        SandCircle : cc.Node,
        CircleMask : cc.Node,
        Aladdin_Comming: cc.Node,
        Sand_Mask : cc.Node,
        Bet : cc.Node,
        TotalReward : cc.Node,   
        MultiLabel : require("TextJackpot"),
        TotalRewardLabel: require("TextJackpot"),
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {

        this.MultiReward_Panel.active = false;
        this.Anim_Panel.active = true;
        this.animPanel_Animation = this.Anim_Panel.getComponent(cc.Animation);
        this.multiReward_Animation = this.MultiReward_Panel.getComponent(cc.Animation);
        this.sandCircle_Animation = this.SandCircle.getComponent(cc.Animation);
        this.SandCircle.active = false;
        this.CircleMask.active = false;
        this.BetMulti_Panel.active = true;
        this.Bet_Label = this.Bet.getComponent(cc.Label);

        this.TotalReward_Label = this.TotalReward.getComponent(cc.Label);

        this.BetMulti_Panel.setPosition(cc.v2(0,0));
        this.MultiLabel.reset();
        this.TotalRewardLabel.reset();

      
        
    },
    Init_ShowAladdin_MultiReward(fishRewardDescription,fishValue,killActor)
    {
     
        let rewardCombo = JSON.parse(fishRewardDescription);       
        this.rewardDescriptionString = rewardCombo.TichLuy_RewardDescription;
        this.MultiExtra =  parseInt(this.rewardDescriptionString);

        this.GunPrice = parseInt(rewardCombo.GunPrice);
        this.HitMulti = parseInt(rewardCombo.HitMulti);
        this.totalRewardValue = fishValue;
        this.killActor = killActor;
        this.killActor.Off_Attack();
        this.Bet_Label.string = this.GunPrice;
        //this.MultiLabel.getComponent(cc.Label).string = this.HitMulti;
        this.MultiLabel.StartIncreaseTo(this.HitMulti);
        this.tempTotalReward = this.HitMulti *  this.GunPrice ;

        let callBack = ()=>{
            this.animPanel_Animation.off("finished" ,callBack );
            this.scheduleOnce(()=>{
                this.BetMulti_Panel.active = false;
                this.animPanel_Animation.play("Aladdin_Result_Charactor");
            }, 2);

            this.scheduleOnce(()=>{
                this.Show_MultiReward(fishRewardDescription,fishValue,killActor);
            }, 4);
            
        }
        this.animPanel_Animation.on("finished" ,callBack );
        this.animPanel_Animation.play("Aladdin_Result_Comming");

        this.scheduleOnce(()=>{
            this.TotalRewardLabel.StartIncreaseTo(this.tempTotalReward);
        }, 2);

    },

    Show_StartReward()
    { 
    },

    Show_MultiReward(fishRewardDescription,fishValue,killActor)
    {
        this.MultiReward_Panel.active = true;
        this.multiReward_Animation.speed = 0.3;

      
        this.CircleMask.active = true;
        
        this.SandCircle.active = true;
        this.sandCircle_Animation.play("Aladdin_SandCircle");
       
        let callBack = ()=>{            
            this.multiReward_Animation.off("finished" ,callBack );

            let callback_WhenEndResultAnim = ()=>{
                this.multiReward_Animation.off("finished" ,callback_WhenEndResultAnim);
                this.End_AnimationLogin();
                this.SandCircle.active = false;
            };
            this.multiReward_Animation.on("finished" ,callback_WhenEndResultAnim);
            this.multiReward_Animation.play("Aladdin_Result_MultiX"+this.MultiExtra);        
        }

        this.multiReward_Animation.on("finished",callBack);
        this.multiReward_Animation.play("Aladdin_Result_Reward");
    },

    End_AnimationLogin()
    {
       
        this.TotalRewardLabel.StartIncreaseTo(this.totalRewardValue);

        this.scheduleOnce(()=>{
            
            this.MultiReward_Panel.active = false;
            this.Aladdin_Comming.active = false;    
             
                let callback_EndResult = ()=>{
                    this.animPanel_Animation.off("finished" ,callback_EndResult);
                    this.scheduleOnce(()=>{
                    this.Finish_LogicReward();
                    },2);
                };
                this.animPanel_Animation.on("finished" ,callback_EndResult);
                this.animPanel_Animation.play("Aladdin_Result_End");        
           

        }, 3);
      
    },


    Finish_LogicReward()
    {
        try
        {
        this.Sand_Mask.active = false;
        let t = cc.tween;
        t(this.Anim_Panel)
         .parallel( t().to(1, { scale: 0.5 }), t().to(1, { position: Global.Helper.GetPositionSliceBySittingIdAndMainSitting(this.killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135))}) )
         .call(() => {
           if(this.killActor!= null)
           {
            
            this.killActor.UpdateBalance(this.totalRewardValue, true);    
           
           }

           this.scheduleOnce(()=>{
                this.killActor.On_Attack();
                this.node.active = false; 
                this.node.destroy();
              }, 3);

         
        })
        .start();
        }
        catch(e)
        {
            this.node.active = false;
        }
    }


    // update (dt) {},
});
