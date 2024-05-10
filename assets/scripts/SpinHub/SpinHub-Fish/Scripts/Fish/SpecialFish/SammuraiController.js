cc.Class({
    extends: cc.Component,
    ctor() {
        this.countCheck = 0;
        this.multi = 3;
    },

    properties: {
        
    },

    CreateResultSammurai(level, baseValue, actor, money) {
        this.baseValue = baseValue;
        this.actor = actor;
        this.money = money;
        let current = this;
        cc.resources.load('SpinHub-Fish/Prefabs/Fish/ResultSammurai', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish","ResultSammurai", (prefab)=>{
            try{
            let node = cc.instantiate(prefab);
            current.node.addChild(node);
            node.setPosition(cc.v2(0,0));
            
            Global.SammuraiController.result = node.getComponent("ResultSammurai");
            Global.SammuraiController.result.OnStart();
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
            });

        cc.resources.load('SpinHub-Fish/Prefabs/Fish/ResultSammurai'+level, cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish","ResultSammurai/"+level, (prefab)=>{
            try{
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
            let node = cc.instantiate(prefab);
            Global.SammuraiController.heso = node.getComponent(sp.Skeleton);
            Global.SammuraiController.currentLevel = level;
            node.setPosition(cc.v2(0,0));
            node.active = false;
            Global.SammuraiController.OnCheckLoad();
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });

        cc.resources.load('SpinHub-Fish/Prefabs/Fish/Fish109', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish","Fish109", (prefab)=>{
            try{
            let node = cc.instantiate(prefab);
            Global.SammuraiController.sammurai = node.getComponent("FishSammurai");
            node.setPosition(cc.v2(0,0));
            node.active = false;
            Global.SammuraiController.sammurai.inRun = false;
            Global.SammuraiController.OnCheckLoad();
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
    },

    DestroyResult() {
        this.countCheck = 0;
        this.result.effect.node.destroy();
        this.result.boom.node.destroy();
        this.result.node.destroy();
        this.sammurai.node.destroy();
        this.heso.node.destroy();
        
    },

    OnCheckLoad() {
        this.countCheck += 1;
        if(this.countCheck >= 3) {
            this.result.Init(this.sammurai, this.heso, this.currentLevel, this.baseValue, this.multi);
        }
    },

    onLoad() {
        Global.SammuraiController = this;
    },

    onDestroy() {
        Global.SammuraiController = null;
    },
});
