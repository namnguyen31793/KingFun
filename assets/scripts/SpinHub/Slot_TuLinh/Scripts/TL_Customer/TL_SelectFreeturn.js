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
        this.FREEGAME_8_TYPE = 1;
        this.FREEGAME_TOPUP = 2;
    },
    properties: {
        btn_8Free : cc.Button,
        btn_topup : cc.Button,
        FreeWin_Lb: cc.Label,
        FreeWin_Bottom_Lb: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:
    ChonCachChoi_Setup(currentMatrix)
    {
        this.currentMatrix = currentMatrix;
       let freeWin = this.Calculation_TichLuy();
        this.FreeWin_Lb.string = freeWin;
        this.FreeWin_Bottom_Lb.string = freeWin;
        this.node.active = true;
        this.ShowAnimation_Apper();
       
    },

    onLoad () {
        this.Select_Animation = this.node.getComponent(cc.Animation);
        this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
        this.spinController.setSelectFreespin(this);
        this.node.active = false;
    },
    OnDestroy()
    {
        this.spinController.setSelectFreespin(null);
    },

    start () {

    },

    onClick_Select_8FreeBtn()
    {
        this.lockAllBtn();
        let callBack = ()=>{
            this.Select_Animation.off("finished" , callBack);
            this.SendClient_Select_8_Free();
            this.node.active = false;
        }
        this.Select_Animation.on("finished" ,callBack );
        this.Select_Animation.play("ChonCachChoi_Select_8Free");
        this.spinController.spinView.onIngameEvent("FREEGAME_OPTION_SELECT");
       
    },

    onClick_Select_topUpBtn()
    {
        this.lockAllBtn();
        let callBack = ()=>{
            this.Select_Animation.off("finished" , callBack);      
            this.SendClient_Select_Topup_Free();
            this.node.active = false;
        }
        this.Select_Animation.on("finished" ,callBack );
        this.Select_Animation.play("ChonCachChoi_Select_Topup");

        this.spinController.spinView.onIngameEvent("FREEGAME_OPTION_SELECT");
       
       
    },

    lockAllBtn()
    {
        this.btn_8Free.interactable = false;
        this.btn_topup.interactable = false;
    },

    unLockAllBtn()
    {
        this.btn_8Free.interactable = true;
        this.btn_topup.interactable = true;
    },
    ShowAnimation_Apper()
    {
        let callBack = ()=>{         
            this.Select_Animation.off("finished" , callBack);
            this.unLockAllBtn();       
            this.spinController.spinView.onIngameEvent("ON_ENTER_FREEGAME_OPTION"); 
           }
           this.Select_Animation.on("finished" ,callBack );
           this.Select_Animation.play("ChonCachChoi_Apper");
    },

    Calculation_TichLuy()
    {

        let matrix =  this.currentMatrix;
        let total = 0;
       
        const stringArray = matrix.split(",");  
       for(let i=0;i< stringArray.length;i++)
       {
        if (stringArray[i].includes('.'))
        {
            let [integerPart, decimalPart] = stringArray[i].split('.');
            integerPart = parseInt(integerPart);
            decimalPart = parseInt(decimalPart);
            if (integerPart === 3) {
            {
                total+= decimalPart;                 
            }
            } else if (integerPart === 4) {
            {
                total+= decimalPart;      
            }
            } else if (integerPart === 5) {
                total+= decimalPart;      
            }
        }
       }
       return total;
    },

    SendClient_Select_8_Free()
    {
        if(this.spinController.spinView.tryPlay)
        {
            let msg = {};
            msg[1] = 8;
            msg[2] = this.FREEGAME_8_TYPE;
            msg[3] = this.spinController.specialID;
            msg[4] = "10,10,10,3.18,10,7,3.18,3.168,3.8,10,9,3.38,7,8,3.168";       
            this.spinController.ServerResponse_Handle_SelectFreeType(msg);
        }
        else
        {
            let msg = {};
            msg[1] = this.spinController.roomID;
            msg[2] = this.FREEGAME_8_TYPE;
            msg[3] = this.spinController.specialID;
            msg[20] = this.spinController.gameID;
            msg[40] = this.spinController.gameID;
            Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_SELECT_FREE_TYPE, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
        }
    },

    SendClient_Select_Topup_Free()
    {
        if(this.spinController.spinView.tryPlay)
        {
            let msg = {};
            msg[1] = 6;
            msg[2] = this.FREEGAME_TOPUP;
            msg[3] = this.spinController.specialID;
            msg[4] = "1,8,8,10,8,8,3.8,3.68,11,11,3.168,3.8,3.18,9,3.18";       
            this.spinController.ServerResponse_Handle_SelectFreeType(msg);
        }
        else
        {
            let msg = {};
            msg[1] = this.spinController.roomID;
            msg[2] = this.FREEGAME_TOPUP;
            msg[3] = this.spinController.specialID;
            msg[20] = this.spinController.gameID;
            msg[40] = this.spinController.gameID;
            Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_SELECT_FREE_TYPE, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
        }
    }

    // update (dt) {},
});
