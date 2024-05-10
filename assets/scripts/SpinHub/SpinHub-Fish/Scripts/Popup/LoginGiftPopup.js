
cc.Class({
    extends: cc.Component,

    ctor() {
        this.toDoList = null;
        this.rewardToDoList = null;
        this.listRewardItem = [];
        this.login_Reward_List_data = null;
        this.continuousLogin_Reward_List_data = null;
        this.ContinuousLoginRewardValue = 0;
        this.loginRewardValue = 0;
        this.afterAcceptContinuousLoginRewardBalance = 0;
        this.afterAcceptLoginRewardBalance = 0;
        this.LoginDayCounter = 0;
        this.ContinuousLoginDayCounter = 0;
        this.modelLoginReward = null;
        this.modelContinuousLoginReward = null;
        this.bonusMoneyValue = 0;
        this.EventGame_VipBonusConfig = null;
    },

    properties: {
        nodeRewardConfig : cc.Node,
        //30day
        progresslb30Day : cc.Label,
        progressImg : cc.Sprite,
        list30Day : {
            default: [],
            type: cc.Node,
        },
        //7day
        list7Day : {
            default: [],
            type: cc.Node,
        },
        btnClose : cc.Node,
        nodeTakeReward : cc.Node,
        itemTakeReward: cc.Node,
        lbBonus : cc.Label,
        nodeBonusEnd : cc.Node,
        nodeTitle7DayReward : cc.Node,
        nodeTitle30DayReward : cc.Node,
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
        this.rewardToDoList = this.nodeTakeReward.addComponent("ToDoList");
        this.listRewardItem[0] = this.itemTakeReward;
    },

    show(continuousLogin_Reward_List, login_Reward_List, beforeBonueValueBalance, continuousLoginRewardValue, afterAcceptContinuousLoginRewardBalance, loginRewardValue, afterAcceptLoginRewardBalance, LoginDayCounter, ContinuousLoginDayCounter, bonusMoneyValue, vipBonusModel, EventGame_VipBonusConfig) {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        this.node.getComponent(cc.Animation).play("ShowBigPopup");
        this.nodeRewardConfig.active = true;
        this.nodeTakeReward.active = false;
        this.Reset();

        this.bonusMoneyValue = bonusMoneyValue;
        this.EventGame_VipBonusConfig = [];
        for(let i = 0; i < EventGame_VipBonusConfig.length; i++){
            this.EventGame_VipBonusConfig.push(JSON.parse(EventGame_VipBonusConfig[i]));
        }
        cc.log(this.EventGame_VipBonusConfig);
        this.ContinuousLoginRewardValue = continuousLoginRewardValue;
        this.loginRewardValue = loginRewardValue;
        this.afterAcceptContinuousLoginRewardBalance = afterAcceptContinuousLoginRewardBalance;
        this.afterAcceptLoginRewardBalance = afterAcceptLoginRewardBalance;
        //set state active
        this.setInfo30Day(login_Reward_List, LoginDayCounter);
        this.setInfo7Day(continuousLogin_Reward_List, ContinuousLoginDayCounter);
        //show anim
        this.playAnimShowItem();
    },

    playAnimShowItem(){
        this.toDoList.CreateList();
        for(let i = 0; i < this.list7Day.length; i++){
            this.toDoList.AddWork(()=>{
                this.list7Day[i].runAction(cc.scaleTo(0.3, 1).easing(cc.easeSineOut()));                    
            }, false);
            if(i < this.list30Day.length){
                this.toDoList.AddWork(()=>{
                    this.list30Day[i].runAction(cc.scaleTo(0.3, 1).easing(cc.easeSineOut()));                    
                }, false);
            }
            this.toDoList.Wait(0.2);
        }
        this.toDoList.AddWork(()=>{
           this.playAnimReward();            
        }, false);
        this.toDoList.Play();
    },

    playAnimReward(){
        this.toDoList.CreateList();
        // this.toDoList.Wait(0.8);
        if(this.ContinuousLoginRewardValue > 0 || this.modelContinuousLoginReward != null ){  
            this.toDoList.AddWork(()=>{
                this.PlayAnimTakeRewardLogin(true);                    
            }, true);
            this.toDoList.Wait(0.3);
            this.toDoList.AddWork(()=>{
                this.FinishInfoContinuous();
            }, false);
        }
        // this.toDoList.Wait(0.6);
        if(this.LoginRewardValue > 0 || this.modelLoginReward != null){   
            this.toDoList.AddWork(()=>{
                this.PlayAnimTakeRewardLogin(false);                    
            }, true);
        }
        this.toDoList.AddWork(()=>{
            this.FinishInfo();              
        }, false);
        // this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            // this.btnClose.active = true;
            this.Hide();         
        }, false);
        this.toDoList.Play();
    },

    PlayAnimTakeRewardLogin(isContinuousLogin){
        this.rewardToDoList.CreateList();;
        // this.rewardToDoList.Wait(0.2);
        this.rewardToDoList.AddWork(()=>{
            this.nodeTakeReward.active = true;       
            this.nodeTakeReward.runAction(cc.scaleTo(0.2, 1).easing(cc.easeSineOut()));            
        }, false);
        // this.rewardToDoList.Wait(0.35);

        let bonusModel = null;
        //take ContinuousLogin
        if(isContinuousLogin){
            this.nodeTitle7DayReward.active = true;
            if(this.modelContinuousLoginReward.RewardBonusDescription != "")
                bonusModel = JSON.parse(this.modelContinuousLoginReward.RewardBonusDescription);
            
            if(this.ContinuousLoginRewardValue > 0){
                this.rewardToDoList.AddWork(()=>{
                    this.listRewardItem[0].active = true;
                    this.listRewardItem[0].getChildByName("label").getComponent(cc.Label).string = Global.Helper.formatNumber(this.ContinuousLoginRewardValue); 
                    this.listRewardItem[0].runAction(cc.scaleTo(0.3, 1).easing(cc.easeSineOut()));          
                }, false);
            }
        }
        //take 30 day login
        else{
            //this.nodeBonusEnd.active = true;
            this.nodeTitle30DayReward.active = true;
            if(this.modelContinuousLoginReward.RewardBonusDescription != "")
                bonusModel = JSON.parse(this.modelContinuousLoginReward.RewardBonusDescription);
            
            // if(this.bonusMoneyValue > 0){
            //     this.lbBonus.string = Global.Helper.formatNumber(this.bonusMoneyValue)+" (VIP"+Global.MainPlayerInfo.vipLevel+")";
            // }else{
            //     this.lbBonus.string = "0 (VIP"+Global.MainPlayerInfo.vipLevel+")"; 
            // }
            
            if(this.loginRewardValue > 0){
                this.rewardToDoList.AddWork(()=>{
                    this.listRewardItem[0].active = true;
                    this.listRewardItem[0].getChildByName("label").getComponent(cc.Label).string = Global.Helper.formatNumber(this.loginRewardValue); 
                    this.listRewardItem[0].runAction(cc.scaleTo(0.3, 1).easing(cc.easeSineOut()));          
                }, false);
            }
        }
        let info = [];
        this.rewardToDoList.Wait(0.15);
        if(bonusModel != null){
            if((bonusModel.length+1) >= this.listRewardItem.length){
                for(let i = this.listRewardItem.length; i <= bonusModel.length; i++){
                    let eff = cc.instantiate(this.itemTakeReward);
                    eff.parent = this.itemTakeReward.parent;
                    eff.active = true;
                    eff.scale = 0;
                    this.listRewardItem[this.listRewardItem.length] = eff;
                }
            }
            for(let i = 0; i < bonusModel.length; i++){
                this.rewardToDoList.AddWork(()=>{
                    this.listRewardItem[i+1].active = true;
                    this.listRewardItem[i+1].getChildByName("label").getComponent(cc.Label).string = "x"+Global.Helper.formatNumber(bonusModel[i].Amount); 
                    Global.Helper.GetIconGame(this.listRewardItem[i+1].getChildByName("icon").getComponent(cc.Sprite), bonusModel[i].GameID);   
                    this.listRewardItem[i+1].runAction(cc.scaleTo(0.3, 1).easing(cc.easeSineOut()));       
                }, false);
                this.rewardToDoList.Wait(0.2);
                info.push(bonusModel[i]);
            }
            Global.RewardSpin_Model = info;
        }
        this.rewardToDoList.Wait(3);
        this.rewardToDoList.AddWork(()=>{
            this.ResetTakeReward();         
        }, false)
        this.rewardToDoList.AddWork(()=>{
            this.nodeTakeReward.runAction(cc.scaleTo(0.2, 0).easing(cc.easeSineOut()));       
            this.toDoList.DoWork();               
        }, false);
        this.rewardToDoList.Play();
    },

    setInfo30Day(login_Reward_List, LoginDayCounter){
        this.login_Reward_List_data = login_Reward_List;
        this.LoginDayCounter = LoginDayCounter;
        for(let i = 0; i < this.list30Day.length; i++){
            if(i < login_Reward_List.length){
                this.list30Day[i].active = true;
                let data = JSON.parse(login_Reward_List[i]);
                let boxunactive = this.list30Day[i].getChildByName("unactive");
                // boxunactive.getChildByName("Label").getComponent(cc.Label).string = data.LoginCounter;
                //this day take
                if(LoginDayCounter == data.LoginCounter){
                    //active anim gift today
                    boxunactive.active = true;
                    this.list30Day[i].getChildByName("active").active = false;
                    this.modelLoginReward = data;
                }else if(LoginDayCounter < data.LoginCounter){
                    boxunactive.active = true;
                    this.list30Day[i].getChildByName("active").active = false;
                }else{
                    boxunactive.active = false;
                    this.list30Day[i].getChildByName("active").active = true;
                }
                //set progress
                if(i == (login_Reward_List.length-1)){
                    this.progresslb30Day.string = (LoginDayCounter-1);
                    this.progressImg.fillRange = (LoginDayCounter-1)/data.LoginCounter;
                }
            }else{
                this.list30Day[i].active = false;
            }
        }
    },

    setInfo7Day(continuousLogin_Reward_List, ContinuousLoginDayCounter){
        this.continuousLogin_Reward_List_data = continuousLogin_Reward_List;
        this.ContinuousLoginDayCounter = ContinuousLoginDayCounter;

        for(let i = 0; i < this.list7Day.length; i++){
            if(i < continuousLogin_Reward_List.length){
                let data = JSON.parse(continuousLogin_Reward_List[i]);
                let active = false;
                if(ContinuousLoginDayCounter > data.ContinuousLogin){
                    active = true;
                }
                if(ContinuousLoginDayCounter == data.ContinuousLogin){
                    this.modelContinuousLoginReward = data;
                }
                let bonusModel = null;
                if(data.RewardBonusDescription != "")
                    bonusModel = JSON.parse(data.RewardBonusDescription);
                
                this.list7Day[i].active = true;
                this.list7Day[i].getComponent("LoginGiftDayElement").Setup(data.RewardMoney, bonusModel, active);
            }else{
                this.list7Day[i].active = false;
            }
        }
    },

    FinishInfoContinuous(){
        for(let i = 0; i < this.list7Day.length; i++){
            if(i < this.continuousLogin_Reward_List_data.length){
                let data = JSON.parse(this.continuousLogin_Reward_List_data[i]);
                let bonusModel = null;
                if(data.RewardBonusDescription != "")
                    bonusModel = JSON.parse(data.RewardBonusDescription);
                if(this.ContinuousLoginDayCounter == data.ContinuousLogin){
                    this.list7Day[i].active = true;
                    this.list7Day[i].getComponent("LoginGiftDayElement").Setup(data.RewardMoney, bonusModel, true);
                }
            }
        }
    },

    FinishInfo(){
        for(let i = 0; i < this.list30Day.length; i++){
            if(i < this.login_Reward_List_data.length){
                let data = JSON.parse(this.login_Reward_List_data[i]);
                if(this.LoginDayCounter == data.LoginCounter){
                    this.list30Day[i].getChildByName("unactive").active = false;
                    this.list30Day[i].getChildByName("active").active = true;
                }
                if(i == (this.login_Reward_List_data.length-1)){
                    this.progresslb30Day.string = this.LoginDayCounter+"";
                    this.progressImg.fillRange = this.LoginDayCounter/data.LoginCounter;
                }
            }
        }
        require("WalletController").getIns().UpdateWallet(this.afterAcceptContinuousLoginRewardBalance);
    },

    Reset(){
        this.btnClose.active = false;
        for(let i = 0; i < this.list7Day.length; i++){
            this.list7Day[i].scale = 0;
        }
        for(let i = 0; i < this.list30Day.length; i++){
            this.list30Day[i].scale = 0;
        }
        this.lbBonus.string = "";
        this.nodeTitle7DayReward.active = false;
        this.nodeTitle30DayReward.active = false;
    },

    ResetTakeReward(){
        this.nodeTakeReward.runAction(cc.scaleTo(0.2, 0).easing(cc.easeSineOut()));    
        this.nodeTakeReward.active = false;
        for(let i =0; i < this.listRewardItem.length; i++){
            this.listRewardItem[i].scale = 0;
            this.listRewardItem[i].active = false;
        }
        this.lbBonus.string = "";
        this.nodeBonusEnd.active = false;
        this.nodeTitle7DayReward.active = false;
        this.nodeTitle30DayReward.active = false;
    },

    Hide() {
        this.Reset();
        this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
            cc.log("action 66666666666");
            Global.LobbyView.showStartGame.Action();
        } , 0.2);
    },

    onDestroy(){
		Global.LoginGiftPopup = null;
	},
});
