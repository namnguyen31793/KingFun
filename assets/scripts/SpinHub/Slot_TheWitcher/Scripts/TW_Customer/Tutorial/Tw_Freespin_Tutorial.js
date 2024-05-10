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
        this.tutorialStep = 0;
        this.tutorialStaus = false;
        this.stepPopupIndex = 0;
        this.enableSpin = false;
    },

    properties: {
        BotBar : cc.Node,
        BlockPanel : cc.Node,
        Step_1 : cc.Node,
        Popup_Step_1  : cc.Node,

        Popup_Step_1_5_Object  : cc.Node,
        Popup_Step_1_5_Array : [cc.Node],

        

        SpinBtn : cc.Node,
        Bet_Lb : cc.Label,

        Step_2: cc.Node,
        Popup_Step_2_5_Object  : cc.Node,
        Popup_Step_2_5_Array : [cc.Node],

        Hand_Object : cc.Node,

        ExpanderWild : cc.Node,
        TurnLabel : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinController = require("Tw_Freespin_Controller").getIns();
        this.spinController.setTutorial(this);
        this.TurnLabel.node.active = false;
    },
    onEnable()
    {
        this.SpinBtn.active = false;
        this.ShowAnimation_TutorialPopup();  
        this.Off_All_Step1_5(); 
    },
    onDestroy()
    {
        this.spinController.setTutorial(null);
    },
    Off_All_Step1_5()
    {
        for(let i= 0;i< this.Popup_Step_1_5_Array.length;i++)
        {
            this.Popup_Step_1_5_Array[i].active = false;
        }
    },
    Off_All_Step2_5()
    {
        this.Step_2.active = false;
        for(let i= 0;i< this.Popup_Step_2_5_Array.length;i++)
        {
            this.Popup_Step_2_5_Array[i].active = false;
        }
    },
    ShowAnimation_TutorialPopup()
    {
        this.SpinBtn.active = true;
        cc.log("this.tutorialStep: "+this.tutorialStep);
        switch(this.tutorialStep)
        {
            case 0:
                this.ShowAnimation_Step0();
                break;
            case 1:
                this.ShowAnimation_Step1();
                break;
            case 2:
                this.ShowAnimation_Step2();
                break;
            case 4:
                this.ShowAnimation_Step4();
                break;

        }
    },

    ShowAnimation_Step0()
    {
        this.tutorialStaus = true;
        this.Step_1.active = true;
        this.SpinBtn.active = true;
    },

    onClick_SpinBtn()
    {
        cc.log("onClick_SpinBtn");
        if( this.enableSpin)
        {
            this.enableSpin = false;
            this.spinController.Handle_AutoRespin();          
            this.Off_All_Step1_5(); 
        }
        /*
        this.spinController.spinView.onClick_Spin();
        this.Step_1.active = false;
        this.BlockPanel.active = false;
        this.Hand_Object.active = false;
        this.SpinBtn.active = false;
        this.ExpanderWild.active = false;
        this.Off_All_Step1_5();
        this.Off_All_Step2_5();
        */
    },

    onClick_NextStep()
    {
        this.Step_1.active = false;
        cc.log(">>>>>>> Click Next Step");
        if(this.tutorialStep == 0)
        {
            this.Off_All_Step1_5(); 
            this.Popup_Step_1_5_Array[this.stepPopupIndex].active = true;
            ++this.stepPopupIndex    
            if(this.stepPopupIndex == 2)
            {
              //  this.Hand_Object.active = true;
                this.TurnLabel.node.active = true;
                this.TurnLabel.string = 8;
                this.enableSpin = true;
            }
            if(this.stepPopupIndex >= this.Popup_Step_1_5_Array.length)
            {
                this.SpinBtn.active = true;
                this.stepPopupIndex = 0;
                return;
            }         
        }
       
        
    },


    GetTutorialData()
    {
        cc.log("-----------GetTutorialData-------------");
        if(!this.tutorialStaus)
            return null;
       
        ++this.tutorialStep;
        this.TurnLabel.string = 8 - this.tutorialStep;
        let responseData = [];
        switch( this.tutorialStep)
        {
            case 1:
                responseData[1] =  0;
                responseData[2] =  "11,13,1,14,2,4,6,1,9,10,12,12,1,10,12";
                responseData[3] =  '127,118,109,46,37,28';
                responseData[4] =  90000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  7;
                responseData[8] =  0;
                responseData[9] =  90000;         
                responseData[11] =  100090000;  
                responseData[12] =  50000300;  
                responseData[13] =  false;        
                responseData[14] =  '2|1/4';        
                return responseData;
            case 2:
                responseData[1] =  0;
                responseData[2] =  "2,5,1,5,10,5,10,1,12,2,13,10,1,14,5";
                responseData[3] =  '';
                responseData[4] =  52980000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  6;
                responseData[8] =  0;
                responseData[9] =  52980000;         
                responseData[11] =  100040000;  
                responseData[12] =  50000300;  
                responseData[13] =  false;        
                responseData[14] =  '2|3/4'; ;        
                return responseData;
            case 3:
                responseData[1] =  0;
                responseData[2] =  "14,12,1,13,12,4,10,1,4,2,11,13,1,4,7";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  5;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  100040000;  
                responseData[12] =  50001600;  
                responseData[13] =  true;        
                responseData[14] =  '2|4/4';        
                return responseData;
            case 4: 
                responseData[1] =  0;
                responseData[2] =  "6,11,1,13,7,11,7,1,6,10,7,6,1,14,2";
                responseData[3] =  '';
                responseData[4] =  9030000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  4;
                responseData[8] =  0;
                responseData[9] =  9030000;         
                responseData[11] =  149840000;  
                responseData[12] =  50001000;  
                responseData[13] =  false;        
                responseData[14] =  '3|1/4';        
                return responseData;
            case 5: 
                responseData[1] =  0;
                responseData[2] =  "10,4,1,13,2,6,9,1,12,5,2,14,1,14,2";
                responseData[3] =  '';
                responseData[4] =  6660000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  3;
                responseData[8] =  0;
                responseData[9] =  6660000;         
                responseData[11] =  152340000;  
                responseData[12] =  50001000;  
                responseData[13] =  false;        
                responseData[14] =  '3|1/4';        
                return responseData;
            case 6: 
                responseData[1] =  0;
                responseData[2] =  "8,6,1,8,12,10,9,1,13,12,9,7,1,13,7";
                responseData[3] =  '';
                responseData[4] =  180000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  2;
                responseData[8] =  0;
                responseData[9] =  180000;         
                responseData[11] =  152340000;  
                responseData[12] =  50001000;  
                responseData[13] =  false;        
                responseData[14] =  '3|4/4';         
                return responseData;
            case 7: 
                responseData[1] =  0;
                responseData[2] =  "8,6,1,14,2,4,9,1,4,6,12,6,1,14,6";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  1;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  152340000;  
                responseData[12] =  50001000;  
                responseData[13] =  false;        
                responseData[14] =  '4|0/4';       
                return responseData;
            case 8: 
                responseData[1] =  0;
                responseData[2] =  "8,6,1,14,2,4,9,1,4,6,12,6,1,14,6";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  152340000;  
                responseData[12] =  50001000;  
                responseData[13] =  false;        
                responseData[14] =  '4|2/4';       
                return responseData;

        }
    },
});
