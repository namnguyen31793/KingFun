
cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {

    },

    update (dt) {
        this.node.angle = -this.node.parent.angle;
        this.node.scale = this.node.parent.scale;
    },
});
