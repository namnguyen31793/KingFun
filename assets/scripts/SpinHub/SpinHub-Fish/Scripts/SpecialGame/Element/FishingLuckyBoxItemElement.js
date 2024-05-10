// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nodeImage : cc.Node,
        nodeMoney : cc.Node,
    },

    SetColor(color){
        this.node.color = color;
        if(this.nodeImage)
            this.nodeImage.color = color;
        if(this.nodeMoney)
            this.nodeMoney.color = color;
    },

    SetValueMoney(valueString){
        if(this.nodeMoney)
            this.nodeMoney.getComponent(cc.Label).string = valueString;
    },
});
