// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        animPlane : cc.Animation,
        nodePlane: cc.Node,
        planeSkeleton : sp.Skeleton,
        laserSkeleton : sp.Skeleton,
        tauDichNode : cc.Node,
        chart : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isStartGame = false;
        this.index = 0;
        this.timeLaserMin = 3;
        this.timeLaserMax = 5;
        this.angleNe = 10;
        this.nameAnim = "_fly";
        this.callback = null;
        this.isFlying = true;
        this.planeStatus = cc.PlaneState.IDLE;
        this.planeFlyAudioID = -1;
        this.isLoadingPlaneFlyAudio = false;
        this.audioController =  require("AudioController_V2").getIns();
    },

    start () {
        var t = this;
        this.planeSkeleton.setCompleteListener(function(e) {
            var i = e.animation ? e.animation.name : "";
            "ne" === i && t.planeSkeleton.setAnimation(0, "speed", !0),
            "no" === i && (t.planeSkeleton.node.active = !1,
            t.chart.runAction(cc.sequence(cc.delayTime(.25), cc.fadeTo(.25, 1))))
        }),
        this.animPlane.on("finished", function() {
            t.animPlane.play("loop").time = 0,
            t.isFlying = !1
        });
    },

    startGame(t, e) {
        void 0 === e && (e = null),
        this.callback = e,
        this.isStartGame = true,
        this.setPlaneStatus(cc.PlaneState.FLY),
        t ? this.animPlane.play("fly", .7) : this.animPlane.play("fly", 0)
    },
    resetAllObject() {
        var t = this;
        this.node.stopAllActions(),
        this.node.runAction(cc.sequence(cc.callFunc(function() {
            t.animPlane.play("fly").time = 0
        }), cc.delayTime(.02), cc.callFunc(function() {
            t.animPlane.stop()
        }))),
        this.chart.opacity = 255,
        this.isFlying = !0
    },
    endGame() {
        var t = this;
        this.unscheduleAllCallbacks(),
        this.isStartGame = !1,
        this.isFlying = !0,
        this.animPlane.stop(),
        this.node.stopAllActions(),
        this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
            t.animPlane.play("fly").time = 0
        }), cc.delayTime(.02), cc.callFunc(function() {
            t.animPlane.stop()
        }))),
        this.setPlaneStatus(cc.PlaneState.DIE)
    },
    setPlaneStatus(t) {
        var e = this;
        switch (this.planeStatus = t,
        t) {
        case cc.PlaneState.DIE:
            this.stopEffectLoop(),
            this.laserSkeleton.node.active || (this.laserSkeleton.node.active = !0),
            this.setLaserDirection(!1),
           // r.default.getInstance().playEffect("Sounds/Aviator/SFX/Laser"),
            this.audioController.audioPool.playLaser();
            this.laserSkeleton.setAnimation(0, "laser", !1),
            this.unscheduleAllCallbacks(),
            this.scheduleOnce(function() {
                e.planeSkeleton.setAnimation(0, "no", !1),
                e.stopEffectLoop(),
                e.audioController.audioPool.playShip_Explode();
            //    r.default.getInstance().playEffect("Sounds/Aviator/SFX/Ship_Explode")
            }, .2);
            break;
        case cc.PlaneState.IDLE:
            this.planeSkeleton.node.active || (this.planeSkeleton.node.active = !0),
            this.stopEffectLoop(),
            this.unscheduleAllCallbacks(),
            this.planeSkeleton.setAnimation(0, "idle", !0);
            break;
        case cc.PlaneState.NE:
            this.planeSkeleton.setAnimation(0, "ne", !1);
            break;
        case cc.PlaneState.FLY:
            this.planeSkeleton.node.active || (this.planeSkeleton.node.active = !0),
            255 != this.chart.opacity && (this.chart.opacity = 255),
            this.planeSkeleton.setAnimation(0, "speed", !0),
            this.unscheduleAllCallbacks(),
            this.scheduleOnce(function() {
                e.randomMissLaser()
            }, 1.5)
        }
    },
    randomMissLaser() {
        var t = this
          , e = this.getRandomArbitrary(this.timeLaserMin, this.timeLaserMax);
        this.scheduleOnce(function() {
            t.isFlying || (t.setLaserDirection(!0),
            t.laserSkeleton.node.active || (t.laserSkeleton.node.active = !0),
            t.audioController.audioPool.playLaser(),
           // r.default.getInstance().playEffect("Sounds/Aviator/SFX/Laser"),
            t.laserSkeleton.setAnimation(0, "laser", !1),
            t.setPlaneStatus(cc.PlaneState.NE)),
            t.randomMissLaser()
        }, e)
    },
    setLaserDirection(t) {
        var e = this.node.parent.convertToNodeSpaceAR(this.nodePlane.convertToWorldSpaceAR(cc.Vec2.ZERO)).sub(this.tauDichNode.position).normalize()
          , i = cc.v2(0, 1).signAngle(e) * cc.macro.DEG;
        //this.tauDichNode.angle = t ? i - 2 : i + 2
    },
    playEffectWhenLoadDoneLoop(t, e) {
        null !== t && void 0 !== t || (this.planeFlyAudioID = cc.audioEngine.playEffect(e, !0))
    },
    stopEffectLoop() {
        return;
        -1 !== this.planeFlyAudioID && (cc.audioEngine.stopEffect(this.planeFlyAudioID),
        this.planeFlyAudioID = -1,
        this.isLoadingPlaneFlyAudio = !1)
    },
    checkAndPlayPlaneFlySound(t) {
        r.default.getInstance().isLostFocus || (t ? this.planeStatus != a.FLY || -1 != this.planeFlyAudioID || this.isLoadingPlaneFlyAudio || (this.isLoadingPlaneFlyAudio = !0,
        cc.loader.loadRes("Sounds/Aviator/SFX/TauChinh_DangBay_1", cc.AudioClip, this.playEffectWhenLoadDoneLoop.bind(this))) : this.stopEffectLoop())
    },
    onDestroy() {
        this.stopEffectLoop()
    },
    getRandomArbitrary(t, e) {
        return Math.random() * (e - t) + t
    }
    
    
    

    // update (dt) {},
});
