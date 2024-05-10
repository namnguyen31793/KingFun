cc.Class({
    extends: cc.Component,
    ctor() {
        this.listName = ["Slot_AnKhe","Slot_DragonFire"];
        this.callbackLoad = null;
     },

    properties: {

    },

    LoadPrefab(bName, link, event, isLoading = 0, callback = null) {
        this.GetVersion(bName);
        this.callbackLoad = callback;
        if (!cc.sys.isNative) {
            cc.assetManager.loadBundle(bName, (err, bundle) => {
                bundle.load(link, function (count, total) {
                    if(isLoading > 0)
                        Global.DownloadManager.UpdatePercentLoad(count/total, isLoading);
                }, function (err, prefab) {
                    event(prefab);
                    this.callbackLoad = null;
                }.bind(this));
            });
		} else {
            Global.LoadBundleManager.LoadPrefab(bName, this.GetVersion(bName), link, event, isLoading);
        }
    },

    LoadScene(bName, link, event, isLoading = 0, callback = null) {
        this.GetVersion(bName);
        this.callbackLoad = callback;
        if (!cc.sys.isNative) {
            cc.assetManager.loadBundle(bName, (err, bundle) => {
                bundle.loadScene(link, function (count, total) {
                    if(isLoading > 0)
                        Global.DownloadManager.UpdatePercentLoad(count/total, isLoading);
                }, function (err, scene) {
                    event(scene);
                    this.callbackLoad = null;
                }.bind(this));
            });
		} else {
            Global.LoadBundleManager.LoadScene(bName, this.GetVersion(bName), link, event, isLoading);
        }
    },

    LoadAssest(bName, type, link, event, isLoading = 0, callback = null) {
        this.GetVersion(bName);
        this.callbackLoad = callback;
        if (!cc.sys.isNative) {
            cc.assetManager.loadBundle(bName, (err, bundle) => {
                bundle.load(link, type, function (count, total) {
                    if(isLoading > 0)
                        Global.DownloadManager.UpdatePercentLoad(count/total, isLoading);
                }, function (err, prefab) {
                    event(prefab);
                    this.callbackLoad = null;
                }.bind(this));
            });
		} else {
            Global.LoadBundleManager.LoadAssest(bName, this.GetVersion(bName), type, link, event, isLoading);
        }
    },

    UpdatePercentLoad(percent, isLoading) {
        if(Global.UIManager)
            Global.UIManager.isCountTime = false;
        // if(isLoading == 1) {
        //     Global.UIManager.loading.UpdateProgress(percent);
        // } else if(isLoading == 2) {
        //     Global.UIManager.miniLoading.UpdateProgress(percent);
        // } else if(isLoading == 3) {
        //     Global.ConfigScene.UpdateProgress(percent);
        // }
        if(this.callbackLoad){
            this.callbackLoad(percent);
        }
    },

    GetVersion(bName) {
        console.log(Global.listDictionary.length);
        for(let i = 0; i < Global.listDictionary.length; i++) {
            if(bName == Global.listDictionary[i].n) {
                return Global.listDictionary[i].v;
            }
        }
        return Global.versionBundle;
    },

    onLoad() {
        Global.DownloadManager = this;
    },

    onDestroy() {
        Global.DownloadManager = null;
    },
});
