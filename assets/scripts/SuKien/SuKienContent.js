// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        ScrollView_Content : cc.Node,
        DetailContent : cc.Node,
        Detail_String : cc.Label,
    },
    onEnable()
    {
        this.ScrollView_Content.active = true;
        this.Detail_String.active = false;
    },

    onClick_ItemClick()
    {
        this.ScrollView_Content.active = false;
        this.DetailContent.active = true;
    },


    onClick_Detail_Back()
    {
        this.ScrollView_Content.active = true;
        this.DetailContent.active = false;
    }
});
