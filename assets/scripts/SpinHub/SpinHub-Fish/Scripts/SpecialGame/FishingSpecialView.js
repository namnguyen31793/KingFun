cc.Class({
    extends: cc.Component,
    ctor() {
        this.toDoList = null;
        this.isMain = false;
        this.isReady = false;
    },

    properties: {
        
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    show(sittingId) {
        this.isReady = false;
        if(sittingId == Global.GameLogic.mainActor.actorPropertis.SittingId) {
            this.isMain = true;
        } else {
            this.isMain = false;
        }
    },

    onLoad() {
        Global.FishingSpecialView = this;
    },

    onDestroy(){
		Global.FishingSpecialView = null;
	},
});
