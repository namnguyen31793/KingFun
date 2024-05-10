// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends:  require("SpinColumnView_V2"), 

    ctor()
    {
        this.loopSpinIndex =0;
    },
    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad () {
        this._super();
        if(this.nodeWild != null)
            this.Wild_Animation = this.nodeWild.getComponent("sp.Skeleton");
    },
    
    
    spin: function (isNearWin = false) {
        this.unscheduleAllCallbacks();
        this.Column_ResetEffect();
        //Tat Expand WILD
        if(this.nodeWild != null)
            this.nodeWild.active = false;
          
        
        this.loopSpinIndex = 0;
        if(this.colId < 3 && isNearWin)
            isNearWin = false;
        
       this.ShowAnimation_Spin(isNearWin);
    },
    
    
    ShowAnimation_Spin(isNearWin)
    {  
        let seft = this;
        let loopCount = 0;
        let callBack = ()=>{
          
           // 
            if(seft.spinController.getIsFastSpin())
                this.fastStop();
            else
            {  
                if(!isNearWin)
                {
                    this.animCol.off("finished" , callBack);
                    this.spinController.spinView.stopColumn();   
                    return;
                }

                loopCount++;
              
                if(isNearWin && loopCount >= 5)
                {
                    this.animCol.off("finished" , callBack);       
                    this.spinController.spinView.stopColumn();     
                    this.spinController.effectView.StopEffect_NearWin();            
                    return;     
                }
                else
                {
                    this.animCol.play("columnSpin");
                }
                  
            }
          
           }
       
        this.animCol.on("finished" ,callBack );
        this.animCol.play("columnSpin");    
        this.ShowAnimation_NearWin(isNearWin);    
    },

    ShowAnimation_NearWin(isNearWin)
    {
        if(this.colId == 3 && isNearWin)
        {
            this.spinController.effectView.ShowEffect_NearWin();
        }
    },

    Callback_SpinAnimation()
    {

    },
    randomIcon(indexIcon)
    {
         //neu la freespin mode thi lay icon freespin
         if (this.freeSpinController && this.freeSpinController.getStateFreeSpin()) 
        {  
            var length = this.freespinIcons.length;
            do {
                var iconId = Math.floor((Math.random() * length) + 1);
            }
            while (iconId === 2 || iconId === 3);
            this.setIcon(parseInt(indexIcon.toString()), iconId);
        } else {
            var iconId ;
            var length = this.icons.length;
            if(this.colId == 0 || this.colId == 4)
            {
                do {
                    iconId = Math.floor((Math.random() * length) + 1);
                }
                while (iconId === 3);
            }
            else
            {
                do {
                    iconId = Math.floor((Math.random() * length) + 1);
                }
                while (iconId === 0 || iconId === 1);
            }      
            
            this.setIcon(parseInt(indexIcon.toString()), iconId);
            
        }
    },
    setData: function () {
      
        let spinData =  this.spinController.getLastSpinResponseData();
        let matrix = spinData[2];
        let parts = matrix.split("|");
   
        let firstMatrix = parts[0];
      
        let itemArrays = cc.Tool.getInstance().convertStringArrayToIntArray(firstMatrix);

        this.matrixData = cc.Tool.getInstance().listToMatrix(itemArrays, 5);
        
        let expanderWildCounter = 0;

        for (var i = 1; i <= 3; i++) {
          
            let itemIndex = (5*(i-1) + this.colId)
            var iconId = this.matrixData[i - 1][this.colId]; 
            this.itemSlot_Array[i].SlotItem_Setup(iconId,this,itemIndex);
            iconId = iconId % 20;         
            //iconId = 0 la co WILD trong cot
            if (iconId === 1) {
                this.haveWild = true;
            }
            if(iconId === 2)
                expanderWildCounter++;  
        }
        if(expanderWildCounter == 3)
        {
            this.ShowAnimation_WildExpande();
        }
    },
    ShowAnimation_WinItem(winItemArray)
    {
        for(let i = 0;i<this.itemSlot_Array.length;i++)
        {
            let item = this.itemSlot_Array[i];
           
            if(winItemArray.includes(item.itemIndex))
            {
                item.ShowAnimation_WinItem();
            }
            else
            {
                item.Show_MaskItem();
            }
        }
    },
    Column_ResetEffect()
    {
        for(let i = 0;i<this.itemSlot_Array.length;i++)
        {
            this.itemSlot_Array[i].Item_ResetEffect();
        }
    },

    ShowAnimation_WildExpande()
    {
        if(this.nodeWild != null)
        {
            this.nodeWild.active = true;
            
            this.Wild_Animation.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === 'open') {           
                    this.Wild_Animation.setAnimation(0,'idle',true);
                 }
            });
            this.Wild_Animation.setAnimation(0,'open',false);
        }
    }


    

});
