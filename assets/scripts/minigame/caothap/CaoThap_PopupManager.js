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
        this.startPos = new cc.v2(0,275);
    },

    properties: {
       notification_Popup : require("CaoThap_Notification")
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.notification_Popup.node.active = false;
        this.gameController =  require("CaoThapGameController").getIns();
        this.gameController.setPopupManager(this);
    },

    start () {

    },

    showNotification(content)
    {
        this.notification_Popup.node.active = true;
        let endPos = cc.v2(this.startPos.x,this.startPos.y-25);
        let delayTime = 2;
        this.notification_Popup.showMessage(content);
        this.notification_Popup.node.setPosition(this.startPos.x,this.startPos.y);
        this.notification_Popup.node.opacity = 0;
        let self = this;
        this.notification_Popup.node.runAction(cc.sequence(cc.fadeIn(.2), cc.delayTime(delayTime), cc.fadeOut(.3), cc.delayTime(.05), cc.callFunc(function() {}))),
        this.notification_Popup.node.runAction(cc.sequence(cc.moveTo(.2, endPos), cc.delayTime(delayTime), cc.moveTo(.3, this.startPos), cc.callFunc(function() {
            self.notification_Popup.node.opacity = 0;
        })));
    }

    // update (dt) {},
});
