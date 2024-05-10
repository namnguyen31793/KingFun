
cc.Class({
    extends: require("Spin_BonusGameBase"),
    ctor()
    {
        this.multiRoom = [
            [1, 2, 3],
            [2, 3, 4],
            [3, 4, 5]
        ];
    
    },

    properties: {
        StartEffect_Img : cc.Node,
        Bonus_View : cc.Node,
        ItemArray: {
            default: [],
            type:  require("ThanTai_Bonus_SelectItem")
        },

        MultiArray: {
            default: [],
            type:  require("ThanTai_Bonus_SelectMultiItem")
        },
        TotalReward_Lb : cc.Label,
        SelectItemCollection : cc.Node,
        SelectMultiCollection : cc.Node,
        EndGame_Popup : cc.Node,
        Time_Lb : cc.Label,
    },

    /*
    SpriteSelect: {
            default: [],
            type:  cc.SpriteFrame
        },
    */

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinController = require("ThanTaiSpinController").getIns();
        this.spinController.setBonusGameView(this);
        this.EndGame_Popup_Component = this.EndGame_Popup.getComponent("ThanTai_Bonus_EndPopup");
        this.isTimer = false;
        this.timer = 0;
    },
    resetTimer: function () {
        this.timer = 0;
    },

    startTimer: function () {
        this.isTimer = true;
    },

    stopTimer: function () {
        this.isTimer = false;
    },


    start () {

    },

    onEnable()
    {
        this.SelectItemCollection.active = true;
        this.SelectMultiCollection.active = false;
        this.Bonus_View.active = false;
        this.EndGame_Popup.active = false;
        this.TotalReward_Lb.string = 0;
        this.totalReward = 0;
        this.TotalReward_Lb.string = this.totalReward;
        this.ShowStartEffect();
       
    },

    ShowStartEffect()
    {
        cc.log(">>>>>>>>>>>>>>>  ShowStartEffect");
        this.StartEffect_Img.active  = true;
        this.startEffect_Animation = this.StartEffect_Img.getComponent(cc.Animation);
        let callBack = ()=>{
          
            this.startEffect_Animation.off("finished" , callBack);
            this.StartEffect_Img.active = false;
            this.Bonus_View.active = true;
            this.startTimer();            
           }
           this.startEffect_Animation.on("finished" ,callBack );
           this.startEffect_Animation.play("BonusGame_StartEffect");

    },
    BonusGame_SetUp(spinData)
    {
        this.bonusNumber = spinData[5];
        this.totalBonusValue = spinData[6];
        this.bonusMatrixDes = spinData[10];
        this.totalBet =  spinData[15];
        this.selectIndex = 0;
        this.bonusDesArray = this.bonusMatrixDes.split("|");
        this.finishMulti = parseInt(this.bonusDesArray[1]);
        let stringMultiToString = this.bonusDesArray[0];
        let stringMultiArray = stringMultiToString.split(",");
        this.multiArray = stringMultiArray.map(parseFloat);
        this.isTakeMulti = false;
        this.spinData = spinData;
    },

    Handle_ClickSelectItem(event,index)
    {
        if(this.selectIndex >= this.multiArray.length)
            return;

       this.resetTimer();

       let multiValue = this.multiArray[this.selectIndex];
       let rewardValue = multiValue*  this.totalBet;
      
       var ID = parseInt(index);
       this.ItemArray[ID-1].onClick(rewardValue);
       this.selectIndex++;
       this.totalReward += rewardValue;
       this.TotalReward_Lb.string = Global.Helper.formatNumber2(this.totalReward);

       if(rewardValue == 0)
       {
            this.scheduleOnce(()=>{
                this.SelectItemCollection.active = false;
                this.SelectMultiCollection.active = true;
            },1);
            require("AudioController_V2").getIns().playSound(cc.AudioTypes.BONUS_MISS);
       }
       else
       {
            require("AudioController_V2").getIns().playSound(cc.AudioTypes.BONUS_WIN);
       }

    },
    Handle_ClickSelectMulti(event,index)
    {
        if(this.isTakeMulti)
            return;
        this.resetTimer();

        this.isTakeMulti = true;
        var ID = parseInt(index);
        this.selectRoom = ID;
        this.MultiArray[ID].onClick_SelectMulti(this.bonusNumber,this.finishMulti,true);
        let seft = this;
        this.scheduleOnce(()=>{
            seft.Handle_AnotherClickMulti();
        },1);

        this.scheduleOnce(()=>{
          this.Handle_ShowPopupEndGame();
        },3);      
    },

    Handle_ShowPopupEndGame()
    {
        let totalPickValue = this.totalBonusValue/this.finishMulti;
        this.EndGame_Popup_Component.EndGamePopup_Setup(totalPickValue,this.finishMulti,this.totalBonusValue);
        let AccountBalance =  this.spinData[11];
        cc.BalanceController.getInstance().updateBalance(AccountBalance);
        this.scheduleOnce(()=>{        
            this.Handle_DestroyGameBonus();
            this.spinController.Handle_AutoRespin();
            require("AudioController_V2").getIns().playBackgroundMusic();
        },3);
    },
    Handle_DestroyGameBonus()
    {
       // this.Bonus_View.active = false;
        this.node.active = false;
        this.node.destroy();  
    },

    Handle_AnotherClickMulti()
    {  
        let roomID = 0;
        switch(this.bonusNumber)
        {
            case 3:
                roomID = 0;
                break;
            case 4:
                roomID = 1;
                break;
            case 5:
                roomID = 2;
                break;
        }
       
        let arrayValue = this.getDifferentValues(roomID,this.finishMulti);
        let roomArray = this.getOtherOptions(this.selectRoom);
       
        for(let i = 0;i< arrayValue.length;i++)
        {
            let index = roomArray[i];
            this.MultiArray[index].onClick_SelectMulti(this.bonusNumber,arrayValue[i]);
        }
    },

    getDifferentValues(roomID,defaultValue) {
        let values = [];       
            for (let j = 0; j < this.multiRoom[roomID].length; j++) {
                if (this.multiRoom[roomID][j] != defaultValue) {
                    values.push(this.multiRoom[roomID][j]);
                }
            }
        
        return values;
    },
    getOtherOptions(option) {
        switch (option) {
            case 0:
                return [1, 2];
            case 1:
                return [0, 2];
            case 2:
                return [0, 1];
            default:
                return []; // Trả về mảng trống nếu lựa chọn không hợp lệ
        }
    },
    onDestroy()
    {
        cc.log("------START DESTROY------");
        this.spinController.setBonusGameView(null);
    },

    update(dt)
    {
        if (this.isTimer) {
            this.timer += dt;
            let remainTime =  Math.round(15 - this.timer);
            if(remainTime < 10)
                this.Time_Lb.string = remainTime + 's';
            else 
                this.Time_Lb.string =  '10s'


            if (this.timer >= 15) {
                this.Handle_ShowPopupEndGame();
                this.stopTimer();
            }
        }
    },
    // update (dt) {},
});
