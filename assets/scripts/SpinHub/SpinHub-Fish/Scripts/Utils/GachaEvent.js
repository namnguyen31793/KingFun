var LENGTH_MOVE = 1200;
const List = require("../Utils/List");

cc.Class({
    extends: require("GachaUi"),
    ctor() {
        this.smallSpin = 0;
        this.bigSpin = 0;
        this.listPlay = new List();
    },

    properties: {
        listImgVip : [cc.SpriteFrame],
        iconVip : cc.Sprite,
        lbTotal : cc.Label,
        lbAmount : cc.Label,
        nodeMove : require("ItemGachaViewEvent"),
        toggle : cc.Toggle,
    },

    ClickToggle() {
        let isShow = !this.toggle.isChecked;
        let show = "1";
        if(!isShow)
            show = "0";
        cc.sys.localStorage.setItem("KEY_SHOW_EVENT_TET" , show);
    },

    Show(roomId){
        let show =  cc.sys.localStorage.getItem("KEY_SHOW_EVENT_TET") || "1";
        let isShow = true;
        if(show == "0") {
            isShow = false;
        }
        this.toggle.isChecked = !isShow;
        this.nodeMove.node.x = 210;
		this.node.active = true;
        this.currentPos = roomId;
        require("SendRequest").getIns().MST_Client_Event_Get_Account_Info ();
        require("SendRequest").getIns().MST_Client_Event_Get_High_Score ();
        if(this.currentPos == 0){
            this.listNodeGacha[this.currentObjectSelect].getComponent("ItemGachaElement").AnimShow(1,1, "room thuong", true);
        } else {
            this.listNodeGacha[this.currentObjectSelect].getComponent("ItemGachaElement").AnimShow(2,1, "room vip", true);
        }
        this.iconVip.spriteFrame = this.listImgVip[this.currentPos];
        var data = {
        }
        Global.BaseNetwork.requestGet(Global.Enum.FISH_TYPE_CONFIG.BASE_API_LINK+"v1/Services-config/GetInfoRewardEventFish?EventId=1", data, Global.GachaEvent.GetInfoEvent);
    },

    GetInfoEvent(response) {
        let dataJson = JSON.parse(response);
        if(dataJson.c != 0) {
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText(data.m));
        } else {
            let data = JSON.parse(dataJson.d);
            let reward = JSON.parse(data.EventReward);
            Global.GachaEvent.lbTotal.string = Global.Helper.formatNumber(reward.Total);
            Global.GachaEvent.lbAmount.string = reward.Iphone;
        }
    },

    UpdateAmount(smallSpin, bigSpin) {
        this.smallSpin = smallSpin;
        this.bigSpin = bigSpin;
        if(smallSpin > 0 || bigSpin > 0) {
            Global.InGameView.objGacha.active = true;
        } else {
            Global.InGameView.objGacha.active = false;
        }
        this.listNodeGacha[this.currentObjectSelect].getComponent("ItemGachaElement").UpdateAmount(this.smallSpin, this.bigSpin);
    },

    Move(isNext){
        this.ActiveButton(false);
        if(isNext)
            this.currentPos+= 1;
        else
            this.currentPos -= 1;
        if(this.currentPos >= 2)
            this.currentPos = 0;
        if(this.currentPos < 0)
            this.currentPos = 1;
        let nextPos = 0;
        this.iconVip.spriteFrame = this.listImgVip[this.currentPos];
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
            if(this.currentPos == 0){
                this.listNodeGacha[nextPos].getComponent("ItemGachaElement").AnimShow(1,1, "room thuong", true);
            } else {
                this.listNodeGacha[nextPos].getComponent("ItemGachaElement").AnimShow(2,1, "room vip", true);
            }
            this.listNodeGacha[nextPos].getComponent("ItemGachaElement").UpdateAmount(this.smallSpin, this.bigSpin);
            this.scheduleOnce(()=>{
                this.ActiveButton(true);
                this.listNodeGacha[this.currentObjectSelect].getComponent("ItemGachaElement").ResetUI();       
                this.currentObjectSelect = nextPos;
                this.InitInfoTop(this.listData1, this.listData2);
            }, 0.3);
        }, 0.3);
    },

    InitInfoTop(listData1, listData2) {
        this.listData1 = listData1;
        this.listData2 = listData2;
        let list = listData2;
        if(this.currentPos == 0) {
            list = listData1;
        } 
        cc.log(list);
        this.listPlay.Clear();
        this.listPlay.Import(list);
        
        this.ShowBigWin();
        if(this.showBigWinSche != null)
            this.unschedule(this.showBigWinSche);
        this.schedule(this.showBigWinSche =  ()=>{
            this.ShowBigWin();
        } , 4);
    },

    ShowBigWin() {
        this.nodeMove.node.setPosition(cc.v2(210, 0));
        if(this.listPlay.GetCount() == 0) {
            return;
        }
        let r = Global.RandomNumber(0, this.listPlay.GetCount());
        let data = this.listPlay.Get(r);
        this.nodeMove.initItem(data);
        this.nodeMove.node.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(0,0)), cc.delayTime(3), cc.moveTo(0.5, cc.v2(-210, 0)), cc.delayTime(0) , cc.callFunc(()=>{
            
        })));
        this.listPlay.RemoveAt(r);
        if(this.listPlay.GetCount()==0) {
            require("SendRequest").getIns().MST_Client_Event_Get_High_Score ();
        }
    },

    Hide(){
		this._super();
        if(this.showBigWinSche != null)
            this.unschedule(this.showBigWinSche);
	},

    onDestroy(){
		Global.GachaEvent = null;
	},
});
