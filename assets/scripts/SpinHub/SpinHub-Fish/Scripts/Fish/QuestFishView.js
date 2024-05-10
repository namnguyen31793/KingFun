
cc.Class({
    extends: cc.Component,
    ctor() {
        this.currentMissionId = 0;
        this.rewardId = 0;
        this.successAll = false;
    },

    properties: {
        contentBigObj : cc.Node,
        contentMiniObj : cc.Node,
        lbProgress : cc.Label,
        lbDescription : cc.Label,
        lbReward : cc.Label,
        iconQuest1 : cc.Sprite,
        iconQuest2 : cc.Sprite,
        normalObj : [cc.Node],
        successObj : [cc.Node],
        // listImgFish : [cc.SpriteFrame],
        imgRandomFish : cc.SpriteFrame,
        imgBigFish : cc.SpriteFrame,
    },

    UpdateMission(userInfo, missionInfo) {
        this.node.active = true;
        
        this.currentMissionId = missionInfo.MissionId;
        this.lbReward.string = Global.Helper.formatNumber(missionInfo.RewardMoney);
        this.ChangeStatusObj(false);
        if(missionInfo.TotalFishDeath > 0) {
            this.iconQuest1.spriteFrame = this.imgRandomFish;
            this.iconQuest2.spriteFrame = this.imgRandomFish;
            this.lbProgress.string = userInfo.TotalFishDeath+"/"+missionInfo.TotalFishDeath;
            if(userInfo.TotalFishDeath == missionInfo.TotalFishDeath) {
                this.RequestGetReward();
            }
            this.lbDescription.string = Global.Helper.formatString(Global.MyLocalization.GetText("MISSION_KILL_FISH"), [missionInfo.TotalFishDeath.toString()]);
        } else if(missionInfo.TotalKillBigFish > 0) {
            // BigFishType
            Global.Helper.GetFishIcon(missionInfo.BigFishType, this.iconQuest1);
            Global.Helper.GetFishIcon(missionInfo.BigFishType, this.iconQuest2);
            // this.iconQuest1.spriteFrame = this.imgRandomFish;
            // this.iconQuest2.spriteFrame = this.imgRandomFish;
            this.lbProgress.string = userInfo.TotalKillBigFish+"/"+missionInfo.TotalKillBigFish;
            if(userInfo.TotalKillBigFish == missionInfo.TotalKillBigFish) {
                this.RequestGetReward();
            }
            let fishName = this.GetNameFish(missionInfo.BigFishType);
            this.lbDescription.string = Global.Helper.formatString(Global.MyLocalization.GetText("MISSION_KILL_BIG_FISH"), [missionInfo.TotalKillBigFish.toString(), fishName]);
           
        } else if(missionInfo.TotalKillElectricFish > 0) {
            this.iconQuest1.spriteFrame = this.imgRandomFish;
            this.iconQuest2.spriteFrame = this.imgRandomFish;
            this.lbProgress.string = userInfo.TotalKillElectricFish+"/"+missionInfo.TotalKillElectricFish;
            if(userInfo.TotalKillElectricFish == missionInfo.TotalKillElectricFish) {
                this.RequestGetReward();
            }
            this.lbDescription.string = Global.Helper.formatString(Global.MyLocalization.GetText("MISSION_KILL_ELECTRIC_FISH"), [missionInfo.TotalKillElectricFish.toString()]);
        } else if(missionInfo.TotalKillJackpot > 0) {
            this.iconQuest1.spriteFrame = this.imgRandomFish;
            this.iconQuest2.spriteFrame = this.imgRandomFish;
            this.lbProgress.string = userInfo.TotalKillJackpot+"/"+missionInfo.TotalKillJackpot;
            if(userInfo.TotalKillJackpot == missionInfo.TotalKillJackpot) {
                this.RequestGetReward();
            }
            this.lbDescription.string = Global.Helper.formatString(Global.MyLocalization.GetText("MISSION_KILL_JACKPOT_FISH"), [missionInfo.TotalKillJackpot.toString()]);
        }
    },

    GetNameFish(type) {
        switch(type){
            case 1:
                return "Cá Xanh";
            case 2:
                return "Nòng Nọc";
            case 3:
                return "Cá Tím";
            case 4:
                return "Nemo";
            case 5:
                return "Cá Nóc";
            case 6:
                return "Mực";
            case 7:
                return "Cá Lồng Đèn";
            case 8:
                return "Rùa Con";
            case 9:
                return "Sứa Sư Tử";
            case 10:
                return "Sam Tím";
            case 11:
                return "Đuối Điện";
            case 12:
                return "Mỏ Vịt";
            case 13:
                return "Cá Nóc Hồng";
            case 14:
                return "Cá Ngựa Vằn";
            case 15:
                return "Cá Mập Xanh";
            case 16:
                return "Mập Đầu Búa";
            case 50:
                return "Cá Điện";
            case 51:
                return "Cua Bom";
            case 52:
                return "Cua Súng";
            case 53:
                return "Cua Súng";
            case 101:
                return "Cua Vòng Quay";
            case 102:
                return "Trùm Cuối";
            case 103:
                return "Cá Hề";
            case 104:
                return "Thần Tài";
            case 105:
                return "Lam Kỳ Lân";
            case 106:
                return "Hồng Kỳ Lân";
            case 107:
                return "Lục Kỳ Lân";
            case 108:
                return "";
            default:
                return "Hoàng Kỳ Lân";
        }
    },

    RequestGetReward() {
        require("SendRequest").getIns().MST_Client_Get_Fish_Reward_Mission_Info ();
    },

    MissionSuccess(info) {
        for(let i = 0; i < info.length; i++) {
            if(this.currentMissionId == info[i].MissionId) {
                this.rewardId = info[i].Id;
                this.ChangeStatusObj(true);
                if(info[i].IsReaded == 1) {
                    this.node.active = false;
                    this.successAll = true;
                }
                break;
            }
        }
    },

    ChangeStatusObj(isSuccess) {
        for(let i = 0; i < this.normalObj.length; i++) {
            this.normalObj[i].active = !isSuccess;
        }
        for(let i = 0; i < this.successObj.length; i++) {
            this.successObj[i].active = isSuccess;
        }
    },

    ClickShowFullQuest() {
        this.contentBigObj.active = true;
        this.contentMiniObj.active = false;
    },

    ClickShowMiniQuest() {
        this.contentBigObj.active = false;
        this.contentMiniObj.active = true;
    },

    ClickTakeMission() {
        let msgData = {};
        msgData [1] = this.rewardId;
        require("SendRequest").getIns().MST_Client_Get_Fish_Mission_Take_Reward (msgData);
        require("SendRequest").getIns().MST_Client_Get_Fish_Mission_Take_Reward (msgData);
        require("SendRequest").getIns().MST_Client_Get_Fish_Mission_Take_Reward (msgData);
        require("SendRequest").getIns().MST_Client_Get_Fish_Mission_Take_Reward (msgData);
        this.node.active = false;
    },

    
});
