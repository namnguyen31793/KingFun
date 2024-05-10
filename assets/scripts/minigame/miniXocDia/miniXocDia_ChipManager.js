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
        this.GatePos = [];
        this.StartPos = [];
        this.chipCollection_1K = [];
        this.chipCollection_5K = [];
        this.chipCollection_10K = [];
        this.chipCollection_100K = [];
        this.chipCollection_500K = [];
        this.chipCollection_5M = [];
    },
    properties: {
        sfPrefabChip: [cc.Prefab],    
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameController =  require("miniXocDia_Controller").getIns();
        this.gameController.SetChipManager(this);
        this.chip1kPool = new cc.NodePool();
        this.chip5kPool = new cc.NodePool();
        this.chip10kPool = new cc.NodePool();
        this.chip100kPool = new cc.NodePool();
        this.chip500kPool = new cc.NodePool();
        this.chip5mPool = new cc.NodePool();

        //Bau
        this.GatePos.push(cc.v2(65,95));
        //cua
        this.GatePos.push(cc.v2(65,-50));
        //ca
        this.GatePos.push(cc.v2(-85,-50));
        //ga
        this.GatePos.push(cc.v2(215,95));
        //tom
        this.GatePos.push(cc.v2(215,-50));
        //huou
        this.GatePos.push(cc.v2(-85,95));

        
        //1K
        this.StartPos.push(cc.v2(-230,-195));
        //5K
        this.StartPos.push(cc.v2(-140,-195));
        //10K
        this.StartPos.push(cc.v2(-50,-195));
        //100K
        this.StartPos.push(cc.v2(40,-195));
        //500K
        this.StartPos.push(cc.v2(130,-195));
        //5000K
        this.StartPos.push(cc.v2(220,-195));
    },

    start () {

    },

    ResetChip()
    {
        for(let i=0;i< this.chipCollection_1K.length;i++)
        {
            this.chipCollection_1K[i].active = false;
            this.chip1kPool.put( this.chipCollection_1K[i]);            
        }
        for(let i=0;i< this.chipCollection_5K.length;i++)
        {
            this.chipCollection_5K[i].active = false;
            this.chip5kPool.put( this.chipCollection_5K[i]);
        }
        for(let i=0;i< this.chipCollection_10K.length;i++)
        {
            this.chipCollection_10K[i].active = false;
            this.chip10kPool.put( this.chipCollection_10K[i]);
        }
        for(let i=0;i< this.chipCollection_100K.length;i++)
        {
            this.chipCollection_100K[i].active = false;
            this.chip100kPool.put( this.chipCollection_100K[i]);
        }
        for(let i=0;i< this.chipCollection_500K.length;i++)
        {
            this.chipCollection_500K[i].active = false;
            this.chip500kPool.put( this.chipCollection_500K[i]);
        }
        for(let i=0;i< this.chipCollection_5M.length;i++)
        {
            this.chipCollection_5M[i].active = false;
            this.chipCollection_5M.put( this.chipCollection_5M[i]);
        }



        this.chipCollection_1K = [];
        this.chipCollection_5K = [];
        this.chipCollection_10K = [];
        this.chipCollection_100K = [];
        this.chipCollection_500K = [];
        this.chipCollection_5M = [];
    },

    onDestroy: function () {
        this.clearPools();
    },
    clearPools: function () {
        try {
            //Clear pool
            this.chip1kPool.clear();
            this.chip5kPool.clear();
            this.chip10kPool.clear();
            this.chip100kPool.clear();
            this.chip500kPool.clear();
            this.chip5mPool.clear();
        } catch (e) {
            console.log(e);
        }
    },
    createChip: function (type) {
        let nodeChip = null;
        switch (type) {
            case cc.BacaratMapChip['1K']:
                if (this.chip1kPool.size() > 0) {
                    nodeChip = this.chip1kPool.get();
                } else {
                    nodeChip = cc.instantiate(this.sfPrefabChip[0]);
                }
                this.chipCollection_1K.push(nodeChip);
                break;
            case cc.BacaratMapChip['5K']:
                if (this.chip5kPool.size() > 0) {
                    nodeChip = this.chip5kPool.get();
                } else {
                    nodeChip = cc.instantiate(this.sfPrefabChip[1]);
                }
                this.chipCollection_5K.push(nodeChip);
                break;
            case cc.BacaratMapChip['10K']:
                if (this.chip10kPool.size() > 0) {
                    nodeChip = this.chip10kPool.get();
                } else {
                    nodeChip = cc.instantiate(this.sfPrefabChip[2]);
                }
                this.chipCollection_10K.push(nodeChip);
                break;
            case cc.BacaratMapChip['100K']:
                if (this.chip100kPool.size() > 0) {
                    nodeChip = this.chip100kPool.get();
                } else {
                    nodeChip = cc.instantiate(this.sfPrefabChip[3]);
                }
                this.chipCollection_100K.push(nodeChip);
                break;
            case cc.BacaratMapChip['500K']:
                if (this.chip500kPool.size() > 0) {
                    nodeChip = this.chip500kPool.get();
                } else {
                    nodeChip = cc.instantiate(this.sfPrefabChip[4]);
                }
                this.chipCollection_500K.push(nodeChip);
                break;
            case cc.BacaratMapChip['5M']:
                if (this.chip5mPool.size() > 0) {
                    nodeChip = this.chip5mPool.get();
                } else {
                    nodeChip = cc.instantiate(this.sfPrefabChip[5]);
                }
                this.chipCollection_5M.push(nodeChip);
                break;
        }
        if(nodeChip == null)
            return nodeChip;
        try {
            nodeChip.setScale(0.7, 0.7);
        } catch (e) {
            console.log(e);
            this.createChip(type);
        }

        return nodeChip;
    },
    putChipToPool: function (nodeChip, betValue) {
        switch (betValue) {
            case 1000:
                this.chip1kPool.put(nodeChip);
                break;
            case 5000:
                this.chip5kPool.put(nodeChip);
                break;
            case 10000:
                this.chip10kPool.put(nodeChip);
                break;
            case 100000:
                this.chip100kPool.put(nodeChip);
                break;
            case 500000:
                this.chip500kPool.put(nodeChip);
                break;
            case 5000000:
                this.chip5mPool.put(nodeChip);
                break;
        }
    },
    MoveChipBet(betValue, betSide)
    {
        try{
            betValue = parseInt(betValue);
            let chipPos = this.GetStartChipPos(betValue);
            let chipEnd = this.GetEndChipPos(betSide);
            const randomNumber = Math.random() * (15 - (-15) + 1) + (-15);
            let chip = this.createChip(cc.BacaratMapChipSpriteFrame[betValue]);
            if(chip == null)
            return;
            let posChipEnd = cc.v2(chipEnd.x +randomNumber,chipEnd.y - randomNumber);
            chip.parent = this.node;
            chip.position = chipPos;
            let moveStyle = cc.easeSineInOut()
           let moveAction = cc.spawn(cc.moveTo(0.2, posChipEnd), cc.scaleTo(0.2, 0.3));
            if (!cc.game.isPaused()) {
                chip.runAction(moveAction);
            } else {
                chip.position = posChipEnd;
                chip.setScale(cc.v2(0.2,0.2));
            }
            switch(betValue)
            {
                case 1000:
                this.chipCollection_1K.push(chip);
                break;
                case 5000:
                this.chipCollection_5K.push(chip);
                break;
                case 10000:
                this.chipCollection_10K.push(chip);
                break;
                case 100000:
                this.chipCollection_100K.push(chip);
                break;
                case 500000:
                this.chipCollection_500K.push(chip);
                break;
                case 5000000:
                this.chipCollection_5M.push(chip);
                break; 
            }

        }catch(e)
        {
            console.log(e);
        }
    },

    GetStartChipPos(chipValue)
    {
        switch(chipValue)
        {
            case 1000:
                return this.StartPos[0];
            case 5000:
                return this.StartPos[1];
            case 10000:
                return this.StartPos[2];
            case 100000:
                return this.StartPos[3];
            case 500000:
                return this.StartPos[4];
            case 5000000:
                return this.StartPos[5];
        }
    },
    GetEndChipPos(betSide)
    {
        switch(betSide)
        {
            case cc.BauCuaBetSide.Gourd:
                return this.GatePos[0];
            case cc.BauCuaBetSide.Crab:
                return this.GatePos[1];
            case cc.BauCuaBetSide.Fish:
                return this.GatePos[2];
            case cc.BauCuaBetSide.Rooster:
                return this.GatePos[3];
            case cc.BauCuaBetSide.Lobster:
                return this.GatePos[4];
            case cc.BauCuaBetSide.Deer:
                return this.GatePos[5];
        }
    }


    // update (dt) {},
});
