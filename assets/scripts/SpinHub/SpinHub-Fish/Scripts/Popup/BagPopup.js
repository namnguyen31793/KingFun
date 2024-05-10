var NUMBER_ROW_MAX = 10;
var NUMBER_ITEM_IN_ROW = 6;
cc.Class({
    extends: cc.Component,

    ctor(){
        this.currentInfo = null;
    },

    properties: {
        srcView : require("BaseScrollViewNode"),
        iconShowInfo : cc.Sprite,
        iconGame : cc.Sprite,
        textContentItem : cc.Label,
        textNumbetItem : cc.Label,
        btnUse : cc.Node,
    },

    show() {
		this.node.active = true;
        this.getComponent(cc.Animation).play("AnimShowBag");

        this.scheduleOnce(()=>{
            this.SetInfo ();
        } , 0.5);
    },    

    SetInfo() {
        let listItemDataBag = require("BagController").getIns().listDataItem;
        let listItemDataFree = require("BagController").getIns().listDataFree;
        let listItemData = [];
        for(let i = 0; i < listItemDataBag.length; i++){
            if(listItemDataBag[i].ItemId > 0 && listItemDataBag[i].ItemId != 4)
                listItemData.push(listItemDataBag[i]);
        }
        for(let i = 0; i < listItemDataFree.length; i++){
            listItemData.push(listItemDataFree[i]);
        }
        cc.log(listItemData);
        let listData = [];
        for(let i  = 0; i < NUMBER_ROW_MAX; i++){
            let data = [];
            for(let j = 0; j < NUMBER_ITEM_IN_ROW; j++){
                if((i*NUMBER_ITEM_IN_ROW + j) < listItemData.length)
                {
                    data[j] = listItemData[i*NUMBER_ITEM_IN_ROW + j];
                }
                else
                    data[j] = null;
            }
            listData[i] = data;
        }

        this.srcView.resetScr();
        this.scheduleOnce(()=>{
            this.srcView.init(listData , listData.length*100 , 100);
        }, 0.1)
    },

    ShowItemByInfo(info) {
        this.currentInfo = info;
        if(info.ItemId != null) {
            Global.Helper.GetIconBagByType(this.iconShowInfo, info.ItemId);
            this.textContentItem.string = this.GetContentByType(info.ItemId);
            this.iconGame.spriteFrame = null;
        } else if(info.GameID != null) {
            Global.Helper.GetIconBagByType(this.iconShowInfo, 99);
            Global.Helper.GetIconGame(this.iconGame, info.GameID);
            this.textContentItem.string = this.GetContentByType(99, info.GameID);
        }
        
        this.textNumbetItem.string = "X"+Global.Helper.formatNumber(info.Amount);
        
        //show button by type have use
        this.btnUse.active = true;
    },

    GetContentByType(type, gameId){
        let content = Global.MyLocalization.GetText("CONTENT_ITEM_GOLD");
        if(type == Global.Enum.ITEM_TYPE.ICE){
            content = Global.MyLocalization.GetText("CONTENT_ITEM_ICE");
        }
        if(type == Global.Enum.ITEM_TYPE.SPEED ){
            content = Global.MyLocalization.GetText("CONTENT_ITEM_SPEED");
        }
        if(type == Global.Enum.ITEM_TYPE.TARGET){
            content = Global.MyLocalization.GetText("CONTENT_ITEM_TARGET");
        }
        if(type == Global.Enum.ITEM_TYPE.DIAMOND){
            content = Global.MyLocalization.GetText("CONTENT_ITEM_DIAMOND");
        }
        if(type == Global.Enum.ITEM_TYPE.KEY_PIGBANK){
            content = Global.MyLocalization.GetText("CONTENT_ITEM_KEY_PIGBANK");
        }
        if(type == Global.Enum.ITEM_TYPE.KEY_CHANGE_NICKNAME){
            content = Global.MyLocalization.GetText("CONTENT_ITEM_CHANE_NAME");
        }
        if(type == Global.Enum.ITEM_TYPE.ITEM_BONUS){
            content = Global.MyLocalization.GetText("CONTENT_LUCKY_CARD");
        }
        if(type == Global.Enum.ITEM_TYPE.KEY_EVENT_SMALL_USER){
            content = Global.MyLocalization.GetText("CONTEN_KEY_EVENT_SMALL");
        }
        if(type == Global.Enum.ITEM_TYPE.KEY_EVENT_BIG_USER){
            content = Global.MyLocalization.GetText("CONTEN_KEY_EVENT_BIG");
        }
        if(type == 99){
            content = Global.Helper.formatString(Global.MyLocalization.GetText("CONTENT_FREE_SPIN"),[Global.MyLocalization.GetText("SLOT_"+gameId)]);
        }
        return content;
    },

    Hide(){
        this.node.getComponent(cc.Animation).play("AnimHideBag");
        this.scheduleOnce(()=>{
            this.ResetUI();
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.5);
    },

    ResetUI(){
        this.ResetUiViewItem();
    },

    ResetUiViewItem(){
        this.currentInfo = null;
        this.iconShowInfo.spriteFrame = null
        this.textContentItem.string = "";
        this.textNumbetItem.string = "";
        this.btnUse.active = false;
        this.iconGame.spriteFrame = null;
    },

    clickButtonUse(){
        cc.log(this.currentInfo);
        if(this.currentInfo == null)
            return;
        let currentScreen = require("ScreenManager").getIns().currentScreen;
        if(this.currentInfo.ItemId != null) {
            cc.log("user:"+this.currentInfo.ItemId);
            if(this.currentInfo.ItemId <= 3){
                if(currentScreen != 0 && currentScreen) 
                    if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY){
                        var event = null;
                        Global.LobbyView.ClickJoinFishRoom2D(event, 1);
                    }
                    if(currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
                        var event = null;
                        Global.GameLogic.mainActor.itemControl.ClickUseItem(event, this.currentInfo.ItemId);
                    }
            } else if(this.currentInfo.ItemId == Global.Enum.ITEM_TYPE.KEY_CHANGE_NICKNAME) {
                if(currentScreen != 0 && currentScreen) 
                    if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY){
                        Global.UIManager.showSetNamePopup(Global.BagPopup.UpdateNickName);
                    }else{
                        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NOT_USE_THIS_SCREEN"));
                    }
            } else if(this.currentInfo.ItemId == Global.Enum.ITEM_TYPE.KEY_PIGBANK) {
                if(currentScreen != 0 && currentScreen) 
                    if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY){
                        require("SendRequest").getIns().MST_Client_Event_PingBank_Get_Current_PigBank_Info();
                    }else{
                        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NOT_USE_THIS_SCREEN"));
                    }
            } else if(this.currentInfo.ItemId == Global.Enum.ITEM_TYPE.ITEM_BONUS) {
                Global.UIManager.showLuckyCardPopup();
            } else if(this.currentInfo.ItemId == Global.Enum.ITEM_TYPE.KEY_EVENT_SMALL_USER) {
                cc.log("smalllll");
                Global.UIManager.showGachaEvent(0);
            } else if(this.currentInfo.ItemId == Global.Enum.ITEM_TYPE.KEY_EVENT_BIG_USER) {
                cc.log("bigggg");
                Global.UIManager.showGachaEvent(1);
            }
        } else if(this.currentInfo.GameID != null) {
            if(currentScreen != 0 && currentScreen) 
                if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY){
                    let data = {};
                    data[1] = this.currentInfo.GameID;
                    data[2] = this.currentInfo.RoomID;
                    require("SendRequest").getIns().MST_Client_Reward_Spin_Take_Reward(data);
                    Global.UIManager.showMiniLoading();
                    Global.Helper.LogUseFreeSpin(Global.Enum.TYPE_FREE_SPIN.BAG_POPUP, this.currentInfo.GameID);
                }else{
                    Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NOT_USE_THIS_SCREEN"));
                }
        }
        
        this.Hide();
    },

    UpdateNickName(nickName){
        let msgData = {};
        msgData[1] = nickName;
        require("SendRequest").getIns().MST_Client_Set_NickName (msgData);
    },

    onDestroy(){
		Global.BagPopup = null;
	},

    onLoad() {
        Global.BagPopup = this;
    },
});
