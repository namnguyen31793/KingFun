

cc.Class({
    extends: require("Fish2D"),

    ctor(){
        this.timeAnimation = 6;
    },

    properties: {
        listPositionStart : [cc.Vec2],
        listAngleStart : [cc.Integer],
    },

    SetSpeedAnimationByMove(speed){
        
    },

    SetupRoadList(){
        this.totalDuration = this.listPositionStart.length * this.timeAnimation;
    },

    UpdatePositionByTime(currentTime)
    {
        let  indexRoad = 0;
        let startFishTime = currentTime;
        currentTime = currentTime % this.totalDuration;
        for (let i = 0; i < this.listPositionStart.length; i++)
        {
            if (currentTime - this.timeAnimation >= 0)
            {
                currentTime -= this.timeAnimation;
            }
            else
            {
                indexRoad = i;
                break;
            }
        }
        if (this.currentFishStatus == 5) // 5 la trang thai fish chay ra khoi man hinh
        {
            if (this.currentRoadIndex != indexRoad)
            {
                this.reoveFishNoEffect();
            }
        }
        this.currentRoadIndex = indexRoad;

        // this.animation[0].play();
        this.animation[0].setCurrentTime(currentTime);
        
        this.img.scaleX = Math.abs(this.img.scaleX) * this.vectorDireciton.x;
        this.img.scaleY = Math.abs(this.img.scaleY) * this.vectorDireciton.y;
        if((this.vectorDireciton.x * this.vectorDireciton.y) == 1) {
            this.node.angle = this.listAngleStart[indexRoad];
        } else {
            this.node.angle = 360 - this.listAngleStart[indexRoad];
        }
        let pos = cc.v2(this.vectorDireciton.x * this.listPositionStart[indexRoad].x, this.vectorDireciton.y * this.listPositionStart[indexRoad.y]);
        return pos;
    },

    onLoad() {
        this.listColider = this.img.getComponentsInChildren(cc.BoxCollider);
        this.animation = this.getComponentsInChildren(cc.Animation);
        for(let i = 0; i < this.animation.length; i++)
            this.animationState[i] = this.animation[i].play();
        this.timeAnimation = this.animationState[0].duration;
    },
    Handle_CullingMask()
    {
        return;
    }

});
