

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.telegramURL = null;
    },

    properties: {
        textName : cc.Label,
        textMoney : cc.Label,
        textDiamond : cc.Label,
        textId : cc.Label,
        textVip : cc.Label,
        textPhoneNumber : cc.Label,
        iconVip : cc.Sprite,
        avata : cc.Sprite,            
        phoneNumberButton : cc.Node, 
    },

    start() {
        Global.Helper.GetAvata(this.avata);
    },

    onLoad() {
        cc.game.on(cc.game.EVENT_HIDE, this.onAppHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onAppShow, this);
    },
    onDestroy() {
        cc.game.off(cc.game.EVENT_HIDE, this.onAppHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onAppShow, this);
    },
    onAppShow() {
        // Xử lý khi ứng dụng được quay lại hoặc chuyển tab trở lại
        let phoneNumber = this.textPhoneNumber.string;      
        if (phoneNumber === null || phoneNumber.trim() === "") {
            // string is null or empty
            require("SendRequest").getIns().MST_Client_Get_PhoneNumber_Info();         
            this.phoneNumberButton.active = true;
        }
        else
            this.phoneNumberButton.active = false;
       
        

    },
    onAppHide() {
        // Xử lý khi ứng dụng bị hold hoặc chuyển tab
        
    },

    show() {      
        Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
        this.SetInfoProfile();
        Global.LobbyView.RequestGetVipConfig();        
        require("SendRequest").getIns().MST_Client_Get_PhoneNumber_Info();
        this.ActiveChangePhoneButton();
        require("SendRequest").getIns().MSG_Client_Get_Telegram_Url();
     
    },

    SetInfoProfile() {
        this.textName.string = cc.LoginController.getInstance().getNickname();
        this.textMoney.string = Global.Helper.formatNumber (Global.MainPlayerInfo.ingameBalance);
        let listItemData = require("BagController").getIns().listDataItem;
        for(let i = 0; i < listItemData.length; i++) {
            if(listItemData[i].ItemId == 4) {
				this.textDiamond.string = Global.Helper.formatNumber(listItemData[i].Amount.toString());
            }
        }
        this.textId.string = cc.LoginController.getInstance().getUserId();
        this.textVip.string = "VIP " + Global.MainPlayerInfo.vip;
        Global.DownloadManager.LoadAssest("Image",cc.SpriteFrame,"Vip/Vip"+cc.LoginController.getInstance().getUserId(), (pre)=>{
            if(Global.ProfilePopup.iconVip != null&& Global.ProfilePopup.iconVip.materials != null)
                Global.ProfilePopup.iconVip.spriteFrame = pre;
        });
        Global.Helper.GetAvata(this.avata);
    },

    SetPhoneNumber(phoneNumber)
    {
        
        this.textPhoneNumber.string = phoneNumber;
       
        this.ActiveChangePhoneButton();
    },

    SetTelegramURL(_telegramURL)
    {
        if(_telegramURL === null ||  _telegramURL.trim() === "")
            return;
        this.telegramURL = _telegramURL;
    },

    ActiveChangePhoneButton()
    {
        let phoneNumber = this.textPhoneNumber.string;
        if (phoneNumber === null || phoneNumber.trim() === "") {
            // string is null or empty
            this.phoneNumberButton.active = true;
           
        }
        else
            this.phoneNumberButton.active = false;
    },

    ClickCoppyAccountId() {
        Global.Helper.coppyToClipboard(cc.LoginController.getInstance().getUserId());
    },

    ClickChangePhoneNumber()
    {
       // let url = "https://telegram.me/Slot79bot?start=phone_"+cc.LoginController.getInstance().getUserId();
       
        cc.sys.openURL(this.telegramURL);
    },

    OpenBag() {
        this.Hide();
        Global.UIManager.showBag();
    },

    Hide() {
        this.node.active = false;
        Global.UIManager.hideMark();
    },

    onDestroy(){
		Global.ProfilePopup = null;
	},

    
});
