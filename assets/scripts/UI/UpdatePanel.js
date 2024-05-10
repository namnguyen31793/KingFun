module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        info: cc.Label,
        fileProgress: cc.ProgressBar,
        fileLabel: cc.Label,
        byteProgress: cc.ProgressBar,
        byteLabel: cc.Label,
        checkBtn: cc.Node,
        retryBtn: cc.Node,
        updateBtn: cc.Node
    },
    
    onLoad () {

    },

    closeClicked: function () {
        this.node.active = false;
    },
});
