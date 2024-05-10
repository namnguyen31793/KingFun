var ScreenManager = require("ScreenManager");
cc.Class({
    extends: cc.Component,
	ctor() {
		this.tournamentId = 0;
		
	},

    properties: {
        // foo: {
        money:cc.Label,
		tourId: cc.Label,
		rankIcon : [cc.Node],
		btnGet : cc.Button,
		startNode : cc.Node,
		endNode : [cc.Node],
		posMoney : [cc.Node],
		icon : cc.Sprite,
		listImg : [cc.SpriteFrame],
		anim : cc.Animation,
		listCoin : [cc.Node],
    },

    Hide(){
		this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
	},
	
	show(tournamentId, rankId, reward, gameType){
		this.anim.play();
		let index = gameType - 19;
		if(index < 0 || index >= 5) {
			index = 0;
		}
		this.icon.spriteFrame = this.listImg[index];
		this.tournamentId = tournamentId;
		Global.UIManager.hideMiniLoading();
		this.btnGet.interactable = true;
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.money.string = "+"+Global.Helper.formatNumber(reward);
		this.tourId.string = "TOURNAMENT #"+tournamentId;
		for(let i = 0; i < this.rankIcon.length; i++) {
			if(rankId-1 == i) {
				this.rankIcon[i].active = true;
			} else {
				this.rankIcon[i].active = false;
			}
		}
	},

    ClickGetReward() {
		let data = {};
        data[1] = this.tournamentId;
        require("SendRequest").getIns().MST_Client_Event_Tournament_Take_Account_Reward(data);
	},

	ShowEffect(accountBalance) {
		let endNode = this.endNode[0];
		let posMoney = this.posMoney[0];
		if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
			let slotType = Global.SlotNetWork.slotView.slotType;
			//du phong sau them game slot khac ma quen
			endNode = this.endNode[1];
			posMoney = this.posMoney[1];
			//
			if(slotType == 19) {
				endNode = this.endNode[1];
				posMoney = this.posMoney[1];
			} else if(slotType == 23) {
				endNode = this.endNode[2];
				posMoney = this.posMoney[2];
			} else if(slotType == 21) {
				endNode = this.endNode[3];
				posMoney = this.posMoney[3];
			} else if(slotType == 20) {
				endNode = this.endNode[4];
				posMoney = this.posMoney[4];
			} else if(slotType == 22) {
				endNode = this.endNode[5];
				posMoney = this.posMoney[5];
			} else if(slotType == 17) {
				endNode = this.endNode[6];
				posMoney = this.posMoney[6];
			} else if(slotType == 15) {
				endNode = this.endNode[7];
				posMoney = this.posMoney[7];
			}
		}

		this.btnGet.interactable = false;
		if(Global.ContentMoneyView) {
            Global.ContentMoneyView.node.parent = posMoney;
            Global.ContentMoneyView.node.setPosition(cc.v2(0,0));
        }
        let countItem = 0;
        for(let i = 0; i < 10; i++) {
            this.scheduleOnce(()=>{
                let p1 = cc.v2(this.startNode.x,this.startNode.y);
				let p3 = cc.v2(endNode.x, endNode.y);
				let p2  = cc.v2(0,0);
				p2.x = p1.x + 500;
				p2.y = p1.y + 150;
                var bezier = [p1,p2,p3];
				var bezierTo = cc.bezierTo(1, bezier);
                this.listCoin[i].active = true;
				this.listCoin[i].setPosition(this.startNode.getPosition());
                let action = cc.callFunc(()=>{this.listCoin[i].active = false});
                this.listCoin[i].runAction(cc.sequence(bezierTo, action ));
            } , 0.15 * countItem);
            countItem += 1;
        }
        this.scheduleOnce(()=>{
            if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
				Global.MainPlayerInfo.ingameBalance = accountBalance;
				Global.LobbyView.UpdateInfoView ();
			} else {
				if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
					this.gamelogic.UpdateBalane (cc.LoginController.getInstance().getUserId(), accountBalance);
				} else if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
					require("WalletController").getIns().UpdateWallet (accountBalance);
				}
			}
			let lbMoneyContent = Global.ContentMoneyView.node.getComponentInChildren(cc.Label);
            if(lbMoneyContent != null) {
				lbMoneyContent.node.scale = 2;
                lbMoneyContent.node.runAction(cc.scaleTo(0.3, 1));
            }
        } ,2.5);
		this.scheduleOnce(()=>{
			if(Global.ContentMoneyView) {
            	Global.ContentMoneyView.BackToParent();
			}
			this.Hide();
        } ,3);
	},
	
	onDestroy(){
		Global.RewardTourPopup = null;
	},

    // update (dt) {},
	onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.ShowEffect(1000);
                break;
        }
    },
});
