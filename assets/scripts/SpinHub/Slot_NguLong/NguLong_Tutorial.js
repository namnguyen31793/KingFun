cc.Class({
    extends: require("TutorialManager2"), 
    ctor()
    {
        this.spinTutorial_Inc = 0;
        this.spinTutorial_Free_Inc = 0;
    },
  
    properties: {
        JackpotValueConfig: {
            type: cc.Asset,
            default: null
        },
    },
    startTutorial()
    {
        this.spinTutorial_Inc = 0;
        this._super();
    },

    GetIndexTutorial(){
        return this.spinTutorial_Inc;
    },

    _resumeCurrentScript: function() {
        if(this.mainDirector)
            this.mainDirector.runCurrentContinueScript();
    },
    reset: function () {
        this._super();
        this.spinTutorial_Free_Inc = 0;
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
                responseData[2] =  "6,3,7,3,6,7,7,1,3,10,7,8,7,9,8";
                responseData[3] =  '208,199,190,127,118,109';
                responseData[4] =  45000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  45000;         
                responseData[11] =  200350000;  
                responseData[12] =  '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
                responseData[13] =  0;        
                responseData[14] =  '5/0';        
                return responseData;
            case 2:
                responseData[1] =  0;
                responseData[2] =  "6,3,7,3,6,5,4,4,6,10,7,8,5,9,8";  
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  199850000;  
                responseData[12] =  '{"RoomId":1,"BetValue":50,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":500,"GrandJackpotValue":1000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0'; 
                return responseData;
            case 3: 
                responseData[1] =  0;
                responseData[2] =  "3,4,4,4,8,3,3,3,5,4,4,3,6,7,4";
                responseData[3] =  '165,164,145,118,64,37';
                responseData[4] =  18000000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  18000000;         
                responseData[11] =  217850000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":0,"GrandJackpotValue":0}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';        
                return responseData;
            case 4:     //free 0
                responseData[1] =  0;  
                responseData[2] =  "3,4,7,1,6,2,2,2,6,10,6,3,5,9,8"; 
                responseData[3] =  '';
                responseData[4] =  1000000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  1;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  218350000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';        
                return responseData;
            case 5:  //free 1
                responseData[1] =  0;
                responseData[2] =  "0,8,13,10,0,5,11,13,7,5,13,1,9,11,6,6,7,6,13,9";
                responseData[3] =  '945,669,653';
                responseData[4] =  4000000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  9;
                responseData[8] =  0;
                responseData[9] =  4000000;         
                responseData[11] =  222350000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '10/0';        
                return responseData;
            case 6:   //free 2
                responseData[1] =  0;
                responseData[2] =  "0,5,3,5,0,9,8,5,4,4,8,6,4,4,7,4,7,7,6,3";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  8;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  222350000;   
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';         
                return responseData;
            case 7:  //free 3
                responseData[1] =  0;
                responseData[2] =  "0,11,3,5,0,3,8,5,7,5,4,6,4,4,7,5,7,1,6,9";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  7;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  222350000;   
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  false;        
                responseData[14] =  '1/0';       
                return responseData;
            case 8: //free 4
                responseData[1] =  0;
                responseData[2] =  "0,5,7,5,0,3,8,7,7,5,7,8,5,4,6,5,7,6,6,9";
                responseData[3] =  '802,725,709';
                responseData[4] =  8700000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  6;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  231050000;   
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';       
                return responseData;
            case 9: //free 5
                responseData[1] =  0;
                responseData[2] =  "0,5,7,10,0,3,13,7,7,5,12,11,3,4,6,5,7,6,6,9";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  5;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  231050000;   
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';       
                return responseData;
            case 10: //free 4
                responseData[1] =  0;
                responseData[2] =  "0,8,1,5,0,3,11,12,3,13,11,12,11,3,12,12,4,6,5,9";
                responseData[3] =  '913,897,609,577';
                responseData[4] =  3000000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  4;
                responseData[8] =  0;
                responseData[9] =  3000000;         
                responseData[11] =  234050000;   
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '10/0';       
                return responseData;
            case 11: //free 3
                responseData[1] =  0;
                responseData[2] =  "0,8,13,10,0,5,11,13,7,5,13,12,9,11,6,6,7,6,13,9";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  3;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  234050000;   
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '10/0';       
                return responseData;
            case 12: //free 2
                responseData[1] =  0;
                responseData[2] =  "0,5,3,5,0,4,9,3,4,4,2,2,2,5,7,4,8,7,6,8";
                responseData[3] =  '673';
                responseData[4] =  1000000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  2;
                responseData[8] =  0;
                responseData[9] =  1000000;         
                responseData[11] =  235050000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';       
                return responseData;
            case 13: //free 1
                responseData[1] =  0;
                responseData[2] =  "0,8,13,4,0,11,11,3,7,5,3,3,9,11,4,12,7,3,13,9";
                responseData[3] =  '689,657';
                responseData[4] =  1000000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  1;
                responseData[8] =  0;
                responseData[9] =  1000000;         
                responseData[11] =  236050000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';       
                return responseData;
            case 14: //free 1
                responseData[1] =  0;
                responseData[2] =  "0,8,13,4,0,11,11,11,7,5,3,3,9,11,4,12,1,3,13,9";
                responseData[3] =  '753,689,473,345';
                responseData[4] =  39000000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  1000000;         
                responseData[11] =  275050000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '30/0';       
                return responseData;
            case 15: //free new 6
                responseData[1] =  0;
                responseData[2] =  "0,8,13,5,0,13,13,11,7,7,4,3,4,11,6,12,1,3,13,9";
                responseData[3] =  '737,461,333';
                responseData[4] =  8250000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  5;
                responseData[8] =  0;
                responseData[9] =  1000000;         
                responseData[11] =  283300000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '15/0';       
                return responseData;
            case 16: //free new 5
                responseData[1] =  0;
                responseData[2] =  "0,12,12,5,0,13,5,6,7,6,8,4,8,4,3,6,6,3,13,9";
                responseData[3] =  '977';
                responseData[4] =  200000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  4;
                responseData[8] =  0;
                responseData[9] =  200000;         
                responseData[11] =  283500000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';       
                return responseData;
            case 17: //free new 4
                responseData[1] =  0;
                responseData[2] =  "0,12,3,5,0,5,9,11,7,6,10,13,8,7,6,12,1,3,13,9";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  3;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  283500000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';       
                return responseData;
            case 18: //free new 3
                responseData[1] =  0;
                responseData[2] =  "0,12,11,5,0,11,5,6,3,13,9,5,1,4,12,7,10,5,5,9";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  2;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  283500000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '1/0';       
                return responseData;
            case 19: //free new 2
                responseData[1] =  0;
                responseData[2] =  "0,12,7,5,0,4,13,13,3,13,7,7,32,3,12,7,4,1,5,9";
                responseData[3] =  '945,897,689,641,497';
                responseData[4] =  14250000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  1;
                responseData[8] =  0;
                responseData[9] =  9000000;         
                responseData[11] =  297750000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":10000}';  
                responseData[13] =  0;        
                responseData[14] =  '15/1';       
                return responseData;
            case 20: //free new 1
                responseData[1] =  0;
                responseData[2] =  "0,32,33,35,0,34,1,6,3,33,3,3,4,4,12,7,4,1,5,9";
                responseData[3] =  '881,693,629,369';
                responseData[4] =  244500000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  444510000;         
                responseData[11] =  742260000;  
                responseData[12] =  '{"RoomId":2,"BetValue":100,"MajorJackpotMulti":10000.0,"GrandJackpotMulti":100000.0,"MajorJackpotValue":5000,"GrandJackpotValue":0}';  
                responseData[13] =  1;        
                responseData[14] =  '30/0';       
                return responseData;
            
        }
        return null;
    },

    GetTutorialFreeData()
    {
        cc.log("-----------GetTutorialData-------------");
        ++this.spinTutorial_Free_Inc;
        let responseData = [];
        switch( this.spinTutorial_Free_Inc)
        {
            case 1:
                responseData[1] =  10;
                responseData[2] =  5;
                responseData[3] =  5;
                responseData[4] =  '';      
                return responseData;
            case 2:
                responseData[1] =  6;
                responseData[2] =  6;  
                responseData[3] =  5;
                responseData[4] =  '';     
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
        this.spinTutorial_Inc = 21; //id cuoi cung trong fake
        this.spinTutorial_Free_Inc = 3;
        // this.mainController.mainView.HideTutorial();
    }
});
