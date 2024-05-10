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
        this.sessionID = 0;
    },

    properties: {
        lbSessionID: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameController =  require("AviatorGameController").getIns();
        this.gameController.SetAviatorGameInfo(this);
    },

    start () {

    },

    onNotifyChangePhrase(data)
    {
        let state = parseInt(data.Phrase);
        switch (state) {
            case cc.AviatorPhase.None:               
               
                break;
            case cc.AviatorPhase.Waiting://Cho phien moi           
                break;
        }
        this.sessionID = data.SessionID;
    },
    onUpdateInfo(data)
    {   
        let sessionID = data[0];
        this.setSessionID(sessionID);
        let rawOdd = parseInt(data[2]);
    },

    getSessionID()
    {
        return this.sessionID;
    },

    setSessionID(sessionID)
    {
        this.sessionID = sessionID;
        this.lbSessionID.string = "#"+sessionID;
    }



    // update (dt) {},
});
