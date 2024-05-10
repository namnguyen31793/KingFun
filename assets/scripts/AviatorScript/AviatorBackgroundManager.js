// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.satellite = [];
        this.plannet = [];
        this.backgrounds = [];
        this.backgroundPlanets = [];
        this.maxSpeed = 15;
        this.accel = 5;
        this.currentSpeed = 0;
        this.totalScrolling = 0;
        this.previousX = 0;
        this.backgroundWidth = 1119;
        this.deltaTime = 0;
        this.allBackgroundWidth = 0;
        this.currentIndex = 0;
        this.maxStarInit = 50;
       
    },

    properties: {
        nodeToMove : cc.Node,
        backgrounds : [cc.Node],
        backgroundPlanets : [cc.Node],
        starTemplate : cc.Node,
        starNodeContainer : cc.Node,
        satellite : [require('AviatorOrbit2D')],
        plannet : [require('Avia_Plane')],
       
    },

    initStars : function() {
        for (var t = 0; t < this.maxStarInit; t++) {
            var e = cc.instantiate(this.starTemplate);
            e.parent = this.starNodeContainer,
            e.active = !0
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    circulateBGs : function() {
        for (; this.totalScrolling >= this.backgroundWidth; ) {
            var t = this.backgrounds[this.currentIndex]
              , e = this.backgroundPlanets[this.currentIndex]
              , i = t.position.x;
            i += this.backgroundWidth * this.backgrounds.length,
            t.setPosition(new cc.Vec3(i,0,0)),
            e.setPosition(new cc.Vec3(e.position.x + this.backgroundWidth * this.backgrounds.length,0,0)),
            this.currentIndex = (this.currentIndex + 1) % this.backgrounds.length,
            this.totalScrolling = this.totalScrolling - this.backgroundWidth
        }
    },
    

    update (t) {
        this.deltaTime = t >= .0167 ? .0167 : t,
        
                this.currentSpeed < this.maxSpeed && (this.currentSpeed += this.accel * this.deltaTime),
                this.nodeToMove.setPosition(this.nodeToMove.position.x - this.currentSpeed * this.deltaTime, 0),
                this.previousX != this.nodeToMove.position.x && (this.totalScrolling += Math.abs(this.previousX - this.nodeToMove.position.x),
                this.previousX = this.nodeToMove.position.x),
                this.circulateBGs(),
            
                this.satellite.forEach(function(e) {
                    e.onUpdate(t)
                }),
                this.plannet.forEach(function(e) {
                    e.onUpdate(t)
                })
    },
});
