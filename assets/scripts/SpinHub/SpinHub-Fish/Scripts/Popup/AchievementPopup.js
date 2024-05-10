

cc.Class({
    extends: cc.Component,
    ctor(){
        this.listAchievementView = [];
        this.cacheView = null;
    },

    properties: {
        achievementView : cc.Node,
        startNode : cc.Node,
        endNode : cc.Node,
    },

    Init() {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        this.listAchievementView[this.listAchievementView.length] = this.achievementView.getComponent("AchievementView");
    },

    show(){
        this.node.scale = 1;
        this.node.opacity = 255;
        this.getComponent(cc.Animation).play("AnimShowPopup");
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        this.Init();
        require("SendRequest").getIns().MST_Client_Event_Mission_Get_Mission_Config();
        require("SendRequest").getIns().MST_Client_Event_Mission_Get_List_Reward_Account();
        for(let i = 0; i < this.listAchievementView.length; i++)
            this.listAchievementView[i].node.active = false;
    },

    UpdateAchievementInfo(achievementInfo) {
        for (let i = 0; i < achievementInfo.length; i++) {
            if (i >= this.listAchievementView.length) {
                let achievementTrans = cc.instantiate(this.achievementView);
                achievementTrans.parent = this.achievementView.parent;
                let achievementElement = achievementTrans.getComponent("AchievementView");
                this.listAchievementView[this.listAchievementView.length] = achievementElement;
            }
            this.listAchievementView [i].node.active = true;
            this.listAchievementView [i].UpdateInfo (achievementInfo[i]);
        }
    },

    SetStateAchievementInfo(achievementInfo) {
        for (let i = 0; i < achievementInfo.length; i++) {
            for(let j = 0; j < this.listAchievementView.length; j++) {
                if(this.listAchievementView[j].missionId == achievementInfo[i].MissionId) {
                    this.listAchievementView[j].SetStateWin(achievementInfo[i]);
                }
            }
        }
    },

    ShowEffect(accountBalance) {
        this.cacheView.ShowEffect(accountBalance);
    },

    Hide(){
		this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
    },
	
	onDestroy(){
		Global.AchievementPopup = null;
	},
    
});
