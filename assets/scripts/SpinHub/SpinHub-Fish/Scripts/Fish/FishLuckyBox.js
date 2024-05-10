// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("Fish"),

    properties: {
       
    },


    Handle_LogicDeathFish(fishValue, killActor,rewardDescription)
    {
     
        if(killActor.actorPropertis.AccountId != Global.GameLogic.mainActor.actorPropertis.AccountId)
        {
          //  killActor.playing_Icon.active = true;
          cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/NotifyLuckyBoxFish', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish","Special/NotifyLuckyBoxFish", (prefab)=>{
                try
                {
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                let notify = cc.instantiate(prefab);
                notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                notify.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));
                    
                notify.getComponent(cc.Animation).play("AnimNotifyWinLuckyBoxWait");
                let money = notify.getChildByName("BG").getChildByName("WinLabelEnd").getComponent(cc.Label);
                money.string = "";
                notify.scale = 1;
                let time = Global.RandomNumber(7, 12);
                killActor.scheduleOnce(()=>{
                    notify.getComponent(cc.Animation).play("AnimNotifyWinLuckyBoxEnd");
                    money.getComponent("LbMonneyChange")._currentMonney = 0;
                    money.getComponent("LbMonneyChange").time = 2;
                    money.getComponent("LbMonneyChange").setMoney(fishValue);
                } , time);
                //sau 15s thì bot tự chơi tiếp
                killActor.scheduleOnce(()=>{
                    notify.destroy();
                    //tắt thông báo đang chơi
                //    killActor.playing_Icon.active = false;
                    //update lại tiền, hiện score
                    killActor.UpdateBalance(fishValue, true);
                    killActor.On_Attack();        
                } , time+3);
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        }
    },
   
    
   
});
