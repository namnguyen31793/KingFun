var TT_ResponseCode = require('TW_ResponseCode');
var Tw_Freespin_Controller = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new Tw_Freespin_Controller();
                this.self.Setup();
            }
            return this.self;
        }
    },

    properties: {
       
    },

    Setup()
    {
       this.totalFreeturnReward = 0;
       this.freespinRemain = 0;
    },

    FreeSpinController_Setup(roomID,gameID,CurrentRoomConfig,FreespinRemain,packet,isShowTutorial,isTryPlay)
    {
        this.Setup();
        this.roomID = roomID;
        this.gameID = gameID;
        this.CurrentRoomConfig = CurrentRoomConfig;
       
        this.freespinRemain = FreespinRemain;
        
        this.lastMatrix = packet[10];
        this.spinView.setFreeturnNumber_UI(this.freespinRemain);
        this.effectView.SpinEffect_RemainSetup(packet);
        this.spinView.setupTryPlay(isShowTutorial,isTryPlay);
    },

    setIconView(iconView) {
        return this.iconView = iconView;
    },

    getIconView() {
        return this.iconView;
    },

    setSpinView(spinView) {
        return this.spinView  = spinView;
    },

    setEffectView(effectView)
    {
        return this.effectView = effectView;
    },
    setAudioPool(audioPool)
    {
        this.audioPool = audioPool;        
    },

    activeButtonSpin(enable)
    {

    },
    getIsFastSpin()
    {
        // freespin khong co fast spin
        return false;
    },
    Get_LineInfo()
    {
        return '';
    },
    setTutorial(tutorialManager)
    {
        return this.tutorialManager = tutorialManager;
    },

    stopSpinFinish() {
        return this.spinView.stopSpinFinish();
    },
    getLastSpinResponseData()
    {
        return this.spinResponseData;
    },

    Handle_ShowEffect(type, rewardAmount, time)
    {
        this.effectView.node.active = true;
        this.effectView.ShowEffect(type, rewardAmount, time);
    },
    Handle_ResetEffect()
    {
        this.effectView.ResetAllEffect();

    },
    Handle_AutoRespin()
    {
        this.spinView.scheduleOnce(()=>{
            if(this.freespinRemain > 0)
                this.spinView.onClick_Spin();
        },1);   
    },
  
    ServerResponse_Handle_GetSpinResult(packet)
    {
        this.spinResponseData = packet;
        this.spinView.startSpin();
    },

    Handle_AfterSpinAnimation()
    {
        let spinId = this.spinResponseData[1];
        let matrix = this.spinResponseData[2];
        let listLineWinData = this.spinResponseData[3];
        let winNormalValue = this.spinResponseData[4];
        let numberBonusSpin = this.spinResponseData[5];
        let winBonusValue = this.spinResponseData[6];
        let freeSpinLeft = this.spinResponseData[7];
        let valueFreeSpin = this.spinResponseData[8];
        let totalWin = this.spinResponseData[9];
        let _ModelFreeString = this.spinResponseData[10];
        let accountBalance = this.spinResponseData[11];
        let currentJackpotValue = this.spinResponseData[12];
        let isTakeJackpot = this.spinResponseData[13];
        let extandMatrix = this.spinResponseData[14];

        this.totalFreeturnReward += totalWin;
        this.freespinRemain = freeSpinLeft;
        this.spinView.Handle_AfterStopSpin(this.spinResponseData);  
        this.effectView.ShowAnimation_FinishSpin(this.spinResponseData);

        
    },
    GetTryPlayData()
    {   
        if(this.tutorialManager)
            return this.tutorialManager.GetTutorialData();
        return null;
    },

    PlayTutorial(tryPlayData)
    {
        this.ServerResponse_Handle_GetSpinResult(tryPlayData);
    },
    CheckNotEnoughMoney()
    {
       return true;
    },
});
