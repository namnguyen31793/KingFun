

cc.Class({
    extends: cc.Component,

    properties: {
        lbpopup : cc.Label,
        btnClose : cc.Node,
    },

    show(text, action, action2, showClose = false) {
        if(this.node == null)
            return;
        this.node.active = true;
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.btnClose.active = showClose;
        this.lbpopup.string = text;
        this.action = action;
        this.action2 = action2;
    },

    ClickAccept() {
        if(this.action != null) {
            this.action();
            this.action = null;
            this.action2 = null;
        }
        this.hide();
    },

    hide() {
        if(this.action2 != null) {
            this.action2();
        }
        this.node.active = false;
        this.action = null;
        this.action2 = null;
    },

    onDestroy(){
		Global.PopupLily = null;
	},
});
