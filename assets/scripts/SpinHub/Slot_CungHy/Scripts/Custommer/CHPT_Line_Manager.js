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
        this.ITEM_WILD_1 = 1;
        this.ITEM_WILD_2 = 2;

        this.pointsItems = [];
        this.LineIndex_Array =[];
        this.LineNumber_Array = [];
        this.Item_Pos_Array = [];
        this.LinePos_Info_Array = [];

        this.Vfx_Gong_Array = [];

        this.Column_Array = [];
        this.MAX_LINE = 50;
        this.MAX_ITEM = 15;
        this.defaultLine = this.MAX_LINE;
        this.isDraw = false;
   },
    properties: {
        Column_1: {
            default: [],
            type:  require("CHPT_SlotItem")
        },
        Column_2: {
            default: [],
            type:  require("CHPT_SlotItem")
        },
        Column_3: {
            default: [],
            type:  require("CHPT_SlotItem")
        },
        Column_4: {
            default: [],
            type:  require("CHPT_SlotItem")
        },
        Column_5: {
            default: [],
            type:  require("CHPT_SlotItem")
        },
    },


    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.graphics = this.node.getComponent(cc.Graphics);
       // this.Handle_Draw_ClearAllLine();
          // Tạo một mảng chứa các điểm (x, y)
          this.pointsLines = [];
          this.pointsItems = [];
          this.LineIndex_Array =[];
          this.Load_ColumnArray();
          this.Load_LineInfo();
          this.Load_posItem();

          this.spinController = this.GetSpinController();
          /*
        const foundEntry = this.LinePos_Info_Array.find(entry => entry.lineId === 1);
        this.drawConnectedLines( foundEntry.pos);
        */    
    },


    onEnable()
    {
       // this.Handle_Draw_ClearAllLine();
        //this.Handle_Draw_ShowLine();
    },

    start () {

    },

    GetSpinController()
    {
        return  require("SlotControllerFactory").getIns().GetCurrentSlotController();
    },

    Load_posItem() {
        
        for (let i = 1; i <= this.MAX_ITEM; i++) {
            const objectName = `item_${i}_Pos`;
            const loadedObject = this.node.getChildByName(objectName);
            if (loadedObject) {
                this.Item_Pos_Array.push(loadedObject); // Thêm đối tượng vào mảng LineNumber_Array
                this.pointsItems.push(loadedObject.getPosition());
            }
        }
    },

    Load_ColumnArray() {
        this.Column_Array.push(this.Column_1);
        this.Column_Array.push(this.Column_2);
        this.Column_Array.push(this.Column_3);
        this.Column_Array.push(this.Column_4);
        this.Column_Array.push(this.Column_5);
       
    },
    Load_LineInfo()
    {
        this.LineIndex_Array.push([1, 1, 1, 1, 1]); //1
        this.LineIndex_Array.push([0, 0, 0, 0, 0]); // 2
        this.LineIndex_Array.push([2, 2, 2, 2, 2]); //3
        this.LineIndex_Array.push([0, 1, 2, 1, 0]); //4
        this.LineIndex_Array.push([2, 1, 0, 1, 2]); //5
        this.LineIndex_Array.push([0, 0, 1, 0, 0]);//6
        this.LineIndex_Array.push([2, 2, 1, 2, 2]);//7
        this.LineIndex_Array.push([1, 2, 2, 2, 1]);//8
        this.LineIndex_Array.push([1, 0, 0, 0, 1]);//9
        this.LineIndex_Array.push([0, 1, 1, 1, 0]);//10
        this.LineIndex_Array.push([2, 1, 1, 1, 2]);//11
        this.LineIndex_Array.push([0, 1, 0, 1, 0]);//12
        this.LineIndex_Array.push([2, 1, 2, 1, 2]);//13
        this.LineIndex_Array.push([1, 0, 1, 0, 1]);//14
        this.LineIndex_Array.push([1, 2, 1, 2, 1]);//15
        this.LineIndex_Array.push([1, 1, 0, 1, 1]);//16
        this.LineIndex_Array.push([1, 1, 2, 1, 1]);//17
        this.LineIndex_Array.push([0, 2, 0, 2, 0]);//18
        this.LineIndex_Array.push([2, 0, 2, 0, 2]);//19
        this.LineIndex_Array.push([1, 0, 2, 0, 1]);//20
        this.LineIndex_Array.push([1, 2, 0, 2, 1]);//21
        this.LineIndex_Array.push([0, 0, 2, 0, 0]);//22
        this.LineIndex_Array.push([2, 2, 0, 2, 2]);//23
        this.LineIndex_Array.push([0, 2, 2, 2, 0]);//24
        this.LineIndex_Array.push([2, 0, 0, 0, 2]);//25
        this.LineIndex_Array.push([0, 2, 1, 2, 0]);//26
        this.LineIndex_Array.push([2, 0, 1, 0, 2]);//27
        this.LineIndex_Array.push([0, 0, 1, 2, 2]);//28
        this.LineIndex_Array.push([2, 2, 1, 0, 0]);//29
        this.LineIndex_Array.push([1, 0, 1, 2, 1]);//30
        this.LineIndex_Array.push([1, 2, 1, 0, 1]);//31
        this.LineIndex_Array.push([0, 2, 1, 0, 2]);//32
        this.LineIndex_Array.push([2, 0, 1, 2, 0]);//33
        this.LineIndex_Array.push([1, 0, 2, 1, 0]);//34
        this.LineIndex_Array.push([1, 2, 0, 1, 2]);//35
        this.LineIndex_Array.push([0, 1, 2, 0, 1]);//36
        this.LineIndex_Array.push([2, 1, 0, 2, 1]);//37
        this.LineIndex_Array.push([0, 0, 0, 1, 2]);//38
        this.LineIndex_Array.push([2, 2, 2, 1, 0]);//39
        this.LineIndex_Array.push([1, 1, 1, 0, 2]);//40
        this.LineIndex_Array.push([1, 1, 1, 2, 0]);//41
        this.LineIndex_Array.push([0, 2, 0, 1, 0]);//42
        this.LineIndex_Array.push([2, 0, 2, 1, 2]);//43
        this.LineIndex_Array.push([0, 1, 0, 2, 0]);//44
        this.LineIndex_Array.push([2, 1, 2, 0, 2]);//45
        this.LineIndex_Array.push([0, 0, 2, 1, 2]);//46
        this.LineIndex_Array.push([2, 2, 0, 1, 0]);//47
        this.LineIndex_Array.push([0, 1, 1, 1, 2]);//48
        this.LineIndex_Array.push([2, 1, 1, 1, 0]);//49
        this.LineIndex_Array.push([1, 0, 0, 1, 2]);//50  
    },

    ShowItemWinAnimation(listLineWinData)
    {
        this.CreateVfxGongItem();
        let lineWinArray = listLineWinData.split(',');
        if(listLineWinData == '' || listLineWinData == undefined || listLineWinData == null)
            return;
            for(let m = 0;m< lineWinArray.length;m++)
            {
                let lineID = lineWinArray[m] - 1;
                let lineIndex_Element = this.LineIndex_Array[lineID];
                let highLine_ItemID = -1;
                for(let n=0;n<lineIndex_Element.length;n++)
                {                  
                    let indexItem = lineIndex_Element[n];
                    let currentID = this.Column_Array[n][indexItem].itemId;
                    if(highLine_ItemID == -1)
                    {
                        if(currentID != this.ITEM_WILD_1 && currentID != this.ITEM_WILD_2)
                        {
                            highLine_ItemID = currentID;
                        }
                            
                    }
                    if(currentID == this.ITEM_WILD_1 || currentID == this.ITEM_WILD_2 || currentID == highLine_ItemID)
                    {
                        this.Column_Array[n][indexItem].ShowAnimation_WinItem();
                    }
                    else
                    {
                        break;
                    }
                }
            }
       
    },

    CreateVfxGongItem()
    {
        let itemIndex = 0;
        for(let i=0;i<5;i++)
        {
            for(let j=0;j<3;j++)
            {


                this.Column_Array[i][j].Show_MaskItem();
                if(this.Column_Array[i][j].itemId == this.ITEM_WILD_1)                
                {        
                             
                   let vfxInstance = this.Column_Array[i][j].CreateVfxGong(this.spinController.spinView.VFX_GongItem);
                   vfxInstance.setPosition(this.pointsItems[itemIndex]);
                   this.spinController.spinView.VFX_Parent.addChild(vfxInstance);   
                   this.Vfx_Gong_Array.push(vfxInstance);
                }
                ++itemIndex;
            }
        }

    },

    DrawLine_RewardSpin(listLineWinData)
    {
                // Tách chuỗi thành mảng các phần tử
        const elementsArray = listLineWinData.split('|');

        // Mảng kết quả chứa giá trị đầu tiên của mỗi phần tử
        const firstValuesArray = [];

        // Lặp qua từng phần tử và trích xuất giá trị đầu tiên
        elementsArray.forEach(element => {
            const values = element.split(',');
            const firstValue = parseInt(values[0], 10); // Parse thành int với radix 10
            firstValuesArray.push(firstValue);
        });
        if(firstValuesArray.length == 0)
        return;
        
        firstValuesArray.forEach((firstValue,index)=>{
            // Sử dụng setTimeout để tạo độ trễ
            setTimeout(() => {
                const lineArray = [this.LinePos_Info_Array.find(entry => entry.lineId ===  firstValue)];
                this.drawConnectedLines(lineArray);
            }, index * 250); // Mỗi lần lặp, độ trễ tăng lên 2s
        });

    },

    ResetVfxGong()
    {
        for(let i=0;i<  this.Vfx_Gong_Array.length;i++)
        {
            this.Vfx_Gong_Array[i].destroy();
        }
        this.Vfx_Gong_Array = [];
    }

});
