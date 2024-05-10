var EffectType = require('EffectType');

cc.Class({
    extends: require("SpinEffectBase"),

    ctor()
    {
        this.stakePos_Array = [];

        this.itemPos_Array = [];

        this.startMultiEffect_Pos = null;

        this.ITEM_WILD = 2;
        this.stakeIndex = 0;
        this.CurrentMulti = 2;

        this.effectMulti_Array = [];

        this.deQuyTichLuy = 0;
        this.tichluyArray = [];
        this.wildActionIndex = 0;
        this.wildActionTotal = 0;
    },

    properties: {
        HeartParticle_Prefab: cc.Prefab,
        LineEffect_Prefab: cc.Prefab,
        PuperParticle_Prefab: cc.Prefab,
        FreeSymbolEffect : sp.Skeleton,

        tichLuy_Array : [cc.Node],
        Multi_Object : cc.Sprite,
        RedBar_Full : sp.Skeleton,
        StakeCollection : cc.Node,

        Multi_Sprite : [cc.SpriteFrame],
        Multi_Img_Effect : cc.Sprite,

        Bigwin_Effect : require("Tw_BigwinEffect"),
        EffectNode : cc.Node,
        EndPopup_Content :  cc.Node,
        EndPopup_Lb :  cc.Label,
    },
    
    SpinEffect_Setup()
    {
        this.AudioController =   require("AudioController_V2").getIns();

        this.stakeIndex = 0;
        this.spinController = require("Tw_Freespin_Controller").getIns();
        this.spinController.setEffectView(this);

        this.StakeCollection_Animation = this.StakeCollection.getComponent("cc.Animation");

        this.SetupPosArray();
        this.FreeSymbolEffect.node.active = false;
        this.Multi_Img_Effect.node.active = false;
        this.Bigwin_Effect.node.active = false;
       
        this.ShowAnimation_StakeCollection();
        this.EndPopup_Content.active = false;    
    },

    SpinEffect_RemainSetup(packet)
    {
        let _ExtendMatrixDescription = packet[11];
        let descriptionString = String(_ExtendMatrixDescription);
        if (descriptionString.includes("|")) 
        {
            var parts = _ExtendMatrixDescription.split("|");
            var multi = parseInt(parts[0], 10);
            this.CurrentMulti = multi;
            var stakeParts = parts[1].split("/");
            // stakeParts[0] là số lượng stake
            var stakeCount = parseInt(stakeParts[0], 10);
            // stakeParts[1] là tổng số stake
            var totalStake = parseInt(stakeParts[1], 10);
            this.stakeIndex =  stakeCount;

        
            this.Multi_Object.spriteFrame = this.Multi_Sprite[this.CurrentMulti - 2];
            this.ShowAnimation_StakeCollection();
        }
    },

  

    ShowEffect(type, rewardAmount , time)
    {
     

    },

    ResetAllEffect()
    {
        this.unscheduleAllCallbacks();
        for(let i=0;i<this.effectMulti_Array.length;i++)
        {
            this.effectMulti_Array[i].destroy();
        }
        this.wildActionIndex = 0;
        this.wildActionTotal = 0; 
        //this.stakeIndex = 0;
    },

    SetupPosArray()
    {
        this.stakePos_Array[0] = cc.v2(-255,345);
        this.stakePos_Array[1] = cc.v2(-80,345);
        this.stakePos_Array[2] = cc.v2(190,345);
        this.stakePos_Array[3] = cc.v2(365,345);


    this.itemPos_Array[0] = cc.v2(-325,210);
    this.itemPos_Array[1] = cc.v2(-135,210);
    this.itemPos_Array[2] = cc.v2(50,210);
    this.itemPos_Array[3] = cc.v2(240,210);
    this.itemPos_Array[4] = cc.v2(430,210);


    this.itemPos_Array[5] = cc.v2(-325,30);
    this.itemPos_Array[6] = cc.v2(-135,30);
    this.itemPos_Array[7] = cc.v2(50,30);
    this.itemPos_Array[8] = cc.v2(240,30);
    this.itemPos_Array[9] = cc.v2(430,30);


    this.itemPos_Array[10] = cc.v2(-325,-150);
    this.itemPos_Array[11] = cc.v2(-135,-150);
    this.itemPos_Array[12] = cc.v2(50,-150);
    this.itemPos_Array[13] = cc.v2(240,-150);
    this.itemPos_Array[14] = cc.v2(430,-150);  

    this.startMultiEffect_Pos = cc.v2(55,345);  

    this.EndEffect_Pos = cc.v2(55,30);  

    },

    ShowAnimation_FinishSpin(spinResponseData)
    {
        this.spinResponseData = spinResponseData;
        let matrix = spinResponseData[2];
        let _ExtendMatrixDescription =  spinResponseData[14];
        let totalReward =  spinResponseData[9];
        this.totalReward = totalReward;
        var parts = _ExtendMatrixDescription.split("|");
        var multi = parseInt(parts[0], 10);
        this.CurrentMulti = multi;
        var stakeParts = parts[1].split("/");
        // stakeParts[0] là số lượng stake
        var stakeCount = parseInt(stakeParts[0], 10);
        // stakeParts[1] là tổng số stake
        var totalStake = parseInt(stakeParts[1], 10);

       
        this.ShowAnimation_MultiItem(spinResponseData)

     
    },

    ShowAnimation_All_TichLuy(numberArray)
    {   ++this.wildActionIndex;
        if(this.wildActionIndex <  this.wildActionTotal)
        {            
            return 0;
        }
        this.tichluyArray = [];
        this.deQuyTichLuy = 0;
        for(let i=0;i< numberArray.length;i++)
        {
            if(numberArray[i] != this.ITEM_WILD)
                continue;
                this.tichluyArray.push(i);
        }
       this.ShowAnimation_TichLuy(this.tichluyArray[this.deQuyTichLuy++]);
       return this.tichluyArray.length;
       
    },

    ShowAnimation_TichLuy(matrixIndex)
    {
        if(this.deQuyTichLuy > this.tichluyArray.length)
        {
            this.spinController.Handle_AutoRespin();
            return;
        }

        this.AudioController.audioPool.playStart_MultiEffect();

        var startPosition = this.itemPos_Array[matrixIndex];
        var endPosition = this.stakePos_Array[this.stakeIndex];
      
       
        this.FreeSymbolEffect.node.active = true;
        this.FreeSymbolEffect.node.setPosition(startPosition);
        this.FreeSymbolEffect.setAnimation(0,'animation',false);

        var puperParticle = cc.instantiate(this.LineEffect_Prefab);
        puperParticle.setPosition(startPosition);
        this.EffectNode.addChild(puperParticle);

        // Tạo action di chuyển đến vị trí của stake
        var moveToAction = cc.moveTo(0.5, endPosition);

        // Tạo action delay 1 giây
        var delayAction = cc.delayTime(0.5);

        // Tạo action destroy particle
        var destroyAction = cc.callFunc(function () {
            this.FreeSymbolEffect.node.active = false;
            puperParticle.destroy();
            this.ShowAnimation_StakeCollection();
        }, this);

        // Tạo điểm trung gian cho đường cong Bézier
        var controlPoint = cc.v2((startPosition.x + endPosition.x) / 2, Math.max(startPosition.y, endPosition.y));

        // Tạo action di chuyển đến vị trí của stake theo đường cong Bézier
        var bezierToAction = cc.bezierTo(0.5, [startPosition, controlPoint, endPosition]);

        // Thay thế moveToAction bằng bezierToAction
        var sequence = cc.sequence(bezierToAction, delayAction, destroyAction);

        // Thực hiện sequence trên particle
        puperParticle.runAction(sequence);
 
        this.stakeIndex++;
        if( this.stakeIndex > 4)
        this.stakeIndex = 0;
    },

   ShowAnimation_StakeCollection()
   {
        if(this.stakeIndex == 0)
        {
            for(let i=0;i< this.tichLuy_Array.length;i++)
            {
                this.tichLuy_Array[i].active = false;
            }
        }
        else
        {
            let animationName = "";
           switch(this.stakeIndex)
           {
            case 1:
                animationName = "Stake_Level_1";
                break;
            case 2:
                animationName = "Stake_Level_2";
                break;
            case 3:
                animationName = "Stake_Level_3";
                break;
            case 4:
                animationName = "Stake_Level_4";
                break;
           }

        

           let callBack = ()=>{
            this.StakeCollection_Animation.off("finished" , callBack);
          
           
            if(this.stakeIndex == 4)
            {
                this.ShowAnimation_StakeFull();         
            }
            else
            {
                this.ShowAnimation_TichLuy(this.tichluyArray[this.deQuyTichLuy++]);
            }
            
          
            
           }
           this.StakeCollection_Animation.on("finished" ,callBack );
           this.StakeCollection_Animation.play(animationName);
        }
   },

   ShowAnimation_StakeFull()
   {
     this.RedBar_Full.node.active = true;

     for(let i=0;i< this.tichLuy_Array.length;i++)
     {
         this.tichLuy_Array[i].active = false;
     }

     this.RedBar_Full.setCompleteListener((trackEntry) => {
        if (trackEntry.animation.name === 'animation') {
            this.RedBar_Full.node.active = false;
            this.stakeIndex = 0
            this.ShowAnimation_StakeCollection();
            this.ShowAnimation_NextLevel();
         }
    });
    this.RedBar_Full.setAnimation(0,'animation',false);
   },

   ShowAnimation_NextLevel()
   {

    let animationName = "Stake_NextLevel";
    let callBack = ()=>{
     this.StakeCollection_Animation.off("finished" , callBack);
     this.Multi_Object.spriteFrame = this.Multi_Sprite[this.CurrentMulti - 2];

     this.ShowAnimation_TichLuy(this.tichluyArray[this.deQuyTichLuy++]);
 
   
    }
    this.StakeCollection_Animation.on("finished" ,callBack );
    this.StakeCollection_Animation.play(animationName);
   },




   // update wild multi 
   ShowAnimation_MultiItem(spinResponseData)
   {
        let matrixString = spinResponseData[2];
        let rewardLineArrayString = spinResponseData[3];


        let rewardLineArray = rewardLineArrayString.split(',').map(Number);
        var matrix = matrixString.split(',');
        let wildArray = [];

        for(let i=0;i< matrix.length;i++)
        {
            if(matrix[i] != this.ITEM_WILD)
                continue;
            for(let j=0;j< rewardLineArray.length;j++)
            {
              let isWinningLineContainsItemId =  require("AllwayLineManager").getIns().checkWinningLine(i,rewardLineArray[j]-1);
              if(isWinningLineContainsItemId)
              {
                wildArray.push(i);
                break;
              }
            }
        }

        if(wildArray.length == 0)
        {
            this.FinishAllEffect();
            return;
        }
        this.wildActionIndex = 0;
        this.wildActionTotal = wildArray.length; 

       
        for(let i=0;i< wildArray.length;i++)
        {
            var endPosition =  this.itemPos_Array[wildArray[i]];
            this.Animation_MultiItem(endPosition);
           
        } 
   },

   Animation_MultiItem(endPosition)
   {
        this.AudioController.audioPool.playStart_LightEffect();

        var puperParticle = cc.instantiate(this.PuperParticle_Prefab);
        puperParticle.setPosition(this.startMultiEffect_Pos);
        this.EffectNode.addChild(puperParticle);
        // Tạo điểm kiểm soát cho đường S
        var controlPoint1 = cc.v2(this.startMultiEffect_Pos.x + 40, this.startMultiEffect_Pos.y);
        var controlPoint2 = cc.v2(endPosition.x -  40, endPosition.y );

        // Tạo action di chuyển theo đường S
        var cardinalSplineToAction = cc.cardinalSplineTo(1, [this.startMultiEffect_Pos, controlPoint1, controlPoint2, endPosition], 0);
            // Tạo action delay 1 giây
        var delayAction = cc.delayTime(0.5);

        // Tạo action destroy particle
        var destroyAction = cc.callFunc(function () {
      
            puperParticle.destroy();
            this.ShowAnimation_MultiImg_Start_Effect(endPosition);                
        }, this);

        // Tạo sequence để chạy các action liên tiếp
        var sequence = cc.sequence(cardinalSplineToAction, delayAction, destroyAction);

        // Thực hiện sequence trên particle
        puperParticle.runAction(sequence);
   },

   ShowAnimation_MultiImg_Start_Effect(startPosition)
   {
    var multiImgEffect_Obj = cc.instantiate(this.Multi_Img_Effect.node);
    multiImgEffect_Obj.setPosition(startPosition);
    multiImgEffect_Obj.setScale(cc.v2(1,1));
    multiImgEffect_Obj.active = true;
    let multiImgEffect = multiImgEffect_Obj.getComponent(cc.Sprite);
    multiImgEffect.spriteFrame = this.Multi_Sprite[this.CurrentMulti - 2];   
    this.EffectNode.addChild(multiImgEffect_Obj);
   
    let multiImgEffect_Animation = multiImgEffect_Obj.getComponent(cc.Animation);
    let callBack = ()=>{
          
        multiImgEffect_Animation.off("finished" , callBack);
        multiImgEffect_Animation.play("MultiImg_ScaleLoop_Animation");  
        this.ShowAnimation_HeartEffect_Start(startPosition);
       }
       multiImgEffect_Animation.on("finished" ,callBack );
       multiImgEffect_Animation.play("MultiImg_Animation");

       this.effectMulti_Array.push(multiImgEffect_Obj);
   },

   ShowAnimation_HeartEffect_Start(startPosition) {
        var endPosition = this.EndEffect_Pos;
        var heartParticle = cc.instantiate(this.HeartParticle_Prefab);
        heartParticle.setPosition(startPosition);
        this.EffectNode.addChild(heartParticle);

        // Tạo điểm kiểm soát cho đường S
        var controlPoint1 = cc.v2(startPosition.x, startPosition.y + 100);
        var controlPoint2 = cc.v2(endPosition.x, endPosition.y -  100);

        // Tạo action di chuyển theo đường S
        var cardinalSplineToAction = cc.cardinalSplineTo(1, [startPosition, controlPoint1, controlPoint2, endPosition], 0);

        // Tạo action delay 1 giây
        var delayAction = cc.delayTime(0.5);

        // Tạo action destroy particle
        var destroyAction = cc.callFunc(function () {
            heartParticle.destroy();
            this.FinishAllEffect();
        }, this);

        // Tạo sequence để chạy các action liên tiếp
        var sequence = cc.sequence(cardinalSplineToAction, delayAction, destroyAction);

        // Thực hiện sequence trên particle
        heartParticle.runAction(sequence);
    },

    FinishAllEffect()
    {
        let matrix = this.spinResponseData[2];
        let _NumberFreeSpin = this.spinResponseData[7];
     
        var numberArray = [];
        // Tách chuỗi thành mảng chuỗi con bằng dấu phẩy
        var stringArray = matrix.split(',');

        // Chuyển đổi mỗi chuỗi thành số nguyên và thêm vào mảng số nguyên
        stringArray.forEach(function (str) {
            numberArray.push(parseInt(str, 10));
        });
        let minBigwinValue = (this.spinController.CurrentRoomConfig.Bet * 6);
        let isShowBigwin =   this.totalReward > minBigwinValue;
        let timeShowEndPopup = 0;
        if(isShowBigwin)
        {
            timeShowEndPopup = 4.5;
            this.spinController.audioPool.playSound_Bigwin();
            this.Bigwin_Effect.Tw_Bigwin_Setup(this.totalReward,true);
            this.scheduleOnce(()=>{
                this.Bigwin_Effect.node.active = false;
               let tichLuyAnimTime = this.ShowAnimation_All_TichLuy(numberArray);
            },3);
        }
        else
        {
            timeShowEndPopup = 2;
            this.ShowAnimation_All_TichLuy(numberArray);
        }

     
        if(_NumberFreeSpin == 0)
        {
        
            this.scheduleOnce(()=>{
                this.ShowAnimation_EndPopup();
            },timeShowEndPopup);
        }
    
    },

    ShowAnimation_EndPopup()
    {
        cc.log(" this.spinController.totalFreeturnReward: "+ this.spinController.totalFreeturnReward);
        this.EndPopup_Lb.string =  cc.Tool.getInstance().formatNumber(this.spinController.totalFreeturnReward);
        this.EndPopup_Content.active = true;

        this.scheduleOnce(()=>{
            let spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController();
            spinController.mainView.Destroy_FreeGameView();
        },5);
    }

   

   
  
});
