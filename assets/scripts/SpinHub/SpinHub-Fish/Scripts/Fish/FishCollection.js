  var FishCollection = cc.Class({
	statics: {
        getIns() {
            if (this.self == null) {
                this.self = new FishCollection();
                this.self.listFish = {};
                this.self.listPreCreateFish = {};
                this.self.listCreatId = {};
            }
            return this.self;
        }
    },

    properties : {

    },

    Init() {
        this.listFish = {};
        this.listPreCreateFish = {};
        this.listCreatId = {};
        this.creatpoolFish();
        this.test = false;
        this.numberFish = 0;
    },

    SubToTalFish() {
        this.numberFish -= 1;
        if(this.numberFish < 0)
            this.numberFish = 0;
    },

    AddToTalFish() {
        this.numberFish += 1;
    },

    CreateFish(fishProperties) {
        if(this.CheckFishExists(fishProperties.FishId))
            return;
        fishProperties.skipTime = 0;
        let timeOffset = require("SyncTimeControl").getIns().convertTime(fishProperties.CreateTime).getTime();
      
        fishProperties.startTimeCreated = timeOffset;
        this.listPreCreateFish[fishProperties.FishId.toString()] = fishProperties;
        if(fishProperties.FishType == null) {
            console.log("error create fish 3");
        }
    },

   
    CheckFishExists(fishId) {
        if(this.listPreCreateFish[fishId.toString()] || this.listFish[fishId.toString()])
            return true;
        return false;
    },

    CheckFishExistsByType(fishType)
    {
        for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                if(this.listFish[temp].FishProperties.FishType == fishType )
                    return true;
            }
		}
        return false;
    },

    ClearSpecialFish(fishType) {
		for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                if(this.listFish[temp].FishProperties.FishType == fishType) {
                    this.listFish[temp].SetFishRedundancy(true);
                }
				    
            }
		}
    },

    FindJackpotFish() {
        for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                if(this.listFish[temp].FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINI_JACKPOT || this.listFish[temp].FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINOR_JACKPOT
                    || this.listFish[temp].FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MAJOR_JACKPOT || this.listFish[temp].FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GRAND_JACKPOT|| this.listFish[temp].FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GOD_JACCKPOT)
                    return this.listFish[temp];
            }
		}
        return null;
    },

    FindSammuraiFish() {
        for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                if(this.listFish[temp].FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_0 || this.listFish[temp].FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_1
                    || this.listFish[temp].FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_2 || this.listFish[temp].FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.SAMMURAI_LEVEL_3)
                        return this.listFish[temp];
            }
		}
        return null;
    },

    GetListFishIdInScene(xScene, yScene) {
        let listFishId = [];
        let index = 0;
        for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                if (!this.listFish[temp].isDie && this.listFish[temp].FishProperties.FishType < 20) {
                    let nodeFish = this.listFish[temp].node;
                    if(nodeFish.x < xScene &&  nodeFish.x > -xScene && nodeFish.y < yScene && nodeFish.y > -yScene ){
                        listFishId[index] = this.listFish[temp].FishProperties.FishId;
                        index += 1;
                    } 
                }
            }
        }
        return listFishId;
    },

    GetListFishInScene(xScene, yScene) {
        let listFishInScreen = [];
        let index = 0;
        for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                if (!this.listFish[temp].isDie && this.listFish[temp].FishProperties.FishType < 20) {
                    let nodeFish = this.listFish[temp].node;
                    if(nodeFish.x < xScene &&  nodeFish.x > -xScene && nodeFish.y < yScene && nodeFish.y > -yScene ){
                        listFishInScreen[index] = this.listFish[temp];
                        index += 1;
                    } 
                }
            }
        }
        return listFishInScreen;
    },

    GetRandomFishInSceneView(xScene, yScene, fishAmount)
    {
        let listFish = this.GetListFishInScene(xScene, yScene);
        let randomFishList = [];
        if(fishAmount == 0)
            return randomFishList;
        if(fishAmount > listFish.length)
            fishAmount = listFish.length;
        let index = 0;
        for(let i = 0;i < fishAmount;i++)
        {         
            randomFishList[index] = listFish[i];
            index++;
        }
        return randomFishList;
    },

    GetRandomFishInScreenView(xScene, yScene)
    {
        let listFish = this.GetListFishInScene(xScene, yScene);
        let randomFishList = [];
        let index = 0;
        for(let i = 0;i < listFish.length;i++)
        {        
            
                randomFishList[index] = listFish[i];
                index++;
          
        }
        if(randomFishList.length  == 0)
        {      
            return null;
        }
        let randIndex = Global.RandomNumber(0,randomFishList.length);
        return randomFishList[randIndex];
    },


  
    RemoveListFishNormalRedundancy() {
		for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                if(!this.CheckEventFish(this.listFish[temp].FishProperties.FishType))
                    this.listFish[temp].SetFishRedundancy(true);
            } else {
                console.log("error not exist fish:"+temp);
            }
        }
        if(Global.ServerBot.moduleCreateFish)
            Global.ServerBot.moduleCreateFish.RemovePreCreateFish(this.listPreCreateFish);
        this.listPreCreateFish = {};
    },

    CheckEventFish(fishType) {
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_EVENT_SMALL_USER || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_EVENT_BIG_USER || 
            fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MONSTER_WINTER || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_FROG_1M || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GOD_OF_WEALTH) {
            return true;
        } else {
            return false;
        }
    },

    RemoveFishReduncy(fishId) {
        let fish = this.GetFishById(fishId);
        if (fish != null) {
            fish.SetFishRedundancy (false);
        }
    },

    GetFishById(fishId) {
        return this.listFish[fishId.toString()];
    },

    GetFishByType(fishType) {
        try {
            for(let temp in this.listFish){
                if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                    if(this.listFish[temp].FishProperties.FishType == fishType)
                    {
                        return this.listFish[temp];
                    }
                }
            }
        } catch {

        }
        
        return null;
    },

	RemoveFishToList(fishId) {
		if(this.listFish[fishId.toString()]) {
			delete this.listFish[fishId.toString()];
		}
			
    },
    
    StopAnimation() {
        for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                this.listFish[temp].SetSpeedAnimationByMove(0);
            }
        }
    },
	
	UpdateCurrentMoveTime() {
		for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                this.listFish[temp].updateCurrentMoveTime();
            }
        }
	},

    EndIce(startTime, endTime) {
        for(let temp in this.listPreCreateFish){
            if(this.listPreCreateFish[temp] != null)
                this.listPreCreateFish[temp].startTimeCreated += (endTime - startTime);
        }
        for(let temp in this.listFish){
            if(this.listFish[temp] != null && this.listFish[temp].FishProperties != null) {
                this.listFish[temp].FishProperties.startTimeCreated += (endTime - startTime);
            }
        }
    },

    SyncIce(freezeeTime) {
        for(let temp in this.listPreCreateFish){
            this.listPreCreateFish[temp].skipTime = freezeeTime;
        }
        for(let temp in this.listFish){
            this.listFish[temp].SyncIce(freezeeTime);
        }
    },
    
    initFish(fishType , fishProperties){      
        if(this.listCreatId[fishProperties.FishId.toString()])
        {
            delete this.listPreCreateFish[fishProperties.FishId.toString()];
            return;
        }
            
        this.listCreatId[fishProperties.FishId.toString()] = fishProperties.FishId;
        let type = fishType;
        if(type == Global.Enum.FISH_TYPE_CONFIG.SPECIAL_GUN_FISH) {
            if (fishProperties.ItemType == Global.Enum.FISH_TYPE_CONFIG.LAZE_GUN_ID)
                type = 155;
            else if (fishProperties.ItemType == Global.Enum.FISH_TYPE_CONFIG.DRILL_GUN_ID)
                type = 156;
           
        }
        if(type == Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE) {
           
            cc.resources.load('SpinHub-Fish/Prefabs/Fish/Kraken', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadPrefab("Fish","Kraken", (prefab)=>{
                let node = cc.instantiate(prefab);
                Global.GameLogic.kraken = node.getComponent("KrakenController");
                Global.GameLogic.kraken.node.parent = Global.InGameManager.FishType5Container;
                Global.GameLogic.kraken.node.setSiblingIndex(0);
                Global.GameLogic.kraken.ShowKraken(fishProperties);
               
            });
            
        } else {
            let node = this.getFishPreFabsByType(type);
            if(node == null){
                let extend = "";
                if(type == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_2 || type == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_3) {
                    extend = "_" + require("ScreenManager").getIns().roomType.toString();
                }
                let nameBundle = "Fish";
                if(type == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_EVENT_SMALL_USER || type == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_EVENT_BIG_USER || type == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MONSTER_WINTER
                    || type == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_FROG_1M|| type == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_BLACK_DRAGON) {
                    nameBundle = "Fish2";
                }
                if(    type == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_GOD_OF_WEALTH 
                    || type == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_PHOENIX 
                    || type == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_DARK_MONSTER
                    || type == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_BUDDHA
                    || type == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_MULTI_DRILL
                    || type == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_THUNDER_SOLO
                    || type == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_ALADDIN_LEVEL_1
                    || type == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_LION_DANCE_LEVEL_1 
                    || type == Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_GOD_JACCKPOT
                 ) {
                    nameBundle = "Fish3";
                }

                if(fishType < 100 )
                {
                    cc.resources.load('SpinHub-Fish/Prefabs/BaseFish/Fish'+type+extend, cc.Prefab, function (err, prefab) {      
                    //Global.DownloadManager.LoadLocalPrefab("Prefabs/BaseFish/Fish"+type+extend, (prefab)=>{
                         try {
                            let nodeCp = cc.instantiate(prefab).getComponent("Fish");
                            nodeCp.node.setPosition(cc.v2(-9999, -9999), Global.RandomNumber(-360,360));
                            require("FishCollection").getIns().SetParentForFish(nodeCp.node, type);
                            nodeCp.Init(fishProperties);
                            require("FishCollection").getIns().listFish[fishProperties.FishId.toString()] = nodeCp;
                         } catch {
                             console.log("ERROR create fish:"+type);
                         }
                        
                    });

                }
                else
                {
                    cc.resources.load('SpinHub-Fish/Prefabs/'+nameBundle+'/'+"Fish"+type+extend, cc.Prefab, function (err, prefab) {      
                    //Global.DownloadManager.LoadPrefab(nameBundle,"Fish"+type+extend, (prefab)=>{
                        try {
                            let nodeCp = cc.instantiate(prefab).getComponent("Fish");
                            nodeCp.node.setPosition(cc.v2(-9999, -9999), Global.RandomNumber(-360,360));
                            require("FishCollection").getIns().SetParentForFish(nodeCp.node, type);
                            nodeCp.Init(fishProperties);
                            require("FishCollection").getIns().listFish[fishProperties.FishId.toString()] = nodeCp;
                        } catch {
                            console.log("error create fish:"+type);
                            console.log("error nameBundle:"+nameBundle);
                        }
                    });
                }
            }else{
                let nodeCp = node.getComponent("Fish");
                nodeCp.node.setPosition(cc.v2(-9999, -9999), Global.RandomNumber(-360,360));
                this.SetParentForFish(nodeCp.node, type);
                nodeCp.Init(fishProperties);
                this.listFish[fishProperties.FishId.toString()] = nodeCp;
            }
        }
        delete this.listPreCreateFish[fishProperties.FishId.toString()];
    },

    SetParentForFish(fish, fishType) {
        try
        {
            if(fishType <= 4) {            
                fish.parent = Global.InGameManager.FishPoolInstance.FishType1Container;
            } else if(fishType <= 8) {
                fish.parent = Global.InGameManager.FishPoolInstance.FishType2Container;
            } else if(fishType <= 12) {
                fish.parent = Global.InGameManager.FishPoolInstance.FishType3Container;
            } else if(fishType <= 16) {
                fish.parent = Global.InGameManager.FishPoolInstance.FishType4Container;
            } else if(fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINI_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MINOR_JACKPOT ||
                fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_MAJOR_JACKPOT || fishType == Global.Enum.FISH_TYPE_CONFIG.TYPE_FISH_GRAND_JACKPOT) {
                fish.parent = Global.InGameManager.FishPoolInstance.FishType5Container;
            } else {
                fish.parent = Global.InGameManager.FishPoolInstance.FishType4Container;
            }
        }
        catch(e)
        {
            cc.log("ERROR: "+e);
        }
    },

    getFishPreFabsByType(fishType){
       let str = "poolFish" + fishType;
       let pool = this[str];
       if(pool == null) {
        pool = new cc.NodePool();
       }

       let node = null;
        if(pool.size() > 0){
            node = pool.get();
        }
        return node;
    },


    creatpoolFish(){
        this.poolFish1 = new cc.NodePool();
        this.poolFish2 = new cc.NodePool();
        this.poolFish3 = new cc.NodePool();
        this.poolFish4 = new cc.NodePool();
        this.poolFish5 = new cc.NodePool();
        this.poolFish6 = new cc.NodePool();
        this.poolFish7 = new cc.NodePool();
        this.poolFish8 = new cc.NodePool();
        this.poolFish9 = new cc.NodePool();
        this.poolFish10 = new cc.NodePool();
        this.poolFish11 = new cc.NodePool();
        this.poolFish12 = new cc.NodePool();
        this.poolFish13 = new cc.NodePool();
        this.poolFish14 = new cc.NodePool();
        this.poolFish15 = new cc.NodePool();
        this.poolFish16 = new cc.NodePool();
        this.poolFish17 = new cc.NodePool();
        this.poolFish18 = new cc.NodePool();
        this.poolFish19 = new cc.NodePool();
        this.poolFish27 = new cc.NodePool();
        this.poolFish28 = new cc.NodePool();
        this.poolFish30 = new cc.NodePool();
        this.poolFish31 = new cc.NodePool();
        this.poolFish32 = new cc.NodePool();
        this.poolFish33 = new cc.NodePool();
        this.poolFish34 = new cc.NodePool();
        this.poolFish50 = new cc.NodePool();
        this.poolFish51 = new cc.NodePool();
        this.poolFish52 = new cc.NodePool();
        this.poolFish53 = new cc.NodePool();
        this.poolFish100 = new cc.NodePool();
        this.poolFish101 = new cc.NodePool();
        this.poolFish102 = new cc.NodePool();
        this.poolFish103 = new cc.NodePool();
        this.poolFish104 = new cc.NodePool();
        this.poolFish105 = new cc.NodePool();
        this.poolFish106 = new cc.NodePool();
        this.poolFish107 = new cc.NodePool();
        this.poolFish108 = new cc.NodePool();
        this.poolFish109 = new cc.NodePool();
        this.poolFish113 = new cc.NodePool();
        this.poolFish114 = new cc.NodePool();
        this.poolFish115 = new cc.NodePool();
        this.poolFish116 = new cc.NodePool();
        this.poolFish117 = new cc.NodePool();
        this.poolFish118 = new cc.NodePool();
        this.poolFish119 = new cc.NodePool();
        this.poolFish122 = new cc.NodePool();
        this.poolFish123 = new cc.NodePool();
        this.poolFish124 = new cc.NodePool();
        this.poolFish125 = new cc.NodePool();
        this.poolFish126 = new cc.NodePool();
        this.poolFish129 = new cc.NodePool();
        this.poolFish132 = new cc.NodePool();
        
        this.poolFish150 = new cc.NodePool();
        this.poolFish155 = new cc.NodePool();
        this.poolFish156 = new cc.NodePool();
        this.poolFish157 = new cc.NodePool();
        this.poolFish160 = new cc.NodePool();
    },

    onDestroy(){
        this.poolFish1.clear();
        this.poolFish2.clear();
        this.poolFish3.clear();
        this.poolFish4.clear();
        this.poolFish5.clear();
        this.poolFish6.clear();
        this.poolFish7.clear();
        this.poolFish8.clear();
        this.poolFish9.clear();
        this.poolFish10.clear();
        this.poolFish11.clear();
        this.poolFish12.clear();
        this.poolFish13.clear();
        this.poolFish14.clear();
        this.poolFish15.clear();
        this.poolFish16.clear();
        this.poolFish17.clear();
        this.poolFish18.clear();
        this.poolFish19.clear();
        this.poolFish27.clear();
        this.poolFish28.clear();
        this.poolFish30.clear();
        this.poolFish31.clear();
        this.poolFish32.clear();
        this.poolFish33.clear();
        this.poolFish34.clear();
        this.poolFish50.clear();
        this.poolFish51.clear();
        this.poolFish52.clear();
        this.poolFish53.clear();
        this.poolFish100.clear();
        this.poolFish101.clear();
        this.poolFish102.clear();
        this.poolFish103.clear();
        this.poolFish104.clear();
        this.poolFish105.clear();
        this.poolFish106.clear();
        this.poolFish107.clear();
        this.poolFish108.clear();
        this.poolFish109.clear();
        this.poolFish113.clear();
        this.poolFish114.clear();
        this.poolFish115.clear();
        this.poolFish116.clear();
        this.poolFish117.clear();
        this.poolFish118.clear();
        this.poolFish119.clear();
        this.poolFish122.clear();
        this.poolFish123.clear();
        this.poolFish124.clear();
        this.poolFish125.clear();
        this.poolFish126.clear();
        this.poolFish129.clear();
        this.poolFish132.clear();
       
        this.poolFish150.clear();
        this.poolFish155.clear();
        this.poolFish156.clear();
        this.poolFish157.clear();
        this.poolFish160.clear();

    },

});
module.exports = FishCollection;