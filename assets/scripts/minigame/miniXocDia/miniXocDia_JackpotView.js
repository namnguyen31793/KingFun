// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        flyCoin_Particle : cc.ParticleSystem,
        Username : cc.Label,
        JackpotLuckyNumber : cc.Label,
        Jackpot_Lb : cc.LabelIncrement,
        Jackpot_Skeleton : sp.Skeleton,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Jackpot_Lb.setValue(0);
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetJackpotView(this);
        this.ResetEffect();
    },
    onEnable()
    {
        this.ResetEffect();
    },
    ResetEffect()
    {
        this.Username.node.active = false;
        this.flyCoin_Particle.resetSystem();
        this.flyCoin_Particle.node.active = false;
        this.Jackpot_Lb.node.active = true;
        this.JackpotLuckyNumber.node.active = false;
        this.Jackpot_Skeleton.node.active = false;
    },

    start () {

    },

    setJackpotValue(jackpotAmount)
    {
        this.Jackpot_Lb.tweenValueto(jackpotAmount);
    },

    showJackpotAlert(data)
    {
        cc.log("showJackpotAlert");
        cc.log(data);
        let jackpotNumber = data[0];
        let username = data[1];
        this.Username.string = username;
        this.JackpotLuckyNumber.string = "Mã may mắn: "+jackpotNumber;
        this.Jackpot_Skeleton.node.active = true;
        this.Jackpot_Lb.node.active = false;
        this.flyCoin_Particle.node.active = true;
        this.Username.node.active = true;
        this.flyCoin_Particle.resetSystem();
    }


    // update (dt) {},
});
