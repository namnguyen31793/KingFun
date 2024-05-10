cc.Class({
    extends: cc.Component,

    properties: {
        icon : cc.Node,
        lbName : cc.Label,
        lbMoney : cc.Label,
    },

    Init(name, money) {
        this.node.active = true;
        this.lbName.string = name;
        this.lbMoney.string = money;
    },
});
