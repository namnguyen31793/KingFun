// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Item_Collection : [cc.Node],
    },

   
    onEnable()
    {
        this.ResetInfo();
    },
    Mini_MuaBieuTuong_Setup(specialID)
    {   
        this.ResetInfo();
        this.Item_Collection[specialID - 1].active = true;
    },

    ResetInfo()
    {
        for(let i=0;i< this.Item_Collection.length;i++)
        {
            this.Item_Collection[i].active = false;
        }
    }
    
});
