cc.Class({extends: cc.Component,
    properties: {
        multiplyList: {
            default: [],
            type:  require("NguLong_CustomSpriteDefine"), 
        },
        inlineNode: cc.Node,
        outlineNode: cc.Node,
        multiScale: 1.3,
    },
    
    findSpriteData: function(t) {
        return this.multiplyList.find(e => e.nameMulti === t.toString()) || null;
    },

    onLoad: function() {
        this.node.on("SHOW_MULTIPLY", this.showMultiply, this);
        this.node.on("RESET_MULTIPLY", this.fadeOutNumber, this);
        this.node.on("FAST_RESET_MULTIPLY", this.resetMultiply, this);
        this.node.on("FAST_TO_RESULT_MULTIPLY", this.fastToResult, this);
        this.node.on("RESUME_MULTIPLY", this.resumeMultiply, this);
    },

    onDisable: function() {
        this.resetMultiply();
    },

    fadeOutNumber: function(t = 1) {
        if (this.showResult === false && this.node.opacity !== 0) {
            this.inlineNode.stopAllActions();
            const e = this.node.gSlotDataStore.currentGameMode;
            let i = this.node.gSlotDataStore.playSession.extend.fgoi;
            i = i && e !== "normalGame" ? 4 : i;
            const o = [{ r: 255, g: 255, b: 255 }, { r: 255, g: 10, b: 0 }, { r: 34, g: 36, b: 51 }, { r: 174, g: 0, b: 211 }, { r: 0, g: 91, b: 255 }, { r: 63, g: 50, b: 6 }, { r: 21, g: 170, b: 0 }][fgoi - 1];
            this.inlineNode.color = new cc.Color(o.r, o.g, o.b);
            this.inlineNode.scale = this.multiScale;
            this.inlineNode.angle = 0;
            this.fadeTime = this.totalFadeTime = t;
        }
    },

    update: function(t) {
        if (this.fadeTime > 0) {
            this.fadeTime -= t;
            this.node.opacity -= t * (255 / this.totalFadeTime);
        }
    },

    resumeMultiply: function(t) {
        const e = this.findSpriteData(t);
        if (e) {
            const i = { r: 174, g: 0, b: 211 };
            this.inlineNode.getComponent(cc.Sprite).spriteFrame = e;
            this.outlineNode.getComponent(cc.Sprite).spriteFrame = e;
            this.inlineNode.color = new cc.Color(i.r, i.g, i.b);
            this.inlineNode.opacity = 255;
            this.inlineNode.scale = this.multiScale;
            this.inlineNode.angle = 0;
        }
    },

    playEffectMultiply: function(t, multi, currentGameMode, fgoi) {

        const data = this.findSpriteData(multi);
        if (data) {
            fgoi = currentGameMode !== "normalGame" ? 4 : fgoi;
            const s = [{ r: 174, g: 0, b: 211 }, { r: 174, g: 0, b: 211 }, { r: 174, g: 0, b: 211 }, { r: 174, g: 0, b: 211 }, { r: 174, g: 0, b: 211 }, { r: 174, g: 0, b: 211 }, { r: 174, g: 0, b: 211 }][fgoi - 1];
            this.inlineNode.getComponent(cc.Sprite).spriteFrame = data.spine;
            this.outlineNode.getComponent(cc.Sprite).spriteFrame = data.spineOut;
            this.inlineNode.color = new cc.Color(s.r, s.g, s.b);
            this.inlineNode.opacity = 255;
            this.inlineNode.angle = 270;
            this.isDisplayMultiply = true;
            t ? (this.inlineNode.scale = this.multiScale, this.inlineNode.angle = 0) : (this.tweenMul && this.tweenMul.stop(),
            this.tweenMul = cc.tween(this.inlineNode).to(0.5, { scale: this.multiScale + 0.3, angle: 0 })
                .to(0.15, { scale: this.multiScale })
                .delay(0.1)
                .call(() => {})
                .start());
        }
    },

    showMultiply: function(multi, e, currentGameMode, fgoi, i) {
        this.inlineNode.stopAllActions();
        this.resetMultiply();
        this.showResult = true;
        this.callBack = i;
        let delay = 0;
        if (multi === 2 || multi === 3) {
            delay = 1.25;
        } else if (multi > 3) {
            delay = 1.8;
        }
        //this.node.soundPlayer.playMultiplierRate(multi);
        this.inlineNode.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(() => {
            if (this.callBack) {
                this.callBack();
                this.callBack = null;
            }
        })));
        this.playEffectMultiply(e, multi, currentGameMode, fgoi);
    },

    fastToResult: function() {
        this.fadeTime = 0;
        this.inlineNode.stopAllActions();
        this.inlineNode.scale = this.multiScale;
        this.inlineNode.angle = 0;
        if (this.node.gSlotDataStore.lastEvent.nwm) {
            if (this.showResult) {
                this.inlineNode.opacity = 255;
            }
        } else {
            this.inlineNode.opacity = 0;
        }
        if (this.callBack) {
            this.callBack();
            this.callBack = null;
        }
    },

    resetMultiply: function() {
        this.tweenMul && this.tweenMul.stop();
        this.fadeTime = 0;
        this.inlineNode.stopAllActions();
        //this.node.soundPlayer.stopMultiplierRate();
        this.inlineNode.opacity = 0;
        this.inlineNode.angle = 0;
        this.inlineNode.scale = 0;
        this.isDisplayMultiply = false;
        this.inlineNode.getComponent(cc.Sprite).spriteFrame = null;
        this.outlineNode.getComponent(cc.Sprite).spriteFrame = null;
    }
});
