cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotControl = null;
    },

    properties: {
        toggleAudio : cc.Toggle,
        objAudio : cc.Node,
        toggleMusic : cc.Toggle,
        objMusic : cc.Node,
    },

    CheckInfo() {
        let isMusic = cc.sys.localStorage.getItem("Sttt-Music-123465") || 1;
        if(isMusic > 0) {
            this.toggleMusic.isChecked = true;
            if(this.objMusic)
                this.objMusic.active = false;
        } else {
            this.toggleMusic.isChecked = false;
            if(this.objMusic)
                this.objMusic.active = true;
        }
        this.ClickMusic(this.toggleMusic, null);
        let isAudio = cc.sys.localStorage.getItem("Sttt-Sound-123465") || 1;
        if(isAudio > 0) {
            this.toggleAudio.isChecked = true;
            if(this.objAudio)
                this.objAudio.active = false;
        } else {
            this.toggleAudio.isChecked = false;
            if(this.objAudio)
                this.objAudio.active = true;
        }
        this.ClickAudio(this.toggleAudio, null);
    },

    Init(slotControl){
        this.slotControl = slotControl;
        this.CheckInfo();
    },

    ClickMusic(toggle, data) {
        this.slotControl.ChangeStateMusic(toggle.isChecked);
        if(this.objMusic)
                this.objMusic.active = !toggle.isChecked;
    },

    ClickAudio(toggle, data) {
        this.slotControl.ChangeStateSound(toggle.isChecked);
        if(this.objAudio)
            this.objAudio.active = !toggle.isChecked;
    },
    
    ShowRank(){
        this.slotControl.slotMenu.ClickShowRank();
        this.Hide();
    },

    ShowHistory(){
        this.slotControl.slotMenu.ClickShowHistory();
        this.Hide();
    },

    Hide(){
        this.node.active = false;
    },
});
