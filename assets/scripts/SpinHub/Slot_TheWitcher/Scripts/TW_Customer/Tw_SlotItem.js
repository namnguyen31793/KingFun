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
        this.isHasSwortItem = false;
        this.isShow_slotItem_Img = false;
        this.isShow_slotItem_Anim = false;
        this.itemIndex = 0;
        this.SCARTER_ID = 3;
        this.S1_ID = 1;
    },
    properties: {
       SwortItem : cc.Node,
       MaskHide : cc.Node,
       WinEffect : cc.Node,
       Wild_Column_1_Sprite : cc.SpriteFrame,
       Wild_Column_2_Sprite : cc.SpriteFrame,
    },
    SetupWhenOnLoad()
    {
        this._super();
        this.SwortItem.active = false;   
        this.MaskHide.active = false;   
        this.WinEffect.active = false;
        this.slotItem_Animation.skeletonData = null;
    },
    
    AfterSetup(itemIndex = 0)
    {
       
        this.isShow_slotItem_Img = false;
        this.isShow_slotItem_Anim = false;

        this._super(itemIndex);
        
        // danh cho nhung game xu ly item theo quy dinh
        this.preID = this.itemId;
        this.isHasSwortItem =  this.preID  > 20;

        if(this.isHasSwortItem)
            this.itemId = this.S1_ID;
        else
            this.itemId = this.preID;
        //this.itemId % 20;

       
        this.SwortItem.active =  this.isHasSwortItem ;

        this.slotItem_Img.node.active = !this.isHasSwortItem;

      
        this.SwortItem.setPosition(cc.v2(0,0));
        this.SwortItem.setScale(cc.v2(1,1));
        this.itemIndex =  itemIndex;
    },

    FinishSetup()
    {
        this._super();
        if(this.isHasSwortItem)
        {
            this.slotItem_Img.node.active = false;
            this.slotItem_Animation.node.active = false;     
        }
    },
   

    SetItem_Img()
    {   
        let slotSprite  =null;
        let itemIndex = this.itemId -1;

        if(this.ParentColumn.icons[itemIndex] !== 'undefined' && this.ParentColumn.icons[itemIndex] !== null)
            slotSprite = this.ParentColumn.icons[itemIndex];

        if(this.itemId == 2)
        {
            if(this.ParentColumn.colId == 0)
                slotSprite = this.Wild_Column_1_Sprite;
            else if(this.ParentColumn.colId == 4)
                slotSprite = this.Wild_Column_2_Sprite;            
        }

       
        this.slotItem_Img.spriteFrame = slotSprite;

        this.isShow_slotItem_Img = true;
        this.isShow_slotItem_Anim = false;

        
        this.slotItem_Img.node.active = !this.isHasSwortItem;
        this.slotItem_Animation.node.active = false;           
    },


    SetItem_Animation()
    {

        let animationData = null;
        let itemIndex = this.itemId -1;
        if(this.slotItem_Animation == null)
            return;

    
        if(this.ParentColumn.skeletonDataIcons[itemIndex] !== 'undefined' && this.ParentColumn.skeletonDataIcons[itemIndex] !== null)
            animationData = this.ParentColumn.skeletonDataIcons[itemIndex];
        
        if(animationData == null)
            return;
 
        this.isShow_slotItem_Anim = true;
        this.slotItem_Animation.skeletonData = animationData;
       // this.slotItem_Animation.setSkeletonData(animationData);
      
       // this.slotItem_Animation.setSkeletonData(animationData);
       if(this.itemId == this.SCARTER_ID)
       {
            this.slotItem_Animation.setAnimation(0, "animation", false);
            this.slotItem_Animation.paused = true;
            this.slotItem_Animation.node.setPosition(cc.v2(6,1));
       }
       else
       {
            this.slotItem_Animation.setAnimation(0, "", false);   
            this.slotItem_Animation.setToSetupPose(); 
            this.slotItem_Animation.node.setPosition(cc.v2(0,0));
       }
        
       
       // this.slotItem_Animation.setAnimation(0, 'animation', true);
        this.slotItem_Animation.node.active = true;
    },

    ShowAnimation_SwortItem()
    {
        this.SwortItem.active = true;

       
        //this.itemId % 20;

        if(this.isHasSwortItem)
        {        
            this.EnableItemImg(true);
            this.itemId = this.preID % 20;
            this.SetItem_Img();
            this.SetItem_Animation();

            let callBack = ()=>{
                this.itemAnimation.off("finished" , callBack);
               
            }
            this.itemAnimation.on("finished" ,callBack );
            this.itemAnimation.play("TW_SwortItem_Animation");
            this.slotItem_Img.node.active = this.isShow_slotItem_Img;
            this.slotItem_Animation.node.active = this.isShow_slotItem_Anim;             
        }
      
    },

    // goi khi quay xong tat ca
    FinishSpin()
    {
        if(this.isHasSwortItem)
            this.ShowAnimation_SwortItem();   
    },

    // goi khi cot quay xong 
    FinishColumnSpin()
    {
        /*
        if(this.isHasSwortItem)
        {
                           
        } 
        */  
    },

    Show_MaskItem()
    {
        this.MaskHide.active = true;
    },
    ShowAnimation_WinItem()
    {
        this.itemAnimation.play("TW_Item_Win");

        if( this.slotItem_Animation.skeletonData != null)
        {
            this.slotItem_Animation.node.active = true;
            this.slotItem_Animation.setAnimation(0, 'animation', true);
        }
    },
    Item_ResetEffect()
    {
        this._super();
        this.SwortItem.active = false;   
        this.MaskHide.active = false;   
        this.WinEffect.active = false;
        this.slotItem_Animation.skeletonData = null;
        this.slotItem_Animation.node.active = false;
        this.slotItem_Img.node.active = false;
    },

    EnableItemImg(enable)
    {
        this.slotItem_Img.node.active = enable;
        this.slotItem_Animation.node.active = enable;    
    }

});
