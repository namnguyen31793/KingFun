cc.Class({
    extends: cc.Component,

    properties: {
        icon : cc.Sprite,
        lbMulti : require("TextJackpot"),
        lbValue : require("TextJackpot"),
        animHeso : cc.Animation,
        ske : sp.Skeleton,
        CoinJump : cc.AudioClip,
    },

    Init(actor, pos, fishType, multi, value, fishPos) {
        if(Global.InGameManager.inBackGround)
            return;

        this.node.setPosition(fishPos);
        this.node.scale = 0;
        this.lbMulti.reset();
        this.lbValue.reset();
        this.ske.node.active = false;
        let extend = "";
        if(fishType == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_2 || fishType == Global.Enum.FISH_TYPE_CONFIG.GOLDEN_FISHTYPE_3) {
            extend = "_" + require("ScreenManager").getIns().roomType.toString();
        }

        let current = this;
        
        cc.resources.load("Fish/Fishing/Img/Icon" + fishType + extend, cc.SpriteFrame, (err, pre) => {
            if(current != null && current.icon != null)
                current.icon.spriteFrame = pre;
        });

        let action1 = cc.scaleTo(0.5, 1, 1);
        let action2 = cc.moveTo(0.5 , pos);
        let action3 = cc.delayTime(1);
        let action4 = cc.callFunc(()=>{
           this.lbValue.StartIncreaseTo(value/multi);
           this.scheduleOnce(()=>{
                this.animHeso.play();
                this.lbMulti.StartIncreaseTo(multi, true, "x");
                this.scheduleOnce(()=>{
                    this.ske.node.active = true;
                    this.ske.setAnimation(0, 'active', false);
                    this.lbValue.StartIncreaseTo(value);
                    cc.audioEngine.playEffect(this.CoinJump, false);     
                    this.scheduleOnce(()=>{
                        actor.CreateScore(value);
                        
                        // Global.InGameManager.createScore(killedFish.node.getPosition(), value, Global.GameLogic.mainActor.actorPropertis.AccountId == this.killActor.actorPropertis.AccountId);
                        this.node.destroy();
                    } , 2);
                } , 1);
            } , 0.5);
        });
        this.node.runAction(cc.sequence(action1 , action2 , action3, action4));
    },
});
