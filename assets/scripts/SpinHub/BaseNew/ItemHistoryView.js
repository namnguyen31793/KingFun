cc.Class({
    extends: cc.Component,

    initItem(info) {   
        this.node.active = true;
        this.data = info;

        let date = new Date(info.LogTime);//new Date(info.CreatedTime);
        let listCp = this.getComponentsInChildren(cc.Label);
        listCp[0].string = "#"+date.getTime();
        listCp[1].string = Global.Helper.GetStringFullYear(date);
        listCp[2].string = Global.Helper.formatNumber(info.Bet);
        listCp[3].string = "243";
        listCp[4].string = Global.Helper.formatNumber(info.Reward);
    },

    initItem2(info, history) {   
        this.history = history;
        this.info = info;
        this.node.active = true;
        this.data = info;

        let date = new Date(info.LogTime);//new Date(info.CreatedTime);
        let listCp = this.getComponentsInChildren(cc.Label);
        listCp[0].string = "#"+date.getTime();
        listCp[1].string = Global.Helper.GetStringFullYear(date);
        listCp[2].string = Global.Helper.formatNumber(info.Bet);
        listCp[3].string = "243";
        listCp[4].string = Global.Helper.formatNumber(info.Reward);
    },

    showDetail(){
        if(this.history)
            this.history.ShowDetailTurn(this.info);
    },

    Clear(){
        let listCp = this.getComponentsInChildren(cc.Label);
        listCp[0].string = '';
        listCp[1].string  = '';
        listCp[2].string = '';
        listCp[3].string = '';
        listCp[4].string = '';
        this.node.active = false;
    },
});
