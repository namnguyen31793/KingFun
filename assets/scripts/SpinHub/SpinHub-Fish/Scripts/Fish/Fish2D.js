
var RoadProperties2D = require ("RoadProperties2D");
cc.Class({
    extends: require("Fish"),

    properties: {
        img : cc.Node,
    },

    Init(properties) {
        require("FishCollection").getIns().AddToTalFish();
        this.node.opacity = 255;
        this.node.scale = 1;
        this.FishProperties = properties;
        if(this.listColider) {
            for(let i = 0 ; i < this.listColider.length ; i++){
                this.listColider[i].enabled = true;
            }
        }
        this.currentFishStatus = 2;
        this.inRun = true;
        this.isDie = false;
        this.isPreDie = false;
        this.velocityBullet = null;
        if(cc.NetConfigNew.getInstance().CONFIG_GAME.MULTI_PLAYER) {
            this.FishProperties.NumberOfGroup = -1;
        } 
        if(this.lightingObj != null)
            this.lightingObj.active = false;
        try {
            this.vectorDireciton = Global.Helper.GetPositionSliceBySittingId(Global.GameLogic.mainActor.actorPropertis.SittingId , cc.v2(1,1));
            this.SetupRoadList();
            this.updateCurrentMoveTime();// - this.FishProperties.totalSkipTimeMinisecond / 1000 - this.FishProperties.skipTime;
            this.baseSpeed = require ("PathStore").getIns().BaseSpeedAnimationFish(this.FishProperties.FishType);
            this.setUpColider();
            this.RePlay();
            this.HandleFishMove (0);
            this.SetUpAnimation();
        } catch {
            
        }
    },

    SetUpAnimation() {
        if(this.FishProperties.FishType == Global.Enum.FISH_TYPE_CONFIG.FISH_BOOM_TYPE) {
            this.node.children[1].getComponent(cc.Animation).play("BoomNornal");
        }
    },

	SetupRoadList(){
        this.totalDuration = 0;
        this.roadPropertiesList.length = 0;
        let roadProperties = new RoadProperties2D();
        roadProperties.Setup(this, this.FishProperties.PathId, this.FishProperties.FishSpeed, this.FishProperties.Radius, this.vectorDireciton, 
            this.FishProperties.FishType, this.FishProperties.NumberOfGroup);
        this.roadPropertiesList.push(roadProperties);
        this.totalDuration += roadProperties.totalDuration;
    },
	
    HandleFishMove(deltaTime)
    {
        if(this.isBiBan)
        {
            this.delayBiBanCounter -= deltaTime;
            if(this.delayBiBanCounter < 0)
            {
                this.isBiBan = false;
                this.delayBiBanCounter = 0.2;             
            }
            return;
        }
        this.currentMoveTime += deltaTime;


        this.node.setPosition(this.UpdatePositionByTime(this.currentMoveTime));
    },

    

    setUpColider(){

    },

    biBan(){
        /*
        let acti1 = cc.tintTo(0.1 , 245 , 83 ,83);
        for(let i = 0 ; i < this.node.children.length ; i++){
            this.node.children[i].runAction(acti1.clone());
        }
        this.scheduleOnce(this.inter = ()=>{
            for(let i = 0 ; i < this.node.children.length ; i++){
                this.node.children[i].runAction( cc.tintTo(0.1 , 255,255,255));
            }
        } , 0.15)
        */
        this.Handle_BiBanLogic();
    },
    

    update (dt) {
        if(Global.InGameManager.isIce) return;
        if(!this.inRun) return;
        // if(this.currentFishStatus == 5){
        //     this.HandleFishMove(dt*2);
        // }else{
            this.HandleFishMove(dt);
            this.Handle_CullingMask();
        // }    
    },

    Handle_CullingMask()
    {
        if(this.img == null)
            return;
        const screenLeft = -400  
        const screenRight = 1500
        const screenBottom = -1000
        const screenTop = 1000


        let   objectWorldPosition = this.node.convertToWorldSpaceAR(this.img.getPosition());
        //let worldPosition = node.convertToWorldSpaceAR(cc.Vec2.ZERO);

        let objectInScreen =
        objectWorldPosition.x >= screenLeft &&
        objectWorldPosition.x <= screenRight &&
        objectWorldPosition.y >= screenBottom &&
        objectWorldPosition.y <= screenTop;

        // Ẩn hoặc hiển thị đối tượng dựa trên kết quả culling
        this.img.active = objectInScreen;
    }



});
