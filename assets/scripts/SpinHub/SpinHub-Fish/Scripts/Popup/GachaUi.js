var LENGTH_MOVE = 1200;

cc.Class({
    extends: cc.Component,

    ctor(){
        this.listInfoModel = [];
        this.currentPos = 0;
        this.currentObjectSelect = 0;
    },

    properties: {
        nodeGacha : sp.Skeleton,
        listNodeGacha : {
            default : [],
            type : cc.Node,
        },
        btnNext : cc.Node,
        btnBack : cc.Node,
    },

    Show(){
		this.node.active = true;
        let msgData = {};
        require("SendRequest").getIns().MST_Client_Event_LootBox_Get_Room_Config (msgData);
    },

    SetListInfo(listInfo){
        this.listInfoModel = listInfo;
        cc.log(this.listInfoModel);
        if(this.listInfoModel == null || this.listInfoModel.length == 0){
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("LOCK_FUNTION"), null);
            this.Hide();
            return;
        }
        this.listNodeGacha[this.currentObjectSelect].getComponent("ItemGachaElement").AnimShow(this.listInfoModel[this.currentPos].RoomId,this.listInfoModel[this.currentPos].BetValue, this.getNameByType(this.listInfoModel[this.currentPos].RoomId));
    },

    ShowSpinGacha(value, ExtendDescription, IngameBalance, listDataBagString){
        this.listNodeGacha[this.currentObjectSelect].getComponent("ItemGachaElement").ShowWinGacha(value, ExtendDescription, IngameBalance, listDataBagString);
    },

    ClickNext(){
        this.Move(true);
    },

    ClickBack(){
        this.Move(false);
    },

    Move(isNext){
        this.ActiveButton(false);
        if(isNext)
            this.currentPos+= 1;
        else
            this.currentPos -= 1;
        if(this.currentPos >= this.listInfoModel.length)
            this.currentPos = 0;
        if(this.currentPos < 0)
            this.currentPos = this.listInfoModel.length-1;
        let nextPos = 0;
        if(this.currentObjectSelect == 0)
            nextPos = 1;
        else
            nextPos = 0;
        if(isNext){
            this.listNodeGacha[this.currentObjectSelect].setPosition(cc.v2(0,0));
            this.listNodeGacha[this.currentObjectSelect].runAction(cc.moveTo(0.8, cc.v2(-1*LENGTH_MOVE, 0)).easing(cc.easeSineOut()));             
            this.listNodeGacha[nextPos].setPosition(cc.v2(LENGTH_MOVE,0));
            this.listNodeGacha[nextPos].runAction(cc.moveTo(0.6, cc.v2(0, 0)).easing(cc.easeSineOut()));    
        }else{
            this.listNodeGacha[this.currentObjectSelect].setPosition(cc.v2(0,0));
            this.listNodeGacha[this.currentObjectSelect].runAction(cc.moveTo(0.8, cc.v2(LENGTH_MOVE, 0)).easing(cc.easeSineOut()));             
            this.listNodeGacha[nextPos].setPosition(cc.v2(-1*LENGTH_MOVE,0));
            this.listNodeGacha[nextPos].runAction(cc.moveTo(0.6, cc.v2(0, 0)).easing(cc.easeSineOut()));    
        }
        this.scheduleOnce(()=>{
            this.listNodeGacha[nextPos].getComponent("ItemGachaElement").AnimShow(this.listInfoModel[this.currentPos].RoomId,this.listInfoModel[this.currentPos].BetValue, this.getNameByType(this.listInfoModel[this.currentPos].RoomId));
        
            this.scheduleOnce(()=>{
                this.ActiveButton(true);
                this.listNodeGacha[this.currentObjectSelect].getComponent("ItemGachaElement").ResetUI();       
                this.currentObjectSelect = nextPos;
            }, 0.3);
        }, 0.3);
    },

    ActiveButton(isActive){
        this.btnNext.getComponent(cc.Button).interactable = isActive;
        this.btnBack.getComponent(cc.Button).interactable = isActive;
    },

    Hide(){
		this.node.active = false;
		Global.UIManager.hideMark();
	},

    onDestroy(){
		Global.Gacha = null;
	},

    getNameByType(type){
        var name = '';
        switch(type){
            case 1:
                name = 'capsuletoy1_2';
                break;
            case 2:
                name = 'capsuletoy_2';
                break;
            case 3:
                name = 'gacha_moonrabbit';
                break;
            case 4:
                name = 'gacha_ranking_high';
                break;
            case 5:
                name = 'gacha_ranking_low';
                break;
            case 6:
                name = 'gacha_scratch_card';
                break;
            default:
                name = 'capsuletoy1_2';
                break;
        }
        return name;
    },
});
