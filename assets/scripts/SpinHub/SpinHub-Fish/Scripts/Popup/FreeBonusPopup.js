
cc.Class({
    extends: cc.Component,

    properties: {
        character : cc.Sprite,
    },

    onClickClose(){
		this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
	},

    onClickPlay() {
        let data = {};
		data[1] = this.privateKey;
        data[2] = this.config.ConfigId;
        cc.log("send get:");
        cc.log(data);
		require("SendRequest").getIns().MST_Client_FreeReward_Take_Reward(data);
        this.onClickClose();
    },
	
	show(privateKey, config){
        this.privateKey = privateKey;
        this.character.spriteFrame = null;
        this.config = config;
		Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
        Global.DownloadManager.LoadAssest("FreeBonusPopup",cc.SpriteFrame, this.config.Reward.GameID.toString(), (pre)=>{
            Global.FreeBonusPopup.character.spriteFrame = pre;
        });
	},

	
	onDestroy(){
		Global.FreeBonusPopup = null;
	},
});
