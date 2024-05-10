cc.Class({
    extends: cc.Component,

    properties: {
        lbMoney : require("TextJackpot"),
        anim : sp.Skeleton,
    },

    Init(jackpotValue, isMe, actor, pos) {
        
        if(isMe) {
            this.anim.node.scale = 1;
            this.node.setPosition(cc.v2(0,0))
        } else {
            this.anim.node.scale = 0.3;
            this.node.setPosition(pos);
        }
        this.anim.setAnimation(0, 'xuat hien', false);
        if(isMe) {
            this.scheduleOnce(()=>{
                this.anim.setAnimation(0, 'waiting', true);
            }, 0.5);
        }
        
        this.scheduleOnce(()=>{
            this.lbMoney.StartIncreaseTo(jackpotValue);
        }, 1);
        this.scheduleOnce(()=>{
            this.lbMoney.reset();
            actor.UpdateBalance(jackpotValue, true);
            this.anim.setAnimation(0, 'bien mat', false);
        }, 4);
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 4.7);
    },

    
});
