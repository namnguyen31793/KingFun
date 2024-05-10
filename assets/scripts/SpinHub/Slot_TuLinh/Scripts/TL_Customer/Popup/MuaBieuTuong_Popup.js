// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("PopupViewBase_V2"),

    properties: {
        selectSymblo_Animation: [cc.Animation],
        Gold_Symbols_Content_Array : [cc.Node],
        Price_Label_Array : [cc.Label],
        JackpotView:  require("TL_JackpotView"),
    },
    onLoad () {
        //this.PopupAnimation = this.node.getComponent(cc.Animation);       
        this.node.active = false;
        this.popupAnimation = this.node.getComponent(cc.Animation);
    },
    
   MuaBieuTuong_SetUp(jackpotModel,specialID,roomID,mainController)
   {
      
        this.SetupImg(specialID);  
        let RoomConfig_Map = mainController.RoomConfig_Map;
        let SpecialItemMap = mainController.SpecialItemMap;
        this.mainController = mainController;

        this.CurrentRoomConfig = RoomConfig_Map.find(obj => obj.RoomBetId ==  roomID );
        for(let i = 0;i< this.Price_Label_Array.length;i++)
        {
            this.Price_Label_Array[i].string =  this.CurrentRoomConfig.Bet * SpecialItemMap[i].Price 
        }
        this.node.active = true;
        this.JackpotView.UpdateJackpotValue_BySpecialID(jackpotModel,specialID);
        this.popupAnimation.play("MuaBieuTuong_Apper");
       
   },
   SetupImg(specialID)
   {
        this.ResetInfo();
        this.selectSymblo_Animation[specialID-1].node.active = true;
        this.Gold_Symbols_Content_Array[specialID-1].active = true;
   },
  

   ResetInfo()
   {
        for(let i = 0;i< this.selectSymblo_Animation.length;i++)
        {
            this.selectSymblo_Animation[i].node.active = false;
            this.Gold_Symbols_Content_Array[i].active = false;
        }
   },

   onClick_Close()
   {
    

    let callBack = ()=>{
          
        this.popupAnimation.off("finished" , callBack);

         this.node.active = false;
         this.mainController.spinView.onIngameEvent("JOIN_GAME_CLICK");
         this.mainController.runCurrentContinueScript();
       }
       this.popupAnimation.on("finished" ,callBack );
       this.popupAnimation.play("MuaBieuTuong_Disapper");
       require("AudioController_V2").getIns().playSound(cc.AudioTypes.CLICK);
   
   },
   onClick_SelectBieuTuong(event,index)
   {
        var ID = parseInt(index);
        this.SetupImg(ID);
        this.mainController.specialID = ID;
        this.mainController.setExtraBet();
        require("AudioController_V2").getIns().playSound(cc.AudioTypes.CLICK);
   }

});
