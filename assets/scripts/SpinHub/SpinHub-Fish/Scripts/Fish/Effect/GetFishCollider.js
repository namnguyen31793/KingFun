cc.Class({
    extends: cc.Component,
    ctor() {
        this.actor = null;
        this.listId = [];
    },

    properties: {
        
    },

    Init(actor) {
        this.actor = actor;
    },

    onCollisionEnter(other , self){
        let fishCollision = other.node.getComponent("Fish");
        if(fishCollision == null || fishCollision.FishProperties == null)
            return;
        if(fishCollision.FishProperties.FishType < 30) {
            this.listId[this.listId.length] = fishCollision.FishProperties.FishId;
        }
    },

    End() {
        return this.listId;
    },
});
