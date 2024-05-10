// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor()
    {
        this.isSelected = false;
    },
    properties: {
       Content_Node  : cc.Node,
       Treasure_Mask : cc.Node,
       Grow_Effect : cc.Animation,
       Treasure_Sprite : cc.Sprite,
       Treasure_Img: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    start () {
        this.SelectItem_Animation = this.node.getComponent(cc.Animation);
    },
    onEnable()
    {
        if(this.SelectItem_Animation == null)
            this.SelectItem_Animation = this.node.getComponent(cc.Animation);
        this.Grow_Effect.node.active = false;
        this.Treasure_Mask.active = true;
        this.Treasure_Sprite.node.active = false;
       this.ShowAnimation_Apper();
       this.Grow_Effect.node.color = new  cc.Color(0, 0, 0);
       this.node.opacity = 255;
       this.isSelected = false;
      
    },

    OnClick_SelectItem(jackpotType)
    {
        if(this.isSelected)
        return;
        this.isSelected = true;
        this.Treasure_Mask.active = true;
        this.Grow_Effect.node.active = false;
        this.Treasure_Sprite.spriteFrame = this.Treasure_Img[jackpotType-1];
        this.SetColor(jackpotType);

        let callBack = ()=>{
            this.SelectItem_Animation.off("finished" , callBack);
            this.Grow_Effect.node.active = true;
            this.Treasure_Mask.active = false;
            this.Treasure_Sprite.node.active = true;
        }
           this.SelectItem_Animation.on("finished" ,callBack );
           this.SelectItem_Animation.play("Bonus_SelectItem");
    },

    ShowAnimation_NotSelect()
    {
        var jackpotType = Math.floor(Math.random() * 4) + 1;
        this.Treasure_Mask.active = true;
        this.Grow_Effect.node.active = false;
        this.Treasure_Sprite.spriteFrame = this.Treasure_Img[jackpotType-1];
        //this.SetColor(jackpotType);
        this.node.opacity = 100;

        let callBack = ()=>{
            this.SelectItem_Animation.off("finished" , callBack);
            //this.Grow_Effect.node.active = true;
            this.Treasure_Mask.active = false;
            this.Treasure_Sprite.node.active = true;
        }
           this.SelectItem_Animation.on("finished" ,callBack );
           this.SelectItem_Animation.play("Bonus_SelectItem_NotSelect");
    },

    ShowAnimation_Apper()
    {
        this.SelectItem_Animation.play("Bonus_SelectItem_Start");
    },

    SetColor(jackpotType)
    {
        let color = new cc.Color(0, 0, 0);
        switch(jackpotType)
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
        this.Grow_Effect.node.color = color;
    }

    // update (dt) {},
});
