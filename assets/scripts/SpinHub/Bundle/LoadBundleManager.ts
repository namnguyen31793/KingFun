
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadBundleManager extends cc.Component {


    _cacheBundle:any={}
    start () {
        Global.LoadBundleManager = this;
    }

    loadBundle(pNameBundle, version){
        return new Promise<any>((resolve, reject)=> {
            // let pathBUndleGame = "https://update.bunca.xyz/bundle/"+ version+"/"+ pNameBundle;
            let pathBUndleGame = cc.NetConfigNew.getInstance().CONFIG_GAME.domainBundleUrl+ version+"/"+ pNameBundle;
           
            if(window['customData'] == undefined) window['customData'] = {}
            if(window['customData']['cacheBundle'] == undefined) window['customData']['cacheBundle'] = {}
                cc.assetManager.loadBundle(pathBUndleGame, {version: ''}, function (err, bundle) {
                    if (!err) {
                        window['customData']['cacheBundle'][pNameBundle] = 1
                        resolve(bundle)

                    }
                    else
                    {
                        resolve(0)
                    }
                }.bind(this))


        })
    }

    async LoadPrefab(bName, version, link, event, isLoading = 0){
        let bundle = null;
        if(this._cacheBundle[bName] == undefined || this._cacheBundle[bName] == 0 )
        {
            bundle = await this.loadBundle(bName, version);
        }
        else
        {
            bundle = cc.assetManager.getBundle(bName);
        }
       
        if(bundle) {
            bundle.load(link, function(count, total) {
                if(isLoading > 0)
                    Global.DownloadManager.UpdatePercentLoad(count/total, isLoading);
            }, function (err, prefab) {
                Global.DownloadManager.callbackLoad = null;
                if(err != null) {
                    console.log(err.toString());
                    return;
                }
                event(prefab);
            }.bind(this));
        }
    }

    async LoadAssest(bName, version, type, link, event, isLoading = 0){
        let bundle = null;
        console.log(this._cacheBundle[bName]);
        if(this._cacheBundle[bName] == undefined || this._cacheBundle[bName] == 0 )
        {
            bundle = await this.loadBundle(bName, version);
        }
        else
        {
            bundle = cc.assetManager.getBundle(bName);
        }
       
        if(bundle) {
            bundle.load(link, type, function(count, total) {
                if(isLoading > 0)
                    Global.DownloadManager.UpdatePercentLoad(count/total, isLoading);
            }, function (err, prefab) {
                Global.DownloadManager.callbackLoad = null;
                event(prefab);
            }.bind(this));
        }
    }

    async LoadScene(bName, version, link, event, isLoading = 0){
        let bundle = null;
        console.log(this._cacheBundle[bName]);
        if(this._cacheBundle[bName] == undefined || this._cacheBundle[bName] == 0 )
        {
            bundle = await this.loadBundle(bName, version);
        }
        else
        {
            bundle = cc.assetManager.getBundle(bName);
        }
       
        if(bundle) {
            bundle.loadScene(link, function(count, total) {
                if(isLoading > 0)
                    Global.DownloadManager.UpdatePercentLoad(count/total, isLoading);
            }, function (err, scene) {
                Global.DownloadManager.callbackLoad = null;
                event(scene);
            }.bind(this));
        }
    }

    // update (dt) {}
}
