// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("SpinEffectBase"),

    ctor()
    {
        this.itemPos_Array = [];
        this.ngocXanh_Pos = null;
        this.ITEM_GREEN_WILD = 4;
        this.ITEM_BLUE_WILD = 3;
        this.ITEM_YELLOW_WILD = 5;
        this.ITEM_PLUS = 6;
        this.tichLuySum = 0;
        this.tichLuyLabelMap  = [];
        this.TIME_EFFECT = 500;
        this.wildParticle_Array = [];
        this.freeturn_Pos = null;
    },
    properties: {
        Blue_Item_Prefab : cc.Prefab,
        Yellow_Item_Prefab : cc.Prefab,
        Green_Item_Prefab : cc.Prefab,
        Plus_Item_Prefab  : cc.Prefab,
        EffectNode : cc.Node,
        NgocXanh : cc.Node,
        Extent_Lb : cc.Label,
        Jackpot_Content_Prefab: cc.Prefab,
        BigWin_Content_Prefab: cc.Prefab,
        FinishContent_Animation : cc.Animation,
        ExtendLabel_Prefab: cc.Prefab,
     },

     SpinEffect_Setup()
     {
        
         this.spinController = require("TL_Fs2_SpinController").getIns();
         this.spinController.setEffectView(this);
 
         this.SetupPosArray(); 
       
         /*  
         this.NgocXanh_Skeleton =  this.NgocXanh.getComponent(sp.Skeleton);
         this.Extent_Lb.node.active = false;
         
         this.FinishContent_Animation.node.active = false;
         */
     },

    SetupPosArray()
    {
       

    this.itemPos_Array[0] = cc.v2(-400,160);
    this.itemPos_Array[1] = cc.v2(-200,160);
    this.itemPos_Array[2] = cc.v2(0,160);
    this.itemPos_Array[3] = cc.v2(200,160);
    this.itemPos_Array[4] = cc.v2(400,160);


    this.itemPos_Array[5] = cc.v2(-400,0);
    this.itemPos_Array[6] = cc.v2(-200,0);
    this.itemPos_Array[7] = cc.v2(0,0);
    this.itemPos_Array[8] = cc.v2(200,0);
    this.itemPos_Array[9] = cc.v2(400,0);


    this.itemPos_Array[10] = cc.v2(-400,-160);
    this.itemPos_Array[11] = cc.v2(-200,-160);
    this.itemPos_Array[12] = cc.v2(0,-160);
    this.itemPos_Array[13] = cc.v2(200,-160);
    this.itemPos_Array[14] = cc.v2(400,-160);  
  
    this.ngocXanh_Pos = cc.v2(0,275);  
    this.freeturn_Pos = cc.v2(620,-170);  
    },

    ShowAnimation_FinishSpin(spinResponseData)
    {
        this.spinResponseData = spinResponseData;
        let matrix = this.spinResponseData[2];
        this.SaveCurrentMatrix(matrix);
        let isTakeJackpot = this.spinResponseData[13];
        let freeCounter = this.spinResponseData[7];
        cc.log(">>>> FreeCounter: "+freeCounter);
      
        this.ShowAnimation_TichLuyEffect();
     
        
    },
 
    FinishAllEffect()
    {   
        //this.ShowAnimation_BigWinContent();
        this.ShowAnimation_BigWinContent();
    },

    ShowAnimation_ClosePopup()
    {
        this.FinishContent_Animation.node.active = true;
        let callBack = ()=>{         
            this.FinishContent_Animation.off("finished" , callBack);
            let totalWin = 0;
            if(this.spinResponseData != null)
                totalWin = this.spinResponseData[9];
            require("TL_SpinController").getIns().mainView.Destroy_FreeGame_Type2_View(totalWin);
           }
           this.FinishContent_Animation.on("finished" ,callBack );
           this.FinishContent_Animation.play("Freespin_Type2_Close");
    },

    UpdateExtendUI()
    {
        let extendString = this.spinResponseData[14];
       // packet[14] = '1|418';
        let extendStringArray = extendString.split("|");
        let counterExtend = parseInt(extendStringArray[0]);
        let baseValue = parseInt(extendStringArray[1]);
       
        this.Extent_Lb.string = (counterExtend * baseValue);
        this.Extent_Lb.node.active = true;
    },

   

    SaveCurrentMatrix(currentMatrix)
    {
        if(this.currentMatrix !== null && this.currentMatrix !== 'undefined')
            this.lastMatrix = this.currentMatrix;
        this.currentMatrix = currentMatrix;
    },
    SetLastMatrix(lastMatrix)
    {
        this.currentMatrix = lastMatrix;
    },

    ShowAnimation_TichLuyEffect()
    {
        let isTakeJackpot = this.spinResponseData[13];

        

        const stringArray =  this.lastMatrix.split(",");  
        let lastArray =  stringArray.map((numStr) => Math.floor(parseInt(numStr)));

        const stringArray2 =  this.currentMatrix.split(",");  
        let currentArray =  stringArray2.map((numStr) => Math.floor(parseInt(numStr)));
        
        this.tichLuyLabelMap  = [];

        let new_green_specialArray = [];
        let green_specialArray = [];
        let yellow_specialArray = [];
        let blue_specialArray = [];
        let old_yellow_specialArray = [];
        let plusItemArray = [];
        
        for(let i = 0;i< currentArray.length;i++)
        {
            if(currentArray[i] != lastArray[i])
            {
                if(currentArray[i] == this.ITEM_GREEN_WILD)
                {
                    new_green_specialArray.push(i);
                }
                else if(currentArray[i] == this.ITEM_YELLOW_WILD)
                {
                    yellow_specialArray.push(i);
                }
            }
            if(currentArray[i] == this.ITEM_BLUE_WILD)
            {
                blue_specialArray.push(i);
            }
            else if(currentArray[i] == this.ITEM_GREEN_WILD)
            {
                green_specialArray.push(i);
            }
            else if(currentArray[i] == this.ITEM_PLUS)
            {
                plusItemArray.push(i);
            }
        }

        for(let i=0;i< lastArray.length;i++)
        {
            if(lastArray[i] == this.ITEM_YELLOW_WILD)
            {
                old_yellow_specialArray.push(i);
            }
        }
        let delayPlusEffect = (plusItemArray.length * this.TIME_EFFECT)/1000;
        if(delayPlusEffect != 0)
        {
            this.ShowAnimation_Inc_FreeTurn(plusItemArray,currentArray);
            this.scheduleOnce(()=>{
                let freeCounter = this.spinResponseData[7];
                this.spinController.setFreeturnNumber(freeCounter);
            },delayPlusEffect);
        }
        let delayTime = (this.TIME_EFFECT * blue_specialArray.length  * new_green_specialArray.length)/1000;
        let combinedArray = [...blue_specialArray,...green_specialArray,...old_yellow_specialArray];
        this.scheduleOnce(()=>{
           
            // chay hieu ung blue -> green
            this.ShowAnimation_TichLuy_Effect_All(stringArray2,currentArray,new_green_specialArray,blue_specialArray,this.Blue_Item_Prefab);
                             
                this.scheduleOnce(()=>{
                    this.tichLuySum = 0;     
                    // chay hieu ung blue -> yellow && green -> yellow
                this.ShowAnimation_TichLuy_Effect_All(stringArray2,currentArray,yellow_specialArray,combinedArray,this.Green_Item_Prefab);
                },delayTime);
        },delayPlusEffect);

        let delayShow = (combinedArray.length * yellow_specialArray.length * this.TIME_EFFECT )/1000;
        let delayShowJackpotTime = delayPlusEffect + delayTime + delayShow;
        if(isTakeJackpot > 0)
        {           
            this.scheduleOnce(()=>{
                this.ShowAnimation_JackpotContent();
            },delayShowJackpotTime);
        }
        else
        {
            let freeSpinLeft = this.spinResponseData[7];
            if(freeSpinLeft == 0)
            {
                this.scheduleOnce(()=>{
                    this.FinishAllEffect();
                },delayShowJackpotTime);
            }
            else
            {
                this.scheduleOnce(()=>{
                    this.spinController.Handle_AutoRespin(2);
                },delayShowJackpotTime);
                
            }
        }   
    },

    

    ShowAnimation_TichLuy_Effect_All(currentArrayData,currentArray,green_specialArray,blue_specialArray,effectPrefab)
    {
      
        for(let i=0;i<green_specialArray.length;i++)
        {
          
            let greenItemPos = green_specialArray[i];
            let itemData = currentArrayData[i];
            let itemValue = currentArray[i];
    
            setTimeout(() => {     
                 this.ShowAnimation_TichLuy_Effect_Element(greenItemPos,itemValue,itemData,currentArrayData,blue_specialArray,effectPrefab);      
                 this.tichLuySum = 0;      
                 this.Remove_AllWildParticle();
            }, i * this.TIME_EFFECT * blue_specialArray.length); // Mỗi lần lặp, độ trễ tăng lên 2s     
             
        }
    },
    ShowAnimation_TichLuy_Effect_Element(greenItemPos,itemValue,itemData,currentArrayData,blue_specialArray,effectPrefab)
    {
        let self = this;
        this.tichLuyLabel = null;
        this.index = 0;
        for(let i=0;i< blue_specialArray.length;i++)
        {
            setTimeout(() => {          

                let itemEffect = effectPrefab;
                let itemData = currentArrayData[blue_specialArray[i]];
                if (itemData.includes('.')) 
                {
                    let [integerPart, decimalPart] = itemData.split('.');
                    // Chuyển phần nguyên và phần thập phân thành số nguyên
                    integerPart = parseInt(integerPart);
                    if(integerPart ==  this.ITEM_BLUE_WILD)
                    {
                        itemEffect = self.Blue_Item_Prefab;
                    }
                    else if(integerPart ==  this.ITEM_GREEN_WILD)
                    {
                        itemEffect = self.Green_Item_Prefab;
                    }
                    else if(integerPart ==  this.ITEM_YELLOW_WILD)
                    {
                        itemEffect = self.Yellow_Item_Prefab;
                    }
                }
                var startPosition = self.itemPos_Array[blue_specialArray[i]];
                var wildParticle = cc.instantiate(itemEffect);
                this.EffectNode.addChild(wildParticle);
                this.wildParticle_Array.push(wildParticle);
                var endPos = self.itemPos_Array[greenItemPos];
                wildParticle.setPosition(startPosition);
              
                // Move the particle to the stake position along a straight line
                var moveToAction = cc.moveTo(0.4, endPos);
                // Create an action to destroy the particle
                var destroyAction = cc.callFunc(function () {  
                    wildParticle.active = false;  
                    this.ShowAnimation_CreateSumTichLuy(greenItemPos,currentArrayData[blue_specialArray[i]],endPos);   
                }, self);

                // Create a sequence of actions
                //var sequence = cc.sequence(moveToAction, destroyAction);
                var spawnAction = cc.spawn(
                    cc.sequence(moveToAction, destroyAction), // Di chuyển và hủy đối tượng
                    cc.scaleTo(0.4, 0) // Scale từ 1 xuống 0 trong 0.4 giây
                );
                // Run the sequence on the particle
                wildParticle.runAction(spawnAction);
                this.index++;
            }, i * this.TIME_EFFECT); // Mỗi lần lặp, độ trễ tăng lên 2s     
        }    
    },
    ShowAnimation_CreateSumTichLuy(itemPosID,itemData,endPos)
    {
        if (!itemData.includes('.'))        
            return;
        let tichLuyObject = this.tichLuyLabelMap.find(obj => obj.id === itemPosID);
        let tichLuyPrefab = null;
        if(!tichLuyObject)
        {
            tichLuyPrefab = cc.instantiate(this.ExtendLabel_Prefab);
            tichLuyPrefab.setPosition(endPos);
            this.EffectNode.addChild(tichLuyPrefab); 
            this.tichLuyLabelMap.push( { id: itemPosID, TichLuyObject: tichLuyPrefab });
        }
        else
        {
            tichLuyPrefab = tichLuyObject.TichLuyObject;
        }

        // Tách thành phần nguyên và phần thập phân
        let [integerPart, decimalPart] = itemData.split('.');
        // Chuyển phần nguyên và phần thập phân thành số nguyên
        integerPart = parseInt(integerPart);
        decimalPart = parseInt(decimalPart);
        this.tichLuySum += decimalPart;
        let tichLuyLabel = tichLuyPrefab;
        tichLuyLabel.getComponent(cc.Label).string = this.tichLuySum;
    },
    Remove_AllWildParticle()
    {
        let arrayLength =  this.wildParticle_Array.length;
        for(let i = 0;i < arrayLength;i++)
        {
            this.wildParticle_Array[i].destroy();
        }
        this.wildParticle_Array = [];
    },
    Remove_AllTichLuyLabel()
    {
        let arrayLength =  this.tichLuyLabelMap.length;
        for(let i = 0;i < arrayLength;i++)
        {
            this.tichLuyLabelMap[i].TichLuyObject.destroy();
        }
        this.tichLuyLabelMap = []; 
    },

    ResetAllEffect()
    {
        this._super();
        this.Remove_AllWildParticle();
      //  this.Remove_AllTichLuyLabel();
    },
    SpinEffect_RemainSetup(packet)
    {
    },
    ShowAnimation_Inc_FreeTurn(freeturnPos,currentArrayData)
    {
        let self = this;
        this.index = 0;
        for(let i=0;i< freeturnPos.length;i++)
        {
            setTimeout(()=>{
                let itemData = currentArrayData[freeturnPos[i]];
                var startPosition = self.itemPos_Array[freeturnPos[i]];
                var wildParticle = cc.instantiate(self.Plus_Item_Prefab);
                this.EffectNode.addChild(wildParticle);
                var endPos = this.freeturn_Pos;
                wildParticle.setPosition(startPosition);

                // Move the particle to the stake position along a straight line
                var moveToAction = cc.moveTo(0.4, endPos);
                // Create an action to destroy the particle
                var destroyAction = cc.callFunc(function () {  
                    wildParticle.destroy();  
                    let numberFreeUI = self.spinController.spinView.freeturnRemainUI + 1;
                    self.spinController.setFreeturnNumber(numberFreeUI);
                  //  this.ShowAnimation_CreateSumTichLuy(greenItemPos,currentArrayData[blue_specialArray[i]],endPos);   
                }, self);
                var sequence = cc.sequence(moveToAction, destroyAction);
                wildParticle.runAction(sequence);
            },i * this.TIME_EFFECT);
        }
    },
    ShowAnimation_JackpotContent()
    {
        let isTakeJackpot  = this.spinResponseData[13];
        let totalWin = this.spinResponseData[9];
       

        var jackpotContent = null;
       
        jackpotContent = cc.instantiate(this.Jackpot_Content_Prefab);
        this.EffectNode.addChild(jackpotContent);
        let jackpotContent_Component = jackpotContent.getComponent("TL_Bonus_EndPopup");
        jackpotContent_Component.EndPopup_Setup(isTakeJackpot,totalWin)

        this.scheduleOnce(()=>{
            jackpotContent.destroy();
            
            let freeSpinLeft = this.spinResponseData[7];
            if(freeSpinLeft > 0)
                this.spinController.Handle_AutoRespin(2);
            else
                this.ShowAnimation_ClosePopup();
            
        },10); 
    },
    ShowAnimation_BigWinContent(callback = null)
    {
        let totalWin = this.spinResponseData[9];
        var bigwinContent = null;
        bigwinContent = cc.instantiate(this.BigWin_Content_Prefab);
        this.EffectNode.addChild(bigwinContent);
        let bigwinContent_Component = bigwinContent.getComponent("TL_Freespin_EndPopup");
        bigwinContent_Component.EndPopup_Setup(2,totalWin,10);

        
        this.scheduleOnce(()=>{
            bigwinContent.destroy();    
            this.ShowAnimation_ClosePopup() 
        },10); 
    
    }
    





    

});
