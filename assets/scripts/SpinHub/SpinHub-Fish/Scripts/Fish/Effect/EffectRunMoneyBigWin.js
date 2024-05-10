cc.Class({
    extends: cc.Component,
    ctor() {
        this.actor = null;
        this.index = 0;
    },

    properties: {
        anim : cc.Animation,
        lbValue : require("TextJackpot"),
        lbMulti : require("TextJackpot"),
    },

    show(pos, value, index, actor, multi) {
        this.index = index;
        this.actor = actor;
        this.node.active = true;
        this.node.setPosition(pos);
        this.lbValue.reset();
        this.lbMulti.reset();
        let x = [];
        let heso = 0;
        if(multi && multi > 1) {
            x[0] = parseInt(value/2);
            x[1] = value;
        } else {
            if(value < 10)
            heso = 1;
            else if(value < 20)
                heso = 1;
            else if(value < 40)
                heso = 2;
            else if(value < 100)
                heso = 10;
            else if(value < 1000) {
                heso = 50;
            } else if(value < 10000) {
                heso = 300;
            } else if(value < 100000) {
                heso = 3000;
            } else {
                heso = 30000;
            }
            x[0] = parseInt(value / 3 / heso) * heso;
            x[1] = parseInt(value * 2 / 3 / heso) * heso;
            x[2] = value;
        }
        for(let i = 0; i < x.length; i++) {
            this.scheduleOnce(()=>{
                let action1 = cc.callFunc(()=>{ this.lbValue.StartIncreaseTo(x[i])});
                let action2 = cc.delayTime(0.3);
                let action3 = cc.callFunc(()=>{ 
                    this.anim.scale = 2;
                    this.anim.play()});
                this.node.runAction(cc.sequence(action1 , action2 , action3));
            } , 0.6 * i);
        } 
        if(multi && multi > 1) {
            this.scheduleOnce(()=>{
                this.lbMulti.StartIncreaseTo(multi, true, "X");
            } , 1.5);
        }
    },

    end() {
        this.actor.listBigWin[this.index] = null;
    },

});
