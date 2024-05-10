// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nodeHelp : cc.Node,
        lbTime : cc.Label,
        lbMoney :require("LbMonneyChange"),
    },

    show(){
        this.SendGetPigbank();
        this.ShowTime();
		Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");    
	},

    Hide() {
        this.lbMoney.reset();
        this.lbMoney.setMoney(0); 
        this.nodeHelp.active = false;
		this.node.active = false;
		Global.UIManager.hideMark();
	},

	OnClickHelp() {
		this.nodeHelp.active = !this.nodeHelp.active;
	},

	OnClick() {
		Global.UIManager.showShopPopup(true);
        this.Hide();
	},
	
	onDestroy(){
		Global.GratefulBilling = null;
	},

    SendGetPigbank(){
        var data = {
        }
		Global.BaseNetwork.request(CONFIG.BASE_API_LINK+"v1/Services-billing/GetPigBankReward", data, this.GetPigBank);
    },

	GetPigBank(response){
		let lastScreenCode = require("ScreenManager").getIns().lastScreen;
        if(lastScreenCode != 0 && lastScreenCode) {
            if(lastScreenCode != Global.Enum.SCREEN_CODE.LOBBY && lastScreenCode != Global.Enum.SCREEN_CODE.LOGIN)
				return;
        }
		let dataJson = JSON.parse(response);
		let data = dataJson.d;
		if(Global.GratefulBilling == null)
			return;
		Global.GratefulBilling.Init(data);
	},

    Init(money){
        var value = parseInt(money);
        this.lbMoney.setMoney(value);
    },
    
    ShowTime() {
        var now = new Date();
        var countDownDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12,0,0,0).getTime();
        if(now.getTime() >= 12){ 
            countDownDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 12,0,0,0).getTime();
        }
        this.exitsTime = (countDownDate - now.getTime())/1000;

        this.ConverTime(this.exitsTime);
    },

    SetNext(){
        var now = new Date();
        var countDownDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12,0,0,0).getTime();
        if(now.getTime() >= 12){
            countDownDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 12,0,0,0).getTime();
        }
        this.exitsTime = (countDownDate - now.getTime())/1000;
        this.ConverTime(this.exitsTime);
    },

    ConverTime(time) {
        let day = parseInt(time/86400);
        time = time%86400;
        let hours = parseInt(time/3600);
        time = time%3600;
        let minutes = parseInt(time/60);
        let seconds = parseInt(time%60);
        this.lbTime.string = this.formatNumber(hours)+":"+this.formatNumber(minutes)+":"+this.formatNumber(seconds);
    },

    update(dt) {
        this.exitsTime -= dt;
        if(this.exitsTime > 0) {
            this.ConverTime(this.exitsTime);
        } else {
            this.SetNext();
        }
    },

    formatNumber(numb) {
        if(numb >= 10)
            return numb;
        else return "0"+numb;
    },
});
