// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        HorseCharacter : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.HorseCharacter_Animation = this.HorseCharacter.getComponent("sp.Skeleton");
    },

    ShowAnimation_HorseStartGo()
    {
        this.HorseCharacter_Animation.setAnimation(0,"anim-nguachay-kiemsat",true);
        cc.log("HorseCharacter POS: "+this.HorseCharacter.getPosition());
    },
    ShowAnimation_HorseXuongNgua()
    {
        this.HorseCharacter_Animation.setAnimation(0,"anim-xuongngua-kiemsat",false);
    },
    ShowAnimation_HorseIdle_KiemSat()
    {
        this.HorseCharacter_Animation.setAnimation(0,"anim-idle-main-kiemsat",true);
    },
    ShowAnimation_HorseIdle_KiemGo()
    {
        this.HorseCharacter_Animation.setAnimation(0,"anim-idle-main-kiemsat",true);
    },
});
