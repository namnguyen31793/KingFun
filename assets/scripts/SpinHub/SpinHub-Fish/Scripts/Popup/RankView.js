cc.Class({
    extends: cc.Component,

    properties: {
        listRank : {
			default : [],
			type : require("RankElement")
		}, 
    },

   ShowRank(){
        this.node.active = true;
        for(let i = 0; i < this.listRank.length; i++){
            this.listRank[i].ClearElement();
        }
        require("SendRequest").getIns().MST_Client_Get_Top_Score();
   },

   SetData(listData){
        for(let i = 0; i < listData.length; i++){
            if(i < this.listRank.length){
                this.listRank[i].Show(listData[i]);
            }
        }
   },

   Hide(){
    
    if(Global.LobbyView != null && Global.LobbyView.node.active == true)
        Global.LobbyView.HideTabRank ();
    this.node.active = false;
   },
   
});
