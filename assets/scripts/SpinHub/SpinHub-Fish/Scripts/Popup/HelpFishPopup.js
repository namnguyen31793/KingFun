
cc.Class({
    extends: cc.Component,
    ctor() {
        this.gameID = 1;
    },

    properties: {
        listSpr_Help: [cc.SpriteFrame],
        listSpr_HelpMulti: [cc.SpriteFrame],
        sprHelp: cc.Sprite,
    },

    onLoad() {
        this.indexHelp = 0;
    },
    
	onDestroy(){
		Global.HelpFishNew = null;
	},

    show(gameID) {
		Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
        this.gameID = gameID;
        this.indexHelp = 0;
        if(this.gameID  == 3){
            this.sprHelp.spriteFrame = this.listSpr_HelpMulti[this.indexHelp];
        }else{
            this.sprHelp.spriteFrame = this.listSpr_Help[this.indexHelp];
        } 
    },

    onClickNext() {
        this.indexHelp++;
        if(this.gameID  == 3){
            if (this.indexHelp === this.listSpr_HelpMulti.length)
                this.indexHelp = 0;
            this.sprHelp.spriteFrame = this.listSpr_HelpMulti[this.indexHelp];
        }else{
            if (this.indexHelp === this.listSpr_Help.length)
                this.indexHelp = 0;
            this.sprHelp.spriteFrame = this.listSpr_Help[this.indexHelp];
        }
    },

    onClickBack() {
        this.indexHelp--;
        if(this.gameID  == 3){
            if (this.indexHelp < 0)
                this.indexHelp = 0;
            this.sprHelp.spriteFrame = this.listSpr_HelpMulti[this.indexHelp];
        }else{
            if(this.indexHelp < 0)
                this.indexHelp = 0;
            this.sprHelp.spriteFrame = this.listSpr_Help[this.indexHelp];
        }
    },

    onClose() {
		this.node.active = false;
		Global.UIManager.hideMark();
    },
});
