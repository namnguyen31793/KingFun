// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.selectIndex = 0;
        this.matrixArray = [];
    },

    properties: {
       SelectItem_Collection : {
        default: [],
        type:  require("TL_SelectItem")
        },
        JackpotView :  require("TL_JackpotView"),
        BlockPanel: cc.Node,
        SelectItem_Containt : cc.Node,
        EndBonusContent : require("TL_Bonus_EndPopup"),
    },
    onLoad()
    {
        this.SelectItem_Containt_Animation = this.SelectItem_Containt.getComponent(cc.Animation);
        this.node.on("RUN_CONTINUE_SCRIPT", this.runContinueScript, this);
        this.spinController = require("TL_SpinController").getIns();
    },

    onEnable()
    {
        this.BlockPanel.active = false;
        this.selectIndex = 0;
        this.EndBonusContent.node.active = false;
       
        for(let i= 0;i< this.SelectItem_Collection.length;i++)
        {
            this.SelectItem_Collection[i].node.active = false;
        }
        this.scheduleOnce(()=>{
            this.ShowAnimation_StartPopup();
        }, 0.5)
       
    },
    TL_Bonus_Instance_Setup(RewardDescription,RewardJackpotType,totalWin,jackpotValueModel,specialID)
    {
        this.matrixArray = [];
        this.RewardDescription = RewardDescription;
        this.RewardJackpotType = RewardJackpotType;
        const stringArray = RewardDescription.split(",");
        this.matrixArray =  stringArray.map((numStr) => Math.floor(parseInt(numStr)));
        this.selectIndex = 0;
        this.TotalWin = totalWin;
        this.JackpotView.UpdateJackpotValue_BySpecialID(jackpotValueModel,specialID);
       
    },



    ShowAnimation_StartPopup()
    {
        this.SelectItem_Collection.forEach((item,index)=>{
            // Sử dụng setTimeout để tạo độ trễ
            setTimeout(() => {
                item.node.active = true;
            }, index * 100); // Mỗi lần lặp, độ trễ tăng lên 2s
        });
        let delayTime = (this.SelectItem_Collection.length * 100/1000);
        this.scheduleOnce(()=>{
            require("TL_SpinController").getIns().spinView.onIngameEvent("ENTER_GAME_MODE");
        },delayTime);
        
    },

    onClick_SelectItem(event,index)
    { 
       
        if(this.selectIndex >=this.matrixArray.length)
        {     
            this.spinController.spinView.onIngameEvent("ON_FINISH_MINIGAME");
            return;
        }
        require("AudioController_V2").getIns().audioPool.playSelectBonusItem_Fx_Sound();

        var ID = parseInt(index);
        if(this.SelectItem_Collection[ID].isSelected)
            return;
        //cc.log("ID: "+ID);
        let jackpotType =  this.matrixArray[this.selectIndex];
        this.selectIndex++;
        this.SelectItem_Collection[ID].OnClick_SelectItem(jackpotType);

        if(this.selectIndex >=this.matrixArray.length)
        { 
           
            // kiem tra co o tutorial khong 
            if(this.spinController.spinView.isPauseTutorialFlag("pauseMinigame"))
            {
                this.storeCurrentScripts = this.Handle_EndLogic;
                this.storeNextScripts = {
                    script: [],
                    data: {}
                }
            }
            else
            {
                this.Handle_EndLogic();
            }
            
        }
       
    },

    Handle_EndLogic()
    {
        this.BlockPanel.active = true;
        this.SelectItem_Collection.forEach((item,index)=>{
           if(!item.isSelected)
           item.ShowAnimation_NotSelect();
        });

        this.scheduleOnce(()=>{
            let callBack = ()=>{    
                this.SelectItem_Containt_Animation.off("finished" , callBack);
                this.SelectItem_Containt.active = false;
                this.EndBonusContent.node.active = true;
                this.EndBonusContent.EndPopup_Setup(this.RewardJackpotType,this.TotalWin,()=>{
                    this.spinController.mainView.Destroy_BonusGameView();
                   // this.EndBonusContent.node.active = false;
                    require("AudioController_V2").getIns().playBackgroundMusic();     
                });        
               }
               
            this.SelectItem_Containt_Animation.on("finished" ,callBack );
            this.SelectItem_Containt_Animation.play("Bonus_SelectContent_EndSelect");

            require("AudioController_V2").getIns().stopBackgroundMusic();
            require("AudioController_V2").getIns().audioPool.playJackpot_MusicBg();
        },1)
    },
    runContinueScript: function() {
        var t = this.storeNextScripts
          , e = t.data
          , i = t.script;

          if(this.storeCurrentScripts)
          {
            if(t)
            {
                this.storeCurrentScripts(i, e);
            }
            else
                this.storeCurrentScripts();
          }

    
        this._resetStoreScript()
    },
    _resetStoreScript: function() {
        this.storeCurrentScripts = "",
        this.storeNextScripts = {
            script: [],
            data: {}
        }
    },

   

});
