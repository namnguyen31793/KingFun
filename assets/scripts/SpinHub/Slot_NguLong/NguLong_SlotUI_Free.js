cc.Class({
    extends:  require('SlotUI'),

    ctor() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 4;
        this.NUMBER_ITEM_ABOVE = 4;
        this.NUMBER_ITEM_BELOW = 3;
        this.NUMBER_SPEED = 12;
        this.ID_BONUS = 0;
        this.ID_FREE = 0;
        this.ID_WILD = 1;
        this.listSpecialWild = [];
        this.TIME_DISTANCE_COLUMN = 0;
        this.listStopObj = [];
        this.listSpinObj = [];
        this.listItem = [];
        this.countSpinDone = 0;
        this.listIdNearWin = [];
        this.listCountNearWin = [];
        this.listIdNearWinIncrease = [];
        this.listCountNearWinIncrease = [];
        this.listIndexIncrease = [];
        this.listStopIncrease = [];
        this.payLine = [];
    },
    properties: {
        parentListItem : cc.Node,
        nodeStops : [cc.Node],
        nodeSpins : [cc.Node],
        minRandom : {
            default : 2,
        },
        maxRandom : {
            default : 10,
        },
        multiplyNode : cc.Node,
    },

    Init(slotController){
        this._super(slotController);
        this.Setup();
    },

    Setup() {
        this.itemParent = cc.find("Container/Items", this.node);
        //tao list item va random anh
        let totalItem = this.NUMBER_COLUMN * this.NUMBER_ROW;
        for(let i = 0; i < totalItem; i++)
        {
            this.listItem[i] = cc.find((i+1).toString(), this.parentListItem).getComponent(this.slotController.slotUI.nameClassItem);
            this.RandomImage(this.listItem[i]);
        }
        
        this.listStopObj = this.nodeStops;
        //init obj cot quay
        let distanceY = this.listItem[0].node.y - this.listItem[this.NUMBER_COLUMN].node.y;
        for(let i = 0; i < this.NUMBER_COLUMN; i++) {
            this.listSpinObj[i] = this.nodeSpins[i].getComponent(this.slotController.slotUI.nameClassSpinColump);
        }
        //chuyển item vào cột tương ứng để quản lý
        for(let i = 0; i < this.listStopObj.length; i++)
        {
            for(let j = 0; j < this.NUMBER_ROW; j++) {
                this.listItem[i+j*this.NUMBER_COLUMN].node.parent = this.listStopObj[i];
            }
        }
        //set infor cho từng cột quay
        for(let i = 0; i < this.NUMBER_COLUMN; i++)
        {   
            this.listSpinObj[i].node.name = (i+1)+"spinColump";
            this.listSpinObj[i].InitSpinColumn(this, this.listItem[i].node, distanceY, this.NUMBER_ITEM_ABOVE, this.NUMBER_ITEM_BELOW, this.NUMBER_ROW, this.NUMBER_COLUMN, this.NUMBER_SPEED);
            this.listSpinObj[i].node.active = false;
        }
        this.listIdNearWin[0] = this.ID_FREE;
        this.listIdNearWinIncrease[0] = this.ID_BONUS;
        this.listCountNearWin[0] = 2;   //so item check là 2
        this.listCountNearWinIncrease[0] = 2; //so item check là 2
        this.InitPayLine();
    },

    InitPayLine() {
        this.listSpecialWild = [this.ID_WILD];
        this.payLine = [];
        let index = 0;
        for (let i = 0; i < this.NUMBER_ROW; i++) {
            for (let j = 0; j < this.NUMBER_ROW; j++) {
                for (let k = 0; k < this.NUMBER_ROW; k++) {
                    for (let l = 0; l < this.NUMBER_ROW; l++) {
                        for (let m = 0; m < this.NUMBER_ROW; m++) {
                            index++;
                            let list = [i, j, k, l, m];
                            this.payLine[index] = this.GetPosByColum(list);
                        }
                    }
                }
            }
        }
    },

    Hide(){

    },

    ShowBgGameFree(isShow){
        this.BG_Free.active = isShow;
    },

    PlaySpinColumn(timeDistanceColumn) {
        this.timeDistanceColumn = timeDistanceColumn;
        for(let i = 0; i < this.listSpinObj.length; i++)
        {
            this.scheduleOnce(()=>{
                this.listStopObj[i].active = false;
                this.listSpinObj[i].PlaySpin(this.listStopObj[i]);
            } , i*timeDistanceColumn)
        }
    },

    //check quay xong cot chua thi check trang thai stop
    OnCheckSpinSuccess() {
        this.slotController.stateGetResult += 1;
        if(this.slotController.stateGetResult == 2) {
            this.OnStopSpin(this.listSpinObj);
        }
    },

    OnCheckUpdateMatrix(isSetDefaut = false) {
        if(!isSetDefaut) {
            this.slotController.stateSpin += 1; 
        } 
        if(this.slotController.stateSpin == 2 || isSetDefaut) {
            for(let i = 0; i < this.slotController.cacheMatrix.length; i++) {
                this.SetImageItemReal(this.slotController.cacheMatrix[i], this.listItem[i].node, false, this.slotController.cacheMulti[i]);
            }
        }
    },
    //check kết thúc spin, check matrix có item đặc biệt thì kéo dài
    OnStopSpin(listSpinObj) {
        let indexPreWin = this.CountNearWin();
        let min = this.NUMBER_COLUMN;
        for(let i = 0; i < indexPreWin.length; i++) {
            if(indexPreWin[i] != -1) {
                if(indexPreWin[i] < min) {
                    min = indexPreWin[i];
                }
            }
        }
        //add thời gian hiển thị từng cột, nếu có prewin thì delay lâu hơn
        let timeDistanceColumn = this.TIME_DISTANCE_COLUMN;
        let isSpeed = this.slotController.GetIsSpeed();
        if(this.slotController.isBonus)
            isSpeed = false;
        if(isSpeed)
            timeDistanceColumn = 0;
        let listDelay = [];
        let totalDelay = 0;
        for(let i = 0; i < listSpinObj.length; i++) {
            if(i > min) {
                totalDelay += 2;
            } else {
                totalDelay += timeDistanceColumn;
            }
            listDelay[i] = totalDelay + i * this.timeDistanceColumn;
        }
        for(let i = 0; i < this.listIndexIncrease.length; i++) {
            if(this.listIndexIncrease[i] != -1) {
                for(let j = this.listIndexIncrease[i]+1; j < this.listStopIncrease[i]; j++) {
                    if(listDelay[j] - listDelay[j-1]< 2) {
                        for(let k = j; k < listSpinObj.length; k++) {
                            listDelay[k] = listDelay[k] + 2 - timeDistanceColumn;
                        }
                    }
                }
            }
        }
        //add kết quả từng cột spin và check effect nearwin
        for(let i = 0; i < listSpinObj.length; i++)
        {
            this.scheduleOnce(()=>{
                listSpinObj[i].GetResult(i, this.slotController.cacheMatrix);
                let checkShowIncrease = false;
                for(let j = 0; j < this.listIndexIncrease.length; j++) {
                    if(this.listIndexIncrease[j] != -1) {
                        if(i >= this.listIndexIncrease[j]) {
                            if(i < this.listStopIncrease[j]) {
                                checkShowIncrease = true;
                                this.ShowAnimNearWinItem(this.listIdNearWinIncrease[j]);
                            } else {
                                this.scheduleOnce(()=>{
                                } , 0.4);  
                            }
                        }
                    }
                }
                if((i>=min && i != listSpinObj.length-1) || checkShowIncrease) {
                    this.scheduleOnce(()=>{
                        for(let j = 0; j < indexPreWin.length; j++) {
                            if(indexPreWin[j] != -1 && i >= indexPreWin[j]) {
                                this.ShowAnimNearWinItem(this.listIdNearWin[j]);
                            }
                        }
                        listSpinObj[i+1].SpeedUp();
                    } , 0.4);  
                }
            } , listDelay[i]);
        }
    },

    /*
    --------- Phần set icon item ------
    */
    RandomImage(item)
    {
        let r = Global.RandomNumber(this.minRandom,this.maxRandom);
        this.SetImageItem(r, item);
    },

    SetImageItem(id, itemView, loop = false, dragonId = 1) {
        var idItem = id % 20;

        itemView.getComponent(this.slotController.slotUI.nameClassItem).SetImageItemFake(idItem, this.slotController.slotUI.itemImgDataFree[idItem-1]);  
         
    },

    SetImageItemReal(id, itemView, loop = false, dragonId = 1) {
        var idItem = id % 20;
        let isGem = (id > 20) ? true : false;
        if(this.slotController.slotUI.CheckIconSpineById(idItem)){
            let anim = this.slotController.slotUI.GetNameSpinById(idItem, true)
            let animBG = this.slotController.slotUI.GetNameBGById(idItem, true)
            if(id == 1)
            {
                let fire = this.slotController.slotUI.getObjectFromPool();
                itemView.getComponent(this.slotController.slotUI.nameClassItem).SetSpineItem(this.slotController.slotUI, idItem, this.slotController.slotUI.itemSpineData[idItem-1], this.slotController.slotUI.itemSpineBGData[idItem-1], 
                    anim, animBG, isGem, fire, () => {
                        this.slotController.slotUI.returnObjectToPool(fire);
                    });  
            }else
                itemView.getComponent(this.slotController.slotUI.nameClassItem).SetSpineItem(this.slotController.slotUI, idItem, this.slotController.slotUI.itemSpineData[idItem-1], this.slotController.slotUI.itemSpineBGData[idItem-1], anim, animBG, isGem);  
        }
        else {
            itemView.getComponent(this.slotController.slotUI.nameClassItem).SetImageItem(this.slotController.slotUI, idItem, this.slotController.slotUI.itemImgDataFree[idItem-1], isGem);  
        }
    },

    HideGemDragon(){
        for(let i = 0; i < this.slotController.cacheMatrix.length; i++) {
            this.listItem[i].SmallGem();
        }
    },

    OnSpinDone(indexColumn) {
        //this.soundControl.StopSpin();
        //this.CheckItemWhenSpinDone(indexColumn); -- dùng để check với bonus k xóa
        this.listStopObj[indexColumn].active = true;

        this.countSpinDone+=1;  
        this.slotController.PlayReelStop();
        if(this.countSpinDone >= this.NUMBER_COLUMN) {
            this.scheduleOnce(()=>{
                if(this.CheckEventShowWildTutorial()){
                    //add event wait
                    this.slotController.storeCurrentScripts = "OnSpinDoneDoWork";
                    this.slotController.storeNextScripts = {
                        script:   this.OnSpinDoneDoWork,
                        object :  this,
                        data: null,                     
                    };
                }else{
                    this.slotController.toDoList.DoWork();
                }
            } , 0.25);
            this.countSpinDone = 0;
        }
    },

    OnSpinDoneDoWork(){
        this.slotController.toDoList.DoWork();
    },

    CheckEventShowWildTutorial(){
        if(this.slotController.tutorial.GetIndexTutorial() == 19){
            if(this.slotController.checkPauseTutorial("wildInfoJackpot"))
            {
                this.slotController.onIngameEvent("SHOW_INFO_WILD");
            }
            return true;
        }
        return false;
    },

    /*----------------------------*/

    
    /*
    --------- Phần check Effect item đặc biệt ------
    */
    //show effect đặc biệt trên item theo id
    ShowAnimNearWinItem(id) {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.slotController.cacheMatrix[i] == id) {
                this.listItem[i].PlayAnimPreWin();
            }
        }
    },
    //tính số item đặc biệt
    CountNearWin() {
        let listCount = [];
        let listCountIncrease = [];
        let listIndex = [];
        for(let i = 0; i < this.listIdNearWin.length; i++) {
            listCount[i] = 0;
            listIndex[i] = -1;
        }
        for(let i = 0; i < this.listIdNearWinIncrease.length; i++) {
            listCountIncrease[i] = 0;
            this.listIndexIncrease[i] = -1;
            this.listStopIncrease[i] = this.NUMBER_COLUMN;
        }
        if(this.slotController.isBonus || this.slotController.isFree)
            return listIndex;
        let checkIncrease = true;
        for(let i = 0; i < this.NUMBER_COLUMN-1; i++) {
            let checkIn= false;
            for(let j = 0; j < this.NUMBER_ROW; j++) {
                for(let k = 0; k < this.listIdNearWin.length; k++) {
                    if(this.CheckIdPreWin(this.slotController.cacheMatrix[i+j*this.NUMBER_COLUMN], this.listIdNearWin[k])) {
                        listCount[k] += 1;
                        if(listCount[k] >= this.listCountNearWin[k] && listIndex[k] == -1) {
                            listIndex[k] = i;
                        }
                    }
                }
                for(let k = 0; k < this.listIdNearWinIncrease.length; k++) {
                    if(this.CheckIdPreWin(this.slotController.cacheMatrix[i+j*this.NUMBER_COLUMN], this.listIdNearWinIncrease[k]) && checkIncrease) {
                        listCountIncrease[k] += 1;
                        if(listCountIncrease[k] >= this.listCountNearWinIncrease[k] && this.listIndexIncrease[k] == -1) {
                            this.listIndexIncrease[k] = i;
                        }
                        checkIn = true;
                    } else {
                        if(checkIncrease) {
                            this.listStopIncrease[k] = i+1;
                        }
                    }
                }
            }
            if(!checkIn) {
                checkIncrease = false;
            }
        }
        return listIndex;
    },

    CheckNearWin() {
        return this.listIdNearWin.length > 0;
    },

    CheckIdPreWin(idItem, idCheck) {
        return idItem == idCheck;
    },

    EndAllItemPreWin() {
        for(let i = 0; i < this.listItem.length; i++)
            this.listItem[i].EndAnimPreWin();
    }, 

    EndItemBonusPreWin() {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.slotController.cacheMatrix[i] == this.ID_BONUS)
                this.listItem[i].EndAnimPreWin();
        }
    },

    EndItemFreePreWin() {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.slotController.cacheMatrix[i] == this.ID_FREE)
                this.listItem[i].EndAnimPreWin();
        }
    },

    /*----------------------------*/

    ShowLineFree(){
        let matrix = this.slotController.cacheMatrix;
        let listLineWin = [];
        for(let i = 0; i < matrix.length; i++){
            if(matrix[i] == this.ID_FREE)
                listLineWin.push(i);
        }
        this.DrawLine(listLineWin);
    },

    ShowLineBonus(){
        let matrix = this.slotController.cacheMatrix;
        let listLineWin = [];
        for(let i = 0; i < matrix.length; i++){
            if(matrix[i] == this.ID_BONUS)
                listLineWin.push(i);
        }
        this.DrawLine(listLineWin);
    },

    ShowLineWin(listLine){
        if(listLine.length == 0)
            return;
        if(listLine.length == 1 && listLine[0] == 0)
            return;
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].HideColoritem();
        }
        this.listLineWin = this.GetListPosRuleAllWay(listLine);          
        
        if(this.slotController.isAuto){
            this.DrawLine(this.listLineWin[0]);
        }else{
            if(this.listLineWin.length > 0){
                this.currentIndex = 0;
                this.DrawLine(this.listLineWin[0]);
                this.showNextLineWin();
            }
        }
    },

    showNextLineWin() {
        this.currentIndex++;
        if (this.currentIndex < this.listLineWin.length) {
        }else{
            this.currentIndex = 0;
        }
        this.DrawLine(this.listLineWin[this.currentIndex]);
        this.scheduleOnce(()=>{
            this.showNextLineWin();
        }, 1.5);
    },

    GetListPosRuleAllWay(listLine){
        let matrix = this.slotController.cacheMatrix;
        let listLineWin = [];
        //list tong hop
        let listPoin = {};//list position win + 1 all
        listPoin["0"] = [];
        let outLineWin = [];
        //chay tung line win
        for(let i = 0; i < listLine.length; i++) {
            let linePos = this.payLine[listLine[i]];// list position line win
            var startPos = linePos[0]-1;

            var idCheckMatch = -1;
            if(matrix[startPos] % 20 != this.ID_WILD)
                idCheckMatch = matrix[startPos] % 20

            if(!(listLine[i].toString() in listPoin)) {
                listPoin[listLine[i].toString()] = [];
                listPoin[listLine[i].toString()].push(startPos);
            }
            if(!listPoin["0"].includes(startPos))
                listPoin["0"].push(startPos);

            //lay id cac vi tri check
            let listRs = []
            listRs[0] = startPos;
            for(let j = 1; j < linePos.length; j++){
                if((idCheckMatch != -1 && matrix[linePos[j]-1] % 20 != idCheckMatch && !this.CheckSpecialItem(matrix[linePos[j]-1] % 20)))
                    break;
                if(idCheckMatch == -1 && matrix[linePos[j]-1] % 20 != this.ID_WILD)
                    idCheckMatch = matrix[linePos[j]-1] % 20;

                listRs[j] = linePos[j]-1;
                if(!listPoin[listLine[i].toString()].includes((linePos[j]-1)))
                    listPoin[listLine[i].toString()].push(linePos[j]-1);
                if(!listPoin["0"].includes((linePos[j]-1)))
                    listPoin["0"].push(linePos[j]-1);
            };
            listLineWin[i] = listRs;
        }
        for( var line in listPoin){
            outLineWin[outLineWin.length] = listPoin[line];
        }

        return outLineWin;
    },

    DrawLine(listPoint) {
        for(let i = 0; i < listPoint.length; i++) {
            this.listItem[listPoint[i]].ActiveColorItem(true);
        }
    },

    HideAllLine() {
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].HideColoritem();
            this.listItem[i].HideEffectEnd();
        }
        this.unscheduleAllCallbacks();
    },

    CheckSpecialItem(id){
        var isSpecialWild = false;
        for(let i = 0; i < this.listSpecialWild.length; i++){
            if(id == this.listSpecialWild[i])
            isSpecialWild = true;
        }
        return isSpecialWild;
    },

    GetPosByColum(listPosColum) {
        let listPos = [];
        //chay theo tung cot
        for (let i = 0; i < listPosColum.length; i++)
        {
            let pos = this.NUMBER_COLUMN * listPosColum[i] + (i + 1);
            listPos[i] = pos;
        }
        return listPos;
    },

    ShowMulti(multi, toDoList){
        if(this.multiplyNode)
            this.multiplyNode.emit("SHOW_MULTIPLY", multi, !1, "free", 1, function() {
                toDoList.DoWork();
            })
    },

    ClearMulti(){
        if(this.multiplyNode)
            this.multiplyNode.emit("FAST_RESET_MULTIPLY");
    },
});
