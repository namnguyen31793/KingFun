

cc.Class({
    extends: cc.Component,

    properties: {
        textSpin : cc.Label,
        textGold : cc.Label,
        textContent : cc.Label,
    },

    Hide(){
		this.node.active = false;
		Global.UIManager.hideMark();
	},
	
	show(content, currentspin, coin){
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        this.textContent.strin = content;
        this.textSpin.string = Global.Helper.formatNumber(currentspin);
        this.textGold.string = Global.Helper.formatNumber(coin);
	},
	
	onDestroy(){
		Global.ServerRewardPopup = null;
	},
});
