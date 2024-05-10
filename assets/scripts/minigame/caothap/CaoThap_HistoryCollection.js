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
        this.itemCollection = [];
    },

    properties: {
       history_Item : cc.Node,
       content : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    show(playDes)
    {
        if(playDes == null || playDes == '')
            return;
        this.clearAllItem();
        let itemArray = playDes.split(',');
        for(let i=0;i< itemArray.length;i++)
        {
            let itemValueString = itemArray[i];
            if(itemValueString == '')
                continue;
            let infoArray = itemValueString.split('-');
            let itemValue = parseInt(infoArray[0]);
            let inputType = parseInt(infoArray[1]);
            let item = cc.instantiate(this.history_Item);
            item.getComponent("CaoThap_HistoryItem").show(itemValue,inputType);
            item.parent = this.content;
            this.itemCollection.push(item);
        }
    },

    clearAllItem()
    {
        if(this.itemCollection == null)
            return;
        for(let i=0;i< this.itemCollection.length;i++)
        {
            this.itemCollection[i].destroy();
        }
        this.itemCollection = [];
    },
    

    start () {

    },

    // update (dt) {},
});
