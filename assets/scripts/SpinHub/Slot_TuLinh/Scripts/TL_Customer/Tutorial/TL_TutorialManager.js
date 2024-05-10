// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("TutorialManager"), 

    properties: {
        JackpotValueConfig: {
            type: cc.Asset,
            default: null
        },
    },
    ctor()
    {
        this.spinTutorial_Inc = 0;
    },
  

   
    // show MuaVatPham
    showMuaVatPhamPopup()
    {
        this.mainController.Show_Popup_MuaBieuTuong();
    },
    hideMuaVatPhamPopup()
    {
        this.mainController.Hide_Popup_MuaBieuTuong();
    },
    _activeExtraBet(active)
    {
        this.mainController.buttonView.activeExtraBetBtn(active);
    },

    GetTutorialData()
    {
        cc.log("-----------GetTutorialData-------------");
    
        ++this.spinTutorial_Inc;
        let responseData = [];
        switch( this.spinTutorial_Inc)
        {
            case 1:
                responseData[1] =  0;
                responseData[2] =  "11,9,8,9,9,8,10,7,8,16,9,8,8,3.168,7";
                responseData[3] =  '156,138';
                responseData[4] =  250000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  250000;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}';  
                responseData[13] =  0;        
                responseData[14] =  '';        
                return responseData;
            case 2:
                responseData[1] =  0;
                responseData[2] =  "16,8,18,8,10,9,8,1,10,10,18,8,9,3.38,7";  
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}';  
                responseData[13] =  0;        
                responseData[14] =  ''; ;        
                return responseData;
            case 3:
                responseData[1] =  0;
                responseData[2] =  "10,3.18,3.38,10,7,7,8,7,7,11,3.68,17,7,1,11";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  28750;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  2;        
                responseData[14] =  '4,1,1,4,3,3,1';        
                return responseData;
            case 4:   // Topup - Free: 6
                responseData[1] =  0;  
                responseData[2] =  "1,8,8,10,8,8,3.8,3.68,11,11,3.168,3.8,3.18,9,3.18"; 
                responseData[3] =  '';
                responseData[4] =  903000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  6;
                responseData[8] =  0;
                responseData[9] =  903000;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'   ;  
                responseData[13] =  false;        
                responseData[14] =  '3|1/4';        
                return responseData;
            case 5:  // Topup - Free: 5
                responseData[1] =  0;
                responseData[2] =  "20,5.576,5.576,21,19,20,3.8,3.68,19,4.288,3.168,3.8,3.18,20,3.18";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  5;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  false;        
                responseData[14] =  '';        
                return responseData;
            case 6:  // Topup - Free: 4
                responseData[1] =  0;
                responseData[2] = "20,5.576,5.576,21,19,20,3.8,3.68,19,4.288,3.168,3.8,3.18,20,3.18";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  4;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  false;        
                responseData[14] =  '3|4/4';         
                return responseData;
            case 7:  // Topup - Free: 3
                responseData[1] =  0;
                responseData[2] =  "20,5.576,5.576,21,20,20,3.8,3.68,21,4.288,3.168,3.8,3.18,20,3.18";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  3;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  false;        
                responseData[14] =  '4|0/4';       
                return responseData;
            case 8: // Topup - Free: 2
                responseData[1] =  0;
                responseData[2] =  "19,5.576,5.576,20,20,20,3.8,3.68,20,4.288,3.168,3.8,3.18,19,3.18";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  2;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  false;        
                responseData[14] =  '4|2/4';       
                return responseData;
            case 9: // Topup - Free: 1
                responseData[1] =  0;
                responseData[2] =  "19,5.576,5.576,20,19,21,3.8,3.68,4.288,4.1728,3.168,3.8,3.18,19,3.18";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  1;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  false;        
                responseData[14] =  '4|2/4';       
                return responseData;
            case 10: // Topup - Free: 1
                responseData[1] =  0;
                responseData[2] =  "4.288,5.576,5.576,4.288,4.288,4.288,3.8,3.68,4.288,4.1728,3.168,3.8,3.18,4.288,3.18";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  500001760;         
                responseData[11] =  712190060;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  4;        
                responseData[14] =  '4|2/4';       
                return responseData;
            case 11: // Normal 
                responseData[1] =  0;
                responseData[2] =  "10,10,10,3.18,10,7,3.18,3.168,3.8,10,9,3.38,7,8,3.168";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  8;
                responseData[8] =  0;
                responseData[9] =  25000;         
                responseData[11] =  711970060;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '';       
                return responseData;
            case 12: // Free - 7
                responseData[1] =  0;
                responseData[2] =  "8,9,11,9,8,8,11,10,10,7,7,7,9,8,8";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  7;
                responseData[8] =  0;
                responseData[9] =  25000;         
                responseData[11] =  711970060;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '';       
                return responseData;
            case 13: // Free - 6
                responseData[1] =  0;
                responseData[2] =  "7,9,10,8,11,11,10,8,8,7,7,8,8,8,10";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  6;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  711970060;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '0|418';       
                return responseData;
            case 14: // Free - 5
                responseData[1] =  0;
                responseData[2] =  "7,10,7,7,7,7,10,9,4.418,8,9,7,7,9,7";
                responseData[3] =  '';
                responseData[4] =  11070000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  5;
                responseData[8] =  0;
                responseData[9] =  11070000;         
                responseData[11] =  711970060;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '1|418';       
                return responseData;
            case 15: // Free - 4
                responseData[1] =  0;
                responseData[2] =  "8,11,7,9,7,11,8,7,8,9,7,7,7,10,8";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  4;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  711970060;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '1|418';       
                return responseData;
            case 16: // Free - 3
                responseData[1] =  0;
                responseData[2] =  "8,8,9,8,9,7,11,9,11,8,8,9,11,8,10";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  3;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  711970060;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '';       
                return responseData;
            case 17: // Free - 2
                responseData[1] =  0;
                responseData[2] =  "7,11,9,8,7,10,8,9,7,9,9,4.418,7,10,10";
                responseData[3] =  '';
                responseData[4] =  1745000;         
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  2;
                responseData[8] =  0;
                responseData[9] =  1745000;         
                responseData[11] =  711970060;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '2|418';       
                return responseData;
            case 18: // Free - 1
                responseData[1] =  0;
                responseData[2] =  "7,10,9,9,10,8,7,7,10,8,8,7,7,7,8";
                responseData[3] =  '';
                responseData[4] =  1745000;         
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  1;
                responseData[8] =  0;
                responseData[9] =  1745000;         
                responseData[11] =  711970060;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '2|418';       
                return responseData;
            case 19: // Free - 0
                responseData[1] =  0;
                responseData[2] =  "10,9,7,8,11,7,8,9,11,4.418,11,8,7,10,8";
                responseData[3] =  '';
                responseData[4] =  0;         
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  500000440;         
                responseData[11] =  1226743000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  4;        
                responseData[14] =  '3|418';       
                return responseData;
        }
        return null;
    },

    _resumeCurrentScript: function() {
        this.mainController.runContinueScript();
    },
    skipTutorial()
    {
        this._super();
        this.spinTutorial_Inc = 19;
        this.mainController.mainView.HideTutorial();
    }



    
});
