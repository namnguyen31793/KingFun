cc.Class({
    extends: cc.Component,
    ctor() {
        this.turnPlay = 0;
        this.isFirst = true;
        this.isPlay = false;
    },

    properties: {
        animLogo : sp.Skeleton,
        animCard : sp.Skeleton,
        animScrath : sp.Skeleton,
        animJackpot : sp.Skeleton,
        animMoney : sp.Skeleton,
        btnScrath : cc.Button,
        btnWatch : cc.Button,
        btnClose : cc.Button,
        lbNumb : cc.RichText,
        lbCardMoney : cc.Label,
        lbJackpot : cc.Label,
        lbNumbAds : cc.RichText,
        lbEffectJackpot : require("TextJackpot"),
        textJackpot : cc.Node,
        nodeStart : cc.Node,
        lbScratch : cc.Label,
        endNode : [cc.Node],
		posMoney : [cc.Node],
        listCoin : [cc.Node],
    },

    show(){
		Global.UIManager.hideMiniLoading();
        this.lbEffectJackpot.reset();
        this.btnScrath.interactable = true;
        this.UpdateNumbOfScratch(0);
        this.isFirst = true;
        require("SendRequest").getIns().MST_Client_Gift_Card_Get_Info();
		require("SendRequest").getIns().MST_Client_Gift_Card_Get_Jackpot();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
        this.btnClose.interactable = false;
        this.node.getComponent(cc.Animation).play("ShowPopup");
        this.scheduleOnce(()=>{
            this.animCard.node.active = true;
            this.animCard.timeScale = 1.5;
            this.animCard.setAnimation(0, 'xuat hien', false);
            this.scheduleOnce(()=>{
                this.UpdateStatusAds();
                this.animCard.timeScale = 1;
                this.btnScrath.node.active = true;
                this.lbScratch.string = "s";
                this.btnClose.interactable = true;
                this.animLogo.timeScale = 1;
                this.animLogo.setAnimation(0, 'logo', true);
                this.animCard.setAnimation(0, 'waiting', true);
            } , 0.95);
        } , 0.3);
	},

    UpdateNumbOfScratch(turnPlay) {
        this.turnPlay = turnPlay;
        this.lbNumb.string = Global.Helper.formatString(Global.MyLocalization.GetText("NUMB_OF_SCRATCH"), [this.turnPlay.toString()]);
        if(this.turnPlay == 0) {
            this.btnScrath.interactable = false;
        } else {
            this.btnScrath.interactable = true;
            this.lbScratch.string = "s";
        }
            
    },

    UpdateJackpotValue(jackpotValue) {
        this.lbJackpot.string = Global.Helper.formatNumber(jackpotValue);
    },

    OnPlayScratch(cardMoney, isJackpot, accountBalance, jackpotValue) {
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
            Global.GameLogic.mainActor.maxBalance = accountBalance;
		} 
        if(this.isFirst) {
            this.isFirst = false;
            require("SendRequest").getIns().MST_Client_Gift_Card_Get_Info();
            this.animCard.setAnimation(0, 'cao the-k lop cao', true);
            this.animScrath.node.active = true;
            this.animScrath.setAnimation(0, 'cao the- lop cao the', false);
            if(isJackpot) {
                this.textJackpot.active = true;
            } else {
                this.lbCardMoney.node.active = true;
                this.lbCardMoney.string = Global.Helper.formatNumber(cardMoney);
            }
            this.scheduleOnce(()=>{
                if(isJackpot) {
                    this.PlayEffectJackpot(accountBalance, cardMoney, jackpotValue);
                } else {
                    this.PlayEffectMoney(accountBalance, jackpotValue, cardMoney);
                }
            } , 2);
        } else {
            this.animCard.setAnimation(0, 'again', false);
            this.lbCardMoney.node.active = false;
            this.animScrath.node.active = false;
            this.textJackpot.active = false;
            this.scheduleOnce(()=>{
                this.UpdateNumbOfScratch(this.turnPlay-1);
                this.animCard.setAnimation(0, 'cao the-k lop cao', true);
                this.animScrath.node.active = true;
                this.animScrath.setAnimation(0, 'cao the- lop cao the', false);
                if(isJackpot) {
                    this.textJackpot.active = true;
                } else {
                    this.lbCardMoney.node.active = true;
                    this.lbCardMoney.string = Global.Helper.formatNumber(cardMoney);
                }
                this.scheduleOnce(()=>{
                    if(isJackpot) {
                        this.PlayEffectJackpot(accountBalance, cardMoney, jackpotValue);
                    } else {
                        this.PlayEffectMoney(accountBalance, jackpotValue);
                    }
                } , 2);
            } , 2);
        }
    },

    onScratch() {
        Global.Helper.LogAction("click play Lucky Card");
        require("SendRequest").getIns().MST_Client_Gift_Card_Play();
        this.isPlay = true;
        this.btnScrath.interactable = false;
        this.btnWatch.interactable = false;
        this.btnClose.interactable = false;
        this.animJackpot.node.active = false;
        this.animMoney.node.active = false;
    },

    onClickClose(){
		this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.animLogo.timeScale = 0;
            this.animLogo.setAnimation(0, 'logo', true);
            this.node.active = false;
            this.btnScrath.node.active = false;
            this.btnWatch.node.active = false;
            this.animCard.node.active = false;
            this.lbCardMoney.node.active = false;
            this.textJackpot.active = false;
            this.animJackpot.node.active = false;
            this.animMoney.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
	},

    PlayEffectJackpot(accountBalance, cardMoney, jackpotValue) {
        this.animJackpot.node.active = true;
        this.animJackpot.setAnimation(0, 'xuat hien', false);
        this.scheduleOnce(()=>{
            this.lbEffectJackpot.StartIncreaseTo(cardMoney);
            this.animJackpot.setAnimation(0, 'waiting', true);
            this.scheduleOnce(()=>{
                this.animMoney.node.active = true;
                this.animMoney.setAnimation(0, 'active', false);
                this.scheduleOnce(()=>{
                    this.PlayEffectMoney(accountBalance, jackpotValue, cardMoney);
                } , 1);
            } , 1);
        } , 0.8);
    },

    PlayEffectMoney(accountBalance, jackpotValue, cardMoney) {
        cc.log("play effect money:"+jackpotValue+"    "+cardMoney);
        this.UpdateJackpotValue(jackpotValue);
        let endNode = this.endNode[0];
		let posMoney = this.posMoney[0];

        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
			endNode = this.endNode[1];
			posMoney = this.posMoney[1];	
		}  else if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
			endNode = this.endNode[2];
			posMoney = this.posMoney[2];
		} 

        if(Global.ContentMoneyView) {
            Global.ContentMoneyView.node.parent = posMoney;
            Global.ContentMoneyView.node.setPosition(cc.v2(0,0));
        }
        let sPos = this.nodeStart;
        let countItem = 0;
        for(let i = 0; i < 10; i++) {
            this.scheduleOnce(()=>{
                let p1 = cc.v2(sPos.x, sPos.y);
                let p3 = cc.v2(endNode.x, endNode.y);
                let p2  = cc.v2(0,0);
                p2.x = p1.x + 200;
                p2.y = p1.y + 100;
                var bezier = [p1,p2,p3];
                var bezierTo = cc.bezierTo(1, bezier);
                this.listCoin[i].active = true;
                this.listCoin[i].setPosition(this.nodeStart.getPosition());
                let action = cc.callFunc(()=>{this.listCoin[i].active = false});
                this.listCoin[i].runAction(cc.sequence(bezierTo, action ));
            } , 0.15 * countItem);
            countItem += 1;
        }
        this.scheduleOnce(()=>{
            if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY || 
                require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.CITY) {
                require("WalletController").getIns().UpdateWallet (accountBalance);
				Global.LobbyView.UpdateInfoView ();
			} else {
				if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
					Global.GameLogic.UpdateBalane (cc.LoginController.getInstance().getUserId(), accountBalance, jackpotValue+cardMoney);
				} else if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
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
            Global.ContentMoneyView.BackToParent();
            this.isPlay = false;
            if(this.turnPlay > 0) {
                this.btnScrath.interactable = true;
                this.lbScratch.string = "s";
            }
            this.btnWatch.interactable = true;
            this.btnClose.interactable = true;
            
        } ,3);
    },

   

    update(dt) {
        if(!this.btnClose.interactable && !this.isPlay) {
            if(Global.BtnOnline)
                this.lbScratch.string = Global.BtnOnline.itemOnline.timeLb.string;
        }
    },

    onDestroy(){
		Global.LuckyCardPopup = null;
	},
});
