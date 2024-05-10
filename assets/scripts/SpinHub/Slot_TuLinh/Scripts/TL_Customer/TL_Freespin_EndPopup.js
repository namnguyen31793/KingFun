// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        BigWinReward_Lb : cc.LabelIncrement,
        Coin_Content : cc.Node,
        Blur_Backgroud : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable()
    {
       // this.Coin_Content.active = false;
    },
    // onLoad () {},

    start () {

    },  

    EndPopup_Setup(bigwinType,bigWinReward,showTime = 7,callback = null)
    {
        let color = new cc.Color(0, 0, 0);
        switch(bigwinType)
        {
            case 1:
                color = new cc.Color(27,163, 0);
               
                break;
            case 2:
                color = new cc.Color(255, 173, 0);
                break;
            case 3:
                color = new cc.Color(255, 0, 0);
                break;
            case 4:
                color = new cc.Color(11, 0, 255);
                break;
        }
        this.Blur_Backgroud.color = color;
        
        this.BigWinReward_Lb.tweenValueto(bigWinReward);

        this.scheduleOnce(()=>{
            this.node.active = false;
            if(callback != null)
                callback();
        },showTime);
    },

  
});
