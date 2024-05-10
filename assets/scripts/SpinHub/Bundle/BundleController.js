
cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        var seft = this;
        var model = JSON.parse(cc.NetConfigNew.getInstance().CONFIG_GAME.VersionBundle);

       // if (cc.sys.isNative) {
            this.data =  model;
            console.log(model);
            this.OnCheck();
       // }
    },
    
    OnCheck() {
        console.log("OnCheck");
        if(this.data) {
            Global.listDictionary = this.data.VersionBundle.dic;
            Global.domainUrl = cc.NetConfigNew.getInstance().CONFIG_GAME.domainBundleUrl;
            Global.versionBundle = this.data.VersionBundle.versionVN;

            console.log(Global.versionBundle+"    "+Global.domainUrl);
            console.log(Global.listDictionary);
        }
    },

});
