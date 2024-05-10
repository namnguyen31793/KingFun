// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require('SlotItem'),

    ctor()
    {
        this.scater_Value = 0;
        this.itemData = '';
    },
    properties: {
        MaskHide : cc.Node,
        WinEffect : cc.Node,
        Scater_Lb : cc.Label,
       
    },

    SlotItem_Setup(itemId,parentColumn,itemIndex = 0)
    {
        if(itemId === null || itemId === undefined)
            cc.log("itemIndex: "+itemIndex);
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
            this.Scater_Lb.node.active = true;
            this.Scater_Lb.string = decimalPart;
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
    SetupWhenOnLoad()
    {
        this._super();
       
        this.MaskHide.active = false;   
        this.WinEffect.active = false;
        this.slotItem_Animation.skeletonData = null;
        this.slotItem_Animation.node.active = false;
        this.Scater_Lb.node.active = false;
        this.scater_Value = 0; 
    },
    SetItem_Img()
    {
        let slotSprite  =null;
        let itemIndex = this.itemId -1;
        if(this.ParentColumn.icons[itemIndex] === 'undefined' || this.ParentColumn.icons[itemIndex] === null)
            return;
        slotSprite = this.ParentColumn.icons[itemIndex];
        this.slotItem_Img.spriteFrame = slotSprite;

        this.isShow_slotItem_Img = true;
        this.isShow_slotItem_Anim = false;

        this.slotItem_Img.node.active = true;

        this.slotItem_Animation.skeletonData = null;
        this.slotItem_Animation.node.active = false;  
        
    },

    SetItem_Animation()
    {
        let animationData = null;
        let itemIndex = this.itemId -1;
        if(this.slotItem_Animation == null)
            return;
        if(this.ParentColumn.skeletonDataIcons[itemIndex] === 'undefined' || this.ParentColumn.skeletonDataIcons[itemIndex] === null)
            return;
        animationData = this.ParentColumn.skeletonDataIcons[itemIndex];

        if(animationData == null)
        return;

        this.isShow_slotItem_Anim = true;
        this.slotItem_Animation.skeletonData = animationData;
       
        this.slotItem_Animation.setAnimation(0, "", false);
        this.slotItem_Animation.setToSetupPose();
      
        this.slotItem_Animation.node.active = true;
        this.slotItem_Img.node.active = false;
    },

    Show_MaskItem()
    {
        this.MaskHide.active = true;
    },
    ShowAnimation_WinItem()
    {
        this.itemAnimation.play("TW_Item_Win");
        this.ShowAnimation_WinItem_Skeleton();
      
    },
    ShowAnimation_WinItem_Skeleton()
    {
        if( this.slotItem_Animation.skeletonData != null)
        {
            this.slotItem_Animation.node.active = true;
            if(this.slotItem_Animation.findAnimation('with_frame'))
                this.slotItem_Animation.setAnimation(0,'with_frame', true);
            else
                this.slotItem_Animation.setAnimation(0,'animation', true);
        }
    },
    Item_ResetEffect()
    {
        this._super();
        this.MaskHide.active = false;   
        this.WinEffect.active = false;    
        /*
        this.slotItem_Animation.node.active = false;
        this.slotItem_Animation.skeletonData = null;        
        this.Scater_Lb.node.active = false;
        */
        this.scater_Value = 0; 
        this.Scater_Lb.string = '';
    },
    setDefaultValue(itemValue,parrentColumn)
    {
       
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
        }else
        {
            let integerValue = parseInt(itemData);
            this.itemId = integerValue;
            this.Scater_Lb.node.active = false;
        }

        if(this.ParentColumn == null && parrentColumn != null)
        this.ParentColumn = parrentColumn;

        this.itemData = itemData;
        this.SetItem_Img();
        this.SetItem_Animation();
        this.FinishSetup();   
       
    },


});
