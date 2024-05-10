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
        this.ITEM_WILD_1 = 1;
        this.ITEM_WILD_2 = 2;
        this.OFFSET_B1 = -1;
        this.OFFSET_B2 = -2;
        this.OFFSET_T1 = 1;
        this.OFFSET_T2 = 2;
        this.symbolArray = [1,2,3,4,5,6,7,8,9,10,11];
        this.symbolArrayWithOutWild = [3,4,5,6,7,8,9,10,11];
    },

    properties: {
        wildBackgroundFrames: [cc.SpriteFrame],
    },

    onLoad () {
        this._super();
        if(this.nodeWild != null)
            this.Wild_Animation = this.nodeWild.getComponent("sp.Skeleton");
        this.SetChilItem();
    },
    randomAllIcon()
    {
        this._super();
         
    },

    SetChilItem()
    {
        for (var i = 0; i < 8; i++) {
            this.itemSlot_Array[i].SlotItem_Setup_Parent(this);     
        }    
    },
   
 

    setIcon(indexIcon, iconId)
    {
        //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>> SET ICON ----------->>>>");
        this.spriteIcons[indexIcon].node.active = false;
        if(this.skeletonIcons[indexIcon])
            this.skeletonIcons[indexIcon].node.active = false;
        if (this.freeSpinController && this.freeSpinController.getStateFreeSpin() && this.freespinIcons && this.skeletonDataIconsFs ) {
            
        }
        else
        {
            if(this.skeletonIcons[indexIcon] && this.skeletonDataIcons[iconId - 1] !== 'undefined' && this.skeletonDataIcons[iconId - 1] !== null)
            {
                
                this.skeletonIcons[indexIcon].skeletonData = this.skeletonDataIcons[iconId - 1];            
                    if( this.skeletonIcons[indexIcon].findAnimation('with_frame'))
                        this.skeletonIcons[indexIcon].setAnimation(0,'with_frame', true);
                    else
                        this.skeletonIcons[indexIcon].setAnimation(0,'animation', true);
                this.skeletonIcons[indexIcon].node.active = true;
            }
            else
            {
            this.spriteIcons[indexIcon].node.active = true;
            this.spriteIcons[indexIcon].enabled = true;
            this.spriteIcons[indexIcon].spriteFrame = this.icons[iconId - 1];   
            }
          
           
        }
    },


    spin: function (isNearWin = false) {
        this.unscheduleAllCallbacks();
        this.numberOffSet = 0;
        this.Column_ResetEffect();
        //Tat Expand WILD
        if(this.nodeWild != null)
            this.nodeWild.active = false;
          
        
        this.loopSpinIndex = 0;
        if(this.colId < 3 && isNearWin)
            isNearWin = false;
        
       this.ShowAnimation_Spin(isNearWin);
    },
    stop:  function () {
      
        this.setData();

        this.isFastSpin = false;
        this.haveWild = false;
       
        let callBack = ()=>{  
           this.animCol.off("finished" , callBack);
           this.Item_FinishColumnSpin();
           }
           this.animCol.on("finished" ,callBack );

           let anim_Name = this.GetStopSpinAnimationName();
         


           this.animCol.play(anim_Name);


       
    },

    fastStop:  function () {
        this.isFastSpin = true;
        this.haveWild = false;      
        let callBack = ()=>{  
            this.animCol.off("finished" , callBack);
                this.Item_FinishColumnSpin();
            }
            this.animCol.on("finished" ,callBack );
            this.animCol.play("CH_ColumnStop");
 
        this.setData();
    },

    GetStopSpinAnimationName()
    {
        switch(this.numberOffSet)
        {
            case 1:
                return "CH_ColumnStop_T1";
            case 2:
                return "CH_ColumnStop_T2";
            case -1:
                return "CH_ColumnStop_B1";
            case -2:
                return "CH_ColumnStop_B2";     
        }
        return "CH_ColumnStop";
    },

    ShowAnimation_Spin(isNearWin)
    {  
        let seft = this;
        let loopCount = 0;
        let callBack = ()=>{ 
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
       
        this.animCol.on("finished" ,callBack );
        this.animCol.play("CH_ColumnSpin");    
      //  this.ShowAnimation_NearWin(isNearWin);    
    },
    ShowAnimation_NearWin(isNearWin)
    {
        if(isNearWin)
        {
            this.spinController.effectView.ShowEffect_NearWin();
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
    },
    setData: function () {
      
        let spinData =  this.spinController.getLastSpinResponseData();
        let matrix = spinData[2];
        let parts = matrix.split("|");
   
        let firstMatrix = parts[0];
      
        //let itemArrays = cc.Tool.getInstance().convertStringArrayToIntArray(firstMatrix);
      
        
        let expanderWildCounter = 0;

        this.isOffSet = 0;

        let alreadyAddedNumbers = [this.ITEM_WILD_1, this.ITEM_WILD_2];
        let topArray = [];
        let botArray = [];
        for(let i=0;i<15;i++)
        {
            topArray.push(this.GetRandomSymbolNameWithExceptions());
            botArray.push(this.GetRandomSymbolNameWithExceptions());
        }

        matrix = `${topArray.join(",")},${matrix},${botArray.join(",")}`;

        let itemArrays = matrix.split(',');
        let matrixTemp = cc.Tool.getInstance().listToMatrix(itemArrays, 5);

        for (var i = 1; i <= 8; i++) {
          
            let itemIndex = (5*(i-1) + this.colId)
            var iconId = matrixTemp[i - 1][this.colId]; 
            this.itemSlot_Array[i-1].SlotItem_Setup(iconId,this,itemIndex);
            if(4 <= i && i <=6 )
            {
                if(iconId == this.ITEM_WILD_1 || iconId == this.ITEM_WILD_2 )
                {
                    expanderWildCounter ++;
                }
            }
        }    

        if(expanderWildCounter == 3)
            this.numberOffSet = this.RandomOffsetNumber();
        
            this.ChangeWildBackgroudFrame();
        
    },
    ShowAnimation_Item()
    {
        for(let i=0;i< this.itemSlot_Array.length;i++)
        {
            this.itemSlot_Array[i].ShowAnimation_WinItem_Skeleton();          
        }
    },
     // goi khi quay xong tat ca 
    Item_FinishSpin()
    {
       for(let i=0;i< this.itemSlot_Array.length;i++)
       {
            this.itemSlot_Array[i]. ShowAnimation_ShakeWildAnim();
       }
       
       
      this.ShakeWild_Animation();
       
    },

    ShakeWild_Animation()
    {
        if(this.numberOffSet == 0)
        {   
             this.numberOffSet = 0;
             this.spinController.spinView.FinishAnimation_ItemBeforeSpin();
             return;
        }
        else
        {
            this.scheduleOnce(()=>{
                this.ShowAnimation_OffsetColumn();
            }, 2);
        
        }   
    },

    ShowAnimation_OffsetColumn()
    {
        let offsetSpinName = this.GetOffsetSpinName();
        if(offsetSpinName == "")
        {
             this.numberOffSet = 0;
             this.spinController.spinView.FinishAnimation_ItemBeforeSpin();
        }
        else
        {


            
            let self = this;
        let callBack = ()=>{
            self.animCol.off("finished" ,callBack );
         if(self.numberOffSet > 0)
         self.numberOffSet--;
         else if(self.numberOffSet < 0)
         self.numberOffSet++;
         self.Item_FinishSpin();
         //this.spinController.spinView.FinishAnimation_ItemBeforeSpin();
         }
     
         this.animCol.on("finished", callBack );
         this.animCol.play(offsetSpinName);    

         for(let i=0;i< this.itemSlot_Array.length;i++)
         {
              this.itemSlot_Array[i]. ShowAnimation_SpinWildAnim();
         }

         require("AudioController_V2").getIns().audioPool.playOffset_Fx_Sound();
         
        


         }   
    },

    GetOffsetSpinName()
    {
        switch(this.numberOffSet)
        {
            case 1:
                return "CH_ColumnStop_T1_Down";
            case 2:
                return "CH_ColumnStop_T2_Down";
            case -1:
                return "CH_ColumnStop_B1_Up";
            case -2:
                return "CH_ColumnStop_B2_Up";
        }
        return "";
    },
    RandomOffsetNumber() {       
        const numbers = [-2, -1, 0, 1, 2];
        return numbers[Math.floor(Math.random() * 5)];
    },

    GetRandomSymbolNameWithExceptions()
    {
        return this.symbolArrayWithOutWild[Math.floor(Math.random() * this.symbolArrayWithOutWild.length)];
    },

    ChangeWildBackgroudFrame()
    {
        let index = 0;
        for(let i=0;i< this.itemSlot_Array.length;i++)
        {
             if(this.itemSlot_Array[i].itemId == this.ITEM_WILD_1 || this.itemSlot_Array[i].itemId == this.ITEM_WILD_2)
             {
                this.itemSlot_Array[i].EnableRedBackgroud(true);
                this.itemSlot_Array[i].ChangeWildBackgroundFrame(this.wildBackgroundFrames[index]);
                index++;
             }
             else
             {
                this.itemSlot_Array[i].EnableRedBackgroud(false);
             }
        }
    },
    SetupDefaultData(defaultMatrix)
    {
        let itemArrays = defaultMatrix.split(',');
        let matrixTemp = cc.Tool.getInstance().listToMatrix(itemArrays, 5);
        let rowIndex = 3;
        for (var i = 1; i <= 3; i++) {
          
            let itemIndex = (5*(i-1) + this.colId) 
            var itemData  = matrixTemp[i - 1][this.colId]; 
            this.itemSlot_Array[rowIndex].setDefaultValue(itemData);
            ++rowIndex;
        }

        this.ChangeWildBackgroudFrame();
    }




    
});
