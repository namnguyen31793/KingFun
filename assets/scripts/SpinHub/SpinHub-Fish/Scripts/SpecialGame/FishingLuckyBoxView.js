var NUMBER_CELL = 24;
var FLAG_GOLD = 40;
var FLAG_MEGA = 100;
cc.Class({
    extends: require("FishingSpecialView"),

    ctor(){
        this.startPos = 0;
        this.totalWin = 0;
        this.spinToDoList = null;
        this.cacheActor = 0;
        this.cacheAccountBalance = 0;
        this.cacheReward = 0;
        this.isReady = true;
        this.isSpin = false;
        this.isFillData = false;
        this.baseMoney = 0;
        this.timeRunEffectEnd = 0;
        this.isPlayEffectEnd = false;
        this.countTime = 0;
        this.listPosWin = [];
        this.isShowNotifyStart = false;
    },

    properties: {
        listItem :{
            default : [],
            type : cc.Node,
        },
        listLight :{
            default :[],
            type : cc.Animation,
        },
        skeletonBoxValue : sp.Skeleton,
        skeletonCoin :sp.Skeleton,
        lbTotalWin : cc.Label,
        nodeEffectCoin : cc.Node,
        mark : cc.Node,
        nodeSpin : cc.Node,
        nodeNotify : cc.Node,
        nodeCaishenEnd : cc.Node,
        lbTotalWinEnd : cc.Label,
    },

    onLoad() {
        this.spinToDoList = this.node.addComponent("ToDoList");
    },
    
    show(baseMoney, nextInfoTurn, isStart = true) {
        this.isReady = true;
        this.showNotify();
        this.FillData(baseMoney, nextInfoTurn);
        this.GetTotalWinCache();
        this.ClickPlay();
        this.baseMoney = baseMoney;
    },

    showNotify(){
        this.isShowNotifyStart = true;
        this.nodeSpin.scale = 0;
        this.nodeNotify.active = true;
        this.nodeNotify.opacity = 255;
        this.scheduleOnce(()=>{
            this.nodeNotify.runAction(cc.fadeTo(1, 0).easing(cc.easeSineOut()));   
        } , 1);  
        this.scheduleOnce(()=>{
            this.nodeSpin.runAction(cc.scaleTo(0.3, 1).easing(cc.easeBackOut()));
            this.isShowNotifyStart = false;
        } , 1.5);  
    },

    ClickPlay() {
        if(this.isReady && !this.isSpin) {
            this.isReady = false;
            let msgData = {};
            msgData [1] = Global.Enum.FISH_TYPE_CONFIG.LUCKY_BOX_TYPE;
            require("SendRequest").getIns().MST_Client_Special_Fish_Play_Turn(msgData);
            // this.PlaySpin();
        }
    },

    
    PlaySpin(actor, reward, result, nextInfoTurnStr, accountBalance) {
        if(this.isSpin)
            return;
            actor.Off_Attack();
            this.cacheActor = actor;
            this.cacheAccountBalance = accountBalance;
            this.cacheReward = reward;
        if(!this.isFillData){
            this.showNotify();
            this.FillData(actor.GetMoneyPerShotByCurrentGunId(), nextInfoTurnStr);
            this.baseMoney = actor.GetMoneyPerShotByCurrentGunId();
            this.GetTotalWinCache(); 
        }
        if(this.isShowNotifyStart){
            this.scheduleOnce(()=>{
                this.ResetTurn();
                let pos = parseInt(result);
                this.RunAnim(pos, reward)
            } , 3); 
        }
        else{
            this.ResetTurn();
            let pos = parseInt(result);
            this.RunAnim(pos, reward)
        }
        if(reward == 0){
            cc.sys.localStorage.setItem("Key_Lucky_Box_Fish_Total_Win", 0);
            cc.sys.localStorage.setItem("Key_Lucky_Box_Fish_List_Cell", "[]");
        }
    },

    RunAnim(pos, winMoney){
        this.isSpin = true;
        let num = Global.RandomNumber(0, 2);
        let numberCellRun = NUMBER_CELL*num + this.getNumberAddByPos(pos);
        if(numberCellRun < 13)
            numberCellRun += NUMBER_CELL;
        if(numberCellRun > (NUMBER_CELL+18))
            numberCellRun -= NUMBER_CELL;      
        this.spinToDoList.CreateList();
        for(let i = 1; i < numberCellRun; i++){
            let timeWait = 0.05;
            if(i < 3){
                timeWait = 0.2-0.04*i;
            }else if(i > (numberCellRun - 4)){
                timeWait = 0.05+ (i-(numberCellRun - 4))*0.05;
            }
            this.spinToDoList.AddWork(()=>{
                this.listLight[this.getPosItem(this.startPos+i) - 1].play("AnimLightItemLuckyBox");
                this.listItem[this.getPosItem(this.startPos+i) - 1].getComponent(cc.Animation).play("AnimScaleItemLuckyBox");
            }, false);
            this.spinToDoList.Wait(timeWait);
        } 
        this.spinToDoList.AddWork(()=>{
            //this.listLight[this.getPosItem(this.startPos+(numberCellRun)) - 1].play("AnimItemWinLuckyBox");
		    this.listItem[this.getPosItem(this.startPos+(numberCellRun)) - 1].setSiblingIndex(this.listItem[0].parent.children.length-1);
            this.listItem[this.getPosItem(this.startPos+(numberCellRun)) - 1].getComponent(cc.Animation).play("AnimWinItemLuckyBox");
        }, false);
        //this.spinToDoList.Wait(0.5);
        this.spinToDoList.AddWork(()=>{
            this.Finish(winMoney, pos);;
        }, false);
        this.spinToDoList.Play();
    },
    
    Finish(value, pos){
      
        this.startPos = pos-1;
        this.isSpin = false;
        this.isReady = true;
        this.listItem[pos-1].getComponent('FishingLuckyBoxItemElement').SetColor(cc.Color.WHITE);
        this.SavePosWin(pos, value);
        if(value > 0){
            let timeWaitUpdate = this.UpdateWinMoney(value);
            let time = 1;
            if((value/this.baseMoney) > 50){
                time = 2;
            }
            this.scheduleOnce(()=>{
                this.ClickPlay();
            } , 0.2);
        }else{
            //lose
            this.scheduleOnce(()=>{
                this.ShowTotal();
            } , 1);
        }
        this.cacheActor.On_Attack();
    },

    ShowTotal(){
       // this.showNotify();
        this.skeletonBoxValue.node.active = true;
        this.nodeCaishenEnd.active = true;
        this.RunEffect(this.totalWin, this.baseMoney);
    },

    UpdateWinMoney(value){
        if(value <= 0)
            return 0;
        //show anim box skeletonBoxValue
        this.skeletonBoxValue.node.active = true;
        let isChangeTurnEffect = false;
        let timeWait = 0;
        if(this.totalWin/this.baseMoney < FLAG_GOLD){
            if(((this.totalWin+value)/this.baseMoney) >= FLAG_GOLD){
                isChangeTurnEffect = true;
                timeWait = 1;
            }
        }
        if(this.totalWin/this.baseMoney < FLAG_MEGA){
            if(((this.totalWin+value)/this.baseMoney) >= FLAG_MEGA){
                isChangeTurnEffect = true;
                timeWait = 1;
            }
        }
        this.totalWin += value;
        let heso = this.totalWin/this.baseMoney;
        this.playAnimBoxValue(heso, true, isChangeTurnEffect);
            
        this.lbTotalWin.getComponent("LbMonneyChange").setMoney(this.totalWin);
        cc.sys.localStorage.setItem("Key_Lucky_Box_Fish_Total_Win" , this.totalWin);
        this.scheduleOnce(()=>{
            this.StopAnimBoxValue(heso);
        } , 1.5+timeWait);
        return timeWait;
    },

    GetTotalWinCache(){
        this.totalWin = parseInt(cc.sys.localStorage.getItem("Key_Lucky_Box_Fish_Total_Win")) || 0;
        this.lbTotalWin.string = Global.Helper.formatNumber(this.totalWin);
        this.playAnimBoxValue(this.totalWin, false);
    },

    getNumberAddByPos(pos){
        let value = 0;
        if(pos >= this.startPos){
            value = pos - this.startPos - 1;
        }else{
            value = NUMBER_CELL - ((this.startPos+1) - pos);
        } 
        return value;    
    },

    getPosItem(pos){
        if(pos > NUMBER_CELL){
            return (pos%NUMBER_CELL)+ 1;
        }else{
            return pos;
        }
    },

    playAnimBoxValue(value, isShowWin, isChangeTurn = false){
        if(!isShowWin){
            if(value < 50){
                this.skeletonBoxValue.setAnimation(0, 'xuathien-bac', false);
            }else if(value < 100){
                let speed = (value -50)/50;
                this.skeletonBoxValue.timeScale = 1+speed;
                this.skeletonBoxValue.setAnimation(0, 'xuathien-vang', false);
            }else{
                let speed = (value - 100)/100;
                this.skeletonBoxValue.timeScale = 1+speed;
                this.skeletonBoxValue.setAnimation(0, 'xuathien-mega', false);
            }
        }else{   
            this.skeletonCoin.setAnimation(0, 'active', false);
            if(value < 50){
                this.skeletonBoxValue.setAnimation(0, 'chaytien-bac', true);
            }else if(value < 100){
                let speed = (value -50)/50;
                if(isChangeTurn){
                    this.skeletonBoxValue.setAnimation(0, 'xuathien-vang', false);
                    this.scheduleOnce(()=>{
                        this.skeletonBoxValue.timeScale = 1+speed;
                        this.skeletonBoxValue.setAnimation(0, 'chaytien-vang', true);
                    } , 1);
                }else{
                    this.skeletonBoxValue.timeScale = 1+speed;
                    this.skeletonBoxValue.setAnimation(0, 'chaytien-vang', true);
                }
            }else{
                let speed = (value - 100)/100;
                if(isChangeTurn){
                    this.skeletonBoxValue.setAnimation(0, 'xuathien-mega', false);
                    this.scheduleOnce(()=>{
                        this.skeletonBoxValue.timeScale = 1+speed;
                        this.skeletonBoxValue.setAnimation(0, 'chaytien-mega', true);
                    } , 1);
                }else{
                    this.skeletonBoxValue.timeScale = 2+speed;
                    this.skeletonBoxValue.setAnimation(0, 'chaytien-mega', true);
                }
            }
            this.nodeEffectCoin.getComponent(cc.Animation).play();
        }
    },

    StopAnimBoxValue(value){
        if(value < 50){
            this.skeletonBoxValue.setAnimation(0, 'chaytien-bac', false);
        }else if(value < 100){
            let speed = (value -50)/50;
            this.skeletonBoxValue.timeScale = 1+speed;
            this.skeletonBoxValue.setAnimation(0, 'chaytien-vang', false);
        }else{
            let speed = (value - 100)/100;
            this.skeletonBoxValue.timeScale = 2+speed;
            this.skeletonBoxValue.setAnimation(0, 'chaytien-mega', false);
        }
        this.skeletonBoxValue.loop = false;
        this.nodeEffectCoin.getComponent(cc.Animation).stop();
    },

    RunEffect(winMoney, baseMoney) {
        
        let heso = winMoney/baseMoney;
        if(heso <= 4)
            this.timeRunEffectEnd = heso / 4;
        else if(heso <= 12)
            this.timeRunEffectEnd = heso / 9;
        else if(heso <= 36)
            this.timeRunEffectEnd = heso / 15;
        else if(heso <= 50)
            this.timeRunEffectEnd = heso / 20;
        else if(heso <= 100)
            this.timeRunEffectEnd = heso / 30;
        else 
            this.timeRunEffectEnd = heso / 35;
        if(this.timeRunEffectEnd > 5)
            this.timeRunEffectEnd = 5;
        this.mark.active = true;
        for(let i = 0; i < this.node.children.length; i++)
            this.node.children[i].active = true;

        this.nodeEffectCoin.getComponent(cc.Animation).play();
        this.skeletonBoxValue.node.active = false;
        
        this.isPlayEffectEnd = true;
        this.countTime = 0;
        
        this.lbTotalWinEnd.getComponent("LbMonneyChange")._currentMonney = 0;
        this.lbTotalWinEnd.getComponent("LbMonneyChange").time = this.timeRunEffectEnd;
        this.lbTotalWinEnd.getComponent("LbMonneyChange").setMoney(winMoney);
    },

    update(dt) {
        if(this.isPlayEffectEnd) {
            this.countTime += dt;
            if(this.countTime >= this.timeRunEffectEnd) {
                this.EndGame()
            }
        }
    },

    EndGame(){
        this.scheduleOnce(()=>{
            this.cacheActor.On_Attack();
            this.cacheActor.UpdateBalance(this.totalWin, true);
            this.ResetAll();
            this.node.destroy();
        } , 2);
    },

    FillData(baseMoney, data) {
        for(let i = 0; i < this.listItem.length; i++){
            this.listItem[i].getComponent('FishingLuckyBoxItemElement').SetColor(cc.Color.GRAY);
        }
        let listPos = this.GetListPosWin();
        if(listPos.length > 0)
            for(let i = 0; i < listPos.length; i++){
                if(listPos[i] > 0)
                    this.listItem[listPos[i]-1].getComponent('FishingLuckyBoxItemElement').SetColor(cc.Color.WHITE);
            }
        this.isFillData = true;
        let listData = data.split(',');
        for(let i = 0; i < this.listItem.length; i++){
            if(i < listData.length){
                this.listItem[i].active = true;
                this.SetInfoCell(this.listItem[i], listData[i], baseMoney);
            }else{
                this.listItem[i].active = false;
            }
        }
    },

    SetInfoCell(cell, data, baseMoney){
        let value = data.split('.');
        if(value.length > 0){
            if(parseInt(value[0]) == 1){
                cell.getComponent('FishingLuckyBoxItemElement').SetValueMoney( Global.Helper.formatNumber(parseInt(value[1])* baseMoney));
            }else{
                cell.getComponent('FishingLuckyBoxItemElement').SetValueMoney("");
            }
        }
    },

    SavePosWin(pos, value){
        if(value <= 0)
            return;
        this.listPosWin.push(pos);
        cc.sys.localStorage.setItem("Key_Lucky_Box_Fish_List_Cell", JSON.stringify(this.listPosWin));
    },

    GetListPosWin(){
        let stringSavePos = cc.sys.localStorage.getItem("Key_Lucky_Box_Fish_List_Cell") || "[]";
        this.listPosWin = JSON.parse(stringSavePos);
        return this.listPosWin;
    },

    ResetTurn(){
        this.isPlayEffectEnd = false;
        this.skeletonBoxValue.loop = false;
        this.nodeCaishenEnd.active = false;
        if(this.startPos > 0)
            this.listLight[this.startPos-1].node.opacity = 0;
    },
    
    ResetAll(){
        for(let i = 0; i < this.listItem.length; i++){
            this.listItem[i].getComponent('FishingLuckyBoxItemElement').SetColor(cc.Color.GRAY);
        }
        this.countTime = 0;
        this.mark.active = false;
        this.isPlayEffectEnd = false;
        this.skeletonBoxValue.loop = false;
        this.nodeCaishenEnd.active = false;
        this.lbTotalWin.string = "";
        this.totalWin = 0;
        this.listPosWin = [];
        this.lbTotalWin.getComponent("LbMonneyChange").reset();
        cc.sys.localStorage.setItem("Key_Lucky_Box_Fish_Total_Win", this.totalWin);
        cc.sys.localStorage.setItem("Key_Lucky_Box_Fish_List_Cell", "[]");
        this.lbTotalWinEnd.string = "";
        this.lbTotalWinEnd.getComponent("LbMonneyChange").reset();
        
        this.nodeSpin.scale = 0;
        this.nodeNotify.active = true;
        this.nodeNotify.opacity = 0;
    },
});
