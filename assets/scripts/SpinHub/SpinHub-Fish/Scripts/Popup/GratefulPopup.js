cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbNumbFriend : cc.RichText,
        ava : cc.Sprite,
        lbReferralCode : cc.Label,
        lbCoinGreateful : cc.Label,
        lbCoinFriend : cc.Label,
        lbTime : cc.Label,
        objHas : cc.Node,
        objNo : cc.Node,
        lbFriend : cc.Label,
        inputId : cc.EditBox,
        animHelp : [cc.Animation],
    },

    show(){
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
        require("SendRequest").getIns().MST_Client_Event_Get_ReferenceInfo();

	},

    UpdateInfo(currentTriAnModel, countReference, coinTotal, coinReference, sendTime) {
        Global.UIManager.hideMiniLoading();
        this.lbName.string = ": "+cc.LoginController.getInstance().getNickname();
        Global.Helper.GetAvata(this.ava);
        this.lbCoinGreateful.string = Global.Helper.formatNumber(coinTotal);
        this.lbCoinFriend.string = Global.Helper.formatNumber(coinReference);
        this.lbNumbFriend.string = ": <color=#FFE000>"+Global.Helper.formatNumber(countReference)+"</color> liên kết";
        this.lbReferralCode.string = currentTriAnModel.AccountId.toString();
        this.lbTime.string = "Thời gian nhận: "+ require("SyncTimeControl").getIns().convertTimeToString2(sendTime);
        if(currentTriAnModel.FriendId == 0) {
            this.objNo.active = true;
            this.objHas.active = false;
        } else {
            this.objNo.active = false;
            this.objHas.active = true;
            this.lbFriend.string = currentTriAnModel.FriendId.toString();
        }
    },

    SetReference(friendId) {
        // this.objNo.active = false;
        // this.objHas.active = true;
        // this.lbFriend.string = friendId.toString();
        require("SendRequest").getIns().MST_Client_Event_Get_ReferenceInfo();
    },

    ClickShowHelp(event, index) {
        this.animHelp[index].play();
    },

    ClickSetReferenceId() {
        if(this.inputId.string.length == 0) {
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("FRIEND_ID_NOT_NULL"), null);
			return;
        }
        let data = {};
		data[1] = this.inputId.string;
        require("SendRequest").getIns().MST_Client_Event_Set_Reference_Id(data);
    },

    Hide() {
		this.node.active = false;
		Global.UIManager.hideMark();
	},
	
	onDestroy(){
		Global.GratefulPopup = null;
	},
});
