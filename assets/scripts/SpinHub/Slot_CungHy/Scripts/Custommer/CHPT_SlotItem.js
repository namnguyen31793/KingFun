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
        this.itemData = '';
        this.ITEM_WILD_1 = 1;
        this.ITEM_WILD_2 = 2;
        this.itemId = 0;
    },
    properties: {
        MaskHide : cc.Node,
        WinEffect : cc.Node,
        Red_Backgroud : cc.Sprite,
       
    },

    SlotItem_Setup(itemId,parentColumn,itemIndex = 0)
    {
        
       this.itemData = itemId.toString();

        
        let integerValue = parseInt(this.itemData);
        this.itemId = integerValue;  
        this.ParentColumn = parentColumn;
        
        this.AfterSetup(itemIndex);
        this.SetItem_Img();
        this.SetItem_Animation();
        this.FinishSetup();
       
    },

    SlotItem_Setup_Parent(parentColumn)
    {
        this.ParentColumn = parentColumn;
    },

    SetupWhenOnLoad()
    {
        this._super();
       
        if(this.MaskHide)
            this.MaskHide.active = false;         
        if(this.WinEffect)  
            this.WinEffect.active = false;
        if(this.slotItem_Animation)
            this.slotItem_Animation.skeletonData = null;        
        this.Enable_SlotItem_Animation(false);
        
        this.EnableRedBackgroud(false);
       
    },
    EnableRedBackgroud(enable)
    {     
        if( this.Red_Backgroud)
            this.Red_Backgroud.node.active = enable;
    },

    EnabelVFX_GongEffect(enable)
    {
        if(this.VFX_GongEffect)
            this.VFX_GongEffect.active = enable;
    },

    ChangeWildBackgroundFrame(wildBackgroudFrame)
    {
      
        this.Red_Backgroud.spriteFrame = wildBackgroudFrame;
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

        if(this.slotItem_Animation)
        {
            this.slotItem_Animation.skeletonData = null;
            this.Enable_SlotItem_Animation(false);
        }
        
    },

    SetItem_Animation(isShowAnimation = false)
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

        if(isShowAnimation && this.slotItem_Animation.findAnimation("animation"))
        this.slotItem_Animation.setAnimation(0, "animation", true);

        /*
        if(!isShowAnimation && this.slotItem_Animation.findAnimation(""))
            this.slotItem_Animation.setAnimation(0, "", false);
        else
        {
            if(this.slotItem_Animation.findAnimation("animation"))
                this.slotItem_Animation.setAnimation(0, "animation", true);
        }
        */
           
        this.slotItem_Animation.setToSetupPose();
      
        if(this.slotItem_Animation)
        {
            this.Enable_SlotItem_Animation(true);
            this.slotItem_Img.node.active = false;
        }

        
        if(this.itemId == this.ITEM_WILD_1)
        {
            this.node.setSiblingIndex(-1);
            if(this.slotItem_Animation.findAnimation("Wild_Idle"))
                this.slotItem_Animation.setAnimation(0, "Wild_Idle", true);
        }
        else
        {
            this.node.setSiblingIndex(1);
        }
        
    },

    Show_MaskItem()
    {        
        /*
        if( this.MaskHide)
        this.MaskHide.active = true;
        */
    },
    ShowAnimation_WinItem()
    {
        if( this.MaskHide)
            this.MaskHide.active = false;
        
        if(this.WinEffect)  
            this.WinEffect.active = true;
        this.ShowAnimation_WinItem_Skeleton();
      
    },
    ShowAnimation_WinItem_Skeleton()
    {
        if( this.slotItem_Animation.skeletonData != null)
        {
            this.Enable_SlotItem_Animation(true);
          
            if(this.slotItem_Animation.findAnimation("Wild_Appear") && this.slotItem_Animation.findAnimation("Wild_Idle"))
            {
                
                this.slotItem_Animation.setAnimation(0, "Wild_Appear", false);
                this.slotItem_Animation.addAnimation(0, "Wild_Win", true);
                this.slotItem_Animation.setMix("Wild_Appear", "Wild_Win", .1);
                
                //this.slotItem_Animation.setAnimation(0, "Wild_Idle", true);
            }
            else
            {
                this.slotItem_Animation.setAnimation(0,'animation', true);
            }
            
        }
    },
    Item_ResetEffect()
    {
        this._super();

        //this.node.setSiblingIndex(1);

        if(this.MaskHide)
            this.MaskHide.active = false;   
        if(this.WinEffect)
            this.WinEffect.active = false;    
        if(this.Red_Backgroud)
            this.Red_Backgroud.active = false;
       
        this.EnabelVFX_GongEffect(false);
        if(this.slotItem_Animation)
        {
           
            //this.Enable_SlotItem_Animation(false);
            //this.slotItem_Animation.skeletonData = null;
        }
        
    },
    setDefaultValue(itemValue)
    {
       
        let itemData =  itemValue.toString();
     
        let integerValue = parseInt(itemData);
        this.itemId = integerValue;

        this.SetItem_Img();
        this.SetItem_Animation(true);
        this.FinishSetup();   
    },

    CreateVfxGong(vfxGongItem)
    {  
        const instance = cc.instantiate(vfxGongItem);      
        return  instance;
    },

     // goi khi cot quay xong 
     FinishColumnSpin()
     {
        if(this.ParentColumn.numberOffSet == 0)
        {
            this.ShowAnimation_ShakeWildAnim();
        }
     },

     ShowAnimation_ShakeWildAnim()
     {
        if(this.itemId == this.ITEM_WILD_2 )
        {
            this.node.stopAllActions();

            this.slotItem_Animation.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === 'Shake') { 
                    this.slotItem_Animation.setAnimation(0,'Idle',true);
                    
                 }
            });
        
            this.slotItem_Animation.setAnimation(0,'Shake',false);
            this.slotItem_Animation.timeScale = 1.5;
           
        }         
     },

     ShowAnimation_SpinWildAnim()
     {
        if(this.itemId == this.ITEM_WILD_2 )
        {         
            this.slotItem_Animation.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === 'Spin') { 
                    this.slotItem_Animation.setAnimation(0,'Idle',true);             
                 }
            });
            

            //this.slotItem_Animation.timeScale = 1;
            this.slotItem_Animation.setAnimation(0,'Spin',false);
           // 
           
        }         
     },

});  
