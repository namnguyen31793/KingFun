var ActorCollection = cc.Class({
	statics: {
        getIns() {
            if (this.self == null) this.self = new ActorCollection();
            return this.self;
        }
    },

    properties : {
        listActor : [],
        mainActor : null,
    },

    Init() {
        this.listActor = Global.InGameView.listActorView;
    },

    CreateMainActor(mainActorProperties) {
        this.listActor[0].Actor_Init(mainActorProperties, 0);
        return this.listActor[0];
    },

    CreateListActorByActorProperties(listActorProperties, mainActorProperties) {
        for(let i = 0; i < listActorProperties.length; i++)
        {
           this.CreateActorByActorProperties(listActorProperties[i], mainActorProperties);
        }
    },

    CreateActorByActorProperties(otherActorProperties, mainActorProperties) {
        if(Global.InGameManager == null || Global.InGameManager.inBackGround)
         return;
        if(otherActorProperties.AccountId != mainActorProperties.AccountId) {
            let indexActor = this.GetIndexActorBySittingId(otherActorProperties.SittingId, mainActorProperties.SittingId);
            this.listActor[indexActor].Actor_Init(otherActorProperties, indexActor);
        }
    },

    GetIndexActorBySittingId(sittingId, mainActorSittingId) {
        let realDirection = Global.Helper.GetVectorDirectionBySittingID(sittingId);
        let currentDicrection = Global.Helper.GetPositionSliceBySittingId(mainActorSittingId, realDirection);
        if(currentDicrection.x == 1 && currentDicrection.y == 1)
            return 0;
        if(currentDicrection.x == -1 && currentDicrection.y == 1)
            return 1;
        if(currentDicrection.x == -1 && currentDicrection.y == -1)
            return 2;
        if(currentDicrection.x == 1 && currentDicrection.y == -1)
            return 3;
    },

    GetActorByPlayerId(actorId) {
        for(let i = 0; i < this.listActor.length; i++) {
            if(this.listActor[i].actorPropertis && this.listActor[i].actorPropertis.AccountId == actorId)
                return this.listActor[i];
        }
    },

    GetActorBySittingId(sittingId) {
        for(let i = 0; i < this.listActor.length; i++) {
            if(this.listActor[i].actorPropertis && this.listActor[i].actorPropertis.SittingId == sittingId)
                return this.listActor[i];
        }
    },

    RemoveActor(actorId) {
        for(let i = 0; i < this.listActor.length; i++) {
            if(this.listActor[i].actorPropertis && this.listActor[i].actorPropertis.AccountId == actorId) {
                if(this.listActor[i].winSpecial!= null) {
                    this.listActor[i].winSpecial.destroy();
                    this.listActor[i].winSpecial = null;
                }
                this.listActor[i].Remove();
            }
        }
    },

    Dispose(){ 
        for(let i = 0; i < this.listActor.length; i++) {
            this.listActor[i].Dispose();
        }
    },

});
module.exports = ActorCollection;