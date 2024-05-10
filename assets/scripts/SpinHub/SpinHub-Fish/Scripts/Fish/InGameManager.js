
cc.Class({
    extends: cc.Component,

    ctor(){
        this.timeDelay = 0.2 ;
        this.timeCountShoot = 0;
        this.timeCheckTouch = 0;
        this.timeUpdate=0;
        this.isAutoAtack = false;
        this.timeUpdateClick = 0;
        this.isAtack= false;
        this.isShowOption = false;
        this.isShake = false;
        this.fishTarget = null;
        this.isIce = false;
        this.setTimeOutFreezee = null;
        this.timer = null;
        this.eventHide = null;
        this.numberFishInScene = 0;
        this.timeCountFishNumber = 1;
        this.FishPoolInstance = null;
        this.hoverMouseCount = 0;
        this.isTouch = false;
      
    },

    properties: {
        FirstContainer : cc.Node,
        FishContainer : cc.Node,
        BulletContainer : cc.Node,
        ShockContainer: cc.Node,
        ActorInfoContainer: cc.Node,
        GunContainer: cc.Node,
        CoinContainer: cc.Node,
        ScoreContainer: cc.Node,
        OtherContainer: cc.Node, 
        EffectContainer: cc.Node,
        KhungContainer: cc.Node,
        bulletUser : cc.Node,
        bulletOther : cc.Node,
        listBulletSpecial:[cc.Node],
       // gun: cc.Node,
        snareUser : cc.Node,
        snareOther : cc.Node,
        score: cc.Node,
        coinClone : cc.Node,
        effectBoom : cc.Node,
        effectBoomBig : cc.Node,
    
        effectShock : cc.Node,
        effectNo2 : cc.Node,
        effectBoom2 : cc.Node,
        background : cc.Node,       
        effectBigWin : cc.Node,
        effectOtherBigWin : cc.Node,
        luckyBoxWheelContainer : cc.Node,
        itemObject : cc.Node,  
        marUser : cc.Material,
        marOther : cc.Material,
        marChangeColor : cc.Material,     
        listBeSung: [cc.Node],
        listBeSung_Waiting: [cc.Node],
        InGameSoundManager : require("InGameSoundManager")
    },

    start () {
        if(Global.isOffline)
            return;  
       
        //Global.UIManager.showLoading();
        this.timeDelay = Global.GameConfig.SystemGameConfig.TimeNormalShoot;
        this.timeCountShoot = this.timeDelay;
        require("SyncTimeControl").getIns().SendPing();
        let msgData = {};
        msgData[1] = 1;
        msgData[2] = require("ScreenManager").getIns().roomType;
        let playMode = Global.Enum.PLAY_MODE.NORMAL;
        if(require("ScreenManager").getIns().roomType == 3) {
            playMode = Global.Enum.PLAY_MODE.MULTI_PLAYER;
        }
        msgData[0] = playMode;
        require("SendRequest").getIns().MST_Client_Join_Room(msgData);
        cc.director.getCollisionManager().enabled  = true;
    
      
        this.FishPoolInstance = this.node.getComponent("FishPoolManager");
        this.Handle_InitBeSungAnimation();
    },

    RequestGetJackpot()
    {
        this.schedule(() => {
            let msgData = {};
            if(Global.GameLogic != null && Global.GameLogic.mainActor != null)
            {
                msgData[1] = Global.GameLogic.mainActor.GetNormalGunId();
                require("SendRequest").getIns().MST_Client_Get_Jackpot_Info(msgData);
              
            }
        }, 4);
    },

    onLoad() {
        
        Global.InGameManager = this;
        this.offsetX = cc.winSize.width/2;
        this.offsetY = cc.winSize.height/2;
        this.onEvent();
        this.creatpool();
        this.FishPoolInstance = this.node.getComponent("FishPoolManager");
        this.FishPoolInstance.Init();
        cc.game.on(cc.game.EVENT_HIDE, ()=>{
            this.inBackGround = true;
            // Global.InGameView.ChangeStatusPerforment(true);
            this.time_enter_background = Math.round(Date.now() / 1000);
        })
        
        cc.game.on(cc.game.EVENT_SHOW, ()=>{
            
            if(this.inBackGround && cc.sys.isNative){
                var _time = Math.round(Date.now() / 1000);
                let time_out_bg = _time - this.time_enter_background;
                this.time_enter_background = 0;
                if(time_out_bg >= 8)
                    require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
                // require("SyncTimeControl").getIns().SendPing();
            }
            this.inBackGround = false;
            // cc.game.setFrameRate(60);
        })
		
    },

    shakeScrenn(time){
        this.isShake = true;
        this.scheduleOnce(()=>{
            this.isShake = false;
            this.background.setPosition(0,0);
        }, time)
    },

    creatpool(){    
     
    },
    
    onDestroy() {
        clearTimeout(this.setTimeOutFreezee);
        this.offEvent();    
    },

    ChangeTurnSpeed(isTurnSpeed) {
        if (isTurnSpeed)
            this.timeDelay = Global.GameConfig.SystemGameConfig.TimeNormalShoot / 2;
        else
            this.timeDelay = Global.GameConfig.SystemGameConfig.TimeNormalShoot;
        this.timeCountShoot = this.timeDelay;
        //max 12 bullet per second
        // if (this.timeDelay < 0.05)
        // this.timeDelay = 0.05;
    },

    ChangeSpeedVipGun(isUser) {
        if (isUser)
            this.timeDelay = Global.GameConfig.SystemGameConfig.TimeNormalShoot / 1.5;
        else
            this.timeDelay = Global.GameConfig.SystemGameConfig.TimeNormalShoot;
        this.timeCountShoot = this.timeDelay;
    },



    getLengthObj(obj){
        let size = 0;
        for(let temp in obj){
            if(obj.hasOwnProperty(temp))size++;
        }
        return size
    },


    SetIce(timeFreezee) {
        this.isIce = true;
        Global.InGameView.ice.active = true;
        this.cacheCountTimeFreezee = new Date().getTime();
        this.setTimeOutFreezee = setTimeout(()=>{
            Global.InGameView.ice.active = false;
            this.isIce = false;
            require("FishCollection").getIns().EndIce(this.cacheCountTimeFreezee, new Date().getTime());
        },timeFreezee);
    },

    creatEffectWinMiniBoss(actor, pos, fishType, multi, value, fishPos){
        cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectWinMiniBoss', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectWinMiniBoss", (prefab)=>{
            if(this.inBackGround)
            return;
            let node = cc.instantiate(prefab);
            node.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
            node.getComponent("EffectWinMiniBoss").Init(actor, pos, fishType, multi, value, fishPos);
        });
    },

    creatEffectWinElectricFisht(actor, pos, fishType, parentEffect = false){
        this.node.runAction(cc.sequence(cc.delayTime(0) , cc.callFunc(()=>{
            cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectWinElectricFish', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectWinElectricFish", (prefab)=>{
                try{
                if(this.inBackGround)
                    return;
                actor.winSpecial = cc.instantiate(prefab);
                Global.Helper.GetFishBigIcon(fishType, actor.winSpecial.children[0].children[0].getComponent(cc.Sprite));
                if(parentEffect) {
                    actor.winSpecial.parent = Global.InGameManager.EffectContainer;
                } else {
                    actor.winSpecial.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                }
                actor.winSpecial.setPosition(cc.v2(0,0));
                actor.winSpecial.scale = 0;
                actor.winSpecial.getComponent(cc.Animation).play();
                actor.winSpecial.getComponentInChildren("TextJackpot").reset();
                let action1 = cc.scaleTo(0.5, 1, 1);
                let action2 = cc.moveTo(0.5 , pos);
                let action3 = cc.scaleTo(0.5, 0.6, 0.6);
                actor.winSpecial.runAction(cc.sequence(action1 , action2 , action3));
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        })));
    },
    SetValueWinElectric(actor, winValue, isDetroy = false) {
        if(actor.winSpecial != null) {
            actor.winSpecial.getComponentInChildren("TextJackpot").StartIncreaseTo(winValue);
            if(isDetroy) {
                this.scheduleOnce(()=>{              
                    if(actor.winSpecial != null) {
                        actor.winSpecial.destroy();
                        actor.winSpecial = null;
                    }
                } , 2.5);
            }
        }  
    },

    createEffectWinSpecialFishPopup(actor, pos, fishType, parentEffect = false){
        this.node.runAction(cc.sequence(cc.delayTime(0) , cc.callFunc(()=>{
            cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectWinElectricFish', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectWinElectricFish", (prefab)=>{
                try
                {
                if(this.inBackGround)
                    return;
                actor.winSpecial = cc.instantiate(prefab);
                Global.Helper.GetFishBigIcon(fishType, actor.winSpecial.children[0].children[0].getComponent(cc.Sprite));
                if(parentEffect) {
                    actor.winSpecial.parent = Global.InGameManager.EffectContainer;
                } else {
                    actor.winSpecial.parent = Global.InGameManager.FishPoolInstance.OtherContainer;
                }
                actor.winSpecial.setPosition(cc.v2(0,0));
                actor.winSpecial.scale = 0;
                actor.winSpecial.getComponent(cc.Animation).play();
                actor.winSpecial.getComponentInChildren("TextJackpot").reset();
                let action1 = cc.scaleTo(0.5, 1, 1);
                let action2 = cc.moveTo(0.5 , pos);
                let action3 = cc.scaleTo(0.5, 0.6, 0.6);
                actor.winSpecial.runAction(cc.sequence(action1 , action2 , action3));
                Global.InGameManager.InGameSoundManager.playCoinJumpSoundEffect();
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        })));
    },
    SetValueWinSpecialFishPopup(actor, winValue, isDetroy = false) {
        if(actor.winSpecial != null) {
            actor.winSpecial.getComponentInChildren("TextJackpot").StartIncreaseTo(winValue);
            if(isDetroy) {
                this.scheduleOnce(()=>{
                    if(actor.winSpecial != null) {
                        actor.winSpecial.destroy();
                        actor.winSpecial = null;
                    }
                } , 2.5);
            }
        }  
    },


    

    creatEffectStartJackpot(){
        cc.resources.load('SpinHub-Fish/Prefabs/Fish/EffectStartJackpot', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish","EffectStartJackpot", (prefab)=>{
            try{
            if(this.inBackGround)
                return;
            let node = cc.instantiate(prefab);
            Global.InGameManager.FishPoolInstance.OtherContainer.addChild(node);
            node.getComponent(cc.Animation).play();
            node.runAction(cc.sequence(cc.delayTime(4) , cc.callFunc(()=>{
                node.destroy();
            })));
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
    },

    creatEffectStartMiniBoss(fishType){
        let extend = "";
        if(fishType ==Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_2 || fishType ==Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_3) {
            extend = "_" + require("ScreenManager").getIns().roomType.toString();
        }
        let minValue = 0;
        let maxValue = 0;
        for(let i = 0; i < Global.GameConfig.ListFishConfig.length; i++) {
            if(Global.GameConfig.ListFishConfig[i].FishType == fishType) {
                minValue = Global.GameConfig.ListFishConfig[i].FishMultiMin;
                maxValue = Global.GameConfig.ListFishConfig[i].FishMultiMax;
                break;
            }
        }

        let self = this;
        cc.resources.load('SpinHub-Fish/Prefabs/Effects/StartMiniBoss', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/StartMiniBoss", (prefab)=>{
        try
        {
            if(self.inBackGround)
                return;
            let node = cc.instantiate(prefab);
            Global.InGameManager.FishPoolInstance.OtherContainer.addChild(node);
            node.setPosition(cc.v2(0, 200));

          
            cc.resources.load("SpinHub-Fish/Art/Fish/Fishing/Img/" + fishType + extend, cc.SpriteFrame, (err, pre) => {
                if (err) {
                    console.error('Failed to load sprite frame:', err);
                    return;
                }
            
                const spriteComponent = node.getChildByName("Icon").getComponent(cc.Sprite);
                spriteComponent.spriteFrame = pre;
            });
                //node.children[2].getComponent(cc.Label).string = "x"+minValue+"-x"+maxValue;

                node.getChildByName("LabelMulti").getComponent(cc.Label).string = "x"+minValue+"-x"+maxValue;;

            node.getComponent(cc.Animation).play("MiniBoss_Notification");

            self.scheduleOnce(()=>{
                node.destroy()
            }, 10);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }

        }); 
    },

    creatEffectStartKraken(delayTime = 0){
        this.scheduleOnce(()=>{
            cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectStartKraken', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectStartKraken", (prefab)=>{
                try
                {
                if(this.inBackGround)
                    return;
                let node = cc.instantiate(prefab);
                Global.InGameManager.FishPoolInstance.OtherContainer.addChild(node);
                node.getComponent(cc.Animation).play();
                node.runAction(cc.sequence(cc.delayTime(4) , cc.callFunc(()=>{
                    node.destroy();
                })));
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        }, delayTime);
    },

    creatEffectStartBlackDragon(delayTime = 0){
        this.scheduleOnce(()=>{
            cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectStartBlackDragon', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectStartBlackDragon", (prefab)=>{
                try
                {
                if(this.inBackGround)
                    return;
                let node = cc.instantiate(prefab);
                Global.InGameManager.FishPoolInstance.OtherContainer.addChild(node);
                node.getComponent(cc.Animation).play();
                node.runAction(cc.sequence(cc.delayTime(4) , cc.callFunc(()=>{
                    node.destroy();
                })));
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        }, delayTime);
    },

    creatEffectStartFrogFish(delayTime = 0){
        this.scheduleOnce(()=>{
           
            cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectStartFrogFish', cc.Prefab, function (err, prefab) {      
            //lobal.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectStartFrogFish", (prefab)=>{
                try
                {
                if(this.inBackGround)
                    return;
                let node = cc.instantiate(prefab);
                Global.InGameManager.FishPoolInstance.OtherContainer.addChild(node);
                node.getComponent(cc.Animation).play();
                node.runAction(cc.sequence(cc.delayTime(4) , cc.callFunc(()=>{
                    node.destroy();
                })));
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        }, delayTime);
    },

    creatEffectStartGodJackpot(delayTime = 0){
        this.scheduleOnce(()=>{
           
            cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectStartGodJackpot', cc.Prefab, function (err, prefab) {      
            //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectStartGodJackpot", (prefab)=>{
                try{
                if(this.inBackGround)
                    return;
                let node = cc.instantiate(prefab);
                Global.InGameManager.FishPoolInstance.OtherContainer.addChild(node);
                node.getComponent(cc.Animation).play();
                node.runAction(cc.sequence(cc.delayTime(8) , cc.callFunc(()=>{
                    node.destroy();
                })));
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        }, delayTime);
    },

    creatEffectStartLaze(parent){
        cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectStartLaze', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectStartLaze", (prefab)=>{
            try
            {
            if(this.inBackGround)
                return;
            let node = cc.instantiate(prefab);
            node.parent = parent;
            node.setPosition(cc.v2(0,0));
            node.getComponent(cc.Animation).play();
            node.runAction(cc.sequence(cc.delayTime(1) , cc.callFunc(()=>{
                node.destroy();
            })));
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
    },

    createEffectLaze(parent, killActor) {
        cc.resources.load('SpinHub-Fish/Prefabs/Effects/EffectLaze', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/EffectLaze", (prefab)=>{
            try
            {
            if(this.inBackGround)
                return;
            let node = cc.instantiate(prefab);
            node.parent = parent;
            node.setPosition(cc.v2(0,0));
            node.active = false;
            killActor.gun.cacheBullet = node.getComponent("BulletSpecial");
           
            console.log(killActor.gun.cacheBullet);
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
        cc.resources.load('SpinHub-Fish/Prefabs/Effects/LazeCollider', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadLocalPrefab("Prefabs/Effects/LazeCollider", (prefab)=>{
            try{
            if(this.inBackGround)
                return;
            let node = cc.instantiate(prefab);
            node.active = false;
            node.parent = parent;
            node.setPosition(cc.v2(0,0));
            killActor.lazeCollider = node.getComponent("GetFishCollider");
            killActor.lazeCollider.Init(killActor);
        }
        catch(e)
        {
            cc.log("ERROR: "+e);
        }
        });
    },

    creatEffectLighting (listFishShock, event) {
        let self = this;
        if(listFishShock.length > 1) {
            let listLine = [];
            for(let i = 1; i < listFishShock.length - 1; i++) {
                cc.resources.load('SpinHub-Fish/Prefabs/Fish/LightingLine', cc.Prefab, function (err, prefab) {      
                //Global.DownloadManager.LoadPrefab("Fish","LightingLine", (prefab)=>{
                    try
                    {
                    if(self.inBackGround)
                        return;
                    let node = cc.instantiate(prefab);
                    listLine[listLine.length] = node;
                    let effectLight = listFishShock[0].node.getPosition();
                    let touch = listFishShock[i+1].node.getPosition();
                    Global.InGameManager.ShockContainer.addChild(node);
                    
                    let direction = cc.v2(touch.x - effectLight.x , touch.y - effectLight.y);
                    node.setPosition(effectLight);
                    node.angle = Math.atan2(direction.x , direction.y) * -180 /   Math.PI;
                    node.height = effectLight.sub(touch).mag();

                    self.scheduleOnce(()=>{
                        node.destroy();
                    } , 1); 
                    }
                    catch(e)
                    {
                        cc.log("ERROR: "+e);
                    }
                });
            }
           
            let listBall = [];
            for(let i = 0; i < listFishShock.length; i++) {
                cc.resources.load('SpinHub-Fish/Prefabs/Fish/LightingBall', cc.Prefab, function (err, prefab) {      
                //Global.DownloadManager.LoadPrefab("Fish","LightingBall", (prefab)=>{
                    try
                    {
                    if(self.inBackGround)
                        return;
                    let node = cc.instantiate(prefab);
                    listBall[listBall.length] = node;
                    Global.InGameManager.ShockContainer.addChild(node);
                    node.setPosition(listFishShock[i].node.getPosition());

                    self.scheduleOnce(()=>{
                        node.destroy();
                    } , 1); 
                    }
                    catch(e)
                    {
                        cc.log("ERROR: "+e);
                    }
                });
            }
        
            self.scheduleOnce(()=>{
                event();
            } , 1); 
        } else {
            event();
        }
        
    },

    createResultSammurai(level){
        cc.resources.load('SpinHub-Fish/Prefabs/Fish/ResultSammurai', cc.Prefab, function (err, prefab) {      
        //Global.DownloadManager.LoadPrefab("Fish","ResultSammurai", (prefab)=>{
            try{
            if(this.inBackGround)
                return;
            let node = cc.instantiate(prefab);
            node.parent = Global.SammuraiController.node;
            node.setPosition(cc.v2(0,0));

            node.children[2].getComponent(cc.Label).string = "x"+minValue+"-x"+maxValue;
            node.runAction(cc.sequence(cc.moveTo(2, cc.v2(cc.winSize.width/2-250, 100)), cc.delayTime(5), cc.moveTo(2, cc.v2(cc.winSize.width/2+500, 100)), cc.delayTime(2) , cc.callFunc(()=>{
                node.destroy();
            })));
            }
            catch(e)
            {
                cc.log("ERROR: "+e);
            }
        });
    },

    PinListFish(listFish) {
        if(this.inBackGround)
            return;
        this.EffectContainer.active = true;
        for(let i = 0; i < listFish.length; i++) {
            listFish[i].node.parent = this.EffectContainer;
        }
        this.EffectContainer.runAction(cc.sequence(cc.delayTime(2) , cc.callFunc(()=>{
            this.EffectContainer.active = false;
        })));
    },
    

    onEvent(){
        
        this.node.on(cc.Node.EventType.TOUCH_START , this.onTouchStart , this );
        
        if(cc.sys.isMobile){
            this.node.on(cc.Node.EventType.TOUCH_MOVE , this.onTouchMove , this );
        }else{
            this.node.on(cc.Node.EventType.MOUSE_MOVE , this.onMouseHover , this );
        }
        this.node.on(cc.Node.EventType.TOUCH_END , this.onTouchEnd , this );
    },
    offEvent(){
      
        this.isAtack = false;
        this.node.off(cc.Node.EventType.TOUCH_START , this.onTouchStart , this );
        this.node.off(cc.Node.EventType.TOUCH_MOVE , this.onTouchMove , this );
        this.node.off(cc.Node.EventType.MOUSE_MOVE , this.onMouseHover , this );
        this.node.off(cc.Node.EventType.TOUCH_END , this.onTouchEnd , this );
    },

    onMouseHover(touch){
    
        if(Global.GameLogic == null)
            return;
        let v2Touch = cc.v2(touch.getLocation()).subSelf(cc.v2(this.offsetX  , this.offsetY ));
        var diff =   v2Touch.subSelf(Global.GameLogic.mainActor.gun.node.getPosition());
        var angle = Math.atan2( diff.x , diff.y) * 180 /   Math.PI;
        Global.GameLogic.mainActor.gun.node.angle = -angle;

    },
    onTouchMove(touch){  
      
        let v2Touch = cc.v2(touch.getLocation()).subSelf(cc.v2(this.offsetX  , this.offsetY ));
        var diff = v2Touch.subSelf(Global.GameLogic.mainActor.gun.node.getPosition());
        var angle = Math.atan2( diff.x , diff.y) * 180 /   Math.PI;
        Global.GameLogic.mainActor.gun.node.angle =  -angle;
    },
    onTouchStart(touch){

        let v2Touch = cc.v2(touch.getLocation()).subSelf(cc.v2(this.offsetX  , this.offsetY ));
        var diff =   v2Touch.subSelf(Global.GameLogic.mainActor.gun.node.getPosition());
        var angle = Math.atan2( diff.x , diff.y) * 180 /   Math.PI;
        Global.GameLogic.mainActor.gun.node.angle =  -angle;
       
         this.isTouch = true; 
    
    },
    onTouchEnd(touch){
      
       this.isTouch = false; 
        this.timeCountShoot = this.timeDelay;
        this.timeCheckTouch = 0;
    },

    onEventUsingTarget(){
        this.attackTarget = true;
        this.node.on(cc.Node.EventType.TOUCH_START , this.onTouchStartUsingTarget , this );
    },
    offEventUsingTarget(){
        this.attackTarget = false;
        this.node.off(cc.Node.EventType.TOUCH_START , this.onTouchStartUsingTarget , this );
    },
    onTouchStartUsingTarget(touch){
       try
       {
        
            let v2Touch = cc.v2(touch.getLocation());
            let children = [];
            let c1 = this.FishPoolInstance.FishType1Container.children;
            let c2 = this.FishPoolInstance.FishType2Container.children;
            let c3 = this.FishPoolInstance.FishType3Container.children;
            let c4 = this.FishPoolInstance.FishType4Container.children;
            let c5 = this.FishPoolInstance.FishType5Container.children;
          
            for(let i = 0; i < c1.length; i++) {
                children.push(c1[i]);
            }
            for(let i = 0; i < c2.length; i++) {
                children.push(c2[i]);
            }
            for(let i = 0; i < c3.length; i++) {
                children.push(c3[i]);
            }
            for(let i = 0; i < c4.length; i++) {
                children.push(c4[i]);
            }
            for(let i = 0; i < c5.length; i++) {
                children.push(c5[i]);
            }
            let length = children.length;
   
            for(let i = length - 1 ; i>=0 ; i--){
                let node = children[i];
                if(node.getBoundingBoxToWorld().contains(v2Touch)){
                    this.fishTarget = node.getComponent("Fish");
                    if(this.fishTarget == null) {
                        let content = node.children[1];
                        for(let j = 0; j < content.children.length; j++) {
                            let nodeK = content.children[j];
                            if(nodeK.getBoundingBoxToWorld().contains(v2Touch) && nodeK.activeInHierarchy){
                                this.fishTarget = nodeK.getComponent("Fish");
                            }
                        }
                        // this.fishTarget = node.parent.parent.getComponent("Fish");
                    }
                        
                    if(this.fishTarget != null) {                
                        
                            Global.GameLogic.mainActor.LockFishTargetUI(this.fishTarget);
                        break;
                    }
                }
            }
        }
        catch(e)
        {
            cc.log("ERROR: "+e);
        }
        
        
    },

    Handle_InitBeSungAnimation()
    {
        for(let i = 0;i< this.listBeSung.length;i++)
        {
            this.listBeSung_Waiting[i].active = true;
            this.listBeSung_Waiting[i].getComponent(cc.Animation).play("BeSung_Waiting_Animation");
            this.listBeSung[i].active = false;
        }
    },
  
    Handle_ShowBesungWaitingAnimation(sittingId)
    {        
       let index =  require("ActorCollection").getIns().GetIndexActorBySittingId(sittingId,Global.GameLogic.mainActor.actorPropertis.SittingId);
       this.listBeSung_Waiting[index].active = true;
       this.listBeSung_Waiting[index].getComponent(cc.Animation).play("BeSung_Waiting_Animation");
       this.listBeSung[index].active = false;
    },

    Handle_ShowBesungAnimation(indexActor)
    {     
        this.listBeSung_Waiting[indexActor].active = false;
        this.listBeSung[indexActor].active = true;
        this.listBeSung[indexActor].getComponent(cc.Animation).play("BeSung_Animation");    
    },

  


    update (dt) {
       
        this.timeCountFishNumber += dt;
        if(this.timeCountFishNumber > 5) {  
            this.timeCountFishNumber = 0;
            this.numberFishInScene = require("FishCollection").getIns().GetListFishIdInScene (cc.winSize.width/2, 350).length;
            
        }
        if(this.isShake ){
            if(this && this.background) {
                this.background.x = (Global.RandomNumber(-15 , 16));
                this.background.y = (Global.RandomNumber(-15 , 16));
               
            }
        }

        // click shooting
        if(this.isAtack) {
        
            this.timeCheckTouch += dt;
            if(this.timeCheckTouch > 0.25) {
             
                this.timeCheckTouch = 0;
                if(this.fishTarget == null)
                {
                
                  return;
                }
                Global.GameLogic.mainActor.MyGun.Handle_AutoForcus_TargetFish(this.fishTarget);     
                Global.GameLogic.mainActor.Handle_Shooting();              
                return;
            } 
        }
        this.timeUpdate += dt;
        if(this.timeUpdate < this.timeCountShoot) return;
        if(this.isTouch){
            this.timeUpdate = 0; 
          
            Global.GameLogic.mainActor.Handle_Shooting();             
        }     
    },

    GetRandomNickname()
    {

    }

   
});
