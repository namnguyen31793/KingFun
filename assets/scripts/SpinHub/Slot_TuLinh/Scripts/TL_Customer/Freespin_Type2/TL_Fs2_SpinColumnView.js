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
    onLoad () {
        this._super();
        if(this.nodeWild != null)
            this.Wild_Animation = this.nodeWild.getComponent("sp.Skeleton");
    },
	 GetSpinController()
    {
        return  require("TL_Fs2_SpinController").getIns();
    },

    setIcon(indexIcon, iconId)
    {
        if (this.freeSpinController && this.freeSpinController.getStateFreeSpin() && this.freespinIcons && this.skeletonDataIconsFs ) {
            
        }
        else
        {
            if(this.skeletonDataIcons[iconId - 1] !== 'undefined' && this.skeletonDataIcons[iconId - 1] !== null)
                this.skeletonIcons[indexIcon] = this.skeletonDataIcons[iconId - 1];
            else
            {
            this.spriteIcons[indexIcon].enabled = true;
            this.spriteIcons[indexIcon].spriteFrame = this.icons[iconId - 1];   
            }
            
             
        }
    },


    spin: function (isNearWin = false) {
        this.unscheduleAllCallbacks();
        this.Column_ResetEffect();
        //Tat Expand WILD
        if(this.nodeWild != null)
            this.nodeWild.active = false;
          
        
        this.loopSpinIndex = 0;
       
            isNearWin = false;
        
       this.ShowAnimation_Spin(isNearWin);

       this.scheduleOnce(()=>{
        this.ShowAnimation_Stop();
       },1);
      
    },

    ShowAnimation_Spin(isNearWin)
    {  
        let seft = this;
        let loopCount = 0;
        for(let i=0;i< this.itemSlot_Array.length;i++)
        {
            this.itemSlot_Array[i].ShowAnimation_SubColumn_Spin();
        }
    
     
        
    },

    ShowAnimation_Stop()
    {
        this.setData();
        for(let i=0;i< this.itemSlot_Array.length;i++)
        {
            this.itemSlot_Array[i].ShowAnimation_SubColumn_Stop();
        }
            // cho dien het animation o trong item.
            this.spinController.stopSpinFinish();
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
    },
    setData: function () {
      
        let spinData =  this.spinController.getLastSpinResponseData();
        let matrix = spinData[2];
        let parts = matrix.split("|");
   
        let firstMatrix = parts[0];
      
        //let itemArrays = cc.Tool.getInstance().convertStringArrayToIntArray(firstMatrix);
        let itemArrays = firstMatrix.split(',');
        let matrixTemp = cc.Tool.getInstance().listToMatrix(itemArrays, 5);
        //this.matrixData = 
        
        let expanderWildCounter = 0;

        for (var i = 1; i <= 3; i++) {
          
            let itemIndex = (5*(i-1) + this.colId) 
            var iconId = matrixTemp[i - 1][this.colId]; 
            this.itemSlot_Array[i].SlotItem_Setup(iconId,this,itemIndex);
  
        }
       
    },

    SetupDefaultData(defaultMatrix)
    {
        let itemArrays = defaultMatrix.split(',');
        let matrixTemp = cc.Tool.getInstance().listToMatrix(itemArrays, 5);
        for (var i = 1; i <= 3; i++) {
          
            let itemIndex = (5*(i-1) + this.colId) 
            var itemData  = matrixTemp[i - 1][this.colId]; 
            this.itemSlot_Array[i].setDefaultValue(itemData,this);
  
        }
    }

});
