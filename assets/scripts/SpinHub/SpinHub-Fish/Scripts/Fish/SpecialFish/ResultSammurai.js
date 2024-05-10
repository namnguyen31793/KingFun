cc.Class({
    extends: cc.Component,

    properties: {
        posSammurai : cc.Node,
        posHeso : cc.Node,
        circle : cc.Node,
        lbValue : require("TextJackpot"),
        result : sp.Skeleton,
    },

    OnStart() {
        Global.InGameView.OffAuto();
        this.result.setAnimation(0, 'xuat hien', false);
        this.scheduleOnce(()=>{
            Global.SammuraiController.OnCheckLoad();
            this.result.setAnimation(0, 'loop', true);
        } , 0.3);
    },

    Init(sammurai, heso, level, value, multi) {
        sammurai.node.parent = this.posSammurai;
        sammurai.node.active = true;
        heso.node.parent = this.posHeso;
        heso.node.active = true;
        this.circle.active = true;
        sammurai.ske.setAnimation(0, 'Lv'+(level+1)+'_SWIM', true);
        heso.setAnimation(0, 'xuat hien', false);
       
        this.scheduleOnce(()=>{
            this.lbValue.StartIncreaseTo(value);
        } , 1);
        this.scheduleOnce(()=>{
            sammurai.ske.setAnimation(0, 'Lv'+(level+1)+'_CATCH_FREEZE', true);
            heso.setAnimation(0, 'xoay tron', false);
        } , 2);
        let current = this;
        cc.resources.load('SpinHub-Fish/Prefabs/Fish/ResultSammurai/EffectSammurai', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish","ResultSammurai/EffectSammurai", (prefab)=>{
            try{
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
            let node = cc.instantiate(prefab);
            node.parent = this.posHeso;
            node.setPosition(cc.v2(0,0));
            node.active = false;
            current.effect = node.getComponent(sp.Skeleton);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
        cc.resources.load('SpinHub-Fish/Prefabs/Fish/ResultSammurai/BoomSammurai', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish","ResultSammurai/BoomSammurai", (prefab)=>{
            try{
                if(Global.InGameManager == null || Global.InGameManager.inBackGround)
                    return;
            let node = cc.instantiate(prefab);
            node.parent = this.posSammurai;
            node.setPosition(cc.v2(0,0));
            node.active = false;
            current.boom = node.getComponent(sp.Skeleton);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
       
        this.scheduleOnce(()=>{
            heso.node.active = false;
            this.effect.node.setSiblingIndex(this.effect.node.parent.children.length-1);
            this.effect.node.active = true;
            this.effect.setSkin('lv'+level+'-'+multi);
            this.effect.setAnimation(0, 'xuat hien ket qua', true);
            this.scheduleOnce(()=>{
                this.effect.setAnimation(0, 'bay ve khung', false);
                this.scheduleOnce(()=>{
                    this.lbValue.StartIncreaseTo(value * multi);
                    sammurai.ske.setAnimation(0, 'Lv'+(level+1)+'_CATCH_FREEZE_02', false);
                    this.scheduleOnce(()=>{
                        this.boom.node.active = true;
                        this.boom.setAnimation(0, 'animation', false);
                        sammurai.ske.setAnimation(0, 'Lv'+(level+1)+'_CATCH2', true);
                        this.scheduleOnce(()=>{
                            this.lbValue.reset();
                            this.result.setAnimation(0, 'bienmat', false);
                            this.scheduleOnce(()=>{
                                Global.SammuraiController.DestroyResult();
                            } , 0.5);
                        } , 5);
                    } , 0.4);
                } , 0.8);
            } , 1);
        } , 2.5);
    },
});
