cc.Class({
    extends: cc.Component,
    ctor() {
        this.listNews = [];
        this.numberPageNews = 10;
        this.numberRowNews = 5;
        this.currentPageNews = 0;
        this.totalPageNews = 0;
        this.listEventView = [];
        this.listEventData = [];
        this.currentEventSelect = 0;
        this.listRowRankEvent = [];
    },

    properties: {
        detailObj : cc.Node,
        newsObj : cc.Node,
        eventObj : cc.Node,
        titleNews : cc.Label,
        descriptionNew : cc.Label,
        btnEvent : cc.Node,
        boxRankEvent : cc.Node,
        boxRuleEvent : cc.Node,
        tabRuleEvent : cc.Button,
        tabRankEvent : cc.Button,
        titleRuleEvent : cc.Label,
        descriptionEvent : cc.Label,
        rowRankView : cc.Node,
        currentRankView : cc.Node,
        noNewsObj : cc.Node,
        noEventObj : cc.Node,
        contentNews : cc.Node,
        newsView : cc.Node,
    },

    Init() {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        this.listEventView[this.listEventView.length] = this.btnEvent.getComponent(cc.Button);
        this.listRowRankEvent[this.listRowRankEvent.length] = this.rowRankView.getComponent("EventRankingView");
    },

    show(state) {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.Init();
        this.node.active = true;
        if (state == Global.Enum.STATE_EVENT.NEWS)
            this.ClickTabNews ();
        else if (state == Global.Enum.STATE_EVENT.EVENT)
            this.ClickTabEvent ();
    },

    ClickTabNews() {
        this.detailObj.active = false;
        this.newsObj.active = true;
        this.eventObj.active = false;
        this.noEventObj.active = false;
        this.noNewsObj.active = false;
        require("SendRequest").getIns().MST_Client_Get_News();
    },

    ClickTabEvent() {
        this.detailObj.active = false;
        this.newsObj.active = false;
        this.eventObj.active = true;
        this.noEventObj.active = false;
        this.noNewsObj.active = false;
        require("SendRequest").getIns().MST_Client_Get_Event_Config_Info();
    },

    //news
    GetNews(listNews) {
        cc.log(listNews);
        this.listNews = listNews;
        if (listNews.length == 0) {
            this.detailObj.active = false;
            this.newsObj.active = false;
            this.noNewsObj.active = true;
            return;
        }
        for (let i = 0; i < this.contentNews.children.length; i++) {
            this.contentNews.children[i].active = false;
        }
        for (let i = 0; i < this.listNews.length; i++) {
            if(i >= this.contentNews.children.length) {
                let trans = cc.instantiate(this.newsView);
                trans.parent = this.contentNews;
            }
            this.contentNews.children [i].active = true;
            this.contentNews.children [i].getComponentInChildren(cc.Label).string = this.listNews[i].Title;
            this.contentNews.children [i].getComponentInChildren(cc.Button).clickEvents[0].customEventData = i;
        }
    },

    ClickShowNews(event, index) {
        this.detailObj.active = true;
        this.newsObj.active = false;
        let currentIndexNews = parseInt(index);
        let newsData = this.listNews [currentIndexNews];
        this.titleNews.string = newsData.Title;
        this.descriptionNew.string = newsData.Content.replace ("\\n","\n");
    },

    SetStateButtonPage(currentPageNews) {
        this.currentPageNews = currentPageNews;
        if (currentPageNews == 0)
            this.previousPageBtnNews.active = false;
        else
            this.previousPageBtnNews.active = true;
        if (currentPageNews == this.totalPageNews - 1)
            this.nextPageBtnNews.active = false;
        else
            if(this.totalPageNews != 0)
                this.nextPageBtnNews.active = true;
            else this.nextPageBtnNews.active = false;
        //set button page
        for (let i = 0; i < this.listButtonPageNews.length; i++) {
            this.listButtonPageNews [i].interactable = true;
        }
        this.listButtonPageNews [this.currentPageNews].interactable = false;
    },

    ClickBackNews() {
        this.detailObj.active = false;
        this.newsObj.active = true;
    },

    //event
    GetListEventInfo(listEventData) {
        if (listEventData.length == 0) {
            this.eventObj.active = false;
            this.noEventObj.active = true;
            return;
        }
        this.listEventData = listEventData;
        for (let i = 0; i < this.listEventView.length; i++) {
            this.listEventView [i].node.active = false;
        }
        for (let i = 0; i < listEventData.length; i++) {
            if (i < this.listEventView.length) {
                this.listEventView [i].node.active = true;
                this.listEventView [i].getComponentInChildren(cc.Label).string = listEventData [i].EventName;
            } else {
                let eventTrans = cc.instantiate(this.btnEvent);
                eventTrans.active = true;
                eventTrans.parent = this.btnEvent.parent;
                eventTrans.getComponentInChildren(cc.Label).string = listEventData [i].EventName;
                this.listEventView[this.listEventView.length] = eventView.getComponent(cc.Button);
            }
        }
        for (let i = 0; i < this.listEventView.length; i++) {
            let index = i;
            this.listEventView [i].node.off(cc.Node.EventType.TOUCH_END , ()=>{
                this.SelectEvent(index);
            }, this);
            this.listEventView [i].node.on(cc.Node.EventType.TOUCH_END , ()=>{
                this.SelectEvent(index);
            }, this);
        }
        this.SelectEvent (0);
    },

    SelectEvent(index) {
        for (let i = 0; i < this.listEventView.length; i++) {
            if (index == i) {
                this.listEventView [i].interactable = false;
            } else {
                this.listEventView [i].interactable = true;
            }
        }
        this.currentEventSelect = index;
        this.ClickTabRuleEvent ();
    },
        
    ClickTabRankEvent() {
        this.boxRankEvent.active = true;
        this.boxRuleEvent.active = false;
        this.tabRankEvent.interactable = false;
        this.tabRuleEvent.interactable = true;
        let msgData = {};
        msgData[1] = this.listEventData [this.currentEventSelect].EventId;
        require("SendRequest").getIns().MST_Client_Top_Event(msgData);
    },

    ClickTabRuleEvent() {
        this.boxRankEvent.active = false;
        this.boxRuleEvent.active = true;
        this.tabRankEvent.interactable = true;
        this.tabRuleEvent.interactable = false;
        this.titleRuleEvent.string = this.listEventData[this.currentEventSelect].EventName;
        this.descriptionEvent.string = this.listEventData [this.currentEventSelect].Description.Replace ("\\n", "\n");
    },

    GetRankEvent(listData, currentData) {
        currentRankView.SetInfo (0, currentData.Order.toString(), currentData.NickName, Global.Helper.formatNumber(currentData.Point), true);
        for (let i = 0; i < this.listRowRankEvent.length; i++) {
            this.listRowRankEvent [i].node.active = false;
        }
        for (let i = 0; i < this.listData.length; i++) {
            if (i < this.listRowRankEvent.length) {
                this.listRowRankEvent [i].node.active = true;
                this.listRowRankEvent [i].SetInfo (i, listData[i].Order.toString(), listData[i].NickName, Global.Helper.formatNumber(listData[i].Point), false);
            } else {
                let eventTrans = cc.instantiate(this.rowRankView);
                eventTrans.active = true;
                eventTrans.parent = this.rowRankView.parent;
                let eventRankView = eventTrans.getComponent("EventRankingView");
                eventRankView.SetInfo (i, listData[i].Order.ToString(), listData[i].NickName, Global.Helper.formatNumber(listData[i].Point), false);
                this.listRowRankEvent[this.listRowRankEvent.length] = eventRankView;
            }
        }
    },

    Hide() {
        this.node.active = false;
        Global.UIManager.hideMark();
    },

    onDestroy(){
		Global.EventPopup = null;
	},
});
