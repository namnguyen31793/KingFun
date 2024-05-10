var FISH_TYPE_1 = 4;
var FISH_TYPE_2 = 8;
var FISH_TYPE_3 = 12;
var FISH_TYPE_4 = 16;

import List from "List";

cc.Class({
    extends: cc.Component,
    ctor() {
        this.dataCreateFish = null;
        this.timeExist = 0;
        this.listBoss = null;
        this.currentBoss = 0;
        this.indexId = 1;
        this.mainDirection = 0;
        this.countDirection = 0;
        this.typeColor1 = [2,4,6];
        this.typeColor2 = [3,7,13];
        this.typeColor3 = [5,8,12,14];
        this.typeColor4 = [9,10,11,15,16];
        this.typeColor5 = [1];
        this.countColor = [0,0,0,0,0];
        this.preBoss = 0;
        this.cacheIndex = 0;
        this.minTypeFish = [];
        this.maxTypeFish = []
        this.listBossDefault = [];
        this.timeMinExistBoss = 0;
        this.timeMaxExistBoss = 0;
        this.timeMinExistNormal = 0;
        this.timeMaxExistNormal = 0;
        this.timeWaitCreateBoss = 0;

        this.lastTime = 0;
        this.bossConfig;
    },

    properties: {
        
    },

    Init() {
        let roomConfig = require ("PathStore").getIns().getRoomFishNormalConfig(require("ScreenManager").getIns().roomType.toString());
        this.minTypeFish = roomConfig.numberMinFishType;
        this.maxTypeFish = roomConfig.numberMaxFishType;
        this.listBossDefault = roomConfig.bossRoom;
        this.timeMinExistBoss = roomConfig.timeMinExistBoss;
        this.timeMaxExistBoss = roomConfig.timeMaxExistBoss;
        this.timeMinExistNormal = roomConfig.timeMinExistNormal;
        this.timeMaxExistNormal = roomConfig.timeMaxExistNormal;
       
        this.dataCreateFish = {
            countTime : Global.RandomNumber(0,120),
            state : 1,
        }
        this.timeExist = Global.RandomNumber(this.timeMinExistNormal, this.timeMaxExistNormal);
        // console.log("init:"+this.timeExist);
        this.listBoss = new List();
        this.CreateNewListBoss();
        this.CalculatorPreBoss();

        //create event fish
        let eventConfig = require ("PathStore").getIns().getEventConfig(require("ScreenManager").getIns().roomType.toString());
        this.CreateEventFish(eventConfig.startTime[0], eventConfig.startTime[1], eventConfig);
        
      
          //create boss fish
            this.bossConfig = require ("PathStore").getIns().getBossConfig(require("ScreenManager").getIns().roomType.toString());
          this.CreateBossFish(this.bossConfig.startTime[0], this.bossConfig.startTime[1], this.bossConfig);

          this.isCreateBoss = false;



    },

    CreateEventFish(minTime, maxTime, eventConfig) {
        if(eventConfig.active && eventConfig.active == "1") {
            let timeWait = Global.RandomNumber(minTime, maxTime);
            this.scheduleOnce(()=>{
                // let pathId = this.CreateRandomPathIdBigFish();
                // this.CreateFishByType(116, 0, -1, 0, 1000, pathId);
                let percentCheck = Global.RandomNumber(0, 100);
                let count = 0;
                for(let i = 0; i < eventConfig.percentCreate.length; i++) {
                    count += eventConfig.percentCreate[i];
                    if(percentCheck <= count) {
                        let pathId = this.CreateRandomPathIdBigFish();
                        this.CreateFishByType(eventConfig.typeFish[i], 0, -1, 0, 1000, pathId);
                        break;
                    }
                }
            } , timeWait); 
        }
    },

    CreateBossFish(minTime, maxTime, bossConfig)
    {     
        let timeWait = Global.RandomNumber(minTime, maxTime);
         this.scheduleOnce(()=>{
            cc.log(">>> CREATE BOSS FISH");
            let percentCheck = Global.RandomNumber(0, 100);
       
            let count = 0;
            for(let i = 0; i < this.bossConfig.percentCreate.length; i++) {
                count += this.bossConfig.percentCreate[i];
              
                 if(percentCheck <= count) {
                    if(i < this.bossConfig.percentCreate.length-1 && this.bossConfig.percentCreate.length >= 3) {

                        if(require("FishCollection").getIns().CheckFishExistsByType(this.bossConfig.typeFish[i]))
                        {
                        
                            continue;
                        }

                        let pathId = this.CreateRandomPathIdBigFish();
                        
                        this.CreateFishByType(this.bossConfig.typeFish[i], 0, -1, 0, 1000, pathId);
                      
                        //this.CreateFishByType(109, 0, -1, 0, 1000, pathId);
                    }                     
                    else {
                        //tao nhieu boss
                        let pathId = this.CreateRandomPathIdBigFish();
                        let fishTypeIndex = Global.RandomNumber(0,this.bossConfig.typeFish.length);
                        this.CreateFishByType(this.bossConfig.typeFish[fishTypeIndex], 0, -1, 0, 1000, pathId);
                        /*
                        pathId = this.CreateRandomPathIdBigFish();
                        this.CreateFishByType(bossConfig.typeFish[1], 0, -1, 0, 1000, pathId);
                        */
                    }
                    
                    break;
                }
            }
        } , timeWait); 
    },

    CreateRandomPathIdBigFish() {
        let listPath = require ("PathStore").getIns().getPathEvent().path;
        let pathId = listPath[Global.RandomNumber(0, listPath.length)];
        return pathId;
    },

    CreateNewListBoss() {
        this.listBoss.Clear();
        let boss = this.listBossDefault;
        this.listBoss.Clone(boss);
    },

    RemoveFishByType(fishType) {
        Global.ServerBot.RemoveFishByType(fishType);  
        Global.GameLogic.ClearSpecialFish(fishType);
    },


    CreateNormalFish(isInit) {
       
        
        if(Global.InGameManager == null || Global.InGameManager.inBackGround)
         return;
         
        
         
        if(this.isCreateBoss == false)
        {      
         this.CreateFishByType(101);  
         this.isCreateBoss = true;  
        // return;     
        }
        
        
    
        

        Global.ServerBot.isCreateSpecialFish = false;
        Global.ServerBot.isCreateMiniBoss = false;
        this.CalculatorPreBoss();
        if(this.preBoss == Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE) {
            Global.InGameView.ChangeBackground(false, 3);
        } else {
            Global.InGameView.ChangeBackground(false);
        }
        // chỉnh hướng 
        this.mainDirection = Global.RandomNumber(0,12);
        let r = Global.RandomNumber(7,12);
        let delayTime = 0;
        let pos1 = Global.RandomNumber(0, 12);
        let pos2 = Global.RandomNumber(0, 12);
        let pos3 = Global.RandomNumber(0, 12);
        this.CreateGroupFishType4(pos1, 2000);
        this.CreateGroupFishType1(pos2, 1000);
        this.CreateGroupFishType1(pos3, 500);
        for(let i = 0; i < r; i++) {
            delayTime += Global.RandomNumber(0, 2000);
            this.CreateTurn(delayTime);  
        }
       
        this.schedule(this.createSche = () => {
            this.countDirection += 1;
            if(this.countDirection >= 10) {
                this.countDirection = 0;
                this.mainDirection = Global.RandomNumber(0,12);
            }
            
            // console.log("------------check special fish:"+Global.ServerBot.isCreateSpecialFish+"    "+require("ScreenManager").getIns().roomType);
            if(require("ScreenManager").getIns().roomType == 1) {
                if(!Global.ServerBot.isCreateSpecialFish) {
                    this.MethodCreateSpecialFish();
                }
                if(!Global.ServerBot.isCreateMiniBoss) {
                    this.MethodCreateMiniBoss();
                }
            } else if(require("ScreenManager").getIns().roomType == 2){
                while(!Global.ServerBot.isCreateSpecialFish) {
                    this.MethodCreateSpecialFish();
                }
                if(!Global.ServerBot.isCreateMiniBoss) {
                    this.MethodCreateMiniBoss();
                }
            }
            
            this.CreateTurn(0);
        }, 1);
    },

    MethodCreateSpecialFish() {
        let roomConfig = require ("PathStore").getIns().getRoomFishSpecialConfig(require("ScreenManager").getIns().roomType.toString());
        if(!this.CheckCreateJackpot(roomConfig)) {
            if(!this.CheckCreateSpecialFish(roomConfig)) {
                this.CheckCreateGunFish(roomConfig);
            }
        }
    },

    MethodCreateMiniBoss() {
        if(Global.InGameManager == null || Global.InGameManager.inBackGround)
            return;
        let roomConfig = require ("PathStore").getIns().getRoomFishSpecialConfig(require("ScreenManager").getIns().roomType.toString());
        if(roomConfig.percentCreateMiniBoss != 0) {
            let randomCreateFish = Global.RandomNumber(0,100);
            if(randomCreateFish < 50)
                return;
            let randomCreateTime =  Global.RandomNumber(60,180);
            if(this.timeExist - this.dataCreateFish.countTime >= randomCreateTime && this.timeWaitCreateBoss == 0) {             
                let check = Global.RandomNumber(0,100);
                if(check < roomConfig.percentCreateMiniBoss) {
                    let miniBoss = roomConfig.typeMiniBoss[Global.RandomNumber(0, roomConfig.typeMiniBoss.length)];
                    let pos = Global.RandomNumber(0, 12);
                    let listPath = require ("PathStore").getIns().getBigFishConfig((pos+1).toString()).path;
                    let pathId = listPath[Global.RandomNumber(0, listPath.length)];
                    this.CreateFishByType(miniBoss, 8, -1, 0, 1000, pathId);
                    Global.InGameManager.creatEffectStartMiniBoss(miniBoss);
                }
            }
        }
    },

    CheckCreateJackpot(roomConfig) {
        if(roomConfig.percentCreateJackpot == 0)
            return false;
        let check = Global.RandomNumber(0,100);
        if(check < roomConfig.percentCreateJackpot) {
            let t = Global.RandomNumber(0,100);
            for(let i = 0; i < roomConfig.typeJackpot.length; i++) {
                if(t < roomConfig.percentTypeJackpot[i]) {
                    if(require("FishCollection").getIns().CheckFishExistsByType(roomConfig.typeJackpot[i]))
                     return;
                    this.CreateFishByType(roomConfig.typeJackpot[i]);
                    return true;
                }
            }
        }
        return false;
    },

    CheckCreateSpecialFish(roomConfig) {
        if(roomConfig.percentCreateSpecial == 0)
            return false;

        let check = Global.RandomNumber(0,100);
        if(check < roomConfig.percentCreateSpecial) {
            let t = Global.RandomNumber(0,100);
            for(let i = 0; i < roomConfig.typeSpecial.length; i++) {
                if(t < roomConfig.percentTypeSpecial[i]) {
                    this.CreateFishByType(roomConfig.typeSpecial[i]);
                    return true;
                }
            }
        }
        return false;
    },

    CheckCreateGunFish(roomConfig) {
        if(roomConfig.percentCreateGunFish == 0)
            return false;
        let check = Global.RandomNumber(0,100);
        if(check < roomConfig.percentCreateGunFish) {
            let t = Global.RandomNumber(0,100);
            for(let i = 0; i < roomConfig.typeGunFish.length; i++) {
                if(t < roomConfig.percentTypeGunFish[i]) {
                    this.CreateFishByType(roomConfig.typeGunFish[i]);
                    return true;
                }
            }
        }
        return false;
    },

    CreateTeamFish(indexTeam) {
        let pathConfig = require ("PathStore").getIns().pathConfig;
        let infoTeam = pathConfig.team[indexTeam];
        this.timeExist = infoTeam.duration/1000;
        let listFishProperties = [];
        let d = new Date();
        for(let i = 0; i < infoTeam.array.length; i++) {
            let speed = 0;
            for(let s = 0; s < require ("PathStore").getIns().pathConfig.path[infoTeam.array[i]].duration.length; s++) {
                speed += require ("PathStore").getIns().pathConfig.path[infoTeam.array[i]].duration[s];
            }
            let f = {
                FishType : require ("PathStore").getIns().pathConfig.path[infoTeam.array[i]].type,
                PathId : infoTeam.array[i],
                FishId : this.indexId++,
                FishSpeed : speed,
                Radius : 0,
                totalSkipTimeMinisecond : 0,
                StartTimeSkipDate: "0001-01-01T00:00:00",
                UnTimeSkipDate: "0001-01-01T00:00:00",
                TimeSkip: 0,
                NumberOfGroup : -1,
                startTimeCreated : d.getTime() + parseInt(require ("PathStore").getIns().pathConfig.path[infoTeam.array[i]].delayTime),
                CreateTime : require("SyncTimeControl").getIns().convertTimeToString(d.getTime() + parseInt(require ("PathStore").getIns().pathConfig.path[infoTeam.array[i]].delayTime)),
            };
            listFishProperties[listFishProperties.length] = f;
            if(Global.isOffline)
                Global.ServerOffline.listFishInGame[f.FishId.toString()] = f;
        }
        Global.GameLogic.CreateFish(listFishProperties);
    },

    CreateBoss() {
      
        cc.log(">>>>>  CREATE BOSS");
        this.unschedule(this.createSche);
        this.currentBoss = this.preBoss;
        if(this.currentBoss == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_0) {
        
            this.timeExist = 25;
        }
        if(this.currentBoss == Global.Enum.FISH_TYPE_CONFIG.JACKPOT_TYPE && Global.GameLogic.mainActor.actorPropertis.CurrentGunId < 3) {
            this.listBoss.RemoveAt(this.cacheIndex);
            if(this.listBoss.GetCount() == 0)
                this.CreateNewListBoss();
            this.CreateBoss();
        } else {
          
            this.CreateBossFish(this.bossConfig.startTime[0], this.bossConfig.startTime[1], this.bossConfig);

        }
    },

    CalculatorPreBoss() {
        
        this.cacheIndex = Global.RandomNumber(0, this.listBoss.GetCount());
        this.preBoss = this.listBoss.Get(this.cacheIndex);
        
       

    },

    RemoveBoss() {
        this.RemoveFishByType(this.currentBoss);
       
    },

    EndBoss() {
        if(this.dataCreateFish.state == 1)
            return;
        this.dataCreateFish.state = 1;
        this.timeExist = Global.RandomNumber(this.timeMinExistNormal, this.timeMaxExistNormal);          
            Global.ServerBot.SendCreateFish(false);
       
    },

    CreateTurn(delayTime) {
        let check = 0;
        while(check < 10) {
            check++;
            let pos = this.mainDirection;
            let cHole = Global.RandomNumber(0,100);
            if(cHole < 20) {

            } else if(cHole < 40) {
                pos = pos + 6;
                if(pos > 11) {
                    pos = pos - 12;
                }
            } else if(cHole < 60) {
                pos = pos + 1;
                if(pos >= 12)
                    pos = 0;
            } else if(cHole < 80) {
                pos = pos - 1;
                if(pos <= -1)
                    pos = 11;
            } else {
                pos = Global.RandomNumber(0, 12);
            }
            let r = Global.RandomNumber(0, 100);
            //create small fish
            if(r < 30) {
                if(this.CreateGroupFishType1(pos, delayTime))
                    check = 10;
            } else if(r < 50) {
                //create medium and small fish
                if(this.CreateGroupFishType2(pos, delayTime))
                    check = 10;
                if(this.CreateGroupFishType1(pos, delayTime))
                    check = 10;
            } else if(r < 70) {
                //create medium fish
                if(this.CreateGroupFishType2(pos, delayTime))
                    check = 10;
            } else if(r < 85) {
                //create large fish
                if(this.CreateGroupFishType3(pos, delayTime))
                    check = 10;
            } else {
                //create big fish
                if(this.CreateGroupFishType4(pos, delayTime))
                    check = 10;
            }
        }
    },

    CreateGroupFishType1(pos, delayTime) {
        let r = Global.RandomNumber(0,100);
        if(r < 6 && Global.ServerBot.infoListFish.numberFishType1 < this.maxTypeFish[0]) {
            this.CreateDefaultGroup(pos);
            return true;
        } else {
            let type = 1;
            let check = this.CountNumberTypeFish(1, FISH_TYPE_1);
            if(check  == -1) {
                let c = this.PickColor(1);
                if(c == -1)
                    type = Global.RandomNumber(1, FISH_TYPE_1+1);
                else type = c;
            } else {
                type = check;
            }
            let count = Global.RandomNumber(3,6);
            if(Global.ServerBot.infoListFish.numberFishType1 < this.maxTypeFish[0]) {
                this.CreateGroupFishNormal(type, count, 0, pos, 0, 1, 500, true);
                return true;
            }
        }
        
        return false;
    },

    CreateGroupFishType2(pos, delayTime) {
        let r = Global.RandomNumber(0,100);
        if(r < 9 && Global.ServerBot.infoListFish.numberFishType2 < this.maxTypeFish[1]) {
            this.CreateDefaultGroup(pos+12);
            return true;
        } else {
            let type = Global.RandomNumber(FISH_TYPE_1+1, FISH_TYPE_2+1);
            let c = this.PickColor(2);
            if(c != -1)
                type = c;
            let count = Global.RandomNumber(1,3);
            if(Global.ServerBot.infoListFish.numberFishType2 < this.maxTypeFish[1]) {
                this.CreateGroupFishNormal(type, count, delayTime, pos, 0, 1, 700, true);
                return true;
            }
        }
        
        return false;
    },

    CreateGroupFishType3(pos, delayTime) {
        let type = Global.RandomNumber(FISH_TYPE_2+1, FISH_TYPE_3+1);
        let c = this.PickColor(3);
            if(c != -1)
                type = c;
        let count = Global.RandomNumber(1,3);
        if(Global.ServerBot.infoListFish.numberFishType3 < this.maxTypeFish[2]) {
            this.CreateGroupFishNormal(type, count, delayTime, pos, 1000, 1500, 1500);
            return true;
        }
        return false;
    },

    CreateGroupFishType4(pos, delayTime) {
        pos = Global.RandomNumber(0,12);
        let type = Global.RandomNumber(FISH_TYPE_3+1, FISH_TYPE_4+1);
        let c = this.PickColor(4);
            if(c != -1)
                type = c;
        if(Global.ServerBot.infoListFish.numberFishType4 < this.maxTypeFish[3]) {
            this.CreateGroupFishNormal(type, 1, delayTime, pos, 0, 0, 0);
            return true;
        }
        return false;
    },

    CreateGroupFishNormal(type, number, delayTime, pos, rangeMin, rangeMax, disTanceRange, isGroup = false) {
        let dTime = 0;
        Global.ServerBot.infoListFish.listCountFish[pos] += number;
        let pathId = -1;
        if(isGroup) {
            pathId = this.GetPathIdByGroup(pos);
        }
        for(let i = 0; i < number; i++) {
            dTime += Global.RandomNumber(rangeMin, rangeMax) + disTanceRange;
            let index = -1;
            if(isGroup) {
                index = i;
                delayTime = 0;
                dTime = 0;
                rangeMin = 0;
                rangeMax = 1;
            }
            if(type > 12 && type <= 16) {
                let listPath = require ("PathStore").getIns().getBigFishConfig((pos+1).toString()).path;
                pathId = listPath[Global.RandomNumber(0, listPath.length)];
            }
                
            this.CreateFishByType(type, delayTime + dTime, pos, rangeMin, rangeMax, pathId, -1, index);
        }
    },

    CreateDefaultGroup(pos) {
        let configGroup = require ("PathStore").getIns().getConfigGroupById((pos+1).toString());
        let groupId = Global.RandomNumber(configGroup.min, configGroup.max);
        let groupInfo = require ("PathStore").getIns().getGroupById(groupId.toString());
        let number = groupInfo.team.length;
        Global.ServerBot.infoListFish.listCountFish[pos] += number;
        for(let i = 0; i < number; i++) {
            this.CreateFishByType(groupInfo.team[i], groupInfo.delayTime[i], pos, 0, 1, groupInfo.path[i], parseInt(groupInfo.time), -1, groupInfo.radius[i]);
        }
    },

    CreateFishByType(fishType, delayTime = 0, indexGroup = -1, minTime = 0, maxTime = 1000, pathId = -1, speed = -1, isGroup = -1) {   
        try {
             if(fishType > 0 && fishType < 200) {

             } else {
                return;
             }
        } catch {
            return;
        }
        let listFish = [];
        if(fishType <= FISH_TYPE_1) {
            Global.ServerBot.infoListFish.numberFishType1 += 1;
        } else if(fishType <= FISH_TYPE_2) {
            Global.ServerBot.infoListFish.numberFishType2 += 1;
        } else if(fishType <= FISH_TYPE_3) {
            Global.ServerBot.infoListFish.numberFishType3 += 1;
        } else if(fishType <= FISH_TYPE_4) {
            Global.ServerBot.infoListFish.numberFishType4 += 1;
        }
        if(fishType <= 16) {
            Global.ServerBot.infoListFish.numberTypeFish[fishType-1] += 1;
            this.AddToColor(fishType);
        }
        if(pathId == -1) {
            if(fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINI_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINOR_JACKPOT ||
                fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MAJOR_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GRAND_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GRAND_JACKPOT) {
                let listPath = require ("PathStore").getIns().getJackpotConfig();
                pathId = listPath[Global.RandomNumber(0,listPath.length)];
            } else {
                if(indexGroup == -1)
                    indexGroup = Global.RandomNumber(0,5);
                pathId = this.GetPathIdByGroup(indexGroup);
            }
            
        }
        let fishProperties = this.CreateFishPropertis(fishType, pathId, delayTime, minTime, maxTime, speed, isGroup);
        listFish[0] = fishProperties;
        this.countFish += 1;
        Global.ServerBot.listFishInGame[fishProperties.FishId.toString()] = fishProperties;
        if(Global.isOffline)
            Global.ServerOffline.listFishInGame[fishProperties.FishId.toString()] = fishProperties;
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE) {
           
            for(let i = 0; i < 5; i++) {
                let fishProperties = this.CreateFishPropertis(fishType, 1, delayTime, 0 , 1);
                Global.ServerBot.listFishInGame[fishProperties.FishId.toString()] = fishProperties;
            }
        }
        if(Global.GameLogic != null)
            Global.GameLogic.CreateFish(listFish);
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.ELECTRIC_FISH_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.FISH_BOOM_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE ||
            fishType == Global.Enum.FISH_TYPE_CONFIG.LAZE_FISH_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.WHEEL_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE || 
            fishType == Global.Enum.FISH_TYPE_CONFIG.LUCKY_BOX_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINI_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINOR_JACKPOT ||
            fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MAJOR_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GRAND_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MULTI_DRILL) {
                Global.ServerBot.isCreateSpecialFish = true;
        }
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_1 || fishType == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_2 || fishType == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_3) {
            Global.ServerBot.isCreateMiniBoss = true;
        }
    },

    CreateFishPropertis(type, path, delay, minTime, maxTime, speed = -1, numberOfGroup = -1, radius = 0) {
        let now = new Date().getTime();
        let cTime = now + Global.RandomNumber(minTime,maxTime) + delay;
        if(Global.ServerBot.isStartServer) {
            cTime -= Global.RandomNumber(4000,7000);
        }
        if(radius == 0) {
            radius = Global.RandomNumber(-30,30);
        }

        if(type < 2)
        {
            radius = 0;
        }

        if(speed == -1)
            speed = this.GetSpeedByType(type);
        let fishProperties = {
            FishId : this.indexId++,
            FishSpeed : speed,
            FishType : type,
            ItemType : 0,
            PathId : path,
            Radius : radius,
            RewardMulti : 0,
            RewardType : 0,
            NumberOfGroup : numberOfGroup,
            StartTimeSkipDate : "0001-01-01T00:00:00",
            TimeSkip : 0,
            UnTimeSkipDate: "0001-01-01T00:00:00",
            CreateTime : Global.ServerBot.timeControl.convertTimeToString(cTime),
            totalSkipTimeMinisecond : 0,
            startTimeCreated : cTime,
            fishBonusDescription: "",
        };
        return fishProperties;
    },

    Inc_FishId()
    {
        return ++this.indexId;
    },

    GetSpeedByType(fishType) {
        if(fishType <= 4)
            return Global.RandomNumber(70,100)/10;
        if(fishType <= 8) 
            return Global.RandomNumber(80,120)/10;
        if(fishType <= 12) 
            return Global.RandomNumber(120,160)/10;
        if(fishType <= 20)
            return Global.RandomNumber(14,18);
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.ELECTRIC_FISH_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.FISH_BOOM_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.LAZE_FISH_TYPE)
            return Global.RandomNumber(20,30);
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.JACKPOT_TYPE)
            return Global.RandomNumber(20,30);
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.WHEEL_TYPE)
            return Global.RandomNumber(20,30);
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE)
            return Global.RandomNumber(20,30);
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.LUCKY_BOX_TYPE)
            return Global.RandomNumber(20,30);
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINI_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINOR_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MAJOR_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GRAND_JACKPOT)
            return Global.RandomNumber(20,30);
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_0)
            return 18;
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_PHOENIX)
            return Global.RandomNumber(14,18);
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_EVENT_SMALL_USER || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_EVENT_BIG_USER || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MONSTER_WINTER 
             || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GOD_OF_WEALTH
             || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_FROG_1M)
            return Global.RandomNumber(20,30);
        return Global.RandomNumber(20,30);
    },

    GetDelayTime(fishType) {
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE) {
            return 2000;
        } else {
            return 0;
        }
    },

    GetPathIdByGroup(group) {
        let pathId = group * 50 + Global.RandomNumber(1, 11);;
        return pathId;
    },

    ReCreateFish(fishType) {
        if(fishType <= FISH_TYPE_1) {
            Global.ServerBot.infoListFish.numberFishType1 -= 1;
        } else if(fishType <= FISH_TYPE_2) {
            Global.ServerBot.infoListFish.numberFishType2 -= 1;
        } else if(fishType <= FISH_TYPE_3) {
            Global.ServerBot.infoListFish.numberFishType3 -= 1;
        } else if(fishType <= FISH_TYPE_4) {
            Global.ServerBot.infoListFish.numberFishType4 -= 1;
        }
        if(fishType <= 16) {
            Global.ServerBot.infoListFish.numberTypeFish[fishType-1] -= 1;
            this.RemoveColor(fishType);
        }
       
            if(Global.ServerBot.infoListFish.numberFishType4 <= this.minTypeFish[3]) {
                let pos = Global.RandomNumber(0, 12);
                this.CreateGroupFishType4(pos, 0);
            }
            if(Global.ServerBot.infoListFish.numberFishType3 < this.minTypeFish[2]) {
                let pos = Global.RandomNumber(0, 12);
                this.CreateGroupFishType3(pos, 0);
            }
            if(Global.ServerBot.infoListFish.numberFishType2 < this.minTypeFish[1]) {
                let pos = Global.RandomNumber(0, 12);
                this.CreateGroupFishType2(pos, 0);
            }
            if(Global.ServerBot.infoListFish.numberFishType1 < this.minTypeFish[0]) {
                let pos = Global.RandomNumber(0, 12);
                this.CreateGroupFishType1(pos, 0);
                pos = Global.RandomNumber(0, 12);
                this.CreateGroupFishType1(pos, 0);
                pos = Global.RandomNumber(0, 12);
                this.CreateGroupFishType1(pos, 0);
            }
       
        // cc.log("number fish:"+Global.ServerBot.infoListFish.numberFishType1+"  "+Global.ServerBot.infoListFish.numberFishType2+"  "+
        // Global.ServerBot.infoListFish.numberFishType3+"  "+Global.ServerBot.infoListFish.numberFishType4);
    },

    RemovePreCreateFish(listPreCreateFish) {
        for(let temp in listPreCreateFish){
            if(listPreCreateFish[temp].startTimeCreated >= new Date().getTime() /*require("SyncTimeControl").getIns().GetCurrentTimeServer()*/) {
                if(listPreCreateFish[temp].FishType <= FISH_TYPE_1) {
                    Global.ServerBot.infoListFish.numberFishType1 -= 1;
                    if(Global.ServerBot.infoListFish.numberFishType1 < 0)
                        Global.ServerBot.infoListFish.numberFishType1 = 0
                } else if(listPreCreateFish[temp].FishType <= FISH_TYPE_2) {
                    Global.ServerBot.infoListFish.numberFishType2 -= 1;
                    if(Global.ServerBot.infoListFish.numberFishType2 < 0)
                        Global.ServerBot.infoListFish.numberFishType2 = 0
                } else if(listPreCreateFish[temp].FishType <= FISH_TYPE_3) {
                    Global.ServerBot.infoListFish.numberFishType3 -= 1;
                    if(Global.ServerBot.infoListFish.numberFishType3 < 0)
                        Global.ServerBot.infoListFish.numberFishType3 = 0
                } else if(listPreCreateFish[temp].FishType <= FISH_TYPE_4) {
                    Global.ServerBot.infoListFish.numberFishType4 -= 1;
                    if(Global.ServerBot.infoListFish.numberFishType4 < 0)
                        Global.ServerBot.infoListFish.numberFishType4 = 0
                }
                delete Global.ServerBot.listFishInGame[temp.toString()];
            }
		}
    },

    CountNumberTypeFish(indexStart, indexEnd) {
        let list = Global.ServerBot.infoListFish.numberTypeFish;
        let rs = [];
        let count = 0;
        let index = 0;
        for(let i = indexStart; i <= indexEnd; i++) {
            if(list[i-1] > 0) {
                rs[index] = 1;
                count += 1;
            } else {
                rs[index] = 0;
            }
            index +=1;
        }
        if(count >= 2) {
            let r = Global.RandomNumber(0, 2)+1;
            for(let i = 0; i < rs.length; i++) {
                if(rs[i] > 0) {
                    r -= 1;
                    if(r == 0) {
                        return indexStart + i;
                    }
                }
            }
        }
        return -1;;
    },

    AddToColor(fishType) {
        if(fishType == 2 || fishType == 4 || fishType == 6) {
            this.countColor[0] += 1;
        } else if(fishType == 3 || fishType == 7 || fishType == 13) {
            this.countColor[1] += 1;
        } else if(fishType == 5 || fishType == 8 || fishType == 12 || fishType == 14) {
            this.countColor[2] += 1;
        } else if(fishType == 9 || fishType == 10 || fishType == 11 || fishType == 15 || fishType == 16) {
            this.countColor[3] += 1;
        } else if(fishType == 1) {
            this.countColor[4] += 1;
        }
    },

    RemoveColor(fishType) {
        if(fishType == 2 || fishType == 4 || fishType == 6) {
            this.countColor[0] -= 1;
        } else if(fishType == 3 || fishType == 7 || fishType == 13) {
            this.countColor[1] -= 1;
        } else if(fishType == 5 || fishType == 8 || fishType == 12 || fishType == 14) {
            this.countColor[2] -= 1;
        } else if(fishType == 9 || fishType == 10 || fishType == 11 || fishType == 15 || fishType == 16) {
            this.countColor[3] -= 1;
        } else if(fishType == 1) {
            this.countColor[4] -= 1;
        }
    },

    PickColor(type) {
        let count = 0;
        for(let i = 0; i < this.countColor.length; i++) {
            if(this.countColor[i] > 0) {
                count += 1;
            }
        }
        if(count < 3) 
            return -1;
        else {
            let check = [];
            if(type == 1) {
                if(this.countColor[0] > 0) {
                    check.push(2);
                    check.push(4);
                } 
                if(this.countColor[1] > 0) {
                    check.push(3);
                } 
                if(this.countColor[4] > 0) {
                    check.push(1);
                }
            } else if(type == 2) {
                if(this.countColor[0] > 0) {
                    check.push(6);
                } 
                if(this.countColor[1] > 0) {
                    check.push(7);
                } 
                if(this.countColor[2] > 0) {
                    check.push(5);
                    check.push(8);
                }
            } else if(type == 3) {
                if(this.countColor[2] > 0) {
                    check.push(12);
                } 
                if(this.countColor[3] > 0) {
                    check.push(9);
                    check.push(10);
                    check.push(11);
                }
            } else if(type == 4) {
                if(this.countColor[1] > 0) {
                    check.push(13);
                } 
                if(this.countColor[2] > 0) {
                    check.push(14);
                } 
                if(this.countColor[3] > 0) {
                    check.push(15);
                    check.push(16);
                }
            }
            if(check.length == 0) {
                return -1;
            } else {
                let rs = check[Global.RandomNumber(0, check.length)];
                return rs;
            }
        }
    },

    update(dt) { 
      
        if(Global.InGameManager == null || Global.InGameManager.inBackGround)
        return;


        this.dataCreateFish.countTime += dt;
        if(this.timeWaitCreateBoss > 0) {
            this.timeWaitCreateBoss -= dt;
            if(this.timeWaitCreateBoss < 0)
                this.timeWaitCreateBoss = 0;
        }
        if(this.dataCreateFish.countTime >= this.timeExist) {
            this.dataCreateFish.countTime = 0;
            if(this.dataCreateFish.state == 1) {
                if(this.timeMaxExistBoss != 0) {
                    this.dataCreateFish.state = 2;
                    this.timeExist = Global.RandomNumber(this.timeMinExistBoss, this.timeMaxExistBoss);
                   
                    this.CreateBoss();
                }
            } else if(this.dataCreateFish.state == 2) {
                if(this.currentBoss != Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_0 && this.currentBoss != Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_1 &&
                    this.currentBoss != Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_2 && this.currentBoss != Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_3) {
                    this.RemoveBoss();
                    this.EndBoss();
                } else {
                    this.timeExist = 30;
                   // Global.ServerBot.SammuraiEvolution();
                }
            }
        }
    },
});
