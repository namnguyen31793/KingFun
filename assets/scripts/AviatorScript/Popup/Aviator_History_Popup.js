// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.StartY = -20;
        this.Offset_Y = 120;
        this.ItemCollection = [];
    },
    properties: {
        Content_Node : cc.Node,
        Detail_Item_Node : cc.Node
    },

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.gameController =  require("AviatorGameController").getIns();
    },
    onEnable: function () {

        let seft = this;
       this.animation.play("openPopup"); 
       seft.RequestPlayerHistory();   
    },
    closeClicked: function () {
        //this.showRegister(false);
        let seft = this;
        let callBack = ()=>{    
            seft.animation.off("finished" , callBack);
            this.gameController.AssetManager.Destroy_HistoryPopup();        
        }
       this.animation.on("finished" ,callBack );
       this.animation.play("closePopup");
    },
    RequestPlayerHistory()
    {
        cc.log("RequestSessionDetailHistory");
        this.ClearAllElement();
       
        var url = "api/Aviator/GetHistory";
        let self = this;
        cc.ServerConnector.getInstance().sendRequest(
            cc.SubdomainName.CRASH_GAME,
            url,
            function (response) {
              var obj = JSON.parse(response);
              return self.onAviatorGetPlayerHistoryResponse(obj);
            }
          );
    },
    onAviatorGetPlayerHistoryResponse(arrayInfo)
    {
       if(arrayInfo == null || arrayInfo.length == 0)
       return;
        cc.log("onAviatorGetPlayerHistoryResponse");
       for(let i=0;i< arrayInfo.length;i++)
       {
            var item = cc.instantiate(this.Detail_Item_Node);
            item.active = true;
            this.Content_Node.addChild(item);
            
            item.x = 0;
            item.y =  this.StartY - this.Offset_Y * (i); 
            
            item.getComponent('Aviator_History_Item').show(arrayInfo[i].SessionID,arrayInfo[i].Bet,arrayInfo[i].Award,arrayInfo[i].Odd,arrayInfo[i].Balance,arrayInfo[i].CreateTime);
            this.ItemCollection.push(item);
       }
    },
    ClearAllElement()
    {
        for(let i = 0;i< this.ItemCollection.length;i++)
        {
            this.ItemCollection[i].destroy();
           
        }
      
    },
});
