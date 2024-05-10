// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       bg : cc.Node,
       rank_Lb : cc.Label,
       rank_Skeleton : sp.Skeleton,
       rank_Sprite : cc.Node,
       displayName_Lb : cc.Label,
       rewardMoney_Lb : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    show(index,displayName,rewardMoney)
    {   
       // cc.log("Show: index:"+index+ " - displayName: "+displayName + " - rewardMoney: "+rewardMoney);
        this.rank_Skeleton.node.active = false;
        this.rank_Sprite.active = false;
        this.displayName_Lb.string = displayName;
        this.rewardMoney_Lb.string = cc.Tool.getInstance().formatMoneyNumberWithColom(rewardMoney);
        this.bg.active = ((index+1)%2);
        this.rank_Lb.string = index;
        switch(index)
        {
            case 1: 
                this.rank_Skeleton.node.active = true;
                this.rank_Skeleton.setAnimation(0,'Rank1',true);
                break;
            case 2: 
                this.rank_Skeleton.node.active = true;
                this.rank_Skeleton.setAnimation(0,'Rank2',true);
                break;
            case 3: 
            this.rank_Sprite.active = true;
                break;
        }
    },

    start () {

    },

    // update (dt) {},
});
