

cc.Class({
    extends: cc.Component,
    ctor() {
        this.state = 0;
        this.target = null;
        this.startPos = null;
        this.lastDistance = 0;
        this.killActor = null;
    },

    properties: {
        
    },

    Init(startPos, target) {
        this.target = target;
        this.startPos = startPos;
        this.node.setPosition(startPos);
        this.node.scaleY = 0;
        this.state = 1;
        
    },

    Move(dt) {
        let diff = this.target.node.getPosition().subSelf(this.node.getPosition());
        
        let angle = Math.atan2( diff.x , diff.y) * 180 /   Math.PI;
        this.node.angle = -angle;
        let vx = 900 * Math.sin(-this.node.angle * Math.PI / 180);
        let vy = 900 * Math.cos(-this.node.angle * Math.PI / 180);
        let x = this.node.x += vx*dt;
        let y = this.node.y += vy*dt;
        this.node.setPosition(cc.v2(x,y));
        let distance = diff.mag();
        if(distance < 20) {
            this.state = 3;
        }
        // this.lastDistance 
    },

    update(dt) {
        if(this.state == 1) {
            this.node.scaleY += dt * 3;
            if(this.node.scaleY >= 1) {
                this.node.scaleY = 1;
                this.state = 2;
            }
        }
        if(this.state == 3) {
            this.node.scaleY -= dt * 3;
            if(this.node.scaleY <= 0) {
                this.node.scaleY = 0;
                this.state = 4;
                Global.FishingGamePlayEffect.EndLighting(this.target, this.node);
            }
        }
        if(this.state == 1 || this.state == 2 || this.state == 3) {
            this.Move(dt);
        }
    },
});
