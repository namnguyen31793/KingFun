// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor(){
        this.currentIndex = 0;
    },

    properties: {
        infoTabs : {
            default : [],
            type : cc.Node,
        },
    },

    onNextButtonClicked() {
       // this.hideTab(this.currentIndex);
        this.hideAllTable();
        this.currentIndex = (this.currentIndex + 1) % this.infoTabs.length;
        this.showTab(this.currentIndex);
    },

    onBackButtonClicked() {
       // this.hideTab(this.currentIndex);
        this.hideAllTable();
        this.currentIndex = (this.currentIndex - 1 + this.infoTabs.length) % this.infoTabs.length;
        this.showTab(this.currentIndex);
    },

    onCloseButtonClicked() {
        // this.hideTab(this.currentIndex);
        this.node.active = false;
        cc.log("onCloseButtonClicked");
     },

    hideTab(index) {
        this.infoTabs[index].active = false;  
    },
    hideAllTable()
    {
        for (let i = 0; i < this.infoTabs.length; i++) {
            this.hideTab(i);
        }

    },

    showTab(index) {
        cc.log("Index : "+index);
        this.infoTabs[index].active = true;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.currentIndex = 0;
        this.hideAllTable();
        this.showTab(this.currentIndex);
    },

    // update (dt) {},
});
