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
        this.index = 0;
    },

    properties: {
        Session_Lb : cc.Label,
        Dice_1 : cc.Sprite,
        Dice_2 : cc.Sprite,
        Dice_3 : cc.Sprite,
        Dice_spriteFrame : [cc.SpriteFrame],
        Row_Item_Array : [require('HistoryRowItem')],
        // jackpot content
        Content_1 : cc.Node,
        Content_2 : cc.Node,

        JackpotNumber_Lb :cc.Label,

        First_MyNumber_Lb : cc.Label,
        Last_MyNumber_Lb : cc.Label,

        Only_MyNumber_Lb : cc.Label,
    },
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetPlayerHistory(this);
    },
    onDestroy()
    {
        this.gameController.SetPlayerHistory(null);
    },

    start () {

    },
    onEnable()
    {
        let sessionID =  this.gameController.GetCurrentSessionID();
        this.ApiRequest_PlayerBySessionID(-1);
    },

    ApiRequest_PlayerBySessionID(sessionID)
    {
        let url = 'api/MiniBauCua/GetHistory?sessionID='+sessionID;
        let subDomainName = cc.SubdomainName.MINI_BAUCUA;
        let self = this;
        return cc.ServerConnector.getInstance().sendRequest(subDomainName, url, function (response) {
            var obj = JSON.parse(response);
            return self.onGetHistoryResponse(obj);
        });
    },

    ApiRequest_JackpotNumberPlayer(sessionID)
    {
        let url = 'api/MiniBauCua/GetNumberJackpotHistory?sessionID='+sessionID;
        let subDomainName = cc.SubdomainName.MINI_BAUCUA;
        let self = this;
        return cc.ServerConnector.getInstance().sendRequest(subDomainName, url, function (response) {
            var obj = JSON.parse(response);
            return self.onGetJackpotNumberHistoryResponse(obj);
        });
    },

    onGetHistoryResponse(data)
    {
        this.EnableAllRow_Item_Array();
        if(data.length == 0)
        return;

        this.index = 0;

        const grouped = data.reduce((acc, obj) => {
            const key = obj.SessionID;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
          }, {});
         

          const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

          this.sortedKeys = sortedKeys;

            // Tạo mảng mới đã sắp xếp dựa trên key giảm dần
            const sortedGrouped = sortedKeys.reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
            }, {});
        this.sortedGrouped  = sortedGrouped;
      
        this.ShowInfo();
       
    },

    ShowInfo(index = 0)
    { 
        this.EnableAllRow_Item_Array();
        let element_First =  this.sortedGrouped[parseInt( this.sortedKeys[index])];
        this.Dice_1.spriteFrame = this.Dice_spriteFrame[element_First[0].Dice1-1];
        this.Dice_2.spriteFrame = this.Dice_spriteFrame[element_First[0].Dice2-1];
        this.Dice_3.spriteFrame = this.Dice_spriteFrame[element_First[0].Dice3-1];
        this.Session_Lb.string = "PHIÊN:#"+element_First[0].SessionID;

        let dataArray =  this.sortedGrouped[parseInt(this.sortedKeys[index])];

                // Group by GateID and sum Bet and Award
        const groupedData = dataArray.reduce((acc, curr) => {
            const { GateID, Bet, Award } = curr;
            acc[GateID] = acc[GateID] || { GateID, Bet: 0, Award: 0 };
            acc[GateID].Bet += Bet;
            acc[GateID].Award += Award;
            return acc;
        }, {});

        // Convert the grouped data object to an array
        const result = Object.values(groupedData);



        for(let i=0;i<result.length;i++ )
        {
            this.Row_Item_Array[i].updateItem(result[i]);
        }
        this.index = index;

        this.ApiRequest_JackpotNumberPlayer(parseInt(this.sortedKeys[index]));

    },

    EnableAllRow_Item_Array()
    {
        for(let i=0;i<this.Row_Item_Array.length;i++ )
        {
            this.Row_Item_Array[i].node.active = false;
        }
    },

    onClick_Pre()
    {
        let index = this.index + 1;
        if(index >= this.sortedKeys.length)
        return;
        this.ShowInfo(index);
    },

    onClick_Next()
    {
        if(this.index <= 0)
            return;
        let index = this.index - 1;
        this.ShowInfo(index);
    },

    onGetJackpotNumberHistoryResponse(data)
    {
        cc.log("onGetJackpotNumberHistoryResponse");
        this.Content_1.active = false;
        this.Content_2.active = false;
        if(data.length == 0)
        return;
        if(data.length == 1)
            this.Content_2.active = true;
        else
            this.Content_1.active = true;

        let first_element = data[0];
        let last_element = data[data.length - 1];

        this.Only_MyNumber_Lb.string = cc.Tool.getInstance().formatJackpotNumber(first_element.FirstNumber);
        this.First_MyNumber_Lb.string = cc.Tool.getInstance().formatJackpotNumber(first_element.FirstNumber);
        this.Last_MyNumber_Lb.string = cc.Tool.getInstance().formatJackpotNumber(last_element.LastNumber);

        this.JackpotNumber_Lb.string = first_element.JackpotNumber;
    },

    ReloadHistoryApi()
    {
        if(!this.node.active)
        return;
        let sessionID =  this.gameController.GetCurrentSessionID();
        this.ApiRequest_PlayerBySessionID(-1);
    },

    onClick_Close()
    {
        this.gameController.GetAssetManager().Remove_playerHistoryPopup();
    }




    // update (dt) {},
});
