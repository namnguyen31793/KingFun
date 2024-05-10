// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require('TL_SlotItem'),
    ctor()
    {
        this.ITEM_BLUE_WILD = 3;
        this.ITEM_GREEN_WILD = 4;
        this.ITEM_YELLOW_WILD = 5;
    },
    properties: {
       SubColumn_Animation:  cc.Animation
    },

    // LIFE-CYCLE CALLBACKS:

    SetupWhenOnLoad()
    {
       this._super();
       this.isSpin = true;
    },
   

    ShowAnimation_SubColumn_Spin()
    {
        if(!this.isSpin)
            return;
        this.itemAnimation.play("Freespin_T2_ItemSpin");
       
    },
    ShowAnimation_SubColumn_Stop()
    {
        let callBack = ()=>{         
            this.itemAnimation.off("finished" , callBack);         
           }
           this.itemAnimation.on("finished" ,callBack );
           this.itemAnimation.play("Freespin_T2_ItemSpin_Stop");
    },
    randomIcon_Blur(indexIcon)
    {
            length = this.ParentColumn.icons_Blur.length;
            let iconId = Math.floor((Math.random() * length));

            this.setIcon_Blur(parseInt(indexIcon.toString()), iconId);
       
    },
    setIcon_Blur(indexIcon, iconId)
    { 
            this.slotItem_Img.enabled = true;
            this.slotItem_Img.spriteFrame = this.ParentColumn.icons_Blur[iconId - 1];
    },

    setDefaultValue(itemValue,parrentColumn)
    {
        if(!this.isSpin)
        return;
        let itemData =  itemValue.toString();

        
        if (itemData.includes('.'))
        {
            this.isSpin = false;
             // Tách thành phần nguyên và phần thập phân
             let [integerPart, decimalPart] = itemData.split('.');
             // Chuyển phần nguyên và phần thập phân thành số nguyên
             integerPart = parseInt(integerPart);
             decimalPart = parseInt(decimalPart);
             this.itemId = integerPart;
             this.scater_Value = decimalPart;
             this.Scater_Lb.node.active = true;
             this.Scater_Lb.string = decimalPart;
        }
        else
        {
            this.isSpin = true;
            this.node.active = false;
            return;
        }
        if(this.ParentColumn == null && parrentColumn != null)
        this.ParentColumn = parrentColumn;
    
        this.itemData =itemData;
        this.SetItem_Img();
        this.SetItem_Animation();
        this.FinishSetup();   

      
    },

    SlotItem_Setup(itemId,parentColumn,itemIndex = 0)
    {
      
        if(!this.isSpin)
        return;
        this.node.active = true;
        this.itemData = itemId.toString();

        if (this.itemData.includes('.'))
        {
            // Tách thành phần nguyên và phần thập phân
            let [integerPart, decimalPart] = this.itemData.split('.');
            // Chuyển phần nguyên và phần thập phân thành số nguyên
            integerPart = parseInt(integerPart);
            decimalPart = parseInt(decimalPart);
            this.itemId = integerPart;
            this.scater_Value = decimalPart;
            this.Scater_Lb.string = decimalPart;
            if(integerPart == this.ITEM_BLUE_WILD)
                this.Scater_Lb.node.active = true;
            else
                this.Scater_Lb.node.active = false;
            this.isSpin = false;
        }
        else
        {
            let integerValue = parseInt(this.itemData);
            this.itemId = integerValue;
        }

        this.ParentColumn = parentColumn;
        
        this.AfterSetup(itemIndex);
        this.SetItem_Img();
        this.SetItem_Animation();
        this.FinishSetup();
       
    },

    Item_ResetEffect()
    {
        if(!this.isSpin)
        {
            this.Scater_Lb.node.active = true;
            return;
        }
        this._super();       
        this.MaskHide.active = false;   
        this.WinEffect.active = false;
        this.slotItem_Animation.skeletonData = null;
        this.Scater_Lb.node.active = false;
        this.scater_Value = 0; 
    },
    SetItem_Animation()
    {
        let animationData = null;
        let itemIndex = this.itemId -1;
        if(this.slotItem_Animation == null)
            return;
        if(this.ParentColumn == null)
        {
            this.ParentColumn = this.node.parent.getComponent("TL_Fs2_SpinColumnView");
        }
        if(this.ParentColumn.skeletonDataIcons[itemIndex] === 'undefined' || this.ParentColumn.skeletonDataIcons[itemIndex] === null)
            return;
        animationData = this.ParentColumn.skeletonDataIcons[itemIndex];

        if(animationData == null)
        return;

        this.isShow_slotItem_Anim = true;
        this.slotItem_Animation.skeletonData = animationData;
       
        this.slotItem_Animation.setAnimation(0, "animation", true);
        this.slotItem_Animation.setToSetupPose();
      
        this.slotItem_Animation.node.active = true;
    },

  
});
