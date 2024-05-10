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
  


    GetTutorialData()
    {
        cc.log("-----------GetTutorialData-------------");
    
        ++this.spinTutorial_Inc;
        let responseData = [];
        switch( this.spinTutorial_Inc)
        {
            case 1:
                responseData[1] =  0;
                responseData[2] =  "8,10,4,11,3,6,6,6,5,8,5,11,8,3,6";
                responseData[3] =  '1';
                responseData[4] =  60000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  60000;         
                responseData[11] =  199960000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1000000,"MiniJackpotMulti":20.0,"MinorJackpotMulti":40.0,"MajorJackpotMulti":400.0,"GrandJackpotMulti":2000.0,"MiniJackpotValue":0,"MinorJackpotValue":0,"MajorJackpotValue":804,"GrandJackpotValue":402}';  
                responseData[13] =  0;        
                responseData[14] =  'FR,100,100|1';        
                return responseData;
            case 2:
                responseData[1] =  0;
                responseData[2] =  "8,10,2,11,3,9,7,1,5,8,5,11,2,3,6";  
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  10;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  199460000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1000000,"MiniJackpotMulti":20.0,"MinorJackpotMulti":40.0,"MajorJackpotMulti":400.0,"GrandJackpotMulti":2000.0,"MiniJackpotValue":0,"MinorJackpotValue":0,"MajorJackpotValue":804,"GrandJackpotValue":402}';  
                responseData[13] =  0;        
                responseData[14] =  '200,FR,100|1'; ;        
                return responseData;
            case 3:  //1
                responseData[1] =  0;
                responseData[2] =  "8,3,10,5,4,6,4,5,9,6,11,3,8,4,10";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  9;
                responseData[8] =  0;
                responseData[9] =  28750;         
                responseData[11] =  199460000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1000000,"MiniJackpotMulti":20.0,"MinorJackpotMulti":40.0,"MajorJackpotMulti":400.0,"GrandJackpotMulti":2000.0,"MiniJackpotValue":0,"MinorJackpotValue":0,"MajorJackpotValue":804,"GrandJackpotValue":402}'; 
                responseData[13] =  0;        
                responseData[14] =  '100,FR,100|1';        
                return responseData;
            case 4:    //2
                responseData[1] =  0;  
                responseData[2] =  "9,3,3,10,5,4,8,7,11,3,5,6,9,8,10"; 
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  8;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  199460000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1000000,"MiniJackpotMulti":20.0,"MinorJackpotMulti":40.0,"MajorJackpotMulti":400.0,"GrandJackpotMulti":2000.0,"MiniJackpotValue":0,"MinorJackpotValue":0,"MajorJackpotValue":804,"GrandJackpotValue":402}';  
                responseData[13] =  0;        
                responseData[14] =  '600,800,50|1';        
                return responseData;
            case 5:   //3
                responseData[1] =  0;
                responseData[2] =  "2,3,11,5,2,2,11,7,11,2,1,6,9,8,2";
                responseData[3] =  '12';
                responseData[4] =  10850000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  7;
                responseData[8] =  0;
                responseData[9] =   10850000;         
                responseData[11] =  (199460000+10850000);  
                responseData[12] =  '{"RoomId":1,"BetValue":1000000,"MiniJackpotMulti":20.0,"MinorJackpotMulti":40.0,"MajorJackpotMulti":400.0,"GrandJackpotMulti":2000.0,"MiniJackpotValue":0,"MinorJackpotValue":0,"MajorJackpotValue":804,"GrandJackpotValue":402}';  
                responseData[13] =  0;        
                responseData[14] =  '2000,1000,500|1';        
                return responseData;
            case 6:   //4
                responseData[1] =  0;
                responseData[2] = "6,5,8,6,2,8,8,6,4,2,8,6,8,11,1";
                responseData[3] =  '';
                responseData[4] =  20000000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  6;
                responseData[8] =  0;
                responseData[9] =  20000000;         
                responseData[11] =  (199460000+10850000+20000000);  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '2500,200,1000|4';         
                return responseData;
            case 7:  //5
                responseData[1] =  0;
                responseData[2] =  "8,5,11,11,3,9,8,4,10,8,10,11,6,3,10";
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
                responseData[14] =  '200,JP,200|1';       
                return responseData;
            case 8: //6
                responseData[1] =  0;
                responseData[2] =  "6,5,9,6,3,3,11,8,10,8,5,7,6,11,10";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  4;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  'FR,JP,200|1';       
                return responseData;
            case 9: //7
                responseData[1] =  0;
                responseData[2] =  "2,3,5,4,4,1,7,6,5,6,2,5,7,3,3";
                responseData[3] =  '35,4';
                responseData[4] =  8000000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  3;
                responseData[8] =  0;
                responseData[9] =  8000000;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '2000,1500,800|2';       
                return responseData;
            case 10: //8
                responseData[1] =  0;
                responseData[2] =  "7,3,5,4,4,5,11,6,5,6,11,5,7,3,3";
                responseData[3] =  '21';
                responseData[4] =  100000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  2;
                responseData[8] =  0;
                responseData[9] =  100000;         
                responseData[11] =  200250000 + 100000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '1000,2000,800|1';       
                return responseData;
            case 11: //9
                responseData[1] =  0;
                responseData[2] =  "9,11,8,3,4,11,10,6,5,3,4,7,6,7,10";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  1;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  200250000;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  0;        
                responseData[14] =  '200,FR,1800|1';       
                return responseData;
            case 12: //10
                responseData[1] =  0;
                responseData[2] =  "6,5,1,6,3,3,11,2,10,8,5,7,2,11,10";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  104900125;         
                responseData[11] =  1254262500;  
                responseData[12] =  '{"RoomId":1,"BetValue":1,"MiniJackpotMulti":5000.0,"MinorJackpotMulti":50000.0,"MajorJackpotMulti":500000.0,"GrandJackpotMulti":500000000.0,"MiniJackpotValue":32,"MinorJackpotValue":4324,"MajorJackpotValue":43636,"GrandJackpotValue":645642}'  ;  
                responseData[13] =  4;        
                responseData[14] =  'FR,JP,600|1';       
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
