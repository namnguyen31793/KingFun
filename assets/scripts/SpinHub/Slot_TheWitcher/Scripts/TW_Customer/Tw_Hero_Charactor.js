// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Charactor_Animation = this.getComponent(sp.Skeleton);
    },

    ShowAnimation_Doi_KiemGo(callbackFunc = null)
    {
        this.Charactor_Animation.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'anim-doikiemgo') {
                if(callbackFunc != null)
                    callbackFunc();
             }
        });
       
        this.Charactor_Animation.setAnimation(0,'anim-doikiemgo',false);
    },

    ShowAnimation_Doi_KiemSat(callbackFunc = null)
    {
        this.Charactor_Animation.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'anim-doikiemsat') {
                if(callbackFunc != null)
                    callbackFunc();
             }
        });
       
        this.Charactor_Animation.setAnimation(0,'anim-doikiemsat',false);
    },

    ShowAnimation_Idle_KiemGo(callbackFunc = null)
    {
       
       
        this.Charactor_Animation.setAnimation(0,'anim-idle-main-kiemgo',true);
    },

    ShowAnimation_Idle_KiemSat(callbackFunc = null)
    {
        
        this.Charactor_Animation.setAnimation(0,'anim-idle-main-kiemsat',true);
    },

    ShowAnimation_NguaChay_KiemGo(callbackFunc = null)
    {
        this.Charactor_Animation.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'anim-nguachay-kiemgo') {
                if(callbackFunc != null)
                    callbackFunc();
             }
        });
       
        this.Charactor_Animation.setAnimation(0,'anim-nguachay-kiemgo',false);
    },

    ShowAnimation_NguaChay_KiemSat(callbackFunc = null)
    {
        this.Charactor_Animation.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'anim-nguachay-kiemsat') {
                if(callbackFunc != null)
                    callbackFunc();
             }
        });
       
        this.Charactor_Animation.setAnimation(0,'anim-nguachay-kiemsat',false);
    },
});
