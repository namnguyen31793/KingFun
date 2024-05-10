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
           // killActor.playing_Icon.active = true;
           cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/FishCard', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish","Special/FishCard", (prefab)=>{
                try{
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
                let list = this.Default_GetListType();
                for(let i = 0; i < list.length; i++) {
                    let card = cc.instantiate(prefab);
                    card.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                    let fishCard = card.getComponent("FishCardView");
                    fishCard.InitBotCard(list[i], killActor.node.getPosition());
                }
                killActor.scheduleOnce(()=>{
                    cc.resources.load('SpinHub-Fish/Prefabs/Fish/Special/NotifyWinCard', cc.Prefab, function (err, prefab) {      
                    //Global.DownloadManager.LoadPrefab("Fish","Special/NotifyWinCard", (prefab)=>{
                        if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                        return;
                        let notify = cc.instantiate(prefab);
                        notify.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                        notify.scale = 0.4;
                        notify.setPosition(Global.Helper.GetPositionSliceBySittingIdAndMainSitting(killActor.actorPropertis.SittingId, Global.GameLogic.mainActor.actorPropertis.SittingId, cc.v2(-480,-135)));
                        notify.children[0].active = false;
                        notify.getComponentInChildren("sp.Skeleton").setAnimation(0,'xuat hien thong bao',false);
                        killActor.scheduleOnce(()=>{
                            notify.getComponentInChildren("sp.Skeleton").setAnimation(0,'cho dem tien',true);
                        } , 1); 
                        killActor.scheduleOnce(()=>{
                            notify.getComponentInChildren("TextJackpot").StartIncreaseTo(fishValue);
                            killActor.UpdateBalance(fishValue, true);
                            killActor.scheduleOnce(()=>{
                             //   killActor.playing_Icon.active = false;
                                notify.destroy();
                                killActor.scheduleOnce(()=>{
                                    killActor.On_Attack();                             
                                } , 2);
                            } , 2);
                        } , 6); 
                    });
                } , 1.3);     
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }          
            })
        }
    },
    Default_GetListType()
    {
        let check = Global.RandomNumber(0,100);
        if(check < 30) {
            return [3,6,1,9,10,14,5,7,11];
        } else if(check < 50) {
            return [4,2,3,7,1,13,100,1];
        } else if(check < 38) {
            return [1,4,3,7,8,13,14,1,10];
        } else {
            return [4,7,1,5,10,14,2,1,100,8];
        }
    }
    
   
});
