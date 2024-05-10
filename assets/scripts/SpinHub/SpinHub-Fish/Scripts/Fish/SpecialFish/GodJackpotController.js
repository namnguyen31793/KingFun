// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: { 
        RewardBoard_Label :  require("TextJackpot"),  
        StartSound : cc.AudioClip,
        LaughSound : cc.AudioClip,
        CoinJumpSound:  cc.AudioClip
    },

      
  
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
     },

    start () {
       

    },

    show()
    {
        Global.InGameView.OffAuto();
    },




    Init_GodJackpot_Reward( totalReward,killActor)
    {
        this.RewardBoard_Label.reset();
        
        this.killActor = killActor;
        this.totalReward = totalReward;
        cc.audioEngine.playEffect(this.StartSound, false);   
        cc.audioEngine.playEffect(this.LaughSound, false);      

       let currentAnimation = this.node.getComponent(cc.Animation);
       //.play("Liondance_ResultAnimation");
        
        let callback = ()=>{
            currentAnimation.off("finished" ,callback );
            this.GodJackpotShowReward();
        }
        currentAnimation.on("finished" ,callback );
        currentAnimation.play("GodFishController_Animation");
       
        
      
    },

    GodJackpotShowReward()
    {
       
        this.RewardBoard_Label.reset();
        this.RewardBoard_Label.StartIncreaseTo(this.totalReward);
      

        this.scheduleOnce(()=>{
            this.Handle_EndReward();
        },5);    
    },

    Handle_EndReward()
    {
        this.node.active = false;

        cc.resources.load('SpinHub-Fish/Prefabs/Fish3/NotifyJackpotGod_Ver2', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish3","NotifyJackpotGod_Ver2", (prefab)=>{
           try{
            if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
            let notify = cc.instantiate(prefab);
            notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
            notify.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(this.killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));

            let money = notify.getChildByName("WinLabelEnd").getComponent(cc.Label);
            money.string = "";
            notify.scale = 1;
            
                money.getComponent("LbMonneyChange")._currentMonney = 0;
                money.getComponent("LbMonneyChange").time = 2;
                money.getComponent("LbMonneyChange").setMoney(this.totalReward);       
                cc.audioEngine.playEffect(this.CoinJumpSound, false);                
           
            //sau 7s thì bot tự chơi tiếp
            this.killActor.scheduleOnce(()=>{
                if(this.killActor!= null)
                {
                 this.killActor.On_Attack();
                 this.killActor.UpdateBalance(this.totalReward, true);    
                 notify.destroy();
                 this.node.destroy();
                }          
            } , 5);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });


            
         
    },




     

    // update (dt) {},
   

});
