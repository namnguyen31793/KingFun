// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       
    },
    start () {
        //Check Sound
        this.sound = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';
        this.music = cc.Tool.getInstance().getItem("@Music").toString() === 'true';
      
        this.AudioController = require("AudioController_V2").getIns();
        this.AudioController.enableSound(this.sound);
        this.AudioController.enableMusic(this.music);
    },

   
    onClick_ChangeSound()
    {
        this.sound = !this.sound;
        cc.Tool.getInstance().setItem("@Sound", this.sound);
        this.AudioController.enableSound(this.sound);
    },

    onClick_ChangeMusic()
    {
        this.music = !this.music;
        cc.Tool.getInstance().setItem("@Music", this.music);
        this.AudioController.enableMusic(this.music);
    },

    onClick_Close()
    {
        require("CHPT_SpinController").getIns().mainView.Destroy_SettingView();
    },

    onClick_HelpBtn()
    {
        require("CHPT_SpinController").getIns().mainView.Create_HelpView();
    },

    onClick_RankBtn()
    {
        require("CHPT_SpinController").getIns().mainView.Create_RankView();
    },

    onClick_HistoryBtn()
    {
        require("CHPT_SpinController").getIns().mainView.Create_HistoryView();
    },
});
