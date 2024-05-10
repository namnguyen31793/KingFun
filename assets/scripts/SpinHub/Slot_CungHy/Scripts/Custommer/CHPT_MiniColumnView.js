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
        this.MINI_SYMBOL_NAME_LIST = ['JP', 'FR', '50', '50', '50', '100', '100', '100', '200', '200', '200', '500', '500', '600', '600', '800', '800', '900', '900', '1000'];
        this.multiValue = 0;
    },
    properties: {
        KhungIcons: [cc.Sprite],
        MiniSlotValues: [cc.Label],

        KhungIcons_Img : [cc.SpriteFrame],
    },

    onLoad()
    {
        this.animCol = this.node.getComponent(cc.Animation);

        var nodeName = this.node.name;   
        var parts = nodeName.split('_'); // Tách chuỗi theo dấu "_"
        if (parts.length === 2) {
            this.colId = parseInt(parts[1]) - 1; // Giá trị số là phần tử thứ 1 (index 1) 
        }  
        this.spinController = this.GetSpinController();
    },
    GetSpinController()
    {
        return  require("SlotControllerFactory").getIns().GetCurrentSlotController();
    },

    randomIcon()
    {
       for(let i=0;i< this.KhungIcons.length;i++)
       {
            let randomSymbol = this.getRandomSymbol();
           
                if(randomSymbol == "JP") 
                {
                    this.KhungIcons[i].SpriteFrame = this.KhungIcons_Img[0];
                    this.MiniSlotValues[i].string = "";
                }
                else if(randomSymbol == "FR")
                {
                    this.KhungIcons[i].SpriteFrame = this.KhungIcons_Img[1];
                    this.MiniSlotValues[i].string = "";
                }
                else
                {
                    let valueSymbo = parseInt(randomSymbol)//
                    if(valueSymbo < 200)
                    {
                        this.KhungIcons[i].SpriteFrame = this.KhungIcons_Img[2];
                        this.MiniSlotValues[i].string = valueSymbo;
                    }
                    else if(valueSymbo < 600)
                    {
                        this.KhungIcons[i].SpriteFrame = this.KhungIcons_Img[3];
                        this.MiniSlotValues[i].string = valueSymbo;
                    }
                    else
                    {
                        this.KhungIcons[i].SpriteFrame = this.KhungIcons_Img[4];
                        this.MiniSlotValues[i].string = valueSymbo;
                    }
                }
            }                   
    },


    spin: function (isNearWin = false) {
        this.unscheduleAllCallbacks();
       
        let seft = this;
        let loopCount = 0;
        let callBack = ()=>{
            this.animCol.off("finished" ,callBack );
            this.stop();
        }
       
        this.animCol.on("finished" ,callBack );
        this.animCol.play("CH_MiniColumnSpin");    
    },
    stop: function () {
        this.setDefaultResultData();

        let callBack = ()=>{  
            this.animCol.off("finished" , callBack);
            this.spinController.stopMiniReelSpinFinish();
        }
        this.animCol.on("finished" ,callBack );
        this.animCol.play("CH_MiniColumnStop");
    },
    setDefaultResultData(extraMatrix = null)
    {
        this.multiValue = 1;
        if(extraMatrix == null)
        {
            let spinData =  this.spinController.getLastSpinResponseData();
            let extraMatrix_Response = spinData[14];
            let extraMatrix_Response_Array  = extraMatrix_Response.split('|');
            extraMatrix = extraMatrix_Response_Array[0];
            this.multiValue = parseInt(extraMatrix_Response_Array[1]);
        }
        var subExtentMatrixArray = extraMatrix.split('|');
        var extraMatrixAray = subExtentMatrixArray[0].split(',');
        let extraValue = extraMatrixAray[this.colId];
        this.setResultIcon(extraValue);
    },

    setResultData(extraMatrix = null)
    {
        this.multiValue = 1;
        if(extraMatrix == null)
        {
            let spinData =  this.spinController.getLastSpinResponseData();
            let extraMatrix_Response = spinData[14];
            let extraMatrix_Response_Array  = extraMatrix_Response.split('|');
            extraMatrix = extraMatrix_Response_Array[0];
            this.multiValue = parseInt(extraMatrix_Response_Array[1]);
        }
        var extraMatrixAray = extraMatrix.split(',');
        let extraValue = extraMatrixAray[this.colId];
        this.setResultIcon(extraValue,this.multiValue);
    },

    setResultIcon(symbolValue,multiValue = 1)
    {
        if(symbolValue == "JP") 
        {
            this.KhungIcons[1].spriteFrame = this.KhungIcons_Img[1];  
            this.MiniSlotValues[1].string = "";
        }
        else if(symbolValue == "FR")
        {
            this.KhungIcons[1].spriteFrame = this.KhungIcons_Img[0];
            this.MiniSlotValues[1].string = "";
        }
        else
        {
            let valueSymbo = parseInt(symbolValue) * multiValue *  this.spinController.CurrentRoomConfig.Bet / 50;  
            if(valueSymbo < 200)
            {
                this.KhungIcons[1].spriteFrame = this.KhungIcons_Img[2];
                this.MiniSlotValues[1].string =  cc.Tool.getInstance().formatNumberK(valueSymbo); 
            }
            else if(valueSymbo < 600)
            {
                this.KhungIcons[1].spriteFrame = this.KhungIcons_Img[3];
                this.MiniSlotValues[1].string =cc.Tool.getInstance().formatNumberK(valueSymbo); 
            }
            else
            {
                this.KhungIcons[1].spriteFrame = this.KhungIcons_Img[4];
                this.MiniSlotValues[1].string = cc.Tool.getInstance().formatNumberK(valueSymbo); 
            }
        }
    },

  

    getRandomSymbol()
    {
        return this.MINI_SYMBOL_NAME_LIST[Math.floor(Math.random() * this.MINI_SYMBOL_NAME_LIST.length)];
    }


   
});
