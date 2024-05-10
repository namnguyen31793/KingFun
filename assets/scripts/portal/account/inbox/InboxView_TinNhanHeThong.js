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
        this.parent = null;
    },
    properties: {
        Item_Node : cc.Node,
        Content : cc.Node,
    },

    Setup(tinnhan_Array,responseData,parent)
    {

        this.responseData = responseData;
        this.ClearContent();
        this.parent = parent;
        for(let i=0;i<tinnhan_Array.length;i++)
            {
                var nodeView = cc.instantiate(this.Item_Node);
                nodeView.parent = this.Content;
                nodeView.getComponent("InboxItem").initItem(tinnhan_Array[i],this);
                this.itemCollection.push(nodeView);
            }
    },

    start () {

    },

    ClearContent()
    {
        for(let i=0;i< this.itemCollection.length;i++)
        {
            this.itemCollection[i].destroy();
        }
    },
    inboxSetContent(title, desc)
    {
        this.parent.inboxSetContent(title, desc);
    }
});
