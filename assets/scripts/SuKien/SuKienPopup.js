// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        KetQua_Content : require('KetQuaContent'),
        SuKien_Content : require('SuKienContent'),
    },
    onLoad()
    {
        this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
    },
    onEnable()
    {
        this.resetContent();
        this.SuKien_Content.node.active = true;
    },

    resetContent()
    {
        this.KetQua_Content.node.active = false;
        this.SuKien_Content.node.active = false;
    },

    onClick_KetQuaContent()
    {
        this.resetContent();
        this.KetQua_Content.node.active = true;
    },
    onClick_SuKienContent()
    {
        this.resetContent();
        this.SuKien_Content.node.active = true;
    },
    onClick_Close()
    {
        this.node.active = false;
    }
});
