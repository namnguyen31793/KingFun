
cc.Class({
    extends: require("SlotHistory"),

    properties: {
        nodeInfoTurn : cc.Node,
        lbTime : cc.Label, 
        lbSpinId : cc.Label,
        listItem : [cc.Node], 
    },

    Show(gameId){
        this.Clear2();
        this._super(gameId);
    },

    ShowPage(page){
        this.lbPage.string = 'Trang '+(page+1);
        let lengthRow = this.listItemHistorySlot.length;
        //show row
        let isShowNext = true;
        for(let i = 0; i < lengthRow; i++){
            let index = i + page*lengthRow;
            if(index < this.dataHistory.length){
                this.listItemHistorySlot[i].initItem(this.dataHistory[index], this);
            }else{
                this.listItemHistorySlot[i].Clear();
            }
            if(index >= (this.dataHistory.length-1)){
                isShowNext = false;
            }
        }
        if(isShowNext){
            this.btnNext.active = true;
        }else{
            this.btnNext.active = false;
        }
        if(this.page <= 0){
            this.btnBack.active = false;
        }else{
            this.btnBack.active = true;
        }
    },

    Clear2(){
        this.lbPage.string = '';
        this.lbTime.string = '';
        this.lbSpinId.string = '';
        this.nodeInfoTurn.active = false;
    }, 

    HideDetailTurn(){
        this.nodeInfoTurn.active = false;
    },
    
    ShowDetailTurn(info){
        this.nodeInfoTurn.active = true;
        let date = new Date(info.LogTime);
        this.lbTime.string = Global.Helper.GetStringFullYear(date);
        this.lbSpinId.string = "#"+date.getTime();
        //show matrix + line
        this.SetMatrix(info.Description);
    },

    SetMatrix(data){
        var listData = data.split(" - ");
        var matrix = listData[1].split(":")[1];
        let matrixInfo = this.ParseMatrix(matrix)
        for(let i = 0; i < matrixInfo.length; i++){
            let id = matrixInfo[i];
            this.SetImageItem(id, this.listItem[i],true);
        }
    },

    SetImageItem(id, itemView, loop = false) {
        var icons = require("Tw_SpinController").getIns().mainView.spinController.getIconView().icons;
        itemView.getComponent(cc.Sprite).spriteFrame = icons[id - 1];   
    },


    ParseMatrix(matrixData) {
        let matrixString = matrixData.split("|")
        let matrixStr = matrixString[0].split(",");
        let matrix = [];
        this.posData = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
        }
        return matrix;
    },
});
