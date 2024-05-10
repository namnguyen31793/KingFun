
cc.Class({
    extends: cc.Component,
    ctor(){
        this.TIME_FAKE = 3;
        this.NUMBER_CELL = 8;
        this.isPlay = false;
        this.indexRotation = 0;
        this.fakeAngle = false;
        this.angle = 0;
        this.duration = 0;
        this.listIcon = [];
        this.listDesription = [];
        this.listReward = [];
        this.eventAfter = null;
        this.currentSpin = 0;
        this.indexReward = 0;
        this.winDailyMoney = 0;
        this.accountBalance = 0;
        this.listBuy = [];
        this.cacheZ = 0;
    },

    properties: {
        imgCircle : cc.Sprite,
        anim : cc.Animation,
        textValueWin : cc.Label,
        effectObj : cc.Node,
        textNumberSpin : cc.Label,
        textReward : cc.Label,
        iconItem : require("ItemRewardView"),
        imgXu : cc.SpriteFrame,
        imgPiece : cc.SpriteFrame,
        imgCard : cc.SpriteFrame,
        imgIphone: cc.SpriteFrame,
        animLightSpin : cc.Animation,
        animLightBonos : cc.Animation,
        progress : [cc.Node],
        listPercent : [cc.Label],
        btnVanMay : cc.Button,
        btnShop : cc.Node,
        notifyObj : cc.Node,
    },

    Init() {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        for(let i = 0; i < this.NUMBER_CELL; i++) {
            this.listIcon[i] = cc.find ("ThanTai/circle/Image/list/Image"+(i+1), this.node).getComponent(cc.Sprite);
            this.listDesription[i] = cc.find ("ThanTai/circle/Image/list/Image"+(i+1)+"/Text", this.node).getComponent(cc.Label);
        }
        for(let i = 0; i < this.listPercent.length; i++) {
            this.listPercent[i].string = Global.listPercentBonus[i].TelcoPercentBonus + "%";
        }
        if(Global.isPlayBonus != 0) {
            this.btnVanMay.node.active = false;
            let index = 0;
            for(let i = 0; i < Global.listPercentBonus.length; i++) {
                if(Global.bonusRate == Global.listPercentBonus[i].TelcoPercentBonus) {
                    index = i+1;
                    break;
                }
            }
            for(let j = 0; j < this.progress.length; j++) {
                this.progress[j].active = false;
            }
            for(let j = 0; j < index; j++) {
                this.progress[j].active = true;
            }
        } else {
            this.btnVanMay.node.active = true;
        }
        if(Global.GameConfig != null && Global.GameConfig.FeatureConfig.CashinLobbyFeature == Global.Enum.EFeatureStatus.Open) {
            this.btnShop.active = true;
            this.notifyObj.action = true;
		} else {
            this.btnShop.active = false;
            this.notifyObj.active = false;
        }
    },

    show(listResult, currentSpin) {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.Init();
        this.node.active = true;
        this.SetValueResult (listResult);
        this.textNumberSpin.string = currentSpin.toString ();
        this.currentSpin = currentSpin;
    },

    ClickSpin() {
        if(this.isPlay)
            return;
        this.SendSpin();
    },

    ClickVanMay() {
        let msgData = {};
        require("SendRequest").getIns().MST_Client_Play_Daily_Telco_Reward_Spin(msgData);
        // this.UpdateResultBonus(5,50);
    },

    ClickNapTien() {

    },

    UpdateResultBonus(index, reward) {
        this.isPlay = true;
        Global.isPlayBonus = 1;
        Global.LobbyView.CheckBonus();
        Global.bonusRate = reward;
        this.animLightBonos.play("LightBozui");
        let numb = 14 + 8 + 8 - index + 1;
        this.btnVanMay.interactable =  false;
        let countStep = 0;
        let isAdd = true;
        let timeDelay = 0.1;
        let totalTimeDelay = 0;
        for(let i = 0; i < numb; i++) {
            if(i > numb-5)
                timeDelay = 0.3;
            totalTimeDelay += timeDelay;
            this.scheduleOnce(()=>{
                for(let j = 0; j < this.progress.length; j++) {
                    this.progress[j].active = false;
                }
                for(let j = 0; j < countStep; j++) {
                    this.progress[j].active = true;
                }
                if(isAdd) {
                    countStep += 1;
                    if(countStep > 8) {
                        isAdd = false;
                        countStep = 7;
                    }
                } else {
                    countStep -= 1;
                    if(countStep < 1) {
                        isAdd = true;
                        countStep = 2;
                    }
                }
            } , totalTimeDelay);
        }
        this.scheduleOnce(()=>{
            this.animLightBonos.play("WinBozui");
        } , totalTimeDelay)
        this.scheduleOnce(()=>{
            this.isPlay = false;
            this.animLightBonos.play("EndBozui");
            this.btnVanMay.node.active = false;
            Global.UIManager.showCommandPopup(Global.Helper.formatString(Global.MyLocalization.GetText("WIN_BONUS"),[reward]));
        } , totalTimeDelay + 1)
    },

    UpdatecurrentSpin(currentSpin) {
        this.textNumberSpin.string = currentSpin.toString ();
        this.currentSpin = currentSpin;
    },

    PlaySpin(indexReward, currentSpin, action) {
        this.indexReward = indexReward;
        this.SetCellWin (indexReward);
        this.textNumberSpin.string = currentSpin.toString ();
        this.currentSpin = currentSpin;
        if (this.eventAfter != null)
            this.eventAfter = null;
        this.eventAfter = action;
        this.isPlay = true;
        this.indexRotation = 5;
        this.anim.play ("StartAnim");
        this.animLightSpin.play("LightSpin");
    },

    ChangeRotation() {
        this.anim.play("RotationAnim");
    },

    CheckRotation() {
        this.indexRotation--;
        if (this.indexRotation <= 0) {
            this.PlayEndRotation ();
        }
    },

    PlayEndRotation() {
        this.anim.play ("EndAnim");
    },

    PlayEffect() {
        this.animLightSpin.play("WinSpin");
        this.isPlay = false;
        if (this.listReward[this.indexReward].Amount == 0) {
            if (this.eventAfter != null) {
                this.eventAfter();
                this.eventAfter = null;
            }
            return;
        }
        if (this.listReward [this.indexReward].RewardType == Global.Enum.REWARD_TYPE.INGAME_BALANCE) {
            this.textValueWin.string = Global.Helper.formatNumber (this.listReward[this.indexReward].Amount);
            this.anim.play ("EffectAnim");
        } else if (this.listReward [this.indexReward].RewardType == Global.Enum.REWARD_TYPE.PIECE_CARD) {
            this.textReward.string = Global.MyLocalization.GetText ("REWARD_PIECE");
            this.iconItem.ItemRewardView_SetSpinImage(this.listReward [this.indexReward].RewardType, 0);
            this.anim.play ("EffectItem");
        } else if (listReward [indexReward].RewardType == Global.Enum.REWARD_TYPE.CARD) {
            this.iconItem.ItemRewardView_SetSpinImage(this.listReward [this.indexReward].RewardType, 0);
            this.textReward.string = Global.Helper.formatString(Global.MyLocalization.GetText ("REWARD_CARD"), [parseInt(listReward[indexReward].Amount/1000).toString()]);
            this.anim.play ("EffectItem");
        }
    },

    EndEffect() {
        this.isPlay = false;
        if (this.eventAfter != null) {
            this.eventAfter();
            this.eventAfter = null;
        }
    },

    Reset() {
        this.isPlay = false;
        if (this.eventAfter != null) {
            this.eventAfter();
            this.eventAfter = null;
        }
        this.effectObj.active = false;
    },

    SetValueResult(listResult) {
        for (let i = 0; i < listResult.length; i++) {
            if(i >= this.NUMBER_CELL)
                break;
            if (listResult [i].RewardType == Global.Enum.REWARD_TYPE.INGAME_BALANCE) {
                if(listResult [i].Amount > 100000) {
                    this.listIcon [i].spriteFrame = this.imgIphone;
                } else {
                    this.listIcon [i].spriteFrame = this.imgXu;
                }
                if(listResult [i].Amount > 1000)
                    this.listDesription[i].string = parseInt(listResult [i].Amount/1000) +"K";
                else
                    this.listDesription[i].string = Global.Helper.formatNumber( listResult [i].Amount);
            } else if (listResult [i].RewardType == Global.Enum.REWARD_TYPE.PIECE_CARD) {
                this.listIcon [i].spriteFrame = this.imgPiece;
                this.listDesription[i].string = Global.MyLocalization.GetText ("SPIN_PIECE");
            } else if (listResult [i].RewardType == Global.Enum.REWARD_TYPE.CARD) {
                this.listIcon [i].spriteFrame = this.imgCard
                this.listDesription[i].string = Global.Helper.formatString(Global.MyLocalization.GetText ("SPIN_CARD"),[parseInt(listResult[i].Amount/1000).toString()]);
            } else if (listResult [i].RewardType == Global.Enum.REWARD_TYPE.NONE) {
                this.listIcon [i].spriteFrame = this.imgIphone;
                this.listDesription[i].string = Global.MyLocalization.GetText ("SPIN_ITEM_OUT_GAME");
            }
        }
        this.listReward = listResult;
    },

    SetCellWin(indexReward) {
        let angleText = Global.RandomNumber(1, 10);
        this.angle = (360/this.NUMBER_CELL)*indexReward;
        this.duration = 0;
        this.fakeAngle = true;
        this.cacheZ = this.imgCircle.node.angle;
    },

    SendSpin() {
        if (this.currentSpin == 0) {
            Global.UIManager.showCommandPopup (Global.MyLocalization.GetText("NOT_ENOUGHT_TO_SPIN"), null);
            return;
        }
        require("SendRequest").getIns().MST_Play_Daily_Bonus();
    },

    Hide() {
        if(this.isPlay)
            return;
        this.Reset();
        this.node.active = false;
        Global.UIManager.hideMark();
      
    },

    update(dt) {
        if (this.fakeAngle) {
            this.duration += dt/ this.TIME_FAKE;
            if (this.duration >= 1) {
                this.fakeAngle = false;
                this.imgCircle.node.angle = this.angle;
            }
            // this.imgCircle.node.angle = (this.angle - this.cacheZ) * this.duration;
        }
    },

    onDestroy(){
		Global.LuckySpinPopup = null;
	},
});
