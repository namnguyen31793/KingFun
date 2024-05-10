

cc.Class({
    extends: cc.Component,
    ctor() {
        this.listTopJackpot = [];
        this.listBigWin = [];
        this.state = 0;//0-top jackpot, 1- big win
    },

    properties: {
        listItem : [require("ItemVinhDanh")],
        content : cc.Node,
    },

    InitInfo(listTopJackpot, listBigWin) {
        this.listTopJackpot = listTopJackpot;
        this.listBigWin = listBigWin;
        let list = [];
        if(this.state == 0)
            list = this.listTopJackpot;
        if(this.state == 1)
            list = this.listBigWin;
        for(let i = 0; i < this.listItem.length; i++)
            this.listItem[i].node.active = false;
        for(let i = 0; i < list.length; i++) {
            if(i >= 6)
                return;
            this.listItem[i].Init(list[i].NickName, list[i].TotalMoney);
        }
    },

    ClickTopJackpot() {
        this.state = 0;
        this.SendRequestTopJackpot ();
    },

    ClickTopBigWin() {
        this.state = 1;
        this.SendRequestTopJackpot ();
    },

    SendRequestTopJackpot() {
        require("SendRequest").getIns().MST_Client_Top_Rank_Take_Jackpot();
    },

    show() {
        this.content.active = !this.content.active;
    },

    hide() {
        this.content.active = false;
    },

    onLoad() {
        this.SendRequestTopJackpot ();
    },
});
