// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       Scroll_KetQua_TriAn : cc.Node,
       Scroll_KetQua_TaiXiu : cc.Node,
       Scroll_KetQua_DuaTop : cc.Node,
       Scroll_KetQua_TopHu : cc.Node,       
    },
    onEnable()
    {
        this.onClick_KetQua_TriAn();
    },

    resetAllScroll()
    {
        this.Scroll_KetQua_TriAn.active = false;
        this.Scroll_KetQua_TaiXiu.active = false;
        this.Scroll_KetQua_DuaTop.active = false;
        this.Scroll_KetQua_TopHu.active = false;
    },

    onClick_KetQua_TriAn()
    {
        this.resetAllScroll();
        this.Scroll_KetQua_TriAn.active = true;
    },
    onClick_KetQua_TaiXiu()
    {
        this.resetAllScroll();
        this.Scroll_KetQua_TaiXiu.active = true;
    },
    onClick_KetQua_DuaTop()
    {
        this.resetAllScroll();
        this.Scroll_KetQua_DuaTop.active = true;
    },
    onClick_KetQua_TopHu()
    {
        this.resetAllScroll();
        this.Scroll_KetQua_TopHu.active = true;
    },
});
