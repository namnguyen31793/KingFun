// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Dice_Content : cc.Node,
        XucXac_Animation : cc.Animation,
        BatUp : cc.Node,
        Dice_1: cc.Sprite,
        Dice_2: cc.Sprite,
        Dice_3: cc.Sprite,
        Dice_SpriteFrame : [cc.SpriteFrame],
        nodeBowl: cc.Node,
        Bow_Animation : cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable()
    {
       this.ResetEffect();
    },
    onLoad () {
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetResultManager(this);
        this.lastData = null;
        this.rootPasBowl = this.nodeBowl.position;
    },

    start () {

    },
    ResetEffect()
    {
        this.XucXac_Animation.node.active = false;
        this.Dice_Content.active = false;
        this.nodeBowl.active = false;
        this.nodeBowl.position = this.rootPasBowl;
    },

    ShowResult(data)
    {
        cc.log("ShowResult");
        cc.log(data);
        this.lastData = data;
        this.XucXac_Animation.node.active = true;

        this.Bow_Animation.play("miniXocDia_BowRungLac");
        let self = this;
        let callBack = ()=>{      
            self.XucXac_Animation.off("finished" , callBack);
            self.ShowDiceResult();
           }
           this.XucXac_Animation.on("finished" ,callBack );
           this.XucXac_Animation.play("miniXocDia_XucXac");
    },

    ShowDiceResult()
    {
        let dice_1 = parseInt(this.lastData.Result.Dice1);
        let dice_2 = parseInt(this.lastData.Result.Dice2);
        let dice_3 = parseInt(this.lastData.Result.Dice3);

       this.Dice_1.spriteFrame = this.Dice_SpriteFrame[dice_1 - 1];
       this.Dice_2.spriteFrame = this.Dice_SpriteFrame[dice_2 - 1];
       this.Dice_3.spriteFrame = this.Dice_SpriteFrame[dice_3 - 1];

        this.Dice_Content.active = true;
        this.XucXac_Animation.node.active = false;

        if(this.gameController.GetNanStatus())
        {
            this.nodeBowl.active = true;
            this.nodeBowl.position = this.rootPasBowl;
        }
        

    },
    getIsBowl() {
        return this.nodeBowl.active;
      },

    Enable_Bowl(enable)
    {
        this.nodeBowl.active = enable;
    },



    // update (dt) {},
});
