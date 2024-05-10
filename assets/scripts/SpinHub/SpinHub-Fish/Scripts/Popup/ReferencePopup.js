

cc.Class({
    extends: cc.Component,

    properties: {
        label_DisplayName : cc.Label,
        label_FriendId : cc.Label,
        label_ReferenceId : cc.Label,
        label_TriAnTuanReward : cc.Label,
        label_ReferenceReward : cc.Label, 
        label_ReceiveTime: cc.Label,       
        avata : cc.Sprite,
    },

    start() {
        Global.Helper.GetAvata(this.avata);
    },

    show(m_friendId,m_referenceId,m_triAnTuanReward,m_referenceReward,m_takeTime) {
        Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
        this.SetReferenceInfo(m_friendId,m_referenceId,m_triAnTuanReward,m_referenceReward,m_takeTime);
        Global.LobbyView.RequestGetVipConfig();
    },

    SetReferenceInfo(m_friendId,m_referenceId,m_triAnTuanReward,m_referenceReward,m_takeTime) {
        cc.log(m_friendId +"|"+m_referenceId+"|"+m_triAnTuanReward+"|"+m_referenceReward+"|"+m_takeTime);
        this.label_DisplayName.string = cc.LoginController.getInstance().getNickname();
        if(m_friendId == 0)
        m_friendId = "";
        this.label_FriendId.string = m_friendId;
        if(m_referenceId == 0)
        m_referenceId = "";
        this.label_ReferenceId.string = m_referenceId;
        this.label_TriAnTuanReward.string =   Global.Helper.formatNumber (m_triAnTuanReward);
        this.label_ReferenceReward.string = Global.Helper.formatNumber (m_referenceReward);
        this.label_ReceiveTime.string = m_takeTime;


        Global.Helper.GetAvata(this.avata);
    },

    ClickCoppyAccountId() {
        Global.Helper.coppyToClipboard(cc.LoginController.getInstance().getUserId());
    },

    

    Hide() {
        this.node.active = false;
        Global.UIManager.hideMark();
    },

    onDestroy(){
		Global.ReferencePopup = null;
	},

    
});
