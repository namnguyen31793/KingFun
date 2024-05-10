
cc.Class({
    extends: cc.Component,
    ctor() {      
        this.countFish = 0;
        this.listFishInGame = {};
        this.timeControl = require("SyncTimeControl").getIns();
        this.isBot = false;
        this.listActor = {};
        this.botAttack = true;
        this.countTime = 0;
        this.timeChangeBot = Global.RandomNumber(10,30); 
        this.moduleCreateFish = null;
        this.modulePlayEffect = null;
        this.infoListFish = null;
        this.listDataCalculator = {};
        this.isCreateSpecialFish = false;
        this.isCreateMiniBoss = false;
        this.defaultUser = [];
        this.randomNicknames = ["tungokok","heoga19","1phatngaychym","chienemx4","iluvoi","anhbac1000do","emlaconga9x","doitrang123","khattrinh","1224915678","duonghn1234","975554456","tuananhhp1991","qop444444","anhtay123344","tsunami2106","hanbaby","viets2vy","banhcui123450","quanghaiqs12","toasangvinhqag","ngocyeuln","huy28196","luuduc9hcm","k0mu0ntjn01","losely111213","vkiuxinhgai","bu0jb0nghpv","ngothuydung1","hudauroi666","colectojsc86","minhdream8888","lethu4759","helpme123","thaygiaotre88","buonwahp","coolgirl0312","p0lice9x","l0t0m088l0t0m0","vietlong6693","freetime1989","nhonnhonhp91","ns10999999","dungcoi199x","deudeud","congdonggame89","arab0nseven","hoangkgpro470","khanhlam7a","nhokkutepk63","bodoi1984","minhngocbk55","hjeupzo1","lenlen321123","royalfcashout","945760545","hc19991102","tungtay6789","nguthichet666666","tambech1102","vinhanhlsls","964726789","tr4ngc0j","vuabai56789","pickoff2702","tamtkcb","linhhieu","tieuquy1112","dkmaoquavtc","bebubobo01","kemangtoiii","ducanh522014","1655911848","theendhg","thiendangvp","thangtheu1102","hoangthuy24021996","Mrtrung86","hacker1206","nhiclinhtrinh15","anvip1992","sonhn2014","quanbsno1","Thungphasanh5555","bovenh3979","long662552","huutinh10b5","Victor333","anhlabay1","kunx1020","buonbuonvuivui99","Truong-Hong-An","sosoqua87","vua102","khanh2999","aoroisehet","canhakngu","ilove7c","congepzai1994","mjzz96","pronongdan123","muash6789","xuanblu94","lonbuoicucac","tranthangvn","lytoetfa1102","hoangbe088","983989779","sonvodoi2","phamthephuc33","haininhdcmt","black189","matlua1","anpzo37fc","938251744","saoroivaobo6789","culua742","quocthien166","lunlalun2015","ronadou97","sucker95","changkho1995","molozbo36987","tungbynbyn96","nhock1kute2","ats2thu","tuanvu215","p3okoi8999","967169782","starswin16164","vuhatrango85","qmc031119824","chipxinh2000","onkon031","duoghk","969756556","xuanquang281990","manhtai158","svlmtqsg","trinhthuhien2",
        "linhtam9","tiencoka","minhphuthuy888","tung18091994","letefe1985","cry01869071058","Huyhiephp3979","d4rkhell","lehoangtoquyen","heo7upies","vtyeuem00","tienveqtt2","minhanh777","maymancadoi","tungthuy668","sacalet","hoangprocf000","kutoankiller","nguyenbichngoc91","dungchemem98","dethuong217","hienwwwww","quanyeu28","quachquan1992","donphuongdocma","xx1996","conloncon1508","xuanbac1102mc","bao1998","hoanglamhd","trangmaria93","buidoihp80","duongbg1988","hieusao96","diepgl1","hieublue","tvc01291","khucdaotinhm","Choco-Pie","aaaaaa5","khonlamdongu","b00mbj88","vtye00","kjmseyuong11","leduyen123","toiditimtoi221","nvc2510","lehip1985","hoang267563","ngocson201468","choukawai","soso1996","gianghai99","dungngo84","ngocnhikiss","mhttha1101979","ruasociu97xx","danchu7325","HaRollRoys","phamvudd","boydanto2k01","nghi21081989","988772237","976137333","vanluyen13","t8t8t8t8t8t8","hoangquay","Tuanjmmy88hb","mey01699094137","kusign1",
        "achuyn365","tuananhn507","kulio999","hienminh2007","dangkymoi237","0905097868vinhcho","digioioibuon12","tranganh2512","domanhpro","thenguyen","misociuu","luong198","vinhvinh333","kebaothu118","tien019518","phatvuive","tien0974808640","nhoksockbolao","chuoicavali","sanglele2003","hacmonils","xuantuyen29","vinhcodonls01","o0oqweo0o20","vantien123x","chipseo","3phebaj","bipvuonghp","mmotkim","toanuyen1992","mrtoan0102","nhoxthjengja9x","1664289561","943670123","phuc021297","noquythuong","dungacnhuthe12","songom96","905700007","caffeld","dattre5690","hienpelun","ckanckua1","chodien00000","drgonhp1","s0d03979","luffy254","0902693816a","visaothe","964072888","mrtheanh1407","lukix2","juno6689","kiepnaybo","abbreciat6","xaxaminhra159", "truongnhe123","942184833","trinhthuhien1","doanbach","thuylinhlove99","zomtntt9x",
        "truongnhe123","942184833","trinhthuhien1","doanbach","thuylinhlove99","zomtntt9x","a09875462111","sooczay01","binh097874","vuabip789","maymanls","mrbye1802","thuyxoan","yunnan9189","tuthethoi","carembembem","bada067890","princecanabis","danglongcp","achuyn","mk0000mk","nguyentu1996qn","karikn01","dinhbaxuong159","1673985223","duykieuduc90","dangkynhanh237","MaiBinhMinh2012","gaibao6789","chuot171995","0kxong1102","tuxedo2304","traihaodh","aemd1o2","candyhp12","doiitgap","suotngaythuathoi","hangdanh","deptraicogisaiii","tautien2014","hailong3089888","cafedangz","979969392","gaulaem","heo0909543693","968987266","902582708","weeding","cuipap1234321","miniitsmevip","mattrodangyeu","cutit512","ngocanh1995","sonne6120","tangtuongvy","phuonganh969","toanduy","linhcuuhoa123","tinhlagi1904","mrbenjanmin55","nhatnhat0333","1694556331","tungbin150490","chogherunglong","tuanfrance","freedomvodich","loclack92","09443519xx","anngaycaihu","niccatter07","dungchocanh","982688733","thanh6868hp","mil9889","l01205776789","minhtamls01","manhcuc90","asdfzxcb","nagasaki9889","freedomanhu3","tkuvanmay0502","cuongdo01","9999lon","vumanhha95","cuntam","1675096843","betomdz88","nudia1989","xiubang","whitii","khongcoten9xx","kenjoker41","0913145688nbk","coboha6789","onizuka0310","cax1113","quochuynguyen","chinhchch","bomhihi88","tuxjn8877","tinhvatien56789","haidet118811","moschino8800","cocain201433","965839936","vuenc12qt1","mrhkt37","linhcuuhoa888","winvtcid3388","anazon","hungbistro","948287894","tannkon1","hathauvan","vansam1969","ngockhuyen","baolinh9779","939120223","liemsaker1994","ebola123","976243333","ttlk18499","chantudann","xxnx8252627","vietlong456789","danchoida13","nanaha456","964019971","chanhvkl2k13","hoanbamat","cuky1234","halovea","buithihang410"
        ];
    },

    properties: {
    },

    onLoad() {
        Global.ServerBot = this;
        this.modulePlayEffect = this.node.addComponent("ModulePlayEffect");
        
        this.infoListFish = {
            numberFishType1 : 0,
            numberFishType2 : 0,
            numberFishType3 : 0,
            numberFishType4 : 0,
            listCountFish : [0,0,0,0,0,0,0,0,0,0,0,0],
            numberTypeFish : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        };
        this.moduleCreateFish = this.node.addComponent("ModuleCreateFish");
        this.moduleCreateFish.Init();
    },

    onDestroy() {
        Global.ServerBot = null;
    },

    StartServer() {
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            return;
        }
        this.isBot = true;
        this.isStartServer = true;
        this.StopBot();
      
        this.scheduleOnce(()=>{  
            this.isStartServer = false;
            Global.UIManager.hideLoading();
            this.moduleCreateFish.dataCreateFish.countTime = Global.RandomNumber(0, 70);
            this.StartBot();
        } , 1); 
        this.SendCreateFish(true);
        let mainActor = {
            AccountId: cc.LoginController.getInstance().getUserId(),
            SittingId: 2,
        };
        this.listActor[cc.LoginController.getInstance().getUserId().toString()] = mainActor;
        let randomNumberActor = Global.RandomNumber(0,4);
       //randomNumberActor = 1;
       

        for(let i = 0; i < randomNumberActor; i++) {
            this.CreateOtherActor(true);
        }
        if(randomNumberActor == 0)
        {
            this.scheduleOnce(()=>{
                let countActor = this.CountActor();
                if(countActor < 4) {
                    this.CreateOtherActor();
                }
            } , Global.RandomNumber(2,15)); 
        }
    },

    SendCreateFish(isInit) {
        this.moduleCreateFish.CreateNormalFish(isInit);
        // this.moduleCreateFish.CreateFishByType(CONFIG.CARD_TYPE);
        // this.moduleCreateFish.CreateTeamFish(1);
    },

    SammuraiEvolution() {
        let sammurai = Global.GameLogic.GetFishSammurai();
        if(sammurai != null)
            sammurai.Evolution();
        else {
            this.EndSamurai();
        }
    },

    EndSamurai() {      
        this.moduleCreateFish.RemoveFishByType(Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_0);      
        this.moduleCreateFish.EndBoss();
        this.moduleCreateFish.dataCreateFish.countTime = 0;
    },

    EndFishEvent() {
        let eventConfig = require ("PathStore").getIns().getEventConfig(require("ScreenManager").getIns().roomType.toString());
        this.moduleCreateFish.CreateEventFish(eventConfig.createTime[0], eventConfig.createTime[1], eventConfig);
    },

    EndFishBoss(fishId) {
       
        let eventConfig = require ("PathStore").getIns().getBossConfig(require("ScreenManager").getIns().roomType.toString());
        let check = true;
        for(let i = 0; i < eventConfig.typeFish.length; i++) {
            let fish = require("FishCollection").getIns().GetFishByType(eventConfig.typeFish[i]);
          
            if(fish != null && fish.FishProperties.FishId != fishId)
            {
                check = false;
                break;
            }
        }
        if(check) {
           
            this.moduleCreateFish.CreateBossFish(eventConfig.createTime[0], eventConfig.createTime[1], eventConfig);
        }
           
    },

    RemoveFishByType(fishType) {
        for(let temp in this.listFishInGame){
            if(temp.FishType == fishType)
                delete this.listFishInGame[temp.FishId.toString()];
        }
    },

    ServerKillFish(fishId) {
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            return;
        }
        if(this.isBot) {
          
            let killedFish = this.listFishInGame[fishId.toString()]
            
            if(killedFish) {
                let fishType = this.listFishInGame[fishId.toString()].FishType;
                let pathId = this.listFishInGame[fishId.toString()].PathId;
                let indexGroup = parseInt(pathId/50);
                this.infoListFish.listCountFish[indexGroup] -= 1;
                this.moduleCreateFish.ReCreateFish(fishType);
                
                if(this.listFishInGame[fishId.toString()].FishType == Global.Enum.FISH_TYPE_CONFIG.JACKPOT_TYPE) {
                    this.moduleCreateFish.EndBoss();
                }
                delete this.listFishInGame[fishId.toString()];
                this.countFish -= 1;
                if(fishType == Global.Enum.FISH_TYPE_CONFIG.ELECTRIC_FISH_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.FISH_BOOM_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.DRILL_FISH_TYPE ||
                    fishType == Global.Enum.FISH_TYPE_CONFIG.LAZE_FISH_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.WHEEL_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.CARD_TYPE || 
                    fishType == Global.Enum.FISH_TYPE_CONFIG.LUCKY_BOX_TYPE || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINI_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINOR_JACKPOT ||
                    fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MAJOR_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GRAND_JACKPOT) {
                        this.isCreateSpecialFish = false;
                }
                if(fishType == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_1 || fishType == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_2 || fishType == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_3) {
                    this.isCreateMiniBoss = false;
                    this.moduleCreateFish.timeWaitCreateBoss = 30;
                }
                if(fishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_0 || fishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_1 || fishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_2 ||
                    fishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_3) {
                        this.EndSamurai();
                    }
                if(fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_EVENT_SMALL_USER || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_EVENT_BIG_USER) {
                    this.EndFishEvent();
                }
                if(fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MONSTER_WINTER 
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_FROG_1M 
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GOD_OF_WEALTH
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_BLACK_DRAGON
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_PHOENIX
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_BUDDHA
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_DARK_MONSTER
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_LION_DANCE_LEVEL_1
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_LION_DANCE_LEVEL_2
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_LION_DANCE_LEVEL_3
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_ALADDIN_LEVEL_1
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_ALADDIN_LEVEL_2
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_ALADDIN_LEVEL_3
                    || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GOD_JACCKPOT
                ) {
                    this.EndFishBoss(fishId);
                    // this.EndFishEvent();
                }
            }
        }
    },

    CreateOtherActor(isFirtTime = false) {     
     
      

        if(Global.isOffline)
            return;  
        let actorId = this.GetIdRandom();
        let randBalancePercent = Global.RandomNumber(0, 100);
        let accountBalance = 0;
        if(randBalancePercent >20)
        {
             accountBalance = Global.RandomNumber(43, 54451) * 10;
        }
        else
        {
            accountBalance = 0;
        }
        if(Global.agent == 0)
        {
          
            if(isFirtTime == true)
            {
            accountBalance =  Global.RandomNumber(5000, 20000) * 10;
               
            }             
            else
            {
                accountBalance =  100 * 1000;   
            }  
        }
        let check = false;
        let listSittingId = [3,5,7];
        let sittingId = listSittingId[Global.RandomNumber(0,3)];
        while(!check) {
            let isExist = false;
            for(let temp in this.listActor){
                if(this.listActor[temp].SittingId == sittingId)
                {
                    isExist = true;
                    sittingId = listSittingId[Global.RandomNumber(0,3)];
                    break;
                }
            }
            if(!isExist) {
                check = true;
            }
        }
        let currentGunId = 1;
        if(accountBalance < 50000) {
            currentGunId = Global.RandomNumber(1,4);
        } else if(accountBalance < 200000) {
            currentGunId = Global.RandomNumber(1,5);
        } else if(accountBalance < 500000) {
            currentGunId = Global.RandomNumber(1,6);
        } else if(accountBalance < 1000000) {
            currentGunId = Global.RandomNumber(2,7);
        } else {
            currentGunId = Global.RandomNumber(2,8);
        }
        if(require("ScreenManager").getIns().roomType == 1) {
            if(currentGunId > cc.NetConfigNew.getInstance().CONFIG_GAME.MAX_GUN_ROOM_1) {
                currentGunId = cc.NetConfigNew.getInstance().CONFIG_GAME.MAX_GUN_ROOM_1;
            }
        }
        let dataRandom = this.RandomVipAndLevel();

        let actorName = this.GetNameRandom(actorId);
     
        let actor = {
            //AccountBalance : parseInt(accountBalance * (1+dataRandom.VipId/2)),
            AccountBalance : parseInt(accountBalance),
            AccountId : actorId,
            CacheGun : currentGunId,
            CurrentGunId : currentGunId,
            Diamond : 0,//Global.RandomNumber(0,100),
            NickName : actorName,
            SittingId : sittingId,
            VipId : Global.RandomNumber(1,8),
            VipLevel : dataRandom.VipLevel,
        }
        
        this.listActor[actorId.toString()] = actor;
        Global.GameLogic.CreateOtherJoinRoom(actor);
    },

    GetIdRandom() {
        let actorId = Global.RandomNumber(1000,90000);
        let check = false;
        let count = 0;
        while(!check) {
            if(count >= 20)
                return;
            if(this.listActor[actorId.toString()] || actorId== cc.LoginController.getInstance().getUserId()) {
                actorId = Global.RandomNumber(1000,90000);
                count+=1;
            } else {
                let c = true;
                for(let temp in this.listActor){
                    if(this.listActor[temp].AccountId == actorId)
                    {
                        count+=1;
                        actorId = Global.RandomNumber(1000,90000);
                        c = false;
                    }
                }
                if(c)
                    check = true;
            }
        }
        return actorId;
    },

    GetNameRandom(actorId) {
        /*
        let actorName = "Vn_User"+actorId;
        let check2 = false;
        while(!check2) {
            let r = Global.RandomNumber(0,100);
            if(r < 60) {
                if(Global.listDataBigWinLive != null && Global.listDataBigWinLive.length > 0) {
                    let data = Global.listDataBigWinLive[Global.RandomNumber(0, Global.listDataBigWinLive.length)];
                    if(data.NickName === ""  || data.NickName == cc.LoginController.getInstance().getNickname())
                    {
                        continue;
                    }
                    let c2 = true;
                    for(let temp in this.listActor){
                        if(this.listActor[temp].NickName == data.Nickname || data.NickName == cc.LoginController.getInstance().getNickname())
                        {
                            c2 = false;
                            break;
                        }
                    }
                    if(c2) {
                        actorName = data.Nickname;
                        check2 = true;
                    }
                }
            } else {
                check2 = true;
            }
        }
        */
        let r = Global.RandomNumber(0,this.randomNicknames.length);
        return this.randomNicknames[r];
    },

    RandomVipAndLevel() {
        let vipId = 0;
        let check = Global.RandomNumber(0,100);
        if(check < 40)
            vipId = 1;
        else vipId = check % 5 + 1;
        let vipLevel = Global.RandomNumber(5,12);
        // vipLevel += vipId * 15;
        let data = {
            VipId : vipId,
            VipLevel : vipLevel,
        }
        return data;
    },    

    RemoveBot(actor) {
        let accountId = actor.actorPropertis.AccountId;  
            let exitsActor =  this.listActor[accountId.toString()];
            if(exitsActor != null) {          
                if(actor.isAttack)                   
                    return;
                actor.Handle_ExitsRoom();
                Global.GameLogic.OtherExitRoom(this.listActor[accountId.toString()]);     
                delete this.listActor[accountId.toString()];
               ;
            }
      
        this.scheduleOnce(()=>{
            let countActor = this.CountActor();
            if(countActor < 4) {
                this.CreateOtherActor();
            }
        } , Global.RandomNumber(5,20)); 
    },  

    DelayBot(isDelay) {
        for(let temp in this.listActor){
            if(this.listActor[temp].AccountId != cc.LoginController.getInstance().getUserId())
            {
                if(isDelay)
                    this.listActor[temp].node.getComponent("ActorBot").timeDelay = 3;
                else this.listActor[temp].node.getComponent("ActorBot").timeDelay = 0.3;
            }
        }
    },

    CountActor() {
        let count = 0;
        for(let temp in this.listActor){
			count += 1;
		}
        return count;
    },

    update(dt) {
        if(Global.InGameManager.inBackGround)
            return;
        if(!Global.isConnect)
            return;
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            return;
        }
        this.countTime += dt;
        // cc.log(this.countTime+"     "+this.timeChangeBot);
        if(this.countTime >= this.timeChangeBot) {
            this.countTime = 0;
            this.timeChangeBot = Global.RandomNumber(20,40); 
            let check = Global.RandomNumber(0,5);
            let countActor = this.CountActor();
            if(check == 1) {
                if(countActor > 1) {
                    let listCurrentActor = [];
                    for(let temp in this.listActor){
                        listCurrentActor[listCurrentActor.length] = temp;
                    }
                    let randomActor = Global.RandomNumber(1, countActor-1);
                    Global.GameLogic.StopBot(listCurrentActor[randomActor]);
                }
            } else if(check == 2 || check == 3) {
                if(countActor < 4) {
                    this.CreateOtherActor();
                }
            }
        }
    },

    StartBot() {
        this.botAttack = true;
    },

    StopBot() {
        this.botAttack = false;
    },

   


    GetSurplusSpecial(accountId) {
        try {
            let current = this.listDataCalculator[accountId.toString()].CurrentReward;
            let total = this.listDataCalculator[accountId.toString()].TotalMulti;
            return total - current;
        } catch {
            return this.cacheMulti;
        }
        
    },

    AddSpecialValueFish(accountId, totalMulti, heso) {
        this.cacheMulti = totalMulti;
        let data = {
            TotalMulti : totalMulti,
            SingleReward : parseInt(heso * totalMulti),
            CurrentReward : 0,
        };
        this.listDataCalculator[accountId.toString()] = data;
    },

  

    RemoveSpecialFish(accountId) {
        if(this.listDataCalculator[accountId.toString()]) {
            delete this.listDataCalculator[accountId.toString()];
        }
    },

    GetMultiFishByType(fishType, isMax){
        //get max
        let multi = 0;
        let listFishConfig = Global.GameConfig.ListFishConfig;
        for(let i = 0; i < listFishConfig.length; i++){
            if(fishType == listFishConfig[i].FishType) {
                if(isMax)
                    multi = listFishConfig[i].FishMultiMax;
                else
                    multi = listFishConfig[i].FishMultiMin;

            }
        }
        return multi;
    },

    RemoveAllNormalFish() {
        this.unschedule(this.createSche);
        if(Global.GameLogic != null)
            Global.GameLogic.ClearAllNormalFish();
        this.isCreateSpecialFish = false;
        this.isCreateMiniBoss = false;
    },
});
