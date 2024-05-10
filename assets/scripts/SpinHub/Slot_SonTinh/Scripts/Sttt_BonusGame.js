// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor() {
        this.TOTAL_ITEM = 15;
        this.listEffect = [];
        this.cacheBonusTurn = 0;
        this.listBonus = [];
        this.indexBonus = 0;
        this.time = 0;
        this.isCountTime = false;
        this.bonusValue = 0;
        this.cachebonusValue = 0;
        this.bet = 0;
        this.waitEnd = false;
        this.callbackBonus = null;
        this.nameClassItem = "Sttt_BonusItem";
        this.listBtn = [];
    },

    properties: {
        lbBonusValue : cc.Label,
        lbCountTime : cc.Label,
       //lbBet : cc.Label,
       // lbTurn : cc.Label,
        nodeTime : cc.Node,
        parentListItem : cc.Node,
        nodeReward : cc.Node,
        lbReward : cc.Label,

    },

    onLoad() {
        for(let i = 0; i < this.TOTAL_ITEM; i++)
        {
            this.listBtn[i] = cc.find("item"+(i+1).toString(), this.parentListItem).getComponent(this.nameClassItem);
            this.listBtn[i].Init();
        }
    },

    ShowBonusGame(listBonus, bonusValue, callback, bet) {
        this.ResetUI();
        this.callbackBonus = callback;
        this.bet = bet;
        //this.lbBet.string = Global.Helper.formatNumber(bet);
        for(let i = 0; i < this.listBtn.length; i++){
            this.listBtn[i].Reset();
        }
        //this.lbTurn.string = listBonus.length.toString();
        this.listBonus = listBonus;
        this.indexBonus = 0;
        this.cachebonusValue = 0;
        this.time = 20;
        this.isCountTime = true;
        this.nodeTime.active = true;
        this.bonusValue = bonusValue;
        this.waitEnd = true;
        this.node.active = true;
    },
    
    ClickValueBonus(event, index){
        if(this.indexBonus == this.listBonus.length)
            return;
        // this.isCountTime = false;
        this.time = 20;
        this.nodeTime.active = false;
        //show win by index 
        cc.log(this.listBonus[this.indexBonus]);
        let valueWin = this.listBonus[this.indexBonus];
        //show effect
        let valueBonus = this.bet* parseInt(valueWin)/1000;
        this.listBtn[index].ShowEffect(valueBonus);

        this.cachebonusValue += valueBonus;
        this.lbBonusValue.string = Global.Helper.formatNumber(this.cachebonusValue);

        //index ++
        this.indexBonus++;
        //this.lbTurn.string = ( this.listBonus.length-this.indexBonus).toString();
        if(this.indexBonus == this.listBonus.length){
            this.ShowRewardBonus();
        }
    },

    update (dt) {
        if(this.isCountTime ){
            this.time -= dt;
            this.UpdateLbTime();
        }
    },

    UpdateLbTime(){
        if(this.time < 0){
            this.time = 0;
            this.isCountTime = false;
            this.ShowRewardBonus();
        }
        this.lbCountTime.string = parseInt(this.time)+"s";
    },

    ShowRewardBonus(){
        this.nodeReward.scale = 0;
        this.nodeReward.active = true;
        var scaleAction = cc.scaleTo(0.2, 0.6); //scale to 0.6 in 0.2s
        this.nodeReward.runAction(scaleAction);
        this.lbReward.string = Global.Helper.formatNumber(parseInt(this.bonusValue));
        
        this.scheduleOnce(()=>{
            this.EndBonus(this.bonusValue)
        } , 2);
    },

    EndBonus(bonusValue) {
        //show wim all bonus
        if(!this.waitEnd )
            return;
        this.waitEnd = false;
        this.lbBonusValue.string = Global.Helper.formatNumber(parseInt(bonusValue));

        this.scheduleOnce(()=>{
            //show result 
            this.callbackBonus();
            this.Hide();
        } , 1.5);
    },

    Hide(){
        this.ResetUI();
        this.waitEnd = false;
        this.listBonus = [];
        this.indexBonus = 0;
        this.time = 0;
        this.isCountTime = false;
        this.bonusValue = 0;
        //this.lbBet.string = "";
        //this.lbTurn.string = "";
        this.node.active = false;
    },

    ResetUI(){
        this.nodeReward.active= false;
        this.nodeTime.active = false;
        this.lbReward.string = "";
        for(let i = 0; i < this.listBtn.length; i++){
            this.listBtn[i].Reset();
        }
    },
});
