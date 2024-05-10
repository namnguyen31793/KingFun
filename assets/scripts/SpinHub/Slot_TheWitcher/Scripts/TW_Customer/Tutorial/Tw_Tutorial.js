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

        Step_3 : cc.Node,
        Popup_Step_3_Array : [cc.Node],

        Hand_Object : cc.Node,

     

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setTutorial(this);
    },
    onEnable()
    {
        this.ShowAnimation_TutorialPopup();
        this.Popup_Step_1_5_Object.active = false;
        this.Off_All_Step1_5();
        this.Step_2.active = false;
        this.BlockPanel.active = true;
        this.Popup_Step_2_5_Object.active = false;
        this.Off_All_Step2_5();
        this.Step_3.active = false;
        this.Off_All_Step3();
        cc.log("TW_Tutorial: ON ENABLE");
    },


    start () {

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
    Off_All_Step3()
    {
        this.Step_3.active = false;
        for(let i= 0;i< this.Popup_Step_3_Array.length;i++)
        {
            this.Popup_Step_3_Array[i].active = false;
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
            case 5: 
                 this.SpinBtn.active = false;
                this.ShowAnimation_Step5();
                break;

        }
    },


    ShowAnimation_Step0()
    {
        this.tutorialStaus = true;
        this.Step_1.active = true;
        this.SpinBtn.active = true;
    },
    ShowAnimation_Step1()
    {
        this.SpinBtn.active = false;
        if(!this.tutorialStaus)
            return;
        this.stepPopupIndex = 0;
        this.Popup_Step_1_5_Object.active = true;
        this.Popup_Step_1_5_Array[this.stepPopupIndex].active = true;    
    },
    ShowAnimation_Step2()
    {
        this.SpinBtn.active = false;
        if(!this.tutorialStaus)
            return;
        this.stepPopupIndex = 0;
       this.Step_2.active = true;
       this.Popup_Step_2_5_Object.active = true;
    },
    ShowAnimation_Step4()
    {
    },
    ShowAnimation_Step5()
    {
        this.Step_3.active = true;
        this.onClick_NextStep();
    },

    GetTutorialData()
    {
        cc.log("-----------GetTutorialData-------------");
        if(!this.tutorialStaus)
            return null;
        ++this.tutorialStep;
        let responseData = [];
        switch( this.tutorialStep)
        {
            case 1:
                responseData[1] =  0;
                responseData[2] =  "9,13,29,8,9,9,9,9,11,7,13,8,9,8,12";
                responseData[3] =  '127,118,109,46,37,28';
                responseData[4] =  108000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  108000;         
                responseData[11] =  100070000;  
                responseData[12] =  50000300;  
                responseData[13] =  false;        
                responseData[14] =  '';        
                return responseData;
            case 2:
                responseData[1] =  0;
                responseData[2] =  "9,10,9,8,12,8,8,4,6,8,11,14,10,5,5";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  100040000;  
                responseData[12] =  50000300;  
                responseData[13] =  false;        
                responseData[14] =  '';        
                return responseData;
            case 3:
                responseData[1] =  0;
                responseData[2] =  "24,8,11,27,6,14,9,13,3,30,10,28,31,6,8";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  100040000;  
                responseData[12] =  50001600;  
                responseData[13] =  true;        
                responseData[14] =  '';        
                return responseData;
            case 4: 
                responseData[1] =  0;
                responseData[2] =  "2,7,13,9,8,2,7,7,7,10,2,13,8,7,8";
                responseData[3] =  '217,205,202,178,175,136,124,121,97,94,55,43,40,16,13';
                responseData[4] =  2460000;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  0;
                responseData[8] =  0;
                responseData[9] =  2460000;         
                responseData[11] =  149840000;  
                responseData[12] =  50001000;  
                responseData[13] =  false;        
                responseData[14] =  '';        
                return responseData;
            case 5: 
                responseData[1] =  0;
                responseData[2] =  "10,9,11,6,8,9,3,3,5,4,8,7,14,3,9";
                responseData[3] =  '';
                responseData[4] =  0;
                responseData[5] =  0;
                responseData[6] =  0;
                responseData[7] =  8;
                responseData[8] =  0;
                responseData[9] =  0;         
                responseData[11] =  152340000;  
                responseData[12] =  50001000;  
                responseData[13] =  false;        
                responseData[14] =  '';        
                return responseData;
            

        }
        return null;
    },

    onClick_SpinBtn()
    {
        cc.log("onClick_SpinBtn");
        this.spinController.spinView.onClick_Spin();
        this.Step_1.active = false;
        this.BlockPanel.active = false;
        this.Hand_Object.active = false;
        this.SpinBtn.active = false;
      
        this.Off_All_Step1_5();
        this.Off_All_Step2_5();
    },

    onClick_NextStep()
    {
        if(this.tutorialStep == 1)
        {
            this.Off_All_Step1_5();
            ++this.stepPopupIndex    
            this.Popup_Step_1_5_Array[this.stepPopupIndex].active = true;
            if(this.stepPopupIndex == 3)
            {
                this.Hand_Object.active = true;
            }
            if(this.stepPopupIndex >= (this.Popup_Step_1_5_Array.length-1))
            {
                this.SpinBtn.active = true;
                this.stepPopupIndex = 0;
                return;
            }         
        }
        else if(this.tutorialStep == 2)
        {
            this.Off_All_Step2_5();
            ++this.stepPopupIndex    
            this.Popup_Step_2_5_Array[this.stepPopupIndex].active = true;
            if(this.stepPopupIndex == 1)
            {
                this.Hand_Object.active = true;
                this.SpinBtn.active = true;
            }
            
            if(this.stepPopupIndex >= (this.Popup_Step_2_5_Array.length-1))
            {  
                this.SpinBtn.active = true;
                this.stepPopupIndex = 0;
                return;
            }               
        }
        else if(this.tutorialStep == 5)
        {
            this.Off_All_Step3();
            this.Step_3.active = true;
            this.Popup_Step_3_Array[this.stepPopupIndex++].active = true;
            if(this.stepPopupIndex == 2) // end
            {
                this.spinController.mainView.Destroy_TutorialView();
            }
            
                       
        }
        
    },

    onClick_Inc_Bet()
    {
        cc.log("onClick_Inc_Bet");
        this.Bet_Lb.string = "100,000";
        this.spinController.setBetConfigByBet(100000);
        this.onClick_NextStep();

    },
    onClick_SkipTutorial()
    {
        this.spinController.mainView.Destroy_TutorialView();
    },

    ShowAnimation_AfterFromFreespinView()
    {
        cc.log("ShowAnimation_AfterFromFreespinView");
        cc.log("this.tutorialStep: "+this.tutorialStep);
        if(this.tutorialStep >= 5)
        {
            this.ShowAnimation_TutorialPopup();
        }
    },
    onDestroy()
    {
        this.spinController.setTutorial(null);
    }
    


});
