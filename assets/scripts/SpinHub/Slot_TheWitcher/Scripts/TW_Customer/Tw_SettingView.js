// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
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
        require("Tw_SpinController").getIns().mainView.Destroy_SettingView();
    },

    onClick_HelpBtn()
    {
        require("Tw_SpinController").getIns().mainView.Create_HelpView();
    },

    onClick_RankBtn()
    {
        require("Tw_SpinController").getIns().mainView.Create_RankView();
    },

    onClick_HistoryBtn()
    {
        require("Tw_SpinController").getIns().mainView.Create_HistoryView();
    },
});
