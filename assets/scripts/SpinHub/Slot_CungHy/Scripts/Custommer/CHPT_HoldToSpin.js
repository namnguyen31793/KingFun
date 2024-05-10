// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends:  require("HoldToSpin_V2"),

    properties: {
        spinView: require("SpinViewBase_V2"),
        SpinArrow : cc.Node,
        SpinSkeleton : sp.Skeleton,
    },

    update: function (dt) {
        if (this.holdStart) {
            this.holdTime += dt;
            if (this.sendEventHold === false && this.holdTime >= 1) {
                this.sendEventHold = true;
                this.eventHold();
            }
        }
    },
    TouchStart: function () {
        this.holdStart = true;
        this.holdTime = 0;
        this.sendEventHold = false;
    },

    TouchCancel: function () {
        
        this.holdStart = false;
        this.sendEventHold = false;
        this.callSpin();
    },

    TouchEnd: function () {
        this.holdStart = false;
        this.sendEventHold = false;
        this.callSpin();
    },
    callSpin: function () {
        cc.log("Call Spin");
        if (this.holdTime < 1) {
           
            if(this.isStart)
            {
               this.cancelAutoSpin();
                return;
            }
          
            if (!this.spinView.isSpining) {    
                this.stopAuto();            
                this.spinView.onClick_Spin();
                this.ShowAnimation_Spining();
            }
        }
    },
    eventHold: function () {
        this.startAuto();
        this.spinView.onClick_AutoSpin();
        this.ShowAnimation_Spining();
    },
    cancelAutoSpin()
    {
        require("CHPT_SpinController").getIns().activeButtonAutoSpin(false);
        this.stopAuto();
        this.ShowAnimation_Stop();
        this.spinView.onClick_AutoSpin();
        //this.spinView.onClick_AutoSpin();
    },

    ShowAnimation_Spining()
    {
        this.SpinArrow.active = false;
        this.SpinSkeleton.node.active = true;
        this.SpinSkeleton.setAnimation(0,'anim_IdleRed(NoAnim)',true);
    },

    ShowAnimation_Stop()
    {
        if(this.isStart)
         return;
        this.SpinArrow.active = true;
        this.SpinSkeleton.node.active = true;
        this.SpinSkeleton.setAnimation(0,'anim_IdleGreen(NoAnim)',true);
    },
    ShowAnimation_Hold()
    {
        this.SpinSkeleton.setAnimation(0,'anim_Hover',true);
    },

    ShowAnimation_Disable()
    {
        if(this.isStart)
         return;
        this.SpinArrow.active = false;
        this.SpinSkeleton.node.active = true;
        this.SpinSkeleton.setAnimation(0,'anim_Disable',true);
    },

});
