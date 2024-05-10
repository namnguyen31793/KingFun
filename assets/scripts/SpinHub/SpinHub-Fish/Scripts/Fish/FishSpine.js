

cc.Class({
    extends: require("Fish2D"),

    properties: {
        ske : sp.Skeleton,
    },

    SetUpAnimation() {
        this.node.opacity = 255;
    },

   

    SetFishDieNoScore(){
        for(let i = 0 ; i < this.listColider.length ; i++){
            this.listColider[i].enabled = false;
        }
        this.inRun = false;
        this.isDie = true;
        this.SetSpeedAnimationByMove(5);
        let anim = this.node.getComponent(cc.Animation);
        if(anim != null) {
            let action = cc.callFunc(()=>{
                this.SetSpeedAnimationByMove(0);
                this.playAnimDie = true;
                anim.play();
                
            });
            this.node.runAction(cc.sequence(cc.delayTime(1.2), action));
        }
        else {
            this.SetSpeedAnimationByMove(8);
            this.node.runAction(cc.fadeOut(1.2));
        }
        this.scheduleOnce(()=>{
            this.reoveFishNoEffect();
        }, 2.1);
    },

    biBan(){
        let acti1 = cc.tintTo(0.1 , 245 , 83 ,83);
        this.ske.node.runAction(acti1.clone());
        this.scheduleOnce(this.inter = ()=>{
            this.ske.node.runAction( cc.tintTo(0.1 , 255,255,255));
        } , 0.15)
    },

    update (dt) {
        this._super(dt);
    },

    SetSpeedAnimationByMove(speed){
        this.ske.timeScale = speed;
    },

    RePlay() {
    },

    onLoad() {
        this.listColider = this.getComponents(cc.BoxCollider);   
    },

    Handle_CullingMask()
    {
        if(this.ske.node == null)  
            return;
        const screenLeft = -200  
        const screenRight = 1300
        const screenBottom = -700
        const screenTop = 700


        let   objectWorldPosition = this.node.convertToWorldSpaceAR(this.ske.node.getPosition());
        //let worldPosition = node.convertToWorldSpaceAR(cc.Vec2.ZERO);

        let objectInScreen =
        objectWorldPosition.x >= screenLeft &&
        objectWorldPosition.x <= screenRight &&
        objectWorldPosition.y >= screenBottom &&
        objectWorldPosition.y <= screenTop;

        // Ẩn hoặc hiển thị đối tượng dựa trên kết quả culling
        this.ske.node.active = objectInScreen;
    }
    
});
