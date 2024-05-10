// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

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
        bullet_VipList:[cc.Node],
        coinClone : cc.Node,
        listBulletSpecial:[cc.Node],
        snareUser : cc.Node,
        snareOther : cc.Node,
        score: cc.Node,
        effectBoom : cc.Node,
        effectBoomBig : cc.Node,
        effectShock : cc.Node,
        effectNo2 : cc.Node,
        effectBoom2 : cc.Node,       
        effectBigWin : cc.Node,
        effectOtherBigWin : cc.Node,
        luckyBoxWheelContainer : cc.Node,
        itemObject : cc.Node,
        FishType1Container : cc.Node,
        FishType2Container : cc.Node,
        FishType3Container : cc.Node,
        FishType4Container : cc.Node,
        FishType5Container : cc.Node,
        marUser : cc.Material,
        marOther : cc.Material,
        marChangeColor : cc.Material,
        EffectPlayerWinNoti : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    Init()
    {
    
        /*
        this.poolBulletUser = new cc.NodePool();
        this.poolBulletOther = new cc.NodePool();
        */

        this.poolEffectPlayerWin = new cc.NodePool();

        this.poolBullet_Vip0 = new cc.NodePool();
        this.poolBullet_Vip1 = new cc.NodePool();
        this.poolBullet_Vip2 = new cc.NodePool();
        this.poolBullet_Vip3 = new cc.NodePool();
        this.poolBullet_Vip4 = new cc.NodePool();
        this.poolBullet_Vip5 = new cc.NodePool();
        this.poolBullet_Vip6 = new cc.NodePool();
        this.poolBullet_Vip7 = new cc.NodePool();
        this.poolBullet_Vip8 = new cc.NodePool();
        this.poolBullet_Vip9 = new cc.NodePool();
        this.poolBullet_Vip10 = new cc.NodePool();
        this.poolBullet_Vip11 = new cc.NodePool();
        this.poolBullet_Vip12 = new cc.NodePool();


        this.poolB101 = new cc.NodePool();
        this.poolB102 = new cc.NodePool();
        this.poolB103 = new cc.NodePool();
        this.poolB104 = new cc.NodePool();
        this.poolSnareUser = new cc.NodePool();
        this.poolSnareOther = new cc.NodePool();
        this.poolSnare104 = new cc.NodePool();
        this.poolScore = new cc.NodePool();
        this.poolCoin = new cc.NodePool();
        this.poolEffectBoom = new cc.NodePool();
        this.poolEffectBoomBig = new cc.NodePool();
        this.poolEffectNo2 = new cc.NodePool();
        this.poolEffectBoomKraken = new cc.NodePool();
        this.poolShock = new cc.NodePool();
        this.poolBigWin = new cc.NodePool();
        this.poolOtherBigWin = new cc.NodePool();
        this.poolItem = new cc.NodePool();
        this.poolLevelUp = new cc.NodePool();
    },

     onDestroy() {      
        this.offEvent();
     

        this.poolBullet_Vip0.clear();
        this.poolBullet_Vip1.clear();
        this.poolBullet_Vip2.clear();
        this.poolBullet_Vip3.clear();
        this.poolBullet_Vip4.clear();
        this.poolBullet_Vip5.clear();
        this.poolBullet_Vip6.clear();
        this.poolBullet_Vip7.clear();
        this.poolBullet_Vip8.clear();
        this.poolBullet_Vip9.clear();
        this.poolBullet_Vip10.clear();
        this.poolBullet_Vip11.clear();
        this.poolBullet_Vip12.clear();

        this.poolB101.clear();
        this.poolB102.clear();
        this.poolB103.clear();
        this.poolB104.clear();
        this.poolSnareUser.clear();
        this.poolSnareOther.clear();
        this.poolSnare104.clear();
        this.poolScore.clear();
        this.poolCoin.clear();
        this.poolEffectBoom.clear();
        this.poolEffectBoomBig.clear();
        this.poolEffectNo2.clear();
        this.poolEffectBoomKraken.clear();
        this.poolShock.clear();
        this.poolBigWin.clear();
        this.poolOtherBigWin.clear();
        this.poolItem.clear();
        this.poolLevelUp.clear();
        this.poolEffectPlayerWin.clear();
    },

     offEvent(){
       
        this.node.off(cc.Node.EventType.TOUCH_START , this.onTouchStart , this );
        this.node.off(cc.Node.EventType.TOUCH_MOVE , this.onTouchMove , this );
        this.node.off(cc.Node.EventType.MOUSE_MOVE , this.onMouseHover , this );
        this.node.off(cc.Node.EventType.TOUCH_END , this.onTouchEnd , this );
    },
    checkInBackground()
    {
        return Global.InGameManager.inBackGround;
    },

    getBullet(type, vipId, isMe){
        let str = "";
        let indexBullet = vipId;
        let pool = null;
        let node = null;
        if(Global.isOffline) {
            indexBullet = type;
        }
        if(type < 100) {

          
           switch(vipId)
           {
            case 0: 
                pool = this.poolBullet_Vip0;
                str = "poolBullet_Vip0";             
                break;
            case 1: 
                pool = this.poolBullet_Vip1;
                str = "poolBullet_Vip1";
                break;
            case 2: 
                pool = this.poolBullet_Vip2;
                str = "poolBullet_Vip2";
                break;
            case 3: 
                pool = this.poolBullet_Vip3;
                str = "poolBullet_Vip3";
                break;
            case 4: 
                pool = this.poolBullet_Vip4;
                str = "poolBullet_Vip4";
                break;
            case 5: 
                pool = this.poolBullet_Vip5;
                str = "poolBullet_Vip5";
                break;
            case 6: 
                pool = this.poolBullet_Vip6;
                str = "poolBullet_Vip6";
                break;
            case 7: 
                pool = this.poolBullet_Vip7;
                str = "poolBullet_Vip7";
                break;
            case 8: 
                pool = this.poolBullet_Vip8;
                str = "poolBullet_Vip8";
                break;
            case 9: 
                pool = this.poolBullet_Vip9;
                str = "poolBullet_Vip9";
                break;
            case 10: 
                pool = this.poolBullet_Vip10;
                str = "poolBullet_Vip10";
                break;
            case 11: 
                pool = this.poolBullet_Vip11;
                str = "poolBullet_Vip11";
                break;
            case 12: 
                pool = this.poolBullet_Vip11;
                str = "poolBullet_Vip11";
                break;
            default :
                pool = this.poolBullet_Vip12;
                str = "poolBullet_Vip11";
                break;
           }

        }
        else
        { str = "poolB" + (type);
         pool = this[str];
        }
        if(pool.size() > 0){           
            node = pool.get();
        }else{
            if(type < 100) {     
                
                if(vipId == this.bullet_VipList.length ) 
                {
                    vipId = this.bullet_VipList.length - 1;  
                    /*    
                    cc.log(">>> BEFORE : "+vipId);
                    cc.log(">>> this.bullet_VipList.length : "+this.bullet_VipList.length);
                    */
                }             
                node = cc.instantiate(this.bullet_VipList[vipId]);
                
                        
            }
                // node = cc.instantiate(this.listBullet[indexBullet - 1]);
            else {
                node = cc.instantiate(this.listBulletSpecial[type - 101]);  
            }  
                
        }
        return node;
    },

    createScore(pos, value, isMain) {
        if(this.checkInBackground())
            return;
        let node = this.getScore();
        let lb = node.getComponentInChildren(cc.Label);
        if(isMain)
            lb.materials[0] = this.marUser;
        else lb.materials[0] = this.marOther;

		lb.string = Global.Helper.formatNumber2(value);
        node.setPosition(cc.v2(pos.x, pos.y + 60));
        this.ScoreContainer.addChild(node);
        node.active = true;
        let ani = node.getComponent(cc.Animation);
        let callBack = ()=>{
            this.poolScore.put(node);
         ani.off("finished" , callBack);
        }
        ani.on("finished" ,callBack );
        ani.play();
    },
    
    createScore2(pos, value, sittingId) {
        if(this.checkInBackground())
            return;
        let node = this.getScore();
        let isMain = sittingId == Global.GameLogic.mainActor.actorPropertis.SittingId;
        let lb = node.getComponentInChildren(cc.Label);
        if(isMain)
            lb.materials[0] = this.marUser;
        else lb.materials[0] = this.marOther;
        
		lb.string = "+"+Global.Helper.formatNumber2(value);
        node.setPosition(cc.v2(pos.x, pos.y));
        this.ScoreContainer.addChild(node);
        node.active = true;
        let ani = node.getComponent(cc.Animation);
        let callBack = ()=>{
            this.poolScore.put(node);
         ani.off("finished" , callBack);
        }
        ani.on("finished" ,callBack );
        if(sittingId == 2 || sittingId == 3)
            ani.play("Score2");
        else ani.play("Score3");
	},
	
	getScore(){
       let pool = this.poolScore;
       let node = null;
        if(pool.size() > 0){
            node = pool.get();
        }else{
            node = cc.instantiate(this.score);
        }
        return node;
    },

    createEffectPlayerWin(SittingId,Score)
    {
        if(Score == 0 || Score === null)
            return;
        let pool = this.poolEffectPlayerWin;
        let node = null;
         if(pool.size() > 0){
             node = pool.get();
         }else{
             node = cc.instantiate(this.EffectPlayerWinNoti);
         }
         node.active = true;
         this.OtherContainer.addChild(node);
        let effectPlayerWin = node.getComponent("EffectPlayerWinNoti");
        effectPlayerWin.WinNoti_Init(SittingId,Score);
    },  


    creatSnare(pos , gunType, isMe = true){
        if(this.checkInBackground())
            return;
        let node = this.getSnare(gunType, isMe);
        // if(isMe)
        //     node.getComponent(cc.Sprite).materials[0] = this.marUser;
        // else node.getComponent(cc.Sprite).materials[0] = this.marChangeColor;
        node.setPosition(pos);
        this.BulletContainer.addChild(node);
        node.active = true;
        let ani = node.getComponent(cc.Animation);
        let callBack = ()=>{
        //  let str = "poolSnare" + gunType;
        let str = "";
        if(isMe) {
            str = "poolSnareUser";
        } else {
            str = "poolSnareOther";
        }
         this[str].put(node);
         ani.off("finished" , callBack);
        }
        ani.on("finished" ,callBack );
        ani.play();
     },

     getSnare(type, isMe){
        // let str = "poolSnare" + (type);
        let str = "";
        if(isMe) {
            str = "poolSnareUser";
        } else {
            str = "poolSnareOther";
        }
       let pool = this[str];
       let node = null;
        if(pool.size() > 0){
            node = pool.get();
        }else{
            if(isMe) {
                node = cc.instantiate(this.snareUser);
            } else {
                node = cc.instantiate(this.snareOther);
            }
            // node = cc.instantiate(this.listSnare[type - 1]);
        }
        return node;
    },

    createItem(itemType, position, actor, amount){
      
        if(this.checkInBackground()) {
            let isMainPlayer = actor.actorPropertis.AccountId == Global.GameLogic.mainActor.actorPropertis.AccountId;
            if(actor != null && isMainPlayer) {
                require("BagController").getIns().TakeItem(itemType, amount);
                Global.GameLogic.mainActor.itemControl.UpdateInfo();
            }
            return;
        }
           
        let node = this.getItem();
        node.setPosition(position);
        if(itemType != Global.Enum.ITEM_TYPE.KEY_EVENT_SMALL_USER && itemType != Global.Enum.ITEM_TYPE.KEY_EVENT_BIG_USER) {
            node.getComponent(cc.Animation).play("ItemImage"+itemType);
        } else {
            let spr = node.getComponent(cc.Sprite);
            spr.spriteFrame = null;
            Global.DownloadManager.LoadAssest("GachaEvent",cc.SpriteFrame, itemType.toString(), (pre)=>{
                if(spr != null&& spr.materials != null)
                    spr.spriteFrame = pre;
                else {
                    console.log("-------------------eror-----------------");
                }
            });
        }
        this.OtherContainer.addChild(node);
        node.active = true;
        let vecMove = cc.v2(position.x, position.y + 30);
        let action1 = cc.moveTo(0.2 , vecMove);
        let action2 = cc.repeat( cc.sequence(cc.moveBy(0.1 , 0,20),cc.moveBy(0.1 , 0,-20)) , 2);
        let action3 = cc.moveTo(0.4 , actor.node.getPosition());
        let action4 = cc.callFunc(()=>{ 
            let isMainPlayer = actor.actorPropertis.AccountId == Global.GameLogic.mainActor.actorPropertis.AccountId;
            if(actor != null && isMainPlayer) {
                require("BagController").getIns().TakeItem(itemType, amount);
                Global.GameLogic.mainActor.itemControl.UpdateInfo();
                Global.InGameView.PlayEffectTakeItem (itemType);
            }
            this.poolItem.put(node);
        });
        node.runAction(cc.sequence(action1 , action2 , action3 , action4));
     },

    getItem(){
        let pool = this.poolItem;
        let node = null;
         if(pool.size() > 0){
             node = pool.get();
         }else{
             node = cc.instantiate(this.itemObject);
         }
         return node;
     },
  creatEffectLevelUp(){
        if(this.checkInBackground())
            return;
        let node =  this.getEffectLevelUp();
        if(node == null)
            return;
        this.OtherContainer.addChild(node);
        node.active = true;
        node.getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
        node.setPosition(cc.v2(0,0));
        node.runAction(cc.sequence(cc.delayTime(3) , cc.callFunc(()=>{
            this.poolLevelUp.put(node);
        })))
    },

    getEffectLevelUp(){
        let node = null;
        if(this.poolLevelUp.size() > 0){
            node = this.poolLevelUp.get();
            return node;
        }else{
            let current = this;
            Global.DownloadManager.LoadPrefab("Fish","lencap", (prefab)=>{
                try{
                let node = cc.instantiate(prefab);
                current.poolLevelUp.put(node);
                current.creatEffectLevelUp();
                }
                catch(e)
                {
                    cc.log("ERROR: "+e);
                }
            });
        }
    },

    creatEffectBoom(pos){
        if(this.checkInBackground())
            return;
        let node =  this.getEffectBoom();
        this.OtherContainer.addChild(node);
        node.active = true;
        node.getComponent(cc.Animation).play();
        node.setPosition(pos);
        node.runAction(cc.sequence(cc.delayTime(0.5) , cc.callFunc(()=>{
            this.poolEffectBoom.put(node);
        })))
    },

    getEffectBoom(){
        let node = null;
        if(this.poolEffectBoom.size() > 0){
            node = this.poolEffectBoom.get();
        }else{
            node = cc.instantiate(this.effectBoom);
        }
        return node;
    },

    creatEffectBoomKraken(pos){
        if(this.checkInBackground())
            return;
        let node =  this.getEffectBoomKraken();
        this.OtherContainer.addChild(node);
        node.active = true;
        node.setPosition(pos);
        let ani = node.getComponent(cc.Animation);
        let callBack = ()=>{
            this.poolEffectBoomKraken.put(node);
            ani.off("finished" , callBack);
        }
        ani.on("finished" ,callBack );
        ani.play();
    },

    getEffectBoomKraken(){
        let node = null;
        if(this.poolEffectBoomKraken.size() > 0){
            node = this.poolEffectBoomKraken.get();
        }else{
            node = cc.instantiate(this.effectBoomKraken);
        }
        return node;
    },

    creatEffectBigWin(pos, value, index, actor, multi){
        if(this.checkInBackground())
            return;
        let isMain = actor == Global.GameLogic.mainActor;
        let node = null;
        if(isMain)
            node = this.getEffectBigWin();
        else node = this.getEffectOtherBigWin();
        this.OtherContainer.addChild(node);
        node.active = true;
        node.getComponent("EffectRunMoneyBigWin").show(pos, value, index, actor, multi);
        node.runAction(cc.sequence(cc.delayTime(2.5) , cc.callFunc(()=>{
            node.getComponent("EffectRunMoneyBigWin").end();
            if(isMain)
                this.poolBigWin.put(node);
            else this.poolOtherBigWin.put(node);
            
        })))
        return node;
    },

    getEffectBigWin() {
        let node = null;
        if(this.poolBigWin.size() > 0){
            node = this.poolBigWin.get();
        }else{
            node = cc.instantiate(this.effectBigWin);
        }
        return node;
    },

    getEffectOtherBigWin() {
        let node = null;
        if(this.poolOtherBigWin.size() > 0){
            node = this.poolOtherBigWin.get();
        }else{
            node = cc.instantiate(this.effectOtherBigWin);
        }
        return node;
    },

    creatEffectBoomBig(pos){
        if(this.checkInBackground())
            return;
        let node = cc.instantiate(this.effectBoomBig);
        this.OtherContainer.addChild(node);
        node.active = true;
        // node.getComponent(cc.Animation).play();
        node.setPosition(pos);
        node.runAction(cc.sequence(cc.delayTime(1) , cc.callFunc(()=>{
            node.destroy();
        })))
    },

    getEffectBoomBig(){
        let node = null;
        if(this.poolEffectBoomBig.size() > 0){
            node = this.poolEffectBoomBig.get();
        }else{
            node = cc.instantiate(this.effectBoomBig);
        }
        return node;
    },

    creatEffectNo2(pos){
        if(this.checkInBackground())
            return;
        let boom = cc.instantiate(this.effectNo2);
        boom.active = true;
        this.OtherContainer.addChild(boom);
        boom.setPosition(pos);
        boom.runAction(cc.sequence(cc.delayTime(1) , cc.callFunc(()=>{
            boom.destroy();
        })))
    },

    creatEffectBoom2(pos){
        if(this.checkInBackground())
            return;
        let boom = cc.instantiate(this.effectBoom2);
        boom.active = true;
        this.OtherContainer.addChild(boom);
        boom.setPosition(pos);
        boom.runAction(cc.sequence(cc.delayTime(1) , cc.callFunc(()=>{
            boom.destroy();
        })))

    },

    creatCoint(actor, position, fishType, money, updateMoney = true){
        let isMain = Global.GameLogic.mainActor.actorPropertis.AccountId == actor.actorPropertis.AccountId;
        /*
        if(money >= 0) {
            if(this.checkInBackground()) {
                if(updateMoney)
                    actor.UpdateBalance(money);
                return;
            }
        }
        */
        let numberCoin = 3;
        if (fishType == Global.Enum.FISH_TYPE_CONFIG.MAMON_TYPE) {
            numberCoin = Global.RandomNumber (2, 3);
        } else if (fishType == Global.Enum.FISH_TYPE_CONFIG.BONUS_TYPE) {
            numberCoin = Global.RandomNumber (2, 3);
        } else if (fishType < Global.Enum.FISH_TYPE_CONFIG.JACKPOT_TYPE)
        {
            numberCoin = fishType + Global.RandomNumber (1, 3);
            numberCoin = parseInt((numberCoin * 0.4) + 1);
        } else if (fishType == Global.Enum.FISH_TYPE_CONFIG.KRAKEN_TYPE) {
            numberCoin = Global.RandomNumber (10, 15);
        }
        else {
            numberCoin = 30;
        }
        Global.AudioManager.PlayMoneySound();
        for(let i = 0 ; i < numberCoin ; i++){
            let coin = this.getCoin();
            if(isMain)
                coin.getComponent(cc.Sprite).materials[0] = this.marUser;
            else coin.getComponent(cc.Sprite).materials[0] = this.marOther;
            coin.active = true;
            coin.setPosition(position);
            this.CoinContainer.addChild(coin);
            let vecMove = cc.v2(position.x - (i - 1)*20 , position.y + 30);
            this.scheduleOnce(()=>{
                let action1 = cc.moveTo(0.1 , vecMove);
                let action2 = cc.repeat( cc.sequence(cc.moveBy(0.13 , 0,30),cc.moveBy(0.13 , 0,-30)) , 4);
                let action3 = cc.moveTo(0.5 , actor.GetPosMoney());
                let action4 = cc.callFunc(()=>{
                    this.poolCoin.put(coin);
                });
                coin.runAction(cc.sequence(action1 , action2 , action3 , action4));
            } , i*0.1);
            
        }
        /*
        if(money > 0) {
            this.scheduleOnce(()=>{
                if(updateMoney)
                    actor.UpdateBalance(money, true);
            } , numberCoin*0.1+1.5);
        }
        */
        
    },

    getCoin(){
        let node = null;
        if(this.poolCoin.size() > 0){
            node = this.poolCoin.get();
        }else{
            node = cc.instantiate(this.coinClone);
        }
        return node;
    },

    createShock(position){
        if(this.checkInBackground())
            return;
        let shock = this.getShock();
        shock.active = true;
        shock.setPosition(position);
        this.OtherContainer.addChild(shock);
        let ani = shock.getComponent(cc.Animation);
        let callBack = ()=>{
            this.poolShock.put(shock);
            ani.off("finished" , callBack);
        }
        ani.on("finished" ,callBack );
        ani.play();
    },

    getShock(){
        let node = null;
        if(this.poolShock.size() > 0){
            node = this.poolShock.get();
        }else{
            node = cc.instantiate(this.effectShock);
        }
        return node;
    },
 
    creatBullet(gunValue, point , huong , gunType, vipId, id , isMe = false, _targetId, accountId, parent = null){
       
        isMe =  cc.LoginController.getInstance().getUserId() == accountId;

        let node = this.getBullet(gunType, vipId, isMe);
        node.setPosition(point);
        node.angle = -huong;
        node.parent = this.BulletContainer;
        node.active = true;
        let bullet = null;
        bullet = node.getComponent("Bullet");
        bullet.Bullet_Init(gunValue, gunType, vipId, id , isMe, _targetId, accountId);          
       
        return bullet;
    },

    creatBullet_2(gunValue, point , huong , gunType, vipId, id , isMe = false, _targetId, accountId, parent = null){
        isMe =  cc.LoginController.getInstance().getUserId() == id;
        let node = this.getBullet(gunType, vipId, isMe);
        node.setPosition(point);
        node.angle = huong;
        node.parent = this.BulletContainer;
        node.active = true;
        let bullet = null;
        bullet = node.getComponent("Bullet");
        bullet.Bullet_Init(gunValue, gunType, vipId, id , isMe, _targetId, accountId);          
        return bullet;
    },

    createSpecialBullet(gunValue, point , huong , gunType, vipId, id , isMe = false, _targetId, accountId, parent ,fishValue)
    {
        isMe =  cc.LoginController.getInstance().getUserId() == id;
        let node = this.getBullet(gunType, vipId, isMe);
        node.setPosition(point);
        node.angle = -huong;
        node.parent = this.BulletContainer;
        node.active = true;
        let cp = null;
            node.parent = parent;
            node.setPosition(parent.getComponent("Gun").posBullet.getPosition());
            node.angle = 0;        
            cp = node.getComponent("BulletSpecial");
            cp.Init2(gunType, id , isMe, _targetId, 1.3,fishValue); 
        return cp;
    },

    createSpecialBullet_DrillMulti(gunValue, point , huong , gunType, vipId, id , isMe = false, _targetId, accountId, position ,fishValue)
    {
        isMe =  cc.LoginController.getInstance().getUserId() == id;
        let node = this.getBullet(gunType, vipId, isMe);
        node.setPosition(point);
        node.angle = -huong;
        node.parent = this.BulletContainer;
        node.active = true;
        let cp = null;       
            node.setPosition(position);
            //node.angle = 0;        
            cp = node.getComponent("Bullet_MultiDrill");
            cp.Init_MultiDrill(gunType, id , isMe, _targetId, 2,fishValue); 
        return cp;
    },

    RestoreBullet(vipId,node)
    {
        /*
        if(this.vipId) {
            Global.InGameManager.FishPoolInstance["poolBulletUser"].put(this.node);
        } else {
            Global.InGameManager.FishPoolInstance["poolBulletOther"].put(this.node);
        }
        */
      
       switch(vipId)
       {
        case 0:
            this.poolBullet_Vip0.put(node);
            break;
        case 1:
            this.poolBullet_Vip1.put(node);
            break;
        case 2:
            this.poolBullet_Vip2.put(node);
            break;
        case 3:
            this.poolBullet_Vip3.put(node);
            break;  
        case 4:
            this.poolBullet_Vip4.put(node);
            break;
        case 5:
            this.poolBullet_Vip5.put(node);
            break;
        case 6:
            this.poolBullet_Vip6.put(node);
            break;
        case 7:
            this.poolBullet_Vip7.put(node);
            break;
        case 8:
            this.poolBullet_Vip8.put(node);
            break;
        case 9:
            this.poolBullet_Vip9.put(node);
            break;
        case 10:
            this.poolBullet_Vip10.put(node);
            break;
        case 11:
            this.poolBullet_Vip11.put(node);
            break;
        case 12:
            this.poolBullet_Vip12.put(node);        
            break;
       }
    },

    RestorePlayerWinEffect(node)
    {
        this.poolEffectPlayerWin.put(node);
    }
    // update (dt) {},
});
